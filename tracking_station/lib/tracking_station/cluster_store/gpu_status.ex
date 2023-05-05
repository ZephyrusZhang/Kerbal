defmodule TrackingStation.ClusterStore.GPUStatus do
  use Mnesiac.Store
  import Record

  defrecord(
    :gpu_status,
    gpu_id: :_,
    node_id: :_,
    name: :_,
    vram_size: :_,
    bus: :_,
    slot: :_,
    function: :_,
    domain_uuid: :_, # the uuid of the domain the GPU assigned to
    free: :_,
    online: :_
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
            domain_uuid: String.t(),
            free: boolean,
            online: boolean
          )

  @impl true
  def store_options() do
    [
      record_name: :gpu_status,
      attributes: gpu_status() |> gpu_status() |> Keyword.keys(),
      index: [:node_id, :name, :vram_size, :free, :online],
      ram_copies: [node()]
    ]
  end
end
