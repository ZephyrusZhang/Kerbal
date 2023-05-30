defmodule Mix.Tasks.Kerbal.Useradd do
  @shortdoc "Create a user directly in the database"
  use Mix.Task

  @impl Mix.Task
  def run(args) do
    [email, password, is_admin] = args
    is_admin = String.downcase(is_admin)

    is_admin =
      if is_admin == "true" or is_admin == "1" do
        true
      else
        false
      end

    user_params = %{"email" => email, "password" => password, "is_admin" => is_admin}
    message = "Creating a user with the following settings: #{inspect(user_params)}\nProceed?"

    if Mix.Shell.yes?(message) do
      Kerbal.Accounts.force_register_user(user_params)
    end
  end
end
