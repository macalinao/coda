import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description: "TypeScript client for the Kamino Lending program",
    keywords: ["kamino", "lending", "defi", "ian-macalinao"],
    version: "0.10.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "**Breaking:** the Kamino Farms program is no longer part of this package. It is published as `@solana-programs/kamino-farms`, which this package depends on for `FARMS_PROGRAM_ADDRESS`; `@solana-programs/kamino` bundles both programs.",
    ],
  },
});
