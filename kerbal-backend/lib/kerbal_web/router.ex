defmodule KerbalWeb.Router do
  use KerbalWeb, :router

  import KerbalWeb.UserAuth
  import KerbalWeb.JWTToken

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_jwt
    plug :fetch_session
    plug :fetch_current_user
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:kerbal, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: KerbalWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  scope "/api", KerbalWeb do
    pipe_through [:api, :require_authenticated_user]

    get "/cluster", ClusterController, :query

    get "/cluster/domain/:domain_uuid", DomainController, :query
    post "/cluster/domain", DomainController, :create
    delete "/cluster/domain/:domain_uuid", DomainController, :delete
  end

  ## Authentication routes

  scope "/api", KerbalWeb do
    pipe_through [:api, :redirect_if_user_is_authenticated]

    post "/users/register", UserRegistrationController, :create
    post "/users/log_in", UserSessionController, :create
    post "/users/reset_password", UserResetPasswordController, :create
    get "/users/reset_password/:token", UserResetPasswordController, :query
    put "/users/reset_password/:token", UserResetPasswordController, :update
  end

  scope "/api", KerbalWeb do
    pipe_through [:api, :require_authenticated_user]

    put "/users/settings", UserSettingsController, :update
    get "/users/settings/confirm_email/:token", UserSettingsController, :confirm_email
  end

  scope "/api", KerbalWeb do
    pipe_through [:api]

    post "/users/confirm", UserConfirmationController, :create
    post "/users/confirm/:token", UserConfirmationController, :update
  end
end
