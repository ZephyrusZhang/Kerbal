defmodule TrackingStation.ClusterStore.ActiveDomain do
  use Mnesiac.Store
  import Record

  defrecord(
    :active_domain,
    uuid: :_,
    node_id: :_,
    user_id: :_
  )

  @type active_domain ::
          record(
            :active_domain,
            uuid: String.t(),
            node_id: atom(),
            user_id: String.t() # reserved
          )

  @impl true
  def store_options() do
    [
      record_name: :active_domain,
      attributes: active_domain() |> active_domain() |> Keyword.keys(),
      index: [],
      ram_copies: [node()]
    ]
  end
end
