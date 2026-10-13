import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    name: "@solana-programs/voter-stake-registry",
    description:
      "TypeScript client for the SPL Governance Voter Stake Registry program",
    keywords: [
      "spl",
      "governance",
      "voter-stake-registry",
      "dao",
      "voting",
      "staking",
      "realm",
      "ian-macalinao",
    ],
    version: "0.7.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "Generated from the program megagraph in macalinao/coda; the README, reference docs and package metadata are regenerated.",
    ],
  },
});
