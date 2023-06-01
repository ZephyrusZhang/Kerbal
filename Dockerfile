FROM nixos/nix

RUN mkdir /nixos
COPY ./kerbal-backend /nixos/kerbal-backend
COPY ./flake.nix /nixos/
COPY ./check.sh /check.sh 
RUN chmod +x /check.sh