import { defineProgramRelease } from "@macalinao/megagraph";
import definition from "./program.config.ts";

export default defineProgramRelease({
  program: definition,
  package: {
    description: "TypeScript client for the Kamino Farms program",
    keywords: ["kamino", "farms", "staking", "defi", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/kamino-lending`. Also ships the Farms `updateGlobalConfig` and `updateGlobalConfigAdmin` instructions, which the combined client overwrote with Kamino Lending's.",
    ],
  },
});
