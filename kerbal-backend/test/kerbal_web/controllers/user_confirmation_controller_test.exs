defmodule KerbalWeb.UserConfirmationControllerTest do
  use KerbalWeb.ConnCase, async: true

  alias Kerbal.Accounts
  alias Kerbal.Repo
  import Kerbal.AccountsFixtures

  setup do
    %{user: user_fixture()}
  end

  describe "POST /api/users/confirm" do
    @tag :capture_log
    test "sends a new confirmation token", %{conn: conn, user: user} do
      conn =
        conn
        |> post(~p"/api/users/confirm", %{
          "user_params" => %{"email" => user.email}
        })
        |> doc()

      assert %{"status" => "ok"} = json_response(conn, 200)

      assert Repo.get_by!(Accounts.UserToken, user_id: user.id).context == "confirm"
    end

    test "does not send confirmation token if User is confirmed", %{conn: conn, user: user} do
      Repo.update!(Accounts.User.confirm_changeset(user))

      conn =
        conn
        |> post(~p"/api/users/confirm", %{
          "user_params" => %{"email" => user.email}
        })
        |> doc()

      assert %{"status" => "ok"} = json_response(conn, 200)

      refute Repo.get_by(Accounts.UserToken, user_id: user.id)
    end

    test "does not send confirmation token if email is invalid", %{conn: conn} do
      conn =
        conn
        |> post(~p"/api/users/confirm", %{
          "user_params" => %{"email" => "unknown@example.com"}
        })
        |> doc()

      assert %{"status" => "err"} = json_response(conn, 200)

      assert Repo.all(Accounts.UserToken) == []
    end
  end

  describe "POST /api/users/confirm/:token" do
    test "confirms the given token once", %{conn: conn, user: user} do
      token =
        extract_user_token(fn url ->
          Accounts.deliver_user_confirmation_instructions(user, url)
        end)

      conn = post(conn, ~p"/api/users/confirm/#{token}")
      assert %{"status" => "ok"} = json_response(conn, 200)

      assert Accounts.get_user!(user.id).confirmed_at
      refute get_session(conn, :user_token)
      assert Repo.all(Accounts.UserToken) == []

      # When not logged in
      conn = post(conn, ~p"/api/users/confirm/#{token}")
      response = json_response(conn, 200)
      assert %{"status" => "err", "reason" => "link is invalid or it has expired"} = response

      # When logged in
      conn =
        build_conn()
        |> log_in_user(user)
        |> post(~p"/api/users/confirm/#{token}")

      assert %{"status" => "ok"} = json_response(conn, 200)
    end

    test "does not confirm email with invalid token", %{conn: conn, user: user} do
      conn =
        conn
        |> post(~p"/api/users/confirm/oops")
        |> doc()
      assert %{"status" => "err"} = json_response(conn, 200)

      refute Accounts.get_user!(user.id).confirmed_at
    end
  end
end
