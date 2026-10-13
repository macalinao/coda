import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description:
      "TypeScript client for the Tribeca Locked Voter (vote escrow) program",
    keywords: ["tribeca", "governance", "voting", "vote-escrow", "dao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/tribeca`, which now re-exports this package.",
    ],
  },
});
