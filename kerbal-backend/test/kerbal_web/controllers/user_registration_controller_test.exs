defmodule KerbalWeb.UserRegistrationControllerTest do
  use KerbalWeb.ConnCase, async: true

  import Kerbal.AccountsFixtures

  describe "POST /api/users/register" do
    @tag :capture_log
    test "creates account and logs the user in", %{conn: conn} do
      email = unique_user_email()

      conn =
        post(conn, ~p"/api/users/register", %{
          "user_params" => valid_user_attributes(email: email)
        })

      assert get_session(conn, :user_token)
      assert %{"status" => "ok"} = json_response(conn, 200)
    end

    test "errors for invalid data", %{conn: conn} do
      conn =
        post(conn, ~p"/api/users/register", %{
          "user_params" => %{"email" => "with spaces", "password" => "too short"}
        })

      assert %{"status" => "err"} = json_response(conn, 200)
    end
  end
end
