defmodule KerbalWeb.UserSessionController do
  use KerbalWeb, :controller

  alias Kerbal.Accounts
  alias KerbalWeb.UserAuth

  def create(conn, %{"user_params" => user_params}) do
    %{"email" => email, "password" => password} = user_params

    if user = Accounts.get_user_by_email_and_password(email, password) do
      # Welcome back
      UserAuth.log_in_user(conn, user.id)
    else
      # In order to prevent user enumeration attacks, don't disclose whether the email is registered.
      json(conn, %{status: :err, reason: "Invalid email or password"})
    end
  end

  def renew(conn, _params) do
    user = conn.assigns.current_user
    UserAuth.log_in_user(conn, user.id)
  end

  # is this still in use?
  def delete(conn, _params) do
    # Logged out successfully
    UserAuth.log_out_user(conn)
  end
end
