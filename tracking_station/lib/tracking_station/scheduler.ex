defmodule TrackingStation.Scheduler.Domain do
  defstruct [:node_id, :domain_id, :base_img, :img, gpu_list: []]
end

defmodule TrackingStation.Scheduler do
  @moduledoc """
  TrackingStation.Scheduler manages available resources
  and allocate these resources to create new VMs.
  """
  alias :mnesia, as: Mnesia
  alias TrackingStation.Scheduler.DomainMonitor
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
            gpu_id: Atom.to_string(node()) <> gpu.id,
            node_id: node(),
            name: gpu.device,
            vram_size: 0,
            bus: gpu.bus,
            slot: gpu.slot,
            function: gpu.function,
            domain_uuid: "",
            free: true,
            online: true
          )
        )
      end
    end)
  end

  def create_domain(node, user_id, spec) when node == node() do
    uuid = UUID.uuid4()

    case DynamicSupervisor.start_child(
           TrackingStation.Scheduler.DomainMonitorSupervisor,
           {DomainMonitor, {spec, user_id, uuid}}
         ) do
      {:ok, _pid} -> {:ok, uuid}
      {:error, reason} -> {:error, reason}
    end
  end

  def create_domain(node, user_id, spec) when node != node() do
    task =
      Task.Supervisor.async(
        {TrackingStation.Scheduler.TaskSupervisor, node},
        TrackingStation.Scheduler,
        :create_vm,
        [node, user_id, spec]
      )

    Task.await(task, 5000)
  end

  def list_domains(user_id) do
    {:atomic, records} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(active_domain(user_id: user_id))
      end)

    records
    |> Enum.map(&active_domain(&1, :uuid))
    |> Enum.map(&DomainMonitor.get_info(&1, user_id))
  end

  def list_user_domains(user_id) do
    {:ok, list_of_domains} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(active_domain(user_id: user_id))
        |> Enum.map(&active_domain(&1, :uuid))
      end)

    list_of_domains
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
        domain_uuid: :_,
        free: :"$4",
        online: :"$5"
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
          [matched_node_info | []] = Mnesia.match_object(node_info(node_id: node))

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
