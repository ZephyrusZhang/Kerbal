defmodule TrackingStation.Libvirt.Native do
  use Rustler,
    otp_app: :tracking_station,
    crate: "libvirt",
    skip_compilation?: false

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

  def destroy_domain(domain_id), do: Native.destroy_domain(@libvirt_url, domain_id)

  def start_network(name), do: Native.start_network(@libvirt_url, name)

  def init(), do: Native.reset(@libvirt_url)

  def start(domain_id) do
    {_, 0} = System.cmd("virsh", ~w(-c #{@libvirt_url} start #{domain_id}))
  end

  def reboot(domain_id) do
    {_, 0} = System.cmd("virsh", ["-c", @libvirt_url, "reboot", "#{domain_id}"])
  end

  def reset(domain_id) do
    {_, 0} = System.cmd("virsh", ["-c", @libvirt_url, "reset", "#{domain_id}"])
  end

  def shutdown(domain_id) do
    {_, 0} = System.cmd("virsh", ["-c", @libvirt_url, "shutdown", "#{domain_id}"])
  end

  def is_alive?(domain_id) do
    case System.cmd("virsh", ~w(-c #{@libvirt_url} domstate #{domain_id})) do
      {_, 0} -> true
      {_, 1} -> false
    end
  end

  def get_cpu_time(domain_id) do
    {cpu_stats, 0} = System.cmd("virsh", ~w(-c #{@libvirt_url} domstats --cpu-total #{domain_id}))

    # Exmaple:
    # Domain: ''
    #   cpu.time=41868102000
    #   cpu.user=38165256000
    #   cpu.system=3702846000
    #   cpu.cache.monitor.count=0
    #   cpu.haltpoll.success.time=330737519
    #   cpu.haltpoll.fail.time=320068978
    #   cpu_stats
    cpu_stats
    |> String.split()
    |> Enum.find(nil, fn stat -> String.starts_with?(stat, "cpu.time") end)
    |> String.split("=", trim: true)
    |> Enum.fetch!(1)
    |> String.to_integer()
  end

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

  def guest_exec(domain_id, command, args, options \\ []) do
    default_options = [capture_output: true, timeout: 1]
    options = Keyword.merge(default_options, options)

    request = %{
      execute: "guest-exec",
      arguments: %{
        path: command,
        arg: args,
        "capture-output": Keyword.get(options, :capture_output)
      }
    }

    {response, 0} =
      System.cmd("sudo", [
        "virsh",
        "qemu-agent-command",
        "#{domain_id}",
        Jason.encode!(request),
        "--timeout",
        "#{Keyword.get(options, :timeout)}"
      ])

    response
    |> Jason.decode!()
    |> get_in(["return", "pid"])
  end

  def guest_exec_status(domain_id, pid, options \\ []) do
    default_options = [timeout: 1]
    options = Keyword.merge(default_options, options)

    request = %{
      execute: "guest-exec-status",
      arguments: %{pid: pid}
    }

    {response, 0} =
      System.cmd("sudo", [
        "virsh",
        "qemu-agent-command",
        "#{domain_id}",
        Jason.encode!(request),
        "--timeout",
        "#{Keyword.get(options, :timeout)}"
      ])

    response =
      response
      |> Jason.decode!()
      |> Map.fetch!("return")

    output =
      if Map.has_key?(response, "out-data") do
        response
        |> Map.fetch!("out-data")
        |> Base.decode64!()
      end

    %{
      exitcode: Map.get(response, "exitcode"),
      exited: Map.fetch!(response, "exited"),
      output: output
    }
  end
end
