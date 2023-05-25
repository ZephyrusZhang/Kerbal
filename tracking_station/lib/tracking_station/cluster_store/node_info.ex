defmodule TrackingStation.ClusterStore.NodeInfo do
  use Mnesiac.Store
  import Record

  defrecord(
    :node_info,
    node_id: :_,
    storage_role: :_,
    cpu_count: :_,
    ram_size: :_,
    free_cpu_count: :_,
    free_ram_size: :_,
    ipv4_addr: :_,
    ipv6_addr: :_
  )

  @type node_info ::
          record(
            :node_info,
            node_id: atom(),
            storage_role: :adhoc | :persistent,
            cpu_count: integer(),
            ram_size: integer(),
            free_cpu_count: integer(),
            free_ram_size: integer(),
            ipv4_addr: String.t(),
            ipv6_addr: String.t()
          )

  @impl true
  def store_options() do
    [
      record_name: :node_info,
      attributes: node_info() |> node_info() |> Keyword.keys(),
      index: [:free_cpu_count, :free_ram_size],
      ram_copies: [node()]
    ]
  end
end
