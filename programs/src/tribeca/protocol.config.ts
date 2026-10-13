import { defineProtocol } from "@macalinao/megagraph";

export default defineProtocol({
  displayName: "Tribeca",
  description:
    "Tribeca is a governance protocol: governors, proposals and votes (Govern), with voting power from vote escrows (Locked Voter).",
  repository: "https://github.com/TribecaHQ/tribeca",
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
    precedence: ["locked-voter"],
  },
});
