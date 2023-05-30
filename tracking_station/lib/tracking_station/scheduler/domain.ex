defmodule TrackingStation.Scheduler.Domain do
  @moduledoc """
  TrackingStation.Scheduler.Domain manages
  the life time of the domain, it keeps monitoring the domain
  and handles requests related to this domain (e.g. shutdown the domain)
  the lifetime a domain
  creating -> booting -> running -> destroying
  """
  use GenServer, restart: :transient
  require Logger
  import TrackingStation.ClusterStore.ActiveDomain
  import TrackingStation.ClusterStore.GPUStatus
  import TrackingStation.ClusterStore.NodeInfo
  alias :mnesia, as: Mnesia
  alias NimbleCSV.RFC4180, as: CSV
  alias TrackingStation.Network
  alias TrackingStation.Libvirt
  alias TrackingStation.Storage.LocalStorage
  alias TrackingStation.Scheduler.LibvirtConfig
  alias TrackingStation.Scheduler.TaskSupervisor

  @poll_interval 30_000

  ### ----- client api -----
  def start_link({spec, user_id, domain_uuid}) do
    case GenServer.start_link(__MODULE__, {spec, user_id, domain_uuid}) do
      {:ok, pid} ->
        Mnesia.transaction(fn ->
          [dom] = Mnesia.match_object(active_domain(uuid: domain_uuid))
          Mnesia.write(active_domain(dom, pid: pid))
        end)

        {:ok, pid}

      result ->
        result
    end
  end

  defp find_pid(domain_uuid, user_id) do
    {:atomic, result} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(active_domain(uuid: domain_uuid))
      end)

    case result do
      [{:active_domain, _uuid, _node_id, pid, ^user_id}] ->
        {:ok, pid}

      [{:active_domain, _uuid, _node_id, _pid, _user_id}] ->
        {:error, :permission_denied}

      [] ->
        {:error, :not_exist}
    end
  end

  @doc """
  Control the power of this domain,
  operation can be :start, :shutdown, :reset or :reboot
  """
  def power_control(domain_uuid, user_id, operation) do
    case find_pid(domain_uuid, user_id) do
      {:ok, pid} ->
        GenServer.call(pid, {:power_control, operation}, 30000)
        {:ok, :done}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def destroy(domain_uuid, user_id) do
    case find_pid(domain_uuid, user_id) do
      {:ok, pid} ->
        GenServer.call(pid, :destroy, 30000)
        {:ok, :destroyed}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp get_extra_info(domain_id) do
    Task.await_many([
      get_network_info(domain_id),
      get_ram_stat(domain_id),
      get_gpu_stat(domain_id),
      get_cpu_stat(domain_id)
    ])
    |> then(fn [interfaces, ram_stat, gpu_stat, cpu_stat] ->
      %{
        interfaces: interfaces,
        ram_stat: ram_stat,
        gpu_stat: gpu_stat,
        cpu_stat: cpu_stat
      }
    end)
  end

  defp read_info_from_ets(node, domain_uuid) when node == node() do
    [{_, res}] = :ets.lookup(:domain_res, domain_uuid)

    res =
      if res.status == :running do
        # TODO don't query this by default
        extra_info =
          get_extra_info(res.domain_id)
          |> Map.update!(:cpu_stat, fn cpu_util ->
            (cpu_util / res.spec.cpu_count)
            |> min(1.0)
            |> max(0.0)
          end)

        Map.merge(res, extra_info)
      else
        res
      end

    {:ok, res}
  end

  defp read_info_from_ets(node, domain_uuid) do
    task =
      Task.Supervisor.async({TaskSupervisor, node}, fn ->
        read_info_from_ets(
          node,
          domain_uuid
        )
      end)

    Task.await(task)
  end

  def get_info(domain_uuid, user_id) do
    case find_pid(domain_uuid, user_id) do
      {:ok, pid} ->
        read_info_from_ets(node(pid), domain_uuid)

      {:error, reason} ->
        {:error, reason}
    end
  end

  def snapshot(domain_uuid, user_id, overlay_name) do
    case find_pid(domain_uuid, user_id) do
      {:ok, pid} ->
        {:ok, GenServer.call(pid, {:snapshot, overlay_name})}

      {:error, reason} ->
        {:error, reason}
    end
  end

  # -------------------------

  @impl true
  def init({%{image_id: image_id} = spec, user_id, domain_uuid}) do
    case :ets.lookup(:domain_res, domain_uuid) do
      [] ->
        {dataset, name} = LocalStorage.path_from_guid(image_id)

        {port, current_node_info, current_gpus_info} =
          check_and_allocate(spec, user_id, domain_uuid)

        transfer_task =
          Task.Supervisor.async_nolink(
            TrackingStation.Storage.LocalTaskSupervisor,
            LocalStorage,
            :prepare_image,
            [
              dataset,
              name
            ]
          )

        true =
          :ets.insert_new(
            :domain_res,
            {domain_uuid,
             %{
               domain_uuid: domain_uuid,
               domain_id: nil,
               image_dataset: dataset,
               image_name: name,
               running_disk_id: nil,
               status: :creating,
               password: "",
               spec: Map.replace!(spec, :gpus, current_gpus_info),
               port: port,
               host_ipv4_addr: node_info(current_node_info, :ipv4_addr),
               host_ipv6_addr: node_info(current_node_info, :ipv6_addr)
             }}
          )

        {:ok,
         %{
           domain_uuid: domain_uuid,
           domain_id: nil,
           status: :creating,
           transfer_task_ref: transfer_task.ref
         }}

      [{_, res}] ->
        Logger.warning("restoring from crashed domain")

        if res.status == :creating do
          {dataset, name} = LocalStorage.path_from_guid(image_id)

          transfer_task =
            Task.Supervisor.async_nolink(
              TrackingStation.Storage.LocalTaskSupervisor,
              LocalStorage,
              :prepare_image,
              [
                dataset,
                name
              ]
            )

          Process.send_after(self(), :poll, 30_000)

          {:ok,
           %{
             domain_uuid: domain_uuid,
             domain_id: res.domain_id,
             status: res.status,
             transfer_task_ref: transfer_task.ref
           }}
        else
          {:ok,
           %{
             domain_uuid: domain_uuid,
             domain_id: res.domain_id,
             status: res.status
           }}
        end
    end
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
    allocate_operation =
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
        [current_node_info] = Mnesia.match_object(node_info(node_id: node))

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

        {current_node_info, current_gpus_info}
      end)

    case allocate_operation do
      {:atomic, {current_node_info, current_gpus_info}} ->
        current_gpus_info =
          current_gpus_info
          |> Enum.map(
            &(gpu_status(&1)
              |> Enum.into(%{})
              |> Map.take([:gpu_id, :name, :vram_size, :bus, :slot, :function]))
          )

        {port, current_node_info, current_gpus_info}

      error ->
        # remember to free the spice port we just allocated
        Network.free_spice_port(port)
        raise "Failed to allocate resource, reason: #{inspect(error)}"
    end
  end

  def release_resources(domain_uuid, %{
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
        |> Enum.map(&Mnesia.match_object(gpu_status(gpu_id: &1.gpu_id)))
        |> Enum.map(fn [record] ->
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
  def terminate(:normal, %{domain_uuid: domain_uuid}) do
    [{_, res}] = :ets.lookup(:domain_res, domain_uuid)
    release_resources(domain_uuid, res)
  end

  def execute_command(domain_id, cmd, args, parser \\ fn x -> x end, interval \\ 100) do
    Task.Supervisor.async(TaskSupervisor, fn ->
      pid = Libvirt.guest_exec(domain_id, cmd, args)

      output =
        Enum.reduce_while(1..10, nil, fn _i, _acc ->
          response = Libvirt.guest_exec_status(domain_id, pid)

          case response do
            %{output: nil} ->
              Process.sleep(interval)
              {:cont, nil}

            %{output: output} ->
              {:halt, output}
          end
        end)

      output |> parser.()
    end)
  end

  def get_ram_stat(domain_id) do
    parser = fn output ->
      output
      |> String.split("\n", trim: true)
      # fetch the Mem: line,
      |> Enum.fetch!(1)
      |> String.split()
      # drop the Mem: header
      |> Enum.drop(1)
      |> Enum.map(&String.to_integer/1)
      |> then(fn [total, used, free, shared, buffers, cache, available] ->
        %{
          total: total,
          used: used,
          free: free,
          shared: shared,
          buffers: buffers,
          cache: cache,
          available: available
        }
      end)
    end

    execute_command(domain_id, "free", ["-bw"], parser)
  end

  def get_ip_addr(domain_id) do
    parser = fn output ->
      output
      |> Jason.decode!()
      |> Enum.fetch!(0)
      |> Map.fetch!("prefsrc")
    end

    execute_command(domain_id, "ip", ~w(--json route show default), parser)
  end

  def get_network_info(domain_id) do
    execute_command(domain_id, "ip", ["--json", "-br", "addr"], &Jason.decode!/1)
  end

  def get_gpu_stat(domain_id) do
    parser = fn output ->
      output
      |> String.trim()
      |> CSV.parse_string()
      # nvidia-smi uses a non-standard csv that has a space character after each comma
      |> Enum.map(fn line ->
        Enum.map(line, &String.trim/1)
      end)
      |> Enum.map(fn [index, name, driver_version, temperature, gpu_usage, vram_size, used_vram] ->
        %{
          index: index,
          name: name,
          driver_version: driver_version,
          temperature: String.to_integer(temperature),
          # gpu_usage and mem usage are "num %"
          gpu_usage: String.to_integer(gpu_usage) / 100.0,
          vram_size: vram_size |> String.to_integer(),
          vram_used: used_vram |> String.to_integer()
        }
      end)
    end

    execute_command(
      domain_id,
      "nvidia-smi",
      [
        "--query-gpu=index,name,driver_version,temperature.gpu,utilization.gpu,memory.total,memory.used",
        "--format=csv,nounits"
      ],
      parser
    )
  end

  def get_cpu_stat(domain_id, interval \\ 100) do
    Task.Supervisor.async(TaskSupervisor, fn ->
      first_measure = Libvirt.get_cpu_time(domain_id)
      now = Time.utc_now()
      Process.sleep(interval)
      second_measure = Libvirt.get_cpu_time(domain_id)
      duration = Time.diff(Time.utc_now(), now, :nanosecond)

      (second_measure - first_measure) / duration
    end)
  end

  ### ----- handle_call -----
  @impl true
  def handle_call({:power_control, operation}, _from, %{domain_id: domain_id} = state) do
    apply(Libvirt, operation, [domain_id])
    {:reply, :ok, state}
  end

  @impl true
  def handle_call(:destroy, _from, state) do
    # simple stop this GenServer, terminate/2 will then do the dirty work
    {:stop, :normal, :ok, state}
  end

  @impl true
  def handle_call(:info, _from, %{domain_uuid: domain_uuid} = state) do
    # reply the client with the current state
    [{_, res}] = :ets.lookup(:domain_res, domain_uuid)
    {:reply, res, state}
  end

  @impl true
  def handle_call({:snapshot, name}, _from, %{domain_uuid: domain_uuid} = state) do
    [{_, res}] = :ets.lookup(:domain_res, domain_uuid)
    :ok = LocalStorage.make_overlay(res.running_disk_id, name)
    {:reply, :ok, state}
  end

  ### ----- handle_info -----

  @impl true
  def handle_info(
        {ref, :ok},
        %{domain_uuid: domain_uuid, transfer_task_ref: transfer_task_ref} = state
      )
      when transfer_task_ref == ref do
    # ignore DOWN message
    Process.demonitor(ref, [:flush])
    [{_, res}] = :ets.lookup(:domain_res, domain_uuid)
    %{image_dataset: dataset, image_name: name, spec: spec, port: spice_port} = res
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
      |> Enum.map(&LibvirtConfig.gpu_passthrough(&1.bus, &1.slot, &1.function))
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
        :ets.insert(
          :domain_res,
          {domain_uuid,
           %{
             res
             | password: random_password,
               status: :booting,
               running_disk_id: disk_id,
               domain_id: domain_id
           }}
        )

        Process.send_after(self(), :poll, 30_000)

        {:noreply, %{state | status: :booting, domain_id: domain_id}}

      {:error, reason} ->
        # handle side-effects
        # clean up mnesia here
        Logger.warning("failed to create vm, reason: #{inspect(reason)}")
        {:stop, :normal, state}
    end
  end

  @impl true
  def handle_info(:poll, %{domain_id: domain_id, status: :booting} = state) do
    if Map.has_key?(state, :poll_task) do
      Logger.warning("poll task timeout")
      Task.shutdown(state.poll_task, :brutal_kill)
    end

    poll_task =
      Task.Supervisor.async_nolink(TaskSupervisor, fn ->
        get_ip_addr(domain_id) |> Task.await()
      end)

    Process.send_after(self(), :poll, @poll_interval)
    {:noreply, Map.put(state, :poll_task, poll_task)}
  end

  def handle_info(:poll, %{domain_id: domain_id, status: :running} = state) do
    if Map.has_key?(state, :poll_task) do
      Logger.warning("poll task timeout")
      Task.shutdown(state.poll_task, :brutal_kill)
    end

    poll_task =
      Task.Supervisor.async_nolink(TaskSupervisor, fn ->
        get_extra_info(domain_id)
      end)

    Process.send_after(self(), :poll, @poll_interval)
    {:noreply, Map.put(state, :poll_task, poll_task)}
  end

  # The transfer task failed
  @impl true
  def handle_info(
        {:DOWN, ref, :process, _pid, reason},
        %{transfer_task_ref: transfer_task_ref} = state
      )
      when ref == transfer_task_ref do
    Logger.warning("failed to transfer image: #{inspect(reason)}")
    # Log and possibly restart the task...
    {:stop, :no_image, state}
  end

  # The poll complete
  @impl true
  def handle_info(
        {ref, _result},
        %{domain_uuid: domain_uuid, status: :booting, poll_task: poll_task} = state
      )
      when ref == poll_task.ref do
    Process.demonitor(ref, [:flush])
    [{_, res}] = :ets.lookup(:domain_res, domain_uuid)
    :ets.insert(:domain_res, {domain_uuid, %{res | status: :running}})

    state = state |> Map.delete(:poll_task) |> Map.put(:status, :running)
    {:noreply, state}
  end

  # The poll complete
  @impl true
  def handle_info(
        {ref, result},
        %{status: :running, poll_task: poll_task} = state
      )
      when ref == poll_task.ref do
    Process.demonitor(ref, [:flush])
    # do nothing for now
    # TODO notify user when gpu_usage is low
    Logger.info("poll result #{inspect(result)}")
    state = state |> Map.delete(:poll_task)
    {:noreply, state}
  end

  # The poll failed
  @impl true
  def handle_info(
        {:DOWN, ref, :process, _pid, _reason},
        %{status: :booting, poll_task: poll_task} = state
      )
      when ref == poll_task.ref do
    # do nothing, this vm is still booting
    {:noreply, Map.delete(state, :poll_task)}
  end

  # The poll failed
  @impl true
  def handle_info(
        {:DOWN, ref, :process, _pid, _reason},
        %{status: :running, poll_task: poll_task} = state
      )
      when ref == poll_task.ref do
    Logger.warning("failed to poll a vm that is running")
    # do nothing for now
    {:noreply, Map.delete(state, :poll_task)}
  end
end
