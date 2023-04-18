defmodule TrackingStation.Scheduler.Domain do
  defstruct [:node_id, :domain_id, :base_img, :img, gpu_list: []]
end

defmodule TrackingStation.Scheduler.ResourcePool do
  alias TrackingStation.Network
  alias TrackingStation.Storage.LocalStorage
  alias :mnesia, as: Mnesia
  alias TrackingStation.Scheduler.LibvirtConfig
  alias TrackingStation.Libvirt
  import TrackingStation.ClusterStore.NodeInfo
  import TrackingStation.ClusterStore.GPUStatus
  import TrackingStation.ClusterStore.ActiveDomain

  def init() do
    gpu_ids = Application.get_env(:tracking_station, :gpu_ids)
    gpus = Libvirt.valid_gpu_resource(gpu_ids)
    {:ok, cpu_and_mem} = TrackingStation.Libvirt.get_resources()
    IO.inspect({cpu_and_mem, gpus})

    Mnesia.transaction(fn ->
      Mnesia.write(
        node_info(
          node_id: node(),
          cpu_count: cpu_and_mem.cpu_count,
          ram_size: cpu_and_mem.ram_size,
          free_cpu_count: cpu_and_mem.cpu_count,
          free_ram_size: cpu_and_mem.ram_size
        )
      )

      for gpu <- gpus do
        Mnesia.write(
          gpu_status(
            gpu_id: {node(), gpu.id},
            node_id: node(),
            name: gpu.device,
            vram_size: 0,
            bus: gpu.bus,
            slot: gpu.slot,
            function: gpu.function,
            free?: true,
            online?: true
          )
        )
      end
    end)
  end

  defp check_and_allocate(node, %{cpu_count: cpu_count, ram_size: ram_size, gpus: gpus}) do
    # atomic operation that check all the resources are available and allocate them
    # allocate spice port
    {:ok, port} = Network.allocate_spice_port(node)
    # allocate cpu, ram & gpu
    {:atomic, {current_gpus_info, current_node_info}} =
      Mnesia.transaction(fn ->
        current_gpus_info =
          Enum.map(gpus, fn gpu ->
            # there should be exactly one match
            [matched_gpu | []] = Mnesia.match_object(
              gpu_status(
                gpu_id: gpu.gpu_id,
                node_id: node,
                name: gpu.name,
                vram_size: :_,
                bus: gpu.bus,
                slot: gpu.slot,
                function: gpu.function,
                free?: true,
                online?: true
              )
            )
            matched_gpu
          end)

        # there should be existly one match
        [current_node_info | _] =
          Mnesia.match_object(
            node_info(
              node_id: node,
              cpu_count: :_,
              ram_size: :_,
              free_cpu_count: :_,
              free_ram_size: :_
            )
          )

        free_cpu_count = node_info(current_node_info, :free_cpu_count)
        free_ram_size = node_info(current_node_info, :free_ram_size)

        :true = free_cpu_count >= cpu_count and free_ram_size >= ram_size

        Enum.map(current_gpus_info, fn gpu ->
          Mnesia.write(gpu_status(gpu, free?: false))
        end)

        Mnesia.write(
          node_info(current_node_info,
            free_cpu_count: free_cpu_count - cpu_count,
            free_ram_size: free_ram_size - ram_size
          )
        )

        {current_gpus_info, current_node_info}
      end)

    {port, current_gpus_info, current_node_info}
  end

  defp rollback_allocation(node, spice_port, gpus_info, node_info) do
    :ok = Network.free_spice_port(node, spice_port)

    {:atomic, :ok} =
      Mnesia.transaction(fn ->
        Enum.map(gpus_info, fn info ->
          Mnesia.write(info)
        end)

        Mnesia.write(node_info)
      end)

    :ok
  end

  defp register_domain(
         uuid,
         node,
         domain_id,
         cpu_count,
         ram_size,
         disk_path,
         iso_path,
         spice_port,
         spice_password,
         gpus
       ) do
    Mnesia.transaction(fn ->
      Mnesia.write(
        active_domain(
          uuid: uuid,
          node_id: node,
          domain_id: domain_id,
          cpu_count: cpu_count,
          ram_size: ram_size,
          disk_path: disk_path,
          iso_path: iso_path,
          spice_port: spice_port,
          spice_password: spice_password,
          gpus: gpus,
          status: :creating
        )
      )
    end)
  end

  def reclaim_domain(uuid) do
    {:atomic, [domain | []]} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(
          active_domain(
            uuid: uuid,
            node_id: :_,
            domain_id: :_,
            cpu_count: :_,
            ram_size: :_,
            disk_path: :_,
            iso_path: :_,
            spice_port: :_,
            spice_password: :_,
            gpus: :_,
            status: :_
          )
        )
      end)

    # find the domain, first mark it as being deleted.
    {:atomic, :ok} =
      Mnesia.transaction(fn ->
        Mnesia.write(
          active_domain(
            domain,
            status: :destroying
          )
        )
      end)

    node = active_domain(domain, :node_id)
    cpu_used = active_domain(domain, :cpu_count)
    ram_used = active_domain(domain, :ram_size)

    # TODO: handle error
    :ok = free_domain_by_record(node, domain)

    {:atomic, :ok} =
      Mnesia.transaction(fn ->
        Mnesia.delete({:active_domain, uuid})

        active_domain(domain, :gpus)
        |> Enum.map(fn gpu ->
          Mnesia.write(gpu_status(gpu, free?: true))
        end)

        [current_node_info | _] =
          Mnesia.match_object(
            node_info(
              node_id: node,
              cpu_count: :_,
              ram_size: :_,
              free_cpu_count: :_,
              free_ram_size: :_
            )
          )

        free_cpu_count = node_info(current_node_info, :free_cpu_count)
        free_ram_size = node_info(current_node_info, :free_ram_size)

        Mnesia.write(
          node_info(current_node_info,
            free_cpu_count: free_cpu_count + cpu_used,
            free_ram_size: free_ram_size + ram_used
          )
        )
      end)
  end

  defp free_domain_by_record(node, domain_record) when node == node() do
    :ok = Libvirt.destroy_domain(active_domain(domain_record, :domain_id))
    # TODO free disk and iso
  end

  defp free_domain_by_record(node, domain_record) do
    task =
      Task.Supervisor.async(
        {TrackingStation.Scheduler.TaskSupervisor, node},
        TrackingStation.Scheduler.ResourcePool,
        :free_domain_by_record,
        [node, domain_record]
      )

    Task.await(task, 30000)
  end

  def create_vm(node, %{cpu_count: cpu_count, ram_size: ram_size, gpus: gpus} = spec)
      when node == node() do
    {spice_port, old_gpus_info, old_node_info} = check_and_allocate(node, spec)

    disk_path = LocalStorage.allocate_disk()
    iso_path = LocalStorage.get_installation_image()
    disk_config = LibvirtConfig.disk_config(disk_path)
    iso_config = LibvirtConfig.iso_config(iso_path)
    # Be careful It's not a strong password
    random_password = Base.encode64(:rand.bytes(6))
    spice_config = LibvirtConfig.spice_config(spice_port, random_password)

    gpu_passthrough =
      gpus
      |> Enum.map(fn %{bus: bus, slot: slot, function: function} ->
        LibvirtConfig.gpu_passthrough(bus, slot, function)
      end)
      |> Enum.join("\n")

    uuid = UUID.uuid1()

    xml_config =
      LibvirtConfig.base_config(
        uuid,
        uuid,
        cpu_count,
        ram_size,
        disk_config,
        iso_config,
        spice_config,
        gpu_passthrough
      )

    case Libvirt.create_vm_from_xml(xml_config) do
      {:ok, domain_id} ->
        # register domain here
        {:atomic, :ok} =
          register_domain(
            uuid,
            node,
            domain_id,
            cpu_count,
            ram_size,
            disk_path,
            iso_path,
            spice_port,
            random_password,
            gpus
          )

        {:ok, uuid}

      {:error, reason} ->
        # handle side-effects
        # clean up mnesia here
        :ok = rollback_allocation(node, spice_port, old_gpus_info, old_node_info)
        raise "Fatal: Failed to create vm through libvirt, reason: #{reason}"
    end
  end

  def create_vm(node, resources) when node != node() do
    task =
      Task.Supervisor.async(
        {TrackingStation.Scheduler.TaskSupervisor, node},
        TrackingStation.Scheduler.ResourcePool,
        :create_vm,
        [node, resources]
      )

    Task.await(task, 30000)
  end

  def lookup_resource(%{
        cpu_count: cpu_count,
        ram_size: ram_size,
        gpu_count: gpu_count,
        gpu: %{name: name, vram_size: vram_size}
      }) do
    match_head =
      gpu_status(
        gpu_id: :_,
        node_id: :"$1",
        name: :"$2",
        vram_size: :"$3",
        bus: :_,
        slot: :_,
        function: :_,
        free?: :"$4",
        online?: :"$5"
      )

    guard = [{:>=, :"$3", vram_size}, {:==, :"$4", true}, {:==, :"$5", true}]

    guard =
      if name == nil or name == :_ do
        guard
      else
        [{:==, :"$2", name} | guard]
      end

    result = [:"$_"]

    {:atomic, query_result} =
      Mnesia.transaction(fn ->
        available_gpus =
          Mnesia.select(:gpu_status, [
            {
              match_head,
              guard,
              result
            }
          ])
          |> Enum.map(fn gpu ->
            gpu |> gpu_status() |> Enum.into(%{})
          end)

        available_gpus
        |> Enum.group_by(&Map.get(&1, :node_id))
        |> Enum.filter(fn {_node, gpus} -> length(gpus) >= gpu_count end)
        |> Enum.map(fn {node, gpus} ->
          [matched_node_info | []] =
            Mnesia.match_object(
              node_info(
                node_id: node,
                cpu_count: :_,
                ram_size: :_,
                free_cpu_count: :_,
                free_ram_size: :_
              )
            )

          {node, gpus, matched_node_info}
        end)
      end)

    query_result
    |> Enum.filter(fn {_node, _gpus, matched_node_info} ->
      free_cpu_count = node_info(matched_node_info, :free_cpu_count)
      free_ram_size = node_info(matched_node_info, :free_ram_size)

      free_cpu_count >= cpu_count and free_ram_size >= ram_size
    end)
    |> Enum.map(fn {_node, gpus, matched_node_info} ->
      matched_node_info
      |> node_info()
      |> Enum.into(%{})
      |> Map.put(:gpus, gpus)
    end)
  end
end
