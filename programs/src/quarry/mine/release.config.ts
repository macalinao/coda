import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description:
      "TypeScript client for the Quarry Mine program, the core liquidity mining program of the Quarry protocol",
    keywords: ["quarry", "mining", "staking", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
      "Imports `findMinterPda` from `@solana-programs/quarry-mint-wrapper` instead of duplicating it.",
    ],
  },
});
