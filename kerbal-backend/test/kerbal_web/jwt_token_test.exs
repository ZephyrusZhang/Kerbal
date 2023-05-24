defmodule KerbalWeb.JWTTokenTest do
  use KerbalWeb.ConnCase, async: true
  import KerbalWeb.JWTToken
  alias Joken.Signer

  setup do
    extra_claims = %{claims: "expected"}
    valid_token = KerbalWeb.JWTToken.generate_and_sign!(extra_claims)
    invalid_token = "invalid_token"

    {:ok, valid_token: valid_token, invalid_token: invalid_token}
  end

  test "fetch_jwt with valid token", %{valid_token: valid_token} do
    conn = build_conn()
    |> put_req_header("authorization", valid_token)

    updated_conn = fetch_jwt(conn, [])

    assert updated_conn.assigns[:claims]["claims"] == "expected"
  end

  test "fetch_jwt with invalid token", %{invalid_token: invalid_token} do
    conn = build_conn()
    |> put_req_header("authorization", invalid_token)

    updated_conn = fetch_jwt(conn, [])

    assert updated_conn == conn
  end

  test "fetch_jwt with no authorization header" do
    conn = build_conn()

    updated_conn = fetch_jwt(conn, [])

    assert updated_conn == conn
  end
end
