import { defineMegagraph } from "@macalinao/megagraph";
import { KIT_RANGE } from "./peer-ranges.ts";

export default defineMegagraph({
  peerDependencies: {
    "@solana/kit": KIT_RANGE,
    "@solana/program-client-core": KIT_RANGE,
  },
  workspace: {
    name: "solana-programs",
    repository: "toolboxdao/solana-programs",
    catalog: [
      "@macalinao/tsconfig",
      "@solana-program/token",
      "@solana/kit",
      "@solana/program-client-core",
      "tsdown",
      "typescript",
    ],
    devDependencies: ["@types/node", "oxfmt", "tsdown", "typescript"],
    copyFiles: ["LICENSE", "bunfig.toml", ".oxfmtrc.json", "tsdown.config.ts"],
  },
  sourceRepository: "macalinao/coda",
});
