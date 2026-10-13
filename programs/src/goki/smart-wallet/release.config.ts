import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description:
      "TypeScript client for the Goki Smart Wallet (multisig) program",
    keywords: ["goki", "smart-wallet", "multisig"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/goki`, which now re-exports this package.",
    ],
  },
});
