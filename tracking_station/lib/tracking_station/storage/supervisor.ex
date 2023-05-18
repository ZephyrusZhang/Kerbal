defmodule TrackingStation.Storage.Supervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    children = [
      {Task.Supervisor, name: TrackingStation.Storage.RemoteTaskSupervisor},
      {TrackingStation.Storage.LocalStorage, name: TrackingStation.Storage.LocalStorage}
    ]

    Supervisor.init(children, strategy: :one_for_all)
  end
end
