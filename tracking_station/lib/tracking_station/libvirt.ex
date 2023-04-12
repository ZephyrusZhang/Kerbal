defmodule TrackingStation.Libvirt.Native do
  use Rustler, otp_app: :tracking_station, crate: "libvirt"

  @spec get_resources(String.t()) :: LibvirtResource
  def get_resources(_url), do: :erlang.nif_error(:nif_not_loaded)

  def create_vm_from_xml(_url, _xml_config), do: :erlang.nif_error(:nif_not_loaded)

  def poll_domain_stats(_url, _domain_id), do: :erlang.nif_error(:nif_not_loaded)
end

defmodule TrackingStation.Libvirt do
  @moduledoc """
  TrackingStation.Libvirt loads the NIF the communicate with
  Libvirt.
  """
  alias TrackingStation.Libvirt.Native

  @libvirt_url "qemu:///system"

  def get_resources() do
    Native.get_resources(@libvirt_url)
  end

  def create_vm_from_xml(xml_config) do
    Native.create_vm_from_xml(@libvirt_url, xml_config)
  end

  def poll_domain_stats(domain_id) do
    Native.poll_domain_stats(@libvirt_url, domain_id)
  end

  def valid_gpu_resource(gpu_ids) do
    case System.cmd("lspci", ["-nnk"]) do
      {output, 0} ->
        re =
          ~r/\d{2}:\d{2}\.\d .+?: (?<device>.+?) \[(?<id>\w{4}:\w{4})\].*?\n(\t.*?\n)*?\tKernel driver in use: (?<driver>.*?)\n/

        pci_devices =
          Regex.scan(re, output, capture: :all_names)
          |> Enum.map(fn [device | [driver | [id | []]]] ->
            %{device: device, driver: driver, id: id}
          end)

        gpu_ids
        |> Enum.map(fn id ->
          Enum.find(pci_devices, &(&1.id == id))
        end)
        |> Enum.reject(&(&1 == nil))
        |> Enum.filter(&(&1.driver =~ "vfio"))

      _ ->
        []
    end
  end
end
