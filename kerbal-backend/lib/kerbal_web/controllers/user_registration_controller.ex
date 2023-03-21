defmodule KerbalWeb.UserRegistrationController do
  use KerbalWeb, :controller

  alias Kerbal.Accounts
  alias KerbalWeb.UserAuth

  # register user and send confirmation email
  def create(conn, %{"user_params" => user_params}) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        {:ok, _} =
          Accounts.deliver_user_confirmation_instructions(
            user,
            &url(~p"/api/users/confirm/#{&1}")
          )

        # if error, than user is already confirmed

        # User created successfully, log in at the same time
        UserAuth.log_in_user(conn, user)

      {:error, _changeset} ->
        json(conn, %{status: :err, reason: "Invalid email"})
    end
  end
end
