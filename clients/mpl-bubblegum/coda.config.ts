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
  setStructFieldDocsVisitor,
  TOKEN_METADATA_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  updateDefinedTypesVisitor,
  updateInstructionsVisitor,
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
const metadataPdaOf = (mintAccount: string) =>
  pdaValueNode(pdaLinkNode("metadata", "mplTokenMetadata"), [
    pdaSeedValueNode("programId", TOKEN_METADATA_PROGRAM_VALUE_NODE),
    pdaSeedValueNode("mint", accountValueNode(mintAccount)),
  ]);
const masterEditionPdaOf = (mintAccount: string) =>
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

    // -----------------------------------------------------------------------
    // Documentation. Bubblegum stores compressed NFTs (cNFTs) as leaves of a
    // concurrent Merkle tree (via the SPL/MPL account-compression program)
    // rather than as individual on-chain accounts. The IDL ships short
    // instruction-level docs but almost no docs for accounts, arguments, or
    // the shared types, so we inject them here.
    // -----------------------------------------------------------------------
    updateInstructionsVisitor({
      burn: {
        docs: [
          "Burns a compressed NFT leaf, permanently removing it from the tree.",
          "",
          "The caller must be the leaf owner or delegate. The leaf's current state",
          "(root, dataHash, creatorHash, nonce, index) plus a Merkle proof passed",
          "as remaining accounts are required to prove the leaf exists before it",
          "is replaced with an empty node.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      burnV2: {
        docs: [
          "Burns a `LeafSchema` V2 leaf node from the tree.",
          "",
          "Like `burn`, but for V2 trees created with `createTreeV2`. The signing",
          "authority may be the leaf owner or, if the asset belongs to an MPL Core",
          "collection, a permanent burn delegate plugin on that collection.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Optional authority, defaults to `payer`. Must be either the leaf",
              "owner or a permanent burn delegate plugin on the collection.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          mplCoreCpiSigner: {
            docs: [
              "PDA Bubblegum uses to sign CPIs into the MPL Core program on behalf",
              "of a core collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          mplCoreProgram: {
            docs: ["The MPL Core program, invoked for V2 collection CPIs."],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      cancelRedeem: {
        docs: [
          "Cancels a pending redemption, restoring the leaf to the tree.",
          "",
          "Closes the `voucher` PDA created by `redeem` and re-inserts the leaf",
          "at its original position, verified against the current Merkle `root`.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          voucher: {
            docs: [
              "Voucher PDA created by `redeem`; closed by this instruction as the",
              "leaf is restored to the tree.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree; the leaf recorded in `voucher` is",
              "re-inserted at its original position and verified against this root.",
            ],
          },
        },
      },
      closeTreeV2: {
        docs: [
          "Closes an empty V2 tree and its `TreeConfig` PDA, reclaiming rent.",
          "",
          "Only the tree creator or delegate may close a tree, and it must be",
          "empty (no un-burned leaves) for the underlying compression program",
          "to allow the close.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          authority: { docs: ["Tree creator or delegate."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          recipient: {
            docs: [
              "Recipient for the reclaimed lamports (tree + config PDA). Must be",
              "the tree creator or delegate.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
      },
      collectV2: {
        docs: [
          "Collects accumulated protocol fees from a V2 tree's `TreeConfig` PDA.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          destination: {
            docs: ["Account to receive the collected V2 tree fees."],
          },
        },
      },
      compress: {
        docs: [
          "Compresses an existing decompressed (SPL/Token Metadata) NFT into a",
          "new leaf of a compressed Merkle tree.",
          "",
          "Reads the mint, token account, metadata and master edition of the",
          "decompressed NFT to build the leaf, then appends it to the tree.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          tokenAccount: {
            docs: [
              "Token account that will hold the decompressed NFT for `leafOwner`.",
            ],
          },
          mint: {
            docs: [
              "Mint account of the decompressed NFT, created fresh during decompression.",
            ],
          },
          metadata: {
            docs: ["Metadata account created for the decompressed NFT."],
          },
          masterEdition: {
            docs: ["Master edition account created for the decompressed NFT."],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          tokenProgram: { docs: ["The SPL Token program."] },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
      },
      createTree: {
        docs: [
          "Creates a new empty Merkle tree for storing compressed (V1) NFTs.",
          "",
          "Initializes both the underlying concurrent Merkle tree account and its",
          "`TreeConfig` PDA. `maxDepth` and `maxBufferSize` are fixed for the life",
          "of the tree and bound its maximum leaf capacity and the number of",
          "concurrent modifications it can support.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeCreator: {
            docs: [
              "Creator of the tree, recorded in `TreeConfig` when the tree was",
              "created.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          maxDepth: {
            docs: [
              "Maximum depth of the Merkle tree, i.e. log2 of the maximum number of",
              "leaves it can hold. Fixed for the lifetime of the tree.",
            ],
          },
          maxBufferSize: {
            docs: [
              "Maximum number of concurrent, unconflicting modifications the tree's",
              "changelog buffer can track. Fixed for the lifetime of the tree.",
            ],
          },
          public: {
            docs: [
              "Optional flag; when `true`, any signer may mint into the tree, not",
              "just the tree delegate. Defaults to `false`.",
            ],
          },
        },
      },
      createTreeV2: {
        docs: [
          "Creates a new tree for use with `LeafSchema` V2 leaf nodes.",
          "",
          "Identical in shape to `createTree`, but the resulting tree's leaves",
          "support the V2 functionality (MPL Core collections, freezing,",
          "non-transferable assets, and permanent delegate plugins) enabled by",
          "`mintV2` and the other `*V2` instructions.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeCreator: {
            docs: ["Optional tree creator, defaults to `payer`."],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          maxDepth: {
            docs: [
              "Maximum depth of the Merkle tree, i.e. log2 of the maximum number of",
              "leaves it can hold. Fixed for the lifetime of the tree.",
            ],
          },
          maxBufferSize: {
            docs: [
              "Maximum number of concurrent, unconflicting modifications the tree's",
              "changelog buffer can track. Fixed for the lifetime of the tree.",
            ],
          },
          public: {
            docs: [
              "Optional flag; when `true`, any signer may mint into the tree, not",
              "just the tree delegate. Defaults to `false`.",
            ],
          },
        },
      },
      decompressV1: {
        docs: [
          "Decompresses a leaf node from the tree into a regular SPL/Token",
          "Metadata NFT.",
          "",
          "Consumes the `voucher` PDA created by `redeem`, then mints a new SPL",
          "token, and creates the associated Token Metadata metadata and master",
          "edition accounts so the asset can be held and traded like any other",
          "NFT.",
        ],
        accounts: {
          voucher: {
            docs: [
              "Voucher PDA created by `redeem`; closed by this instruction once its",
              "leaf data has been used to mint the decompressed NFT.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          tokenAccount: {
            docs: [
              "Token account that will hold the decompressed NFT for `leafOwner`.",
            ],
          },
          mint: {
            docs: [
              "Mint account of the decompressed NFT, created fresh during decompression.",
            ],
          },
          mintAuthority: {
            docs: ["PDA mint authority for the decompressed NFT's mint."],
          },
          metadata: {
            docs: ["Metadata account created for the decompressed NFT."],
          },
          masterEdition: {
            docs: ["Master edition account created for the decompressed NFT."],
          },
          systemProgram: { docs: ["The Solana System program."] },
          sysvarRent: { docs: ["The Rent sysvar."] },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          tokenProgram: { docs: ["The SPL Token program."] },
          associatedTokenProgram: {
            docs: ["The SPL Associated Token Account program."],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
        },
        arguments: {
          metadata: {
            docs: [
              "Metadata args of the leaf being decompressed; must match the leaf's",
              "stored `dataHash` and is used to populate the new Token Metadata",
              "account.",
            ],
          },
        },
      },
      delegate: {
        docs: [
          "Sets (or clears) the delegate authority for a compressed NFT leaf.",
          "",
          "The delegate may transfer or burn the leaf on the owner's behalf.",
          "Pass the leaf owner as `newLeafDelegate` to clear an existing delegate.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          previousLeafDelegate: {
            docs: ["The leaf's delegate before this instruction runs."],
          },
          newLeafDelegate: {
            docs: [
              "Delegate to set on the leaf; pass the leaf owner to clear an",
              "existing delegate.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      delegateAndFreezeV2: {
        docs: [
          "Delegates and freezes a `LeafSchema` V2 leaf node in a single",
          "instruction, preventing it from being transferred or burned while",
          "frozen.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          leafOwner: { docs: ["Optional leaf owner, defaults to `payer`."] },
          previousLeafDelegate: { docs: ["Defaults to `leafOwner`."] },
          newLeafDelegate: {
            docs: [
              "Delegate to set on the leaf; pass the leaf owner to clear an",
              "existing delegate.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          collectionHash: {
            docs: [
              "Expected current `collectionHash` of the `LeafSchema` V2 leaf, if",
              "any, verified before this instruction updates the leaf.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      delegateV2: {
        docs: [
          "Sets (or clears) the delegate authority for a `LeafSchema` V2 leaf",
          "node.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          leafOwner: { docs: ["Optional leaf owner, defaults to `payer`."] },
          previousLeafDelegate: { docs: ["Defaults to `leafOwner`."] },
          newLeafDelegate: {
            docs: [
              "Delegate to set on the leaf; pass the leaf owner to clear an",
              "existing delegate.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          collectionHash: {
            docs: [
              "Expected current `collectionHash` of the `LeafSchema` V2 leaf, if",
              "any, verified before this instruction updates the leaf.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      freezeV2: {
        docs: [
          "Freezes a `LeafSchema` V2 leaf node, preventing it from being",
          "transferred or burned until it is thawed.",
          "",
          "Must be signed by the leaf delegate or, when the asset belongs to an",
          "MPL Core collection, a permanent freeze delegate plugin on that",
          "collection.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Optional authority, defaults to `payer`. Must be either the leaf",
              "delegate or a permanent freeze delegate plugin on the collection.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      mintToCollectionV1: {
        docs: [
          "Mints a new compressed NFT (V1) leaf and adds it to a verified Token",
          "Metadata collection in the same instruction.",
          "",
          "Behaves like `mintV1`, but also CPIs into the Token Metadata program",
          "(via the `bubblegumSigner` PDA) to mark the collection as verified on",
          "the resulting leaf's metadata.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeDelegate: {
            docs: [
              "Delegate authority of the tree, authorized to mint into and manage",
              "the tree on the creator's behalf.",
            ],
          },
          collectionAuthority: {
            docs: [
              "Authority of the collection the asset is being added to or removed",
              "from (typically the collection's update authority or a delegate).",
            ],
          },
          collectionAuthorityRecordPda: {
            docs: [
              "If there is no collection authority record PDA, pass the Bubblegum",
              "program address instead.",
            ],
          },
          collectionMint: {
            docs: ["Mint account of the Token Metadata collection NFT."],
          },
          collectionMetadata: {
            docs: ["Metadata account of the Token Metadata collection NFT."],
          },
          editionAccount: {
            docs: [
              "Master edition account of the Token Metadata collection NFT.",
            ],
          },
          bubblegumSigner: {
            docs: [
              "PDA Bubblegum uses to sign the CPI into the Token Metadata program",
              "that (un)verifies the collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          metadataArgs: {
            docs: [
              "Metadata for the newly minted compressed NFT, which will be added to",
              "the collection identified by `collectionMint`.",
            ],
          },
        },
      },
      mintV1: {
        docs: [
          "Mints a new compressed NFT (V1) leaf and appends it to the tree.",
          "",
          "The tree delegate (or, for public trees, any signer) supplies the",
          "leaf's `MetadataArgs`; Bubblegum hashes it, builds the `LeafSchema`,",
          "and appends the resulting leaf to the Merkle tree.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeDelegate: {
            docs: [
              "Delegate authority of the tree, authorized to mint into and manage",
              "the tree on the creator's behalf.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          message: { docs: ["Metadata for the newly minted compressed NFT."] },
        },
      },
      mintV2: {
        docs: [
          "Mints a new asset using `LeafSchema` V2 and optionally adds it to an",
          "MPL Core collection. Requires a tree created with `createTreeV2`.",
          "",
          "`LeafSchema` V2 enables new functionality over V1 minting:",
          "",
          "1. Uses MPL Core collections instead of Token Metadata collections.",
          "2. Uses the streamlined `MetadataArgsV2` arguments, which eliminate",
          "   the collection verified flag: any collection included is",
          "   automatically considered verified.",
          "3. Allows plugins such as Royalties or Permanent Burn Delegate on the",
          "   MPL Core collection to authorize operations on the Bubblegum",
          "   asset. The `BubblegumV2` plugin must also be present on the MPL",
          "   Core collection for it to be usable with Bubblegum.",
          "4. Allows freezing/thawing of the asset, as well as marking it",
          "   permanently non-transferable (soulbound).",
          "5. Reserves (but does not yet use) an optional data blob and schema",
          "   that can be associated with the asset.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeDelegate: {
            docs: ["Optional tree delegate, defaults to `payer`."],
          },
          collectionAuthority: {
            docs: [
              "Optional collection authority, defaults to `treeDelegate`.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          mplCoreCpiSigner: {
            docs: [
              "PDA Bubblegum uses to sign CPIs into the MPL Core program on behalf",
              "of a core collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          mplCoreProgram: {
            docs: ["The MPL Core program, invoked for V2 collection CPIs."],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          metadataArgs: {
            docs: ["Metadata for the newly minted `LeafSchema` V2 asset."],
          },
          assetData: {
            docs: [
              "Optional raw asset data blob to associate with the newly minted",
              "asset. Reserved for future use.",
            ],
          },
          assetDataSchema: {
            docs: [
              "Schema describing the format of `assetData`. Reserved for future",
              "use.",
            ],
          },
        },
      },
      redeem: {
        docs: [
          "Redeems (vouches for) a leaf, removing it from the tree and recording",
          "its data in a new `voucher` PDA.",
          "",
          "This is the first step of decompression: once redeemed, the leaf slot",
          "in the tree is emptied and the leaf's data is preserved in `voucher`",
          "until `decompressV1` consumes it, or `cancelRedeem` restores it.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          voucher: {
            docs: [
              "Voucher PDA created by this instruction to record the redeemed",
              "leaf's data until it is decompressed or the redeem is cancelled.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      setAndVerifyCollection: {
        docs: [
          "Sets a collection on a leaf's metadata and verifies it in one",
          "instruction.",
          "",
          "Equivalent to updating the leaf's `collection` field to `collection`",
          "and then verifying it, without a separate `verifyCollection` call.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeDelegate: {
            docs: [
              "Checked as a signer here because `setAndVerifyCollection` actually",
              "changes the leaf's metadata, unlike plain collection verification.",
            ],
          },
          collectionAuthority: {
            docs: [
              "Authority of the collection the asset is being added to or removed",
              "from (typically the collection's update authority or a delegate).",
            ],
          },
          collectionAuthorityRecordPda: {
            docs: [
              "If there is no collection authority record PDA, pass the Bubblegum",
              "program address instead.",
            ],
          },
          collectionMint: {
            docs: ["Mint account of the Token Metadata collection NFT."],
          },
          collectionMetadata: {
            docs: ["Metadata account of the Token Metadata collection NFT."],
          },
          editionAccount: {
            docs: [
              "Master edition account of the Token Metadata collection NFT.",
            ],
          },
          bubblegumSigner: {
            docs: [
              "PDA Bubblegum uses to sign the CPI into the Token Metadata program",
              "that (un)verifies the collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current metadata args, verified against `dataHash` before",
              "`collection` is set and marked verified.",
            ],
          },
          collection: {
            docs: [
              "Collection mint to set on the leaf's metadata and mark verified in",
              "the same instruction.",
            ],
          },
        },
      },
      setCollectionV2: {
        docs: [
          "Sets the collection on a `LeafSchema` V2 leaf node.",
          "",
          "Unlike the V1 flow, no separate verification step is required: any",
          "collection recorded on a V2 leaf is automatically considered",
          "verified.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "If the item is not currently in a collection, must be the tree",
              "owner/delegate. If the item is being removed from a collection,",
              "must be an authority for the existing collection. Defaults to",
              "`payer`.",
            ],
          },
          newCollectionAuthority: {
            docs: [
              "If the item is being added to a new collection, must be the",
              "authority for the new collection. Defaults to `authority`.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          newCoreCollection: {
            docs: [
              "MPL Core collection account the asset is being moved into.",
            ],
          },
          mplCoreCpiSigner: {
            docs: [
              "PDA Bubblegum uses to sign CPIs into the MPL Core program on behalf",
              "of a core collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          mplCoreProgram: {
            docs: ["The MPL Core program, invoked for V2 collection CPIs."],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current `MetadataArgsV2`, verified against `dataHash`",
              "before its collection is set.",
            ],
          },
        },
      },
      setDecompressableState: {
        docs: [
          "Sets the `decompressible_state` of a tree.",
          "",
          "Deprecated alias for `setDecompressibleState`, kept for backwards",
          "compatibility; prefer `setDecompressibleState` in new code.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          treeCreator: {
            docs: [
              "Creator of the tree, recorded in `TreeConfig` when the tree was",
              "created.",
            ],
          },
        },
        arguments: {
          decompressableState: {
            docs: [
              "The new decompressible state to set on the tree: `Enabled` allows",
              "`redeem`/`decompressV1`, `Disabled` blocks them.",
            ],
          },
        },
      },
      setDecompressibleState: {
        docs: [
          "Sets the `decompressible_state` of a tree.",
          "",
          "Controls whether leaves in the tree may be `redeem`ed and",
          "`decompressV1`'d into regular NFTs. Only the tree creator may call",
          "this instruction.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          treeCreator: {
            docs: [
              "Creator of the tree, recorded in `TreeConfig` when the tree was",
              "created.",
            ],
          },
        },
        arguments: {
          decompressableState: {
            docs: [
              "The new decompressible state to set on the tree: `Enabled` allows",
              "`redeem`/`decompressV1`, `Disabled` blocks them.",
            ],
          },
        },
      },
      setNonTransferableV2: {
        docs: [
          "Permanently sets the non-transferable flag on a `LeafSchema` V2 leaf",
          "node, making it soulbound.",
          "",
          "Unlike freezing, a non-transferable asset can still be burned by its",
          "owner; it just can no longer change owners. This flag cannot be",
          "unset once applied.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Must be a permanent freeze delegate on the collection. Defaults to",
              "`payer`.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      setTreeDelegate: {
        docs: [
          "Sets a new delegate authority for a tree.",
          "",
          "Only the current tree creator may reassign the tree delegate, which",
          "is authorized to mint into the tree and manage it on the creator's",
          "behalf.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          treeCreator: {
            docs: [
              "Creator of the tree, recorded in `TreeConfig` when the tree was",
              "created.",
            ],
          },
          newTreeDelegate: {
            docs: ["New delegate authority to set for the tree."],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
      },
      thawAndRevokeV2: {
        docs: [
          "Thaws a previously frozen `LeafSchema` V2 leaf node and revokes its",
          "delegate (resetting the delegate back to the leaf owner) in a single",
          "instruction.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          leafDelegate: {
            docs: ["Optional leaf delegate, defaults to `payer`."],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          collectionHash: {
            docs: [
              "Expected current `collectionHash` of the `LeafSchema` V2 leaf, if",
              "any, verified before this instruction updates the leaf.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      thawV2: {
        docs: [
          "Thaws a previously frozen `LeafSchema` V2 leaf node, restoring its",
          "ability to be transferred or burned.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Optional authority, defaults to `payer`. Must be either the leaf",
              "delegate or a permanent freeze delegate plugin on the collection.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      transfer: {
        docs: [
          "Transfers a compressed NFT leaf from one owner to another.",
          "",
          "Must be signed by the current leaf owner or delegate. Clears any",
          "existing delegate on the leaf as part of the transfer.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          newLeafOwner: {
            docs: ["New owner the leaf is being transferred to."],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      transferV2: {
        docs: [
          "Transfers a `LeafSchema` V2 leaf node from one owner to another.",
          "",
          "Must be signed by the leaf owner or, when the asset belongs to an MPL",
          "Core collection, a permanent transfer delegate plugin on that",
          "collection. Frozen or non-transferable leaves cannot be transferred.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Optional authority, defaults to `payer`. Must be either the leaf",
              "owner or a permanent transfer delegate plugin on the collection.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          newLeafOwner: {
            docs: ["New owner the leaf is being transferred to."],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
        },
      },
      unverifyCollection: {
        docs: [
          "Unverifies a previously verified collection from a leaf node.",
          "",
          "Marks the `collection` field of the leaf's metadata as unverified,",
          "without removing the collection reference itself.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeDelegate: {
            docs: [
              "Checked as a signer here because this instruction path shares logic",
              "with `setAndVerifyCollection`, which actually changes the leaf's",
              "metadata.",
            ],
          },
          collectionAuthority: {
            docs: [
              "Authority of the collection the asset is being added to or removed",
              "from (typically the collection's update authority or a delegate).",
            ],
          },
          collectionAuthorityRecordPda: {
            docs: [
              "If there is no collection authority record PDA, pass the Bubblegum",
              "program address instead.",
            ],
          },
          collectionMint: {
            docs: ["Mint account of the Token Metadata collection NFT."],
          },
          collectionMetadata: {
            docs: ["Metadata account of the Token Metadata collection NFT."],
          },
          editionAccount: {
            docs: [
              "Master edition account of the Token Metadata collection NFT.",
            ],
          },
          bubblegumSigner: {
            docs: [
              "PDA Bubblegum uses to sign the CPI into the Token Metadata program",
              "that (un)verifies the collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current metadata args, verified against `dataHash` before",
              "its collection is marked unverified.",
            ],
          },
        },
      },
      unverifyCreator: {
        docs: [
          "Unverifies a creator from a leaf node.",
          "",
          "The named `creator` must sign to remove their own verified flag from",
          "the leaf's creators array.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          creator: {
            docs: [
              "One of the leaf's creators, whose verified flag is being changed by",
              "this instruction. Must sign to (un)verify itself.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current metadata args, verified against `dataHash` before",
              "`creator` is marked unverified.",
            ],
          },
        },
      },
      unverifyCreatorV2: {
        docs: [
          "Unverifies a creator from a `LeafSchema` V2 leaf node.",
          "",
          "The named `creator` must sign to remove their own verified flag from",
          "the leaf's `MetadataArgsV2` creators array.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          creator: { docs: ["Optional creator, defaults to `payer`."] },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current `MetadataArgsV2`, used to reconstruct and verify",
              "the leaf before `creator` is marked unverified.",
            ],
          },
        },
      },
      updateAssetDataV2: {
        docs: [
          "Updates the off-chain asset data hash and status flags of a",
          "`LeafSchema` V2 leaf node.",
          "",
          "Callable by the collection authority, or the tree owner/delegate for",
          "assets not in a verified collection.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Either the collection authority or the tree owner/delegate,",
              "depending on whether the asset is in a verified collection.",
              "Defaults to `payer`.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          previousAssetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the leaf, if any, verified before",
              "it is replaced by `newAssetData`.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          newAssetData: {
            docs: ["Optional raw asset data blob to associate with the asset."],
          },
          newAssetDataSchema: {
            docs: ["Schema describing the format of `newAssetData`."],
          },
        },
      },
      updateMetadata: {
        docs: [
          "Updates the on-chain metadata fields of a compressed NFT leaf.",
          "",
          "The caller supplies `currentMetadata` (verified against the leaf's",
          "stored `dataHash`) and `updateArgs` describing which fields to",
          "change; unset fields in `updateArgs` are left as-is.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          authority: {
            docs: [
              "Either the collection authority or the tree owner/delegate,",
              "depending on whether the asset is in a verified collection.",
            ],
          },
          collectionMint: {
            docs: ["Used when the asset is in a verified collection."],
          },
          collectionMetadata: {
            docs: ["Used when the asset is in a verified collection."],
          },
          collectionAuthorityRecordPda: {
            docs: [
              "Delegated collection authority record PDA. Pass the Bubblegum",
              "program id if `collectionAuthority` is the collection's direct",
              "update authority rather than a delegate.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          currentMetadata: {
            docs: [
              "The leaf's current metadata args, verified against `dataHash` before",
              "`updateArgs` is applied.",
            ],
          },
          updateArgs: {
            docs: [
              "The metadata fields to change; fields left unset keep their current",
              "value on the leaf.",
            ],
          },
        },
      },
      updateMetadataV2: {
        docs: [
          "Updates the on-chain metadata fields of a `LeafSchema` V2 leaf node.",
          "",
          "Like `updateMetadata`, but for V2 leaves: `currentMetadata` is",
          "verified against the leaf before `updateArgs` is applied.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          authority: {
            docs: [
              "Either the collection authority or the tree owner/delegate,",
              "depending on whether the asset is in a verified collection.",
              "Defaults to `payer`.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          coreCollection: {
            docs: [
              "MPL Core collection account the asset belongs to (V2 collections).",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          currentMetadata: {
            docs: [
              "The leaf's current `MetadataArgsV2`, verified against `dataHash`",
              "before `updateArgs` is applied.",
            ],
          },
          updateArgs: {
            docs: [
              "The metadata fields to change; fields left unset keep their current",
              "value on the leaf.",
            ],
          },
        },
      },
      verifyCollection: {
        docs: [
          "Verifies a collection for a leaf node.",
          "",
          "Marks the `collection` field already set on the leaf's metadata as",
          "verified; the collection's update authority (or delegate) must sign.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          treeDelegate: {
            docs: [
              "Checked as a signer here because this instruction path shares logic",
              "with `setAndVerifyCollection`, which actually changes the leaf's",
              "metadata.",
            ],
          },
          collectionAuthority: {
            docs: [
              "Authority of the collection the asset is being added to or removed",
              "from (typically the collection's update authority or a delegate).",
            ],
          },
          collectionAuthorityRecordPda: {
            docs: [
              "If there is no collection authority record PDA, pass the Bubblegum",
              "program address instead.",
            ],
          },
          collectionMint: {
            docs: ["Mint account of the Token Metadata collection NFT."],
          },
          collectionMetadata: {
            docs: ["Metadata account of the Token Metadata collection NFT."],
          },
          editionAccount: {
            docs: [
              "Master edition account of the Token Metadata collection NFT.",
            ],
          },
          bubblegumSigner: {
            docs: [
              "PDA Bubblegum uses to sign the CPI into the Token Metadata program",
              "that (un)verifies the collection.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          tokenMetadataProgram: {
            docs: [
              "The Token Metadata program, invoked to read or (un)verify the",
              "legacy collection accounts.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current metadata args, verified against `dataHash` before",
              "its already-set collection is marked verified.",
            ],
          },
        },
      },
      verifyCreator: {
        docs: [
          "Verifies a creator for a leaf node.",
          "",
          "The named `creator` must sign to mark their own entry in the leaf's",
          "creators array as verified.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: {
            docs: [
              "Delegate authority for the leaf; defaults to the leaf owner when no",
              "delegate is set.",
            ],
          },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          creator: {
            docs: [
              "One of the leaf's creators, whose verified flag is being changed by",
              "this instruction. Must sign to (un)verify itself.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          dataHash: {
            docs: [
              "Keccak256 hash of the leaf's metadata, used together with `root` to",
              "verify the leaf before it is modified.",
            ],
          },
          creatorHash: {
            docs: [
              "Keccak256 hash of the leaf's creators array, used together with",
              "`root` to verify the leaf before it is modified.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current metadata args, verified against `dataHash` before",
              "`creator` is marked verified.",
            ],
          },
        },
      },
      verifyCreatorV2: {
        docs: [
          "Verifies a creator for a `LeafSchema` V2 leaf node.",
          "",
          "The named `creator` must sign to mark their own entry in the leaf's",
          "`MetadataArgsV2` creators array as verified.",
        ],
        accounts: {
          treeAuthority: {
            docs: [
              "The tree's `TreeConfig` PDA, which stores its configuration and acts",
              "as the tree's authority for CPIs into the compression program.",
            ],
          },
          payer: {
            docs: [
              "Account that pays for the transaction and any account rent.",
            ],
          },
          creator: { docs: ["Optional creator, defaults to `payer`."] },
          leafOwner: {
            docs: ["Owner of the compressed NFT leaf being operated on."],
          },
          leafDelegate: { docs: ["Defaults to `leafOwner`."] },
          merkleTree: {
            docs: [
              "The concurrent Merkle tree account storing the compressed leaves,",
              "owned by the account compression program.",
            ],
          },
          logWrapper: {
            docs: [
              "The SPL/MPL Noop program, used to log leaf data so off-chain indexers",
              "can reconstruct the tree.",
            ],
          },
          compressionProgram: {
            docs: [
              "The SPL/MPL Account Compression program that owns and manages the",
              "Merkle tree.",
            ],
          },
          systemProgram: { docs: ["The Solana System program."] },
        },
        arguments: {
          root: {
            docs: [
              "Current Merkle root of the tree, used together with the Merkle proof",
              "(passed as remaining accounts) to verify the leaf being operated on.",
            ],
          },
          assetDataHash: {
            docs: [
              "Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any,",
              "carried through unchanged by this instruction.",
            ],
          },
          flags: {
            docs: [
              "Expected current status flags (e.g. frozen, non-transferable) of the",
              "`LeafSchema` V2 leaf, verified before this instruction updates them.",
            ],
          },
          nonce: {
            docs: [
              "Tree-scoped nonce identifying the leaf, equal to the tree's",
              "`numMinted` at the time the leaf was minted. Combined with the tree",
              "address to derive the leaf's asset id.",
            ],
          },
          index: {
            docs: [
              "Position of the leaf within the Merkle tree, used with the Merkle",
              "proof to locate and verify the leaf.",
            ],
          },
          message: {
            docs: [
              "The leaf's current `MetadataArgsV2`, used to reconstruct and verify",
              "the leaf before `creator` is marked verified.",
            ],
          },
        },
      },
    }),

    updateDefinedTypesVisitor({
      creator: {
        docs: ["A single creator entry in a compressed NFT's metadata."],
      },
      uses: {
        docs: [
          "Consumable-use configuration for an asset (e.g. tickets or",
          "redeemable passes), tracking how it may be used and how many uses",
          "remain.",
        ],
      },
      collection: {
        docs: [
          "A collection reference on a V1 leaf's metadata, with its own",
          "verified flag independent of the collection's on-chain verification",
          "state.",
        ],
      },
      metadataArgs: {
        docs: [
          "Metadata for a V1 (`LeafSchema` V1) compressed NFT leaf.",
          "",
          "Mirrors the fields of a Token Metadata `Metadata` account closely",
          "enough that a leaf can be decompressed into one. Hashed (along with",
          "`creators`) to produce the `dataHash`/`creatorHash` used to verify",
          "the leaf on every mutating instruction.",
        ],
      },
      metadataArgsV2: {
        docs: [
          "Metadata for a `LeafSchema` V2 compressed NFT leaf.",
          "",
          "Streamlined relative to `MetadataArgs`: it drops `editionNonce` and",
          "`uses`, and its `collection` is a plain, always-verified `Pubkey`",
          "rather than a `Collection` struct with a separate verified flag.",
        ],
      },
      updateArgs: {
        docs: [
          "Metadata fields to change on a leaf via `updateMetadata` /",
          "`updateMetadataV2`. Every field is optional; omitted fields keep",
          "their current value.",
        ],
      },
      version: {
        docs: [
          "Schema version of a tree's leaves: `V1` (Token Metadata",
          "collections) or `V2` (MPL Core collections, freezing, and",
          "non-transferable assets).",
        ],
      },
      leafSchema: {
        docs: [
          "The canonical on-chain representation of a compressed NFT leaf,",
          "hashed to produce the value stored at a tree's leaf node.",
          "",
          "`V1` is produced by `mintV1`/`mintToCollectionV1` and the legacy",
          "instruction family; `V2` is produced by `mintV2` and adds",
          "`collectionHash`, `assetDataHash` and `flags` to support MPL Core",
          "collections and freezing/non-transferable assets.",
        ],
      },
      tokenProgramVersion: {
        docs: [
          "Which SPL token program a decompressed leaf's mint should use.",
        ],
      },
      tokenStandard: {
        docs: [
          "Token Metadata token standard recorded on a leaf. Bubblegum",
          "currently only mints `NonFungible` assets; the other variants exist",
          "for compatibility with the wider Token Metadata type.",
        ],
      },
      useMethod: { docs: ["How the remaining uses of an asset are consumed."] },
      bubblegumEventType: {
        docs: [
          "Discriminator for events Bubblegum logs via the noop program, read",
          "back by off-chain indexers to reconstruct tree state.",
        ],
      },
      decompressibleState: {
        docs: [
          "Whether leaves in a tree may be redeemed and decompressed into",
          "regular SPL/Token Metadata NFTs. Set per-tree with",
          "`setDecompressibleState`.",
        ],
      },
      assetDataSchema: {
        docs: [
          "Format of the optional off-chain `assetData` blob attached to a",
          "`LeafSchema` V2 asset. Reserved for future use.",
        ],
      },
      instructionName: {
        docs: [
          "Discriminator identifying which Bubblegum instruction produced a",
          "logged event, read back by off-chain indexers.",
        ],
      },
    }),

    setStructFieldDocsVisitor({
      creator: {
        address: "Public key of the creator.",
        verified: "Whether this creator has signed to verify their share.",
        share: [
          "The creator's royalty share of the asset.",
          "",
          "The value is a percentage (0-100), not basis points.",
        ],
      },
      uses: {
        useMethod: "How the remaining uses are consumed.",
        remaining: "Number of uses left.",
        total: "Total number of uses the asset was minted with.",
      },
      collection: {
        verified:
          "Whether the collection has been verified via `verifyCollection` / `setAndVerifyCollection`.",
        key: "Mint of the collection NFT.",
      },
      metadataArgs: {
        tokenProgramVersion:
          "Which SPL token program a decompressed version of this leaf's mint should use.",
        creators:
          "Creators of the asset and their royalty shares; hashed to produce `creatorHash`.",
      },
      updateArgs: {
        name: "New name for the asset, or unset to keep the current name.",
        symbol:
          "New symbol for the asset, or unset to keep the current symbol.",
        uri: "New metadata URI for the asset, or unset to keep the current URI.",
        creators:
          "New creators array for the asset, or unset to keep the current creators.",
        sellerFeeBasisPoints:
          "New royalty basis points, or unset to keep the current value.",
        primarySaleHappened:
          "New primary sale flag, or unset to keep the current value.",
        isMutable: "New mutability flag, or unset to keep the current value.",
      },
      leafSchema: {
        id: "Asset id of the leaf, derived from the tree address and `nonce`.",
        owner: "Current owner of the leaf.",
        delegate: "Current delegate of the leaf (equal to `owner` when unset).",
        nonce:
          "Tree-scoped nonce assigned to the leaf when it was minted; part of the asset id derivation.",
        dataHash:
          "Keccak256 hash of the leaf's metadata (`MetadataArgs`/`MetadataArgsV2`).",
        creatorHash: "Keccak256 hash of the leaf's creators array.",
        collectionHash:
          "Hash of the leaf's MPL Core collection reference, if any (V2 only).",
        assetDataHash:
          "Hash of the leaf's optional off-chain asset data, if any (V2 only).",
        flags:
          "Packed status bits for the leaf, e.g. frozen and non-transferable (V2 only).",
      },
      treeConfig: {
        treeCreator: "Original creator of the tree.",
        treeDelegate:
          "Current delegate authority of the tree, authorized to mint and manage it on the creator's behalf.",
        totalMintCapacity:
          "Maximum number of leaves the tree can ever hold, derived from its `maxDepth`.",
        numMinted:
          "Number of leaves minted into the tree so far; used as the `nonce` for the next minted leaf.",
        isPublic:
          "Whether any signer may mint into the tree, not just the tree delegate.",
        isDecompressible:
          "Whether leaves in the tree may currently be redeemed and decompressed.",
        version:
          "Schema version (`V1` or `V2`) leaves minted into this tree use.",
      },
      voucher: {
        leafSchema:
          "Snapshot of the redeemed leaf's data, preserved until it is decompressed or the redeem is cancelled.",
        index:
          "Position the leaf occupied in the Merkle tree before it was redeemed.",
        merkleTree: "Address of the tree the leaf was redeemed from.",
      },
    }),
  ],
});
