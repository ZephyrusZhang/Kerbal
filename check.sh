#!/bin/sh
cd /nixos
nix develop ./flake.nix --show-trace --extra-experimental-features nix-command --extra-experimental-features flakes