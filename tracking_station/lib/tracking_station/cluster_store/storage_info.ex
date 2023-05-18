defmodule TrackingStation.ClusterStore.StorageInfo do
  use Mnesiac.Store
  import Record

  defrecord(
    :storage_info,
    image_id: :_,
    node_id: :_,
    guid: :_,
    dataset: :_,
    name: :_,
    volsize: :_,
    used: :_,
    origin_dataset: :_,
    origin_name: :_
  )

  @type storage_info ::
          record(
            :storage_info,
            image_id: String.t(),
            node_id: atom(),
            guid: String.t(),
            dataset: atom(),
            name: String.t(),
            volsize: integer(),
            used: integer(),
            origin_dataset: atom(),
            origin_name: String.t()
          )

  @impl true
  def store_options() do
    [
      record_name: :storage_info,
      attributes: storage_info() |> storage_info() |> Keyword.keys(),
      index: [:node_id, :dataset, :name],
      ram_copies: [node()]
    ]
  end
end
