# Bubblegum Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fmpl-bubblegum.svg)](https://www.npmjs.com/package/%40solana-programs%2Fmpl-bubblegum)

- Program ID: `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY`
- TypeScript Client: [`@solana-programs/mpl-bubblegum`](https://www.npmjs.com/package/@solana-programs/mpl-bubblegum)

## Table of Contents

- [Accounts](#accounts)
  - [treeConfig](#treeConfig)
  - [voucher](#voucher)
- [Instructions](#instructions)
  - [burn](#burn)
  - [burnV2](#burnV2)
  - [cancelRedeem](#cancelRedeem)
  - [closeTreeV2](#closeTreeV2)
  - [collectV2](#collectV2)
  - [compress](#compress)
  - [createTree](#createTree)
  - [createTreeV2](#createTreeV2)
  - [decompressV1](#decompressV1)
  - [delegate](#delegate)
  - [delegateAndFreezeV2](#delegateAndFreezeV2)
  - [delegateV2](#delegateV2)
  - [freezeV2](#freezeV2)
  - [mintToCollectionV1](#mintToCollectionV1)
  - [mintV1](#mintV1)
  - [mintV2](#mintV2)
  - [redeem](#redeem)
  - [setAndVerifyCollection](#setAndVerifyCollection)
  - [setCollectionV2](#setCollectionV2)
  - [setDecompressableState](#setDecompressableState)
  - [setDecompressibleState](#setDecompressibleState)
  - [setNonTransferableV2](#setNonTransferableV2)
  - [setTreeDelegate](#setTreeDelegate)
  - [thawAndRevokeV2](#thawAndRevokeV2)
  - [thawV2](#thawV2)
  - [transfer](#transfer)
  - [transferV2](#transferV2)
  - [unverifyCollection](#unverifyCollection)
  - [unverifyCreator](#unverifyCreator)
  - [unverifyCreatorV2](#unverifyCreatorV2)
  - [updateAssetDataV2](#updateAssetDataV2)
  - [updateMetadata](#updateMetadata)
  - [updateMetadataV2](#updateMetadataV2)
  - [verifyCollection](#verifyCollection)
  - [verifyCreator](#verifyCreator)
  - [verifyCreatorV2](#verifyCreatorV2)
- [PDAs](#pdas)
  - [treeConfig](#treeConfig)
  - [voucher](#voucher)
  - [assetId](#assetId)
  - [bubblegumSigner](#bubblegumSigner)
  - [mintAuthority](#mintAuthority)
- [Types](#types)
  - [creator](#creator)
  - [uses](#uses)
  - [collection](#collection)
  - [metadataArgs](#metadataArgs)
  - [metadataArgsV2](#metadataArgsV2)
  - [updateArgs](#updateArgs)
  - [version](#version)
  - [leafSchema](#leafSchema)
  - [tokenProgramVersion](#tokenProgramVersion)
  - [tokenStandard](#tokenStandard)
  - [useMethod](#useMethod)
  - [bubblegumEventType](#bubblegumEventType)
  - [decompressibleState](#decompressibleState)
  - [assetDataSchema](#assetDataSchema)
  - [instructionName](#instructionName)
- [Errors](#errors)

## Accounts

### treeConfig

**Fields:**

| Field               | Type                                          | Description                                                                                       |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `discriminator`     | `unknown`                                     | -                                                                                                 |
| `treeCreator`       | `PublicKey`                                   | Original creator of the tree.                                                                     |
| `treeDelegate`      | `PublicKey`                                   | Current delegate authority of the tree, authorized to mint and manage it on the creator's behalf. |
| `totalMintCapacity` | `u64`                                         | Maximum number of leaves the tree can ever hold, derived from its `maxDepth`.                     |
| `numMinted`         | `u64`                                         | Number of leaves minted into the tree so far; used as the `nonce` for the next minted leaf.       |
| `isPublic`          | `boolean`                                     | Whether any signer may mint into the tree, not just the tree delegate.                            |
| `isDecompressible`  | [decompressibleState](#decompressibleState-3) | Whether leaves in the tree may currently be redeemed and decompressed.                            |
| `version`           | [version](#version-3)                         | Schema version (`V1` or `V2`) leaves minted into this tree use.                                   |

### voucher

**Fields:**

| Field           | Type                        | Description                                                                                          |
| --------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                   | -                                                                                                    |
| `leafSchema`    | [leafSchema](#leafSchema-3) | Snapshot of the redeemed leaf's data, preserved until it is decompressed or the redeem is cancelled. |
| `index`         | `u32`                       | Position the leaf occupied in the Merkle tree before it was redeemed.                                |
| `merkleTree`    | `PublicKey`                 | Address of the tree the leaf was redeemed from.                                                      |

## Instructions

### burn

Burns a compressed NFT leaf, permanently removing it from the tree.

The caller must be the leaf owner or delegate. The leaf's current state

(root, dataHash, creatorHash, nonce, index) plus a Merkle proof passed

as remaining accounts are required to prove the leaf exists before it

is replaced with an empty node.

**Accounts:**

| Account              | Type     | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | readonly | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`         | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### burnV2

Burns a `LeafSchema` V2 leaf node from the tree.

Like `burn`, but for V2 trees created with `createTreeV2`. The signing

authority may be the leaf owner or, if the asset belongs to an MPL Core

collection, a permanent burn delegate plugin on that collection.

**Accounts:**

| Account              | Type               | Description                                                                                                                         |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable           | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable   | Account that pays for the transaction and any account rent.                                                                         |
| `authority`          | signer, optional   | Optional authority, defaults to `payer`. Must be either the leaf owner or a permanent burn delegate plugin on the collection.       |
| `leafOwner`          | readonly           | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | optional           | Defaults to `leafOwner`.                                                                                                            |
| `merkleTree`         | writable           | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `coreCollection`     | writable, optional | MPL Core collection account the asset belongs to (V2 collections).                                                                  |
| `mplCoreCpiSigner`   | optional           | PDA Bubblegum uses to sign CPIs into the MPL Core program on behalf of a core collection.                                           |
| `logWrapper`         | readonly           | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly           | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `mplCoreProgram`     | readonly           | The MPL Core program, invoked for V2 collection CPIs.                                                                               |
| `systemProgram`      | readonly           | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `assetDataHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### cancelRedeem

Cancels a pending redemption, restoring the leaf to the tree.

Closes the `voucher` PDA created by `redeem` and re-inserts the leaf

at its original position, verified against the current Merkle `root`.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | readonly         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | signer, writable | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `voucher`            | writable         | Voucher PDA created by `redeem`; closed by this instruction as the leaf is restored to the tree.                                    |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                             |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                       |
| `root`          | `u8`[32]  | Current Merkle root of the tree; the leaf recorded in `voucher` is re-inserted at its original position and verified against this root. |

### closeTreeV2

Closes an empty V2 tree and its `TreeConfig` PDA, reclaiming rent.

Only the tree creator or delegate may close a tree, and it must be

empty (no un-burned leaves) for the underlying compression program

to allow the close.

**Accounts:**

| Account              | Type     | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `authority`          | signer   | Tree creator or delegate.                                                                                                           |
| `merkleTree`         | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `recipient`          | writable | Recipient for the reclaimed lamports (tree + config PDA). Must be the tree creator or delegate.                                     |
| `compressionProgram` | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `logWrapper`         | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `systemProgram`      | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### collectV2

Collects accumulated protocol fees from a V2 tree's `TreeConfig` PDA.

**Accounts:**

| Account         | Type     | Description                                                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority` | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `destination`   | writable | Account to receive the collected V2 tree fees.                                                                                      |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### compress

Compresses an existing decompressed (SPL/Token Metadata) NFT into a

new leaf of a compressed Merkle tree.

Reads the mint, token account, metadata and master edition of the

decompressed NFT to build the leaf, then appends it to the tree.

**Accounts:**

| Account                | Type             | Description                                                                                                                         |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`        | readonly         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`            | signer           | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`         | readonly         | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`           | readonly         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `tokenAccount`         | writable         | Token account that will hold the decompressed NFT for `leafOwner`.                                                                  |
| `mint`                 | writable         | Mint account of the decompressed NFT, created fresh during decompression.                                                           |
| `metadata`             | writable         | Metadata account created for the decompressed NFT.                                                                                  |
| `masterEdition`        | writable         | Master edition account created for the decompressed NFT.                                                                            |
| `payer`                | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `logWrapper`           | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram`   | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `tokenProgram`         | readonly         | The SPL Token program.                                                                                                              |
| `tokenMetadataProgram` | readonly         | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                           |
| `systemProgram`        | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### createTree

Creates a new empty Merkle tree for storing compressed (V1) NFTs.

Initializes both the underlying concurrent Merkle tree account and its

`TreeConfig` PDA. `maxDepth` and `maxBufferSize` are fixed for the life

of the tree and bound its maximum leaf capacity and the number of

concurrent modifications it can support.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `treeCreator`        | signer           | Creator of the tree, recorded in `TreeConfig` when the tree was created.                                                            |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                          |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `discriminator` | `unknown` | -                                                                                                                                    |
| `maxDepth`      | `u32`     | Maximum depth of the Merkle tree, i.e. log2 of the maximum number of leaves it can hold. Fixed for the lifetime of the tree.         |
| `maxBufferSize` | `u32`     | Maximum number of concurrent, unconflicting modifications the tree's changelog buffer can track. Fixed for the lifetime of the tree. |
| `public`        | `boolean` | null                                                                                                                                 | Optional flag; when `true`, any signer may mint into the tree, not just the tree delegate. Defaults to `false`. |

### createTreeV2

Creates a new tree for use with `LeafSchema` V2 leaf nodes.

Identical in shape to `createTree`, but the resulting tree's leaves

support the V2 functionality (MPL Core collections, freezing,

non-transferable assets, and permanent delegate plugins) enabled by

`mintV2` and the other `*V2` instructions.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `treeCreator`        | signer, optional | Optional tree creator, defaults to `payer`.                                                                                         |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                          |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `discriminator` | `unknown` | -                                                                                                                                    |
| `maxDepth`      | `u32`     | Maximum depth of the Merkle tree, i.e. log2 of the maximum number of leaves it can hold. Fixed for the lifetime of the tree.         |
| `maxBufferSize` | `u32`     | Maximum number of concurrent, unconflicting modifications the tree's changelog buffer can track. Fixed for the lifetime of the tree. |
| `public`        | `boolean` | null                                                                                                                                 | Optional flag; when `true`, any signer may mint into the tree, not just the tree delegate. Defaults to `false`. |

### decompressV1

Decompresses a leaf node from the tree into a regular SPL/Token

Metadata NFT.

Consumes the `voucher` PDA created by `redeem`, then mints a new SPL

token, and creates the associated Token Metadata metadata and master

edition accounts so the asset can be held and traded like any other

NFT.

**Accounts:**

| Account                  | Type             | Description                                                                                                                |
| ------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `voucher`                | writable         | Voucher PDA created by `redeem`; closed by this instruction once its leaf data has been used to mint the decompressed NFT. |
| `leafOwner`              | signer, writable | Owner of the compressed NFT leaf being operated on.                                                                        |
| `tokenAccount`           | writable         | Token account that will hold the decompressed NFT for `leafOwner`.                                                         |
| `mint`                   | writable         | Mint account of the decompressed NFT, created fresh during decompression.                                                  |
| `mintAuthority`          | writable         | PDA mint authority for the decompressed NFT's mint.                                                                        |
| `metadata`               | writable         | Metadata account created for the decompressed NFT.                                                                         |
| `masterEdition`          | writable         | Master edition account created for the decompressed NFT.                                                                   |
| `systemProgram`          | readonly         | The Solana System program.                                                                                                 |
| `sysvarRent`             | readonly         | The Rent sysvar.                                                                                                           |
| `tokenMetadataProgram`   | readonly         | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                  |
| `tokenProgram`           | readonly         | The SPL Token program.                                                                                                     |
| `associatedTokenProgram` | readonly         | The SPL Associated Token Account program.                                                                                  |
| `logWrapper`             | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                            |

**Arguments:**

| Argument        | Type                            | Description                                                                                                                                   |
| --------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                                             |
| `metadata`      | [metadataArgs](#metadataArgs-3) | Metadata args of the leaf being decompressed; must match the leaf's stored `dataHash` and is used to populate the new Token Metadata account. |

### delegate

Sets (or clears) the delegate authority for a compressed NFT leaf.

The delegate may transfer or burn the leaf on the owner's behalf.

Pass the leaf owner as `newLeafDelegate` to clear an existing delegate.

**Accounts:**

| Account                | Type     | Description                                                                                                                         |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`        | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`            | signer   | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `previousLeafDelegate` | readonly | The leaf's delegate before this instruction runs.                                                                                   |
| `newLeafDelegate`      | readonly | Delegate to set on the leaf; pass the leaf owner to clear an existing delegate.                                                     |
| `merkleTree`           | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`           | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram`   | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`        | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### delegateAndFreezeV2

Delegates and freezes a `LeafSchema` V2 leaf node in a single

instruction, preventing it from being transferred or burned while

frozen.

**Accounts:**

| Account                | Type             | Description                                                                                                                         |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`        | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`                | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `leafOwner`            | signer, optional | Optional leaf owner, defaults to `payer`.                                                                                           |
| `previousLeafDelegate` | optional         | Defaults to `leafOwner`.                                                                                                            |
| `newLeafDelegate`      | readonly         | Delegate to set on the leaf; pass the leaf owner to clear an existing delegate.                                                     |
| `merkleTree`           | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`           | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram`   | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`        | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument         | Type      | Description                                                                                                                                                            |
| ---------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`  | `unknown` | -                                                                                                                                                                      |
| `root`           | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`       | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`    | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `collectionHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `collectionHash` of the `LeafSchema` V2 leaf, if any, verified before this instruction updates the leaf.                 |
| `assetDataHash`  | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`          | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`          | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`          | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### delegateV2

Sets (or clears) the delegate authority for a `LeafSchema` V2 leaf

node.

**Accounts:**

| Account                | Type             | Description                                                                                                                         |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`        | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`                | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `leafOwner`            | signer, optional | Optional leaf owner, defaults to `payer`.                                                                                           |
| `previousLeafDelegate` | optional         | Defaults to `leafOwner`.                                                                                                            |
| `newLeafDelegate`      | readonly         | Delegate to set on the leaf; pass the leaf owner to clear an existing delegate.                                                     |
| `merkleTree`           | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`           | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram`   | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`        | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument         | Type      | Description                                                                                                                                                            |
| ---------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`  | `unknown` | -                                                                                                                                                                      |
| `root`           | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`       | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`    | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `collectionHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `collectionHash` of the `LeafSchema` V2 leaf, if any, verified before this instruction updates the leaf.                 |
| `assetDataHash`  | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`          | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`          | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`          | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### freezeV2

Freezes a `LeafSchema` V2 leaf node, preventing it from being

transferred or burned until it is thawed.

Must be signed by the leaf delegate or, when the asset belongs to an

MPL Core collection, a permanent freeze delegate plugin on that

collection.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `authority`          | signer, optional | Optional authority, defaults to `payer`. Must be either the leaf delegate or a permanent freeze delegate plugin on the collection.  |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly         | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `coreCollection`     | optional         | MPL Core collection account the asset belongs to (V2 collections).                                                                  |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `assetDataHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### mintToCollectionV1

Mints a new compressed NFT (V1) leaf and adds it to a verified Token

Metadata collection in the same instruction.

Behaves like `mintV1`, but also CPIs into the Token Metadata program

(via the `bubblegumSigner` PDA) to mark the collection as verified on

the resulting leaf's metadata.

**Accounts:**

| Account                        | Type     | Description                                                                                                                          |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `treeAuthority`                | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.  |
| `leafOwner`                    | readonly | Owner of the compressed NFT leaf being operated on.                                                                                  |
| `leafDelegate`                 | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                 |
| `merkleTree`                   | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                          |
| `payer`                        | signer   | Account that pays for the transaction and any account rent.                                                                          |
| `treeDelegate`                 | signer   | Delegate authority of the tree, authorized to mint into and manage the tree on the creator's behalf.                                 |
| `collectionAuthority`          | signer   | Authority of the collection the asset is being added to or removed from (typically the collection's update authority or a delegate). |
| `collectionAuthorityRecordPda` | readonly | If there is no collection authority record PDA, pass the Bubblegum program address instead.                                          |
| `collectionMint`               | readonly | Mint account of the Token Metadata collection NFT.                                                                                   |
| `collectionMetadata`           | writable | Metadata account of the Token Metadata collection NFT.                                                                               |
| `editionAccount`               | readonly | Master edition account of the Token Metadata collection NFT.                                                                         |
| `bubblegumSigner`              | readonly | PDA Bubblegum uses to sign the CPI into the Token Metadata program that (un)verifies the collection.                                 |
| `logWrapper`                   | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                      |
| `compressionProgram`           | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                       |
| `tokenMetadataProgram`         | readonly | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                            |
| `systemProgram`                | readonly | The Solana System program.                                                                                                           |

**Arguments:**

| Argument        | Type                            | Description                                                                                                         |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                   |
| `metadataArgs`  | [metadataArgs](#metadataArgs-3) | Metadata for the newly minted compressed NFT, which will be added to the collection identified by `collectionMint`. |

### mintV1

Mints a new compressed NFT (V1) leaf and appends it to the tree.

The tree delegate (or, for public trees, any signer) supplies the

leaf's `MetadataArgs`; Bubblegum hashes it, builds the `LeafSchema`,

and appends the resulting leaf to the Merkle tree.

**Accounts:**

| Account              | Type     | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | readonly | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `payer`              | signer   | Account that pays for the transaction and any account rent.                                                                         |
| `treeDelegate`       | signer   | Delegate authority of the tree, authorized to mint into and manage the tree on the creator's behalf.                                |
| `logWrapper`         | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type                            | Description                                   |
| --------------- | ------------------------------- | --------------------------------------------- |
| `discriminator` | `unknown`                       | -                                             |
| `message`       | [metadataArgs](#metadataArgs-3) | Metadata for the newly minted compressed NFT. |

### mintV2

Mints a new asset using `LeafSchema` V2 and optionally adds it to an

MPL Core collection. Requires a tree created with `createTreeV2`.

`LeafSchema` V2 enables new functionality over V1 minting:

1. Uses MPL Core collections instead of Token Metadata collections.

2. Uses the streamlined `MetadataArgsV2` arguments, which eliminate

   the collection verified flag: any collection included is

   automatically considered verified.

3. Allows plugins such as Royalties or Permanent Burn Delegate on the

   MPL Core collection to authorize operations on the Bubblegum

   asset. The `BubblegumV2` plugin must also be present on the MPL

   Core collection for it to be usable with Bubblegum.

4. Allows freezing/thawing of the asset, as well as marking it

   permanently non-transferable (soulbound).

5. Reserves (but does not yet use) an optional data blob and schema

   that can be associated with the asset.

**Accounts:**

| Account               | Type               | Description                                                                                                                         |
| --------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`       | writable           | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`               | signer, writable   | Account that pays for the transaction and any account rent.                                                                         |
| `treeDelegate`        | signer, optional   | Optional tree delegate, defaults to `payer`.                                                                                        |
| `collectionAuthority` | signer, optional   | Optional collection authority, defaults to `treeDelegate`.                                                                          |
| `leafOwner`           | readonly           | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`        | optional           | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`          | writable           | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `coreCollection`      | writable, optional | MPL Core collection account the asset belongs to (V2 collections).                                                                  |
| `mplCoreCpiSigner`    | optional           | PDA Bubblegum uses to sign CPIs into the MPL Core program on behalf of a core collection.                                           |
| `logWrapper`          | readonly           | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram`  | readonly           | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `mplCoreProgram`      | readonly           | The MPL Core program, invoked for V2 collection CPIs.                                                                               |
| `systemProgram`       | readonly           | The Solana System program.                                                                                                          |

**Arguments:**

| Argument          | Type                                  | Description                                          |
| ----------------- | ------------------------------------- | ---------------------------------------------------- |
| `discriminator`   | `unknown`                             | -                                                    |
| `metadataArgs`    | [metadataArgsV2](#metadataArgsV2-3)   | Metadata for the newly minted `LeafSchema` V2 asset. |
| `assetData`       | `unknown`                             | null                                                 | Optional raw asset data blob to associate with the newly minted asset. Reserved for future use. |
| `assetDataSchema` | [assetDataSchema](#assetDataSchema-3) | null                                                 | Schema describing the format of `assetData`. Reserved for future use.                           |

### redeem

Redeems (vouches for) a leaf, removing it from the tree and recording

its data in a new `voucher` PDA.

This is the first step of decompression: once redeemed, the leaf slot

in the tree is emptied and the leaf's data is preserved in `voucher`

until `decompressV1` consumes it, or `cancelRedeem` restores it.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | readonly         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | signer, writable | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly         | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `voucher`            | writable         | Voucher PDA created by this instruction to record the redeemed leaf's data until it is decompressed or the redeem is cancelled.     |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### setAndVerifyCollection

Sets a collection on a leaf's metadata and verifies it in one

instruction.

Equivalent to updating the leaf's `collection` field to `collection`

and then verifying it, without a separate `verifyCollection` call.

**Accounts:**

| Account                        | Type     | Description                                                                                                                           |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`                | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.   |
| `leafOwner`                    | readonly | Owner of the compressed NFT leaf being operated on.                                                                                   |
| `leafDelegate`                 | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                  |
| `merkleTree`                   | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                           |
| `payer`                        | signer   | Account that pays for the transaction and any account rent.                                                                           |
| `treeDelegate`                 | readonly | Checked as a signer here because `setAndVerifyCollection` actually changes the leaf's metadata, unlike plain collection verification. |
| `collectionAuthority`          | signer   | Authority of the collection the asset is being added to or removed from (typically the collection's update authority or a delegate).  |
| `collectionAuthorityRecordPda` | readonly | If there is no collection authority record PDA, pass the Bubblegum program address instead.                                           |
| `collectionMint`               | readonly | Mint account of the Token Metadata collection NFT.                                                                                    |
| `collectionMetadata`           | writable | Metadata account of the Token Metadata collection NFT.                                                                                |
| `editionAccount`               | readonly | Master edition account of the Token Metadata collection NFT.                                                                          |
| `bubblegumSigner`              | readonly | PDA Bubblegum uses to sign the CPI into the Token Metadata program that (un)verifies the collection.                                  |
| `logWrapper`                   | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                       |
| `compressionProgram`           | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                        |
| `tokenMetadataProgram`         | readonly | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                             |
| `systemProgram`                | readonly | The Solana System program.                                                                                                            |

**Arguments:**

| Argument        | Type                            | Description                                                                                                                                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                                                                      |
| `root`          | `u8`[32]                        | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]                        | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]                        | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`                           | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                           | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgs](#metadataArgs-3) | The leaf's current metadata args, verified against `dataHash` before `collection` is set and marked verified.                                                          |
| `collection`    | `PublicKey`                     | Collection mint to set on the leaf's metadata and mark verified in the same instruction.                                                                               |

### setCollectionV2

Sets the collection on a `LeafSchema` V2 leaf node.

Unlike the V1 flow, no separate verification step is required: any

collection recorded on a V2 leaf is automatically considered

verified.

**Accounts:**

| Account                  | Type               | Description                                                                                                                                                                                           |
| ------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`          | writable           | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.                                                                   |
| `payer`                  | signer, writable   | Account that pays for the transaction and any account rent.                                                                                                                                           |
| `authority`              | signer, optional   | If the item is not currently in a collection, must be the tree owner/delegate. If the item is being removed from a collection, must be an authority for the existing collection. Defaults to `payer`. |
| `newCollectionAuthority` | signer, optional   | If the item is being added to a new collection, must be the authority for the new collection. Defaults to `authority`.                                                                                |
| `leafOwner`              | readonly           | Owner of the compressed NFT leaf being operated on.                                                                                                                                                   |
| `leafDelegate`           | optional           | Defaults to `leafOwner`.                                                                                                                                                                              |
| `merkleTree`             | writable           | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                                                                                           |
| `coreCollection`         | writable, optional | MPL Core collection account the asset belongs to (V2 collections).                                                                                                                                    |
| `newCoreCollection`      | writable, optional | MPL Core collection account the asset is being moved into.                                                                                                                                            |
| `mplCoreCpiSigner`       | readonly           | PDA Bubblegum uses to sign CPIs into the MPL Core program on behalf of a core collection.                                                                                                             |
| `logWrapper`             | readonly           | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                                                                                       |
| `compressionProgram`     | readonly           | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                                                                                        |
| `mplCoreProgram`         | readonly           | The MPL Core program, invoked for V2 collection CPIs.                                                                                                                                                 |
| `systemProgram`          | readonly           | The Solana System program.                                                                                                                                                                            |

**Arguments:**

| Argument        | Type                                | Description                                                                                                                                                            |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                           | -                                                                                                                                                                      |
| `root`          | `u8`[32]                            | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `assetDataHash` | `u8`[32]                            | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`                                | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`                               | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                               | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgsV2](#metadataArgsV2-3) | The leaf's current `MetadataArgsV2`, verified against `dataHash` before its collection is set.                                                                         |

### setDecompressableState

Sets the `decompressible_state` of a tree.

Deprecated alias for `setDecompressibleState`, kept for backwards

compatibility; prefer `setDecompressibleState` in new code.

**Accounts:**

| Account         | Type     | Description                                                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority` | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `treeCreator`   | signer   | Creator of the tree, recorded in `TreeConfig` when the tree was created.                                                            |

**Arguments:**

| Argument              | Type                                          | Description                                                                                                        |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `discriminator`       | `unknown`                                     | -                                                                                                                  |
| `decompressableState` | [decompressibleState](#decompressibleState-3) | The new decompressible state to set on the tree: `Enabled` allows `redeem`/`decompressV1`, `Disabled` blocks them. |

### setDecompressibleState

Sets the `decompressible_state` of a tree.

Controls whether leaves in the tree may be `redeem`ed and

`decompressV1`'d into regular NFTs. Only the tree creator may call

this instruction.

**Accounts:**

| Account         | Type     | Description                                                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority` | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `treeCreator`   | signer   | Creator of the tree, recorded in `TreeConfig` when the tree was created.                                                            |

**Arguments:**

| Argument              | Type                                          | Description                                                                                                        |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `discriminator`       | `unknown`                                     | -                                                                                                                  |
| `decompressableState` | [decompressibleState](#decompressibleState-3) | The new decompressible state to set on the tree: `Enabled` allows `redeem`/`decompressV1`, `Disabled` blocks them. |

### setNonTransferableV2

Permanently sets the non-transferable flag on a `LeafSchema` V2 leaf

node, making it soulbound.

Unlike freezing, a non-transferable asset can still be burned by its

owner; it just can no longer change owners. This flag cannot be

unset once applied.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `authority`          | signer, optional | Must be a permanent freeze delegate on the collection. Defaults to `payer`.                                                         |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | optional         | Defaults to `leafOwner`.                                                                                                            |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `coreCollection`     | readonly         | MPL Core collection account the asset belongs to (V2 collections).                                                                  |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `assetDataHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### setTreeDelegate

Sets a new delegate authority for a tree.

Only the current tree creator may reassign the tree delegate, which

is authorized to mint into the tree and manage it on the creator's

behalf.

**Accounts:**

| Account           | Type     | Description                                                                                                                         |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`   | writable | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `treeCreator`     | signer   | Creator of the tree, recorded in `TreeConfig` when the tree was created.                                                            |
| `newTreeDelegate` | readonly | New delegate authority to set for the tree.                                                                                         |
| `merkleTree`      | readonly | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `systemProgram`   | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### thawAndRevokeV2

Thaws a previously frozen `LeafSchema` V2 leaf node and revokes its

delegate (resetting the delegate back to the leaf owner) in a single

instruction.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `leafDelegate`       | signer, optional | Optional leaf delegate, defaults to `payer`.                                                                                        |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument         | Type      | Description                                                                                                                                                            |
| ---------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`  | `unknown` | -                                                                                                                                                                      |
| `root`           | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`       | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`    | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `collectionHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `collectionHash` of the `LeafSchema` V2 leaf, if any, verified before this instruction updates the leaf.                 |
| `assetDataHash`  | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`          | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`          | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`          | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### thawV2

Thaws a previously frozen `LeafSchema` V2 leaf node, restoring its

ability to be transferred or burned.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `authority`          | signer, optional | Optional authority, defaults to `payer`. Must be either the leaf delegate or a permanent freeze delegate plugin on the collection.  |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly         | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `coreCollection`     | optional         | MPL Core collection account the asset belongs to (V2 collections).                                                                  |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `assetDataHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### transfer

Transfers a compressed NFT leaf from one owner to another.

Must be signed by the current leaf owner or delegate. Clears any

existing delegate on the leaf as part of the transfer.

**Accounts:**

| Account              | Type     | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | readonly | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `newLeafOwner`       | readonly | New owner the leaf is being transferred to.                                                                                         |
| `merkleTree`         | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`         | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### transferV2

Transfers a `LeafSchema` V2 leaf node from one owner to another.

Must be signed by the leaf owner or, when the asset belongs to an MPL

Core collection, a permanent transfer delegate plugin on that

collection. Frozen or non-transferable leaves cannot be transferred.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `authority`          | signer, optional | Optional authority, defaults to `payer`. Must be either the leaf owner or a permanent transfer delegate plugin on the collection.   |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | optional         | Defaults to `leafOwner`.                                                                                                            |
| `newLeafOwner`       | readonly         | New owner the leaf is being transferred to.                                                                                         |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `coreCollection`     | optional         | MPL Core collection account the asset belongs to (V2 collections).                                                                  |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type      | Description                                                                                                                                                            |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown` | -                                                                                                                                                                      |
| `root`          | `u8`[32]  | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]  | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]  | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `assetDataHash` | `u8`[32]  | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`      | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`     | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`     | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |

### unverifyCollection

Unverifies a previously verified collection from a leaf node.

Marks the `collection` field of the leaf's metadata as unverified,

without removing the collection reference itself.

**Accounts:**

| Account                        | Type     | Description                                                                                                                                    |
| ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`                | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.            |
| `leafOwner`                    | readonly | Owner of the compressed NFT leaf being operated on.                                                                                            |
| `leafDelegate`                 | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                           |
| `merkleTree`                   | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                                    |
| `payer`                        | signer   | Account that pays for the transaction and any account rent.                                                                                    |
| `treeDelegate`                 | readonly | Checked as a signer here because this instruction path shares logic with `setAndVerifyCollection`, which actually changes the leaf's metadata. |
| `collectionAuthority`          | signer   | Authority of the collection the asset is being added to or removed from (typically the collection's update authority or a delegate).           |
| `collectionAuthorityRecordPda` | readonly | If there is no collection authority record PDA, pass the Bubblegum program address instead.                                                    |
| `collectionMint`               | readonly | Mint account of the Token Metadata collection NFT.                                                                                             |
| `collectionMetadata`           | writable | Metadata account of the Token Metadata collection NFT.                                                                                         |
| `editionAccount`               | readonly | Master edition account of the Token Metadata collection NFT.                                                                                   |
| `bubblegumSigner`              | readonly | PDA Bubblegum uses to sign the CPI into the Token Metadata program that (un)verifies the collection.                                           |
| `logWrapper`                   | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                                |
| `compressionProgram`           | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                                 |
| `tokenMetadataProgram`         | readonly | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                                      |
| `systemProgram`                | readonly | The Solana System program.                                                                                                                     |

**Arguments:**

| Argument        | Type                            | Description                                                                                                                                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                                                                      |
| `root`          | `u8`[32]                        | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]                        | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]                        | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`                           | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                           | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgs](#metadataArgs-3) | The leaf's current metadata args, verified against `dataHash` before its collection is marked unverified.                                                              |

### unverifyCreator

Unverifies a creator from a leaf node.

The named `creator` must sign to remove their own verified flag from

the leaf's creators array.

**Accounts:**

| Account              | Type     | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | readonly | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `payer`              | signer   | Account that pays for the transaction and any account rent.                                                                         |
| `creator`            | signer   | One of the leaf's creators, whose verified flag is being changed by this instruction. Must sign to (un)verify itself.               |
| `logWrapper`         | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type                            | Description                                                                                                                                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                                                                      |
| `root`          | `u8`[32]                        | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]                        | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]                        | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`                           | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                           | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgs](#metadataArgs-3) | The leaf's current metadata args, verified against `dataHash` before `creator` is marked unverified.                                                                   |

### unverifyCreatorV2

Unverifies a creator from a `LeafSchema` V2 leaf node.

The named `creator` must sign to remove their own verified flag from

the leaf's `MetadataArgsV2` creators array.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `creator`            | signer, optional | Optional creator, defaults to `payer`.                                                                                              |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | optional         | Defaults to `leafOwner`.                                                                                                            |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type                                | Description                                                                                                                                                            |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                           | -                                                                                                                                                                      |
| `root`          | `u8`[32]                            | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `assetDataHash` | `u8`[32]                            | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`                                | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`                               | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                               | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgsV2](#metadataArgsV2-3) | The leaf's current `MetadataArgsV2`, used to reconstruct and verify the leaf before `creator` is marked unverified.                                                    |

### updateAssetDataV2

Updates the off-chain asset data hash and status flags of a

`LeafSchema` V2 leaf node.

Callable by the collection authority, or the tree owner/delegate for

assets not in a verified collection.

**Accounts:**

| Account              | Type             | Description                                                                                                                                  |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.          |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                                  |
| `authority`          | signer, optional | Either the collection authority or the tree owner/delegate, depending on whether the asset is in a verified collection. Defaults to `payer`. |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                          |
| `leafDelegate`       | optional         | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                         |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                                  |
| `coreCollection`     | optional         | MPL Core collection account the asset belongs to (V2 collections).                                                                           |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                              |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                               |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                                   |

**Arguments:**

| Argument                | Type                                  | Description                                                                                                                                                            |
| ----------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`         | `unknown`                             | -                                                                                                                                                                      |
| `root`                  | `u8`[32]                              | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`              | `u8`[32]                              | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`           | `u8`[32]                              | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `previousAssetDataHash` | `u8`[32]                              | null                                                                                                                                                                   | Expected current `assetDataHash` of the leaf, if any, verified before it is replaced by `newAssetData`.                                   |
| `flags`                 | `u8`                                  | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`                 | `u64`                                 | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`                 | `u32`                                 | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `newAssetData`          | `unknown`                             | null                                                                                                                                                                   | Optional raw asset data blob to associate with the asset.                                                                                 |
| `newAssetDataSchema`    | [assetDataSchema](#assetDataSchema-3) | null                                                                                                                                                                   | Schema describing the format of `newAssetData`.                                                                                           |

### updateMetadata

Updates the on-chain metadata fields of a compressed NFT leaf.

The caller supplies `currentMetadata` (verified against the leaf's

stored `dataHash`) and `updateArgs` describing which fields to

change; unset fields in `updateArgs` are left as-is.

**Accounts:**

| Account                        | Type     | Description                                                                                                                                                           |
| ------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`                | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.                                   |
| `authority`                    | signer   | Either the collection authority or the tree owner/delegate, depending on whether the asset is in a verified collection.                                               |
| `collectionMint`               | optional | Used when the asset is in a verified collection.                                                                                                                      |
| `collectionMetadata`           | optional | Used when the asset is in a verified collection.                                                                                                                      |
| `collectionAuthorityRecordPda` | optional | Delegated collection authority record PDA. Pass the Bubblegum program id if `collectionAuthority` is the collection's direct update authority rather than a delegate. |
| `leafOwner`                    | readonly | Owner of the compressed NFT leaf being operated on.                                                                                                                   |
| `leafDelegate`                 | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                                                  |
| `payer`                        | signer   | Account that pays for the transaction and any account rent.                                                                                                           |
| `merkleTree`                   | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                                                           |
| `logWrapper`                   | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                                                       |
| `compressionProgram`           | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                                                        |
| `tokenMetadataProgram`         | readonly | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                                                             |
| `systemProgram`                | readonly | The Solana System program.                                                                                                                                            |

**Arguments:**

| Argument          | Type                            | Description                                                                                                                                                            |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`   | `unknown`                       | -                                                                                                                                                                      |
| `root`            | `u8`[32]                        | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `nonce`           | `u64`                           | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`           | `u32`                           | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `currentMetadata` | [metadataArgs](#metadataArgs-3) | The leaf's current metadata args, verified against `dataHash` before `updateArgs` is applied.                                                                          |
| `updateArgs`      | [updateArgs](#updateArgs-3)     | The metadata fields to change; fields left unset keep their current value on the leaf.                                                                                 |

### updateMetadataV2

Updates the on-chain metadata fields of a `LeafSchema` V2 leaf node.

Like `updateMetadata`, but for V2 leaves: `currentMetadata` is

verified against the leaf before `updateArgs` is applied.

**Accounts:**

| Account              | Type             | Description                                                                                                                                  |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.          |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                                  |
| `authority`          | signer, optional | Either the collection authority or the tree owner/delegate, depending on whether the asset is in a verified collection. Defaults to `payer`. |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                          |
| `leafDelegate`       | optional         | Defaults to `leafOwner`.                                                                                                                     |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                                  |
| `coreCollection`     | optional         | MPL Core collection account the asset belongs to (V2 collections).                                                                           |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                              |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                               |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                                   |

**Arguments:**

| Argument          | Type                                | Description                                                                                                                                                            |
| ----------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator`   | `unknown`                           | -                                                                                                                                                                      |
| `root`            | `u8`[32]                            | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `assetDataHash`   | `u8`[32]                            | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`           | `u8`                                | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`           | `u64`                               | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`           | `u32`                               | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `currentMetadata` | [metadataArgsV2](#metadataArgsV2-3) | The leaf's current `MetadataArgsV2`, verified against `dataHash` before `updateArgs` is applied.                                                                       |
| `updateArgs`      | [updateArgs](#updateArgs-3)         | The metadata fields to change; fields left unset keep their current value on the leaf.                                                                                 |

### verifyCollection

Verifies a collection for a leaf node.

Marks the `collection` field already set on the leaf's metadata as

verified; the collection's update authority (or delegate) must sign.

**Accounts:**

| Account                        | Type     | Description                                                                                                                                    |
| ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`                | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program.            |
| `leafOwner`                    | readonly | Owner of the compressed NFT leaf being operated on.                                                                                            |
| `leafDelegate`                 | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                           |
| `merkleTree`                   | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                                    |
| `payer`                        | signer   | Account that pays for the transaction and any account rent.                                                                                    |
| `treeDelegate`                 | readonly | Checked as a signer here because this instruction path shares logic with `setAndVerifyCollection`, which actually changes the leaf's metadata. |
| `collectionAuthority`          | signer   | Authority of the collection the asset is being added to or removed from (typically the collection's update authority or a delegate).           |
| `collectionAuthorityRecordPda` | readonly | If there is no collection authority record PDA, pass the Bubblegum program address instead.                                                    |
| `collectionMint`               | readonly | Mint account of the Token Metadata collection NFT.                                                                                             |
| `collectionMetadata`           | writable | Metadata account of the Token Metadata collection NFT.                                                                                         |
| `editionAccount`               | readonly | Master edition account of the Token Metadata collection NFT.                                                                                   |
| `bubblegumSigner`              | readonly | PDA Bubblegum uses to sign the CPI into the Token Metadata program that (un)verifies the collection.                                           |
| `logWrapper`                   | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                                |
| `compressionProgram`           | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                                 |
| `tokenMetadataProgram`         | readonly | The Token Metadata program, invoked to read or (un)verify the legacy collection accounts.                                                      |
| `systemProgram`                | readonly | The Solana System program.                                                                                                                     |

**Arguments:**

| Argument        | Type                            | Description                                                                                                                                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                                                                      |
| `root`          | `u8`[32]                        | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]                        | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]                        | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`                           | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                           | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgs](#metadataArgs-3) | The leaf's current metadata args, verified against `dataHash` before its already-set collection is marked verified.                                                    |

### verifyCreator

Verifies a creator for a leaf node.

The named `creator` must sign to mark their own entry in the leaf's

creators array as verified.

**Accounts:**

| Account              | Type     | Description                                                                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | readonly | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `leafOwner`          | readonly | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | readonly | Delegate authority for the leaf; defaults to the leaf owner when no delegate is set.                                                |
| `merkleTree`         | writable | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `payer`              | signer   | Account that pays for the transaction and any account rent.                                                                         |
| `creator`            | signer   | One of the leaf's creators, whose verified flag is being changed by this instruction. Must sign to (un)verify itself.               |
| `logWrapper`         | readonly | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type                            | Description                                                                                                                                                            |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                       | -                                                                                                                                                                      |
| `root`          | `u8`[32]                        | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `dataHash`      | `u8`[32]                        | Keccak256 hash of the leaf's metadata, used together with `root` to verify the leaf before it is modified.                                                             |
| `creatorHash`   | `u8`[32]                        | Keccak256 hash of the leaf's creators array, used together with `root` to verify the leaf before it is modified.                                                       |
| `nonce`         | `u64`                           | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                           | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgs](#metadataArgs-3) | The leaf's current metadata args, verified against `dataHash` before `creator` is marked verified.                                                                     |

### verifyCreatorV2

Verifies a creator for a `LeafSchema` V2 leaf node.

The named `creator` must sign to mark their own entry in the leaf's

`MetadataArgsV2` creators array as verified.

**Accounts:**

| Account              | Type             | Description                                                                                                                         |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `treeAuthority`      | writable         | The tree's `TreeConfig` PDA, which stores its configuration and acts as the tree's authority for CPIs into the compression program. |
| `payer`              | signer, writable | Account that pays for the transaction and any account rent.                                                                         |
| `creator`            | signer, optional | Optional creator, defaults to `payer`.                                                                                              |
| `leafOwner`          | readonly         | Owner of the compressed NFT leaf being operated on.                                                                                 |
| `leafDelegate`       | optional         | Defaults to `leafOwner`.                                                                                                            |
| `merkleTree`         | writable         | The concurrent Merkle tree account storing the compressed leaves, owned by the account compression program.                         |
| `logWrapper`         | readonly         | The SPL/MPL Noop program, used to log leaf data so off-chain indexers can reconstruct the tree.                                     |
| `compressionProgram` | readonly         | The SPL/MPL Account Compression program that owns and manages the Merkle tree.                                                      |
| `systemProgram`      | readonly         | The Solana System program.                                                                                                          |

**Arguments:**

| Argument        | Type                                | Description                                                                                                                                                            |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `discriminator` | `unknown`                           | -                                                                                                                                                                      |
| `root`          | `u8`[32]                            | Current Merkle root of the tree, used together with the Merkle proof (passed as remaining accounts) to verify the leaf being operated on.                              |
| `assetDataHash` | `u8`[32]                            | null                                                                                                                                                                   | Expected current `assetDataHash` of the `LeafSchema` V2 leaf, if any, carried through unchanged by this instruction.                      |
| `flags`         | `u8`                                | null                                                                                                                                                                   | Expected current status flags (e.g. frozen, non-transferable) of the `LeafSchema` V2 leaf, verified before this instruction updates them. |
| `nonce`         | `u64`                               | Tree-scoped nonce identifying the leaf, equal to the tree's `numMinted` at the time the leaf was minted. Combined with the tree address to derive the leaf's asset id. |
| `index`         | `u32`                               | Position of the leaf within the Merkle tree, used with the Merkle proof to locate and verify the leaf.                                                                 |
| `message`       | [metadataArgsV2](#metadataArgsV2-3) | The leaf's current `MetadataArgsV2`, used to reconstruct and verify the leaf before `creator` is marked verified.                                                      |

## PDAs

### treeConfig

Tree authority / config PDA that manages a concurrent merkle tree

**Seeds:**

| Seed         | Type        | Description                            |
| ------------ | ----------- | -------------------------------------- |
| `merkleTree` | `PublicKey` | The address of the merkle tree account |

### voucher

Redemption voucher PDA created when a leaf is redeemed

**Seeds:**

| Seed         | Type             | Description                                 |
| ------------ | ---------------- | ------------------------------------------- |
| `constant`   | bytes (constant) | -                                           |
| `merkleTree` | `PublicKey`      | The address of the merkle tree account      |
| `nonce`      | `u64`            | The nonce (leaf index) of the redeemed leaf |

### assetId

Deterministic asset id for a compressed NFT leaf

**Seeds:**

| Seed         | Type             | Description                            |
| ------------ | ---------------- | -------------------------------------- |
| `constant`   | bytes (constant) | -                                      |
| `merkleTree` | `PublicKey`      | The address of the merkle tree account |
| `nonce`      | `u64`            | The nonce (leaf index) of the leaf     |

### bubblegumSigner

PDA used by Bubblegum to sign Token Metadata collection CPIs

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |

### mintAuthority

Mint authority PDA for a decompressed NFT mint

**Seeds:**

| Seed   | Type        | Description                                  |
| ------ | ----------- | -------------------------------------------- |
| `mint` | `PublicKey` | The address of the decompressed mint account |

## Types

### creator

A single creator entry in a compressed NFT's metadata.

**Definition:**

```typescript
{
  address: PublicKey;
  verified: boolean;
  share: bigint;
}
```

### uses

Consumable-use configuration for an asset (e.g. tickets or

redeemable passes), tracking how it may be used and how many uses

remain.

**Definition:**

```typescript
{
  useMethod: useMethod;
  remaining: bigint;
  total: bigint;
}
```

### collection

A collection reference on a V1 leaf's metadata, with its own

verified flag independent of the collection's on-chain verification

state.

**Definition:**

```typescript
{
  verified: boolean;
  key: PublicKey;
}
```

### metadataArgs

Metadata for a V1 (`LeafSchema` V1) compressed NFT leaf.

Mirrors the fields of a Token Metadata `Metadata` account closely

enough that a leaf can be decompressed into one. Hashed (along with

`creators`) to produce the `dataHash`/`creatorHash` used to verify

the leaf on every mutating instruction.

**Definition:**

```typescript
{
  name: unknown;
  symbol: unknown;
  uri: unknown;
  sellerFeeBasisPoints: bigint;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: bigint | null;
  tokenStandard: tokenStandard | null;
  collection: collection | null;
  uses: uses | null;
  tokenProgramVersion: tokenProgramVersion;
  creators: creator[];
}
```

### metadataArgsV2

Metadata for a `LeafSchema` V2 compressed NFT leaf.

Streamlined relative to `MetadataArgs`: it drops `editionNonce` and

`uses`, and its `collection` is a plain, always-verified `Pubkey`

rather than a `Collection` struct with a separate verified flag.

**Definition:**

```typescript
{
  name: unknown;
  symbol: unknown;
  uri: unknown;
  sellerFeeBasisPoints: bigint;
  primarySaleHappened: boolean;
  isMutable: boolean;
  tokenStandard: tokenStandard | null;
  creators: creator[];
  collection: PublicKey | null;
}
```

### updateArgs

Metadata fields to change on a leaf via `updateMetadata` /

`updateMetadataV2`. Every field is optional; omitted fields keep

their current value.

**Definition:**

```typescript
{
  name: unknown | null;
  symbol: unknown | null;
  uri: unknown | null;
  creators: creator[] | null;
  sellerFeeBasisPoints: bigint | null;
  primarySaleHappened: boolean | null;
  isMutable: boolean | null;
}
```

### version

Schema version of a tree's leaves: `V1` (Token Metadata

collections) or `V2` (MPL Core collections, freezing, and

non-transferable assets).

**Definition:**

```typescript
| { kind: "v1" }
  | { kind: "v2" }
```

### leafSchema

The canonical on-chain representation of a compressed NFT leaf,

hashed to produce the value stored at a tree's leaf node.

`V1` is produced by `mintV1`/`mintToCollectionV1` and the legacy

instruction family; `V2` is produced by `mintV2` and adds

`collectionHash`, `assetDataHash` and `flags` to support MPL Core

collections and freezing/non-transferable assets.

**Definition:**

```typescript
| { kind: "v1"; id: PublicKey; owner: PublicKey; delegate: PublicKey; nonce: bigint; dataHash: bigint[32]; creatorHash: bigint[32] }
  | { kind: "v2"; id: PublicKey; owner: PublicKey; delegate: PublicKey; nonce: bigint; dataHash: bigint[32]; creatorHash: bigint[32]; collectionHash: bigint[32]; assetDataHash: bigint[32]; flags: bigint }
```

### tokenProgramVersion

Which SPL token program a decompressed leaf's mint should use.

**Definition:**

```typescript
| { kind: "original" }
  | { kind: "token2022" }
```

### tokenStandard

Token Metadata token standard recorded on a leaf. Bubblegum

currently only mints `NonFungible` assets; the other variants exist

for compatibility with the wider Token Metadata type.

**Definition:**

```typescript
| { kind: "nonFungible" }
  | { kind: "fungibleAsset" }
  | { kind: "fungible" }
  | { kind: "nonFungibleEdition" }
```

### useMethod

How the remaining uses of an asset are consumed.

**Definition:**

```typescript
| { kind: "burn" }
  | { kind: "multiple" }
  | { kind: "single" }
```

### bubblegumEventType

Discriminator for events Bubblegum logs via the noop program, read

back by off-chain indexers to reconstruct tree state.

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "leafSchemaEvent" }
```

### decompressibleState

Whether leaves in a tree may be redeemed and decompressed into

regular SPL/Token Metadata NFTs. Set per-tree with

`setDecompressibleState`.

**Definition:**

```typescript
| { kind: "enabled" }
  | { kind: "disabled" }
```

### assetDataSchema

Format of the optional off-chain `assetData` blob attached to a

`LeafSchema` V2 asset. Reserved for future use.

**Definition:**

```typescript
| { kind: "binary" }
  | { kind: "json" }
  | { kind: "msgPack" }
```

### instructionName

Discriminator identifying which Bubblegum instruction produced a

logged event, read back by off-chain indexers.

**Definition:**

```typescript
| { kind: "unknown" }
  | { kind: "mintV1" }
  | { kind: "redeem" }
  | { kind: "cancelRedeem" }
  | { kind: "transfer" }
  | { kind: "delegate" }
  | { kind: "decompressV1" }
  | { kind: "compress" }
  | { kind: "burn" }
  | { kind: "createTree" }
  | { kind: "verifyCreator" }
  | { kind: "unverifyCreator" }
  | { kind: "verifyCollection" }
  | { kind: "unverifyCollection" }
  | { kind: "setAndVerifyCollection" }
  | { kind: "mintToCollectionV1" }
  | { kind: "setDecompressibleState" }
  | { kind: "updateMetadata" }
  | { kind: "burnV2" }
  | { kind: "collectV2" }
  | { kind: "createTreeV2" }
  | { kind: "delegateAndFreezeV2" }
  | { kind: "delegateV2" }
  | { kind: "freezeV2" }
  | { kind: "mintV2" }
  | { kind: "setCollectionV2" }
  | { kind: "setNonTransferableV2" }
  | { kind: "thawAndRevokeV2" }
  | { kind: "thawV2" }
  | { kind: "transferV2" }
  | { kind: "unverifyCreatorV2" }
  | { kind: "updateAssetDataV2" }
  | { kind: "updateMetadataV2" }
  | { kind: "verifyCreatorV2" }
  | { kind: "closeTreeV2" }
```

## Errors

- **6000 - AssetOwnerMismatch**: Asset Owner Does not match _(Hex: `0x1770`)_
- **6001 - PublicKeyMismatch**: PublicKeyMismatch _(Hex: `0x1771`)_
- **6002 - HashingMismatch**: Hashing Mismatch Within Leaf Schema _(Hex: `0x1772`)_
- **6003 - UnsupportedSchemaVersion**: Unsupported Schema Version _(Hex: `0x1773`)_
- **6004 - CreatorShareTotalMustBe100**: Creator shares must sum to 100 _(Hex: `0x1774`)_
- **6005 - DuplicateCreatorAddress**: No duplicate creator addresses in metadata _(Hex: `0x1775`)_
- **6006 - CreatorDidNotVerify**: Creator did not verify the metadata _(Hex: `0x1776`)_
- **6007 - CreatorNotFound**: Creator not found in creator Vec _(Hex: `0x1777`)_
- **6008 - NoCreatorsPresent**: No creators in creator Vec _(Hex: `0x1778`)_
- **6009 - CreatorHashMismatch**: User-provided creator Vec must result in same user-provided creator hash _(Hex: `0x1779`)_
- **6010 - DataHashMismatch**: User-provided metadata must result in same user-provided data hash _(Hex: `0x177a`)_
- **6011 - CreatorsTooLong**: Creators list too long _(Hex: `0x177b`)_
- **6012 - MetadataNameTooLong**: Name in metadata is too long _(Hex: `0x177c`)_
- **6013 - MetadataSymbolTooLong**: Symbol in metadata is too long _(Hex: `0x177d`)_
- **6014 - MetadataUriTooLong**: Uri in metadata is too long _(Hex: `0x177e`)_
- **6015 - MetadataBasisPointsTooHigh**: Basis points in metadata cannot exceed 10000 _(Hex: `0x177f`)_
- **6016 - TreeAuthorityIncorrect**: Tree creator or tree delegate must sign. _(Hex: `0x1780`)_
- **6017 - InsufficientMintCapacity**: Not enough unapproved mints left _(Hex: `0x1781`)_
- **6018 - NumericalOverflowError**: NumericalOverflowError _(Hex: `0x1782`)_
- **6019 - IncorrectOwner**: Incorrect account owner _(Hex: `0x1783`)_
- **6020 - CollectionCannotBeVerifiedInThisInstruction**: Cannot Verify Collection in this Instruction _(Hex: `0x1784`)_
- **6021 - CollectionNotFound**: Collection Not Found on Metadata _(Hex: `0x1785`)_
- **6022 - AlreadyVerified**: Collection item is already verified. _(Hex: `0x1786`)_
- **6023 - AlreadyUnverified**: Collection item is already unverified. _(Hex: `0x1787`)_
- **6024 - UpdateAuthorityIncorrect**: Incorrect leaf metadata update authority. _(Hex: `0x1788`)_
- **6025 - LeafAuthorityMustSign**: This transaction must be signed by either the leaf owner or leaf delegate _(Hex: `0x1789`)_
- **6026 - CollectionMustBeSized**: Collection Not Compatable with Compression, Must be Sized _(Hex: `0x178a`)_
- **6027 - MetadataMintMismatch**: Metadata mint does not match collection mint _(Hex: `0x178b`)_
- **6028 - InvalidCollectionAuthority**: Invalid collection authority _(Hex: `0x178c`)_
- **6029 - InvalidDelegateRecord**: Invalid delegate record pda derivation _(Hex: `0x178d`)_
- **6030 - CollectionMasterEditionAccountInvalid**: Edition account doesnt match collection _(Hex: `0x178e`)_
- **6031 - CollectionMustBeAUniqueMasterEdition**: Collection Must Be a Unique Master Edition v2 _(Hex: `0x178f`)_
- **6032 - UnknownExternalError**: Could not convert external error to BubblegumError _(Hex: `0x1790`)_
- **6033 - DecompressionDisabled**: Decompression is disabled for this tree. _(Hex: `0x1791`)_
- **6034 - MissingCollectionMintAccount**: Missing collection mint account _(Hex: `0x1792`)_
- **6035 - MissingCollectionMetadataAccount**: Missing collection metadata account _(Hex: `0x1793`)_
- **6036 - CollectionMismatch**: Collection mismatch _(Hex: `0x1794`)_
- **6037 - MetadataImmutable**: Metadata not mutable _(Hex: `0x1795`)_
- **6038 - PrimarySaleCanOnlyBeFlippedToTrue**: Can only update primary sale to true _(Hex: `0x1796`)_
- **6039 - CreatorDidNotUnverify**: Creator did not unverify the metadata _(Hex: `0x1797`)_
- **6040 - InvalidTokenStandard**: Only NonFungible standard is supported _(Hex: `0x1798`)_
- **6041 - InvalidCanopySize**: Canopy size should be set bigger for this tree _(Hex: `0x1799`)_
- **6042 - InvalidLogWrapper**: Invalid log wrapper program _(Hex: `0x179a`)_
- **6043 - InvalidCompressionProgram**: Invalid compression program _(Hex: `0x179b`)_
- **6044 - LeafMustBeDelegated**: Leaf must be delegated to someone other than the leaf owner _(Hex: `0x179c`)_
- **6045 - AssetIsFrozen**: Asset is frozen _(Hex: `0x179d`)_
- **6046 - AssetIsNonTransferable**: Asset is non-transferable _(Hex: `0x179e`)_
- **6047 - InvalidAuthority**: Invalid authority _(Hex: `0x179f`)_
- **6048 - CollectionIsFrozen**: Collection is frozen _(Hex: `0x17a0`)_
- **6049 - CollectionMustHaveBubblegumPlugin**: Core collections must have the Bubblegum V2 plugin on them _(Hex: `0x17a1`)_
- **6050 - NotAvailable**: Feature not currently available _(Hex: `0x17a2`)_
- **6051 - MissingCollectionAccount**: Missing collection account _(Hex: `0x17a3`)_
- **6052 - AssetDataLengthTooLong**: Asset data length too long _(Hex: `0x17a4`)_
- **6053 - AlreadyInCollection**: Item is already in the collection _(Hex: `0x17a5`)_
- **6054 - AlreadyNotInCollection**: Item is already not in a collection _(Hex: `0x17a6`)_
- **6055 - MissingMplCoreCpiSignerAccount**: Missing mpl-core CPI signer account _(Hex: `0x17a7`)_
- **6056 - AssetIsNotFrozen**: Asset is not frozen _(Hex: `0x17a8`)_
