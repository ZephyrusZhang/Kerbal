defmodule TrackingStation.Scheduler.LibvirtConfig do
  require EEx

  EEx.function_from_file(
    :def,
    :base_config,
    "lib/tracking_station/scheduler/templates/base_config.eex",
    [
      :name,
      :uuid,
      :cpu_count,
      :ram_size,
      :disk_config,
      :iso_config,
      :gpu_passthrough_config
    ]
  )

  EEx.function_from_file(
    :def,
    :disk_config,
    "lib/tracking_station/scheduler/templates/disk_config.eex",
    [:disk_path]
  )

  EEx.function_from_file(
    :def,
    :iso_config,
    "lib/tracking_station/scheduler/templates/iso_config.eex",
    [:iso_path]
  )

  EEx.function_from_file(
    :def,
    :gpu_passthrough,
    "lib/tracking_station/scheduler/templates/gpu_passthrough.eex",
    [:bus, :slot, :function]
  )
end
