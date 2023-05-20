defmodule KerbalWeb.UserAuthTest do
  use KerbalWeb.ConnCase, async: true

  alias Kerbal.Accounts
  alias KerbalWeb.UserAuth
  import Kerbal.AccountsFixtures

  @remember_me_cookie "_kerbal_web_user_remember_me"

  setup %{conn: conn} do
    conn =
      conn
      |> Map.replace!(:secret_key_base, KerbalWeb.Endpoint.config(:secret_key_base))
      |> init_test_session(%{})

    %{user: user_fixture(), conn: conn}
  end

  describe "redirect_if_user_is_authenticated/2" do
    test "redirects if user is authenticated", %{conn: conn, user: user} do
      conn = conn |> assign(:current_user, user) |> UserAuth.redirect_if_user_is_authenticated([])
      assert conn.halted
      assert %{"status" => "err", "reason" => "already_login"} = json_response(conn, 200)
    end

    test "does not redirect if user is not authenticated", %{conn: conn} do
      conn = UserAuth.redirect_if_user_is_authenticated(conn, [])
      refute conn.halted
      refute conn.status
    end
  end

  describe "require_authenticated_user/2" do
    test "redirects if user is not authenticated", %{conn: conn} do
      conn = conn |> UserAuth.require_authenticated_user([])
      assert conn.halted

      assert %{"status" => "err", "reason" => "not_login"} = json_response(conn, 200)
    end

    test "does not redirect if user is authenticated", %{conn: conn, user: user} do
      conn = conn |> assign(:current_user, user) |> UserAuth.require_authenticated_user([])
      refute conn.halted
      refute conn.status
    end
  end
end
