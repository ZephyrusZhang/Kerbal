defmodule SchedulerTest do
  use ExUnit.Case
  alias TrackingStation.Scheduler.DomainMonitor
  alias TrackingStation.Scheduler

  test "list gpus and create domain" do
    available_nodes =
      Scheduler.lookup_resource(%{
        cpu_count: 1,
        ram_size: 1 * 1024 ** 2,
        gpu_count: 0,
        gpu: %{name: :_, vram_size: 0}
      })

    assert length(available_nodes) > 0
    IO.inspect(available_nodes)
    current_node_info =
      available_nodes
      |> Enum.filter(&(Map.fetch!(&1, :node_id) == node()))
      |> Enum.fetch!(0)

    gpus = current_node_info.gpus

    {:ok, domain_uuid} = Scheduler.create_domain(node(), %{cpu_count: 1, ram_size: 4*1024**2, gpus: gpus})
    # now it should fail, because the gpus is occupied.
    {:error, _reason} = Scheduler.create_domain(node(), %{cpu_count: 1, ram_size: 4*1024**2, gpus: gpus})

    # try to lookup related infomation, it also test that the registry is working
    domain_info = DomainMonitor.get_info(domain_uuid)
    DomainMonitor.destroy(domain_uuid)

    # wait for the resource to be released
    Process.sleep(3000)
    # now the gpu should be free again
    {:ok, domain_uuid} = Scheduler.create_domain(node(), %{cpu_count: 1, ram_size: 4*1024**2, gpus: gpus})
    DomainMonitor.destroy(domain_uuid)
  end
end
