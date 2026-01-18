{ pkgs, ... }:

{
  dotenv.enable = true;
  packages = with pkgs; [
    biome
    git
    nixfmt
  ];

  languages.javascript = {
    enable = true;
    bun.enable = true;
  };
}
