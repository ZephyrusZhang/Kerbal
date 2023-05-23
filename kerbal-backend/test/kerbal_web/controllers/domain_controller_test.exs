defmodule KerbalWeb.DomainControllerTest do
  use KerbalWeb.ConnCase, async: true
  import Kerbal.AccountsFixtures

  setup :register_and_log_in_user

  test "query and create and destroy domain", %{conn: conn} do
    conn =
      conn
      |> get(~p"/api/cluster", %{
        "cpu_count" => 1,
        "ram_size" => 3 * 1024 ** 2,
        "gpu_count" => 0,
        "gpu" => %{"name" => "", "vram_size" => 0}
      })
      |> doc()

    assert %{"status" => "ok", "result" => result} = json_response(conn, 200)
    assert length(result) > 0

    node = Atom.to_string(node())

    self_node_info =
      result
      |> Enum.filter(&(Map.fetch!(&1, "node_id") == node))
      |> Enum.fetch!(0)

    gpus = self_node_info["gpus"]
    cpu_count = self_node_info["free_cpu_count"]

    conn =
      conn
      |> get(~p"/api/cluster/storage/list")

    assert %{"status" => "ok", "result" => images} = json_response(conn, 200)

    image = Enum.fetch!(images, 0)

    conn =
      conn
      |> post(~p"/api/cluster/domain", %{
        "cpu_count" => cpu_count,
        "ram_size" => 2 * 1024 ** 2,
        "gpus" => gpus,
        "image_id" => image["id"]
      })
      |> doc()

    assert %{"status" => "ok", "domain_uuid" => domain_uuid} = json_response(conn, 200)

    # try it again, it should cause an error, because gpus are occupied
    conn =
      conn
      |> post(~p"/api/cluster/domain", %{
        "cpu_count" => cpu_count,
        "ram_size" => 2 * 1024 ** 2,
        "gpus" => gpus,
        "image_id" => image["id"]
      })
      |> doc()

    assert %{"status" => "err"} = json_response(conn, 200)

    # try to get information about this domain
    conn = conn |> get(~p"/api/cluster/domain/#{domain_uuid}") |> doc()

    assert %{"status" => "ok", "result" => info} = json_response(conn, 200)

    assert %{
             "domain_uuid" => domain_uuid,
             # 2 * 1024**2 = 2097152
             "spec" => %{"cpu_count" => ^cpu_count, "ram_size" => 2_097_152}
           } = info

    # now destroy it
    conn = conn |> delete(~p"/api/cluster/domain/#{domain_uuid}") |> doc()

    assert %{"status" => "ok"} = json_response(conn, 200)
  end

  test "query domain that doesn't exist", %{conn: conn} do
    mock_uuid = "12345678-1234-1234-0000-123412341234"
    conn = conn |> get(~p"/api/cluster/domain/#{mock_uuid}") |> doc()
    assert %{"status" => "err", "reason" => "not_exist"} = json_response(conn, 200)
  end

  test "delete domain that doesn't exist", %{conn: conn} do
    mock_uuid = "12345678-1234-1234-0000-123412341234"
    conn = conn |> delete(~p"/api/cluster/domain/#{mock_uuid}") |> doc()
    assert %{"status" => "err", "reason" => "not_exist"} = json_response(conn, 200)
  end
end
