[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/4Haj4PaL)
# Kerbal

## NixOS Environment

Add following to `/etc/nixos/configuration.nix`. Add then run `nixos-rebuild switch`.

```nix
{
  ...

  # postgresql service
  services.postgresql = {
    enable = true;
    package = pkgs.postgresql_15;
    enableTCPIP = true;
    authentication = pkgs.lib.mkOverride 10 ''
      local all all trust
      host all all 127.0.0.1/32 trust
      host all all ::1/128 trust
    '';
    initialScript = pkgs.writeText "backend-initScript" ''
      CREATE ROLE nixcloud WITH LOGIN PASSWORD 'nixcloud' CREATEDB;
      CREATE DATABASE nixcloud;
      GRANT ALL PRIVILEGES ON DATABASE nixcloud TO nixcloud;
    '';
  };

  # List packages installed in system profile.
  environment.systemPackages = with pkgs; [
    vim
    wget
    git
    postgresql_15
    open-vm-tools
    nodejs
    elixir
  ];

  # Use fish as default shell
  programs.fish.enable = true;
  users.defaultUserShell = pkgs.fish;

  programs.nix-ld.enable = true;

  environment.sessionVariables = {
   NIX_LD = toString (pkgs.runCommand "ld.so" {} ''
      ln -s "$(cat '${pkgs.stdenv.cc}/nix-support/dynamic-linker')" $out
    '');
    NIX_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath (with pkgs; [
      zlib
      zstd
      stdenv.cc.cc
      curl
      openssl
      attr
      libssh
      bzip2
      libxml2
      acl
      libsodium
      util-linux
      xz
      systemd
    ]);
  };

  # Enable VMWare Tools
  virtualisation.vmware.guest.enable = true;

  # Open ports in the firewall.
  networking.firewall.allowedTCPPorts = [ 4000 ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # Enable Flake
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
}
```

