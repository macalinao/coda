import { defineProtocol } from "@macalinao/megagraph";

export default defineProtocol({
  displayName: "Quarry",
  description:
    "Quarry is a liquidity mining protocol: rewarders distribute rewards minted through a mint wrapper to miners staking into quarries.",
  repository: "https://github.com/QuarryProtocol/quarry",
  keywords: ["quarry", "mining", "staking"],
  umbrella: {
    name: "@solana-programs/quarry",
    description: "TypeScript client for Quarry protocol programs",
    version: "0.9.0",
    releaseNotes: [
      "Now an umbrella package: it contains no code of its own and re-exports the six `@solana-programs/quarry-*` packages. Every name it exported before is still exported.",
    ],
  },
});
