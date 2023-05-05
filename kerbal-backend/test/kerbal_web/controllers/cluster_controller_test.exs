defmodule KerbalWeb.ClusterControllerTest do
  use KerbalWeb.ConnCase, async: true
  import Kerbal.AccountsFixtures

  setup :register_and_log_in_user

  test "query the available nodes in the cluster", %{conn: conn} do
    conn =
      conn
      |> get(~p"/api/cluster", %{
        cpu_count: 1,
        ram_size: 2 * 1024 ** 2,
        gpu_count: 0,
        gpu: %{name: "", vram_size: 0}
      })

    assert %{"status" => "ok", "result" => result} = json_response(conn, 200)
    assert length(result) > 0
  end

  test "query, but no available nodes", %{conn: conn} do
    conn =
      conn
      |> get(~p"/api/cluster", %{
        cpu_count: 1,
        ram_size: 2 * 1024 ** 2,
        gpu_count: 100,
        gpu: %{name: "", vram_size: 0}
      })

    assert %{"status" => "ok", "result" => []} = json_response(conn, 200)
  end
end
