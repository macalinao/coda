import { programHandle } from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("whirlpool");

export default defineProgram({
  package: {
    description: "TypeScript client for Orca Whirlpools program",
    keywords: ["orca", "whirlpools", "dex", "amm"],
    version: "0.9.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "Generated from the program megagraph in macalinao/coda; the README, reference docs and package metadata are regenerated.",
    ],
  },
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  program: {
    displayName: "Orca Whirlpools",
    description:
      "Concentrated liquidity AMM (CLMM): liquidity providers concentrate their capital within custom price ranges.",
    repository: "https://github.com/orca-so/whirlpools",
    addresses: {
      devnet: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
    },
    docs: "https://docs.orca.so/",
    audits: [
      {
        auditor: "Kudelski Security",
        url: "https://github.com/orca-so/whirlpools/blob/main/.audits/2022-01-28.pdf",
        date: "2022-01-28",
      },
      {
        auditor: "Neodyme",
        url: "https://github.com/orca-so/whirlpools/blob/main/.audits/2022-05-05.pdf",
        date: "2022-05-05",
      },
      {
        auditor: "OtterSec",
        url: "https://github.com/orca-so/whirlpools/blob/main/.audits/2024-08-21.pdf",
        date: "2024-08-21",
      },
      {
        auditor: "Sec3",
        url: "https://github.com/orca-so/whirlpools/blob/main/.audits/2025-02-28.pdf",
        date: "2025-02-28",
      },
      {
        auditor: "Sec3",
        url: "https://github.com/orca-so/whirlpools/blob/main/.audits/2025-06-23.pdf",
        date: "2025-06-23",
      },
      {
        auditor: "Sec3",
        url: "https://github.com/orca-so/whirlpools/blob/main/.audits/2025-08-22.pdf",
        date: "2025-08-22",
      },
    ],
  },
});
