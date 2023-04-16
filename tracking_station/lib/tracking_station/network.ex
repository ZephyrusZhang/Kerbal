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
end
