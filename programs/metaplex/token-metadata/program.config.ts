import {
  accountValueNode,
  associatedTokenAccountValueNode,
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  TOKEN_METADATA_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("tokenMetadata");

export const pdas = definePdas(program, {
  metadata: {
    seeds: [
      constant("metadata"),
      variable("programId", publicKeyTypeNode(), "The address of the program"),
      variable("mint", publicKeyTypeNode(), "The address of the mint account"),
    ],
  },
  masterEdition: {
    seeds: [
      constant("metadata"),
      variable("programId", publicKeyTypeNode(), "The address of the program"),
      variable("mint", publicKeyTypeNode(), "The address of the mint account"),
      constant("edition"),
    ],
  },
  tokenRecord: {
    seeds: [
      constant("metadata"),
      variable("programId", publicKeyTypeNode(), "The address of the program"),
      variable("mint", publicKeyTypeNode(), "The address of the mint account"),
      constant("token_record"),
      variable(
        "token",
        publicKeyTypeNode(),
        "The address of the token account",
      ),
    ],
  },
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

// Legacy collection (un)verification instructions. Each takes a required
// `collectionMint`, so the collection's Metadata (`collection`) and master
// edition (`collectionMasterEditionAccount`) accounts are fully derivable.
const COLLECTION_VERIFY_INSTRUCTIONS = [
  "verifyCollection",
  "unverifyCollection",
  "setAndVerifyCollection",
  "verifySizedCollectionItem",
  "unverifySizedCollectionItem",
  "setAndVerifySizedCollectionItem",
];

// Instructions whose `collectionMetadata` account is the Metadata PDA of the
// required `collectionMint`.
const COLLECTION_METADATA_INSTRUCTIONS = [
  "setCollectionSize",
  "bubblegumSetCollectionSize",
];

const metadataPdaOf = (mintAccount: string) =>
  pdas.metadata.value({
    programId: TOKEN_METADATA_PROGRAM_VALUE_NODE,
    mint: accountValueNode(mintAccount),
  });
const masterEditionPdaOf = (mintAccount: string) =>
  pdas.masterEdition.value({
    programId: TOKEN_METADATA_PROGRAM_VALUE_NODE,
    mint: accountValueNode(mintAccount),
  });
const tokenRecordPdaOf = (mintAccount: string, tokenAccount: string) =>
  pdas.tokenRecord.value({
    programId: TOKEN_METADATA_PROGRAM_VALUE_NODE,
    mint: accountValueNode(mintAccount),
    token: accountValueNode(tokenAccount),
  });
const ataOf = (mintAccount: string, ownerAccount: string) =>
  associatedTokenAccountValueNode({
    owner: accountValueNode(ownerAccount),
    mint: accountValueNode(mintAccount),
  });

export default defineProgram({
  package: {
    name: "@solana-programs/token-metadata",
    description: "TypeScript client for the Metaplex Token Metadata program",
    keywords: ["metaplex", "token-metadata", "nft", "ian-macalinao"],
    version: "0.10.0",
    releaseNotes: [
      "**Breaking:** now has a peer dependency on `@solana-program/token` (`^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0`): the generated code imports the token program addresses (`TOKEN_PROGRAM_ADDRESS`, `ASSOCIATED_TOKEN_PROGRAM_ADDRESS`) and `findAssociatedTokenPda` from it instead of inlining them.",
      "Generated from the program megagraph in macalinao/coda; the README, reference docs and package metadata are regenerated.",
    ],
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

    // Legacy collection verification: derive the collection's Metadata and
    // master edition accounts from the required `collectionMint`.
    ...COLLECTION_VERIFY_INSTRUCTIONS.flatMap((instruction) => [
      {
        instruction,
        account: "collection",
        defaultValue: metadataPdaOf("collectionMint"),
      },
      {
        instruction,
        account: "collectionMasterEditionAccount",
        defaultValue: masterEditionPdaOf("collectionMint"),
      },
    ]),

    // `collectionMetadata` = Metadata PDA of the required `collectionMint`.
    ...COLLECTION_METADATA_INSTRUCTIONS.map((instruction) => ({
      instruction,
      account: "collectionMetadata",
      defaultValue: metadataPdaOf("collectionMint"),
    })),
  ],
  visitors: [
    updateAccountsVisitor({
      metadata: {
        pda: pdas.metadata.link,
      },
    }),
    pdas.visitor,
  ],
});
