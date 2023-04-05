Bureaucrat.start(json_library: Jason)
ExUnit.start(formatters: [ExUnit.CLIFormatter, Bureaucrat.Formatter])
Ecto.Adapters.SQL.Sandbox.mode(Kerbal.Repo, :manual)
