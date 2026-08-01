{
  description = "Coda - automated client generation for Solana programs";

  inputs = {
    # Matches the nixpkgs pin the previous devenv setup used.
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          name = "coda";

          # Nix provides the *runtimes* only. The JS toolchain (oxlint, oxfmt,
          # oxlint-tsgolint, typescript, turbo) is pinned in package.json and
          # resolved from node_modules/.bin, so there is exactly one copy of
          # each on PATH and it is the same one CI installs from the lockfile.
          packages = with pkgs; [
            bun
            nodejs_24

            git
            # `nixfmt` is the RFC-style formatter; `nixfmt-rfc-style` is now a
            # deprecated alias for it.
            nixfmt
          ];
        };
      });

      formatter = forAllSystems (pkgs: pkgs.nixfmt);
    };
}
