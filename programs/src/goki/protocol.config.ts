import { defineProtocol } from "@macalinao/megagraph";

export default defineProtocol({
  displayName: "Goki",
  description:
    "Goki is a multisig and smart wallet protocol: an owner-threshold smart wallet, and a token signer that lets an NFT holder sign on behalf of a PDA of the NFT's mint.",
  repository: "https://github.com/GokiProtocol/goki",
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
