import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description:
      "TypeScript client for the Quarry Merge Mine program, which stakes one deposit across multiple quarries",
    keywords: ["quarry", "mining", "staking", "merge-mine", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
      "Imports `findMinerPda` and `findQuarryPda` from `@solana-programs/quarry-mine` and `findMinterPda` from `@solana-programs/quarry-mint-wrapper` instead of duplicating them.",
    ],
  },
});
