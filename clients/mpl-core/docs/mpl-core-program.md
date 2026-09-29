# Mpl Core Program Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fmpl-core.svg)](https://www.npmjs.com/package/%40solana-programs%2Fmpl-core)

- Program ID: `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`
- TypeScript Client: [`@solana-programs/mpl-core`](https://www.npmjs.com/package/@solana-programs/mpl-core)

## Table of Contents

- [Accounts](#accounts)
  - [pluginHeaderV1](#pluginHeaderV1)
  - [pluginRegistryV1](#pluginRegistryV1)
  - [assetV1](#assetV1)
  - [collectionV1](#collectionV1)
  - [groupV1](#groupV1)
  - [hashedAssetV1](#hashedAssetV1)
- [Instructions](#instructions)
  - [createV1](#createV1)
  - [createCollectionV1](#createCollectionV1)
  - [addPluginV1](#addPluginV1)
  - [addCollectionPluginV1](#addCollectionPluginV1)
  - [removePluginV1](#removePluginV1)
  - [removeCollectionPluginV1](#removeCollectionPluginV1)
  - [updatePluginV1](#updatePluginV1)
  - [updateCollectionPluginV1](#updateCollectionPluginV1)
  - [approvePluginAuthorityV1](#approvePluginAuthorityV1)
  - [approveCollectionPluginAuthorityV1](#approveCollectionPluginAuthorityV1)
  - [revokePluginAuthorityV1](#revokePluginAuthorityV1)
  - [revokeCollectionPluginAuthorityV1](#revokeCollectionPluginAuthorityV1)
  - [burnV1](#burnV1)
  - [burnCollectionV1](#burnCollectionV1)
  - [transferV1](#transferV1)
  - [updateV1](#updateV1)
  - [updateCollectionV1](#updateCollectionV1)
  - [compressV1](#compressV1)
  - [decompressV1](#decompressV1)
  - [collect](#collect)
  - [createV2](#createV2)
  - [createCollectionV2](#createCollectionV2)
  - [addExternalPluginAdapterV1](#addExternalPluginAdapterV1)
  - [addCollectionExternalPluginAdapterV1](#addCollectionExternalPluginAdapterV1)
  - [removeExternalPluginAdapterV1](#removeExternalPluginAdapterV1)
  - [removeCollectionExternalPluginAdapterV1](#removeCollectionExternalPluginAdapterV1)
  - [updateExternalPluginAdapterV1](#updateExternalPluginAdapterV1)
  - [updateCollectionExternalPluginAdapterV1](#updateCollectionExternalPluginAdapterV1)
  - [writeExternalPluginAdapterDataV1](#writeExternalPluginAdapterDataV1)
  - [writeCollectionExternalPluginAdapterDataV1](#writeCollectionExternalPluginAdapterDataV1)
  - [updateV2](#updateV2)
  - [executeV1](#executeV1)
  - [updateCollectionInfoV1](#updateCollectionInfoV1)
  - [addCollectionsToGroupV1](#addCollectionsToGroupV1)
  - [removeCollectionsFromGroupV1](#removeCollectionsFromGroupV1)
  - [addAssetsToGroupV1](#addAssetsToGroupV1)
  - [removeAssetsFromGroupV1](#removeAssetsFromGroupV1)
  - [addGroupsToGroupV1](#addGroupsToGroupV1)
  - [removeGroupsFromGroupV1](#removeGroupsFromGroupV1)
  - [createGroupV1](#createGroupV1)
  - [closeGroupV1](#closeGroupV1)
  - [updateGroupV1](#updateGroupV1)
- [PDAs](#pdas)
  - [assetSigner](#assetSigner)
- [Types](#types)
  - [pluginAuthorityPair](#pluginAuthorityPair)
  - [agentIdentity](#agentIdentity)
  - [agentIdentityInitInfo](#agentIdentityInitInfo)
  - [agentIdentityUpdateInfo](#agentIdentityUpdateInfo)
  - [appData](#appData)
  - [appDataInitInfo](#appDataInitInfo)
  - [appDataUpdateInfo](#appDataUpdateInfo)
  - [dataSection](#dataSection)
  - [dataSectionInitInfo](#dataSectionInitInfo)
  - [dataSectionUpdateInfo](#dataSectionUpdateInfo)
  - [lifecycleHook](#lifecycleHook)
  - [lifecycleHookInitInfo](#lifecycleHookInitInfo)
  - [lifecycleHookUpdateInfo](#lifecycleHookUpdateInfo)
  - [linkedAppData](#linkedAppData)
  - [linkedAppDataInitInfo](#linkedAppDataInitInfo)
  - [linkedAppDataUpdateInfo](#linkedAppDataUpdateInfo)
  - [linkedLifecycleHook](#linkedLifecycleHook)
  - [linkedLifecycleHookInitInfo](#linkedLifecycleHookInitInfo)
  - [linkedLifecycleHookUpdateInfo](#linkedLifecycleHookUpdateInfo)
  - [oracle](#oracle)
  - [oracleInitInfo](#oracleInitInfo)
  - [oracleUpdateInfo](#oracleUpdateInfo)
  - [addBlocker](#addBlocker)
  - [attribute](#attribute)
  - [attributes](#attributes)
  - [groups](#groups)
  - [immutableMetadata](#immutableMetadata)
  - [masterEdition](#masterEdition)
  - [creator](#creator)
  - [royalties](#royalties)
  - [updateDelegate](#updateDelegate)
  - [verifiedCreatorsSignature](#verifiedCreatorsSignature)
  - [verifiedCreators](#verifiedCreators)
  - [autographSignature](#autographSignature)
  - [autograph](#autograph)
  - [burnDelegate](#burnDelegate)
  - [freezeDelegate](#freezeDelegate)
  - [freezeExecute](#freezeExecute)
  - [transferDelegate](#transferDelegate)
  - [bubblegumV2](#bubblegumV2)
  - [edition](#edition)
  - [permanentBurnDelegate](#permanentBurnDelegate)
  - [permanentFreezeDelegate](#permanentFreezeDelegate)
  - [permanentFreezeExecute](#permanentFreezeExecute)
  - [permanentTransferDelegate](#permanentTransferDelegate)
  - [externalCheckResult](#externalCheckResult)
  - [registryRecord](#registryRecord)
  - [externalRegistryRecord](#externalRegistryRecord)
  - [addAssetsToGroupV1Args](#addAssetsToGroupV1Args)
  - [addCollectionsToGroupV1Args](#addCollectionsToGroupV1Args)
  - [addExternalPluginAdapterV1Args](#addExternalPluginAdapterV1Args)
  - [addCollectionExternalPluginAdapterV1Args](#addCollectionExternalPluginAdapterV1Args)
  - [addGroupsToGroupV1Args](#addGroupsToGroupV1Args)
  - [addPluginV1Args](#addPluginV1Args)
  - [addCollectionPluginV1Args](#addCollectionPluginV1Args)
  - [approvePluginAuthorityV1Args](#approvePluginAuthorityV1Args)
  - [approveCollectionPluginAuthorityV1Args](#approveCollectionPluginAuthorityV1Args)
  - [burnV1Args](#burnV1Args)
  - [burnCollectionV1Args](#burnCollectionV1Args)
  - [closeGroupV1Args](#closeGroupV1Args)
  - [compressV1Args](#compressV1Args)
  - [createV1Args](#createV1Args)
  - [createV2Args](#createV2Args)
  - [createCollectionV1Args](#createCollectionV1Args)
  - [createCollectionV2Args](#createCollectionV2Args)
  - [createGroupV1Args](#createGroupV1Args)
  - [decompressV1Args](#decompressV1Args)
  - [executeV1Args](#executeV1Args)
  - [removeAssetsFromGroupV1Args](#removeAssetsFromGroupV1Args)
  - [removeCollectionsFromGroupV1Args](#removeCollectionsFromGroupV1Args)
  - [removeExternalPluginAdapterV1Args](#removeExternalPluginAdapterV1Args)
  - [removeCollectionExternalPluginAdapterV1Args](#removeCollectionExternalPluginAdapterV1Args)
  - [removeGroupsFromGroupV1Args](#removeGroupsFromGroupV1Args)
  - [removePluginV1Args](#removePluginV1Args)
  - [removeCollectionPluginV1Args](#removeCollectionPluginV1Args)
  - [revokePluginAuthorityV1Args](#revokePluginAuthorityV1Args)
  - [revokeCollectionPluginAuthorityV1Args](#revokeCollectionPluginAuthorityV1Args)
  - [transferV1Args](#transferV1Args)
  - [updateV1Args](#updateV1Args)
  - [updateV2Args](#updateV2Args)
  - [updateCollectionV1Args](#updateCollectionV1Args)
  - [updateCollectionInfoV1Args](#updateCollectionInfoV1Args)
  - [updateExternalPluginAdapterV1Args](#updateExternalPluginAdapterV1Args)
  - [updateCollectionExternalPluginAdapterV1Args](#updateCollectionExternalPluginAdapterV1Args)
  - [updateGroupV1Args](#updateGroupV1Args)
  - [updatePluginV1Args](#updatePluginV1Args)
  - [updateCollectionPluginV1Args](#updateCollectionPluginV1Args)
  - [writeExternalPluginAdapterDataV1Args](#writeExternalPluginAdapterDataV1Args)
  - [writeCollectionExternalPluginAdapterDataV1Args](#writeCollectionExternalPluginAdapterDataV1Args)
  - [compressionProof](#compressionProof)
  - [relationshipEntry](#relationshipEntry)
  - [hashablePluginSchema](#hashablePluginSchema)
  - [hashedAssetSchema](#hashedAssetSchema)
  - [plugin](#plugin)
  - [pluginType](#pluginType)
  - [validationResultsOffset](#validationResultsOffset)
  - [oracleValidation](#oracleValidation)
  - [externalPluginAdapterType](#externalPluginAdapterType)
  - [externalPluginAdapter](#externalPluginAdapter)
  - [hookableLifecycleEvent](#hookableLifecycleEvent)
  - [extraAccount](#extraAccount)
  - [seed](#seed)
  - [externalPluginAdapterSchema](#externalPluginAdapterSchema)
  - [externalPluginAdapterInitInfo](#externalPluginAdapterInitInfo)
  - [externalPluginAdapterUpdateInfo](#externalPluginAdapterUpdateInfo)
  - [externalPluginAdapterKey](#externalPluginAdapterKey)
  - [linkedDataKey](#linkedDataKey)
  - [ruleSet](#ruleSet)
  - [validationResult](#validationResult)
  - [externalValidationResult](#externalValidationResult)
  - [updateType](#updateType)
  - [dataState](#dataState)
  - [authority](#authority)
  - [key](#key)
  - [relationshipKind](#relationshipKind)
  - [relationshipEntry](#relationshipEntry)
  - [updateAuthority](#updateAuthority)
- [Errors](#errors)

## Accounts

### pluginHeaderV1

Marker account data written after an asset/collection's core

fields once it has at least one plugin, pointing to the

`PluginRegistryV1` that follows.

**Fields:**

| Field                  | Type          | Description                                                                                        |
| ---------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `key`                  | [key](#key-3) | Account discriminator; always `Key.PluginHeaderV1`.                                                |
| `pluginRegistryOffset` | `u64`         | The byte offset, within the asset/collection account, at which the `PluginRegistryV1` data begins. |

### pluginRegistryV1

The index of every internal plugin and external plugin adapter

attached to an asset or collection, stored after the

`PluginHeaderV1`.

**Fields:**

| Field              | Type                                                  | Description                                                                                     |
| ------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `key`              | [key](#key-3)                                         | Account discriminator; always `Key.PluginRegistryV1`.                                           |
| `registry`         | [registryRecord](#registryRecord-3)[]                 | The internal plugins attached to the asset/collection, and where each one's data lives.         |
| `externalRegistry` | [externalRegistryRecord](#externalRegistryRecord-3)[] | The external plugin adapters attached to the asset/collection, and where each one's data lives. |

### assetV1

An MPL Core asset: a single account holding an NFT's owner,

update authority, name, URI and sequence number, with its

plugins stored afterward in the same account.

**Fields:**

| Field             | Type                                  | Description                                                       |
| ----------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `key`             | [key](#key-3)                         | Account discriminator; always `Key.AssetV1`.                      |
| `owner`           | `PublicKey`                           | The current owner of the asset.                                   |
| `updateAuthority` | [updateAuthority](#updateAuthority-3) | The authority allowed to update the asset's metadata and plugins. |
| `name`            | `unknown`                             | The asset's display name.                                         |
| `uri`             | `unknown`                             | The URI pointing to the asset's off-chain JSON metadata.          |
| `seq`             | `u64`                                 | null                                                              | Sequence number incremented on certain mutations (e.g. `executeV1`); present once the asset has been touched by such an instruction, used to detect stale off-chain indexes. |

### collectionV1

An MPL Core collection: a single account grouping assets under

a shared update authority, with collection-level plugins

stored afterward in the same account.

**Fields:**

| Field             | Type          | Description                                                            |
| ----------------- | ------------- | ---------------------------------------------------------------------- |
| `key`             | [key](#key-3) | Account discriminator; always `Key.CollectionV1`.                      |
| `updateAuthority` | `PublicKey`   | The authority allowed to update the collection and manage its plugins. |
| `name`            | `unknown`     | The collection's display name.                                         |
| `uri`             | `unknown`     | The URI pointing to the collection's off-chain JSON metadata.          |
| `numMinted`       | `u32`         | The total number of assets ever minted into this collection.           |
| `currentSize`     | `u32`         | The number of assets currently belonging to this collection.           |

### groupV1

An MPL Core group: a single account organizing assets,

collections and other groups under a shared update authority,

independent of the collection hierarchy.

**Fields:**

| Field             | Type          | Description                                                             |
| ----------------- | ------------- | ----------------------------------------------------------------------- |
| `key`             | [key](#key-3) | Account discriminator; always `Key.GroupV1`.                            |
| `updateAuthority` | `PublicKey`   | The authority allowed to update the group and manage its membership.    |
| `name`            | `unknown`     | The group's display name.                                               |
| `uri`             | `unknown`     | The URI pointing to the group's off-chain JSON metadata.                |
| `collections`     | `PublicKey`[] | The addresses of the collections that are direct members of this group. |
| `groups`          | `PublicKey`[] | The addresses of the child groups nested under this group.              |
| `parentGroups`    | `PublicKey`[] | The addresses of the groups that this group is itself a member of.      |
| `assets`          | `PublicKey`[] | The addresses of the assets that are direct members of this group.      |

### hashedAssetV1

The compressed (`LedgerState`) representation of an asset:

just a discriminator and a hash committing to its full data,

restorable via `decompressV1`.

**Fields:**

| Field  | Type          | Description                                                                             |
| ------ | ------------- | --------------------------------------------------------------------------------------- |
| `key`  | [key](#key-3) | Account discriminator; always `Key.HashedAssetV1`.                                      |
| `hash` | `u8`[32]      | The 32-byte hash committing to the asset's full data and plugin state while compressed. |

## Instructions

### createV1

Creates a new Core asset — a single Solana account holding an

NFT's owner, update authority, name, URI and plugins, with no

separate mint, token account or metadata account.

The asset account is a freshly generated keypair (not a PDA). If

`collection` is provided, the asset is minted into that

collection and inherits its collection-level plugins.

**Accounts:**

| Account           | Type               | Description                                                           |
| ----------------- | ------------------ | --------------------------------------------------------------------- |
| `asset`           | signer, writable   | The address of the new asset                                          |
| `collection`      | writable, optional | The collection to which the asset belongs                             |
| `authority`       | signer, optional   | The authority signing for creation                                    |
| `payer`           | signer, writable   | The account paying for the storage fees                               |
| `owner`           | optional           | The owner of the new asset. Defaults to the authority if not present. |
| `updateAuthority` | optional           | The authority on the new asset                                        |
| `systemProgram`   | readonly           | The system program                                                    |
| `logWrapper`      | optional           | The SPL Noop Program                                                  |

**Arguments:**

| Argument        | Type                            | Description                                            |
| --------------- | ------------------------------- | ------------------------------------------------------ |
| `discriminator` | `u8`                            | -                                                      |
| `createV1Args`  | [createV1Args](#createV1Args-3) | The asset's initial data state, name, URI and plugins. |

### createCollectionV1

Creates a new Core collection — a single account that groups

assets under a shared update authority and collection-level

plugins (e.g. shared royalties).

Like assets, collections are keypair-generated accounts rather

than PDAs.

**Accounts:**

| Account           | Type             | Description                             |
| ----------------- | ---------------- | --------------------------------------- |
| `collection`      | signer, writable | The address of the new asset            |
| `updateAuthority` | optional         | The authority of the new asset          |
| `payer`           | signer, writable | The account paying for the storage fees |
| `systemProgram`   | readonly         | The system program                      |

**Arguments:**

| Argument                 | Type                                                | Description                                     |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------- |
| `discriminator`          | `u8`                                                | -                                               |
| `createCollectionV1Args` | [createCollectionV1Args](#createCollectionV1Args-3) | The collection's name, URI and initial plugins. |

### addPluginV1

Adds a new plugin to an asset.

Fails if the asset already has a plugin of the same

`PluginType`, or if the asset (or its collection) has an

`AddBlocker` plugin active and the caller can't bypass it.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument          | Type                                  | Description                                                           |
| ----------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `discriminator`   | `u8`                                  | -                                                                     |
| `addPluginV1Args` | [addPluginV1Args](#addPluginV1Args-3) | The plugin to add, and the authority to assign it if not the default. |

### addCollectionPluginV1

Adds a new plugin to a collection. It applies to every asset in

the collection unless an asset defines its own plugin of the

same type.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                    | Type                                                      | Description                                                           |
| --------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| `discriminator`             | `u8`                                                      | -                                                                     |
| `addCollectionPluginV1Args` | [addCollectionPluginV1Args](#addCollectionPluginV1Args-3) | The plugin to add, and the authority to assign it if not the default. |

### removePluginV1

Removes a plugin from an asset by its `PluginType`, freeing the

space it occupied in the asset's account.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument             | Type                                        | Description                   |
| -------------------- | ------------------------------------------- | ----------------------------- |
| `discriminator`      | `u8`                                        | -                             |
| `removePluginV1Args` | [removePluginV1Args](#removePluginV1Args-3) | The type of plugin to remove. |

### removeCollectionPluginV1

Removes a plugin from a collection by its `PluginType`.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                       | Type                                                            | Description                   |
| ------------------------------ | --------------------------------------------------------------- | ----------------------------- |
| `discriminator`                | `u8`                                                            | -                             |
| `removeCollectionPluginV1Args` | [removeCollectionPluginV1Args](#removeCollectionPluginV1Args-3) | The type of plugin to remove. |

### updatePluginV1

Overwrites the data of an existing plugin on an asset.

The plugin's `PluginType` (and thus its authority) is

unchanged; only its configuration is replaced.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument             | Type                                        | Description                                                          |
| -------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `discriminator`      | `u8`                                        | -                                                                    |
| `updatePluginV1Args` | [updatePluginV1Args](#updatePluginV1Args-3) | The full replacement data for the plugin, identified by its variant. |

### updateCollectionPluginV1

Overwrites the data of an existing plugin on a collection.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                       | Type                                                            | Description                                                          |
| ------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `discriminator`                | `u8`                                                            | -                                                                    |
| `updateCollectionPluginV1Args` | [updateCollectionPluginV1Args](#updateCollectionPluginV1Args-3) | The full replacement data for the plugin, identified by its variant. |

### approvePluginAuthorityV1

Sets (or replaces) the authority allowed to manage a specific

plugin on an asset — e.g. delegating a `FreezeDelegate` or

`TransferDelegate` plugin to a marketplace program.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument                       | Type                                                            | Description                                 |
| ------------------------------ | --------------------------------------------------------------- | ------------------------------------------- |
| `discriminator`                | `u8`                                                            | -                                           |
| `approvePluginAuthorityV1Args` | [approvePluginAuthorityV1Args](#approvePluginAuthorityV1Args-3) | The plugin to update and its new authority. |

### approveCollectionPluginAuthorityV1

Sets (or replaces) the authority allowed to manage a specific

plugin on a collection.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                                 | Type                                                                                | Description                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| `discriminator`                          | `u8`                                                                                | -                                           |
| `approveCollectionPluginAuthorityV1Args` | [approveCollectionPluginAuthorityV1Args](#approveCollectionPluginAuthorityV1Args-3) | The plugin to update and its new authority. |

### revokePluginAuthorityV1

Resets a plugin on an asset back to its default authority,

revoking any delegate previously approved with

`ApprovePluginAuthorityV1`.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument                      | Type                                                          | Description                                           |
| ----------------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `discriminator`               | `u8`                                                          | -                                                     |
| `revokePluginAuthorityV1Args` | [revokePluginAuthorityV1Args](#revokePluginAuthorityV1Args-3) | The type of plugin whose authority should be revoked. |

### revokeCollectionPluginAuthorityV1

Resets a plugin on a collection back to its default authority.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                                | Type                                                                              | Description                                           |
| --------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `discriminator`                         | `u8`                                                                              | -                                                     |
| `revokeCollectionPluginAuthorityV1Args` | [revokeCollectionPluginAuthorityV1Args](#revokeCollectionPluginAuthorityV1Args-3) | The type of plugin whose authority should be revoked. |

### burnV1

Permanently destroys an asset and refunds its rent to `payer`.

Requires the owner, or a delegate approved via the

`BurnDelegate` / `PermanentBurnDelegate` plugin.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | optional           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument        | Type                        | Description                                                                              |
| --------------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| `discriminator` | `u8`                        | -                                                                                        |
| `burnV1Args`    | [burnV1Args](#burnV1Args-3) | A compression proof, required only if the asset is currently compressed (`LedgerState`). |

### burnCollectionV1

Permanently destroys an empty collection and refunds its rent

to `payer`. Fails if any assets still belong to the collection.

**Accounts:**

| Account      | Type                       | Description                             |
| ------------ | -------------------------- | --------------------------------------- |
| `collection` | writable                   | The address of the asset                |
| `payer`      | signer, writable           | The account paying for the storage fees |
| `authority`  | signer, writable, optional | The owner or delegate of the asset      |
| `logWrapper` | optional                   | The SPL Noop Program                    |

**Arguments:**

| Argument               | Type                                            | Description                                                                   |
| ---------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `discriminator`        | `u8`                                            | -                                                                             |
| `burnCollectionV1Args` | [burnCollectionV1Args](#burnCollectionV1Args-3) | A compression proof, required only if the collection is currently compressed. |

### transferV1

Transfers ownership of an asset to `newOwner`.

Callable by the current owner, or a delegate approved via the

`TransferDelegate` / `PermanentTransferDelegate` plugin. Fails

if the asset is frozen by an active `FreezeDelegate` or

`PermanentFreezeDelegate` plugin.

**Accounts:**

| Account         | Type             | Description                                  |
| --------------- | ---------------- | -------------------------------------------- |
| `asset`         | writable         | The address of the asset                     |
| `collection`    | optional         | The collection to which the asset belongs    |
| `payer`         | signer, writable | The account paying for the storage fees      |
| `authority`     | signer, optional | The owner or delegate of the asset           |
| `newOwner`      | readonly         | The new owner to which to transfer the asset |
| `systemProgram` | optional         | The system program                           |
| `logWrapper`    | optional         | The SPL Noop Program                         |

**Arguments:**

| Argument         | Type                                | Description                                                              |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `discriminator`  | `u8`                                | -                                                                        |
| `transferV1Args` | [transferV1Args](#transferV1Args-3) | A compression proof, required only if the asset is currently compressed. |

### updateV1

Updates an asset's name, URI and/or update authority.

Callable by the update authority or a delegate approved via

the `UpdateDelegate` plugin, unless blocked by

`ImmutableMetadata`.

**Accounts:**

| Account         | Type             | Description                                                    |
| --------------- | ---------------- | -------------------------------------------------------------- |
| `asset`         | writable         | The address of the asset                                       |
| `collection`    | optional         | The collection to which the asset belongs                      |
| `payer`         | signer, writable | The account paying for the storage fees                        |
| `authority`     | signer, optional | The update authority or update authority delegate of the asset |
| `systemProgram` | readonly         | The system program                                             |
| `logWrapper`    | optional         | The SPL Noop Program                                           |

**Arguments:**

| Argument        | Type                            | Description                                              |
| --------------- | ------------------------------- | -------------------------------------------------------- |
| `discriminator` | `u8`                            | -                                                        |
| `updateV1Args`  | [updateV1Args](#updateV1Args-3) | The fields to change; omitted fields are left untouched. |

### updateCollectionV1

Updates a collection's name and/or URI.

**Accounts:**

| Account              | Type             | Description                                                    |
| -------------------- | ---------------- | -------------------------------------------------------------- |
| `collection`         | writable         | The address of the asset                                       |
| `payer`              | signer, writable | The account paying for the storage fees                        |
| `authority`          | signer, optional | The update authority or update authority delegate of the asset |
| `newUpdateAuthority` | optional         | The new update authority of the asset                          |
| `systemProgram`      | readonly         | The system program                                             |
| `logWrapper`         | optional         | The SPL Noop Program                                           |

**Arguments:**

| Argument                 | Type                                                | Description                                              |
| ------------------------ | --------------------------------------------------- | -------------------------------------------------------- |
| `discriminator`          | `u8`                                                | -                                                        |
| `updateCollectionV1Args` | [updateCollectionV1Args](#updateCollectionV1Args-3) | The fields to change; omitted fields are left untouched. |

### compressV1

Compresses an asset from on-chain `AccountState` into the

hashed `LedgerState` representation (`HashedAssetV1`),

reclaiming most of the account's rent.

Compression is not currently enabled by the on-chain program;

calling this instruction returns an error.

**Accounts:**

| Account         | Type             | Description                               |
| --------------- | ---------------- | ----------------------------------------- |
| `asset`         | writable         | The address of the asset                  |
| `collection`    | optional         | The collection to which the asset belongs |
| `payer`         | signer, writable | The account receiving the storage fees    |
| `authority`     | signer, optional | The owner or delegate of the asset        |
| `systemProgram` | readonly         | The system program                        |
| `logWrapper`    | optional         | The SPL Noop Program                      |

**Arguments:**

| Argument         | Type                                | Description                                         |
| ---------------- | ----------------------------------- | --------------------------------------------------- |
| `discriminator`  | `u8`                                | -                                                   |
| `compressV1Args` | [compressV1Args](#compressV1Args-3) | Reserved for future use; currently carries no data. |

### decompressV1

Restores a compressed (`LedgerState`) asset back to a full

on-chain `AssetV1` account, verified against the supplied

`CompressionProof`.

Decompression is not currently enabled by the on-chain program;

calling this instruction returns an error.

**Accounts:**

| Account         | Type             | Description                               |
| --------------- | ---------------- | ----------------------------------------- |
| `asset`         | writable         | The address of the asset                  |
| `collection`    | optional         | The collection to which the asset belongs |
| `payer`         | signer, writable | The account paying for the storage fees   |
| `authority`     | signer, optional | The owner or delegate of the asset        |
| `systemProgram` | readonly         | The system program                        |
| `logWrapper`    | optional         | The SPL Noop Program                      |

**Arguments:**

| Argument           | Type                                    | Description                                                         |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------- |
| `discriminator`    | `u8`                                    | -                                                                   |
| `decompressV1Args` | [decompressV1Args](#decompressV1Args-3) | The proof of the asset's pre-compression state, used to rebuild it. |

### collect

Sweeps SOL protocol fees accumulated by the program (e.g. from

`CreateV1`) out to two fixed recipient accounts.

A permissionless maintenance instruction — no signer is

required.

**Accounts:**

| Account      | Type     | Description                    |
| ------------ | -------- | ------------------------------ |
| `recipient1` | writable | The address of the recipient 1 |
| `recipient2` | writable | The address of the recipient 2 |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### createV2

Creates a new Core asset, like `CreateV1`, but also accepts

external plugin adapters (Oracle, AppData, LifecycleHook, etc.)

at creation time via `externalPluginAdapters`.

**Accounts:**

| Account           | Type               | Description                                                           |
| ----------------- | ------------------ | --------------------------------------------------------------------- |
| `asset`           | signer, writable   | The address of the new asset                                          |
| `collection`      | writable, optional | The collection to which the asset belongs                             |
| `authority`       | signer, optional   | The authority signing for creation                                    |
| `payer`           | signer, writable   | The account paying for the storage fees                               |
| `owner`           | optional           | The owner of the new asset. Defaults to the authority if not present. |
| `updateAuthority` | optional           | The authority on the new asset                                        |
| `systemProgram`   | readonly           | The system program                                                    |
| `logWrapper`      | optional           | The SPL Noop Program                                                  |

**Arguments:**

| Argument        | Type                            | Description                                                                      |
| --------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `discriminator` | `u8`                            | -                                                                                |
| `createV2Args`  | [createV2Args](#createV2Args-3) | The asset's initial data state, name, URI, plugins and external plugin adapters. |

### createCollectionV2

Creates a new Core collection, like `CreateCollectionV1`, but

also accepts external plugin adapters at creation time via

`externalPluginAdapters`.

**Accounts:**

| Account           | Type             | Description                             |
| ----------------- | ---------------- | --------------------------------------- |
| `collection`      | signer, writable | The address of the new asset            |
| `updateAuthority` | optional         | The authority of the new asset          |
| `payer`           | signer, writable | The account paying for the storage fees |
| `systemProgram`   | readonly         | The system program                      |

**Arguments:**

| Argument                 | Type                                                | Description                                                               |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------- |
| `discriminator`          | `u8`                                                | -                                                                         |
| `createCollectionV2Args` | [createCollectionV2Args](#createCollectionV2Args-3) | The collection's name, URI, initial plugins and external plugin adapters. |

### addExternalPluginAdapterV1

Adds a new external plugin adapter (Oracle, AppData,

LifecycleHook, etc.) to an asset.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument                         | Type                                                                | Description                                             |
| -------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| `discriminator`                  | `u8`                                                                | -                                                       |
| `addExternalPluginAdapterV1Args` | [addExternalPluginAdapterV1Args](#addExternalPluginAdapterV1Args-3) | The adapter variant to add and its initialization data. |

### addCollectionExternalPluginAdapterV1

Adds a new external plugin adapter to a collection.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                                   | Type                                                                                    | Description                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `discriminator`                            | `u8`                                                                                    | -                                                       |
| `addCollectionExternalPluginAdapterV1Args` | [addCollectionExternalPluginAdapterV1Args](#addCollectionExternalPluginAdapterV1Args-3) | The adapter variant to add and its initialization data. |

### removeExternalPluginAdapterV1

Removes an external plugin adapter from an asset, identified

by its key.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument                            | Type                                                                      | Description                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `discriminator`                     | `u8`                                                                      | -                                                                            |
| `removeExternalPluginAdapterV1Args` | [removeExternalPluginAdapterV1Args](#removeExternalPluginAdapterV1Args-3) | Identifies which adapter (and, for keyed variants, which address) to remove. |

### removeCollectionExternalPluginAdapterV1

Removes an external plugin adapter from a collection,

identified by its key.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                                      | Type                                                                                          | Description                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| `discriminator`                               | `u8`                                                                                          | -                                   |
| `removeCollectionExternalPluginAdapterV1Args` | [removeCollectionExternalPluginAdapterV1Args](#removeCollectionExternalPluginAdapterV1Args-3) | Identifies which adapter to remove. |

### updateExternalPluginAdapterV1

Updates the configuration of an existing external plugin

adapter on an asset.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `logWrapper`    | optional           | The SPL Noop Program                      |

**Arguments:**

| Argument                            | Type                                                                      | Description                                                |
| ----------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `discriminator`                     | `u8`                                                                      | -                                                          |
| `updateExternalPluginAdapterV1Args` | [updateExternalPluginAdapterV1Args](#updateExternalPluginAdapterV1Args-3) | Identifies the adapter to update and the fields to change. |

### updateCollectionExternalPluginAdapterV1

Updates the configuration of an existing external plugin

adapter on a collection.

**Accounts:**

| Account         | Type             | Description                             |
| --------------- | ---------------- | --------------------------------------- |
| `collection`    | writable         | The address of the asset                |
| `payer`         | signer, writable | The account paying for the storage fees |
| `authority`     | signer, optional | The owner or delegate of the asset      |
| `systemProgram` | readonly         | The system program                      |
| `logWrapper`    | optional         | The SPL Noop Program                    |

**Arguments:**

| Argument                                      | Type                                                                                          | Description                                                |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `discriminator`                               | `u8`                                                                                          | -                                                          |
| `updateCollectionExternalPluginAdapterV1Args` | [updateCollectionExternalPluginAdapterV1Args](#updateCollectionExternalPluginAdapterV1Args-3) | Identifies the adapter to update and the fields to change. |

### writeExternalPluginAdapterDataV1

Writes (or clears) the raw bytes backing an `AppData`,

`LinkedAppData` or `DataSection` external plugin adapter on an

asset.

Only the adapter's `dataAuthority` may call this. The payload

can be supplied inline via `data`, or sourced from the optional

`buffer` account for payloads too large for a single

instruction.

**Accounts:**

| Account         | Type               | Description                                       |
| --------------- | ------------------ | ------------------------------------------------- |
| `asset`         | writable           | The address of the asset                          |
| `collection`    | writable, optional | The collection to which the asset belongs         |
| `payer`         | signer, writable   | The account paying for the storage fees           |
| `authority`     | signer, optional   | The Data Authority of the External Plugin Adapter |
| `buffer`        | optional           | The buffer to write to the external plugin        |
| `systemProgram` | readonly           | The system program                                |
| `logWrapper`    | optional           | The SPL Noop Program                              |

**Arguments:**

| Argument                               | Type                                                                            | Description                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `discriminator`                        | `u8`                                                                            | -                                                                 |
| `writeExternalPluginAdapterDataV1Args` | [writeExternalPluginAdapterDataV1Args](#writeExternalPluginAdapterDataV1Args-3) | The target adapter and the bytes to write, or `None` to clear it. |

### writeCollectionExternalPluginAdapterDataV1

Writes (or clears) the raw bytes backing an `AppData`,

`LinkedAppData` or `DataSection` external plugin adapter on a

collection.

**Accounts:**

| Account         | Type             | Description                                       |
| --------------- | ---------------- | ------------------------------------------------- |
| `collection`    | writable         | The address of the asset                          |
| `payer`         | signer, writable | The account paying for the storage fees           |
| `authority`     | signer, optional | The Data Authority of the External Plugin Adapter |
| `buffer`        | optional         | The buffer to write to the external plugin        |
| `systemProgram` | readonly         | The system program                                |
| `logWrapper`    | optional         | The SPL Noop Program                              |

**Arguments:**

| Argument                                         | Type                                                                                                | Description                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `discriminator`                                  | `u8`                                                                                                | -                                                                 |
| `writeCollectionExternalPluginAdapterDataV1Args` | [writeCollectionExternalPluginAdapterDataV1Args](#writeCollectionExternalPluginAdapterDataV1Args-3) | The target adapter and the bytes to write, or `None` to clear it. |

### updateV2

Updates an asset's name, URI and/or update authority, like

`UpdateV1`, and additionally allows moving the asset into a

different collection (or out of its collection) via

`newCollection`.

**Accounts:**

| Account         | Type               | Description                                                    |
| --------------- | ------------------ | -------------------------------------------------------------- |
| `asset`         | writable           | The address of the asset                                       |
| `collection`    | writable, optional | The collection to which the asset belongs                      |
| `payer`         | signer, writable   | The account paying for the storage fees                        |
| `authority`     | signer, optional   | The update authority or update authority delegate of the asset |
| `newCollection` | writable, optional | A new collection to which to move the asset                    |
| `systemProgram` | readonly           | The system program                                             |
| `logWrapper`    | optional           | The SPL Noop Program                                           |

**Arguments:**

| Argument        | Type                            | Description                                              |
| --------------- | ------------------------------- | -------------------------------------------------------- |
| `discriminator` | `u8`                            | -                                                        |
| `updateV2Args`  | [updateV2Args](#updateV2Args-3) | The fields to change; omitted fields are left untouched. |

### executeV1

Invokes an arbitrary instruction on another program via CPI,

signed by the asset's own program-derived `assetSigner`

address.

This lets an asset act as its own transaction signer (e.g. to

control a wallet or vault it owns). Requires the owner or an

authorized delegate, and increments the asset's sequence

number. Not available for compressed assets.

**Accounts:**

| Account         | Type               | Description                               |
| --------------- | ------------------ | ----------------------------------------- |
| `asset`         | writable           | The address of the asset                  |
| `collection`    | writable, optional | The collection to which the asset belongs |
| `assetSigner`   | readonly           | The signing PDA for the asset             |
| `payer`         | signer, writable   | The account paying for the storage fees   |
| `authority`     | signer, optional   | The owner or delegate of the asset        |
| `systemProgram` | readonly           | The system program                        |
| `programId`     | readonly           | The program id of the instruction         |

**Arguments:**

| Argument        | Type                              | Description                                                              |
| --------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `discriminator` | `u8`                              | -                                                                        |
| `executeV1Args` | [executeV1Args](#executeV1Args-3) | The raw, serialized instruction data to invoke via the asset-signer PDA. |

### updateCollectionInfoV1

Updates a collection's `numMinted` and `currentSize` counters.

Invoked via CPI (signed by the `bubblegumSigner` PDA) by the

Bubblegum program when compressed NFTs are minted into, or

removed from, a Core collection, so the collection's on-chain

size stays accurate without every compressed asset living in a

Core account.

**Accounts:**

| Account           | Type     | Description              |
| ----------------- | -------- | ------------------------ |
| `collection`      | writable | The address of the asset |
| `bubblegumSigner` | signer   | Bubblegum PDA signer     |

**Arguments:**

| Argument                     | Type                                                        | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `discriminator`              | `u8`                                                        | -                                                           |
| `updateCollectionInfoV1Args` | [updateCollectionInfoV1Args](#updateCollectionInfoV1Args-3) | Whether to record a mint or an add/remove, and by how much. |

### addCollectionsToGroupV1

Adds one or more collections to a group, recording the

membership as a `ChildGroup` relationship. The collections to

add are passed as remaining accounts.

**Accounts:**

| Account         | Type             | Description                                                            |
| --------------- | ---------------- | ---------------------------------------------------------------------- |
| `group`         | writable         | The address of the group to modify                                     |
| `payer`         | signer, writable | The account paying for storage fees                                    |
| `authority`     | signer, optional | The group update authority and collection update authority or delegate |
| `systemProgram` | readonly         | The system program                                                     |

**Arguments:**

| Argument                      | Type                                                          | Description                                                        |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `discriminator`               | `u8`                                                          | -                                                                  |
| `addCollectionsToGroupV1Args` | [addCollectionsToGroupV1Args](#addCollectionsToGroupV1Args-3) | Reserved; the collections to add are passed as remaining accounts. |

### removeCollectionsFromGroupV1

Removes one or more collections from a group.

**Accounts:**

| Account         | Type             | Description                                                            |
| --------------- | ---------------- | ---------------------------------------------------------------------- |
| `group`         | writable         | The address of the group to modify                                     |
| `payer`         | signer, writable | The account paying for storage fees                                    |
| `authority`     | signer, optional | The group update authority and collection update authority or delegate |
| `systemProgram` | readonly         | The system program                                                     |

**Arguments:**

| Argument                           | Type                                                                    | Description                                                |
| ---------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| `discriminator`                    | `u8`                                                                    | -                                                          |
| `removeCollectionsFromGroupV1Args` | [removeCollectionsFromGroupV1Args](#removeCollectionsFromGroupV1Args-3) | The addresses of the collections to remove from the group. |

### addAssetsToGroupV1

Adds one or more assets to a group, recording the membership as

an `Asset` relationship. The assets to add are passed as

remaining accounts.

**Accounts:**

| Account         | Type             | Description                                                       |
| --------------- | ---------------- | ----------------------------------------------------------------- |
| `group`         | writable         | The address of the group to modify                                |
| `payer`         | signer, writable | The account paying for storage fees                               |
| `authority`     | signer, optional | The group update authority and asset update authority or delegate |
| `systemProgram` | readonly         | The system program                                                |

**Arguments:**

| Argument                 | Type                                                | Description                                                   |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------- |
| `discriminator`          | `u8`                                                | -                                                             |
| `addAssetsToGroupV1Args` | [addAssetsToGroupV1Args](#addAssetsToGroupV1Args-3) | Reserved; the assets to add are passed as remaining accounts. |

### removeAssetsFromGroupV1

Removes one or more assets from a group.

**Accounts:**

| Account         | Type             | Description                                                       |
| --------------- | ---------------- | ----------------------------------------------------------------- |
| `group`         | writable         | The address of the group to modify                                |
| `payer`         | signer, writable | The account paying for storage fees                               |
| `authority`     | signer, optional | The group update authority and asset update authority or delegate |
| `systemProgram` | readonly         | The system program                                                |

**Arguments:**

| Argument                      | Type                                                          | Description                                           |
| ----------------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `discriminator`               | `u8`                                                          | -                                                     |
| `removeAssetsFromGroupV1Args` | [removeAssetsFromGroupV1Args](#removeAssetsFromGroupV1Args-3) | The addresses of the assets to remove from the group. |

### addGroupsToGroupV1

Nests one or more child groups under a parent group, forming a

group hierarchy.

**Accounts:**

| Account         | Type             | Description                                         |
| --------------- | ---------------- | --------------------------------------------------- |
| `parentGroup`   | writable         | The address of the parent group to modify           |
| `payer`         | signer, writable | The account paying for storage fees                 |
| `authority`     | signer, optional | The update authority of the parent and child groups |
| `systemProgram` | readonly         | The system program                                  |

**Arguments:**

| Argument                 | Type                                                | Description                                             |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------- |
| `discriminator`          | `u8`                                                | -                                                       |
| `addGroupsToGroupV1Args` | [addGroupsToGroupV1Args](#addGroupsToGroupV1Args-3) | The addresses of the child groups to add to the parent. |

### removeGroupsFromGroupV1

Removes one or more child groups from a parent group.

**Accounts:**

| Account         | Type             | Description                                         |
| --------------- | ---------------- | --------------------------------------------------- |
| `parentGroup`   | writable         | The address of the parent group to modify           |
| `payer`         | signer, writable | The account paying for storage fees                 |
| `authority`     | signer, optional | The update authority of the parent and child groups |
| `systemProgram` | readonly         | The system program                                  |

**Arguments:**

| Argument                      | Type                                                          | Description                                                  |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| `discriminator`               | `u8`                                                          | -                                                            |
| `removeGroupsFromGroupV1Args` | [removeGroupsFromGroupV1Args](#removeGroupsFromGroupV1Args-3) | The addresses of the child groups to remove from the parent. |

### createGroupV1

Creates a new group — a keypair-generated account used to

organize assets, collections and other groups under a shared

update authority, independent of (and orthogonal to) the

collection hierarchy.

**Accounts:**

| Account           | Type             | Description                             |
| ----------------- | ---------------- | --------------------------------------- |
| `group`           | signer, writable | The address of the new group            |
| `updateAuthority` | signer, optional | The authority of the new group          |
| `payer`           | signer, writable | The account paying for the storage fees |
| `systemProgram`   | readonly         | The system program                      |

**Arguments:**

| Argument            | Type                                      | Description                                             |
| ------------------- | ----------------------------------------- | ------------------------------------------------------- |
| `discriminator`     | `u8`                                      | -                                                       |
| `createGroupV1Args` | [createGroupV1Args](#createGroupV1Args-3) | The group's name, URI and initial member relationships. |

### closeGroupV1

Closes an empty group account and refunds its rent to `payer`.

**Accounts:**

| Account     | Type             | Description                              |
| ----------- | ---------------- | ---------------------------------------- |
| `group`     | writable         | The address of the group to close        |
| `payer`     | signer, writable | The account receiving reclaimed lamports |
| `authority` | signer, optional | The update authority of the group        |

**Arguments:**

| Argument           | Type                                    | Description                                         |
| ------------------ | --------------------------------------- | --------------------------------------------------- |
| `discriminator`    | `u8`                                    | -                                                   |
| `closeGroupV1Args` | [closeGroupV1Args](#closeGroupV1Args-3) | Reserved for future use; currently carries no data. |

### updateGroupV1

Updates a group's name, URI and/or update authority.

**Accounts:**

| Account              | Type             | Description                             |
| -------------------- | ---------------- | --------------------------------------- |
| `group`              | writable         | The address of the group to update      |
| `payer`              | signer, writable | The account paying for the storage fees |
| `authority`          | signer, optional | The update authority of the group       |
| `newUpdateAuthority` | optional         | The new update authority of the group   |
| `systemProgram`      | readonly         | The system program                      |

**Arguments:**

| Argument            | Type                                      | Description                                              |
| ------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `discriminator`     | `u8`                                      | -                                                        |
| `updateGroupV1Args` | [updateGroupV1Args](#updateGroupV1Args-3) | The fields to change; omitted fields are left untouched. |

## PDAs

### assetSigner

The signing PDA for an asset, used by executeV1

**Seeds:**

| Seed       | Type             | Description                      |
| ---------- | ---------------- | -------------------------------- |
| `constant` | bytes (constant) | -                                |
| `asset`    | `PublicKey`      | The address of the asset account |

## Types

### pluginAuthorityPair

A plugin paired with the authority that should manage it,

used when creating an asset/collection or adding a plugin.

**Definition:**

```typescript
{
  plugin: plugin;
  authority: authority | null;
}
```

### agentIdentity

External plugin adapter that attaches an off-chain agent

identity descriptor to the asset.

**Definition:**

```typescript
{
  uri: unknown;
}
```

### agentIdentityInitInfo

Initialization data for the `AgentIdentity` external plugin adapter.

**Definition:**

```typescript
{
  uri: unknown;
  initPluginAuthority: authority | null;
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][];
}
```

### agentIdentityUpdateInfo

Update data for the `AgentIdentity` external plugin adapter.

**Definition:**

```typescript
{
  uri: unknown | null;
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][] | null;
}
```

### appData

External plugin adapter storing arbitrary application data,

writable only by its `dataAuthority`.

**Definition:**

```typescript
{
  dataAuthority: authority;
  schema: externalPluginAdapterSchema;
}
```

### appDataInitInfo

Initialization data for the `AppData` external plugin adapter.

**Definition:**

```typescript
{
  dataAuthority: authority;
  initPluginAuthority: authority | null;
  schema: externalPluginAdapterSchema | null;
}
```

### appDataUpdateInfo

Update data for the `AppData` external plugin adapter.

**Definition:**

```typescript
{
  schema: externalPluginAdapterSchema | null;
}
```

### dataSection

Internal storage plugin holding the raw payload for a

`LinkedAppData` or `LinkedLifecycleHook` adapter. Managed

automatically; has no authority of its own.

**Definition:**

```typescript
{
  parentKey: linkedDataKey;
  schema: externalPluginAdapterSchema;
}
```

### dataSectionInitInfo

Initialization data for the `DataSection` external plugin adapter.

**Definition:**

```typescript
{
  parentKey: linkedDataKey;
  schema: externalPluginAdapterSchema;
}
```

### dataSectionUpdateInfo

Update data for the `DataSection` external plugin adapter;

currently carries no data.

**Definition:**

```typescript
{
}
```

### lifecycleHook

External plugin adapter that invokes a program via CPI at

configured lifecycle events.

**Definition:**

```typescript
{
  hookedProgram: PublicKey;
  extraAccounts: extraAccount[] | null;
  dataAuthority: authority | null;
  schema: externalPluginAdapterSchema;
}
```

### lifecycleHookInitInfo

Initialization data for the `LifecycleHook` external plugin adapter.

**Definition:**

```typescript
{
  hookedProgram: PublicKey;
  initPluginAuthority: authority | null;
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][];
  extraAccounts: extraAccount[] | null;
  dataAuthority: authority | null;
  schema: externalPluginAdapterSchema | null;
}
```

### lifecycleHookUpdateInfo

Update data for the `LifecycleHook` external plugin adapter.

**Definition:**

```typescript
{
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][] | null;
  extraAccounts: extraAccount[] | null;
  schema: externalPluginAdapterSchema | null;
}
```

### linkedAppData

External plugin adapter like `AppData`, but for collections:

its data is shared by every asset in the collection via a

`DataSection`.

**Definition:**

```typescript
{
  dataAuthority: authority;
  schema: externalPluginAdapterSchema;
}
```

### linkedAppDataInitInfo

Initialization data for the `LinkedAppData` external plugin adapter.

**Definition:**

```typescript
{
  dataAuthority: authority;
  initPluginAuthority: authority | null;
  schema: externalPluginAdapterSchema | null;
}
```

### linkedAppDataUpdateInfo

Update data for the `LinkedAppData` external plugin adapter.

**Definition:**

```typescript
{
  schema: externalPluginAdapterSchema | null;
}
```

### linkedLifecycleHook

External plugin adapter like `LifecycleHook`, but for

collections, sharing its data via a `DataSection`.

**Definition:**

```typescript
{
  hookedProgram: PublicKey;
  extraAccounts: extraAccount[] | null;
  dataAuthority: authority | null;
  schema: externalPluginAdapterSchema;
}
```

### linkedLifecycleHookInitInfo

Initialization data for the `LinkedLifecycleHook` external

plugin adapter.

**Definition:**

```typescript
{
  hookedProgram: PublicKey;
  initPluginAuthority: authority | null;
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][];
  extraAccounts: extraAccount[] | null;
  dataAuthority: authority | null;
  schema: externalPluginAdapterSchema | null;
}
```

### linkedLifecycleHookUpdateInfo

Update data for the `LinkedLifecycleHook` external plugin adapter.

**Definition:**

```typescript
{
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][] | null;
  extraAccounts: extraAccount[] | null;
  schema: externalPluginAdapterSchema | null;
}
```

### oracle

External plugin adapter that reads a `ValidationResult` from

an external account to gate lifecycle events.

**Definition:**

```typescript
{
  baseAddress: PublicKey;
  baseAddressConfig: extraAccount | null;
  resultsOffset: validationResultsOffset;
}
```

### oracleInitInfo

Initialization data for the `Oracle` external plugin adapter.

**Definition:**

```typescript
{
  baseAddress: PublicKey;
  initPluginAuthority: authority | null;
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][];
  baseAddressConfig: extraAccount | null;
  resultsOffset: validationResultsOffset | null;
}
```

### oracleUpdateInfo

Update data for the `Oracle` external plugin adapter.

**Definition:**

```typescript
{
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][] | null;
  baseAddressConfig: extraAccount | null;
  resultsOffset: validationResultsOffset | null;
}
```

### addBlocker

Internal plugin that prevents any other plugin from being

added to the asset or collection.

**Definition:**

```typescript
{
}
```

### attribute

A single key/value pair stored by the `Attributes` plugin.

**Definition:**

```typescript
{
  key: unknown;
  value: unknown;
}
```

### attributes

Internal plugin that stores an arbitrary list of on-chain

key/value attributes.

**Definition:**

```typescript
{
  attributeList: attribute[];
}
```

### groups

Internal plugin recording the groups an asset or collection belongs to.

**Definition:**

```typescript
{
  groups: PublicKey[];
}
```

### immutableMetadata

Internal plugin that permanently locks the asset's name and

URI against further updates.

**Definition:**

```typescript
{
}
```

### masterEdition

Internal plugin marking a collection as a template that assets

can be printed from as numbered `Edition`s.

**Definition:**

```typescript
{
  maxSupply: bigint | null;
  name: unknown | null;
  uri: unknown | null;
}
```

### creator

A single creator entry used by the `Royalties` plugin, with

their address and royalty share.

**Definition:**

```typescript
{
  address: PublicKey;
  percentage: bigint;
}
```

### royalties

Internal plugin enforcing creator royalty payments on secondary sales.

**Definition:**

```typescript
{
  basisPoints: bigint;
  creators: creator[];
  ruleSet: ruleSet;
}
```

### updateDelegate

Internal plugin whose authority (and any `additionalDelegates`)

can update the asset's metadata alongside the update

authority.

**Definition:**

```typescript
{
  additionalDelegates: PublicKey[];
}
```

### verifiedCreatorsSignature

A single creator entry recorded by the `VerifiedCreators` plugin.

**Definition:**

```typescript
{
  address: PublicKey;
  verified: boolean;
}
```

### verifiedCreators

Internal plugin listing creators who have cryptographically

verified their inclusion, similar to the legacy Token

Metadata creators array.

**Definition:**

```typescript
{
  signatures: verifiedCreatorsSignature[];
}
```

### autographSignature

A single signature entry recorded by the `Autograph` plugin.

**Definition:**

```typescript
{
  address: PublicKey;
  message: unknown;
}
```

### autograph

Internal plugin that collects a guestbook of signatures left

by arbitrary addresses.

**Definition:**

```typescript
{
  signatures: autographSignature[];
}
```

### burnDelegate

Internal plugin whose authority is allowed to burn the asset

on the owner's behalf.

**Definition:**

```typescript
{
}
```

### freezeDelegate

Internal plugin whose authority can freeze the asset, blocking

transfers while frozen.

**Definition:**

```typescript
{
  frozen: boolean;
}
```

### freezeExecute

Internal plugin whose authority can freeze the asset's ability

to be used with `executeV1`.

**Definition:**

```typescript
{
  frozen: boolean;
}
```

### transferDelegate

Internal plugin whose authority can transfer the asset on the

owner's behalf.

**Definition:**

```typescript
{
}
```

### bubblegumV2

Internal plugin marking the asset as linked to / managed via

the Bubblegum V2 compressed NFT program.

**Definition:**

```typescript
{
}
```

### edition

Internal plugin that assigns an edition number to an asset

printed from a `MasterEdition`.

**Definition:**

```typescript
{
  number: bigint;
}
```

### permanentBurnDelegate

Internal plugin, addable only at creation, whose authority

permanently retains the right to burn the asset.

**Definition:**

```typescript
{
}
```

### permanentFreezeDelegate

Internal plugin, addable only at creation, whose authority

permanently retains the right to freeze the asset.

**Definition:**

```typescript
{
  frozen: boolean;
}
```

### permanentFreezeExecute

Internal plugin, addable only at creation, whose authority

permanently retains the right to freeze the asset's

`executeV1` capability.

**Definition:**

```typescript
{
  frozen: boolean;
}
```

### permanentTransferDelegate

Internal plugin, addable only at creation, whose authority

permanently retains the right to transfer the asset.

**Definition:**

```typescript
{
}
```

### externalCheckResult

A bitmask of the `ValidationResult` values an external plugin

adapter may return for a checked lifecycle event.

**Definition:**

```typescript
{
  flags: bigint;
}
```

### registryRecord

An entry in `PluginRegistryV1` describing one internal plugin

and where its data lives in the account.

**Definition:**

```typescript
{
  pluginType: pluginType;
  authority: authority;
  offset: bigint;
}
```

### externalRegistryRecord

An entry in `PluginRegistryV1` describing one external plugin

adapter and where its config/data live in the account.

**Definition:**

```typescript
{
  pluginType: externalPluginAdapterType;
  authority: authority;
  lifecycleChecks: [hookableLifecycleEvent, externalCheckResult][] | null;
  offset: bigint;
  dataOffset: bigint | null;
  dataLen: bigint | null;
}
```

### addAssetsToGroupV1Args

Arguments for `addAssetsToGroupV1`; the assets to add are

passed as remaining accounts.

**Definition:**

```typescript
{
}
```

### addCollectionsToGroupV1Args

Arguments for `addCollectionsToGroupV1`; the collections to

add are passed as remaining accounts.

**Definition:**

```typescript
{
}
```

### addExternalPluginAdapterV1Args

Arguments for `addExternalPluginAdapterV1`.

**Definition:**

```typescript
{
  initInfo: externalPluginAdapterInitInfo;
}
```

### addCollectionExternalPluginAdapterV1Args

Arguments for `addCollectionExternalPluginAdapterV1`.

**Definition:**

```typescript
{
  initInfo: externalPluginAdapterInitInfo;
}
```

### addGroupsToGroupV1Args

Arguments for `addGroupsToGroupV1`.

**Definition:**

```typescript
{
  groups: PublicKey[];
}
```

### addPluginV1Args

Arguments for `addPluginV1`.

**Definition:**

```typescript
{
  plugin: plugin;
  initAuthority: authority | null;
}
```

### addCollectionPluginV1Args

Arguments for `addCollectionPluginV1`.

**Definition:**

```typescript
{
  plugin: plugin;
  initAuthority: authority | null;
}
```

### approvePluginAuthorityV1Args

Arguments for `approvePluginAuthorityV1`.

**Definition:**

```typescript
{
  pluginType: pluginType;
  newAuthority: authority;
}
```

### approveCollectionPluginAuthorityV1Args

Arguments for `approveCollectionPluginAuthorityV1`.

**Definition:**

```typescript
{
  pluginType: pluginType;
  newAuthority: authority;
}
```

### burnV1Args

Arguments for `burnV1`.

**Definition:**

```typescript
{
  compressionProof: compressionProof | null;
}
```

### burnCollectionV1Args

Arguments for `burnCollectionV1`.

**Definition:**

```typescript
{
  compressionProof: compressionProof | null;
}
```

### closeGroupV1Args

Arguments for `closeGroupV1`; currently carries no data.

**Definition:**

```typescript
{
}
```

### compressV1Args

Arguments for `compressV1`; currently carries no data.

**Definition:**

```typescript
{
}
```

### createV1Args

Arguments for `createV1`.

**Definition:**

```typescript
{
  dataState: dataState;
  name: unknown;
  uri: unknown;
  plugins: pluginAuthorityPair[] | null;
}
```

### createV2Args

Arguments for `createV2`.

**Definition:**

```typescript
{
  dataState: dataState;
  name: unknown;
  uri: unknown;
  plugins: pluginAuthorityPair[] | null;
  externalPluginAdapters: externalPluginAdapterInitInfo[] | null;
}
```

### createCollectionV1Args

Arguments for `createCollectionV1`.

**Definition:**

```typescript
{
  name: unknown;
  uri: unknown;
  plugins: pluginAuthorityPair[] | null;
}
```

### createCollectionV2Args

Arguments for `createCollectionV2`.

**Definition:**

```typescript
{
  name: unknown;
  uri: unknown;
  plugins: pluginAuthorityPair[] | null;
  externalPluginAdapters: externalPluginAdapterInitInfo[] | null;
}
```

### createGroupV1Args

Arguments for `createGroupV1`.

**Definition:**

```typescript
{
  name: unknown;
  uri: unknown;
  relationships: relationshipEntry[];
}
```

### decompressV1Args

Arguments for `decompressV1`.

**Definition:**

```typescript
{
  compressionProof: compressionProof;
}
```

### executeV1Args

Arguments for `executeV1`.

**Definition:**

```typescript
{
  instructionData: unknown;
}
```

### removeAssetsFromGroupV1Args

Arguments for `removeAssetsFromGroupV1`.

**Definition:**

```typescript
{
  assets: PublicKey[];
}
```

### removeCollectionsFromGroupV1Args

Arguments for `removeCollectionsFromGroupV1`.

**Definition:**

```typescript
{
  collections: PublicKey[];
}
```

### removeExternalPluginAdapterV1Args

Arguments for `removeExternalPluginAdapterV1`.

**Definition:**

```typescript
{
  key: externalPluginAdapterKey;
}
```

### removeCollectionExternalPluginAdapterV1Args

Arguments for `removeCollectionExternalPluginAdapterV1`.

**Definition:**

```typescript
{
  key: externalPluginAdapterKey;
}
```

### removeGroupsFromGroupV1Args

Arguments for `removeGroupsFromGroupV1`.

**Definition:**

```typescript
{
  groups: PublicKey[];
}
```

### removePluginV1Args

Arguments for `removePluginV1`.

**Definition:**

```typescript
{
  pluginType: pluginType;
}
```

### removeCollectionPluginV1Args

Arguments for `removeCollectionPluginV1`.

**Definition:**

```typescript
{
  pluginType: pluginType;
}
```

### revokePluginAuthorityV1Args

Arguments for `revokePluginAuthorityV1`.

**Definition:**

```typescript
{
  pluginType: pluginType;
}
```

### revokeCollectionPluginAuthorityV1Args

Arguments for `revokeCollectionPluginAuthorityV1`.

**Definition:**

```typescript
{
  pluginType: pluginType;
}
```

### transferV1Args

Arguments for `transferV1`.

**Definition:**

```typescript
{
  compressionProof: compressionProof | null;
}
```

### updateV1Args

Arguments for `updateV1`.

**Definition:**

```typescript
{
  newName: unknown | null;
  newUri: unknown | null;
  newUpdateAuthority: updateAuthority | null;
}
```

### updateV2Args

Arguments for `updateV2`.

**Definition:**

```typescript
{
  newName: unknown | null;
  newUri: unknown | null;
  newUpdateAuthority: updateAuthority | null;
}
```

### updateCollectionV1Args

Arguments for `updateCollectionV1`.

**Definition:**

```typescript
{
  newName: unknown | null;
  newUri: unknown | null;
}
```

### updateCollectionInfoV1Args

Arguments for `updateCollectionInfoV1`.

**Definition:**

```typescript
{
  updateType: updateType;
  amount: bigint;
}
```

### updateExternalPluginAdapterV1Args

Arguments for `updateExternalPluginAdapterV1`.

**Definition:**

```typescript
{
  key: externalPluginAdapterKey;
  updateInfo: externalPluginAdapterUpdateInfo;
}
```

### updateCollectionExternalPluginAdapterV1Args

Arguments for `updateCollectionExternalPluginAdapterV1`.

**Definition:**

```typescript
{
  key: externalPluginAdapterKey;
  updateInfo: externalPluginAdapterUpdateInfo;
}
```

### updateGroupV1Args

Arguments for `updateGroupV1`.

**Definition:**

```typescript
{
  newName: unknown | null;
  newUri: unknown | null;
}
```

### updatePluginV1Args

Arguments for `updatePluginV1`.

**Definition:**

```typescript
{
  plugin: plugin;
}
```

### updateCollectionPluginV1Args

Arguments for `updateCollectionPluginV1`.

**Definition:**

```typescript
{
  plugin: plugin;
}
```

### writeExternalPluginAdapterDataV1Args

Arguments for `writeExternalPluginAdapterDataV1`.

**Definition:**

```typescript
{
  key: externalPluginAdapterKey;
  data: unknown | null;
}
```

### writeCollectionExternalPluginAdapterDataV1Args

Arguments for `writeCollectionExternalPluginAdapterDataV1`.

**Definition:**

```typescript
{
  key: externalPluginAdapterKey;
  data: unknown | null;
}
```

### compressionProof

The asset's core data and plugins as they existed at the time

it was compressed, used to verify and rebuild it on

`decompressV1`.

**Definition:**

```typescript
{
  owner: PublicKey;
  updateAuthority: updateAuthority;
  name: unknown;
  uri: unknown;
  seq: bigint;
  plugins: hashablePluginSchema[];
}
```

### relationshipEntry

A single membership relationship (e.g. to a collection or

group) recorded in a `CreateGroupV1` call.

**Definition:**

```typescript
{
  kind: relationshipKind;
  key: PublicKey;
}
```

### hashablePluginSchema

A plugin's index, authority and data as included in a

`HashedAssetSchema` hash.

**Definition:**

```typescript
{
  index: bigint;
  authority: authority;
  plugin: plugin;
}
```

### hashedAssetSchema

The schema hashed to produce a `HashedAssetV1`'s commitment:

the asset's core data hash plus a hash per plugin.

**Definition:**

```typescript
{
  assetHash: bigint[32];
  pluginHashes: bigint[32][];
}
```

### plugin

A configured internal plugin and its current data, keyed by plugin type.

**Definition:**

```typescript
| { kind: "royalties"; value: [royalties] }
  | { kind: "freezeDelegate"; value: [freezeDelegate] }
  | { kind: "burnDelegate"; value: [burnDelegate] }
  | { kind: "transferDelegate"; value: [transferDelegate] }
  | { kind: "updateDelegate"; value: [updateDelegate] }
  | { kind: "permanentFreezeDelegate"; value: [permanentFreezeDelegate] }
  | { kind: "attributes"; value: [attributes] }
  | { kind: "permanentTransferDelegate"; value: [permanentTransferDelegate] }
  | { kind: "permanentBurnDelegate"; value: [permanentBurnDelegate] }
  | { kind: "edition"; value: [edition] }
  | { kind: "masterEdition"; value: [masterEdition] }
  | { kind: "addBlocker"; value: [addBlocker] }
  | { kind: "immutableMetadata"; value: [immutableMetadata] }
  | { kind: "verifiedCreators"; value: [verifiedCreators] }
  | { kind: "autograph"; value: [autograph] }
  | { kind: "bubblegumV2"; value: [bubblegumV2] }
  | { kind: "freezeExecute"; value: [freezeExecute] }
  | { kind: "permanentFreezeExecute"; value: [permanentFreezeExecute] }
  | { kind: "groups"; value: [groups] }
```

### pluginType

The kind of internal plugin, without its configuration or data.

**Definition:**

```typescript
| { kind: "royalties" }
  | { kind: "freezeDelegate" }
  | { kind: "burnDelegate" }
  | { kind: "transferDelegate" }
  | { kind: "updateDelegate" }
  | { kind: "permanentFreezeDelegate" }
  | { kind: "attributes" }
  | { kind: "permanentTransferDelegate" }
  | { kind: "permanentBurnDelegate" }
  | { kind: "edition" }
  | { kind: "masterEdition" }
  | { kind: "addBlocker" }
  | { kind: "immutableMetadata" }
  | { kind: "verifiedCreators" }
  | { kind: "autograph" }
  | { kind: "bubblegumV2" }
  | { kind: "freezeExecute" }
  | { kind: "permanentFreezeExecute" }
  | { kind: "groups" }
```

### validationResultsOffset

Where within an oracle account to read its `OracleValidation`:

no offset, past the 8-byte Anchor discriminator, or a

`Custom` byte offset.

**Definition:**

```typescript
| { kind: "noOffset" }
  | { kind: "anchor" }
  | { kind: "custom"; value: [bigint] }
```

### oracleValidation

The result stored in an oracle account: `Uninitialized`, or

`V1` with a separate `ExternalValidationResult` per lifecycle

event.

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "v1"; create: externalValidationResult; transfer: externalValidationResult; burn: externalValidationResult; update: externalValidationResult }
```

### externalPluginAdapterType

The kind of external plugin adapter, without its configuration or data.

**Definition:**

```typescript
| { kind: "lifecycleHook" }
  | { kind: "oracle" }
  | { kind: "appData" }
  | { kind: "linkedLifecycleHook" }
  | { kind: "linkedAppData" }
  | { kind: "dataSection" }
  | { kind: "agentIdentity" }
```

### externalPluginAdapter

A configured external plugin adapter and its current data,

keyed by adapter type: `LifecycleHook`, `Oracle`, `AppData`,

`LinkedLifecycleHook`, `LinkedAppData`, `DataSection` or

`AgentIdentity`.

**Definition:**

```typescript
| { kind: "lifecycleHook"; value: [lifecycleHook] }
  | { kind: "oracle"; value: [oracle] }
  | { kind: "appData"; value: [appData] }
  | { kind: "linkedLifecycleHook"; value: [linkedLifecycleHook] }
  | { kind: "linkedAppData"; value: [linkedAppData] }
  | { kind: "dataSection"; value: [dataSection] }
  | { kind: "agentIdentity"; value: [agentIdentity] }
```

### hookableLifecycleEvent

A lifecycle event that can trigger an external plugin

adapter's check: `Create`, `Transfer`, `Burn`, `Update` or

`Execute`.

**Definition:**

```typescript
| { kind: "create" }
  | { kind: "transfer" }
  | { kind: "burn" }
  | { kind: "update" }
  | { kind: "execute" }
```

### extraAccount

An additional account to forward to a `LifecycleHook`'s

hooked program: either a preconfigured well-known account

(asset, collection, owner, recipient, program) or a custom

PDA derived from `seeds`.

**Definition:**

```typescript
| { kind: "preconfiguredProgram"; isSigner: boolean; isWritable: boolean }
  | { kind: "preconfiguredCollection"; isSigner: boolean; isWritable: boolean }
  | { kind: "preconfiguredOwner"; isSigner: boolean; isWritable: boolean }
  | { kind: "preconfiguredRecipient"; isSigner: boolean; isWritable: boolean }
  | { kind: "preconfiguredAsset"; isSigner: boolean; isWritable: boolean }
  | { kind: "customPda"; seeds: seed[]; customProgramId: PublicKey | null; isSigner: boolean; isWritable: boolean }
  | { kind: "address"; address: PublicKey; isSigner: boolean; isWritable: boolean }
```

### seed

A single seed component used to derive a `CustomPda` account

for a `LifecycleHook`'s extra accounts.

**Definition:**

```typescript
| { kind: "collection" }
  | { kind: "owner" }
  | { kind: "recipient" }
  | { kind: "asset" }
  | { kind: "address"; value: [PublicKey] }
  | { kind: "bytes"; value: [unknown] }
```

### externalPluginAdapterSchema

The serialization format used for an external plugin

adapter's stored data: `Binary`, `Json` or `MsgPack`.

**Definition:**

```typescript
| { kind: "binary" }
  | { kind: "json" }
  | { kind: "msgPack" }
```

### externalPluginAdapterInitInfo

Initialization data for adding a new external plugin adapter,

keyed by adapter type.

**Definition:**

```typescript
| { kind: "lifecycleHook"; value: [lifecycleHookInitInfo] }
  | { kind: "oracle"; value: [oracleInitInfo] }
  | { kind: "appData"; value: [appDataInitInfo] }
  | { kind: "linkedLifecycleHook"; value: [linkedLifecycleHookInitInfo] }
  | { kind: "linkedAppData"; value: [linkedAppDataInitInfo] }
  | { kind: "dataSection"; value: [dataSectionInitInfo] }
  | { kind: "agentIdentity"; value: [agentIdentityInitInfo] }
```

### externalPluginAdapterUpdateInfo

Update data for an existing external plugin adapter, keyed by

adapter type.

**Definition:**

```typescript
| { kind: "lifecycleHook"; value: [lifecycleHookUpdateInfo] }
  | { kind: "oracle"; value: [oracleUpdateInfo] }
  | { kind: "appData"; value: [appDataUpdateInfo] }
  | { kind: "linkedLifecycleHook"; value: [linkedLifecycleHookUpdateInfo] }
  | { kind: "linkedAppData"; value: [linkedAppDataUpdateInfo] }
  | { kind: "agentIdentity"; value: [agentIdentityUpdateInfo] }
```

### externalPluginAdapterKey

Identifies a specific external plugin adapter instance, e.g.

an `Oracle` by its account address or `AppData` by its data

authority.

**Definition:**

```typescript
| { kind: "lifecycleHook"; value: [PublicKey] }
  | { kind: "oracle"; value: [PublicKey] }
  | { kind: "appData"; value: [authority] }
  | { kind: "linkedLifecycleHook"; value: [PublicKey] }
  | { kind: "linkedAppData"; value: [authority] }
  | { kind: "dataSection"; value: [linkedDataKey] }
  | { kind: "agentIdentity" }
```

### linkedDataKey

Identifies which linked adapter (`LinkedLifecycleHook` or

`LinkedAppData`) a `DataSection` belongs to.

**Definition:**

```typescript
| { kind: "linkedLifecycleHook"; value: [PublicKey] }
  | { kind: "linkedAppData"; value: [authority] }
```

### ruleSet

Restricts which programs may transfer an asset with the

`Royalties` plugin: `None`, a `ProgramAllowList`, or a

`ProgramDenyList`.

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "programAllowList"; value: [PublicKey[]] }
  | { kind: "programDenyList"; value: [PublicKey[]] }
```

### validationResult

The outcome of a plugin's check for a lifecycle event:

`Approved`, `Rejected`, `Pass` (abstain), or `ForceApproved`.

**Definition:**

```typescript
| { kind: "approved" }
  | { kind: "rejected" }
  | { kind: "pass" }
  | { kind: "forceApproved" }
```

### externalValidationResult

The outcome of an external plugin adapter's check for a

lifecycle event: `Approved`, `Rejected` or `Pass` (abstain).

**Definition:**

```typescript
| { kind: "approved" }
  | { kind: "rejected" }
  | { kind: "pass" }
```

### updateType

Whether an `updateCollectionInfoV1` call records a `Mint`, or

an `Add`/`Remove` adjustment to collection size.

**Definition:**

```typescript
| { kind: "mint" }
  | { kind: "add" }
  | { kind: "remove" }
```

### dataState

Whether an asset/collection's data lives fully on-chain

(`AccountState`) or in the compressed, off-chain-hashed form

(`LedgerState`).

**Definition:**

```typescript
| { kind: "accountState" }
  | { kind: "ledgerState" }
```

### authority

Identifies who manages a plugin or external plugin adapter:

nobody (`None`), the asset/collection `Owner`, its

`UpdateAuthority`, or a specific `Address`.

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "owner" }
  | { kind: "updateAuthority" }
  | { kind: "address"; address: PublicKey }
```

### key

Account discriminator identifying which kind of MPL Core

account a given account is.

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "assetV1" }
  | { kind: "hashedAssetV1" }
  | { kind: "pluginHeaderV1" }
  | { kind: "pluginRegistryV1" }
  | { kind: "collectionV1" }
  | { kind: "groupV1" }
```

### relationshipKind

The kind of relationship a `RelationshipEntry` records:

membership in a `Collection`, a `ChildGroup`, a

`ParentGroup`, or an `Asset`.

**Definition:**

```typescript
| { kind: "collection" }
  | { kind: "childGroup" }
  | { kind: "parentGroup" }
  | { kind: "asset" }
```

### relationshipEntry

A single membership relationship (e.g. to a collection or

group) recorded in a `CreateGroupV1` call.

**Definition:**

```typescript
{
  kind: relationshipKind;
  key: PublicKey;
}
```

### updateAuthority

The update authority of an asset: unset (`None`), a specific

`Address`, or inherited from a `Collection`.

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "address"; value: [PublicKey] }
  | { kind: "collection"; value: [PublicKey] }
```

## Errors

- **0 - InvalidSystemProgram**: Invalid System Program _(Hex: `0x0`)_
- **1 - DeserializationError**: Error deserializing account _(Hex: `0x1`)_
- **2 - SerializationError**: Error serializing account _(Hex: `0x2`)_
- **3 - PluginsNotInitialized**: Plugins not initialized _(Hex: `0x3`)_
- **4 - PluginNotFound**: Plugin not found _(Hex: `0x4`)_
- **5 - NumericalOverflow**: Numerical Overflow _(Hex: `0x5`)_
- **6 - IncorrectAccount**: Incorrect account _(Hex: `0x6`)_
- **7 - IncorrectAssetHash**: Incorrect asset hash _(Hex: `0x7`)_
- **8 - InvalidPlugin**: Invalid Plugin _(Hex: `0x8`)_
- **9 - InvalidAuthority**: Invalid Authority _(Hex: `0x9`)_
- **10 - AssetIsFrozen**: Cannot transfer a frozen asset _(Hex: `0xa`)_
- **11 - MissingCompressionProof**: Missing compression proof _(Hex: `0xb`)_
- **12 - CannotMigrateMasterWithSupply**: Cannot migrate a master edition used for prints _(Hex: `0xc`)_
- **13 - CannotMigratePrints**: Cannot migrate a print edition _(Hex: `0xd`)_
- **14 - CannotBurnCollection**: Cannot burn a collection NFT _(Hex: `0xe`)_
- **15 - PluginAlreadyExists**: Plugin already exists _(Hex: `0xf`)_
- **16 - NumericalOverflowError**: Numerical overflow _(Hex: `0x10`)_
- **17 - AlreadyCompressed**: Already compressed account _(Hex: `0x11`)_
- **18 - AlreadyDecompressed**: Already decompressed account _(Hex: `0x12`)_
- **19 - InvalidCollection**: Invalid Collection passed in _(Hex: `0x13`)_
- **20 - MissingUpdateAuthority**: Missing update authority _(Hex: `0x14`)_
- **21 - MissingNewOwner**: Missing new owner _(Hex: `0x15`)_
- **22 - MissingSystemProgram**: Missing system program _(Hex: `0x16`)_
- **23 - NotAvailable**: Feature not available _(Hex: `0x17`)_
- **24 - InvalidAsset**: Invalid Asset passed in _(Hex: `0x18`)_
- **25 - MissingCollection**: Missing collection _(Hex: `0x19`)_
- **26 - NoApprovals**: Neither the asset or any plugins have approved this operation _(Hex: `0x1a`)_
- **27 - CannotRedelegate**: Plugin Manager cannot redelegate a delegated plugin without revoking first _(Hex: `0x1b`)_
- **28 - InvalidPluginSetting**: Invalid setting for plugin _(Hex: `0x1c`)_
- **29 - ConflictingAuthority**: Cannot specify both an update authority and collection on an asset _(Hex: `0x1d`)_
- **30 - InvalidLogWrapperProgram**: Invalid Log Wrapper Program _(Hex: `0x1e`)_
- **31 - ExternalPluginAdapterNotFound**: External Plugin Adapter not found _(Hex: `0x1f`)_
- **32 - ExternalPluginAdapterAlreadyExists**: External Plugin Adapter already exists _(Hex: `0x20`)_
- **33 - MissingAsset**: Missing asset needed for extra account PDA derivation _(Hex: `0x21`)_
- **34 - MissingExternalPluginAdapterAccount**: Missing account needed for external plugin adapter _(Hex: `0x22`)_
- **35 - OracleCanRejectOnly**: Oracle external plugin adapter can only be configured to reject _(Hex: `0x23`)_
- **36 - RequiresLifecycleCheck**: External plugin adapter must have at least one lifecycle check _(Hex: `0x24`)_
- **37 - DuplicateLifecycleChecks**: Duplicate lifecycle checks were provided for external plugin adapter _(Hex: `0x25`)_
- **38 - InvalidOracleAccountData**: Could not read from oracle account _(Hex: `0x26`)_
- **39 - UninitializedOracleAccount**: Oracle account is uninitialized _(Hex: `0x27`)_
- **40 - MissingSigner**: Missing required signer for operation _(Hex: `0x28`)_
- **41 - InvalidPluginOperation**: Invalid plugin operation _(Hex: `0x29`)_
- **42 - CollectionMustBeEmpty**: Collection must be empty to be burned _(Hex: `0x2a`)_
- **43 - TwoDataSources**: Two data sources provided, only one is allowed _(Hex: `0x2b`)_
- **44 - UnsupportedOperation**: External Plugin does not support this operation _(Hex: `0x2c`)_
- **45 - NoDataSources**: No data sources provided, one is required _(Hex: `0x2d`)_
- **46 - InvalidPluginAdapterTarget**: This plugin adapter cannot be added to an Asset _(Hex: `0x2e`)_
- **47 - CannotAddDataSection**: Cannot add a Data Section without a linked external plugin _(Hex: `0x2f`)_
- **48 - PermanentDelegatesPreventMove**: Cannot move asset to collection with permanent delegates _(Hex: `0x30`)_
- **49 - InvalidExecutePda**: Invalid Signing PDA for Asset or Collection Execute _(Hex: `0x31`)_
- **50 - BlockedByBubblegumV2**: Bubblegum V2 Plugin limits other plugins _(Hex: `0x32`)_
- **51 - AgentIdentityMustSign**: Agent Identity Program must sign _(Hex: `0x33`)_
- **52 - GroupMustBeEmpty**: Group must be empty to be closed _(Hex: `0x34`)_
- **53 - DuplicateEntry**: Duplicate entry provided when adding relationships to a group _(Hex: `0x35`)_
- **54 - GroupVectorFull**: Group vector is at maximum capacity _(Hex: `0x36`)_
- **55 - GroupNestingDepthExceeded**: Group nesting depth exceeded _(Hex: `0x37`)_
- **56 - InconsistentGroupRelationship**: Bidirectional group relationship is inconsistent _(Hex: `0x38`)_
