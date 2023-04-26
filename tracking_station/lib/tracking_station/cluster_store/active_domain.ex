defmodule TrackingStation.ClusterStore.ActiveDomain do
  use Mnesiac.Store
  import Record

  defrecord(
    :active_domain,
    uuid: :_,
    node_id: :_,
    domain_id: :_,
    cpu_count: :_,
    ram_size: :_,
    disk_path: :_,
    iso_path: :_,
    spice_port: :_,
    spice_password: :_,
    status: :_
  )

  @type active_domain ::
          record(
            :active_domain,
            uuid: String.t(),
            node_id: atom,
            domain_id: integer,
            cpu_count: integer,
            ram_size: integer,
            disk_path: String.t(),
            iso_path: String.t(),
            spice_port: integer,
            spice_password: String.t(),
            status: atom
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
