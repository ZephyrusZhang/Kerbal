defmodule KerbalWeb.StorageControllerTest do
  use KerbalWeb.ConnCase, async: true
  import Kerbal.AccountsFixtures

  setup :register_and_log_in_user

  test "query available images", %{conn: conn} do
    conn = conn |> get(~p"/api/cluster/storage/list")

    assert %{"status" => "ok", "result" => _result} = json_response(conn, 200)
  end
end
