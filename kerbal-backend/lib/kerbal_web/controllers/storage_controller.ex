defmodule KerbalWeb.StorageController do
  use KerbalWeb, :controller

  def list(conn) do
    available_images = TrackingStation.Storage.LocalStorage.list_images()
    json(conn, available_images)
  end
end
