import { defineMegagraph } from "@macalinao/megagraph";

/**
 * The `@solana/kit` (and `@solana/program-client-core`) versions every
 * generated client supports. Each external program declares its own npm range
 * in its config; `bun run megagraph peers` checks that those stay aligned
 * with this one.
 */
const KIT_RANGE = "^6.10.0 || ^7.0.0 || ^8.0.0";

export default defineMegagraph({
  peerDependencies: {
    "@solana/kit": KIT_RANGE,
    "@solana/program-client-core": KIT_RANGE,
  },
  workspace: {
    name: "solana-programs",
    repository: "toolboxdao/solana-programs",
    defaultBranch: "main",
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
