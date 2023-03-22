defmodule KerbalWeb.UserSettingsController do
  use KerbalWeb, :controller

  alias Kerbal.Accounts

  plug :assign_email_and_password_changesets

  def update(conn, %{"action" => "update_email"} = params) do
    %{"current_password" => password, "user_params" => user_params} = params
    user = conn.assigns.current_user

    case Accounts.apply_user_email(user, password, user_params) do
      {:ok, applied_user} ->
        Accounts.deliver_user_update_email_instructions(
          applied_user,
          user.email,
          &url(~p"/api/users/settings/confirm_email/#{&1}")
        )

        # A link to confirm your email change has been sent to the new address.
        json(conn, %{status: :ok})

      {:error, _changeset} ->
        json(conn, %{status: :err})
    end
  end

  def update(conn, %{"action" => "update_password"} = params) do
    %{"current_password" => password, "user_params" => user_params} = params
    user = conn.assigns.current_user

    case Accounts.update_user_password(user, password, user_params) do
      {:ok, _user} ->
        # Password updated successfully
        json(conn, %{status: :ok})

      {:error, _changeset} ->
        json(conn, %{status: :err})
    end
  end

  def confirm_email(conn, %{"token" => token}) do
    case Accounts.update_user_email(conn.assigns.current_user, token) do
      :ok ->
        # Email changed successfully.
        json(conn, %{status: :ok})

      :error ->
        # Email change link is invalid or it has expired.
        json(conn, %{status: :err})

    end
  end

  defp assign_email_and_password_changesets(conn, _opts) do
    user = conn.assigns.current_user

    conn
    |> assign(:email_changeset, Accounts.change_user_email(user))
    |> assign(:password_changeset, Accounts.change_user_password(user))
  end
end
