defmodule TrackingStation.Scheduler.ResourceSpec do
  defstruct [:cpu_count, :ram_size, gpu_count: 0, gpu_list: []]
end

defmodule TrackingStation.Scheduler.ResourcePool do
  alias :mnesia, as: Mnesia
  alias TrackingStation.Scheduler.ResourceSpec

  def init() do
    Mnesia.create_schema([])
    Mnesia.start()

    case Mnesia.create_table(Scheduler.ResourcePool,
           attributes: [:node_id, :cpu_count, :ram_size, :gpu_count, :gpu_list],
           index: [:node_id, :cpu_count, :ram_size, :gpu_count]
         ) do
      {:atomic, :ok} -> nil
      {:already_exists, _table} -> nil
    end
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

  def lookup_resource(resource_spec) do
    match_head = %{
      node_id: :"$1",
      cpu_count: :"$2",
      ram_size: :"$3",
      gpu_count: :"$4",
      gpu_list: :"$5"
    }

    guard = [
      {:">=", :"$1", resource_spec.cpu_count},
      {:">=", :"$2", resource_spec.ram_size},
      {:">=", :"$3", resource_spec.gpu_count}
    ]

    result = [:"$1", :"$5"]

    case Mnesia.transaction(fn ->
      Mnesia.select(Scheduler.ResourcePool, [match_head, guard, result])
    end) do
      {:atomic, available_resources} -> available_resources
      _ -> []
    end
  end
end
