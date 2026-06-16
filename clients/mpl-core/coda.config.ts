import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-mpl-core",
  },

  // mpl-core assets and collections are keypair-generated accounts rather than
  // PDAs, so the only PDA the program derives is the per-asset signing PDA used
  // by the `executeV1` instruction.
  visitors: [
    addPdasVisitor({
      mplCoreProgram: [
        {
          name: "assetSigner",
          docs: ["The signing PDA for an asset, used by executeV1"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "mpl-core-execute"),
            variablePdaSeedNode(
              "asset",
              publicKeyTypeNode(),
              "The address of the asset account",
            ),
          ],
        },
      ],
    }),

    setInstructionAccountDefaultValuesVisitor([
      {
        account: "assetSigner",
        instruction: "executeV1",
        defaultValue: pdaValueNode(pdaLinkNode("assetSigner"), [
          pdaSeedValueNode("asset", accountValueNode("asset")),
        ]),
      },
    ]),
  ],
});
