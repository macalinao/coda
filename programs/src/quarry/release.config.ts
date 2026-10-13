import { defineProtocolRelease } from "@macalinao/megagraph";
import protocol from "./protocol.config.ts";

export default defineProtocolRelease({
  protocol,
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
