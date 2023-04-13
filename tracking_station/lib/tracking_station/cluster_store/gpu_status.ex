defmodule TrackingStation.ClusterStore.GPUStatus do
  use Mnesiac.Store
  import Record

  defrecord(
    :gpu_status,
    gpu_id: nil,
    node_id: nil,
    name: "",
    vram_size: 0,
    bus: nil,
    slot: nil,
    function: nil,
    free?: false,
    online?: false
  )

  @type gpu_status ::
          record(
            :gpu_status,
            gpu_id: String.t(),
            node_id: atom,
            name: String.t(),
            vram_size: integer,
            bus: String.t(),
            slot: String.t(),
            function: String.t(),
            free?: boolean,
            online?: boolean
          )

  @impl true
  def store_options() do
    [
      record_name: :gpu_status,
      attributes: gpu_status() |> gpu_status() |> Keyword.keys(),
      index: [:node_id, :name, :vram_size, :free?, :online?],
      ram_copies: [node()]
    ]
  end
end
