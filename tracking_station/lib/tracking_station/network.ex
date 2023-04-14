defmodule TrackingStation.Network do
  @moduledoc """
  TrackingStation.Network uses Open vSwitch to build
  inter-VM network and controls how VMs connect to the internet.
  """
  alias TrackingStation.Libvirt
  def init() do
    # Start the default network (NAT)
    case Libvirt.start_network("default") do
      {:ok, _} -> :ok
      {:already_active, _} -> :ok
      _ -> raise "failed to start default network"
    end
  end
end
