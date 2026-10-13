import type { AnchorIdl } from "@codama/nodes-from-anchor";
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
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

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
  protocol,
  name: "smart-wallet",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
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
