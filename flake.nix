{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
      backend-env = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.rustPlatform.bindgenHook ];
        buildInputs = with pkgs; [
          rustc
          cargo
          elixir
          pkg-config
          pciutils
          libvirt

          # bcrypt
          gnumake
          stdenv.cc.cc

          beamPackages.hex

          elixir_ls
          rust-analyzer
        ];
      };

    in
      {
        devShells.${system} = {
          backend = backend-env;
          default = backend-env;
        };
        packages.${system}.default = pkgs.callPackage (import ./package.nix) {};
      };
}
