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
       name: TrackingStation.Scheduler.DomainSupervisor, strategy: :one_for_one}
    ]

    TrackingStation.Scheduler.init()

    :ets.new(:domain_res, [
      :set,
      :public,
      :named_table,
      read_concurrency: true,
      write_concurrency: :auto
    ])

    :ets.new(:domain_port_forwarding, [
      :set,
      :public,
      :named_table,
      read_concurrency: true,
      write_concurrency: :auto
    ])

    Supervisor.init(children, strategy: :one_for_one)
  end
end
