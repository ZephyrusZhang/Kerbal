defmodule KerbalWeb.ClusterController do
  use KerbalWeb, :controller

  defp cast_to_int(x) when is_integer(x) do
    x
  end

  defp cast_to_int(x) when is_binary(x) do
    String.to_integer(x)
  end

  def query(conn, %{
        "cpu_count" => cpu_count,
        "ram_size" => ram_size,
        "gpu_count" => gpu_count,
        "gpu" => %{"name" => name, "vram_size" => vram_size}
      }) do
    # TODO use changeset
    name =
      if name == "" or name == nil do
        :_
      else
        name
      end

    result =
      TrackingStation.Scheduler.lookup_resource(
        %{
          cpu_count: cpu_count |> cast_to_int(),
          ram_size: ram_size |> cast_to_int(),
          gpu_count: gpu_count |> cast_to_int(),
          gpu: %{
            name: name,
            vram_size: vram_size |> cast_to_int()
          }
        }
      )

    json(conn, %{
      status: :ok,
      result: result
    })
  end
end
