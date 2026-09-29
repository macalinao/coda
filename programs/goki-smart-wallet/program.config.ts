import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  numberTypeNode,
  pdaLinkNode,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/goki-smart-wallet",
    description:
      "TypeScript client for the Goki Smart Wallet (multisig) program",
    keywords: ["goki", "smart-wallet", "multisig"],
    initialVersion: "0.4.1",
  },

  // The Goki IDLs are legacy Anchor 0.x IDLs: they declare their PDA seeds
  // inline on instruction accounts, which the Anchor-to-Codama parser drops.
  // Redeclare them here so the client ships PDA helpers.
  visitors: [
    addPdasVisitor({
      smartWallet: [
        {
          name: "smartWallet",
          docs: ["Smart wallet (multisig) account, keyed by its base address"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "GokiSmartWallet"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "transaction",
          docs: ["Transaction proposed to a smart wallet, keyed by index"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "GokiTransaction"),
            variablePdaSeedNode("smartWallet", publicKeyTypeNode()),
            variablePdaSeedNode("index", numberTypeNode("u64")),
          ],
        },
        {
          name: "subaccountInfo",
          docs: ["Metadata describing a smart wallet subaccount"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "GokiSubaccountInfo"),
            variablePdaSeedNode("subaccount", publicKeyTypeNode()),
          ],
        },
        {
          name: "walletDerived",
          docs: [
            "Subaccount derived from a smart wallet, which the wallet can sign for",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "GokiSmartWalletDerived"),
            variablePdaSeedNode("smartWallet", publicKeyTypeNode()),
            variablePdaSeedNode("index", numberTypeNode("u64")),
          ],
        },
        {
          name: "ownerInvoker",
          docs: [
            "Subaccount an owner of a smart wallet can invoke instructions through",
          ],
          seeds: [
            constantPdaSeedNodeFromString(
              "utf8",
              "GokiSmartWalletOwnerInvoker",
            ),
            variablePdaSeedNode("smartWallet", publicKeyTypeNode()),
            variablePdaSeedNode("index", numberTypeNode("u64")),
          ],
        },
      ],
    }),
    updateAccountsVisitor({
      smartWallet: {
        pda: pdaLinkNode("smartWallet"),
      },
      transaction: {
        pda: pdaLinkNode("transaction"),
      },
      subaccountInfo: {
        pda: pdaLinkNode("subaccountInfo"),
      },
    }),
  ],
});
