import { defineBundles } from "@macalinao/megagraph";

/**
 * Umbrella packages. Each re-exports several program packages and contains no
 * code of its own. Programs are listed by their directory under programs/, in
 * priority order: a name exported by several of them resolves to the first.
 */
export default defineBundles([
  {
    slug: "goki",
    package: {
      name: "@solana-programs/goki",
      description:
        "TypeScript client for Goki programs (Smart Wallet and Token Signer)",
      keywords: ["goki", "smart-wallet", "multisig"],
    },
    programs: ["goki-smart-wallet", "goki-token-signer"],
  },
  {
    slug: "kamino-lending",
    package: {
      name: "@solana-programs/kamino-lending",
      description:
        "TypeScript client for the Kamino Lending and Kamino Farms programs",
      keywords: ["kamino", "lending", "farms", "defi", "ian-macalinao"],
    },
    // Lending first: both programs have `updateGlobalConfig` and
    // `updateGlobalConfigAdmin` instructions, and in the former combined
    // client Kamino Lending's overwrote Farms'.
    programs: ["kamino-klend", "kamino-farms"],
  },
  {
    slug: "quarry",
    package: {
      name: "@solana-programs/quarry",
      description: "TypeScript client for Quarry protocol programs",
      keywords: ["quarry", "mining", "staking", "ian-macalinao"],
    },
    programs: [
      "quarry-mine",
      "quarry-merge-mine",
      "quarry-mint-wrapper",
      "quarry-operator",
      "quarry-redeemer",
      "quarry-registry",
    ],
  },
  {
    slug: "tribeca",
    package: {
      name: "@solana-programs/tribeca",
      description:
        "TypeScript client for Tribeca governance programs (Govern and Locked Voter)",
      keywords: ["tribeca", "governance", "voting", "dao"],
    },
    // Locked Voter first: both programs have an `activateProposal`
    // instruction, and in the former combined client Locked Voter's
    // overwrote Govern's.
    programs: ["tribeca-locked-voter", "tribeca-govern"],
  },
]);
