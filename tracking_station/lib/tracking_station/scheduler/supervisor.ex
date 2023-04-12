defmodule TrackingStation.Scheduler.Supervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    children = [
      {Task.Supervisor, name: TrackingStation.Scheduler.TaskSupervisor},
    ]

    TrackingStation.Scheduler.ResourcePool.init()

    Supervisor.init(children, strategy: :one_for_one)
  end
end
