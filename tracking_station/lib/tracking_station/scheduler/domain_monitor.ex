defmodule TrackingStation.Scheduler.DomainMonitor do
  @moduledoc """
  TrackingStation.Scheduler.DomainMonitor manages
  the life time of the domain, it keeps monitoring the domain
  and handles requests related to this domain (e.g. shutdown the domain)
  """
  use GenServer, restart: :temporary
  require Logger
  import TrackingStation.ClusterStore.ActiveDomain
  import TrackingStation.ClusterStore.GPUStatus
  import TrackingStation.ClusterStore.NodeInfo
  alias :mnesia, as: Mnesia
  alias TrackingStation.Network
  alias TrackingStation.Libvirt
  alias TrackingStation.Storage.LocalStorage
  alias TrackingStation.Scheduler.LibvirtConfig

  ### ----- client api -----
  def start_link({spec, user_id, domain_uuid}) do
    GenServer.start_link(__MODULE__, {spec, user_id, domain_uuid},
      name:
        {:via, Registry, {TrackingStation.Scheduler.DomainMonitorRegistry, domain_uuid, user_id}}
    )
  end

  def shutdown(_domain_uuid) do
    # gracefully shutdown this vm
  end

  def destroy(domain_uuid, user_id) do
    case Registry.lookup(TrackingStation.Scheduler.DomainMonitorRegistry, domain_uuid) do
      [{pid, ^user_id}] ->
        GenServer.call(pid, :destroy, 30000)
        :ok

      [{_pid, _}] ->
        {:error, :permission_denied}

      [] ->
        {:error, :not_exist}
    end
  end

  def get_info(domain_uuid, user_id) do
    case Registry.lookup(TrackingStation.Scheduler.DomainMonitorRegistry, domain_uuid) do
      [{pid, ^user_id}] -> {:ok, GenServer.call(pid, :info)}
      [{_pid, _}] -> {:error, :permission_denied}
      [] -> {:error, :not_exist}
    end
  end

  def snapshot(domain_uuid, user_id, overlay_name) do
    case Registry.lookup(TrackingStation.Scheduler.DomainMonitorRegistry, domain_uuid) do
      [{pid, ^user_id}] -> {:ok, GenServer.call(pid, {:snapshot, overlay_name})}
      [{_pid, _}] -> {:error, :permission_denied}
      [] -> {:error, :not_exist}
    end
  end

  # -------------------------

  @impl true
  def init({%{image_id: image_id} = spec, user_id, domain_uuid}) do
    {dataset, name} = LocalStorage.path_from_guid(image_id)
    :ok = LocalStorage.prepare_image(dataset, name)
    {port, current_gpus_info} = check_and_allocate(spec, user_id, domain_uuid)

    {:ok,
     %{
       domain_uuid: domain_uuid,
       domain_id: nil,
       running_disk_id: nil,
       status: :creating,
       password: "",
       spec: Map.replace!(spec, :gpus, current_gpus_info),
       port: port
     }}
  end

  defp check_and_allocate(
         %{cpu_count: cpu_count, ram_size: ram_size, gpus: gpus},
         user_id,
         domain_uuid
       ) do
    node = node()
    # atomic operation that check all the resources are available and allocate them
    # allocate spice port
    {:ok, port} = Network.allocate_spice_port()
    # allocate cpu, ram & gpu
    {:atomic, current_gpus_info} =
      Mnesia.transaction(fn ->
        current_gpus_info =
          Enum.map(gpus, fn gpu ->
            # there should be one and exactly one match
            [matched_gpu | []] =
              Mnesia.match_object(
                gpu_status(
                  gpu_id: gpu.gpu_id,
                  free: true,
                  online: true
                )
              )

            matched_gpu
          end)

        # there should be existly one match
        [current_node_info | _] = Mnesia.match_object(node_info(node_id: node))

        free_cpu_count = node_info(current_node_info, :free_cpu_count)
        free_ram_size = node_info(current_node_info, :free_ram_size)

        true = free_cpu_count >= cpu_count and free_ram_size >= ram_size

        Enum.map(current_gpus_info, fn gpu ->
          Mnesia.write(gpu_status(gpu, free: false, domain_uuid: domain_uuid))
        end)

        Mnesia.write(
          node_info(current_node_info,
            free_cpu_count: free_cpu_count - cpu_count,
            free_ram_size: free_ram_size - ram_size
          )
        )

        Mnesia.write(
          active_domain(
            uuid: domain_uuid,
            node_id: node(),
            user_id: user_id
          )
        )

        current_gpus_info
      end)

    {port, current_gpus_info}
  end

  @impl true
  def terminate(:normal, %{
        domain_uuid: domain_uuid,
        domain_id: domain_id,
        running_disk_id: running_disk_id,
        spec: spec,
        port: port
      }) do
    Logger.info("#{domain_uuid} shuting down")
    %{cpu_count: cpu_count, ram_size: ram_size, gpus: gpus} = spec

    if domain_id != nil do
      case Libvirt.destroy_domain(domain_id) do
        :ok ->
          :ok

        {:error, :no_domain} ->
          Logger.warning("domain #{domain_id} is already destroyed for unknown reason")
          # the domain is already destroyed
          :ok

        {:error, reason} ->
          raise "Fatal: failed to destroy domain, reason: #{reason}"
      end
    end

    if running_disk_id != nil do
      TrackingStation.Storage.LocalStorage.reclaim_running(running_disk_id)
    end

    :ok = Network.free_spice_port(port)

    {:atomic, :ok} =
      Mnesia.transaction(fn ->
        Mnesia.delete({:active_domain, domain_uuid})

        gpus
        |> Enum.map(fn record ->
          Mnesia.write(gpu_status(record, free: true, domain_uuid: ""))
        end)

        [current_node_info | _] = Mnesia.match_object(node_info(node_id: node()))

        free_cpu_count = node_info(current_node_info, :free_cpu_count)
        free_ram_size = node_info(current_node_info, :free_ram_size)

        Mnesia.write(
          node_info(current_node_info,
            free_cpu_count: free_cpu_count + cpu_count,
            free_ram_size: free_ram_size + ram_size
          )
        )
      end)
  end

  @impl true
  def terminate(reason, spec) do
    Logger.warning("unexpected stop reason #{inspect(reason)} try to stop normally")
    terminate(:normal, spec)
  end

  defp poll_domain_info(%{domain_id: domain_id, status: :creating} = state) do
    case Libvirt.poll_domain_stats(domain_id) do
      {:ok, stats} ->
        IO.inspect(stats)
        Process.send_after(self(), :poll, :timer.seconds(10))
        {:noreply, Map.replace!(state, :status, :running)}

      {:error, :no_domain} ->
        # the domain is down, reclaim it's resources
        IO.puts("The vm has been shutdown")
        {:stop, :normal, state}

      {:error, reason} ->
        # abnormal exit
        IO.inspect(reason)
        {:stop, :normal, state}
    end
  end

  defp poll_domain_info(%{domain_id: domain_id, status: :running} = state) do
    case Libvirt.poll_domain_stats(domain_id) do
      {:ok, stats} ->
        IO.inspect(stats)
        Process.send_after(self(), :poll, :timer.minutes(3))
        {:noreply, state}

      {:error, :no_domain} ->
        # the domain is down, reclaim it's resources
        IO.puts("The vm has been shutdown")
        {:stop, :normal, state}

      {:error, reason} ->
        # abnormal exit
        IO.inspect(reason)
        {:stop, :normal, state}
    end
  end

  ### ----- handle_call -----
  @impl true
  def handle_call(:destroy, _from, state) do
    # simple stop this GenServer, terminate/2 will then do the dirty work
    {:stop, :normal, :ok, state}
  end

  @impl true
  def handle_call(:info, _from, state) do
    # reply the client with the current state
    {:reply, state, state}
  end

  @impl true
  def handle_call({:snapshot, name}, _from, %{running_disk_id: running_disk_id} = state) do
    :ok = LocalStorage.make_overlay(running_disk_id, name)
    {:reply, :ok, state}
  end

  ### ----- handle_info -----
  @impl true
  def handle_cast(
        {:image_ready, dataset, name},
        %{
          domain_uuid: domain_uuid,
          port: spice_port,
          spec: spec
        } = state
      ) do
    %{cpu_count: cpu_count, ram_size: ram_size, gpus: gpus} = spec
    iso_path = LocalStorage.get_installation_image()
    iso_config = LibvirtConfig.iso_config(iso_path)

    Logger.warning("image ready: #{dataset} #{name}")
    disk_id = LocalStorage.create_running(dataset, name)
    Logger.warning("running: #{disk_id}")
    disk_path = "/dev/zvol/rpool/running/#{disk_id}"
    disk_config = LibvirtConfig.disk_config(disk_path)
    # Be careful It's not a strong password
    random_password = Base.encode64(:rand.bytes(6))
    spice_config = LibvirtConfig.spice_config(spice_port, random_password)

    gpu_passthrough =
      gpus
      |> Enum.map(fn record ->
        bus = gpu_status(record, :bus)
        slot = gpu_status(record, :slot)
        function = gpu_status(record, :function)
        LibvirtConfig.gpu_passthrough(bus, slot, function)
      end)
      |> Enum.join("\n")

    xml_config =
      LibvirtConfig.base_config(
        domain_uuid,
        domain_uuid,
        cpu_count,
        ram_size,
        disk_config,
        iso_config,
        spice_config,
        gpu_passthrough
      )

    case Libvirt.create_vm_from_xml(xml_config) do
      {:ok, domain_id} ->
        {:noreply,
         %{
           state
           | running_disk_id: disk_id,
             domain_id: domain_id,
             status: :booting,
             password: random_password
         }}

      {:error, reason} ->
        # handle side-effects
        # clean up mnesia here
        Logger.warning("failed to create vm, reason: #{inspect(reason)}")
        {:stop, :normal, state}
    end
  end

  @impl true
  def handle_info(:poll, state) do
    poll_domain_info(state)
  end
end
