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

  @dataset2atom %{
    "base" => :base,
    "overlay" => :overlay,
    "running" => :running,
    "live" => :live
  }

  def start_link(opts) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  @impl true
  def init(:ok) do
    # reset
    list_running_images()
    |> Enum.map(&destroy_image(:running, &1))

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

    {:ok, %{recv_tasks: %{}, pending: %{}, deps: %{}}}
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

  defp unregister_image(dataset, name) do
    Mnesia.transaction(fn ->
      [info] =
        Mnesia.match_object(
          storage_info(
            node_id: node(),
            dataset: dataset,
            name: name
          )
        )

      Mnesia.delete_object(info)
    end)
  end

  defp register_image(dataset, name) do
    record = generate_record_for_image(dataset, name)

    Mnesia.transaction(fn ->
      Mnesia.write(record)
    end)
  end

  def destroy_image(dataset, name) when dataset in [:running, :live] do
    valid_name!(name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/#{dataset}/#{name}))
  end

  def destroy_image(dataset, name) when dataset in [:base, :overlay] do
    valid_name!(name)
    :ok = unregister_image(dataset, name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/#{dataset}/#{name}@frozen))
    {_, 0} = System.cmd("sudo", ~w(zfs destroy rpool/#{dataset}/#{name}))
  end

  defp get_property(path, property) do
    {result, 0} = System.cmd("zfs", ~w(get #{property} -Hp #{path}))

    result
    |> String.split()
    |> Enum.fetch!(2)
  end

  defp get_origin(dataset, name) do
    origin_path = get_property("rpool/#{dataset}/#{name}", "origin")

    if origin_path != "-" do
      ["rpool", origin_dataset, origin_name] = origin_path |> String.split("/")
      origin_dataset = Map.fetch!(@dataset2atom, origin_dataset)

      {origin_dataset, origin_name}
    else
      {"", ""}
    end
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
    destroy_image(:running, path)
  end

  @doc """
  Take a snapshot, create a clone from it
  and swap the clone with the original zvol.
  This would, in effect, create a layer below the current running zvol.
  """
  def make_overlay(zvol, name) do
    {_, 0} = System.cmd("sudo", ~w(zfs snapshot rpool/running/#{zvol}@frozen))
    {_, 0} = System.cmd("sudo", ~w(zfs clone rpool/running/#{zvol}@frozen rpool/overlay/#{name}))
    {_, 0} = System.cmd("sudo", ~w(zfs promote rpool/overlay/#{name}))

    register_image(:overlay, name)
    :ok
  end

  def generate_record_for_image(dataset, name)
      when dataset in [:base, :overlay, :running, :live] do
    path = "rpool/#{dataset}/#{name}"
    snap_path = "#{path}@frozen"
    guid = get_property(snap_path, "guid")
    used = get_property(path, "used") |> String.to_integer()
    volsize = get_property(path, "volsize") |> String.to_integer()
    origin = get_origin(dataset, name)

    {origin_dataset, origin_name} = origin

    storage_info(
      image_id: "#{node()}:#{guid}",
      node_id: node(),
      guid: guid,
      dataset: dataset,
      name: name,
      volsize: volsize,
      used: used,
      origin_dataset: origin_dataset,
      origin_name: origin_name
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

  def path_exist?(path) do
    case System.cmd("zfs", ~w(list -Ht all #{path})) do
      {_, 0} -> true
      {_, 1} -> false
    end
  end

  def path_from_guid(guid) do
    {:atomic, [info | _]} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(storage_info(guid: guid))
      end)

    {
      storage_info(info, :dataset),
      storage_info(info, :name)
    }
  end

  def list_images() do
    {:atomic, images} =
      Mnesia.transaction(fn ->
        Mnesia.foldl(
          fn record, acc ->
            info =
              record
              |> storage_info()
              |> Keyword.take([:guid, :dataset, :name, :used, :volsize, :node_id])
              |> Enum.into(%{})

            Map.put(acc, storage_info(record, :guid), info)
          end,
          %{},
          :storage_info
        )
      end)

    images
  end

  def prepare_image(dataset, name) do
    GenServer.call(__MODULE__, {:prepare, dataset, name})
  end

  defp submit_task(dataset, name, dom_monitor, state) do
    key = {dataset, name}
    path = "rpool/#{dataset}/#{name}"

    cond do
      Map.has_key?(state.recv_tasks, key) ->
        # transfering
        if dom_monitor == nil do
          state
        else
          update_in(state.recv_tasks[key], &[dom_monitor | &1])
        end

      Map.has_key?(state.pending, key) ->
        # pending
        if dom_monitor == nil do
          state
        else
          update_in(state.pending[key], &[dom_monitor | &1])
        end

      path_exist?(path) ->
        # already present, do nothing
        GenServer.cast(self(), {:schedule, key})

        if dom_monitor != nil do
          GenServer.cast(dom_monitor, {:image_ready, dataset, name})
        end

        state

      true ->
        # the dataset doesn't exist
        state =
          if dom_monitor == nil do
            state
          else
            put_in(state.pending[key], [dom_monitor])
          end

        case dataset do
          :base ->
            # it's a base layer
            # so the dataset doesn't have a origin
            GenServer.cast(self(), {:schedule, :base})

            if Map.has_key?(state.deps, :base) do
              update_in(state.deps[:base], &[key | &1])
            else
              put_in(state.deps[:base], [key])
            end

          _ ->
            # query info about it's origin
            {:ok, [info | _]} =
              Mnesia.transaction(fn ->
                Mnesia.match_object(storage_info(dataset: dataset, name: name))
              end)

            origin_ds = storage_info(info, :origin_dataset)
            origin_name = storage_info(info, :origin_name)
            origin = {origin_ds, origin_name}

            state =
              if Map.has_key?(state.deps, origin) do
                update_in(state.deps[origin], &[key | &1])
              else
                put_in(state.deps[origin], [key])
              end

            submit_task(origin_ds, origin_name, dom_monitor, state)
        end
    end
  end

  def force_pull_image(dataset, name, node) do
    # pull is just request the other node to push
    GenServer.cast(
      {__MODULE__, node},
      {:send, dataset, name, node()}
    )
  end

  def force_push_image(dataset, name, node) do
    GenServer.cast(
      __MODULE__,
      {:send, dataset, name, node}
    )
  end

  @impl true
  def handle_call({:prepare, dataset, name}, {pid, _tag}, state) do
    state = submit_task(dataset, name, pid, state)
    {:reply, :ok, state}
  end

  @impl true
  def handle_call({:recv, producer, dataset, name}, _from, state) do
    {notify_list, state} = pop_in(state.pending[{dataset, name}])

    if notify_list == nil do
      Logger.warning("Got a unscheduled recv task #{dataset} #{name}")
    end

    _task =
      Task.Supervisor.async_nolink(TrackingStation.Storage.RemoteTaskSupervisor, fn ->
        fifo_path = "/tmp/#{dataset}#{name}_fifo"

        if File.exists?(fifo_path) do
          Logger.warning("fifo file #{fifo_path} already exist")
          File.rm!(fifo_path)
        end

        {"", 0} = System.cmd("mkfifo", [fifo_path])

        fifo_stream = File.stream!(fifo_path, [:binary, :write], 4096 * 16)

        input_stream =
          GenStage.stream([{producer, cancel: :temporary, max_demand: 64, min_demand: 62}])

        start_time = Time.utc_now()

        zfs_recv_task =
          Task.async(fn ->
            System.shell("sudo zfs recv rpool/#{dataset}/#{name}@frozen < #{fifo_path}")
          end)

        input_stream |> Enum.into(fifo_stream)

        File.rm!(fifo_path)
        end_time = Time.utc_now()
        Logger.warning("Time spent transfering #{inspect(Time.diff(end_time, start_time))}")
        Task.await(zfs_recv_task)
        Logger.warning("await end")

        {:recv_complete, dataset, name}
      end)

    state = put_in(state.recv_tasks[{dataset, name}], notify_list)

    {:reply, :ok, state}
  end

  @impl true
  def handle_cast({:send, dataset, name, node}, state) do
    _task =
      Task.Supervisor.async_nolink(TrackingStation.Storage.RemoteTaskSupervisor, fn ->
        path = "rpool/#{dataset}/#{name}@frozen"
        fifo_path = "/tmp/#{dataset}#{name}_fifo"

        if File.exists?(fifo_path) do
          Logger.warning("fifo file #{fifo_path} already exist")
          File.rm!(fifo_path)
        end

        {"", 0} = System.cmd("mkfifo", [fifo_path])

        fifo_stream = File.stream!(fifo_path, [:binary, :read, read_ahead: 4096 * 16], 4096 * 16)

        {:ok, producer} =
          GenStage.from_enumerable(fifo_stream, demand: :accumulate, on_cancel: :stop)

        GenServer.call({__MODULE__, node}, {:recv, producer, dataset, name})

        case dataset do
          :base ->
            System.shell("sudo zfs send #{path} > #{fifo_path}")

          _ ->
            origin = get_property(path, "origin")
            System.shell("sudo zfs send -i #{origin} #{path} > #{fifo_path}")
        end

        File.rm!(fifo_path)
        {:send_complete, dataset, name}
      end)

    {:noreply, state}
  end

  @impl true
  def handle_cast({:schedule, ds_ready}, state) do
    {images, state} = pop_in(state.deps[ds_ready])

    if images != nil do
      Enum.map(images, fn {dataset, name} ->
        node = node()

        {:atomic, available_source} =
          Mnesia.transaction(fn ->
            Mnesia.match_object(
              storage_info(
                dataset: dataset,
                name: name
              )
            )
          end)

        chosen_source = available_source |> Enum.random()

        force_pull_image(dataset, name, storage_info(chosen_source, :node_id))
        {dataset, name, node}
      end)
    end

    {:noreply, state}
  end

  @impl true
  def handle_info({ref, {:recv_complete, dataset, name}}, state) do
    Process.demonitor(ref, [:flush])
    image = {dataset, name}
    {:atomic, _} = register_image(dataset, name)
    {notify_list, state} = pop_in(state.recv_tasks[image])

    if notify_list != nil do
      # notify
      notify_list
      |> Enum.map(fn dom_monitor ->
        GenServer.cast(dom_monitor, {:image_ready, dataset, name})
      end)

      state
    end

    GenServer.cast(self(), {:schedule, image})

    {:noreply, state}
  end

  @impl true
  def handle_info({ref, {:send_complete, _dataset, _name}}, state) do
    Process.demonitor(ref, [:flush])
    {:noreply, state}
  end

  @impl true
  def handle_info({:DOWN, _ref, _, _, _reason}, _state) do
    raise "Tranfer crashed"
  end
end
