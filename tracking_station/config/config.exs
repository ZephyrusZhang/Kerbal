import Config

config :libcluster,
  topologies: [
    TrackingStation: [
      # The selected clustering strategy. Required.
      strategy: Cluster.Strategy.Epmd,
      # Configuration for the provided strategy. Optional.
      config: [hosts: [:jeb@planet1, :jeb@planet2, :jeb@planet3]],
      # The function to use for connecting nodes. The node
      # name will be appended to the argument list. Optional
      connect: {:net_kernel, :connect_node, []},
      # The function to use for disconnecting nodes. The node
      # name will be appended to the argument list. Optional
      disconnect: {:erlang, :disconnect_node, []},
      # The function to use for listing nodes.
      # This function must return a list of node names. Optional
      list_nodes: {:erlang, :nodes, [:connected]}
    ]
  ]

config :mnesiac,
  stores: [
    TrackingStation.ClusterStore.NodeInfo,
    TrackingStation.ClusterStore.GPUStatus,
    TrackingStation.ClusterStore.ActiveDomain,
    TrackingStation.ClusterStore.StorageInfo
  ],
  schema_type: :ram_copies,
  # milliseconds
  table_load_timeout: 600_000
