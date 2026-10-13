import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    name: "@solana-programs/mpl-core",
    description: "TypeScript client for the Metaplex Core program",
    keywords: ["metaplex", "mpl-core", "core", "nft", "ian-macalinao"],
    version: "0.6.2",
    releaseNotes: [
      "Generated from the program megagraph in macalinao/coda. The generated code is unchanged; the README, reference docs and package metadata are regenerated.",
    ],
  },
});
