import Config

config :tracking_station,
  gpu_ids: System.get_env("GPU_IDS", "") |> String.split(",")
