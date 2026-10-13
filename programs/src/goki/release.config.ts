import { defineProtocolRelease } from "@macalinao/megagraph";
import protocol from "./protocol.config.ts";

export default defineProtocolRelease({
  protocol,
  keywords: ["goki", "multisig"],
  umbrella: {
    name: "@solana-programs/goki",
    description:
      "TypeScript client for Goki programs (Smart Wallet and Token Signer)",
    keywords: ["smart-wallet"],
    version: "0.5.0",
    releaseNotes: [
      "Now an umbrella package: it contains no code of its own and re-exports `@solana-programs/goki-smart-wallet` and `@solana-programs/goki-token-signer`. Every name it exported before is still exported.",
    ],
  },
});
