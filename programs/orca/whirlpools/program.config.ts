import { programHandle } from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("whirlpool");

export default defineProgram({
  package: {
    description: "TypeScript client for Orca Whirlpools program",
    keywords: ["orca", "whirlpools", "dex", "amm"],
    version: "0.9.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "Generated from the program megagraph in macalinao/coda; the README, reference docs and package metadata are regenerated.",
    ],
  },
});
