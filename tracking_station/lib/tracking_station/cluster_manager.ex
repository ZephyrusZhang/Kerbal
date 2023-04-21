defmodule TrackingStation.ClusterManager do
  require Logger
  use GenServer

  def start_link(opts) do
    GenServer.start_link(__MODULE__, [], opts)
  end

  @impl true
  def init(_) do
    {:ok, []}
  end

  def connect_node(node) do
    :net_kernel.connect_node(node)
    |> tap(&GenServer.cast(TrackingStation.ClusterManager, {:connect, node, &1}))
  end

  def disconnect_node(node) do
    :erlang.disconnect_node(node)
    |> tap(&GenServer.cast(TrackingStation.ClusterManager, {:disconnect, node, &1}))
  end

  @impl true
  def handle_cast({:connect, node, connect_result}, state) do
    Logger.info("node: #{inspect(node)} got #{inspect(connect_result)}")
    {:noreply, state}
  end

  @impl true
  def handle_cast({:disconnect, node, disconnect_result}, state) do
    Logger.info("node: #{inspect(node)} got #{inspect(disconnect_result)}")
    {:noreply, state}
  end
end
