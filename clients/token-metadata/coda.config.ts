import {
  accountValueNode,
  addPdasVisitor,
  associatedTokenAccountValueNode,
  constantPdaSeedNodeFromString,
  defineConfig,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  TOKEN_METADATA_PROGRAM_VALUE_NODE,
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
    {
      name: "tokenRecord",
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
        constantPdaSeedNodeFromString("utf8", "token_record"),
        variablePdaSeedNode(
          "token",
          publicKeyTypeNode(),
          "The address of the token account",
        ),
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
// Instruction groupings (kept in sync with the IDL). The modern "Digital
// Asset" instructions all operate on a single `mint`, so their Token Metadata
// PDAs (metadata, master edition, token record) and the associated token
// accounts are fully derivable from that mint. Metaplex resolves master
// edition / token record only for (Programmable) Non-Fungible standards; we
// derive them unconditionally as a convenience — override for fungibles.
// ---------------------------------------------------------------------------

// Instructions where `metadata` = the Metadata PDA of `mint`.
const METADATA_INSTRUCTIONS = [
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
];

// Instructions whose master-edition account is the `mint`'s own master edition
// PDA. The account is named `masterEdition` in some and `edition` in others.
const MASTER_EDITION_AS_MASTER_EDITION_INSTRUCTIONS = [
  "create",
  "mint",
  "delegate",
  "revoke",
];
const MASTER_EDITION_AS_EDITION_INSTRUCTIONS = [
  "transfer",
  "lock",
  "unlock",
  "update",
  "use",
  "migrate",
  "resize",
  "burn",
  "createMasterEdition",
  "createMasterEditionV3",
  "deprecatedCreateMasterEdition",
];

// Instructions with a single `tokenRecord` account derived from `mint` and a
// required `token` account. (`delegate` / `revoke` also have a `tokenRecord`,
// but their `token` account is optional and so cannot seed the PDA.)
const TOKEN_RECORD_INSTRUCTIONS = ["mint", "lock", "unlock", "migrate"];

const metadataPdaOf = (mintAccount: string) =>
  pdaValueNode(pdaLinkNode("metadata"), [
    pdaSeedValueNode("programId", TOKEN_METADATA_PROGRAM_VALUE_NODE),
    pdaSeedValueNode("mint", accountValueNode(mintAccount)),
  ]);
const masterEditionPdaOf = (mintAccount: string) =>
  pdaValueNode(pdaLinkNode("masterEdition"), [
    pdaSeedValueNode("programId", TOKEN_METADATA_PROGRAM_VALUE_NODE),
    pdaSeedValueNode("mint", accountValueNode(mintAccount)),
  ]);
const tokenRecordPdaOf = (mintAccount: string, tokenAccount: string) =>
  pdaValueNode(pdaLinkNode("tokenRecord"), [
    pdaSeedValueNode("programId", TOKEN_METADATA_PROGRAM_VALUE_NODE),
    pdaSeedValueNode("mint", accountValueNode(mintAccount)),
    pdaSeedValueNode("token", accountValueNode(tokenAccount)),
  ]);
const ataOf = (mintAccount: string, ownerAccount: string) =>
  associatedTokenAccountValueNode({
    owner: accountValueNode(ownerAccount),
    mint: accountValueNode(mintAccount),
  });

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-token-metadata",
  },
  instructionAccountDefaultValues: [
    // Metadata PDA of the mint.
    ...METADATA_INSTRUCTIONS.map((instruction) => ({
      instruction,
      account: "metadata",
      defaultValue: metadataPdaOf("mint"),
    })),

    // Master edition PDA of the mint (account name varies by instruction).
    ...MASTER_EDITION_AS_MASTER_EDITION_INSTRUCTIONS.map((instruction) => ({
      instruction,
      account: "masterEdition",
      defaultValue: masterEditionPdaOf("mint"),
    })),
    ...MASTER_EDITION_AS_EDITION_INSTRUCTIONS.map((instruction) => ({
      instruction,
      account: "edition",
      defaultValue: masterEditionPdaOf("mint"),
    })),

    // Token record PDA, derived from the mint and the token account.
    ...TOKEN_RECORD_INSTRUCTIONS.map((instruction) => ({
      instruction,
      account: "tokenRecord",
      defaultValue: tokenRecordPdaOf("mint", "token"),
    })),

    // Associated token accounts and their token records for transfer.
    // (`mint`'s `tokenOwner` is optional, so its `token` ATA cannot be
    // derived and must be supplied by the caller.)
    {
      instruction: "transfer",
      account: "token",
      defaultValue: ataOf("mint", "tokenOwner"),
    },
    {
      instruction: "transfer",
      account: "destination",
      defaultValue: ataOf("mint", "destinationOwner"),
    },
    {
      instruction: "transfer",
      account: "ownerTokenRecord",
      defaultValue: tokenRecordPdaOf("mint", "token"),
    },
    {
      instruction: "transfer",
      account: "destinationTokenRecord",
      defaultValue: tokenRecordPdaOf("mint", "destination"),
    },
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
