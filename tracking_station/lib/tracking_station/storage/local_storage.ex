defmodule TrackingStation.Storage.LocalStorage do
  @moduledoc """
  The local storage is splitted into three datasets: `base`, `overlay`, `running` and `live`.
  The `base` stores base volumes that should be kept on all nodes.
  The `overlay` stores overlay layers on top of base or other layers.
  The `running` stores clones of base or overlay.
  Zvol in `running` needs reservation matching their volsize and can be deleted after reboot.
  `live` is a special type of `running` that will not be cleaned after reboot.
  """
  use GenServer
  require Logger
  import TrackingStation.ClusterStore.StorageInfo
  alias :mnesia, as: Mnesia

  def start_link(opts) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    # reset
    list_running_images()
    |> Enum.map(&destroy_running/1)

    # submit info about local storages to mnesia
    local_storages =
      [:base, :overlay, :live]
      |> Enum.flat_map(fn dataset ->
        list_path("rpool/#{dataset}")
        |> Enum.map(fn name -> generate_record_for_image(dataset, name) end)
      end)

    {:atomic, _} =
      Mnesia.transaction(fn ->
        local_storages
        |> Enum.map(fn record ->
          Mnesia.write(record)
        end)
      end)

    {:ok, %{transfer_tasks: %{}}}
  end

  defp valid_name(name) do
    # containing only 0-9 a-z _ and -
    re = ~r/^[0-9a-z_\-]+$/
    Regex.match?(re, name)
  end

  defp valid_name!(name) do
    if !valid_name(name) do
      Logger.error("Encountering invalid dataset name: #{name}")
      raise "Invalid string"
    end
  end

  def destroy_base(name) do
    valid_name!(name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/base/#{name}@frozen))
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/base/#{name}))

    # TODO register in mnesia
  end

  def destroy_overlay(name) do
    valid_name!(name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/overlay/#{name}@frozen))
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/overlay/#{name}))

    # TODO register in mnesia
  end

  def destroy_running(name) do
    valid_name!(name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/running/#{name}))
  end

  def destroy_live(name) do
    valid_name!(name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/live/#{name}))
  end

  defp get_property(path, property) do
    {result, 0} = System.cmd("zfs", ~w(get #{property} -Hp #{path}))

    result
    |> String.split()
    |> Enum.fetch!(2)
    |> String.to_integer()
  end

  def get_installation_image() do
    "/home/jeb/archlinux-x86_64.iso"
  end

  @doc """
  Create a running image from base or overlay named `name`.
  """
  def create_running(dataset, name) when dataset in [:base, :overlay] do
    valid_name!(name)
    uuid = UUID.uuid4()
    path = "rpool/running/#{uuid}"
    {_, 0} = System.cmd("sudo", ~w(zfs clone rpool/#{dataset}/#{name}@frozen #{path}))
    uuid
  end

  def reclaim_running(path) do
    destroy_running(path)
  end

  @doc """
  Take a snapshot, create a clone from it
  and swap the clone with the original zvol.
  This would, in effect, create a layer below the current running zvol.
  """
  def make_overlay(zvol, name) do
    {_, 0} = System.cmd("sudo", ~w(zfs snapshot rpool/running/#{zvol}@frozen}))
    {_, 0} = System.cmd("sudo", ~w(zfs clone rpool/running/#{zvol}@frozen rpool/images/#{zvol}))
    {_, 0} = System.cmd("sudo", ~w(zfs promote rpool/images/#{zvol}@#{name}))
    :ok
  end

  def generate_record_for_image(dataset, name)
      when dataset in [:base, :overlay, :running, :live] do
    path = "rpool/#{dataset}/#{name}"
    guid = get_property(path, "guid")
    used = get_property(path, "used")
    volsize = get_property(path, "volsize")

    storage_info(
      key: {node(), guid},
      node_id: node(),
      guid: guid,
      name: name,
      type: dataset,
      volsize: volsize,
      used: used
    )
  end

  @doc """
  Return the free space in bytes
  """
  def free_space() do
    {result, 0} = System.cmd("zfs", ~w(get available -Hp rpool))

    result
    |> String.split()
    |> Enum.fetch!(2)
    |> String.to_integer()
  end

  def list_snapshots(zvol) do
    case System.cmd("zfs", ~w(list -t snapshot -o name -H rpool/images/#{zvol})) do
      {result, 0} ->
        result
        |> String.split("\n", trim: true)

      {"", 1} ->
        raise "zvol doesn't exist"

      error ->
        raise "unknown error #{inspect(error)}"
    end
  end

  defp list_path(path) do
    {result, 0} = System.cmd("zfs", ~w(list -o name -Hr #{path}))

    result
    |> String.split("\n", trim: true)
    |> Enum.drop(1)
    |> Enum.map(fn full_path ->
      String.split(full_path, "/", trim: true, parts: 3)
      |> Enum.fetch!(2)
    end)
  end

  def list_base_images() do
    list_path("rpool/base")
  end

  def list_overlay() do
    list_path("rpool/overlay")
  end

  def list_running_images() do
    list_path("rpool/running")
  end

  @spec send_snapshot(String.t(), {String.t(), atom()}) :: atom()
  def send_snapshot(from, {to_snap, node}) do
    # TODO: don't use ssh
    {"", 0} =
      System.shell(
        "sudo zfs send #{from} | ssh -o StrictHostKeyChecking=no -i ~/.ssh/jeb #{node} #{to_snap}"
      )
  end

  def tranfer_snapshot(_) do
  end

  @impl true
  def handle_call({:transfer, snapshot}, _from, state) do
    task = Task.async_nolink(fn -> tranfer_snapshot(snapshot) end)

    state = put_in(state.transfer_tasks[task.ref], snapshot)

    {:reply, :ok, state}
  end

  @impl true
  def handle_info({ref, _result}, state) do
    Process.demonitor(ref, [:flush])

    {_snapshot, state} = pop_in(state.transfer_tasks[ref])
    {:noreply, state}
  end

  def handle_info({:DOWN, ref, _, _, _reason}, state) do
    {_snapshot, state} = pop_in(state.transfer_tasks[ref])
    {:noreply, state}
  end
end
