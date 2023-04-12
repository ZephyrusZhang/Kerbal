defmodule TrackingStation.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    topology = Application.get_env(:libcluster, :topologies)
    hosts = topology[:TrackingStation][:config][:hosts]

    children = [
      {Cluster.Supervisor, [topology, [name: TrackingStation.ClusterSupervisor]]},
      {Mnesiac.Supervisor, [hosts, [name: TrackingStation.MnesiacSupervisor]]},
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TrackingStation.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
