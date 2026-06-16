import {
  accountValueNode,
  addPdasVisitor,
  assertIsNode,
  associatedTokenAccountValueNode,
  bottomUpTransformerVisitor,
  conditionalValueNode,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  pdaLinkNode,
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  programIdValueNode,
  programNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  rootNode,
  setInstructionAccountDefaultValuesVisitor,
  TOKEN_METADATA_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

// ---------------------------------------------------------------------------
// Program constants used by Bubblegum CPIs. These are specific to Bubblegum,
// so they live in this config rather than the shared coda packages.
// ---------------------------------------------------------------------------

// v1 instructions log/compress through the SPL programs...
const SPL_NOOP_PROGRAM_VALUE_NODE = publicKeyValueNode(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV",
  "splNoop",
);
const SPL_ACCOUNT_COMPRESSION_PROGRAM_VALUE_NODE = publicKeyValueNode(
  "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK",
  "splAccountCompression",
);
// ...while v2 instructions use the MPL forks.
const MPL_NOOP_PROGRAM_VALUE_NODE = publicKeyValueNode(
  "mnoopTCrg4p8ry25e4bcWA9XZjbNjMTfgYVGGEdRsf3",
  "mplNoop",
);
const MPL_ACCOUNT_COMPRESSION_PROGRAM_VALUE_NODE = publicKeyValueNode(
  "mcmt6YrQEMKw8Mw43FmpRLmf7BqRnFMKmAcbxE3xkAW",
  "mplAccountCompression",
);

// Fixed PDA Bubblegum uses to sign mpl-core CPIs for collection checks.
const MPL_CORE_CPI_SIGNER_VALUE_NODE = publicKeyValueNode(
  "CbNY3JiXdXNE9tPNEk1aRZVEkWdj2v7kfJLNQwZZgpXk",
  "mplCoreCpiSigner",
);

// ---------------------------------------------------------------------------
// Instruction groupings (kept in sync with the IDL).
// ---------------------------------------------------------------------------

// Instructions taking both `treeAuthority` and `merkleTree`, so the tree
// authority can be derived as the TreeConfig PDA of the tree.
const TREE_CONFIG_INSTRUCTIONS = [
  "burn",
  "burnV2",
  "cancelRedeem",
  "closeTreeV2",
  "compress",
  "createTree",
  "createTreeV2",
  "delegate",
  "delegateAndFreezeV2",
  "delegateV2",
  "freezeV2",
  "mintToCollectionV1",
  "mintV1",
  "mintV2",
  "redeem",
  "setAndVerifyCollection",
  "setCollectionV2",
  "setNonTransferableV2",
  "setTreeDelegate",
  "thawAndRevokeV2",
  "thawV2",
  "transfer",
  "transferV2",
  "unverifyCollection",
  "unverifyCreator",
  "unverifyCreatorV2",
  "updateAssetDataV2",
  "updateMetadata",
  "updateMetadataV2",
  "verifyCollection",
  "verifyCreator",
  "verifyCreatorV2",
];

const LOG_WRAPPER_V1_INSTRUCTIONS = [
  "burn",
  "cancelRedeem",
  "compress",
  "createTree",
  "decompressV1",
  "delegate",
  "mintToCollectionV1",
  "mintV1",
  "redeem",
  "setAndVerifyCollection",
  "transfer",
  "unverifyCollection",
  "unverifyCreator",
  "updateMetadata",
  "verifyCollection",
  "verifyCreator",
];
const LOG_WRAPPER_V2_INSTRUCTIONS = [
  "burnV2",
  "closeTreeV2",
  "createTreeV2",
  "delegateAndFreezeV2",
  "delegateV2",
  "freezeV2",
  "mintV2",
  "setCollectionV2",
  "setNonTransferableV2",
  "thawAndRevokeV2",
  "thawV2",
  "transferV2",
  "unverifyCreatorV2",
  "updateAssetDataV2",
  "updateMetadataV2",
  "verifyCreatorV2",
];
// compressionProgram has the same split, except decompressV1 has no
// compression program account.
const COMPRESSION_V1_INSTRUCTIONS = LOG_WRAPPER_V1_INSTRUCTIONS.filter(
  (ix) => ix !== "decompressV1",
);
const COMPRESSION_V2_INSTRUCTIONS = LOG_WRAPPER_V2_INSTRUCTIONS;

// Legacy v1 collection instructions where the collection mint is a required
// account, so the Token Metadata PDAs can be derived from it.
const COLLECTION_METADATA_INSTRUCTIONS = [
  "mintToCollectionV1",
  "setAndVerifyCollection",
  "unverifyCollection",
  "verifyCollection",
];
const COLLECTION_EDITION_INSTRUCTIONS = COLLECTION_METADATA_INSTRUCTIONS;
// The collection authority record default is a fixed program id (no seeds), so
// it also applies to updateMetadata where the collection accounts are optional.
const COLLECTION_AUTHORITY_RECORD_INSTRUCTIONS = [
  ...COLLECTION_METADATA_INSTRUCTIONS,
  "updateMetadata",
];

// ---------------------------------------------------------------------------
// Token Metadata PDAs are derived against the Token Metadata program, so we
// inject a minimal program node (PDAs only) for Bubblegum's collection CPIs to
// link against. This keeps the generated resolvers self-contained.
// ---------------------------------------------------------------------------
const tokenMetadataProgramNode = programNode({
  name: "mplTokenMetadata",
  publicKey: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  pdas: [
    pdaNode({
      name: "metadata",
      docs: ["Token Metadata account for a mint"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode("programId", publicKeyTypeNode()),
        variablePdaSeedNode("mint", publicKeyTypeNode()),
      ],
    }),
    pdaNode({
      name: "masterEdition",
      docs: ["Master edition account for a mint"],
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode("programId", publicKeyTypeNode()),
        variablePdaSeedNode("mint", publicKeyTypeNode()),
        constantPdaSeedNodeFromString("utf8", "edition"),
      ],
    }),
  ],
});

const addTokenMetadataProgramVisitor = bottomUpTransformerVisitor([
  {
    select: "[rootNode]",
    transform: (node) => {
      assertIsNode(node, "rootNode");
      return rootNode(node.program, [
        ...node.additionalPrograms,
        tokenMetadataProgramNode,
      ]);
    },
  },
]);

// Helpers for the Token Metadata PDA default values.
const metadataPdaOf = (mintAccount) =>
  pdaValueNode(pdaLinkNode("metadata", "mplTokenMetadata"), [
    pdaSeedValueNode("programId", TOKEN_METADATA_PROGRAM_VALUE_NODE),
    pdaSeedValueNode("mint", accountValueNode(mintAccount)),
  ]);
const masterEditionPdaOf = (mintAccount) =>
  pdaValueNode(pdaLinkNode("masterEdition", "mplTokenMetadata"), [
    pdaSeedValueNode("programId", TOKEN_METADATA_PROGRAM_VALUE_NODE),
    pdaSeedValueNode("mint", accountValueNode(mintAccount)),
  ]);

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-mpl-bubblegum",
  },

  visitors: [
    addTokenMetadataProgramVisitor,

    addPdasVisitor({
      bubblegum: [
        {
          name: "treeConfig",
          docs: [
            "Tree authority / config PDA that manages a concurrent merkle tree",
          ],
          seeds: [
            variablePdaSeedNode(
              "merkleTree",
              publicKeyTypeNode(),
              "The address of the merkle tree account",
            ),
          ],
        },
        {
          name: "voucher",
          docs: ["Redemption voucher PDA created when a leaf is redeemed"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "voucher"),
            variablePdaSeedNode(
              "merkleTree",
              publicKeyTypeNode(),
              "The address of the merkle tree account",
            ),
            variablePdaSeedNode(
              "nonce",
              numberTypeNode("u64"),
              "The nonce (leaf index) of the redeemed leaf",
            ),
          ],
        },
        {
          name: "assetId",
          docs: ["Deterministic asset id for a compressed NFT leaf"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "asset"),
            variablePdaSeedNode(
              "merkleTree",
              publicKeyTypeNode(),
              "The address of the merkle tree account",
            ),
            variablePdaSeedNode(
              "nonce",
              numberTypeNode("u64"),
              "The nonce (leaf index) of the leaf",
            ),
          ],
        },
        {
          name: "bubblegumSigner",
          docs: [
            "PDA used by Bubblegum to sign Token Metadata collection CPIs",
          ],
          seeds: [constantPdaSeedNodeFromString("utf8", "collection_cpi")],
        },
        {
          name: "mintAuthority",
          docs: ["Mint authority PDA for a decompressed NFT mint"],
          seeds: [
            variablePdaSeedNode(
              "mint",
              publicKeyTypeNode(),
              "The address of the decompressed mint account",
            ),
          ],
        },
      ],
    }),

    updateAccountsVisitor({
      treeConfig: {
        pda: pdaLinkNode("treeConfig"),
      },
      voucher: {
        pda: pdaLinkNode("voucher"),
      },
    }),

    setInstructionAccountDefaultValuesVisitor([
      // log wrapper (noop) program — SPL for v1, MPL fork for v2.
      ...LOG_WRAPPER_V1_INSTRUCTIONS.map((instruction) => ({
        account: "logWrapper",
        instruction,
        defaultValue: SPL_NOOP_PROGRAM_VALUE_NODE,
      })),
      ...LOG_WRAPPER_V2_INSTRUCTIONS.map((instruction) => ({
        account: "logWrapper",
        instruction,
        defaultValue: MPL_NOOP_PROGRAM_VALUE_NODE,
      })),

      // account compression program — SPL for v1, MPL fork for v2.
      ...COMPRESSION_V1_INSTRUCTIONS.map((instruction) => ({
        account: "compressionProgram",
        instruction,
        defaultValue: SPL_ACCOUNT_COMPRESSION_PROGRAM_VALUE_NODE,
      })),
      ...COMPRESSION_V2_INSTRUCTIONS.map((instruction) => ({
        account: "compressionProgram",
        instruction,
        defaultValue: MPL_ACCOUNT_COMPRESSION_PROGRAM_VALUE_NODE,
      })),

      // Bubblegum collection-CPI signer PDA (seed "collection_cpi").
      {
        account: "bubblegumSigner",
        defaultValue: pdaValueNode(pdaLinkNode("bubblegumSigner"), []),
      },

      // mpl-core CPI signer — required whenever a core collection is present;
      // always required for setCollectionV2.
      {
        account: "mplCoreCpiSigner",
        defaultValue: conditionalValueNode({
          condition: accountValueNode("coreCollection"),
          ifTrue: MPL_CORE_CPI_SIGNER_VALUE_NODE,
        }),
      },
      {
        account: "mplCoreCpiSigner",
        instruction: "setCollectionV2",
        defaultValue: MPL_CORE_CPI_SIGNER_VALUE_NODE,
      },

      // Derive the tree authority (TreeConfig PDA) from the merkle tree.
      ...TREE_CONFIG_INSTRUCTIONS.map((instruction) => ({
        account: "treeAuthority",
        instruction,
        defaultValue: pdaValueNode(pdaLinkNode("treeConfig"), [
          pdaSeedValueNode("merkleTree", accountValueNode("merkleTree")),
        ]),
      })),

      // Legacy v1 collection instructions: derive the Token Metadata accounts
      // from the collection mint, and disable the (deprecated) collection
      // authority record by pointing it at the Bubblegum program id.
      ...COLLECTION_METADATA_INSTRUCTIONS.map((instruction) => ({
        account: "collectionMetadata",
        instruction,
        defaultValue: metadataPdaOf("collectionMint"),
      })),
      ...COLLECTION_EDITION_INSTRUCTIONS.map((instruction) => ({
        account: "editionAccount",
        instruction,
        defaultValue: masterEditionPdaOf("collectionMint"),
      })),
      ...COLLECTION_AUTHORITY_RECORD_INSTRUCTIONS.map((instruction) => ({
        account: "collectionAuthorityRecordPda",
        instruction,
        defaultValue: programIdValueNode(),
      })),

      // decompressV1: derive the Token Metadata accounts, mint authority PDA
      // and the leaf owner's associated token account from the new mint.
      {
        account: "metadata",
        instruction: "decompressV1",
        defaultValue: metadataPdaOf("mint"),
      },
      {
        account: "masterEdition",
        instruction: "decompressV1",
        defaultValue: masterEditionPdaOf("mint"),
      },
      {
        account: "mintAuthority",
        instruction: "decompressV1",
        defaultValue: pdaValueNode(pdaLinkNode("mintAuthority"), [
          pdaSeedValueNode("mint", accountValueNode("mint")),
        ]),
      },
      {
        account: "tokenAccount",
        instruction: "decompressV1",
        defaultValue: associatedTokenAccountValueNode({
          owner: accountValueNode("leafOwner"),
          mint: accountValueNode("mint"),
        }),
      },
    ]),
  ],
});
