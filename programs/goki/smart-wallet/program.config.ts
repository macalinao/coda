import {
  constant,
  definePdas,
  numberTypeNode,
  programHandle,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("smartWallet");

export const pdas = definePdas(program, {
  smartWallet: {
    docs: ["Smart wallet (multisig) account, keyed by its base address"],
    seeds: [constant("GokiSmartWallet"), variable("base", publicKeyTypeNode())],
  },
  transaction: {
    docs: ["Transaction proposed to a smart wallet, keyed by index"],
    seeds: [
      constant("GokiTransaction"),
      variable("smartWallet", publicKeyTypeNode()),
      variable("index", numberTypeNode("u64")),
    ],
  },
  subaccountInfo: {
    docs: ["Metadata describing a smart wallet subaccount"],
    seeds: [
      constant("GokiSubaccountInfo"),
      variable("subaccount", publicKeyTypeNode()),
    ],
  },
  walletDerived: {
    docs: [
      "Subaccount derived from a smart wallet, which the wallet can sign for",
    ],
    seeds: [
      constant("GokiSmartWalletDerived"),
      variable("smartWallet", publicKeyTypeNode()),
      variable("index", numberTypeNode("u64")),
    ],
  },
  ownerInvoker: {
    docs: [
      "Subaccount an owner of a smart wallet can invoke instructions through",
    ],
    seeds: [
      constant("GokiSmartWalletOwnerInvoker"),
      variable("smartWallet", publicKeyTypeNode()),
      variable("index", numberTypeNode("u64")),
    ],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Goki Smart Wallet (multisig) program",
    keywords: ["goki", "smart-wallet", "multisig"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/goki`, which now re-exports this package.",
    ],
  },
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  program: {
    displayName: "Goki Smart Wallet",
    description:
      "Owner-threshold multisig that proposes, approves and executes arbitrary instructions, optionally behind a timelock.",
    repository: "https://github.com/GokiProtocol/goki",
    addresses: {
      devnet: "GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH",
    },
    docs: "https://docs.rs/smart-wallet",
  },

  // The Goki IDLs are legacy Anchor 0.x IDLs: they declare their PDA seeds
  // inline on instruction accounts, which the Anchor-to-Codama parser drops.
  // Redeclare them here so the client ships PDA helpers.
  visitors: [
    pdas.visitor,
    updateAccountsVisitor({
      smartWallet: {
        pda: pdas.smartWallet.link,
      },
      transaction: {
        pda: pdas.transaction.link,
      },
      subaccountInfo: {
        pda: pdas.subaccountInfo.link,
      },
    }),
  ],
});
