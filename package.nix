{ beam
, libvirt
, pkg-config
, rustPlatform
}:
let
  packages = beam.packagesWith beam.interpreters.erlang;

  pname = "kerbal";
  version = "0.0.1";

  src = ./tracking_station;

  mixFodDeps = packages.fetchMixDeps {
    pname = "mix-deps-${pname}";
    inherit src version;
    sha256 = "sha256-mYT8FCoNIi9k0pEkwiuogQkIr1pzh9ZgzyejDZrLtdQ=";
  };

  # compile nif
  rustler-package = rustPlatform.buildRustPackage {
    pname = "libvirt";
    version = "0.1";

    src = ./tracking_station/native/libvirt;
    cargoSha256 = "sha256-UQL36+hx6oMJevZz0vYcq8iHPhl8RAqyHBumbNoYr44=";

    nativeBuildInputs = [
      rustPlatform.bindgenHook
      pkg-config
    ];

    buildInputs = [
      libvirt
    ];
  };

in packages.mixRelease {
  inherit src pname version mixFodDeps;

  preBuild = ''
    mkdir -p ./priv/native
    ln -sf ${rustler-package}/lib/liblibvirt.so ./priv/native
    # load nif without compilation as we have already compiled this module
    substituteInPlace lib/tracking_station/libvirt.ex \
      --replace "skip_compilation?: false" "skip_compilation?: true"
  '';
}

