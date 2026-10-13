import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description:
      "TypeScript client for the Quarry Operator program, which delegates Quarry rewarder administration",
    keywords: ["quarry", "mining", "operator", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
      "Imports `findQuarryPda` from `@solana-programs/quarry-mine` instead of duplicating it.",
    ],
  },
});
