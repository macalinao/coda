import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    name: "@solana-programs/mpl-token-auth-rules",
    description: "TypeScript client for the Metaplex Token Auth Rules program",
    keywords: [
      "metaplex",
      "token-auth-rules",
      "auth-rules",
      "nft",
      "ian-macalinao",
    ],
    version: "0.6.2",
    releaseNotes: [
      "Generated from the program megagraph in macalinao/coda. The generated code is unchanged; the README, reference docs and package metadata are regenerated.",
    ],
  },
});
