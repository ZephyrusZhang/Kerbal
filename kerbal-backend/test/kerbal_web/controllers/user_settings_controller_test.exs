defmodule KerbalWeb.UserSettingsControllerTest do
  use KerbalWeb.ConnCase, async: true

  alias Kerbal.Accounts
  import Kerbal.AccountsFixtures

  setup :register_and_log_in_user

  describe "PUT /api/users/settings (change password form)" do
    test "updates the user password and resets tokens", %{conn: conn, user: user} do
      new_password_conn =
        conn
        |> put(~p"/api/users/settings", %{
          "action" => "update_password",
          "current_password" => valid_user_password(),
          "user_params" => %{
            "password" => "new valid password",
            "password_confirmation" => "new valid password"
          }
        })
        |> doc()

      assert %{"status" => "ok"} = json_response(new_password_conn, 200)

      assert Accounts.get_user_by_email_and_password(user.email, "new valid password")
    end

    test "does not update password on invalid data", %{conn: conn} do
      old_password_conn =
        conn
        |> put(~p"/api/users/settings", %{
          "action" => "update_password",
          "current_password" => "invalid",
          "user_params" => %{
            "password" => "too short",
            "password_confirmation" => "does not match"
          }
        })
        |> doc()

      assert %{"status" => "err"} = json_response(old_password_conn, 200)

      assert get_session(old_password_conn, :user_token) == get_session(conn, :user_token)
    end
  end

  describe "PUT /api/users/settings (change email form)" do
    @tag :capture_log
    test "updates the user email", %{conn: conn, user: user} do
      conn =
        conn
        |> put(~p"/api/users/settings", %{
          "action" => "update_email",
          "current_password" => valid_user_password(),
          "user_params" => %{"email" => unique_user_email()}
        })
        |> doc()

      assert %{"status" => "ok"} = json_response(conn, 200)

      assert Accounts.get_user_by_email(user.email)
    end

    test "does not update email on invalid data", %{conn: conn} do
      conn =
        conn
        |> put(~p"/api/users/settings", %{
          "action" => "update_email",
          "current_password" => "invalid",
          "user_params" => %{"email" => "with spaces"}
        })
        |> doc()

        assert %{"status" => "err"} = json_response(conn, 200)
    end
  end

  describe "GET /users/settings/confirm_email/:token" do
    setup %{user: user} do
      email = unique_user_email()

      token =
        extract_user_token(fn url ->
          Accounts.deliver_user_update_email_instructions(%{user | email: email}, user.email, url)
        end)

      %{token: token, email: email}
    end

    test "updates the user email once", %{conn: conn, user: user, token: token, email: email} do
      conn =
        conn
        |> get(~p"/api/users/settings/confirm_email/#{token}")
        |> doc()
      assert %{"status" => "ok"} = json_response(conn, 200)

      # assert redirected_to(conn) == ~p"/users/settings"

      refute Accounts.get_user_by_email(user.email)
      assert Accounts.get_user_by_email(email)

      conn =
        conn
        |> get(~p"/api/users/settings/confirm_email/#{token}")
        |> doc()
      assert %{"status" => "err"} = json_response(conn, 200)
    end

    test "does not update email with invalid token", %{conn: conn, user: user} do
      conn =
        conn
        |> get(~p"/api/users/settings/confirm_email/oops")
        |> doc()
      assert %{"status" => "err"} = json_response(conn, 200)

      assert Accounts.get_user_by_email(user.email)
    end

    test "redirects if user is not logged in", %{token: token} do
      conn = build_conn()
      conn = get(conn, ~p"/api/users/settings/confirm_email/#{token}")
      assert redirected_to(conn) == "/users/log_in"
    end
  end
end
