import { programHandle } from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("whirlpool");

export default defineProgram({
  package: {
    description: "TypeScript client for Orca Whirlpools program",
    keywords: ["orca", "whirlpools", "dex", "amm"],
    version: "0.8.2",
    releaseNotes: [
      "Generated from the program megagraph in macalinao/coda. The generated code is unchanged; the README, reference docs and package metadata are regenerated.",
    ],
  },
});
