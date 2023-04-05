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

      assert get_session(conn, :user_token)
      assert %{"status" => "ok"} = json_response(conn, 200)
    end

    test "logs the user in with remember me", %{conn: conn, user: user} do
      conn =
        conn
        |> post(~p"/api/users/log_in", %{
          "user_params" => %{
            "email" => user.email,
            "password" => valid_user_password(),
            "remember_me" => "true"
          }
        })
        |> doc()

      assert conn.resp_cookies["_kerbal_web_user_remember_me"]
      assert %{"status" => "ok"} = json_response(conn, 200)
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

  describe "DELETE /api/users/log_out" do
    test "logs the user out", %{conn: conn, user: user} do
      conn =
        conn
        |> log_in_user(user)
        |> delete(~p"/api/users/log_out")
        |> doc()
      assert %{"status" => "ok"} = json_response(conn, 200)
      refute get_session(conn, :user_token)
    end

    test "succeeds even if the user is not logged in", %{conn: conn} do
      conn =
        conn
        |> delete(~p"/api/users/log_out")
        |> doc()
      assert %{"status" => "ok"} = json_response(conn, 200)
      refute get_session(conn, :user_token)
    end
  end
end
