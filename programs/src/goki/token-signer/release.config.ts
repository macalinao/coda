import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description:
      "TypeScript client for the Goki Token Signer program, which lets an NFT holder sign for a PDA derived from the NFT's mint",
    keywords: ["goki", "token-signer", "nft"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/goki`, which now re-exports this package.",
    ],
  },
});
