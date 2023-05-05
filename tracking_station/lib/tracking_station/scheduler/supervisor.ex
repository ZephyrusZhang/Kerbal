defmodule TrackingStation.Scheduler.Supervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    children = [
      {Task.Supervisor, name: TrackingStation.Scheduler.TaskSupervisor},
      {DynamicSupervisor,
       name: TrackingStation.Scheduler.DomainMonitorSupervisor, strategy: :one_for_one},
      {Registry, [keys: :unique, name: TrackingStation.Scheduler.DomainMonitorRegistry]}
    ]

    TrackingStation.Scheduler.init()

    Supervisor.init(children, strategy: :one_for_one)
  end
end
