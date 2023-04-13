defmodule TrackingStation.ClusterStore.NodeInfo do
  use Mnesiac.Store
  import Record, only: [defrecord: 3]

  defrecord(
    :node_info,
    __MODULE__,
    node_id: nil,
    cpu_count: 0,
    ram_size: 0,
    free_cpu_count: 0,
    free_ram_size: 0
  )

  @type node_info ::
          record(
            :node_info,
            node_id: atom,
            cpu_count: integer,
            ram_size: integer,
            free_cpu_count: integer,
            free_ram_size: integer
          )

  @impl true
  def store_options do
    [
      record_name: :node_info,
      attributes: node_info() |> node_info() |> Keyword.keys(),
      index: [:node_id, :free_cpu_count, :free_ram_size],
      ram_copies: [node()]
    ]
  end
end
