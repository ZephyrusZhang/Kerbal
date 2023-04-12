defmodule TrackingStation.Storage.LocalStorage do
  def allocate_disk() do
    "/dev/zvol/rpool/images/disk1"
  end

  def get_installation_image() do
    "/home/jeb/archlinux-x86_64.iso"
  end
end
