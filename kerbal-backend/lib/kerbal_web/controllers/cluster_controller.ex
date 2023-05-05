defmodule KerbalWeb.ClusterController do
  use KerbalWeb, :controller

  def create(conn, %{"cpu_count" => cpu_count, "ram_size" => ram_size, "gpus" => gpus}) do
    gpus =
      gpus
      |> Enum.map(fn %{"bus" => bus, "slot" => slot, "function" => function} ->
        %{bus: bus, slot: slot, function: function}
      end)

    TrackingStation.Scheduler.create_vm(node(), %{
      cpu_count: cpu_count,
      ram_size: ram_size,
      gpus: gpus
    })
  end

  def query(conn, %{
        "cpu_count" => cpu_count,
        "ram_size" => ram_size,
        "gpu_count" => gpu_count,
        "gpu" => %{"name" => name, "vram_size" => vram_size}
      }) do
    TrackingStation.Scheduler.lookup_resource(%{
      cpu_count: cpu_count,
      ram_size: ram_size,
      gpu_count: gpu_count,
      gpu: %{
        name: name,
        vram_size: vram_size
      }
    })
  end
end
