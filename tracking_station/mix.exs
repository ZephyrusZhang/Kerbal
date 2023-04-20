defmodule TrackingStation.MixProject do
  use Mix.Project

  def project do
    [
      app: :tracking_station,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {TrackingStation.Application, []},
      extra_applications: [:logger, :crypto, :eex]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
      {:rustler, "~> 0.27.0"},
      {:uuid, "~> 1.1"},
      {:mnesiac, "~> 0.3"},
      {:libcluster, "~> 3.3"},
      {:jason, "~> 1.4"}
    ]
  end
end
