defmodule TrackingStation.Scheduler.Domain do
  defstruct [:node_id, :domain_id, :base_img, :img, gpu_list: []]
end

defmodule TrackingStation.Scheduler.ResourcePool do
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
    Mnesia.transaction(fn ->
      current_gpus_info =
        Enum.map(gpus, fn gpu ->
          Mnesia.match_object(
            gpu_status(
              gpu_id: {node, gpu.id},
              node_id: node,
              name: gpu.device,
              vram_size: :_,
              bus: gpu.bus,
              slot: gpu.slot,
              function: gpu.function,
              free?: true,
              online?: true
            )
          )
        end)

      gpus_ok? = Enum.all?(current_gpus_info, fn matched_gpu -> length(matched_gpu) == 1 end)

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

      node_ok? = free_cpu_count >= cpu_count and free_ram_size >= ram_size

      if(gpus_ok? and node_ok?) do
        Enum.map(current_gpus_info, fn info ->
          Mnesia.write(gpu_status(info, free?: false))
        end)

        Mnesia.write(
          node_info(current_node_info,
            free_cpu_count: free_cpu_count - cpu_count,
            free_ram_size: free_ram_size - ram_size
          )
        )

        {:ok, {current_gpus_info, current_node_info}}
      else
        {:error, :resource_not_available}
      end
    end)
  end

  defp rollback_allocation(gpus_info, node_info) do
    Mnesia.transaction(fn ->
      Enum.map(gpus_info, fn info ->
        Mnesia.write(info)
      end)

      Mnesia.write(node_info)
    end)
  end

  defp register_domain(uuid, node, domain_id, disk_path, iso_path, gpus) do
    Mnesia.transaction(fn ->
      Mnesia.write(
        active_domain(
          uuid: uuid,
          node_id: node,
          domain_id: domain_id,
          disk_path: disk_path,
          iso_path: iso_path,
          gpus: gpus,
          status: :creating
        )
      )
    end)
  end

  defp reclaim_domain(uuid) do
    domains =
      Mnesia.transaction(fn ->
        Mnesia.match_object(
          active_domain(
            uuid: uuid,
            node_id: :_,
            domain_id: :_,
            disk_path: :_,
            iso_path: :_,
            gpus: :_,
            status: :_
          )
        )
      end)

    case domains do
      [record | []] ->
        # find the domain, first mark it as being deleted.
        {:atomic, :ok} =
          Mnesia.transaction(fn ->
            Mnesia.write(
              active_domain(
                record,
                status: :destroying
              )
            )
          end)

        node = active_domain(record, :node_id)
        cpu_used = active_domain(record, :cpu_count)
        ram_used = active_domain(record, :ram_size)
        free_domain_by_record(node, record)

        {:atomic, :ok} =
          Mnesia.transaction(fn ->
            Mnesia.delete(
              :active_domain,
              uuid
            )

            active_domain(record, :gpus)
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

      _ ->
        {:error, "no such domain"}
    end
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
    {:atomic, {:ok, {old_gpus_info, old_node_info}}} = check_and_allocate(node, spec)

    disk_path = LocalStorage.allocate_disk()
    iso_path = LocalStorage.get_installation_image()
    disk_config = LibvirtConfig.disk_config(disk_path)
    iso_config = LibvirtConfig.iso_config(iso_path)

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
        gpu_passthrough
      )

    case Libvirt.create_vm_from_xml(xml_config) do
      {:ok, domain_id} ->
        # register domain here
        case register_domain(uuid, node, domain_id, disk_path, iso_path, gpus) do
          {:atomic, :ok} ->
            {:ok, uuid}

          error ->
            :ok = Libvirt.destroy_domain(domain_id)
            rollback_allocation(old_gpus_info, old_node_info)
            error
        end

        {:ok, domain_id}

      {:error, reason} ->
        # clean up mnesia here
        {:atomic, :ok} = rollback_allocation(old_gpus_info, old_node_info)
        {:error, reason}
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

  def lookup_resource(resource_req) do
    alive_nodes = Node.list()

    query_node_match_head = %{
      node_id: :"$1",
      cpu_count: :"$2",
      ram_size: :"$3"
    }

    query_node_guard = [
      {:>=, :"$2", resource_req.cpu_count},
      {:>=, :"$2", resource_req.ram_size}
    ]

    query_node_guard =
      if resource_req.node_id != nil do
        [query_node_guard | {:==, :"$1", resource_req.node_id}]
      else
        query_node_guard
      end

    query_node_result = [:"$1"]

    query_gpu_match_head = %{
      node_id: :"$1",
      name: :"$2",
      vram_size: :"$3",
      free?: :"$4",
      online?: :"$5"
    }

    query_gpu_guard = [
      {:>=, :"$3", resource_req.cpu_count},
      {:==, :"$4", true},
      {:==, :"$5", true}
    ]

    query_gpu_guard =
      if resource_req.gpu_name != nil do
        [query_gpu_guard | {:==, :"$2", resource_req.gpu_name}]
      else
        query_gpu_guard
      end

    query_gpu_result = [:"$1", :"$2", :"$3"]

    case Mnesia.transaction(fn ->
           available_nodes =
             Mnesia.select(Scheduler.ResourcePool, [
               query_node_match_head,
               query_node_guard,
               query_node_result
             ])

           available_gpus =
             Mnesia.select(Scheduler.GPUStatus, [
               query_gpu_match_head,
               query_gpu_guard,
               query_gpu_result
             ])

           {available_nodes, available_gpus}
         end) do
      {:atomic, {available_nodes, available_gpus}} -> []
      _ -> []
    end
  end
end
