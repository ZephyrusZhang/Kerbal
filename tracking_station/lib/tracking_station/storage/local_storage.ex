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
  alias TrackingStation.Storage.RemoteTaskSupervisor
  alias :mnesia, as: Mnesia
  @pool "rpool"

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

    list_tmp_images()
    |> Enum.map(&destroy_image(:tmp, &1))

    # submit info about local storages to mnesia
    local_storages =
      [:base, :overlay, :live]
      |> Enum.flat_map(fn dataset ->
        list_path("#{@pool}/#{dataset}")
        |> Enum.map(fn name -> generate_record_for_image(dataset, name) end)
      end)

    {:atomic, _} =
      Mnesia.transaction(fn ->
        local_storages
        |> Enum.map(fn record ->
          Mnesia.write(record)
        end)
      end)

    {:ok, %{}}
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

  defp find_image_available_nodes(dataset, name) do
    {:atomic, records} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(storage_info(dataset: dataset, name: name))
      end)

    records
    |> Enum.map(&storage_info(&1, :node_id))
  end

  defp to_path(dataset, name) do
    "#{@pool}/#{dataset}/#{name}"
  end

  defp to_snap_path(dataset, name) do
    "#{@pool}/#{dataset}/#{name}@frozen"
  end

  defp register_image(dataset, name) do
    record = generate_record_for_image(dataset, name)

    Mnesia.transaction(fn ->
      Mnesia.write(record)
    end)
  end

  def allocate_tmp_name() do
    UUID.uuid1()
  end

  def create_from_tmp(tmp_name, dataset, name) do
    tmp_path = to_path(:tmp, tmp_name)
    target_path = to_path(dataset, name)

    if path_exist?(target_path) do
      destroy_image(:tmp, tmp_name)
      :ok
    else
      case System.cmd("sudo", ~w(zfs rename #{tmp_path} #{target_path}), stderr_to_stdout: true) do
        {"", 0} ->
          register_image(dataset, name)
          :ok

        {output, 1} ->
          destroy_image(:tmp, tmp_name)
          {:error, output}
      end
    end
  end

  def destroy_image(:tmp, name) do
    path = to_path(:tmp, name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy -r #{path}))
  end

  def destroy_image(dataset, name) when dataset in [:running, :live] do
    valid_name!(name)
    path = to_path(dataset, name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy #{path}))
  end

  def destroy_image(dataset, name) when dataset in [:base, :overlay] do
    valid_name!(name)
    :ok = unregister_image(dataset, name)
    path = to_path(dataset, name)
    snap_path = to_snap_path(dataset, name)
    {_, 0} = System.cmd("sudo", ~w(zfs destroy #{snap_path}))
    {_, 0} = System.cmd("sudo", ~w(zfs destroy #{path}))
  end

  defp get_property(path, property) do
    {result, 0} = System.cmd("zfs", ~w(get #{property} -Hp #{path}))

    result
    |> String.split()
    |> Enum.fetch!(2)
  end

  def get_origin_local(dataset, name) do
    origin_path = get_property("rpool/#{dataset}/#{name}", "origin")

    if origin_path != "-" do
      ["rpool", origin_dataset, origin_name] = origin_path |> String.split("/")
      origin_dataset = Map.fetch!(@dataset2atom, origin_dataset)
      [origin_name, "frozen"] = String.split(origin_name, "@")

      {origin_dataset, origin_name}
    else
      {"", ""}
    end
  end

  def get_origin(dataset, name) do
    {:atomic, result} =
      Mnesia.transaction(fn ->
        Mnesia.match_object(storage_info(dataset: dataset, name: name))
      end)

    case result do
      [] ->
        {:error, :not_exist}

      [info | _] ->
        origin_dataset = storage_info(info, :origin_dataset)
        origin_name = storage_info(info, :origin_name)
        {:ok, {origin_dataset, origin_name}}
    end
  end

  def get_parent_path(:base, name) do
    {:ok, [{:base, name}]}
  end

  def get_parent_path(dataset, name) do
    case get_origin(dataset, name) do
      {:ok, {origin_dataset, origin_name}} ->
        case get_parent_path(origin_dataset, origin_name) do
          {:ok, parent_path} ->
            {:ok, [{dataset, name} | parent_path]}

          {:error, _} ->
            {:error, :parent_not_exist}
        end

      {:error, :not_exist} ->
        {:error, :not_exist}
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

  defp generate_record_for_image(dataset, name)
       when dataset in [:base, :overlay, :running, :live] do
    path = to_path(dataset, name)
    snap_path = to_snap_path(dataset, name)
    guid = get_property(snap_path, "guid")
    used = get_property(path, "used") |> String.to_integer()
    volsize = get_property(path, "volsize") |> String.to_integer()
    origin = get_origin_local(dataset, name)

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

  def list_tmp_images() do
    list_path("rpool/tmp")
  end

  def path_exist?(path) do
    case System.cmd("zfs", ~w(list -Ht all #{path}), stderr_to_stdout: true) do
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
              |> then(&Map.put(&1, :available_nodes, [&1.node_id]))
              |> Map.delete(:node_id)

            Map.update(
              acc,
              storage_info(record, :guid),
              info,
              &Map.replace(&1, :available_nodes, info.available_nodes ++ &1.available_nodes)
            )
          end,
          %{},
          :storage_info
        )
      end)

    images
    |> Map.values()
    |> Enum.map(fn image ->
      image
      |> then(&Map.put(&1, :id, &1.guid))
      |> Map.delete(:guid)
    end)
  end

  def prepare_image(dataset, name) do
    case get_parent_path(dataset, name) do
      {:ok, parents} ->
        parents
        |> Enum.reverse()
        |> Stream.reject(fn {dataset, name} ->
          path = to_path(dataset, name)
          path_exist?(path)
        end)
        |> Enum.reduce_while(:ok, fn {dataset, name}, _acc ->
          case find_image_available_nodes(dataset, name) do
            [] ->
              {:halt, {:error, :not_available}}

            available_nodes ->
              pull_task = pull_image(dataset, name, Enum.random(available_nodes))
              :ok = Task.await(pull_task, :infinity)
              {:cont, :ok}
          end
        end)

      {:error, reason} ->
        {:error, reason}
    end
  end

  def recv_image(producer, dataset, name) do
    tmp_name = allocate_tmp_name()
    tmp_snap_path = to_snap_path(:tmp, tmp_name)
    fifo_path = "/tmp/#{tmp_name}_fifo"

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
        System.shell("sudo zfs recv #{tmp_snap_path} < #{fifo_path}")
      end)

    input_stream |> Enum.into(fifo_stream)

    File.rm!(fifo_path)
    end_time = Time.utc_now()

    Logger.warning("Time spent streaming #{inspect(Time.diff(end_time, start_time))}")

    case Task.await(zfs_recv_task) do
      {"", 0} ->
        Logger.warning("Time spent completing #{inspect(Time.diff(end_time, start_time))}")
        create_from_tmp(tmp_name, dataset, name)

      _ ->
        {:error, :recv_error}
    end
  end

  def pull_image(dataset, name, source_node) do
    target_node = node()

    Task.Supervisor.async({RemoteTaskSupervisor, source_node}, fn ->
      path = "rpool/#{dataset}/#{name}"
      snap_path = "#{path}@frozen"
      fifo_path = "/tmp/#{dataset}#{name}_fifo"

      if File.exists?(fifo_path) do
        Logger.warning("fifo file #{fifo_path} already exist")
        File.rm!(fifo_path)
      end

      {"", 0} = System.cmd("mkfifo", [fifo_path])

      fifo_stream = File.stream!(fifo_path, [:binary, :read, read_ahead: 4096 * 16], 4096 * 16)

      {:ok, producer} =
        GenStage.from_enumerable(fifo_stream, demand: :accumulate, on_cancel: :stop)

      recv_task =
        Task.Supervisor.async({RemoteTaskSupervisor, target_node}, __MODULE__, :recv_image, [
          producer,
          dataset,
          name
        ])

      case dataset do
        :base ->
          System.shell("sudo zfs send #{snap_path} > #{fifo_path}")

        _ ->
          origin = get_property(path, "origin")
          System.shell("sudo zfs send -i #{origin} #{snap_path} > #{fifo_path}")
      end

      File.rm!(fifo_path)
      # wait 60 sec for the receiver to complete
      Task.await(recv_task, 60_000)
    end)
  end
end
