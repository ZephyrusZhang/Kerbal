defmodule KerbalWeb.JWTToken do
  use Joken.Config
  import Plug.Conn

  def fetch_jwt(conn, _opts) do
    case conn |> get_req_header("Authentication") do
      [token] ->
        case KerbalWeb.JWTToken.verify_and_validate(token) do
          {:ok, claims} ->
            conn |> assign(:claims, claims)

          {:error, _} ->
            conn
        end

      [] ->
        conn
    end
  end
end
