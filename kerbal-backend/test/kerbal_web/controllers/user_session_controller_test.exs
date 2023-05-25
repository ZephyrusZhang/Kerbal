defmodule KerbalWeb.UserSessionControllerTest do
  use KerbalWeb.ConnCase, async: true

  import Kerbal.AccountsFixtures

  setup do
    %{user: user_fixture()}
  end

  describe "POST /api/users/log_in" do
    test "logs the user in", %{conn: conn, user: user} do
      conn =
        conn
        |> post(~p"/api/users/log_in", %{
          "user_params" => %{"email" => user.email, "password" => valid_user_password()}
        })
        |> doc()

      assert %{"status" => "ok", "token" => _token} = json_response(conn, 200)
    end

    test "emits error message with invalid credentials", %{conn: conn, user: user} do
      conn =
        conn
        |> post(~p"/api/users/log_in", %{
          "user_params" => %{"email" => user.email, "password" => "invalid_password"}
        })
        |> doc()

      response = json_response(conn, 200)
      assert %{"status" => "err", "reason" => "Invalid email or password"} = response
    end
  end

  describe "POST /api/users/renew" do
    test "renews the user session", %{conn: conn, user: user} do
      conn =
        conn
        |> assign(:current_user, user)
        |> post("/api/users/renew")
        |> doc()

      assert %{"status" => "ok", "token" => _token} = json_response(conn, 200)
    end
  end

end
