defmodule Kerbal.Repo do
  use Ecto.Repo,
    otp_app: :kerbal,
    adapter: Ecto.Adapters.Postgres
end
