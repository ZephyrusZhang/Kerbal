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
      {TrackingStation.ClusterManager, name: TrackingStation.ClusterManager},
      {Cluster.Supervisor, [topology, [name: TrackingStation.ClusterSupervisor]]},
      {Mnesiac.Supervisor, [hosts, [name: TrackingStation.MnesiacSupervisor]]},
      {TrackingStation.Scheduler.Supervisor, [name: TrackingStation.Scheduler.Supervisor]},
      {TrackingStation.Network,
       [
         [spice_reserved: 5000..6000, tcp_port_range: 10000..20000, udp_port_range: 10000..20000],
         [name: TrackingStation.Network]
       ]}
    ]

    TrackingStation.Libvirt.reset()

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TrackingStation.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
