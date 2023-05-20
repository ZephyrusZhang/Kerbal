defmodule KerbalWeb.StorageController do
  use KerbalWeb, :controller

  def list(conn, _params) do
    available_images = TrackingStation.Storage.LocalStorage.list_images()
    json(conn, %{status: :ok, result: available_images})
  end
end
