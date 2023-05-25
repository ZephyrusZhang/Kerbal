defmodule TrackingStation.Scheduler do
  @moduledoc """
  TrackingStation.Scheduler manages available resources
  and allocate these resources to create new VMs.
  """
  alias :mnesia, as: Mnesia
  alias TrackingStation.Scheduler.Domain
  alias TrackingStation.Libvirt
  import TrackingStation.ClusterStore.NodeInfo
  import TrackingStation.ClusterStore.GPUStatus
  import TrackingStation.ClusterStore.ActiveDomain

  def init() do
    gpu_ids = Application.get_env(:tracking_station, :gpu_ids)
    gpus = Libvirt.valid_gpu_resource(gpu_ids)
    {:ok, cpu_and_mem} = TrackingStation.Libvirt.get_resources()
    IO.inspect({cpu_and_mem, gpus})

    {:atomic, :ok} =
      Mnesia.transaction(fn ->
        Mnesia.write(
          node_info(
            node_id: node(),
            cpu_count: cpu_and_mem.cpu_count,
            ram_size: cpu_and_mem.ram_size,
            free_cpu_count: cpu_and_mem.cpu_count,
            free_ram_size: cpu_and_mem.ram_size,
            ipv4_addr: get_self_address(:inet),
            ipv6_addr: get_self_address(:inet6)
          )
        )

        for gpu <- gpus do
          Mnesia.write(
            gpu_status(
              gpu_id: Atom.to_string(node()) <> gpu.id,
              node_id: node(),
              name: gpu.device,
              vram_size: 0,
              bus: gpu.bus,
              slot: gpu.slot,
              function: gpu.function,
              domain_uuid: "",
              free: true,
              online: true
            )
          )
        end

        :ok
      end)
  end

  defp is_loopback_addr(ip, address_family) do
    case address_family do
      :inet ->
        {prefix, _, _, _} = ip
        prefix == 127

      :inet6 ->
        ip == {0, 0, 0, 0, 0, 0, 0, 1}
    end
  end

  @doc """
  Get the ip address of this node,
  address family should be :inet or inet6
  """
  def get_self_address(address_family) do
    {:ok, hostname} = :inet.gethostname()

    case :inet.getaddrs(hostname, address_family) do
      {:ok, addrs} ->
        case Enum.find(addrs, nil, &(not is_loopback_addr(&1, address_family))) do
          nil ->
            ""

          addr ->
            addr |> :inet.ntoa() |> to_string()
        end

      {:error, _} ->
        ""
    end
  end

  def create_domain(node, user_id, spec) when node == node() do
    uuid = UUID.uuid4()

    case DynamicSupervisor.start_child(
           TrackingStation.Scheduler.DomainSupervisor,
           {Domain, {spec, user_id, uuid}}
         ) do
      {:ok, _pid} -> {:ok, uuid}
      {:error, reason} -> {:error, reason}
    end
  end

  def create_domain(node, user_id, spec) when node != node() do
    task =
      Task.Supervisor.async(
        {TrackingStation.Scheduler.TaskSupervisor, node},
        TrackingStation.Scheduler,
        :create_domain,
        [node, user_id, spec]
      )

    Task.await(task, 10_000)
  end

  def list_user_domains(user_id) do
    {:atomic, records} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(active_domain(user_id: user_id))
      end)

    records
    |> Enum.map(&active_domain(&1, :uuid))
    |> Enum.map(fn uuid ->
      {:ok, info} = Domain.get_info(uuid, user_id)
      info
    end)
  end

  def query_node(cpu_count, ram_size) do
    match_head =
      node_info(
        node_id: :"$1",
        storage_role: :_,
        cpu_count: :"$2",
        ram_size: :"$3",
        free_cpu_count: :"$4",
        free_ram_size: :"$5"
      )

    guard = [{:>=, :"$4", cpu_count}, {:>=, :"$5", ram_size}]

    result = [:"$_"]

    {:atomic, available_nodes} =
      Mnesia.transaction(fn ->
        Mnesia.select(:node_info, [
          {
            match_head,
            guard,
            result
          }
        ])
      end)

    available_nodes
  end

  def query_gpu(name, vram_size) do
    match_head =
      gpu_status(
        gpu_id: :_,
        node_id: :"$1",
        name: :"$2",
        vram_size: :"$3",
        bus: :_,
        slot: :_,
        function: :_,
        domain_uuid: :_,
        free: :"$4",
        online: :"$5"
      )

    guard = [{:>=, :"$3", vram_size}, {:==, :"$4", true}, {:==, :"$5", true}]

    guard =
      if name == nil or name == :_ do
        guard
      else
        [{:==, :"$2", name} | guard]
      end

    result = [:"$_"]

    {:atomic, available_gpus} =
      Mnesia.transaction(fn ->
        Mnesia.select(:gpu_status, [
          {
            match_head,
            guard,
            result
          }
        ])
      end)

    available_gpus
  end

  def lookup_resource(%{
        cpu_count: cpu_count,
        ram_size: ram_size,
        gpu_count: gpu_count,
        gpu: %{name: name, vram_size: vram_size}
      }) do
    available_nodes = query_node(cpu_count, ram_size)

    available_gpus =
      query_gpu(name, vram_size)
      |> Enum.group_by(&gpu_status(&1, :node_id))
      |> Map.filter(fn {_key, value} -> length(value) >= gpu_count end)

    available_nodes
    |> Enum.map(fn record ->
      node_id = node_info(record, :node_id)
      match_gpus = Map.get(available_gpus, node_id, [])
      {record, match_gpus}
    end)
    |> Enum.filter(fn {_record, match_gpus} ->
      length(match_gpus) >= gpu_count
    end)
    |> Enum.map(fn {record, match_gpus} ->
      map_format_gpus =
        match_gpus
        |> Enum.map(fn gpu_status_record ->
          gpu_status_record |> gpu_status() |> Enum.into(%{})
        end)

      record
      |> node_info()
      |> Enum.into(%{})
      |> Map.put(:gpus, map_format_gpus)
    end)
  end
end
