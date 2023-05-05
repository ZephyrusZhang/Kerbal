import Config

config :tracking_station,
  gpu_ids: System.get_env("GPU_IDS", "") |> String.split(","),
  storage_role: System.get_env("STORAGE_ROLE", "adhoc")
