defmodule Kerbal.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      KerbalWeb.Telemetry,
      # Start the Ecto repository
      Kerbal.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Kerbal.PubSub},
      # Start Finch
      {Finch, name: Kerbal.Finch},
      # Start the Endpoint (http/https)
      KerbalWeb.Endpoint
      # Start a worker by calling: Kerbal.Worker.start_link(arg)
      # {Kerbal.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Kerbal.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    KerbalWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
