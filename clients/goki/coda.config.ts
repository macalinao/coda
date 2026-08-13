import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  pdaLinkNode,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@solana-programs/goki",
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
      ],
      tokenSigner: [
        {
          name: "nftSigner",
          docs: ["Signer PDA owned by the holder of a given NFT mint"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "GokiTokenSigner"),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
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
