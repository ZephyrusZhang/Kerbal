# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running ‘nixos-help’).

{ config, pkgs, ... }:

{
  boot = {
    kernelPackages = config.boot.zfs.package.latestCompatibleLinuxPackages;
    loader = {
      grub = {
        enable = true;
        copyKernels = true;
        device = "nodev";
        efiSupport = true;
        version = 2;
      };
      efi = {
        canTouchEfiVariables = true;
        efiSysMountPoint = "/efi";
      };
    };
  };
  # boot.loader.grub.efiSupport = true;
  # boot.loader.grub.efiInstallAsRemovable = true;
  # boot.loader.efi.efiSysMountPoint = "/boot/efi";
  # Define on which hard drive you want to install Grub.
  # boot.loader.grub.device = "/dev/sda"; # or "nodev" for efi only

  # networking.hostName = "nixos"; # Define your hostname.
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  # networking.networkmanager.enable = true;  # Easiest to use and most distros use this by default.

  # Set your time zone.
  time.timeZone = "Asia/Hong_Kong";

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  # i18n.defaultLocale = "en_US.UTF-8";
  # console = {
  #   font = "Lat2-Terminus16";
  #   keyMap = "us";
  #   useXkbConfig = true; # use xkbOptions in tty.
  # };

  # Enable the X11 windowing system.
  services.xserver.enable = false;


  # Configure keymap in X11
  # services.xserver.layout = "us";
  # services.xserver.xkbOptions = {
  #   "eurosign:e";
  #   "caps:escape" # map caps to escape.
  # };

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # sound.enable = true;
  # hardware.pulseaudio.enable = true;

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.jeb = {
    shell = pkgs.zsh;
    isNormalUser = true;
    extraGroups = [ "wheel" "libvirt" ]; # Enable ‘sudo’ for the user.
    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJaVZIpXiOFO/wwIR4BJUY6hA2nVmroDukqm5Xd6iYg+ bill@BillLab"
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCrgvD+ZaiHOGJ71PmLZSGMPr/O1mgJLst56UnqdPja9TdTP9gN/WG+v2xytp5an9zd3YGsmk38nW31sY2wrQgXEP6UykJtrdAv2cic/XdrKoXOkXgDJxVDb6F0vobNOZ8R52pRhaNJTwFzT86Z7gxcLRB+sagst9cHP5Ry18m4sBJXJ/zUeu4ecZgfG/gyTQ5/bPrkwEbkt3qCTkKYNodvB/7p/mQUlHeDlW2FWrk3nQ1Y2+VvptuTN1xyW550c3n9VOmdxpvq7kW8SjEjnZNhT0jK5cbqdt3BVrSjIX2m2JP8vGWc2qZSKuvIU2RO60TtkilZNEeZmFs1nKJ/+7BumObhGlP+dB6Fplg2gG+VyywX0JBdQ1/3x/D0Ydh16Fnl+TlVcewzdsVGVIJVJGfDmuAlmIDAi1TnSxzZB4gzwemaqozGZ1U3E88R7cb70kkk7RyKdKG7tlNxorw5Zxm1uEGqDDmZN54kHqHTz0F70J+nuSmy6Sn+ilMj/3FPvHBnf56SGuE0OyNzEJf9oswauGvQD9ZBQ7GSHETRxgJDDNPocrnZjmGoCmtpmroF56TywWGkiRBEDP9LRdzlplz83vSbtMRb6GnDWzXocORfraldsnOu0uu5EJ7sieuJs0xxnosmYRhP5Q/OaxxzpPjTLCVwXbTLrc47+S5QHNe7kw== 2996362441@qq.com"
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDCie47bVXVd3icUQgUAHolCRPuNLtgIQuw+IqzeRu2DERaYxxg3N4v/6wdDmfIl7Hg5IWvoV7UEOCy32JpdD6MuA5GtQB5c/65LupOhQgMcVeiYzxLNRh11hgcXmLmvyx085eGGAFcAZuztnK+hjYZ9kcafZCUA//GjmKPYQNKii8WD90HyM5HHM8wSqNW3ZzMN+pXtdMc3P2iZtX5kT7i5b9LVnbYqmEnw/YQVConvWp5abe/lY2KKBSf+DH3ayEf+vOYdCk0G+2k+okX9ffdccCTsCs6QG+GvOI0p22KXrDYJnmZYqLGCfzPgMeOxVsP2pgwM8WxrNW30IPsl7RM1K1M1DxAwEZClxSpH+98VOuDInmp+dspxfIJoytiCMx3lH98V+YIrWw9q7ywqxIqhs9yWxxuRabQlAubvLrDDpIegRdvMd4mRmUzhCYxNq+2nqCIBFEalI97PT9xqt/c2dOMDcBCwaStFpDwfsRM6skncUtHVfsETFhBVckSkxU= 778353100@qq.com"
    ];
  };
  virtualisation = {
    libvirtd = {
      enable = true;
      extraConfig = ''
        auth_unix_ro = "none"
        auth_unix_rw = "none"
        unix_sock_group = "libvirt"
        unix_sock_ro_perms = "0777"
        unix_sock_rw_perms = "0770"
      '';
    };
    vswitch = {
      enable = true;
      resetOnStart = true;
    };
  };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    tmux
    curl
    git
    helix
    pciutils
    elixir
  ];

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };
  programs = {
    zsh = {
      enable = true;
      autosuggestions.enable = true;
      enableCompletion = true;
      syntaxHighlighting.enable = true;
      histSize = 10000;
      ohMyZsh = {
        enable = true;
        theme = "ys";
        plugins = [
          "git"
        ];
      };
    };
  };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  services.openssh = {
    enable = true;
    permitRootLogin = "no";
    passwordAuthentication = false;
  };
  
  security = {
    sudo = {
      enable = true;
      wheelNeedsPassword = false;
    };
    polkit.enable = true;
  };

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  networking = {
    firewall.enable = false;
    hosts = {
      "10.16.112.16" = [ "planet1" ];
      "10.16.112.202" = [ "planet2" ];
      "10.16.110.183" = [ "planet3" ];
    };
  };

  nix = {
    settings = {
      auto-optimise-store = true;
      sandbox = true;
      trusted-users = [ "@wheel" ];
    };
    gc.automatic = true;
    gc.dates = "4:00";
    gc.options = "--delete-older-than 14d";
    extraOptions = ''
      experimental-features = nix-command flakes
    '';
  };

  users.groups.libvirt = {
    name = "libvirt";
  };


  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It‘s perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "22.11"; # Did you read the comment?

}

