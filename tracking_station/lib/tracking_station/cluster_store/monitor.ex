defmodule TrackingStation.ClusterStore.Monitor do
  require Logger
  import TrackingStation.ClusterStore.ActiveDomain
  import TrackingStation.ClusterStore.GPUStatus
  import TrackingStation.ClusterStore.NodeInfo
  use GenServer

  alias :mnesia, as: Mnesia

  def start_link(opts) do
    GenServer.start_link(__MODULE__, [], opts)
  end

  defp clean_dead_node(node) do
    Mnesia.transaction(fn ->
      # double check because the node may have become online again
      if node in Node.list() do
        case Mnesia.match_object(node_info(node_id: node)) do
          [] ->
            # one of the alive node already did the clean up
            :noop

          [_record] ->
            # delete everything related to the dead node
            Mnesia.delete({:node_info, node})

            Mnesia.match_object(active_domain(node_id: node))
            |> Enum.map(fn record ->
              key = active_domain(record, :uuid)
              Mnesia.delete({:active_domain, key})
            end)

            Mnesia.match_object(gpu_status(node_id: node))
            |> Enum.map(fn record ->
              key = gpu_status(record, :gpu_id)
              Mnesia.delete({:gpu_status, key})
            end)
        end
      end
    end)
  end

  @impl true
  def init(_) do
    :net_kernel.monitor_nodes(true)
    {:ok, []}
  end

  @impl true
  def handle_info({:nodedown, node}, state) do
    Logger.warning("ClusterStore.Monitor: #{node} disconnect, cleaning up")
    clean_dead_node(node)
    {:noreply, state}
  end

  @impl true
  def handle_info({:nodeup, node}, state) do
    Logger.info("ClusterStore.Monitor: #{node} joined")
    {:noreply, state}
  end
end
