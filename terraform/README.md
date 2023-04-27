# Terraform the physical machine with Nix

1. build a ZFS storage using the following commands:

```bash
zpool create \
    -o ashift=12 \
    -o autotrim=on \
    -O acltype=posixacl \
    -O canmount=off \
    -O compression=lz4 \
    -O devices=off \
    -O normalization=formD \
    -O relatime=on \
    -O xattr=sa \
    -O mountpoint=none \
    -R /mnt \
    rpool \
    <disk>

zpool add rpool cache <disk>
zpool add rpool log <disk>
zfs create -o mountpoint=none -o canmount=off rpool/nixos
zfs create -o mountpoint=none -o canmount=off rpool/images
zfs create -o mountpoint=legacy rpool/nixos/home
zfs create -o mountpoint=legacy rpool/nixos/root

mount -t zfs rpool/nixos/root /mnt
mkdir /mnt/home
mkdir /mnt/boot
mkdir /mnt/efi
mount -t zfs rpool/nixos/home /mnt/home

mount /dev/nvme0n1p1 /mnt/efi
mount /dev/nvme0n1p2 /mnt/boot
```

2.
```
sudo zfs allow -u jeb send,receive,snapshot,clone,promote,rollback rpool/images
sudo zfs allow -u jeb create,send,receive,snapshot,clone,rollback rpool/templates
```

3.
```bash
nix run github:serokell/deploy-rs -- --targets ./terraform#planet1
```
