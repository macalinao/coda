import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    name: "@solana-programs/mpl-bubblegum",
    description: "TypeScript client for the Metaplex Bubblegum program",
    keywords: [
      "metaplex",
      "bubblegum",
      "compression",
      "cnft",
      "nft",
      "ian-macalinao",
    ],
    version: "0.7.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "**Breaking:** removed the duplicated Token Metadata helpers (`findMetadataPda`, `findMasterEditionPda`, `MPL_TOKEN_METADATA_PROGRAM_ADDRESS` and the rest of the `mplTokenMetadata` program module). The collection instructions now derive those PDAs with the helpers from `@solana-programs/token-metadata`, which this package depends on.",
    ],
  },
});
