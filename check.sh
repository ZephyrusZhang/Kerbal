#!/bin/sh
cd /nixos
echo 'whoami && id && pwd && mix test' | nix develop ./flake.nix --show-trace --extra-experimental-features nix-command --extra-experimental-features flakes