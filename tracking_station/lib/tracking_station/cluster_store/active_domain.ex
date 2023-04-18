defmodule TrackingStation.ClusterStore.ActiveDomain do
  use Mnesiac.Store
  import Record

  defrecord(
    :active_domain,
    uuid: nil,
    node_id: nil,
    domain_id: 0,
    cpu_count: 0,
    ram_size: 0,
    disk_path: "",
    iso_path: "",
    spice_port: 0,
    spice_password: "",
    gpus: [],
    status: nil
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
            gpus: list,
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
