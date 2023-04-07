defmodule TrackingStation.Scheduler.LibvirtConfig do
  require EEx

  EEx.function_from_file(
    :def,
    :base_config,
    "lib/tracking_station/scheduler/templates/base_config.eex",
    [:name, :uuid, :cpu_count, :ram_size, :gpu_passthrough_config]
  )

  EEx.function_from_file(
    :def,
    :gpu_passthrough,
    "lib/tracking_station/scheduler/templates/gpu_passthrough.eex",
    []
  )
end
