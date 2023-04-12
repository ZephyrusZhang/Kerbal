{
  description = "NixOS and Home Manager configuration";

  inputs = {
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
    nixpkgs.url = "nixpkgs/nixos-22.11";
    utils.url = "github:numtide/flake-utils";
    deploy-rs.url = "github:serokell/deploy-rs";
  };

  outputs = { self, nixpkgs, nixpkgs-unstable, utils, deploy-rs }:
    let
      system = utils.lib.system.x86_64-linux;
      overlay-unstable = final: prev: {
        unstable = import nixpkgs-unstable {
          inherit system;
          config.allowUnfree = false;
        };
      };
      eachNode = names: f:
        let
          op = (attrs: rest:
            {
              nixosConfigurations = attrs.nixosConfigurations // rest.nixosConfigurations;
              deploy.nodes = attrs.deploy.nodes // rest.deploy.nodes;
            });
        in
          builtins.foldl' op { nixosConfigurations={}; deploy.nodes={}; } (builtins.map f names);
    in
      eachNode [ "planet1" "planet2" "planet3" ] (name: rec {
        nixosConfigurations.${name} = nixpkgs.lib.nixosSystem {
          inherit system;
          modules = [
            ({ config, pkgs, ... }: { nixpkgs.overlays = [ overlay-unstable ]; })
            ./configuration.nix
            ./hardware/${name}.nix
          ];
        };

        deploy.nodes.${name} = {
          hostname = "${name}";
          profiles = {
            system = {
              sshUser = "jeb";
              user = "root";
              sudo = "sudo -u";
              autoRollback = true;
              magicRollback = true;
              path = deploy-rs.lib.x86_64-linux.activate.nixos nixosConfigurations.${name};
              remoteBuild = false;
            };
          };
        };

      }) //
      {
        checks = builtins.mapAttrs (system: deployLib: deployLib.deployChecks self.deploy) deploy-rs.lib;
      };
}
