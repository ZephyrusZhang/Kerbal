defmodule KerbalWeb.UserResetPasswordController do
  use KerbalWeb, :controller

  alias Kerbal.Accounts

  def create(conn, %{"user_params" => %{"email" => email}}) do
    if user = Accounts.get_user_by_email(email) do
      Accounts.deliver_user_reset_password_instructions(
        user,
        &url(~p"/api/users/reset_password/#{&1}")
      )
    end

    # "If your email is in our system, you will receive instructions to reset your password shortly."
    json(conn, %{status: :ok})
  end

  def query(conn, %{"token" => token}) do
    if user = Accounts.get_user_by_reset_password_token(token) do
      json(conn, %{status: :ok, user: user})
      # conn |> assign(:user, user) |> assign(:token, token)
    else
      json(conn, %{status: :err, reason: "link is invalid or it has expired"})
    end
  end

  # Do not log in the user after reset password to avoid a
  # leaked token giving the user access to the account.
  def update(conn, %{"token" => token, "user_params" => user_params}) do
    if user = Accounts.get_user_by_reset_password_token(token) do
      case Accounts.reset_user_password(user, user_params) do
        {:ok, _} ->
          # Password reset successfully.
          json(conn, %{status: :ok})

        {:error, _changeset} ->
          json(conn, %{status: :err, reason: "failed to update user params"})
      end
    else
      json(conn, %{status: :err, reason: "link is invalid or it has expired"})
    end
  end
end
