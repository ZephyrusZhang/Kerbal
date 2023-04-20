defmodule TrackingStation.Libvirt.Native do
  use Rustler, otp_app: :tracking_station, crate: "libvirt"

  @spec get_resources(String.t()) :: LibvirtResource
  def get_resources(_url), do: :erlang.nif_error(:nif_not_loaded)

  def create_vm_from_xml(_url, _xml_config), do: :erlang.nif_error(:nif_not_loaded)

  def poll_domain_stats(_url, _domain_id), do: :erlang.nif_error(:nif_not_loaded)

  def destroy_domain(_url, _domain_id), do: :erlang.nif_error(:nif_not_loaded)

  def start_network(_url, _name), do: :erlang.nif_error(:nif_not_loaded)

  def qemu_guest_agent(_url, _domain_id, _data), do: :erlang.nif_error(:nif_not_loaded)

  def reset(_url), do: :erlang.nif_error(:nif_not_loaded)
end

defmodule TrackingStation.Libvirt do
  @moduledoc """
  TrackingStation.Libvirt loads the NIF the communicate with
  Libvirt.
  """
  alias TrackingStation.Libvirt.Native

  @libvirt_url "qemu:///system"

  def get_resources(), do: Native.get_resources(@libvirt_url)

  def create_vm_from_xml(xml_config), do: Native.create_vm_from_xml(@libvirt_url, xml_config)

  def poll_domain_stats(domain_id), do: Native.poll_domain_stats(@libvirt_url, domain_id)

  def destroy_domain(domain_id), do: Native.destroy_domain(@libvirt_url, domain_id)

  def start_network(name), do: Native.start_network(@libvirt_url, name)

  def qemu_guest_agent(domain_id, data),
    do: Native.qemu_guest_agent(@libvirt_url, domain_id, data)

  def reset(), do: Native.reset(@libvirt_url)

  def valid_gpu_resource(gpu_ids) do
    case System.cmd("lspci", ["-nnk"]) do
      {output, 0} ->
        re =
          ~r/(?<bus>\d{2}):(?<slot>\d{2})\.(?<function>\d) .+?: (?<device>.+?) \[(?<id>\w{4}:\w{4})\].*?\n(\t.*?\n)*?\tKernel driver in use: (?<driver>.*?)\n/

        pci_devices =
          re
          |> Regex.scan(output, capture: :all_names)
          |> Enum.map(fn capture ->
            [:bus, :device, :driver, :function, :id, :slot]
            |> Enum.zip(capture)
            |> Enum.into(%{})
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

  def guest_run_cmd(domain_id, command, args, capture_output \\ true) do
    request = %{
      execute: "guest-exec",
      arguments: %{path: command, arg: args, "capture-output": capture_output}
    }

    {:ok, response} = qemu_guest_agent(domain_id, Jason.encode!(request))

    response
    |> Jason.decode!()
    |> IO.inspect()

    pid = 0

    request = %{
      execute: "guest-exec-status",
      arguments: %{pid: pid}
    }

    {:ok, response} = qemu_guest_agent(domain_id, Jason.encode!(request))
    response |> Jason.decode!()
  end
end
