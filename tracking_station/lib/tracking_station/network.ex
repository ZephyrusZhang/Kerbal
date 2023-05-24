defmodule TrackingStation.Network do
  @moduledoc """
  TrackingStation.Network uses Open vSwitch to build
  inter-VM network and controls how VMs connect to the internet.
  """
  use GenServer
  alias TrackingStation.Libvirt

  def start_link([config, opts]) do
    GenServer.start_link(__MODULE__, config, opts)
  end

  @impl true
  def init(
        spice_reserved: spice_reserved,
        tcp_port_range: tcp_port_range,
        udp_port_range: udp_port_range
      ) do
    # Start the default network (NAT)
    case Libvirt.start_network("default") do
      {:ok, _} -> :ok
      {:already_active, _} -> :ok
      _ -> raise "failed to start default network"
    end

    # Start open vswitch for overlay network
    System.cmd("sudo", ["ovs-vsctl", "add-br", "ovsbr0"])

    {:ok,
     %{
       spice_reserved: Enum.to_list(spice_reserved),
       tcp_ports: Enum.to_list(tcp_port_range),
       udp_ports: Enum.to_list(udp_port_range)
     }}
  end

  def allocate_spice_port() do
    GenServer.call(TrackingStation.Network, {:allocate_port, :spice_reserved})
  end

  def allocate_tcp_port() do
    GenServer.call(TrackingStation.Network, {:allocate_port, :tcp_ports})
  end

  def allocate_udp_port() do
    GenServer.call(TrackingStation.Network, {:allocate_port, :tcp_ports})
  end

  def free_spice_port(port) do
    GenServer.cast(TrackingStation.Network, {:free_port, :spice_reserved, port})
    :ok
  end

  def free_tcp_port(port) do
    GenServer.cast(TrackingStation.Network, {:free_port, :tcp_ports, port})
    :ok
  end

  def free_udp_port(port) do
    GenServer.cast(TrackingStation.Network, {:free_port, :udp_ports, port})
    :ok
  end

  # TODO
  # check host_port, guest_ip, guest_port are valid
  def add_port_forwarding(host_port, guest_ip, guest_port) do
    {_, 0} =
      System.cmd("sudo", [
        "iptables",
        "-I",
        "FORWARD",
        "-o",
        "virbr0",
        "-p",
        "tcp",
        "-d",
        "#{guest_ip}",
        "--dport",
        "#{guest_port}",
        "-j",
        "ACCEPT"
      ])

    {_, 0} =
      System.cmd("sudo", [
        "iptables",
        "-t",
        "nat",
        "-I",
        "PREROUTING",
        "-p",
        "tcp",
        "--dport",
        "#{host_port}",
        "-j",
        "DNAT",
        "--to",
        "#{guest_ip}:#{guest_port}"
      ])
  end

  def delete_port_forwarding(host_port, guest_ip, guest_port) do
    {_, 0} =
      System.cmd("sudo", [
        "iptables",
        "-D",
        "FORWARD",
        "-o",
        "virbr0",
        "-p",
        "tcp",
        "-d",
        "#{guest_ip}",
        "--dport",
        "#{guest_port}",
        "-j",
        "ACCEPT"
      ])

    {_, 0} =
      System.cmd("sudo", [
        "iptables",
        "-t",
        "nat",
        "-D",
        "PREROUTING",
        "-p",
        "tcp",
        "--dport",
        "#{host_port}",
        "-j",
        "DNAT",
        "--to",
        "#{guest_ip}:#{guest_port}"
      ])
  end

  @impl true
  def handle_call({:allocate_port, pool_name}, _from, state) do
    pool = Map.get(state, pool_name)

    case pool do
      [port | rest] ->
        {:reply, {:ok, port}, Map.replace!(state, pool_name, rest)}

      [] ->
        {:reply, {:error, :no_free_port}, state}
    end
  end

  @impl true
  def handle_cast({:free_port, pool_name, port}, state) do
    new_state = update_in(state[pool_name], fn pool -> [port | pool] end)
    {:noreply, new_state}
  end
end
