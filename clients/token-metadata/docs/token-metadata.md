# Token Metadata Program

[![npm version](https://badge.fury.io/js/%40macalinao%2Fclients-token-metadata.svg)](https://www.npmjs.com/package/%40macalinao%2Fclients-token-metadata)

- Program ID: `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`
- TypeScript Client: [`@macalinao/clients-token-metadata`](https://www.npmjs.com/package/@macalinao/clients-token-metadata)

## Table of Contents

- [Accounts](#accounts)
  - [collectionAuthorityRecord](#collectionAuthorityRecord)
  - [metadataDelegateRecord](#metadataDelegateRecord)
  - [holderDelegateRecord](#holderDelegateRecord)
  - [edition](#edition)
  - [editionMarker](#editionMarker)
  - [editionMarkerV2](#editionMarkerV2)
  - [tokenOwnedEscrow](#tokenOwnedEscrow)
  - [masterEditionV2](#masterEditionV2)
  - [masterEditionV1](#masterEditionV1)
  - [metadata](#metadata)
  - [tokenRecord](#tokenRecord)
  - [reservationListV2](#reservationListV2)
  - [reservationListV1](#reservationListV1)
  - [useAuthorityRecord](#useAuthorityRecord)
- [Instructions](#instructions)
  - [createMetadataAccount](#createMetadataAccount)
  - [updateMetadataAccount](#updateMetadataAccount)
  - [deprecatedCreateMasterEdition](#deprecatedCreateMasterEdition)
  - [deprecatedMintNewEditionFromMasterEditionViaPrintingToken](#deprecatedMintNewEditionFromMasterEditionViaPrintingToken)
  - [updatePrimarySaleHappenedViaToken](#updatePrimarySaleHappenedViaToken)
  - [deprecatedSetReservationList](#deprecatedSetReservationList)
  - [deprecatedCreateReservationList](#deprecatedCreateReservationList)
  - [signMetadata](#signMetadata)
  - [deprecatedMintPrintingTokensViaToken](#deprecatedMintPrintingTokensViaToken)
  - [deprecatedMintPrintingTokens](#deprecatedMintPrintingTokens)
  - [createMasterEdition](#createMasterEdition)
  - [mintNewEditionFromMasterEditionViaToken](#mintNewEditionFromMasterEditionViaToken)
  - [convertMasterEditionV1ToV2](#convertMasterEditionV1ToV2)
  - [mintNewEditionFromMasterEditionViaVaultProxy](#mintNewEditionFromMasterEditionViaVaultProxy)
  - [puffMetadata](#puffMetadata)
  - [updateMetadataAccountV2](#updateMetadataAccountV2)
  - [createMetadataAccountV2](#createMetadataAccountV2)
  - [createMasterEditionV3](#createMasterEditionV3)
  - [verifyCollection](#verifyCollection)
  - [utilize](#utilize)
  - [approveUseAuthority](#approveUseAuthority)
  - [revokeUseAuthority](#revokeUseAuthority)
  - [unverifyCollection](#unverifyCollection)
  - [approveCollectionAuthority](#approveCollectionAuthority)
  - [revokeCollectionAuthority](#revokeCollectionAuthority)
  - [setAndVerifyCollection](#setAndVerifyCollection)
  - [freezeDelegatedAccount](#freezeDelegatedAccount)
  - [thawDelegatedAccount](#thawDelegatedAccount)
  - [removeCreatorVerification](#removeCreatorVerification)
  - [burnNft](#burnNft)
  - [verifySizedCollectionItem](#verifySizedCollectionItem)
  - [unverifySizedCollectionItem](#unverifySizedCollectionItem)
  - [setAndVerifySizedCollectionItem](#setAndVerifySizedCollectionItem)
  - [createMetadataAccountV3](#createMetadataAccountV3)
  - [setCollectionSize](#setCollectionSize)
  - [setTokenStandard](#setTokenStandard)
  - [bubblegumSetCollectionSize](#bubblegumSetCollectionSize)
  - [burnEditionNft](#burnEditionNft)
  - [createEscrowAccount](#createEscrowAccount)
  - [closeEscrowAccount](#closeEscrowAccount)
  - [transferOutOfEscrow](#transferOutOfEscrow)
  - [burn](#burn)
  - [create](#create)
  - [mint](#mint)
  - [delegate](#delegate)
  - [revoke](#revoke)
  - [lock](#lock)
  - [unlock](#unlock)
  - [migrate](#migrate)
  - [transfer](#transfer)
  - [update](#update)
  - [use](#use)
  - [verify](#verify)
  - [unverify](#unverify)
  - [collect](#collect)
  - [print](#print)
  - [resize](#resize)
  - [closeAccounts](#closeAccounts)
- [PDAs](#pdas)
  - [metadata](#metadata)
- [Types](#types)
  - [setCollectionSizeArgs](#setCollectionSizeArgs)
  - [createMasterEditionArgs](#createMasterEditionArgs)
  - [mintNewEditionFromMasterEditionViaTokenArgs](#mintNewEditionFromMasterEditionViaTokenArgs)
  - [transferOutOfEscrowArgs](#transferOutOfEscrowArgs)
  - [createMetadataAccountArgsV3](#createMetadataAccountArgsV3)
  - [updateMetadataAccountArgsV2](#updateMetadataAccountArgsV2)
  - [approveUseAuthorityArgs](#approveUseAuthorityArgs)
  - [utilizeArgs](#utilizeArgs)
  - [authorizationData](#authorizationData)
  - [assetData](#assetData)
  - [collection](#collection)
  - [creator](#creator)
  - [data](#data)
  - [dataV2](#dataV2)
  - [reservation](#reservation)
  - [reservationV1](#reservationV1)
  - [seedsVec](#seedsVec)
  - [proofInfo](#proofInfo)
  - [payload](#payload)
  - [uses](#uses)
  - [burnArgs](#burnArgs)
  - [delegateArgs](#delegateArgs)
  - [revokeArgs](#revokeArgs)
  - [metadataDelegateRole](#metadataDelegateRole)
  - [holderDelegateRole](#holderDelegateRole)
  - [createArgs](#createArgs)
  - [mintArgs](#mintArgs)
  - [transferArgs](#transferArgs)
  - [updateArgs](#updateArgs)
  - [collectionToggle](#collectionToggle)
  - [usesToggle](#usesToggle)
  - [collectionDetailsToggle](#collectionDetailsToggle)
  - [ruleSetToggle](#ruleSetToggle)
  - [printArgs](#printArgs)
  - [lockArgs](#lockArgs)
  - [unlockArgs](#unlockArgs)
  - [useArgs](#useArgs)
  - [verificationArgs](#verificationArgs)
  - [tokenStandard](#tokenStandard)
  - [key](#key)
  - [collectionDetails](#collectionDetails)
  - [escrowAuthority](#escrowAuthority)
  - [printSupply](#printSupply)
  - [programmableConfig](#programmableConfig)
  - [migrationType](#migrationType)
  - [tokenState](#tokenState)
  - [tokenDelegateRole](#tokenDelegateRole)
  - [authorityType](#authorityType)
  - [payloadKey](#payloadKey)
  - [payloadType](#payloadType)
  - [useMethod](#useMethod)
- [Errors](#errors)

## Accounts

### collectionAuthorityRecord

**Fields:**

| Field             | Type          | Description |
| ----------------- | ------------- | ----------- | --- |
| `key`             | [key](#key-3) |             |
| `bump`            | `u8`          |             |
| `updateAuthority` | `PublicKey`   | null        |     |

### metadataDelegateRecord

**Fields:**

| Field             | Type          | Description |
| ----------------- | ------------- | ----------- |
| `key`             | [key](#key-3) |             |
| `bump`            | `u8`          |             |
| `mint`            | `PublicKey`   |             |
| `delegate`        | `PublicKey`   |             |
| `updateAuthority` | `PublicKey`   |             |

### holderDelegateRecord

**Fields:**

| Field             | Type          | Description |
| ----------------- | ------------- | ----------- |
| `key`             | [key](#key-3) |             |
| `bump`            | `u8`          |             |
| `mint`            | `PublicKey`   |             |
| `delegate`        | `PublicKey`   |             |
| `updateAuthority` | `PublicKey`   |             |

### edition

**Fields:**

| Field     | Type          | Description |
| --------- | ------------- | ----------- |
| `key`     | [key](#key-3) |             |
| `parent`  | `PublicKey`   |             |
| `edition` | `u64`         |             |

### editionMarker

**Fields:**

| Field    | Type          | Description |
| -------- | ------------- | ----------- |
| `key`    | [key](#key-3) |             |
| `ledger` | `u8`[31]      |             |

### editionMarkerV2

**Fields:**

| Field    | Type          | Description |
| -------- | ------------- | ----------- |
| `key`    | [key](#key-3) |             |
| `ledger` | `unknown`     |             |

### tokenOwnedEscrow

**Fields:**

| Field       | Type                                  | Description |
| ----------- | ------------------------------------- | ----------- |
| `key`       | [key](#key-3)                         |             |
| `baseToken` | `PublicKey`                           |             |
| `authority` | [escrowAuthority](#escrowAuthority-3) |             |
| `bump`      | `u8`                                  |             |

### masterEditionV2

**Fields:**

| Field       | Type          | Description |
| ----------- | ------------- | ----------- | --- |
| `key`       | [key](#key-3) |             |
| `supply`    | `u64`         |             |
| `maxSupply` | `u64`         | null        |     |

### masterEditionV1

**Fields:**

| Field                              | Type          | Description |
| ---------------------------------- | ------------- | ----------- | --- |
| `key`                              | [key](#key-3) |             |
| `supply`                           | `u64`         |             |
| `maxSupply`                        | `u64`         | null        |     |
| `printingMint`                     | `PublicKey`   |             |
| `oneTimePrintingAuthorizationMint` | `PublicKey`   |             |

### metadata

**Fields:**

| Field                 | Type                                        | Description |
| --------------------- | ------------------------------------------- | ----------- | --- |
| `key`                 | [key](#key-3)                               |             |
| `updateAuthority`     | `PublicKey`                                 |             |
| `mint`                | `PublicKey`                                 |             |
| `data`                | [data](#data-3)                             |             |
| `primarySaleHappened` | `boolean`                                   |             |
| `isMutable`           | `boolean`                                   |             |
| `editionNonce`        | `u8`                                        | null        |     |
| `tokenStandard`       | [tokenStandard](#tokenStandard-3)           | null        |     |
| `collection`          | [collection](#collection-3)                 | null        |     |
| `uses`                | [uses](#uses-3)                             | null        |     |
| `collectionDetails`   | [collectionDetails](#collectionDetails-3)   | null        |     |
| `programmableConfig`  | [programmableConfig](#programmableConfig-3) | null        |     |

### tokenRecord

**Fields:**

| Field             | Type                                      | Description |
| ----------------- | ----------------------------------------- | ----------- | --- |
| `key`             | [key](#key-3)                             |             |
| `bump`            | `u8`                                      |             |
| `state`           | [tokenState](#tokenState-3)               |             |
| `ruleSetRevision` | `u64`                                     | null        |     |
| `delegate`        | `PublicKey`                               | null        |     |
| `delegateRole`    | [tokenDelegateRole](#tokenDelegateRole-3) | null        |     |
| `lockedTransfer`  | `PublicKey`                               | null        |     |

### reservationListV2

**Fields:**

| Field                     | Type                            | Description |
| ------------------------- | ------------------------------- | ----------- | --- |
| `key`                     | [key](#key-3)                   |             |
| `masterEdition`           | `PublicKey`                     |             |
| `supplySnapshot`          | `u64`                           | null        |     |
| `reservations`            | [reservation](#reservation-3)[] |             |
| `totalReservationSpots`   | `u64`                           |             |
| `currentReservationSpots` | `u64`                           |             |

### reservationListV1

**Fields:**

| Field            | Type                                | Description |
| ---------------- | ----------------------------------- | ----------- | --- |
| `key`            | [key](#key-3)                       |             |
| `masterEdition`  | `PublicKey`                         |             |
| `supplySnapshot` | `u64`                               | null        |     |
| `reservations`   | [reservationV1](#reservationV1-3)[] |             |

### useAuthorityRecord

**Fields:**

| Field         | Type          | Description |
| ------------- | ------------- | ----------- |
| `key`         | [key](#key-3) |             |
| `allowedUses` | `u64`         |             |
| `bump`        | `u8`          |             |

## Instructions

### createMetadataAccount

**Accounts:**

| Account           | Type             | Description                                             |
| ----------------- | ---------------- | ------------------------------------------------------- |
| `metadata`        | writable         | Metadata key (pda of ['metadata', program id, mint id]) |
| `mint`            | readonly         | Mint of token asset                                     |
| `mintAuthority`   | signer           | Mint authority                                          |
| `payer`           | signer, writable | payer                                                   |
| `updateAuthority` | readonly         | update authority info                                   |
| `systemProgram`   | readonly         | System program                                          |
| `rent`            | readonly         | Rent info                                               |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### updateMetadataAccount

**Accounts:**

| Account           | Type     | Description          |
| ----------------- | -------- | -------------------- |
| `metadata`        | writable | Metadata account     |
| `updateAuthority` | signer   | Update authority key |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### deprecatedCreateMasterEdition

**Accounts:**

| Account                                     | Type     | Description                                                                                                                                                                                                                                                         |
| ------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `edition`                                   | writable | Unallocated edition V1 account with address as pda of ['metadata', program id, mint, 'edition']                                                                                                                                                                     |
| `mint`                                      | writable | Metadata mint                                                                                                                                                                                                                                                       |
| `printingMint`                              | writable | Printing mint - A mint you control that can mint tokens that can be exchanged for limited editions of your master edition via the MintNewEditionFromMasterEditionViaToken endpoint                                                                                  |
| `oneTimePrintingAuthorizationMint`          | writable | One time authorization printing mint - A mint you control that prints tokens that gives the bearer permission to mint any number of tokens from the printing mint one time via an endpoint with the token-metadata program for your metadata. Also burns the token. |
| `updateAuthority`                           | signer   | Current Update authority key                                                                                                                                                                                                                                        |
| `printingMintAuthority`                     | signer   | Printing mint authority - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY.                                                                                                                                                                                          |
| `mintAuthority`                             | signer   | Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY                                                                                                                                                                             |
| `metadata`                                  | readonly | Metadata account                                                                                                                                                                                                                                                    |
| `payer`                                     | signer   | payer                                                                                                                                                                                                                                                               |
| `tokenProgram`                              | readonly | Token program                                                                                                                                                                                                                                                       |
| `systemProgram`                             | readonly | System program                                                                                                                                                                                                                                                      |
| `rent`                                      | readonly | Rent info                                                                                                                                                                                                                                                           |
| `oneTimePrintingAuthorizationMintAuthority` | signer   | One time authorization printing mint authority - must be provided if using max supply. THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY.                                                                                                                             |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### deprecatedMintNewEditionFromMasterEditionViaPrintingToken

**Accounts:**

| Account                 | Type               | Description                                                                                                                         |
| ----------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `metadata`              | writable           | New Metadata key (pda of ['metadata', program id, mint id])                                                                         |
| `edition`               | writable           | New Edition V1 (pda of ['metadata', program id, mint id, 'edition'])                                                                |
| `masterEdition`         | writable           | Master Record Edition V1 (pda of ['metadata', program id, master metadata mint id, 'edition'])                                      |
| `mint`                  | writable           | Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY                                                                 |
| `mintAuthority`         | signer             | Mint authority of new mint                                                                                                          |
| `printingMint`          | writable           | Printing Mint of master record edition                                                                                              |
| `masterTokenAccount`    | writable           | Token account containing Printing mint token to be transferred                                                                      |
| `editionMarker`         | writable           | Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master mint id, edition_number]) |
| `burnAuthority`         | signer             | Burn authority for this token                                                                                                       |
| `payer`                 | signer             | payer                                                                                                                               |
| `masterUpdateAuthority` | readonly           | update authority info for new metadata account                                                                                      |
| `masterMetadata`        | readonly           | Master record metadata account                                                                                                      |
| `tokenProgram`          | readonly           | Token program                                                                                                                       |
| `systemProgram`         | readonly           | System program                                                                                                                      |
| `rent`                  | readonly           | Rent info                                                                                                                           |
| `reservationList`       | writable, optional | Reservation List - If present, and you are on this list, you can get an edition number given by your position on the list.          |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### updatePrimarySaleHappenedViaToken

**Accounts:**

| Account    | Type     | Description                                             |
| ---------- | -------- | ------------------------------------------------------- |
| `metadata` | writable | Metadata key (pda of ['metadata', program id, mint id]) |
| `owner`    | signer   | Owner on the token account                              |
| `token`    | readonly | Account containing tokens from the metadata's mint      |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### deprecatedSetReservationList

**Accounts:**

| Account           | Type     | Description                                                                                          |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `masterEdition`   | writable | Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])                          |
| `reservationList` | writable | PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key] |
| `resource`        | signer   | The resource you tied the reservation list too                                                       |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### deprecatedCreateReservationList

**Accounts:**

| Account           | Type     | Description                                                                                                                                                                                                       |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reservationList` | writable | PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key]                                                                                                              |
| `payer`           | signer   | Payer                                                                                                                                                                                                             |
| `updateAuthority` | signer   | Update authority                                                                                                                                                                                                  |
| `masterEdition`   | readonly | Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])                                                                                                                                       |
| `resource`        | readonly | A resource you wish to tie the reservation list to. This is so your later visitors who come to redeem can derive your reservation list PDA with something they can easily get at. You choose what this should be. |
| `metadata`        | readonly | Metadata key (pda of ['metadata', program id, mint id])                                                                                                                                                           |
| `systemProgram`   | readonly | System program                                                                                                                                                                                                    |
| `rent`            | readonly | Rent info                                                                                                                                                                                                         |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### signMetadata

**Accounts:**

| Account    | Type     | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `metadata` | writable | Metadata (pda of ['metadata', program id, mint id]) |
| `creator`  | signer   | Creator                                             |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### deprecatedMintPrintingTokensViaToken

**Accounts:**

| Account                            | Type     | Description                                                                 |
| ---------------------------------- | -------- | --------------------------------------------------------------------------- |
| `destination`                      | writable | Destination account                                                         |
| `token`                            | writable | Token account containing one time authorization token                       |
| `oneTimePrintingAuthorizationMint` | writable | One time authorization mint                                                 |
| `printingMint`                     | writable | Printing mint                                                               |
| `burnAuthority`                    | signer   | Burn authority                                                              |
| `metadata`                         | readonly | Metadata key (pda of ['metadata', program id, mint id])                     |
| `masterEdition`                    | readonly | Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) |
| `tokenProgram`                     | readonly | Token program                                                               |
| `rent`                             | readonly | Rent                                                                        |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### deprecatedMintPrintingTokens

**Accounts:**

| Account           | Type     | Description                                                                 |
| ----------------- | -------- | --------------------------------------------------------------------------- |
| `destination`     | writable | Destination account                                                         |
| `printingMint`    | writable | Printing mint                                                               |
| `updateAuthority` | signer   | Update authority                                                            |
| `metadata`        | readonly | Metadata key (pda of ['metadata', program id, mint id])                     |
| `masterEdition`   | readonly | Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) |
| `tokenProgram`    | readonly | Token program                                                               |
| `rent`            | readonly | Rent                                                                        |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### createMasterEdition

**Accounts:**

| Account           | Type             | Description                                                                                     |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `edition`         | writable         | Unallocated edition V2 account with address as pda of ['metadata', program id, mint, 'edition'] |
| `mint`            | writable         | Metadata mint                                                                                   |
| `updateAuthority` | signer           | Update authority                                                                                |
| `mintAuthority`   | signer           | Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY         |
| `payer`           | signer, writable | payer                                                                                           |
| `metadata`        | readonly         | Metadata account                                                                                |
| `tokenProgram`    | readonly         | Token program                                                                                   |
| `systemProgram`   | readonly         | System program                                                                                  |
| `rent`            | readonly         | Rent info                                                                                       |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### mintNewEditionFromMasterEditionViaToken

**Accounts:**

| Account                      | Type             | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `newMetadata`                | writable         | New Metadata key (pda of ['metadata', program id, mint id])                                                                                                                                                                                                                                   |
| `newEdition`                 | writable         | New Edition (pda of ['metadata', program id, mint id, 'edition'])                                                                                                                                                                                                                             |
| `masterEdition`              | writable         | Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition'])                                                                                                                                                                                                |
| `newMint`                    | writable         | Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY                                                                                                                                                                                                                           |
| `editionMarkPda`             | writable         | Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE). |
| `newMintAuthority`           | signer           | Mint authority of new mint                                                                                                                                                                                                                                                                    |
| `payer`                      | signer, writable | payer                                                                                                                                                                                                                                                                                         |
| `tokenAccountOwner`          | signer           | owner of token account containing master token (#8)                                                                                                                                                                                                                                           |
| `tokenAccount`               | readonly         | token account containing token from master metadata mint                                                                                                                                                                                                                                      |
| `newMetadataUpdateAuthority` | readonly         | Update authority info for new metadata                                                                                                                                                                                                                                                        |
| `metadata`                   | readonly         | Master record metadata account                                                                                                                                                                                                                                                                |
| `tokenProgram`               | readonly         | Token program                                                                                                                                                                                                                                                                                 |
| `systemProgram`              | readonly         | System program                                                                                                                                                                                                                                                                                |
| `rent`                       | optional         | Rent info                                                                                                                                                                                                                                                                                     |

**Arguments:**

| Argument                                      | Type                                                                                          | Description |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------- |
| `discriminator`                               | `u8`                                                                                          |             |
| `mintNewEditionFromMasterEditionViaTokenArgs` | [mintNewEditionFromMasterEditionViaTokenArgs](#mintNewEditionFromMasterEditionViaTokenArgs-3) |             |

### convertMasterEditionV1ToV2

**Accounts:**

| Account         | Type     | Description                                                                                    |
| --------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `masterEdition` | writable | Master Record Edition V1 (pda of ['metadata', program id, master metadata mint id, 'edition']) |
| `oneTimeAuth`   | writable | One time authorization mint                                                                    |
| `printingMint`  | writable | Printing mint                                                                                  |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### mintNewEditionFromMasterEditionViaVaultProxy

**Accounts:**

| Account                      | Type             | Description                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `newMetadata`                | writable         | New Metadata key (pda of ['metadata', program id, mint id])                                                                                                                                                                                                                                   |
| `newEdition`                 | writable         | New Edition (pda of ['metadata', program id, mint id, 'edition'])                                                                                                                                                                                                                             |
| `masterEdition`              | writable         | Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition']                                                                                                                                                                                                 |
| `newMint`                    | writable         | Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY                                                                                                                                                                                                                           |
| `editionMarkPda`             | writable         | Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE). |
| `newMintAuthority`           | signer           | Mint authority of new mint                                                                                                                                                                                                                                                                    |
| `payer`                      | signer, writable | payer                                                                                                                                                                                                                                                                                         |
| `vaultAuthority`             | signer           | Vault authority                                                                                                                                                                                                                                                                               |
| `safetyDepositStore`         | readonly         | Safety deposit token store account                                                                                                                                                                                                                                                            |
| `safetyDepositBox`           | readonly         | Safety deposit box                                                                                                                                                                                                                                                                            |
| `vault`                      | readonly         | Vault                                                                                                                                                                                                                                                                                         |
| `newMetadataUpdateAuthority` | readonly         | Update authority info for new metadata                                                                                                                                                                                                                                                        |
| `metadata`                   | readonly         | Master record metadata account                                                                                                                                                                                                                                                                |
| `tokenProgram`               | readonly         | Token program                                                                                                                                                                                                                                                                                 |
| `tokenVaultProgram`          | readonly         | Token vault program                                                                                                                                                                                                                                                                           |
| `systemProgram`              | readonly         | System program                                                                                                                                                                                                                                                                                |
| `rent`                       | optional         | Rent info                                                                                                                                                                                                                                                                                     |

**Arguments:**

| Argument                                      | Type                                                                                          | Description |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------- |
| `discriminator`                               | `u8`                                                                                          |             |
| `mintNewEditionFromMasterEditionViaTokenArgs` | [mintNewEditionFromMasterEditionViaTokenArgs](#mintNewEditionFromMasterEditionViaTokenArgs-3) |             |

### puffMetadata

**Accounts:**

| Account    | Type     | Description      |
| ---------- | -------- | ---------------- |
| `metadata` | writable | Metadata account |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### updateMetadataAccountV2

**Accounts:**

| Account           | Type     | Description          |
| ----------------- | -------- | -------------------- |
| `metadata`        | writable | Metadata account     |
| `updateAuthority` | signer   | Update authority key |

**Arguments:**

| Argument                      | Type                                                          | Description |
| ----------------------------- | ------------------------------------------------------------- | ----------- |
| `discriminator`               | `u8`                                                          |             |
| `updateMetadataAccountArgsV2` | [updateMetadataAccountArgsV2](#updateMetadataAccountArgsV2-3) |             |

### createMetadataAccountV2

**Accounts:**

| Account           | Type             | Description                                             |
| ----------------- | ---------------- | ------------------------------------------------------- |
| `metadata`        | writable         | Metadata key (pda of ['metadata', program id, mint id]) |
| `mint`            | readonly         | Mint of token asset                                     |
| `mintAuthority`   | signer           | Mint authority                                          |
| `payer`           | signer, writable | payer                                                   |
| `updateAuthority` | readonly         | update authority info                                   |
| `systemProgram`   | readonly         | System program                                          |
| `rent`            | optional         | Rent info                                               |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### createMasterEditionV3

**Accounts:**

| Account           | Type             | Description                                                                                     |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `edition`         | writable         | Unallocated edition V2 account with address as pda of ['metadata', program id, mint, 'edition'] |
| `mint`            | writable         | Metadata mint                                                                                   |
| `updateAuthority` | signer           | Update authority                                                                                |
| `mintAuthority`   | signer           | Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY         |
| `payer`           | signer, writable | payer                                                                                           |
| `metadata`        | writable         | Metadata account                                                                                |
| `tokenProgram`    | readonly         | Token program                                                                                   |
| `systemProgram`   | readonly         | System program                                                                                  |
| `rent`            | optional         | Rent info                                                                                       |

**Arguments:**

| Argument                  | Type                                                  | Description |
| ------------------------- | ----------------------------------------------------- | ----------- |
| `discriminator`           | `u8`                                                  |             |
| `createMasterEditionArgs` | [createMasterEditionArgs](#createMasterEditionArgs-3) |             |

### verifyCollection

**Accounts:**

| Account                          | Type             | Description                                    |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| `metadata`                       | writable         | Metadata account                               |
| `collectionAuthority`            | signer, writable | Collection Update authority                    |
| `payer`                          | signer, writable | payer                                          |
| `collectionMint`                 | readonly         | Mint of the Collection                         |
| `collection`                     | readonly         | Metadata Account of the Collection             |
| `collectionMasterEditionAccount` | readonly         | MasterEdition2 Account of the Collection Token |
| `collectionAuthorityRecord`      | optional         | Collection Authority Record PDA                |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### utilize

**Accounts:**

| Account              | Type               | Description                                                                       |
| -------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `metadata`           | writable           | Metadata account                                                                  |
| `tokenAccount`       | writable           | Token Account Of NFT                                                              |
| `mint`               | writable           | Mint of the Metadata                                                              |
| `useAuthority`       | signer, writable   | A Use Authority / Can be the current Owner of the NFT                             |
| `owner`              | readonly           | Owner                                                                             |
| `tokenProgram`       | readonly           | Token program                                                                     |
| `ataProgram`         | readonly           | Associated Token program                                                          |
| `systemProgram`      | readonly           | System program                                                                    |
| `rent`               | readonly           | Rent info                                                                         |
| `useAuthorityRecord` | writable, optional | Use Authority Record PDA If present the program Assumes a delegated use authority |
| `burner`             | optional           | Program As Signer (Burner)                                                        |

**Arguments:**

| Argument        | Type                          | Description |
| --------------- | ----------------------------- | ----------- |
| `discriminator` | `u8`                          |             |
| `utilizeArgs`   | [utilizeArgs](#utilizeArgs-3) |             |

### approveUseAuthority

**Accounts:**

| Account              | Type             | Description                 |
| -------------------- | ---------------- | --------------------------- |
| `useAuthorityRecord` | writable         | Use Authority Record PDA    |
| `owner`              | signer, writable | Owner                       |
| `payer`              | signer, writable | Payer                       |
| `user`               | readonly         | A Use Authority             |
| `ownerTokenAccount`  | writable         | Owned Token Account Of Mint |
| `metadata`           | readonly         | Metadata account            |
| `mint`               | readonly         | Mint of Metadata            |
| `burner`             | readonly         | Program As Signer (Burner)  |
| `tokenProgram`       | readonly         | Token program               |
| `systemProgram`      | readonly         | System program              |
| `rent`               | optional         | Rent info                   |

**Arguments:**

| Argument                  | Type                                                  | Description |
| ------------------------- | ----------------------------------------------------- | ----------- |
| `discriminator`           | `u8`                                                  |             |
| `approveUseAuthorityArgs` | [approveUseAuthorityArgs](#approveUseAuthorityArgs-3) |             |

### revokeUseAuthority

**Accounts:**

| Account              | Type             | Description                 |
| -------------------- | ---------------- | --------------------------- |
| `useAuthorityRecord` | writable         | Use Authority Record PDA    |
| `owner`              | signer, writable | Owner                       |
| `user`               | readonly         | A Use Authority             |
| `ownerTokenAccount`  | writable         | Owned Token Account Of Mint |
| `mint`               | readonly         | Mint of Metadata            |
| `metadata`           | readonly         | Metadata account            |
| `tokenProgram`       | readonly         | Token program               |
| `systemProgram`      | readonly         | System program              |
| `rent`               | optional         | Rent info                   |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### unverifyCollection

**Accounts:**

| Account                          | Type             | Description                                    |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| `metadata`                       | writable         | Metadata account                               |
| `collectionAuthority`            | signer, writable | Collection Authority                           |
| `collectionMint`                 | readonly         | Mint of the Collection                         |
| `collection`                     | readonly         | Metadata Account of the Collection             |
| `collectionMasterEditionAccount` | readonly         | MasterEdition2 Account of the Collection Token |
| `collectionAuthorityRecord`      | optional         | Collection Authority Record PDA                |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### approveCollectionAuthority

**Accounts:**

| Account                     | Type             | Description                        |
| --------------------------- | ---------------- | ---------------------------------- |
| `collectionAuthorityRecord` | writable         | Collection Authority Record PDA    |
| `newCollectionAuthority`    | readonly         | A Collection Authority             |
| `updateAuthority`           | signer, writable | Update Authority of Collection NFT |
| `payer`                     | signer, writable | Payer                              |
| `metadata`                  | readonly         | Collection Metadata account        |
| `mint`                      | readonly         | Mint of Collection Metadata        |
| `systemProgram`             | readonly         | System program                     |
| `rent`                      | optional         | Rent info                          |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### revokeCollectionAuthority

**Accounts:**

| Account                     | Type             | Description                                                 |
| --------------------------- | ---------------- | ----------------------------------------------------------- |
| `collectionAuthorityRecord` | writable         | Collection Authority Record PDA                             |
| `delegateAuthority`         | writable         | Delegated Collection Authority                              |
| `revokeAuthority`           | signer, writable | Update Authority, or Delegated Authority, of Collection NFT |
| `metadata`                  | readonly         | Metadata account                                            |
| `mint`                      | readonly         | Mint of Metadata                                            |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### setAndVerifyCollection

**Accounts:**

| Account                          | Type             | Description                                    |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| `metadata`                       | writable         | Metadata account                               |
| `collectionAuthority`            | signer, writable | Collection Update authority                    |
| `payer`                          | signer, writable | Payer                                          |
| `updateAuthority`                | readonly         | Update Authority of Collection NFT and NFT     |
| `collectionMint`                 | readonly         | Mint of the Collection                         |
| `collection`                     | readonly         | Metadata Account of the Collection             |
| `collectionMasterEditionAccount` | readonly         | MasterEdition2 Account of the Collection Token |
| `collectionAuthorityRecord`      | optional         | Collection Authority Record PDA                |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### freezeDelegatedAccount

**Accounts:**

| Account        | Type             | Description             |
| -------------- | ---------------- | ----------------------- |
| `delegate`     | signer, writable | Delegate                |
| `tokenAccount` | writable         | Token account to freeze |
| `edition`      | readonly         | Edition                 |
| `mint`         | readonly         | Token mint              |
| `tokenProgram` | readonly         | Token Program           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### thawDelegatedAccount

**Accounts:**

| Account        | Type             | Description           |
| -------------- | ---------------- | --------------------- |
| `delegate`     | signer, writable | Delegate              |
| `tokenAccount` | writable         | Token account to thaw |
| `edition`      | readonly         | Edition               |
| `mint`         | readonly         | Token mint            |
| `tokenProgram` | readonly         | Token Program         |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### removeCreatorVerification

**Accounts:**

| Account    | Type     | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `metadata` | writable | Metadata (pda of ['metadata', program id, mint id]) |
| `creator`  | signer   | Creator                                             |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### burnNft

**Accounts:**

| Account                | Type               | Description                                         |
| ---------------------- | ------------------ | --------------------------------------------------- |
| `metadata`             | writable           | Metadata (pda of ['metadata', program id, mint id]) |
| `owner`                | signer, writable   | NFT owner                                           |
| `mint`                 | writable           | Mint of the NFT                                     |
| `tokenAccount`         | writable           | Token account to close                              |
| `masterEditionAccount` | writable           | MasterEdition2 of the NFT                           |
| `splTokenProgram`      | readonly           | SPL Token Program                                   |
| `collectionMetadata`   | writable, optional | Metadata of the Collection                          |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### verifySizedCollectionItem

**Accounts:**

| Account                          | Type             | Description                                    |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| `metadata`                       | writable         | Metadata account                               |
| `collectionAuthority`            | signer           | Collection Update authority                    |
| `payer`                          | signer, writable | payer                                          |
| `collectionMint`                 | readonly         | Mint of the Collection                         |
| `collection`                     | writable         | Metadata Account of the Collection             |
| `collectionMasterEditionAccount` | readonly         | MasterEdition2 Account of the Collection Token |
| `collectionAuthorityRecord`      | optional         | Collection Authority Record PDA                |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### unverifySizedCollectionItem

**Accounts:**

| Account                          | Type             | Description                                    |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| `metadata`                       | writable         | Metadata account                               |
| `collectionAuthority`            | signer           | Collection Authority                           |
| `payer`                          | signer, writable | payer                                          |
| `collectionMint`                 | readonly         | Mint of the Collection                         |
| `collection`                     | writable         | Metadata Account of the Collection             |
| `collectionMasterEditionAccount` | readonly         | MasterEdition2 Account of the Collection Token |
| `collectionAuthorityRecord`      | optional         | Collection Authority Record PDA                |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### setAndVerifySizedCollectionItem

**Accounts:**

| Account                          | Type             | Description                                    |
| -------------------------------- | ---------------- | ---------------------------------------------- |
| `metadata`                       | writable         | Metadata account                               |
| `collectionAuthority`            | signer           | Collection Update authority                    |
| `payer`                          | signer, writable | payer                                          |
| `updateAuthority`                | readonly         | Update Authority of Collection NFT and NFT     |
| `collectionMint`                 | readonly         | Mint of the Collection                         |
| `collection`                     | writable         | Metadata Account of the Collection             |
| `collectionMasterEditionAccount` | readonly         | MasterEdition2 Account of the Collection Token |
| `collectionAuthorityRecord`      | optional         | Collection Authority Record PDA                |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### createMetadataAccountV3

**Accounts:**

| Account           | Type             | Description                                             |
| ----------------- | ---------------- | ------------------------------------------------------- |
| `metadata`        | writable         | Metadata key (pda of ['metadata', program id, mint id]) |
| `mint`            | readonly         | Mint of token asset                                     |
| `mintAuthority`   | signer           | Mint authority                                          |
| `payer`           | signer, writable | payer                                                   |
| `updateAuthority` | signer           | update authority info                                   |
| `systemProgram`   | readonly         | System program                                          |
| `rent`            | optional         | Rent info                                               |

**Arguments:**

| Argument                      | Type                                                          | Description |
| ----------------------------- | ------------------------------------------------------------- | ----------- |
| `discriminator`               | `u8`                                                          |             |
| `createMetadataAccountArgsV3` | [createMetadataAccountArgsV3](#createMetadataAccountArgsV3-3) |             |

### setCollectionSize

**Accounts:**

| Account                     | Type             | Description                     |
| --------------------------- | ---------------- | ------------------------------- |
| `collectionMetadata`        | writable         | Collection Metadata account     |
| `collectionAuthority`       | signer, writable | Collection Update authority     |
| `collectionMint`            | readonly         | Mint of the Collection          |
| `collectionAuthorityRecord` | optional         | Collection Authority Record PDA |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- |
| `discriminator`         | `u8`                                              |             |
| `setCollectionSizeArgs` | [setCollectionSizeArgs](#setCollectionSizeArgs-3) |             |

### setTokenStandard

**Accounts:**

| Account           | Type     | Description               |
| ----------------- | -------- | ------------------------- |
| `metadata`        | writable | Metadata account          |
| `updateAuthority` | signer   | Metadata update authority |
| `mint`            | readonly | Mint account              |
| `edition`         | optional | Edition account           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### bubblegumSetCollectionSize

**Accounts:**

| Account                     | Type     | Description                      |
| --------------------------- | -------- | -------------------------------- |
| `collectionMetadata`        | writable | Collection Metadata account      |
| `collectionAuthority`       | signer   | Collection Update authority      |
| `collectionMint`            | readonly | Mint of the Collection           |
| `bubblegumSigner`           | signer   | Signing PDA of Bubblegum program |
| `collectionAuthorityRecord` | optional | Collection Authority Record PDA  |

**Arguments:**

| Argument                | Type                                              | Description |
| ----------------------- | ------------------------------------------------- | ----------- |
| `discriminator`         | `u8`                                              |             |
| `setCollectionSizeArgs` | [setCollectionSizeArgs](#setCollectionSizeArgs-3) |             |

### burnEditionNft

**Accounts:**

| Account                     | Type             | Description                                         |
| --------------------------- | ---------------- | --------------------------------------------------- |
| `metadata`                  | writable         | Metadata (pda of ['metadata', program id, mint id]) |
| `owner`                     | signer, writable | NFT owner                                           |
| `printEditionMint`          | writable         | Mint of the print edition NFT                       |
| `masterEditionMint`         | readonly         | Mint of the original/master NFT                     |
| `printEditionTokenAccount`  | writable         | Token account the print edition NFT is in           |
| `masterEditionTokenAccount` | readonly         | Token account the Master Edition NFT is in          |
| `masterEditionAccount`      | writable         | MasterEdition2 of the original NFT                  |
| `printEditionAccount`       | writable         | Print Edition account of the NFT                    |
| `editionMarkerAccount`      | writable         | Edition Marker PDA of the NFT                       |
| `splTokenProgram`           | readonly         | SPL Token Program                                   |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### createEscrowAccount

**Accounts:**

| Account              | Type             | Description                                       |
| -------------------- | ---------------- | ------------------------------------------------- |
| `escrow`             | writable         | Escrow account                                    |
| `metadata`           | writable         | Metadata account                                  |
| `mint`               | readonly         | Mint account                                      |
| `tokenAccount`       | readonly         | Token account of the token                        |
| `edition`            | readonly         | Edition account                                   |
| `payer`              | signer, writable | Wallet paying for the transaction and new account |
| `systemProgram`      | readonly         | System program                                    |
| `sysvarInstructions` | readonly         | Instructions sysvar account                       |
| `authority`          | signer, optional | Authority/creator of the escrow account           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### closeEscrowAccount

**Accounts:**

| Account              | Type             | Description                                       |
| -------------------- | ---------------- | ------------------------------------------------- |
| `escrow`             | writable         | Escrow account                                    |
| `metadata`           | writable         | Metadata account                                  |
| `mint`               | readonly         | Mint account                                      |
| `tokenAccount`       | readonly         | Token account                                     |
| `edition`            | readonly         | Edition account                                   |
| `payer`              | signer, writable | Wallet paying for the transaction and new account |
| `systemProgram`      | readonly         | System program                                    |
| `sysvarInstructions` | readonly         | Instructions sysvar account                       |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### transferOutOfEscrow

**Accounts:**

| Account              | Type             | Description                                                   |
| -------------------- | ---------------- | ------------------------------------------------------------- |
| `escrow`             | readonly         | Escrow account                                                |
| `metadata`           | writable         | Metadata account                                              |
| `payer`              | signer, writable | Wallet paying for the transaction and new account             |
| `attributeMint`      | readonly         | Mint account for the new attribute                            |
| `attributeSrc`       | writable         | Token account source for the new attribute                    |
| `attributeDst`       | writable         | Token account, owned by TM, destination for the new attribute |
| `escrowMint`         | readonly         | Mint account that the escrow is attached                      |
| `escrowAccount`      | readonly         | Token account that holds the token the escrow is attached to  |
| `systemProgram`      | readonly         | System program                                                |
| `ataProgram`         | readonly         | Associated Token program                                      |
| `tokenProgram`       | readonly         | Token program                                                 |
| `sysvarInstructions` | readonly         | Instructions sysvar account                                   |
| `authority`          | signer, optional | Authority/creator of the escrow account                       |

**Arguments:**

| Argument                  | Type                                                  | Description |
| ------------------------- | ----------------------------------------------------- | ----------- |
| `discriminator`           | `u8`                                                  |             |
| `transferOutOfEscrowArgs` | [transferOutOfEscrowArgs](#transferOutOfEscrowArgs-3) |             |

### burn

**Accounts:**

| Account              | Type               | Description                                         |
| -------------------- | ------------------ | --------------------------------------------------- |
| `authority`          | signer, writable   | Asset owner or Utility delegate                     |
| `collectionMetadata` | writable, optional | Metadata of the Collection                          |
| `metadata`           | writable           | Metadata (pda of ['metadata', program id, mint id]) |
| `edition`            | writable, optional | Edition of the asset                                |
| `mint`               | writable           | Mint of token asset                                 |
| `token`              | writable           | Token account to close                              |
| `masterEdition`      | writable, optional | Master edition account                              |
| `masterEditionMint`  | optional           | Master edition mint of the asset                    |
| `masterEditionToken` | optional           | Master edition token account                        |
| `editionMarker`      | writable, optional | Edition marker account                              |
| `tokenRecord`        | writable, optional | Token record account                                |
| `systemProgram`      | readonly           | System program                                      |
| `sysvarInstructions` | readonly           | Instructions sysvar account                         |
| `splTokenProgram`    | readonly           | SPL Token Program                                   |

**Arguments:**

| Argument        | Type                    | Description |
| --------------- | ----------------------- | ----------- |
| `discriminator` | `u8`                    |             |
| `burnArgs`      | [burnArgs](#burnArgs-3) |             |

### create

**Accounts:**

| Account              | Type               | Description                                                                                  |
| -------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `metadata`           | writable           | Unallocated metadata account with address as pda of ['metadata', program id, mint id]        |
| `masterEdition`      | writable, optional | Unallocated edition account with address as pda of ['metadata', program id, mint, 'edition'] |
| `mint`               | writable           | Mint of token asset                                                                          |
| `authority`          | signer             | Mint authority                                                                               |
| `payer`              | signer, writable   | Payer                                                                                        |
| `updateAuthority`    | readonly           | Update authority for the metadata account                                                    |
| `systemProgram`      | readonly           | System program                                                                               |
| `sysvarInstructions` | readonly           | Instructions sysvar account                                                                  |
| `splTokenProgram`    | optional           | SPL Token program                                                                            |

**Arguments:**

| Argument        | Type                        | Description |
| --------------- | --------------------------- | ----------- |
| `discriminator` | `u8`                        |             |
| `createArgs`    | [createArgs](#createArgs-3) |             |

### mint

**Accounts:**

| Account                     | Type               | Description                                                 |
| --------------------------- | ------------------ | ----------------------------------------------------------- |
| `token`                     | writable           | Token or Associated Token account                           |
| `tokenOwner`                | optional           | Owner of the token account                                  |
| `metadata`                  | readonly           | Metadata account (pda of ['metadata', program id, mint id]) |
| `masterEdition`             | writable, optional | Master Edition account                                      |
| `tokenRecord`               | writable, optional | Token record account                                        |
| `mint`                      | writable           | Mint of token asset                                         |
| `authority`                 | signer             | (Mint or Update) authority                                  |
| `delegateRecord`            | optional           | Metadata delegate record                                    |
| `payer`                     | signer, writable   | Payer                                                       |
| `systemProgram`             | readonly           | System program                                              |
| `sysvarInstructions`        | readonly           | Instructions sysvar account                                 |
| `splTokenProgram`           | readonly           | SPL Token program                                           |
| `splAtaProgram`             | readonly           | SPL Associated Token Account program                        |
| `authorizationRulesProgram` | optional           | Token Authorization Rules program                           |
| `authorizationRules`        | optional           | Token Authorization Rules account                           |

**Arguments:**

| Argument        | Type                    | Description |
| --------------- | ----------------------- | ----------- |
| `discriminator` | `u8`                    |             |
| `mintArgs`      | [mintArgs](#mintArgs-3) |             |

### delegate

**Accounts:**

| Account                     | Type               | Description                       |
| --------------------------- | ------------------ | --------------------------------- |
| `delegateRecord`            | writable, optional | Delegate record account           |
| `delegate`                  | readonly           | Owner of the delegated account    |
| `metadata`                  | writable           | Metadata account                  |
| `masterEdition`             | optional           | Master Edition account            |
| `tokenRecord`               | writable, optional | Token record account              |
| `mint`                      | readonly           | Mint of metadata                  |
| `token`                     | writable, optional | Token account of mint             |
| `authority`                 | signer             | Update authority or token owner   |
| `payer`                     | signer, writable   | Payer                             |
| `systemProgram`             | readonly           | System Program                    |
| `sysvarInstructions`        | readonly           | Instructions sysvar account       |
| `splTokenProgram`           | optional           | SPL Token Program                 |
| `authorizationRulesProgram` | optional           | Token Authorization Rules Program |
| `authorizationRules`        | optional           | Token Authorization Rules account |

**Arguments:**

| Argument        | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `discriminator` | `u8`                            |             |
| `delegateArgs`  | [delegateArgs](#delegateArgs-3) |             |

### revoke

**Accounts:**

| Account                     | Type               | Description                       |
| --------------------------- | ------------------ | --------------------------------- |
| `delegateRecord`            | writable, optional | Delegate record account           |
| `delegate`                  | readonly           | Owner of the delegated account    |
| `metadata`                  | writable           | Metadata account                  |
| `masterEdition`             | optional           | Master Edition account            |
| `tokenRecord`               | writable, optional | Token record account              |
| `mint`                      | readonly           | Mint of metadata                  |
| `token`                     | writable, optional | Token account of mint             |
| `authority`                 | signer             | Update authority or token owner   |
| `payer`                     | signer, writable   | Payer                             |
| `systemProgram`             | readonly           | System Program                    |
| `sysvarInstructions`        | readonly           | Instructions sysvar account       |
| `splTokenProgram`           | optional           | SPL Token Program                 |
| `authorizationRulesProgram` | optional           | Token Authorization Rules Program |
| `authorizationRules`        | optional           | Token Authorization Rules account |

**Arguments:**

| Argument        | Type                        | Description |
| --------------- | --------------------------- | ----------- |
| `discriminator` | `u8`                        |             |
| `revokeArgs`    | [revokeArgs](#revokeArgs-3) |             |

### lock

**Accounts:**

| Account                     | Type               | Description                       |
| --------------------------- | ------------------ | --------------------------------- |
| `authority`                 | signer             | Delegate or freeze authority      |
| `tokenOwner`                | optional           | Token owner account               |
| `token`                     | writable           | Token account                     |
| `mint`                      | readonly           | Mint account                      |
| `metadata`                  | writable           | Metadata account                  |
| `edition`                   | optional           | Edition account                   |
| `tokenRecord`               | writable, optional | Token record account              |
| `payer`                     | signer, writable   | Payer                             |
| `systemProgram`             | readonly           | System program                    |
| `sysvarInstructions`        | readonly           | System program                    |
| `splTokenProgram`           | optional           | SPL Token Program                 |
| `authorizationRulesProgram` | optional           | Token Authorization Rules Program |
| `authorizationRules`        | optional           | Token Authorization Rules account |

**Arguments:**

| Argument        | Type                    | Description |
| --------------- | ----------------------- | ----------- |
| `discriminator` | `u8`                    |             |
| `lockArgs`      | [lockArgs](#lockArgs-3) |             |

### unlock

**Accounts:**

| Account                     | Type               | Description                       |
| --------------------------- | ------------------ | --------------------------------- |
| `authority`                 | signer             | Delegate or freeze authority      |
| `tokenOwner`                | optional           | Token owner account               |
| `token`                     | writable           | Token account                     |
| `mint`                      | readonly           | Mint account                      |
| `metadata`                  | writable           | Metadata account                  |
| `edition`                   | optional           | Edition account                   |
| `tokenRecord`               | writable, optional | Token record account              |
| `payer`                     | signer, writable   | Payer                             |
| `systemProgram`             | readonly           | System program                    |
| `sysvarInstructions`        | readonly           | System program                    |
| `splTokenProgram`           | optional           | SPL Token Program                 |
| `authorizationRulesProgram` | optional           | Token Authorization Rules Program |
| `authorizationRules`        | optional           | Token Authorization Rules account |

**Arguments:**

| Argument        | Type                        | Description |
| --------------- | --------------------------- | ----------- |
| `discriminator` | `u8`                        |             |
| `unlockArgs`    | [unlockArgs](#unlockArgs-3) |             |

### migrate

**Accounts:**

| Account                     | Type             | Description                       |
| --------------------------- | ---------------- | --------------------------------- |
| `metadata`                  | writable         | Metadata account                  |
| `edition`                   | writable         | Edition account                   |
| `token`                     | writable         | Token account                     |
| `tokenOwner`                | readonly         | Token account owner               |
| `mint`                      | readonly         | Mint account                      |
| `payer`                     | signer, writable | Payer                             |
| `authority`                 | signer           | Update authority                  |
| `collectionMetadata`        | readonly         | Collection metadata account       |
| `delegateRecord`            | readonly         | Delegate record account           |
| `tokenRecord`               | writable         | Token record account              |
| `systemProgram`             | readonly         | System program                    |
| `sysvarInstructions`        | readonly         | Instruction sysvar account        |
| `splTokenProgram`           | readonly         | SPL Token Program                 |
| `authorizationRulesProgram` | optional         | Token Authorization Rules Program |
| `authorizationRules`        | optional         | Token Authorization Rules account |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### transfer

**Accounts:**

| Account                     | Type               | Description                                         |
| --------------------------- | ------------------ | --------------------------------------------------- |
| `token`                     | writable           | Token account                                       |
| `tokenOwner`                | readonly           | Token account owner                                 |
| `destination`               | writable           | Destination token account                           |
| `destinationOwner`          | readonly           | Destination token account owner                     |
| `mint`                      | readonly           | Mint of token asset                                 |
| `metadata`                  | writable           | Metadata (pda of ['metadata', program id, mint id]) |
| `edition`                   | optional           | Edition of token asset                              |
| `ownerTokenRecord`          | writable, optional | Owner token record account                          |
| `destinationTokenRecord`    | writable, optional | Destination token record account                    |
| `authority`                 | signer             | Transfer authority (token owner or delegate)        |
| `payer`                     | signer, writable   | Payer                                               |
| `systemProgram`             | readonly           | System Program                                      |
| `sysvarInstructions`        | readonly           | Instructions sysvar account                         |
| `splTokenProgram`           | readonly           | SPL Token Program                                   |
| `splAtaProgram`             | readonly           | SPL Associated Token Account program                |
| `authorizationRulesProgram` | optional           | Token Authorization Rules Program                   |
| `authorizationRules`        | optional           | Token Authorization Rules account                   |

**Arguments:**

| Argument        | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `discriminator` | `u8`                            |             |
| `transferArgs`  | [transferArgs](#transferArgs-3) |             |

### update

**Accounts:**

| Account                     | Type             | Description                       |
| --------------------------- | ---------------- | --------------------------------- |
| `authority`                 | signer           | Update authority or delegate      |
| `delegateRecord`            | optional         | Delegate record PDA               |
| `token`                     | optional         | Token account                     |
| `mint`                      | readonly         | Mint account                      |
| `metadata`                  | writable         | Metadata account                  |
| `edition`                   | optional         | Edition account                   |
| `payer`                     | signer, writable | Payer                             |
| `systemProgram`             | readonly         | System program                    |
| `sysvarInstructions`        | readonly         | Instructions sysvar account       |
| `authorizationRulesProgram` | optional         | Token Authorization Rules Program |
| `authorizationRules`        | optional         | Token Authorization Rules account |

**Arguments:**

| Argument        | Type                        | Description |
| --------------- | --------------------------- | ----------- |
| `discriminator` | `u8`                        |             |
| `updateArgs`    | [updateArgs](#updateArgs-3) |             |

### use

**Accounts:**

| Account                     | Type               | Description                       |
| --------------------------- | ------------------ | --------------------------------- |
| `authority`                 | signer             | Token owner or delegate           |
| `delegateRecord`            | writable, optional | Delegate record PDA               |
| `token`                     | writable, optional | Token account                     |
| `mint`                      | readonly           | Mint account                      |
| `metadata`                  | writable           | Metadata account                  |
| `edition`                   | writable, optional | Edition account                   |
| `payer`                     | signer             | Payer                             |
| `systemProgram`             | readonly           | System program                    |
| `sysvarInstructions`        | readonly           | System program                    |
| `splTokenProgram`           | optional           | SPL Token Program                 |
| `authorizationRulesProgram` | optional           | Token Authorization Rules Program |
| `authorizationRules`        | optional           | Token Authorization Rules account |

**Arguments:**

| Argument        | Type                  | Description |
| --------------- | --------------------- | ----------- |
| `discriminator` | `u8`                  |             |
| `useArgs`       | [useArgs](#useArgs-3) |             |

### verify

**Accounts:**

| Account                   | Type               | Description                                                |
| ------------------------- | ------------------ | ---------------------------------------------------------- |
| `authority`               | signer             | Creator to verify, collection update authority or delegate |
| `delegateRecord`          | optional           | Delegate record PDA                                        |
| `metadata`                | writable           | Metadata account                                           |
| `collectionMint`          | optional           | Mint of the Collection                                     |
| `collectionMetadata`      | writable, optional | Metadata Account of the Collection                         |
| `collectionMasterEdition` | optional           | Master Edition Account of the Collection Token             |
| `systemProgram`           | readonly           | System program                                             |
| `sysvarInstructions`      | readonly           | Instructions sysvar account                                |

**Arguments:**

| Argument           | Type                                    | Description |
| ------------------ | --------------------------------------- | ----------- |
| `discriminator`    | `u8`                                    |             |
| `verificationArgs` | [verificationArgs](#verificationArgs-3) |             |

### unverify

**Accounts:**

| Account              | Type               | Description                                                                               |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `authority`          | signer             | Creator to verify, collection (or metadata if parent burned) update authority or delegate |
| `delegateRecord`     | optional           | Delegate record PDA                                                                       |
| `metadata`           | writable           | Metadata account                                                                          |
| `collectionMint`     | optional           | Mint of the Collection                                                                    |
| `collectionMetadata` | writable, optional | Metadata Account of the Collection                                                        |
| `systemProgram`      | readonly           | System program                                                                            |
| `sysvarInstructions` | readonly           | Instructions sysvar account                                                               |

**Arguments:**

| Argument           | Type                                    | Description |
| ------------------ | --------------------------------------- | ----------- |
| `discriminator`    | `u8`                                    |             |
| `verificationArgs` | [verificationArgs](#verificationArgs-3) |             |

### collect

**Accounts:**

| Account     | Type     | Description                               |
| ----------- | -------- | ----------------------------------------- |
| `authority` | signer   | Authority to collect fees                 |
| `recipient` | readonly | The account to transfer collected fees to |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### print

**Accounts:**

| Account                    | Type               | Description                                                                                                                                                                                                                                                                                   |
| -------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `editionMetadata`          | writable           | New Metadata key (pda of ['metadata', program id, mint id])                                                                                                                                                                                                                                   |
| `edition`                  | writable           | New Edition (pda of ['metadata', program id, mint id, 'edition'])                                                                                                                                                                                                                             |
| `editionMint`              | writable           | Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY                                                                                                                                                                                                                           |
| `editionTokenAccountOwner` | readonly           | Owner of the token account of new token                                                                                                                                                                                                                                                       |
| `editionTokenAccount`      | writable           | Token account of new token                                                                                                                                                                                                                                                                    |
| `editionMintAuthority`     | signer             | Mint authority of new mint                                                                                                                                                                                                                                                                    |
| `editionTokenRecord`       | writable, optional | Token record account                                                                                                                                                                                                                                                                          |
| `masterEdition`            | writable           | Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition'])                                                                                                                                                                                                |
| `editionMarkerPda`         | writable           | Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE). |
| `payer`                    | signer, writable   | payer                                                                                                                                                                                                                                                                                         |
| `masterTokenAccountOwner`  | signer             | owner of token account containing master token                                                                                                                                                                                                                                                |
| `masterTokenAccount`       | readonly           | token account containing token from master metadata mint                                                                                                                                                                                                                                      |
| `masterMetadata`           | readonly           | Master record metadata account                                                                                                                                                                                                                                                                |
| `updateAuthority`          | readonly           | The update authority of the master edition.                                                                                                                                                                                                                                                   |
| `splTokenProgram`          | readonly           | Token program                                                                                                                                                                                                                                                                                 |
| `splAtaProgram`            | readonly           | SPL Associated Token Account program                                                                                                                                                                                                                                                          |
| `sysvarInstructions`       | readonly           | Instructions sysvar account                                                                                                                                                                                                                                                                   |
| `systemProgram`            | readonly           | System program                                                                                                                                                                                                                                                                                |

**Arguments:**

| Argument        | Type                      | Description |
| --------------- | ------------------------- | ----------- |
| `discriminator` | `u8`                      |             |
| `printArgs`     | [printArgs](#printArgs-3) |             |

### resize

**Accounts:**

| Account         | Type             | Description                                                                                              |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| `metadata`      | writable         | The metadata account of the digital asset                                                                |
| `edition`       | writable         | The master edition or edition account of the digital asset, an uninitialized account for fungible assets |
| `mint`          | readonly         | Mint of token asset                                                                                      |
| `payer`         | signer, writable | The recipient of the excess rent and authority if the authority account is not present                   |
| `authority`     | signer, optional | Owner of the asset for (p)NFTs, or mint authority for fungible assets, if different from the payer       |
| `token`         | optional         | Token or Associated Token account                                                                        |
| `systemProgram` | readonly         | System program                                                                                           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

### closeAccounts

**Accounts:**

| Account       | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| `metadata`    | writable | Metadata (pda of ['metadata', program id, mint id]) |
| `edition`     | writable | Edition of the asset                                |
| `mint`        | writable | Mint of token asset                                 |
| `authority`   | signer   | Authority to close ownerless accounts               |
| `destination` | writable | The destination account that will receive the rent. |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` |             |

## PDAs

### metadata

**Seeds:**

| Seed        | Type             | Description                     |
| ----------- | ---------------- | ------------------------------- |
| `constant`  | bytes (constant) | -                               |
| `programId` | `PublicKey`      | The address of the program      |
| `mint`      | `PublicKey`      | The address of the mint account |

## Types

### setCollectionSizeArgs

**Definition:**

```typescript
{
  size: bigint;
}
```

### createMasterEditionArgs

**Definition:**

```typescript
{
  maxSupply: bigint | null;
}
```

### mintNewEditionFromMasterEditionViaTokenArgs

**Definition:**

```typescript
{
  edition: bigint;
}
```

### transferOutOfEscrowArgs

**Definition:**

```typescript
{
  amount: bigint;
}
```

### createMetadataAccountArgsV3

**Definition:**

```typescript
{
  data: dataV2;
  isMutable: boolean;
  collectionDetails: collectionDetails | null;
}
```

### updateMetadataAccountArgsV2

**Definition:**

```typescript
{
  data: dataV2 | null;
  updateAuthority: PublicKey | null;
  primarySaleHappened: boolean | null;
  isMutable: boolean | null;
}
```

### approveUseAuthorityArgs

**Definition:**

```typescript
{
  numberOfUses: bigint;
}
```

### utilizeArgs

**Definition:**

```typescript
{
  numberOfUses: bigint;
}
```

### authorizationData

**Definition:**

```typescript
{
  payload: payload;
}
```

### assetData

**Definition:**

```typescript
{
  name: unknown;
  symbol: unknown;
  uri: unknown;
  sellerFeeBasisPoints: bigint;
  creators: creator[] | null;
  primarySaleHappened: boolean;
  isMutable: boolean;
  tokenStandard: tokenStandard;
  collection: collection | null;
  uses: uses | null;
  collectionDetails: collectionDetails | null;
  ruleSet: PublicKey | null;
}
```

### collection

**Definition:**

```typescript
{
  verified: boolean;
  key: PublicKey;
}
```

### creator

**Definition:**

```typescript
{
  address: PublicKey;
  verified: boolean;
  share: bigint;
}
```

### data

**Definition:**

```typescript
{
  name: unknown;
  symbol: unknown;
  uri: unknown;
  sellerFeeBasisPoints: bigint;
  creators: creator[] | null;
}
```

### dataV2

**Definition:**

```typescript
{
  name: unknown;
  symbol: unknown;
  uri: unknown;
  sellerFeeBasisPoints: bigint;
  creators: creator[] | null;
  collection: collection | null;
  uses: uses | null;
}
```

### reservation

**Definition:**

```typescript
{
  address: PublicKey;
  spotsRemaining: bigint;
  totalSpots: bigint;
}
```

### reservationV1

**Definition:**

```typescript
{
  address: PublicKey;
  spotsRemaining: bigint;
  totalSpots: bigint;
}
```

### seedsVec

**Definition:**

```typescript
{
  seeds: unknown[];
}
```

### proofInfo

**Definition:**

```typescript
{
  proof: bigint[32][];
}
```

### payload

**Definition:**

```typescript
{
  map: unknown;
}
```

### uses

**Definition:**

```typescript
{
  useMethod: useMethod;
  remaining: bigint;
  total: bigint;
}
```

### burnArgs

**Definition:**

```typescript
| { kind: "v1"; amount: bigint }
```

### delegateArgs

**Definition:**

```typescript
| { kind: "collectionV1"; authorizationData: authorizationData | null }
  | { kind: "saleV1"; amount: bigint; authorizationData: authorizationData | null }
  | { kind: "transferV1"; amount: bigint; authorizationData: authorizationData | null }
  | { kind: "dataV1"; authorizationData: authorizationData | null }
  | { kind: "utilityV1"; amount: bigint; authorizationData: authorizationData | null }
  | { kind: "stakingV1"; amount: bigint; authorizationData: authorizationData | null }
  | { kind: "standardV1"; amount: bigint }
  | { kind: "lockedTransferV1"; amount: bigint; lockedAddress: PublicKey; authorizationData: authorizationData | null }
  | { kind: "programmableConfigV1"; authorizationData: authorizationData | null }
  | { kind: "authorityItemV1"; authorizationData: authorizationData | null }
  | { kind: "dataItemV1"; authorizationData: authorizationData | null }
  | { kind: "collectionItemV1"; authorizationData: authorizationData | null }
  | { kind: "programmableConfigItemV1"; authorizationData: authorizationData | null }
  | { kind: "printDelegateV1"; authorizationData: authorizationData | null }
```

### revokeArgs

**Definition:**

```typescript
| { kind: "collectionV1" }
  | { kind: "saleV1" }
  | { kind: "transferV1" }
  | { kind: "dataV1" }
  | { kind: "utilityV1" }
  | { kind: "stakingV1" }
  | { kind: "standardV1" }
  | { kind: "lockedTransferV1" }
  | { kind: "programmableConfigV1" }
  | { kind: "migrationV1" }
  | { kind: "authorityItemV1" }
  | { kind: "dataItemV1" }
  | { kind: "collectionItemV1" }
  | { kind: "programmableConfigItemV1" }
  | { kind: "printDelegateV1" }
```

### metadataDelegateRole

**Definition:**

```typescript
| { kind: "authorityItem" }
  | { kind: "collection" }
  | { kind: "use" }
  | { kind: "data" }
  | { kind: "programmableConfig" }
  | { kind: "dataItem" }
  | { kind: "collectionItem" }
  | { kind: "programmableConfigItem" }
```

### holderDelegateRole

**Definition:**

```typescript
| { kind: "printDelegate" }
```

### createArgs

**Definition:**

```typescript
| { kind: "v1"; assetData: assetData; decimals: bigint | null; printSupply: printSupply | null }
```

### mintArgs

**Definition:**

```typescript
| { kind: "v1"; amount: bigint; authorizationData: authorizationData | null }
```

### transferArgs

**Definition:**

```typescript
| { kind: "v1"; amount: bigint; authorizationData: authorizationData | null }
```

### updateArgs

**Definition:**

```typescript
| { kind: "v1"; newUpdateAuthority: PublicKey | null; data: data | null; primarySaleHappened: boolean | null; isMutable: boolean | null; collection: collectionToggle; collectionDetails: collectionDetailsToggle; uses: usesToggle; ruleSet: ruleSetToggle; authorizationData: authorizationData | null }
  | { kind: "asUpdateAuthorityV2"; newUpdateAuthority: PublicKey | null; data: data | null; primarySaleHappened: boolean | null; isMutable: boolean | null; collection: collectionToggle; collectionDetails: collectionDetailsToggle; uses: usesToggle; ruleSet: ruleSetToggle; tokenStandard: tokenStandard | null; authorizationData: authorizationData | null }
  | { kind: "asAuthorityItemDelegateV2"; newUpdateAuthority: PublicKey | null; primarySaleHappened: boolean | null; isMutable: boolean | null; tokenStandard: tokenStandard | null; authorizationData: authorizationData | null }
  | { kind: "asCollectionDelegateV2"; collection: collectionToggle; authorizationData: authorizationData | null }
  | { kind: "asDataDelegateV2"; data: data | null; authorizationData: authorizationData | null }
  | { kind: "asProgrammableConfigDelegateV2"; ruleSet: ruleSetToggle; authorizationData: authorizationData | null }
  | { kind: "asDataItemDelegateV2"; data: data | null; authorizationData: authorizationData | null }
  | { kind: "asCollectionItemDelegateV2"; collection: collectionToggle; authorizationData: authorizationData | null }
  | { kind: "asProgrammableConfigItemDelegateV2"; ruleSet: ruleSetToggle; authorizationData: authorizationData | null }
```

### collectionToggle

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "clear" }
  | { kind: "set"; value: [collection] }
```

### usesToggle

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "clear" }
  | { kind: "set"; value: [uses] }
```

### collectionDetailsToggle

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "clear" }
  | { kind: "set"; value: [collectionDetails] }
```

### ruleSetToggle

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "clear" }
  | { kind: "set"; value: [PublicKey] }
```

### printArgs

**Definition:**

```typescript
| { kind: "v1"; edition: bigint }
  | { kind: "v2"; edition: bigint }
```

### lockArgs

**Definition:**

```typescript
| { kind: "v1"; authorizationData: authorizationData | null }
```

### unlockArgs

**Definition:**

```typescript
| { kind: "v1"; authorizationData: authorizationData | null }
```

### useArgs

**Definition:**

```typescript
| { kind: "v1"; authorizationData: authorizationData | null }
```

### verificationArgs

**Definition:**

```typescript
| { kind: "creatorV1" }
  | { kind: "collectionV1" }
```

### tokenStandard

**Definition:**

```typescript
| { kind: "nonFungible" }
  | { kind: "fungibleAsset" }
  | { kind: "fungible" }
  | { kind: "nonFungibleEdition" }
  | { kind: "programmableNonFungible" }
  | { kind: "programmableNonFungibleEdition" }
```

### key

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "editionV1" }
  | { kind: "masterEditionV1" }
  | { kind: "reservationListV1" }
  | { kind: "metadataV1" }
  | { kind: "reservationListV2" }
  | { kind: "masterEditionV2" }
  | { kind: "editionMarker" }
  | { kind: "useAuthorityRecord" }
  | { kind: "collectionAuthorityRecord" }
  | { kind: "tokenOwnedEscrow" }
  | { kind: "tokenRecord" }
  | { kind: "metadataDelegate" }
  | { kind: "editionMarkerV2" }
  | { kind: "holderDelegate" }
```

### collectionDetails

**Definition:**

```typescript
| { kind: "v1"; size: bigint }
  | { kind: "v2"; padding: bigint[8] }
```

### escrowAuthority

**Definition:**

```typescript
| { kind: "tokenOwner" }
  | { kind: "creator"; value: [PublicKey] }
```

### printSupply

**Definition:**

```typescript
| { kind: "zero" }
  | { kind: "limited"; value: [bigint] }
  | { kind: "unlimited" }
```

### programmableConfig

**Definition:**

```typescript
| { kind: "v1"; ruleSet: PublicKey | null }
```

### migrationType

**Definition:**

```typescript
| { kind: "collectionV1" }
  | { kind: "programmableV1" }
```

### tokenState

**Definition:**

```typescript
| { kind: "unlocked" }
  | { kind: "locked" }
  | { kind: "listed" }
```

### tokenDelegateRole

**Definition:**

```typescript
| { kind: "sale" }
  | { kind: "transfer" }
  | { kind: "utility" }
  | { kind: "staking" }
  | { kind: "standard" }
  | { kind: "lockedTransfer" }
  | { kind: "migration" }
```

### authorityType

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "metadata" }
  | { kind: "holder" }
  | { kind: "metadataDelegate" }
  | { kind: "tokenDelegate" }
```

### payloadKey

**Definition:**

```typescript
| { kind: "amount" }
  | { kind: "authority" }
  | { kind: "authoritySeeds" }
  | { kind: "delegate" }
  | { kind: "delegateSeeds" }
  | { kind: "destination" }
  | { kind: "destinationSeeds" }
  | { kind: "holder" }
  | { kind: "source" }
  | { kind: "sourceSeeds" }
```

### payloadType

**Definition:**

```typescript
| { kind: "pubkey"; value: [PublicKey] }
  | { kind: "seeds"; value: [seedsVec] }
  | { kind: "merkleProof"; value: [proofInfo] }
  | { kind: "number"; value: [bigint] }
```

### useMethod

**Definition:**

```typescript
| { kind: "burn" }
  | { kind: "multiple" }
  | { kind: "single" }
```

## Errors

- **0 - InstructionUnpackError**: _(Hex: `0x0`)_
- **1 - InstructionPackError**: _(Hex: `0x1`)_
- **2 - NotRentExempt**: Lamport balance below rent-exempt threshold _(Hex: `0x2`)_
- **3 - AlreadyInitialized**: Already initialized _(Hex: `0x3`)_
- **4 - Uninitialized**: Uninitialized _(Hex: `0x4`)_
- **5 - InvalidMetadataKey**: Metadata's key must match seed of ['metadata', program id, mint] provided _(Hex: `0x5`)_
- **6 - InvalidEditionKey**: Edition's key must match seed of ['metadata', program id, name, 'edition'] provided _(Hex: `0x6`)_
- **7 - UpdateAuthorityIncorrect**: Update Authority given does not match _(Hex: `0x7`)_
- **8 - UpdateAuthorityIsNotSigner**: Update Authority needs to be signer to update metadata _(Hex: `0x8`)_
- **9 - NotMintAuthority**: You must be the mint authority and signer on this transaction _(Hex: `0x9`)_
- **10 - InvalidMintAuthority**: Mint authority provided does not match the authority on the mint _(Hex: `0xa`)_
- **11 - NameTooLong**: Name too long _(Hex: `0xb`)_
- **12 - SymbolTooLong**: Symbol too long _(Hex: `0xc`)_
- **13 - UriTooLong**: URI too long _(Hex: `0xd`)_
- **14 - UpdateAuthorityMustBeEqualToMetadataAuthorityAndSigner**: _(Hex: `0xe`)_
- **15 - MintMismatch**: Mint given does not match mint on Metadata _(Hex: `0xf`)_
- **16 - EditionsMustHaveExactlyOneToken**: Editions must have exactly one token _(Hex: `0x10`)_
- **17 - MaxEditionsMintedAlready**: _(Hex: `0x11`)_
- **18 - TokenMintToFailed**: _(Hex: `0x12`)_
- **19 - MasterRecordMismatch**: _(Hex: `0x13`)_
- **20 - DestinationMintMismatch**: _(Hex: `0x14`)_
- **21 - EditionAlreadyMinted**: _(Hex: `0x15`)_
- **22 - PrintingMintDecimalsShouldBeZero**: _(Hex: `0x16`)_
- **23 - OneTimePrintingAuthorizationMintDecimalsShouldBeZero**: _(Hex: `0x17`)_
- **24 - EditionMintDecimalsShouldBeZero**: EditionMintDecimalsShouldBeZero _(Hex: `0x18`)_
- **25 - TokenBurnFailed**: _(Hex: `0x19`)_
- **26 - TokenAccountOneTimeAuthMintMismatch**: _(Hex: `0x1a`)_
- **27 - DerivedKeyInvalid**: Derived key invalid _(Hex: `0x1b`)_
- **28 - PrintingMintMismatch**: The Printing mint does not match that on the master edition! _(Hex: `0x1c`)_
- **29 - OneTimePrintingAuthMintMismatch**: The One Time Printing Auth mint does not match that on the master edition! _(Hex: `0x1d`)_
- **30 - TokenAccountMintMismatch**: The mint of the token account does not match the Printing mint! _(Hex: `0x1e`)_
- **31 - TokenAccountMintMismatchV2**: The mint of the token account does not match the master metadata mint! _(Hex: `0x1f`)_
- **32 - NotEnoughTokens**: Not enough tokens to mint a limited edition _(Hex: `0x20`)_
- **33 - PrintingMintAuthorizationAccountMismatch**: _(Hex: `0x21`)_
- **34 - AuthorizationTokenAccountOwnerMismatch**: _(Hex: `0x22`)_
- **35 - Disabled**: _(Hex: `0x23`)_
- **36 - CreatorsTooLong**: Creators list too long _(Hex: `0x24`)_
- **37 - CreatorsMustBeAtleastOne**: Creators must be at least one if set _(Hex: `0x25`)_
- **38 - MustBeOneOfCreators**: _(Hex: `0x26`)_
- **39 - NoCreatorsPresentOnMetadata**: This metadata does not have creators _(Hex: `0x27`)_
- **40 - CreatorNotFound**: This creator address was not found _(Hex: `0x28`)_
- **41 - InvalidBasisPoints**: Basis points cannot be more than 10000 _(Hex: `0x29`)_
- **42 - PrimarySaleCanOnlyBeFlippedToTrue**: Primary sale can only be flipped to true and is immutable _(Hex: `0x2a`)_
- **43 - OwnerMismatch**: Owner does not match that on the account given _(Hex: `0x2b`)_
- **44 - NoBalanceInAccountForAuthorization**: This account has no tokens to be used for authorization _(Hex: `0x2c`)_
- **45 - ShareTotalMustBe100**: Share total must equal 100 for creator array _(Hex: `0x2d`)_
- **46 - ReservationExists**: _(Hex: `0x2e`)_
- **47 - ReservationDoesNotExist**: _(Hex: `0x2f`)_
- **48 - ReservationNotSet**: _(Hex: `0x30`)_
- **49 - ReservationAlreadyMade**: _(Hex: `0x31`)_
- **50 - BeyondMaxAddressSize**: _(Hex: `0x32`)_
- **51 - NumericalOverflowError**: NumericalOverflowError _(Hex: `0x33`)_
- **52 - ReservationBreachesMaximumSupply**: _(Hex: `0x34`)_
- **53 - AddressNotInReservation**: _(Hex: `0x35`)_
- **54 - CannotVerifyAnotherCreator**: You cannot unilaterally verify another creator, they must sign _(Hex: `0x36`)_
- **55 - CannotUnverifyAnotherCreator**: You cannot unilaterally unverify another creator _(Hex: `0x37`)_
- **56 - SpotMismatch**: _(Hex: `0x38`)_
- **57 - IncorrectOwner**: Incorrect account owner _(Hex: `0x39`)_
- **58 - PrintingWouldBreachMaximumSupply**: _(Hex: `0x3a`)_
- **59 - DataIsImmutable**: Data is immutable _(Hex: `0x3b`)_
- **60 - DuplicateCreatorAddress**: No duplicate creator addresses _(Hex: `0x3c`)_
- **61 - ReservationSpotsRemainingShouldMatchTotalSpotsAtStart**: _(Hex: `0x3d`)_
- **62 - InvalidTokenProgram**: Invalid token program _(Hex: `0x3e`)_
- **63 - DataTypeMismatch**: Data type mismatch _(Hex: `0x3f`)_
- **64 - BeyondAlottedAddressSize**: _(Hex: `0x40`)_
- **65 - ReservationNotComplete**: _(Hex: `0x41`)_
- **66 - TriedToReplaceAnExistingReservation**: _(Hex: `0x42`)_
- **67 - InvalidOperation**: Invalid operation _(Hex: `0x43`)_
- **68 - InvalidOwner**: Invalid Owner _(Hex: `0x44`)_
- **69 - PrintingMintSupplyMustBeZeroForConversion**: Printing mint supply must be zero for conversion _(Hex: `0x45`)_
- **70 - OneTimeAuthMintSupplyMustBeZeroForConversion**: One Time Auth mint supply must be zero for conversion _(Hex: `0x46`)_
- **71 - InvalidEditionIndex**: You tried to insert one edition too many into an edition mark pda _(Hex: `0x47`)_
- **72 - ReservationArrayShouldBeSizeOne**: _(Hex: `0x48`)_
- **73 - IsMutableCanOnlyBeFlippedToFalse**: Is Mutable can only be flipped to false _(Hex: `0x49`)_
- **74 - CollectionCannotBeVerifiedInThisInstruction**: Collection cannot be verified in this instruction _(Hex: `0x4a`)_
- **75 - Removed**: This instruction was deprecated in a previous release and is now removed _(Hex: `0x4b`)_
- **76 - MustBeBurned**: _(Hex: `0x4c`)_
- **77 - InvalidUseMethod**: This use method is invalid _(Hex: `0x4d`)_
- **78 - CannotChangeUseMethodAfterFirstUse**: Cannot Change Use Method after the first use _(Hex: `0x4e`)_
- **79 - CannotChangeUsesAfterFirstUse**: Cannot Change Remaining or Available uses after the first use _(Hex: `0x4f`)_
- **80 - CollectionNotFound**: Collection Not Found on Metadata _(Hex: `0x50`)_
- **81 - InvalidCollectionUpdateAuthority**: Collection Update Authority is invalid _(Hex: `0x51`)_
- **82 - CollectionMustBeAUniqueMasterEdition**: Collection Must Be a Unique Master Edition v2 _(Hex: `0x52`)_
- **83 - UseAuthorityRecordAlreadyExists**: The Use Authority Record Already Exists, to modify it Revoke, then Approve _(Hex: `0x53`)_
- **84 - UseAuthorityRecordAlreadyRevoked**: The Use Authority Record is empty or already revoked _(Hex: `0x54`)_
- **85 - Unusable**: This token has no uses _(Hex: `0x55`)_
- **86 - NotEnoughUses**: There are not enough Uses left on this token. _(Hex: `0x56`)_
- **87 - CollectionAuthorityRecordAlreadyExists**: This Collection Authority Record Already Exists. _(Hex: `0x57`)_
- **88 - CollectionAuthorityDoesNotExist**: This Collection Authority Record Does Not Exist. _(Hex: `0x58`)_
- **89 - InvalidUseAuthorityRecord**: This Use Authority Record is invalid. _(Hex: `0x59`)_
- **90 - InvalidCollectionAuthorityRecord**: _(Hex: `0x5a`)_
- **91 - InvalidFreezeAuthority**: Metadata does not match the freeze authority on the mint _(Hex: `0x5b`)_
- **92 - InvalidDelegate**: All tokens in this account have not been delegated to this user. _(Hex: `0x5c`)_
- **93 - CannotAdjustVerifiedCreator**: _(Hex: `0x5d`)_
- **94 - CannotRemoveVerifiedCreator**: Verified creators cannot be removed. _(Hex: `0x5e`)_
- **95 - CannotWipeVerifiedCreators**: _(Hex: `0x5f`)_
- **96 - NotAllowedToChangeSellerFeeBasisPoints**: _(Hex: `0x60`)_
- **97 - EditionOverrideCannotBeZero**: Edition override cannot be zero _(Hex: `0x61`)_
- **98 - InvalidUser**: Invalid User _(Hex: `0x62`)_
- **99 - RevokeCollectionAuthoritySignerIncorrect**: Revoke Collection Authority signer is incorrect _(Hex: `0x63`)_
- **100 - TokenCloseFailed**: _(Hex: `0x64`)_
- **101 - UnsizedCollection**: Can't use this function on unsized collection _(Hex: `0x65`)_
- **102 - SizedCollection**: Can't use this function on a sized collection _(Hex: `0x66`)_
- **103 - MissingCollectionMetadata**: Missing collection metadata account _(Hex: `0x67`)_
- **104 - NotAMemberOfCollection**: This NFT is not a member of the specified collection. _(Hex: `0x68`)_
- **105 - NotVerifiedMemberOfCollection**: This NFT is not a verified member of the specified collection. _(Hex: `0x69`)_
- **106 - NotACollectionParent**: This NFT is not a collection parent NFT. _(Hex: `0x6a`)_
- **107 - CouldNotDetermineTokenStandard**: Could not determine a TokenStandard type. _(Hex: `0x6b`)_
- **108 - MissingEditionAccount**: This mint account has an edition but none was provided. _(Hex: `0x6c`)_
- **109 - NotAMasterEdition**: This edition is not a Master Edition _(Hex: `0x6d`)_
- **110 - MasterEditionHasPrints**: This Master Edition has existing prints _(Hex: `0x6e`)_
- **111 - BorshDeserializationError**: _(Hex: `0x6f`)_
- **112 - CannotUpdateVerifiedCollection**: Cannot update a verified collection in this command _(Hex: `0x70`)_
- **113 - CollectionMasterEditionAccountInvalid**: Edition account doesnt match collection _(Hex: `0x71`)_
- **114 - AlreadyVerified**: Item is already verified. _(Hex: `0x72`)_
- **115 - AlreadyUnverified**: _(Hex: `0x73`)_
- **116 - NotAPrintEdition**: This edition is not a Print Edition _(Hex: `0x74`)_
- **117 - InvalidMasterEdition**: Invalid Master Edition _(Hex: `0x75`)_
- **118 - InvalidPrintEdition**: Invalid Print Edition _(Hex: `0x76`)_
- **119 - InvalidEditionMarker**: Invalid Edition Marker _(Hex: `0x77`)_
- **120 - ReservationListDeprecated**: Reservation List is Deprecated _(Hex: `0x78`)_
- **121 - PrintEditionDoesNotMatchMasterEdition**: Print Edition does not match Master Edition _(Hex: `0x79`)_
- **122 - EditionNumberGreaterThanMaxSupply**: Edition Number greater than max supply _(Hex: `0x7a`)_
- **123 - MustUnverify**: Must unverify before migrating collections. _(Hex: `0x7b`)_
- **124 - InvalidEscrowBumpSeed**: Invalid Escrow Account Bump Seed _(Hex: `0x7c`)_
- **125 - MustBeEscrowAuthority**: Must Escrow Authority _(Hex: `0x7d`)_
- **126 - InvalidSystemProgram**: Invalid System Program _(Hex: `0x7e`)_
- **127 - MustBeNonFungible**: Must be a Non Fungible Token _(Hex: `0x7f`)_
- **128 - InsufficientTokens**: Insufficient tokens for transfer _(Hex: `0x80`)_
- **129 - BorshSerializationError**: Borsh Serialization Error _(Hex: `0x81`)_
- **130 - NoFreezeAuthoritySet**: Cannot create NFT with no Freeze Authority. _(Hex: `0x82`)_
- **131 - InvalidCollectionSizeChange**: Invalid collection size change _(Hex: `0x83`)_
- **132 - InvalidBubblegumSigner**: Invalid bubblegum signer _(Hex: `0x84`)_
- **133 - EscrowParentHasDelegate**: Escrow parent cannot have a delegate _(Hex: `0x85`)_
- **134 - MintIsNotSigner**: Mint needs to be signer to initialize the account _(Hex: `0x86`)_
- **135 - InvalidTokenStandard**: Invalid token standard _(Hex: `0x87`)_
- **136 - InvalidMintForTokenStandard**: Invalid mint account for specified token standard _(Hex: `0x88`)_
- **137 - InvalidAuthorizationRules**: Invalid authorization rules account _(Hex: `0x89`)_
- **138 - MissingAuthorizationRules**: Missing authorization rules account _(Hex: `0x8a`)_
- **139 - MissingProgrammableConfig**: Missing programmable configuration _(Hex: `0x8b`)_
- **140 - InvalidProgrammableConfig**: Invalid programmable configuration _(Hex: `0x8c`)_
- **141 - DelegateAlreadyExists**: Delegate already exists _(Hex: `0x8d`)_
- **142 - DelegateNotFound**: Delegate not found _(Hex: `0x8e`)_
- **143 - MissingAccountInBuilder**: Required account not set in instruction builder _(Hex: `0x8f`)_
- **144 - MissingArgumentInBuilder**: Required argument not set in instruction builder _(Hex: `0x90`)_
- **145 - FeatureNotSupported**: Feature not supported currently _(Hex: `0x91`)_
- **146 - InvalidSystemWallet**: Invalid system wallet _(Hex: `0x92`)_
- **147 - OnlySaleDelegateCanTransfer**: Only the sale delegate can transfer while its set _(Hex: `0x93`)_
- **148 - MissingTokenAccount**: Missing token account _(Hex: `0x94`)_
- **149 - MissingSplTokenProgram**: Missing SPL token program _(Hex: `0x95`)_
- **150 - MissingAuthorizationRulesProgram**: Missing authorization rules program _(Hex: `0x96`)_
- **151 - InvalidDelegateRoleForTransfer**: Invalid delegate role for transfer _(Hex: `0x97`)_
- **152 - InvalidTransferAuthority**: Invalid transfer authority _(Hex: `0x98`)_
- **153 - InstructionNotSupported**: Instruction not supported for ProgrammableNonFungible assets _(Hex: `0x99`)_
- **154 - KeyMismatch**: Public key does not match expected value _(Hex: `0x9a`)_
- **155 - LockedToken**: Token is locked _(Hex: `0x9b`)_
- **156 - UnlockedToken**: Token is unlocked _(Hex: `0x9c`)_
- **157 - MissingDelegateRole**: Missing delegate role _(Hex: `0x9d`)_
- **158 - InvalidAuthorityType**: Invalid authority type _(Hex: `0x9e`)_
- **159 - MissingTokenRecord**: Missing token record account _(Hex: `0x9f`)_
- **160 - MintSupplyMustBeZero**: Mint supply must be zero for programmable assets _(Hex: `0xa0`)_
- **161 - DataIsEmptyOrZeroed**: Data is empty or zeroed _(Hex: `0xa1`)_
- **162 - MissingTokenOwnerAccount**: Missing token owner _(Hex: `0xa2`)_
- **163 - InvalidMasterEditionAccountLength**: Master edition account has an invalid length _(Hex: `0xa3`)_
- **164 - IncorrectTokenState**: Incorrect token state _(Hex: `0xa4`)_
- **165 - InvalidDelegateRole**: Invalid delegate role _(Hex: `0xa5`)_
- **166 - MissingPrintSupply**: Print supply is required for non-fungibles _(Hex: `0xa6`)_
- **167 - MissingMasterEditionAccount**: Missing master edition account _(Hex: `0xa7`)_
- **168 - AmountMustBeGreaterThanZero**: Amount must be greater than zero _(Hex: `0xa8`)_
- **169 - InvalidDelegateArgs**: Invalid delegate args _(Hex: `0xa9`)_
- **170 - MissingLockedTransferAddress**: Missing address for locked transfer _(Hex: `0xaa`)_
- **171 - InvalidLockedTransferAddress**: Invalid destination address for locked transfer _(Hex: `0xab`)_
- **172 - DataIncrementLimitExceeded**: Exceeded account realloc increase limit _(Hex: `0xac`)_
- **173 - CannotUpdateAssetWithDelegate**: Cannot update the rule set of a programmable asset that has a delegate _(Hex: `0xad`)_
- **174 - InvalidAmount**: Invalid token amount for this operation or token standard _(Hex: `0xae`)_
- **175 - MissingMasterEditionMintAccount**: Missing master edition mint account _(Hex: `0xaf`)_
- **176 - MissingMasterEditionTokenAccount**: Missing master edition token account _(Hex: `0xb0`)_
- **177 - MissingEditionMarkerAccount**: Missing edition marker account _(Hex: `0xb1`)_
- **178 - CannotBurnWithDelegate**: Cannot burn while persistent delegate is set _(Hex: `0xb2`)_
- **179 - MissingEdition**: Missing edition account _(Hex: `0xb3`)_
- **180 - InvalidAssociatedTokenAccountProgram**: Invalid Associated Token Account Program _(Hex: `0xb4`)_
- **181 - InvalidInstructionsSysvar**: Invalid InstructionsSysvar _(Hex: `0xb5`)_
- **182 - InvalidParentAccounts**: Invalid or Unneeded parent accounts _(Hex: `0xb6`)_
- **183 - InvalidUpdateArgs**: Authority cannot apply all update args _(Hex: `0xb7`)_
- **184 - InsufficientTokenBalance**: Token account does not have enough tokens _(Hex: `0xb8`)_
- **185 - MissingCollectionMint**: Missing collection account _(Hex: `0xb9`)_
- **186 - MissingCollectionMasterEdition**: Missing collection master edition account _(Hex: `0xba`)_
- **187 - InvalidTokenRecord**: Invalid token record account _(Hex: `0xbb`)_
- **188 - InvalidCloseAuthority**: The close authority needs to be revoked by the Utility Delegate _(Hex: `0xbc`)_
- **189 - InvalidInstruction**: Invalid or removed instruction _(Hex: `0xbd`)_
- **190 - MissingDelegateRecord**: Missing delegate record _(Hex: `0xbe`)_
- **191 - InvalidFeeAccount**: _(Hex: `0xbf`)_
- **192 - InvalidMetadataFlags**: _(Hex: `0xc0`)_
- **193 - CannotChangeUpdateAuthorityWithDelegate**: Cannot change the update authority with a delegate _(Hex: `0xc1`)_
- **194 - InvalidMintExtensionType**: Invalid mint extension type _(Hex: `0xc2`)_
- **195 - InvalidMintCloseAuthority**: Invalid mint close authority _(Hex: `0xc3`)_
- **196 - InvalidMetadataPointer**: Invalid metadata pointer _(Hex: `0xc4`)_
- **197 - InvalidTokenExtensionType**: Invalid token extension type _(Hex: `0xc5`)_
- **198 - MissingImmutableOwnerExtension**: Missing immutable owner extension _(Hex: `0xc6`)_
- **199 - ExpectedUninitializedAccount**: Expected account to be uninitialized _(Hex: `0xc7`)_
- **200 - InvalidEditionAccountLength**: Edition account has an invalid length _(Hex: `0xc8`)_
- **201 - AccountAlreadyResized**: Account has already been resized _(Hex: `0xc9`)_
- **202 - ConditionsForClosingNotMet**: Conditions for closing not met _(Hex: `0xca`)_
