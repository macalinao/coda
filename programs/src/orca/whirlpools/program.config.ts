import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { programHandle } from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

export const program = programHandle("whirlpool");

export default defineProgram({
  protocol,
  name: "whirlpools",
  program,
  idl,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
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
