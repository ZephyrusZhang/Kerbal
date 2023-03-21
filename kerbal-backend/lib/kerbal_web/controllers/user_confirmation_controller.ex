defmodule KerbalWeb.UserConfirmationController do
  use KerbalWeb, :controller

  alias Kerbal.Accounts

  # re-send confirmation email
  def create(conn, %{"user_params" => %{"email" => email}}) do
    if user = Accounts.get_user_by_email(email) do
      Accounts.deliver_user_confirmation_instructions(
        user,
        &url(~p"/api/users/confirm/#{&1}")
      )
      json(conn, %{status: :ok})
    else
      json(conn, %{status: :err})
    end
  end

  # Do not log in the user after confirmation to avoid a
  # leaked token giving the user access to the account.
  def update(conn, %{"token" => token}) do
    case Accounts.confirm_user(token) do
      {:ok, _} ->
        # User confirmed successfully
        json(conn, %{status: :ok})

      :error ->
        # If there is a current user and the account was already confirmed,
        # then odds are that the confirmation link was already visited, either
        # by some automation or by the user themselves, so we redirect without
        # a warning message.
        case conn.assigns do
          %{current_user: %{confirmed_at: confirmed_at}} when not is_nil(confirmed_at) ->
            json(conn, %{status: :ok})

          %{} ->
            # User confirmation link is invalid or it has expired.
            json(conn, %{status: :err, reason: "link is invalid or it has expired"})
        end
    end
  end
end
