defmodule TrackingStation.LibvirtResource do
  defstruct [:num_cpus, :ram, gpu_list: []]
end

defmodule TrackingStation.Libvirt do
  @moduledoc """
  TrackingStation.Libvirt loads the NIF the communicate with
  Libvirt.
  """
  alias TrackingStation
  use Rustler, otp_app: :tracking_station, crate: "libvirt"

  @spec get_resources([String.t()]) :: LibvirtResource
  def get_resources(gpu_ids), do: :erlang.nif_error(:nif_not_loaded)

  def get_node_info(url), do: :erlang.nif_error(:nif_not_loaded)

  def create_vm_from_xml(url, xml_config), do: :erlang.nif_error(:nif_not_loaded)

  def reclaim_vm(), do: :erlang.nif_error(:nif_not_loaded)

  def monitor_vm() , do: :erlang.nif_error(:nif_not_loaded)
end
