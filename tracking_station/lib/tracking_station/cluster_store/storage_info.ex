defmodule TrackingStation.ClusterStore.StorageInfo do
  use Mnesiac.Store
  import Record

  defrecord(
    :storage_info,
    key: :_,
    node_id: :_,
    guid: :_,
    name: :_,
    type: :_,
    volsize: :_,
    used: :_
  )

  @type storage_info ::
          record(
            :storage_info,
            key: {atom(), String.t()},
            node_id: atom(),
            guid: String.t(),
            name: String.t(),
            type: atom(),
            volsize: integer(),
            used: integer()
          )

  @impl true
  def store_options() do
    [
      record_name: :storage_info,
      attributes: storage_info() |> storage_info() |> Keyword.keys(),
      index: [:guid, :name],
      ram_copies: [node()]
    ]
  end
end
