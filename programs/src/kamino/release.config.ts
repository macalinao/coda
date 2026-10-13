import { defineProtocolRelease } from "@macalinao/megagraph";
import lending from "./lending/program.config.ts";
import protocol from "./protocol.config.ts";

export default defineProtocolRelease({
  protocol,
  keywords: ["kamino", "defi"],
  umbrella: {
    name: "@solana-programs/kamino",
    description:
      "TypeScript client for the Kamino Lending and Kamino Farms programs",
    keywords: ["lending", "farms"],
    version: "0.1.0",
    releaseNotes: [
      "Umbrella package re-exporting `@solana-programs/kamino-lending` and `@solana-programs/kamino-farms`, i.e. what `@solana-programs/kamino-lending` exported before 0.10.0. The flat `updateGlobalConfig*` exports are Kamino Lending's; Farms' are available under the `farms` namespace.",
    ],
    // Both programs have `updateGlobalConfig` and `updateGlobalConfigAdmin`
    // instructions; the flat export resolves to Kamino Lending's.
    precedence: [lending],
  },
});
