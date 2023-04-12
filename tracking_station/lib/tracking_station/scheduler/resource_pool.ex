defmodule TrackingStation.Scheduler.GPUSpec do
  defstruct [:gpu_id, :name, :vram_size]
end

defmodule TrackingStation.Scheduler.ResourceSpec do
  defstruct [:cpu_count, :ram_size, gpu_count: 0, gpu_list: []]
end

defmodule TrackingStation.Scheduler.ResourceRequest do
  defstruct node_id: nil, cpu_count: 0, ram_size: 0, gpu_name: 0, vram_size: 0, gpu_count: 0
end

defmodule TrackingStation.Scheduler.Domain do
  defstruct [:node_id, :domain_id, :base_img, :img, gpu_count: 0, gpu_list: []]
end

defmodule TrackingStation.Scheduler.ResourcePool do
  alias TrackingStation.Storage.LocalStorage
  alias :mnesia, as: Mnesia
  alias TrackingStation.Scheduler.LibvirtConfig
  alias TrackingStation.Scheduler.ResourceSpec
  alias TrackingStation.Libvirt

  def init() do
    gpu_ids = Application.get_env(:tracking_station, :gpu_ids)
    valid_gpu_ids = Libvirt.valid_gpu_resource(gpu_ids)
    IO.inspect(gpu_ids)
    IO.inspect(valid_gpu_ids)
    cpu_and_mem = TrackingStation.Libvirt.get_resources()
    {cpu_and_mem, valid_gpu_ids}
  end

  def create_vm(node, %{cpu_count: cpu_count, ram_size: ram_size, gpus: gpus})
      when node == node() do
    disk_config = LibvirtConfig.disk_config(LocalStorage.allocate_disk())
    iso_config = LibvirtConfig.iso_config(LocalStorage.get_installation_image())

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
        {:ok, domain_id}
      {:error, reason} ->
        # clean up mnesia here
        IO.inspect(reason)
    end
  end

  def create_vm(node, resources) when node != node() do
    task = Task.Supervisor.async(
      {TrackingStation.Scheduler.TaskSupervisor, node},
      TrackingStation.Scheduler.ResourcePool,
      :create_vm,
      [node, resources]
    )
    Task.await(task)
  end

  @spec init_local_resource(ResourceSpec) :: :ok | {:error, String.t()}
  def init_local_resource(local_resource_spec) do
    case Mnesia.transaction(fn ->
           Mnesia.write(
             {Scheduler.ResourcePool, local_resource_spec.cpu_count, local_resource_spec.ram_size,
              local_resource_spec.gpu_count, local_resource_spec.gpu_list}
           )
         end) do
      {:atomic, :ok} -> :ok
      _ -> {:error, "mnesia write failed"}
    end
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
