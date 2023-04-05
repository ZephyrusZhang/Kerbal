defmodule KerbalWeb.UserResetPasswordControllerTest do
  use KerbalWeb.ConnCase, async: true

  alias Kerbal.Accounts
  alias Kerbal.Repo
  import Kerbal.AccountsFixtures

  setup do
    %{user: user_fixture()}
  end

  describe "POST /api/users/reset_password" do
    @tag :capture_log
    test "sends a new reset password token", %{conn: conn, user: user} do
      conn =
        conn
        |> post(~p"/api/users/reset_password", %{
          "user_params" => %{"email" => user.email}
        })
        |> doc()

      assert %{"status" => "ok"} = json_response(conn, 200)

      assert Repo.get_by!(Accounts.UserToken, user_id: user.id).context == "reset_password"
    end

    test "does not send reset password token if email is invalid", %{conn: conn} do
      conn =
        conn
        |> post(~p"/api/users/reset_password", %{
          "user_params" => %{"email" => "unknown@example.com"}
        })
        |> doc()

      # the return is the same as a valid request to prevent attack
      assert %{"status" => "ok"} = json_response(conn, 200)

      assert Repo.all(Accounts.UserToken) == []
    end
  end

  describe "PUT /api/users/reset_password/:token" do
    setup %{user: user} do
      token =
        extract_user_token(fn url ->
          Accounts.deliver_user_reset_password_instructions(user, url)
        end)

      %{token: token}
    end

    test "resets password once", %{conn: conn, user: user, token: token} do
      conn =
        conn
        |> put(~p"/api/users/reset_password/#{token}", %{
          "user_params" => %{
            "password" => "new valid password",
            "password_confirmation" => "new valid password"
          }
        })
        |> doc()

      assert %{"status" => "ok"} = json_response(conn, 200)
      refute get_session(conn, :user_token)

      assert Accounts.get_user_by_email_and_password(user.email, "new valid password")
    end

    test "does not reset password on invalid data", %{conn: conn, token: token} do
      conn =
        conn
        |> put(~p"/api/users/reset_password/#{token}", %{
          "user_params" => %{
            "password" => "too short",
            "password_confirmation" => "does not match"
          }
        })
        |> doc()

      assert %{"status" => "err"} = json_response(conn, 200)
    end

    test "does not reset password with invalid token", %{conn: conn} do
      conn =
        conn
        |> put(~p"/api/users/reset_password/oops", %{
          "user_params" => %{
            "password" => "new valid password",
            "password_confirmation" => "new valid password"
          }
        })
        |> doc()

      assert %{"status" => "err"} = json_response(conn, 200)
    end
  end
end
