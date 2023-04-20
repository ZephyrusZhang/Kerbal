defmodule TrackingStation.Scheduler.DomainMonitor do
  @moduledoc """
  TrackingStation.Scheduler.DomainMonitor manages
  the life time of the domain, it keeps monitoring the domain
  and handles requests related to this domain (e.g. shutdown the domain)
  """
  use GenServer
  alias TrackingStation.Libvirt
  import TrackingStation.ClusterStore.ActiveDomain
  alias :mnesia, as: Mnesia

  def start_link(domain_uuid) do
    GenServer.start_link(__MODULE__, domain_uuid,
      name: {:via, Registry, {TrackingStation.Scheduler.DomainMonitorRegistry, domain_uuid}}
    )
  end

  def force_destroy(domain_uuid) do
    {pid, _} = Registry.lookup(TrackingStation.Scheduler.DomainMonitorRegistry, uuid)
    GenServer.call(pid, :force_destroy, 30000)
  end

  @impl true
  def init(domain_uuid) do
    {:atomic, [domain | []]} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(
          active_domain(
            uuid: domain_uuid,
            node_id: :_,
            domain_id: :_,
            cpu_count: :_,
            ram_size: :_,
            disk_path: :_,
            iso_path: :_,
            spice_port: :_,
            spice_password: :_,
            status: :_
          )
        )
      end)

    Process.send_after(self(), :poll, :timer.seconds(1))

    {:ok,
     %{
       domain_uuid: domain_uuid,
       domain_id: active_domain(domain, :domain_id),
       status: active_domain(domain, :status)
     }}
  end

  @impl true
  def handle_info(:poll, state) do
    poll_domain_info(state)
  end

  @impl true
  def terminate(:normal, %{domain_uuid: domain_uuid}) do
    TrackingStation.Scheduler.hard_reclaim_domain(domain_uuid)
  end

  @impl true
  def terminate(reason, _state) do
    IO.puts("unknown reason")
    IO.inspect(reason)
  end

  defp change_domain_status(uuid, new_status) do
    {:atomic, :ok} =
      Mnesia.transaction(fn ->
        [domain | []] =
          Mnesia.match_object(
            active_domain(
              uuid: uuid,
              node_id: :_,
              domain_id: :_,
              cpu_count: :_,
              ram_size: :_,
              disk_path: :_,
              iso_path: :_,
              spice_port: :_,
              spice_password: :_,
              status: :_
            )
          )

        Mnesia.write(active_domain(domain, status: new_status))
      end)
  end

  defp poll_domain_info(
         %{domain_uuid: domain_uuid, domain_id: domain_id, status: :creating} = state
       ) do
    case Libvirt.poll_domain_stats(domain_id) do
      {:ok, stats} ->
        IO.inspect(stats)
        change_domain_status(domain_uuid, :running)
        Process.send_after(self(), :poll, :timer.seconds(10))
        {:noreply, Map.replace!(state, :status, :running)}

      {:error, :no_domain} ->
        # the domain is down, reclaim it's resources
        IO.puts("The vm has been shutdown")
        {:stop, :normal, state}

      {:error, reason} ->
        # abnormal exit
        IO.inspect(reason)
        {:stop, :normal, state}
    end
  end

  defp poll_domain_info(
         %{domain_uuid: _domain_uuid, domain_id: domain_id, status: :running} = state
       ) do
    case Libvirt.poll_domain_stats(domain_id) do
      {:ok, stats} ->
        IO.inspect(stats)
        Process.send_after(self(), :poll, :timer.minutes(3))
        {:noreply, state}

      {:error, :no_domain} ->
        # the domain is down, reclaim it's resources
        IO.puts("The vm has been shutdown")
        {:stop, :normal, state}

      {:error, reason} ->
        # abnormal exit
        IO.inspect(reason)
        {:stop, :normal, state}
    end
  end

  @impl true
  def handle_call(:force_destroy, _from, state) do
    TrackingStation.Scheduler.hard_reclaim_domain(uuid)

    {:stop, :shutdown, state}
  end
end
