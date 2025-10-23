import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

const addCustomPDAsVisitor = addPdasVisitor({
  tokenMetadata: [
    {
      name: "metadata",
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode(
          "programId",
          publicKeyTypeNode(),
          "The address of the program",
        ),
        variablePdaSeedNode(
          "mint",
          publicKeyTypeNode(),
          "The address of the mint account",
        ),
      ],
    },
    {
      name: "masterEdition",
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode(
          "programId",
          publicKeyTypeNode(),
          "The address of the program",
        ),
        variablePdaSeedNode(
          "mint",
          publicKeyTypeNode(),
          "The address of the mint account",
        ),
        constantPdaSeedNodeFromString("utf8", "edition"),
      ],
    },
  ],
});

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-token-metadata",
  },
  instructionAccountDefaultValues: [
    ...[
      "approveCollectionAuthority",
      "approveUseAuthority",
      "burn",
      "burnNft",
      "closeAccounts",
      "closeEscrowAccount",
      "create",
      "createEscrowAccount",
      "createMasterEdition",
      "createMasterEditionV3",
      "createMetadataAccount",
      "createMetadataAccountV2",
      "createMetadataAccountV3",
      "delegate",
      "deprecatedCreateMasterEdition",
      "deprecatedMintNewEditionFromMasterEditionViaPrintingToken",
      "lock",
      "migrate",
      "mint",
      "resize",
      "revoke",
      "revokeCollectionAuthority",
      "revokeUseAuthority",
      "setTokenStandard",
      "transfer",
      "unlock",
      "update",
      "use",
      "utilize",
    ].map((instruction) => ({
      instruction,
      account: "metadata",
      defaultValue: pdaValueNode(pdaLinkNode("metadata"), [
        pdaSeedValueNode(
          "programId",
          publicKeyValueNode("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
        ),
        pdaSeedValueNode("mint", accountValueNode("mint")),
      ]),
    })),
  ],
  visitors: [
    updateAccountsVisitor({
      metadata: {
        pda: pdaLinkNode("metadata"),
      },
    }),
    addCustomPDAsVisitor,
  ],
});
