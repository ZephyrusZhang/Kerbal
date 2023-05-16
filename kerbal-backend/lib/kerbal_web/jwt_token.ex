defmodule KerbalWeb.JWTToken do
  use Joken.Config
  require Logger
  import Plug.Conn

  def fetch_jwt(conn, _opts) do
    case conn |> get_req_header("authorization") do
      [token] ->
        case KerbalWeb.JWTToken.verify_and_validate(token) do
          {:ok, claims} ->
            conn |> assign(:claims, claims)

          {:error, reason} ->
            conn
        end

      [] ->
        conn
    end
  end
end
