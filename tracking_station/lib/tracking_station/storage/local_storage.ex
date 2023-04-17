defmodule TrackingStation.Storage.LocalStorage do
  def allocate_disk() do
    "/dev/zvol/rpool/images/disk1"
  end

  def get_installation_image() do
    "/home/jeb/archlinux-x86_64.iso"
  end

  def list_base_images() do
    System.run("zfs", ["list", "rpool/images"])
  end

  def list_user_images(_user_id) do
    System.run("zfs", ["list", "rpool/user_images"])
  end
end
