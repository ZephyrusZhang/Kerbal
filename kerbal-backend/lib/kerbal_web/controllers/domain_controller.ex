defmodule KerbalWeb.DomainController do
  alias KerbalWeb.DomainController
  use KerbalWeb, :controller

  alias TrackingStation.Scheduler.DomainMonitor
  alias TrackingStation.Scheduler

  defp cast_to_int(x) when is_integer(x) do
    x
  end

  defp cast_to_int(x) when is_binary(x) do
    String.to_integer(x)
  end

  def list(conn, _params) do
    user_id = conn.assigns.current_user.id

    domains = Scheduler.list_user_domains(user_id)
    json(conn, domains)
  end

  def query(conn, %{"domain_uuid" => domain_uuid}) do
    user_id = conn.assigns.current_user.id

    case DomainMonitor.get_info(domain_uuid, user_id) do
      {:ok, info} ->
        json(conn, %{status: :ok, result: info})

      {:error, :not_exist} ->
        json(conn, %{status: :err, reason: :not_exist})

      {:error, :permission_denied} ->
        json(conn, %{status: :err, reason: :permission_denied})

      _ ->
        json(conn, %{status: :err, reason: "unknown error"})
    end
  end

  def create(conn, %{
        "cpu_count" => cpu_count,
        "ram_size" => ram_size,
        "gpus" => gpus,
        "image_id" => image_id
      }) do
    user_id = conn.assigns.current_user.id

    gpus =
      gpus
      |> Enum.map(fn %{"gpu_id" => gpu_id, "bus" => bus, "slot" => slot, "function" => function} ->
        %{gpu_id: gpu_id, bus: bus, slot: slot, function: function}
      end)

    case Scheduler.create_domain(node(), user_id, %{
           cpu_count: cpu_count |> cast_to_int(),
           ram_size: ram_size |> cast_to_int(),
           gpus: gpus,
           image_id: image_id
         }) do
      {:ok, domain_uuid} ->
        json(conn, %{status: :ok, domain_uuid: domain_uuid})

      {:error, reason} ->
        json(conn, %{status: :err, reason: inspect(reason)})
    end
  end

  def delete(conn, %{"domain_uuid" => domain_uuid}) do
    user_id = conn.assigns.current_user.id

    case DomainMonitor.destroy(domain_uuid, user_id) do
      :ok ->
        json(conn, %{status: :ok})

      {:error, :not_exist} ->
        json(conn, %{status: :err, reason: :not_exist})

      {:error, :permission_denied} ->
        json(conn, %{status: :err, reason: :permission_denied})

      _ ->
        json(conn, %{status: :err, reason: "unknown error"})
    end
  end

  def snapshot(conn, %{"domain_uuid" => domain_uuid, "name" => name}) do
    user_id = conn.assigns.current_user.id

    case DomainMonitor.snapshot(domain_uuid, user_id, name) do
      :ok ->
        json(conn, %{status: :ok})

      {:error, :not_exist} ->
        json(conn, %{status: :err, reason: :not_exist})

      {:error, :permission_denied} ->
        json(conn, %{status: :err, reason: :permission_denied})

      _ ->
        json(conn, %{status: :err, reason: "unknown error"})
    end
  end
end
