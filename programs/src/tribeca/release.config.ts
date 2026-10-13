import { defineProtocolRelease } from "@macalinao/megagraph";
import lockedVoter from "./locked-voter/program.config.ts";
import protocol from "./protocol.config.ts";

export default defineProtocolRelease({
  protocol,
  keywords: ["tribeca", "governance", "voting", "dao"],
  umbrella: {
    name: "@solana-programs/tribeca",
    description:
      "TypeScript client for Tribeca governance programs (Govern and Locked Voter)",
    version: "0.6.0",
    releaseNotes: [
      "Now an umbrella package: it contains no code of its own and re-exports `@solana-programs/tribeca-govern` and `@solana-programs/tribeca-locked-voter`. Every name it exported before is still exported; the flat `activateProposal*` exports remain Locked Voter's, and Govern's are available under the new `govern` namespace.",
    ],
    // Both programs have an `activateProposal` instruction; as in the former
    // combined client, the flat export resolves to Locked Voter's.
    precedence: [lockedVoter],
  },
});
