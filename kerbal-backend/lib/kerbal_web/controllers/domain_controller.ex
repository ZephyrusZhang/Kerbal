defmodule KerbalWeb.DomainController do
  use KerbalWeb, :controller

  defp cast_to_int(x) when is_integer(x) do
    x
  end

  defp cast_to_int(x) when is_binary(x) do
    String.to_integer(x)
  end

  def query(conn, %{"domain_uuid" => domain_uuid}) do
    user_id = conn.assigns[:current_user]

    case TrackingStation.Scheduler.get_domain_info(domain_uuid, user_id) do
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

  def create(conn, %{"cpu_count" => cpu_count, "ram_size" => ram_size, "gpus" => gpus}) do
    user_id = conn.assigns[:current_user]

    gpus =
      gpus
      |> Enum.map(fn %{"gpu_id" => gpu_id, "bus" => bus, "slot" => slot, "function" => function} ->
        %{gpu_id: gpu_id, bus: bus, slot: slot, function: function}
      end)

    case TrackingStation.Scheduler.create_domain(node(), user_id, %{
           cpu_count: cpu_count |> cast_to_int(),
           ram_size: ram_size |> cast_to_int(),
           gpus: gpus
         }) do
      {:ok, domain_uuid} ->
        json(conn, %{status: :ok, domain_uuid: domain_uuid})

      {:error, reason} ->
        json(conn, %{status: :err, reason: inspect(reason)})
    end
  end

  def delete(conn, %{"domain_uuid" => domain_uuid}) do
    user_id = conn.assigns[:current_user]

    case TrackingStation.Scheduler.DomainMonitor.destroy(domain_uuid, user_id) do
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
