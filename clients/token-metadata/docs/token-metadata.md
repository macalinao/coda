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
  - [createMetadataAccount](#createMetadataAccount-1)
  - [updateMetadataAccount](#updateMetadataAccount-1)
  - [deprecatedCreateMasterEdition](#deprecatedCreateMasterEdition-1)
  - [deprecatedMintNewEditionFromMasterEditionViaPrintingToken](#deprecatedMintNewEditionFromMasterEditionViaPrintingToken-1)
  - [updatePrimarySaleHappenedViaToken](#updatePrimarySaleHappenedViaToken-1)
  - [deprecatedSetReservationList](#deprecatedSetReservationList-1)
  - [deprecatedCreateReservationList](#deprecatedCreateReservationList-1)
  - [signMetadata](#signMetadata-1)
  - [deprecatedMintPrintingTokensViaToken](#deprecatedMintPrintingTokensViaToken-1)
  - [deprecatedMintPrintingTokens](#deprecatedMintPrintingTokens-1)
  - [createMasterEdition](#createMasterEdition-1)
  - [mintNewEditionFromMasterEditionViaToken](#mintNewEditionFromMasterEditionViaToken-1)
  - [convertMasterEditionV1ToV2](#convertMasterEditionV1ToV2-1)
  - [mintNewEditionFromMasterEditionViaVaultProxy](#mintNewEditionFromMasterEditionViaVaultProxy-1)
  - [puffMetadata](#puffMetadata-1)
  - [updateMetadataAccountV2](#updateMetadataAccountV2-1)
  - [createMetadataAccountV2](#createMetadataAccountV2-1)
  - [createMasterEditionV3](#createMasterEditionV3-1)
  - [verifyCollection](#verifyCollection-1)
  - [utilize](#utilize-1)
  - [approveUseAuthority](#approveUseAuthority-1)
  - [revokeUseAuthority](#revokeUseAuthority-1)
  - [unverifyCollection](#unverifyCollection-1)
  - [approveCollectionAuthority](#approveCollectionAuthority-1)
  - [revokeCollectionAuthority](#revokeCollectionAuthority-1)
  - [setAndVerifyCollection](#setAndVerifyCollection-1)
  - [freezeDelegatedAccount](#freezeDelegatedAccount-1)
  - [thawDelegatedAccount](#thawDelegatedAccount-1)
  - [removeCreatorVerification](#removeCreatorVerification-1)
  - [burnNft](#burnNft-1)
  - [verifySizedCollectionItem](#verifySizedCollectionItem-1)
  - [unverifySizedCollectionItem](#unverifySizedCollectionItem-1)
  - [setAndVerifySizedCollectionItem](#setAndVerifySizedCollectionItem-1)
  - [createMetadataAccountV3](#createMetadataAccountV3-1)
  - [setCollectionSize](#setCollectionSize-1)
  - [setTokenStandard](#setTokenStandard-1)
  - [bubblegumSetCollectionSize](#bubblegumSetCollectionSize-1)
  - [burnEditionNft](#burnEditionNft-1)
  - [createEscrowAccount](#createEscrowAccount-1)
  - [closeEscrowAccount](#closeEscrowAccount-1)
  - [transferOutOfEscrow](#transferOutOfEscrow-1)
  - [burn](#burn-1)
  - [create](#create-1)
  - [mint](#mint-1)
  - [delegate](#delegate-1)
  - [revoke](#revoke-1)
  - [lock](#lock-1)
  - [unlock](#unlock-1)
  - [migrate](#migrate-1)
  - [transfer](#transfer-1)
  - [update](#update-1)
  - [use](#use-1)
  - [verify](#verify-1)
  - [unverify](#unverify-1)
  - [collect](#collect-1)
  - [print](#print-1)
  - [resize](#resize-1)
  - [closeAccounts](#closeAccounts-1)
- [PDAs](#pdas)
  - [metadata](#metadata-2)
- [Types](#types)
  - [setCollectionSizeArgs](#setCollectionSizeArgs-3)
  - [createMasterEditionArgs](#createMasterEditionArgs-3)
  - [mintNewEditionFromMasterEditionViaTokenArgs](#mintNewEditionFromMasterEditionViaTokenArgs-3)
  - [transferOutOfEscrowArgs](#transferOutOfEscrowArgs-3)
  - [createMetadataAccountArgsV3](#createMetadataAccountArgsV3-3)
  - [updateMetadataAccountArgsV2](#updateMetadataAccountArgsV2-3)
  - [approveUseAuthorityArgs](#approveUseAuthorityArgs-3)
  - [utilizeArgs](#utilizeArgs-3)
  - [authorizationData](#authorizationData-3)
  - [assetData](#assetData-3)
  - [collection](#collection-3)
  - [creator](#creator-3)
  - [data](#data-3)
  - [dataV2](#dataV2-3)
  - [reservation](#reservation-3)
  - [reservationV1](#reservationV1-3)
  - [seedsVec](#seedsVec-3)
  - [proofInfo](#proofInfo-3)
  - [payload](#payload-3)
  - [uses](#uses-3)
  - [burnArgs](#burnArgs-3)
  - [delegateArgs](#delegateArgs-3)
  - [revokeArgs](#revokeArgs-3)
  - [metadataDelegateRole](#metadataDelegateRole-3)
  - [holderDelegateRole](#holderDelegateRole-3)
  - [createArgs](#createArgs-3)
  - [mintArgs](#mintArgs-3)
  - [transferArgs](#transferArgs-3)
  - [updateArgs](#updateArgs-3)
  - [collectionToggle](#collectionToggle-3)
  - [usesToggle](#usesToggle-3)
  - [collectionDetailsToggle](#collectionDetailsToggle-3)
  - [ruleSetToggle](#ruleSetToggle-3)
  - [printArgs](#printArgs-3)
  - [lockArgs](#lockArgs-3)
  - [unlockArgs](#unlockArgs-3)
  - [useArgs](#useArgs-3)
  - [verificationArgs](#verificationArgs-3)
  - [tokenStandard](#tokenStandard-3)
  - [key](#key-3)
  - [collectionDetails](#collectionDetails-3)
  - [escrowAuthority](#escrowAuthority-3)
  - [printSupply](#printSupply-3)
  - [programmableConfig](#programmableConfig-3)
  - [migrationType](#migrationType-3)
  - [tokenState](#tokenState-3)
  - [tokenDelegateRole](#tokenDelegateRole-3)
  - [authorityType](#authorityType-3)
  - [payloadKey](#payloadKey-3)
  - [payloadType](#payloadType-3)
  - [useMethod](#useMethod-3)
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

- **instructionUnpackError** (Code: 0 / `000` / `0x0`) --
- **instructionPackError** (Code: 1 / `001` / `0x1`) --
- **notRentExempt** (Code: 2 / `002` / `0x2`) -- Lamport balance below rent-exempt threshold
- **alreadyInitialized** (Code: 3 / `003` / `0x3`) -- Already initialized
- **uninitialized** (Code: 4 / `004` / `0x4`) -- Uninitialized
- **invalidMetadataKey** (Code: 5 / `005` / `0x5`) -- Metadata's key must match seed of ['metadata', program id, mint] provided
- **invalidEditionKey** (Code: 6 / `006` / `0x6`) -- Edition's key must match seed of ['metadata', program id, name, 'edition'] provided
- **updateAuthorityIncorrect** (Code: 7 / `007` / `0x7`) -- Update Authority given does not match
- **updateAuthorityIsNotSigner** (Code: 8 / `008` / `0x8`) -- Update Authority needs to be signer to update metadata
- **notMintAuthority** (Code: 9 / `009` / `0x9`) -- You must be the mint authority and signer on this transaction
- **invalidMintAuthority** (Code: 10 / `010` / `0xa`) -- Mint authority provided does not match the authority on the mint
- **nameTooLong** (Code: 11 / `011` / `0xb`) -- Name too long
- **symbolTooLong** (Code: 12 / `012` / `0xc`) -- Symbol too long
- **uriTooLong** (Code: 13 / `013` / `0xd`) -- URI too long
- **updateAuthorityMustBeEqualToMetadataAuthorityAndSigner** (Code: 14 / `014` / `0xe`) --
- **mintMismatch** (Code: 15 / `015` / `0xf`) -- Mint given does not match mint on Metadata
- **editionsMustHaveExactlyOneToken** (Code: 16 / `016` / `0x10`) -- Editions must have exactly one token
- **maxEditionsMintedAlready** (Code: 17 / `017` / `0x11`) --
- **tokenMintToFailed** (Code: 18 / `018` / `0x12`) --
- **masterRecordMismatch** (Code: 19 / `019` / `0x13`) --
- **destinationMintMismatch** (Code: 20 / `020` / `0x14`) --
- **editionAlreadyMinted** (Code: 21 / `021` / `0x15`) --
- **printingMintDecimalsShouldBeZero** (Code: 22 / `022` / `0x16`) --
- **oneTimePrintingAuthorizationMintDecimalsShouldBeZero** (Code: 23 / `023` / `0x17`) --
- **editionMintDecimalsShouldBeZero** (Code: 24 / `024` / `0x18`) -- EditionMintDecimalsShouldBeZero
- **tokenBurnFailed** (Code: 25 / `025` / `0x19`) --
- **tokenAccountOneTimeAuthMintMismatch** (Code: 26 / `026` / `0x1a`) --
- **derivedKeyInvalid** (Code: 27 / `027` / `0x1b`) -- Derived key invalid
- **printingMintMismatch** (Code: 28 / `028` / `0x1c`) -- The Printing mint does not match that on the master edition!
- **oneTimePrintingAuthMintMismatch** (Code: 29 / `029` / `0x1d`) -- The One Time Printing Auth mint does not match that on the master edition!
- **tokenAccountMintMismatch** (Code: 30 / `030` / `0x1e`) -- The mint of the token account does not match the Printing mint!
- **tokenAccountMintMismatchV2** (Code: 31 / `031` / `0x1f`) -- The mint of the token account does not match the master metadata mint!
- **notEnoughTokens** (Code: 32 / `032` / `0x20`) -- Not enough tokens to mint a limited edition
- **printingMintAuthorizationAccountMismatch** (Code: 33 / `033` / `0x21`) --
- **authorizationTokenAccountOwnerMismatch** (Code: 34 / `034` / `0x22`) --
- **disabled** (Code: 35 / `035` / `0x23`) --
- **creatorsTooLong** (Code: 36 / `036` / `0x24`) -- Creators list too long
- **creatorsMustBeAtleastOne** (Code: 37 / `037` / `0x25`) -- Creators must be at least one if set
- **mustBeOneOfCreators** (Code: 38 / `038` / `0x26`) --
- **noCreatorsPresentOnMetadata** (Code: 39 / `039` / `0x27`) -- This metadata does not have creators
- **creatorNotFound** (Code: 40 / `040` / `0x28`) -- This creator address was not found
- **invalidBasisPoints** (Code: 41 / `041` / `0x29`) -- Basis points cannot be more than 10000
- **primarySaleCanOnlyBeFlippedToTrue** (Code: 42 / `042` / `0x2a`) -- Primary sale can only be flipped to true and is immutable
- **ownerMismatch** (Code: 43 / `043` / `0x2b`) -- Owner does not match that on the account given
- **noBalanceInAccountForAuthorization** (Code: 44 / `044` / `0x2c`) -- This account has no tokens to be used for authorization
- **shareTotalMustBe100** (Code: 45 / `045` / `0x2d`) -- Share total must equal 100 for creator array
- **reservationExists** (Code: 46 / `046` / `0x2e`) --
- **reservationDoesNotExist** (Code: 47 / `047` / `0x2f`) --
- **reservationNotSet** (Code: 48 / `048` / `0x30`) --
- **reservationAlreadyMade** (Code: 49 / `049` / `0x31`) --
- **beyondMaxAddressSize** (Code: 50 / `050` / `0x32`) --
- **numericalOverflowError** (Code: 51 / `051` / `0x33`) -- NumericalOverflowError
- **reservationBreachesMaximumSupply** (Code: 52 / `052` / `0x34`) --
- **addressNotInReservation** (Code: 53 / `053` / `0x35`) --
- **cannotVerifyAnotherCreator** (Code: 54 / `054` / `0x36`) -- You cannot unilaterally verify another creator, they must sign
- **cannotUnverifyAnotherCreator** (Code: 55 / `055` / `0x37`) -- You cannot unilaterally unverify another creator
- **spotMismatch** (Code: 56 / `056` / `0x38`) --
- **incorrectOwner** (Code: 57 / `057` / `0x39`) -- Incorrect account owner
- **printingWouldBreachMaximumSupply** (Code: 58 / `058` / `0x3a`) --
- **dataIsImmutable** (Code: 59 / `059` / `0x3b`) -- Data is immutable
- **duplicateCreatorAddress** (Code: 60 / `060` / `0x3c`) -- No duplicate creator addresses
- **reservationSpotsRemainingShouldMatchTotalSpotsAtStart** (Code: 61 / `061` / `0x3d`) --
- **invalidTokenProgram** (Code: 62 / `062` / `0x3e`) -- Invalid token program
- **dataTypeMismatch** (Code: 63 / `063` / `0x3f`) -- Data type mismatch
- **beyondAlottedAddressSize** (Code: 64 / `064` / `0x40`) --
- **reservationNotComplete** (Code: 65 / `065` / `0x41`) --
- **triedToReplaceAnExistingReservation** (Code: 66 / `066` / `0x42`) --
- **invalidOperation** (Code: 67 / `067` / `0x43`) -- Invalid operation
- **invalidOwner** (Code: 68 / `068` / `0x44`) -- Invalid Owner
- **printingMintSupplyMustBeZeroForConversion** (Code: 69 / `069` / `0x45`) -- Printing mint supply must be zero for conversion
- **oneTimeAuthMintSupplyMustBeZeroForConversion** (Code: 70 / `070` / `0x46`) -- One Time Auth mint supply must be zero for conversion
- **invalidEditionIndex** (Code: 71 / `071` / `0x47`) -- You tried to insert one edition too many into an edition mark pda
- **reservationArrayShouldBeSizeOne** (Code: 72 / `072` / `0x48`) --
- **isMutableCanOnlyBeFlippedToFalse** (Code: 73 / `073` / `0x49`) -- Is Mutable can only be flipped to false
- **collectionCannotBeVerifiedInThisInstruction** (Code: 74 / `074` / `0x4a`) -- Collection cannot be verified in this instruction
- **removed** (Code: 75 / `075` / `0x4b`) -- This instruction was deprecated in a previous release and is now removed
- **mustBeBurned** (Code: 76 / `076` / `0x4c`) --
- **invalidUseMethod** (Code: 77 / `077` / `0x4d`) -- This use method is invalid
- **cannotChangeUseMethodAfterFirstUse** (Code: 78 / `078` / `0x4e`) -- Cannot Change Use Method after the first use
- **cannotChangeUsesAfterFirstUse** (Code: 79 / `079` / `0x4f`) -- Cannot Change Remaining or Available uses after the first use
- **collectionNotFound** (Code: 80 / `080` / `0x50`) -- Collection Not Found on Metadata
- **invalidCollectionUpdateAuthority** (Code: 81 / `081` / `0x51`) -- Collection Update Authority is invalid
- **collectionMustBeAUniqueMasterEdition** (Code: 82 / `082` / `0x52`) -- Collection Must Be a Unique Master Edition v2
- **useAuthorityRecordAlreadyExists** (Code: 83 / `083` / `0x53`) -- The Use Authority Record Already Exists, to modify it Revoke, then Approve
- **useAuthorityRecordAlreadyRevoked** (Code: 84 / `084` / `0x54`) -- The Use Authority Record is empty or already revoked
- **unusable** (Code: 85 / `085` / `0x55`) -- This token has no uses
- **notEnoughUses** (Code: 86 / `086` / `0x56`) -- There are not enough Uses left on this token.
- **collectionAuthorityRecordAlreadyExists** (Code: 87 / `087` / `0x57`) -- This Collection Authority Record Already Exists.
- **collectionAuthorityDoesNotExist** (Code: 88 / `088` / `0x58`) -- This Collection Authority Record Does Not Exist.
- **invalidUseAuthorityRecord** (Code: 89 / `089` / `0x59`) -- This Use Authority Record is invalid.
- **invalidCollectionAuthorityRecord** (Code: 90 / `090` / `0x5a`) --
- **invalidFreezeAuthority** (Code: 91 / `091` / `0x5b`) -- Metadata does not match the freeze authority on the mint
- **invalidDelegate** (Code: 92 / `092` / `0x5c`) -- All tokens in this account have not been delegated to this user.
- **cannotAdjustVerifiedCreator** (Code: 93 / `093` / `0x5d`) --
- **cannotRemoveVerifiedCreator** (Code: 94 / `094` / `0x5e`) -- Verified creators cannot be removed.
- **cannotWipeVerifiedCreators** (Code: 95 / `095` / `0x5f`) --
- **notAllowedToChangeSellerFeeBasisPoints** (Code: 96 / `096` / `0x60`) --
- **editionOverrideCannotBeZero** (Code: 97 / `097` / `0x61`) -- Edition override cannot be zero
- **invalidUser** (Code: 98 / `098` / `0x62`) -- Invalid User
- **revokeCollectionAuthoritySignerIncorrect** (Code: 99 / `099` / `0x63`) -- Revoke Collection Authority signer is incorrect
- **tokenCloseFailed** (Code: 100 / `100` / `0x64`) --
- **unsizedCollection** (Code: 101 / `101` / `0x65`) -- Can't use this function on unsized collection
- **sizedCollection** (Code: 102 / `102` / `0x66`) -- Can't use this function on a sized collection
- **missingCollectionMetadata** (Code: 103 / `103` / `0x67`) -- Missing collection metadata account
- **notAMemberOfCollection** (Code: 104 / `104` / `0x68`) -- This NFT is not a member of the specified collection.
- **notVerifiedMemberOfCollection** (Code: 105 / `105` / `0x69`) -- This NFT is not a verified member of the specified collection.
- **notACollectionParent** (Code: 106 / `106` / `0x6a`) -- This NFT is not a collection parent NFT.
- **couldNotDetermineTokenStandard** (Code: 107 / `107` / `0x6b`) -- Could not determine a TokenStandard type.
- **missingEditionAccount** (Code: 108 / `108` / `0x6c`) -- This mint account has an edition but none was provided.
- **notAMasterEdition** (Code: 109 / `109` / `0x6d`) -- This edition is not a Master Edition
- **masterEditionHasPrints** (Code: 110 / `110` / `0x6e`) -- This Master Edition has existing prints
- **borshDeserializationError** (Code: 111 / `111` / `0x6f`) --
- **cannotUpdateVerifiedCollection** (Code: 112 / `112` / `0x70`) -- Cannot update a verified collection in this command
- **collectionMasterEditionAccountInvalid** (Code: 113 / `113` / `0x71`) -- Edition account doesnt match collection
- **alreadyVerified** (Code: 114 / `114` / `0x72`) -- Item is already verified.
- **alreadyUnverified** (Code: 115 / `115` / `0x73`) --
- **notAPrintEdition** (Code: 116 / `116` / `0x74`) -- This edition is not a Print Edition
- **invalidMasterEdition** (Code: 117 / `117` / `0x75`) -- Invalid Master Edition
- **invalidPrintEdition** (Code: 118 / `118` / `0x76`) -- Invalid Print Edition
- **invalidEditionMarker** (Code: 119 / `119` / `0x77`) -- Invalid Edition Marker
- **reservationListDeprecated** (Code: 120 / `120` / `0x78`) -- Reservation List is Deprecated
- **printEditionDoesNotMatchMasterEdition** (Code: 121 / `121` / `0x79`) -- Print Edition does not match Master Edition
- **editionNumberGreaterThanMaxSupply** (Code: 122 / `122` / `0x7a`) -- Edition Number greater than max supply
- **mustUnverify** (Code: 123 / `123` / `0x7b`) -- Must unverify before migrating collections.
- **invalidEscrowBumpSeed** (Code: 124 / `124` / `0x7c`) -- Invalid Escrow Account Bump Seed
- **mustBeEscrowAuthority** (Code: 125 / `125` / `0x7d`) -- Must Escrow Authority
- **invalidSystemProgram** (Code: 126 / `126` / `0x7e`) -- Invalid System Program
- **mustBeNonFungible** (Code: 127 / `127` / `0x7f`) -- Must be a Non Fungible Token
- **insufficientTokens** (Code: 128 / `128` / `0x80`) -- Insufficient tokens for transfer
- **borshSerializationError** (Code: 129 / `129` / `0x81`) -- Borsh Serialization Error
- **noFreezeAuthoritySet** (Code: 130 / `130` / `0x82`) -- Cannot create NFT with no Freeze Authority.
- **invalidCollectionSizeChange** (Code: 131 / `131` / `0x83`) -- Invalid collection size change
- **invalidBubblegumSigner** (Code: 132 / `132` / `0x84`) -- Invalid bubblegum signer
- **escrowParentHasDelegate** (Code: 133 / `133` / `0x85`) -- Escrow parent cannot have a delegate
- **mintIsNotSigner** (Code: 134 / `134` / `0x86`) -- Mint needs to be signer to initialize the account
- **invalidTokenStandard** (Code: 135 / `135` / `0x87`) -- Invalid token standard
- **invalidMintForTokenStandard** (Code: 136 / `136` / `0x88`) -- Invalid mint account for specified token standard
- **invalidAuthorizationRules** (Code: 137 / `137` / `0x89`) -- Invalid authorization rules account
- **missingAuthorizationRules** (Code: 138 / `138` / `0x8a`) -- Missing authorization rules account
- **missingProgrammableConfig** (Code: 139 / `139` / `0x8b`) -- Missing programmable configuration
- **invalidProgrammableConfig** (Code: 140 / `140` / `0x8c`) -- Invalid programmable configuration
- **delegateAlreadyExists** (Code: 141 / `141` / `0x8d`) -- Delegate already exists
- **delegateNotFound** (Code: 142 / `142` / `0x8e`) -- Delegate not found
- **missingAccountInBuilder** (Code: 143 / `143` / `0x8f`) -- Required account not set in instruction builder
- **missingArgumentInBuilder** (Code: 144 / `144` / `0x90`) -- Required argument not set in instruction builder
- **featureNotSupported** (Code: 145 / `145` / `0x91`) -- Feature not supported currently
- **invalidSystemWallet** (Code: 146 / `146` / `0x92`) -- Invalid system wallet
- **onlySaleDelegateCanTransfer** (Code: 147 / `147` / `0x93`) -- Only the sale delegate can transfer while its set
- **missingTokenAccount** (Code: 148 / `148` / `0x94`) -- Missing token account
- **missingSplTokenProgram** (Code: 149 / `149` / `0x95`) -- Missing SPL token program
- **missingAuthorizationRulesProgram** (Code: 150 / `150` / `0x96`) -- Missing authorization rules program
- **invalidDelegateRoleForTransfer** (Code: 151 / `151` / `0x97`) -- Invalid delegate role for transfer
- **invalidTransferAuthority** (Code: 152 / `152` / `0x98`) -- Invalid transfer authority
- **instructionNotSupported** (Code: 153 / `153` / `0x99`) -- Instruction not supported for ProgrammableNonFungible assets
- **keyMismatch** (Code: 154 / `154` / `0x9a`) -- Public key does not match expected value
- **lockedToken** (Code: 155 / `155` / `0x9b`) -- Token is locked
- **unlockedToken** (Code: 156 / `156` / `0x9c`) -- Token is unlocked
- **missingDelegateRole** (Code: 157 / `157` / `0x9d`) -- Missing delegate role
- **invalidAuthorityType** (Code: 158 / `158` / `0x9e`) -- Invalid authority type
- **missingTokenRecord** (Code: 159 / `159` / `0x9f`) -- Missing token record account
- **mintSupplyMustBeZero** (Code: 160 / `160` / `0xa0`) -- Mint supply must be zero for programmable assets
- **dataIsEmptyOrZeroed** (Code: 161 / `161` / `0xa1`) -- Data is empty or zeroed
- **missingTokenOwnerAccount** (Code: 162 / `162` / `0xa2`) -- Missing token owner
- **invalidMasterEditionAccountLength** (Code: 163 / `163` / `0xa3`) -- Master edition account has an invalid length
- **incorrectTokenState** (Code: 164 / `164` / `0xa4`) -- Incorrect token state
- **invalidDelegateRole** (Code: 165 / `165` / `0xa5`) -- Invalid delegate role
- **missingPrintSupply** (Code: 166 / `166` / `0xa6`) -- Print supply is required for non-fungibles
- **missingMasterEditionAccount** (Code: 167 / `167` / `0xa7`) -- Missing master edition account
- **amountMustBeGreaterThanZero** (Code: 168 / `168` / `0xa8`) -- Amount must be greater than zero
- **invalidDelegateArgs** (Code: 169 / `169` / `0xa9`) -- Invalid delegate args
- **missingLockedTransferAddress** (Code: 170 / `170` / `0xaa`) -- Missing address for locked transfer
- **invalidLockedTransferAddress** (Code: 171 / `171` / `0xab`) -- Invalid destination address for locked transfer
- **dataIncrementLimitExceeded** (Code: 172 / `172` / `0xac`) -- Exceeded account realloc increase limit
- **cannotUpdateAssetWithDelegate** (Code: 173 / `173` / `0xad`) -- Cannot update the rule set of a programmable asset that has a delegate
- **invalidAmount** (Code: 174 / `174` / `0xae`) -- Invalid token amount for this operation or token standard
- **missingMasterEditionMintAccount** (Code: 175 / `175` / `0xaf`) -- Missing master edition mint account
- **missingMasterEditionTokenAccount** (Code: 176 / `176` / `0xb0`) -- Missing master edition token account
- **missingEditionMarkerAccount** (Code: 177 / `177` / `0xb1`) -- Missing edition marker account
- **cannotBurnWithDelegate** (Code: 178 / `178` / `0xb2`) -- Cannot burn while persistent delegate is set
- **missingEdition** (Code: 179 / `179` / `0xb3`) -- Missing edition account
- **invalidAssociatedTokenAccountProgram** (Code: 180 / `180` / `0xb4`) -- Invalid Associated Token Account Program
- **invalidInstructionsSysvar** (Code: 181 / `181` / `0xb5`) -- Invalid InstructionsSysvar
- **invalidParentAccounts** (Code: 182 / `182` / `0xb6`) -- Invalid or Unneeded parent accounts
- **invalidUpdateArgs** (Code: 183 / `183` / `0xb7`) -- Authority cannot apply all update args
- **insufficientTokenBalance** (Code: 184 / `184` / `0xb8`) -- Token account does not have enough tokens
- **missingCollectionMint** (Code: 185 / `185` / `0xb9`) -- Missing collection account
- **missingCollectionMasterEdition** (Code: 186 / `186` / `0xba`) -- Missing collection master edition account
- **invalidTokenRecord** (Code: 187 / `187` / `0xbb`) -- Invalid token record account
- **invalidCloseAuthority** (Code: 188 / `188` / `0xbc`) -- The close authority needs to be revoked by the Utility Delegate
- **invalidInstruction** (Code: 189 / `189` / `0xbd`) -- Invalid or removed instruction
- **missingDelegateRecord** (Code: 190 / `190` / `0xbe`) -- Missing delegate record
- **invalidFeeAccount** (Code: 191 / `191` / `0xbf`) --
- **invalidMetadataFlags** (Code: 192 / `192` / `0xc0`) --
- **cannotChangeUpdateAuthorityWithDelegate** (Code: 193 / `193` / `0xc1`) -- Cannot change the update authority with a delegate
- **invalidMintExtensionType** (Code: 194 / `194` / `0xc2`) -- Invalid mint extension type
- **invalidMintCloseAuthority** (Code: 195 / `195` / `0xc3`) -- Invalid mint close authority
- **invalidMetadataPointer** (Code: 196 / `196` / `0xc4`) -- Invalid metadata pointer
- **invalidTokenExtensionType** (Code: 197 / `197` / `0xc5`) -- Invalid token extension type
- **missingImmutableOwnerExtension** (Code: 198 / `198` / `0xc6`) -- Missing immutable owner extension
- **expectedUninitializedAccount** (Code: 199 / `199` / `0xc7`) -- Expected account to be uninitialized
- **invalidEditionAccountLength** (Code: 200 / `200` / `0xc8`) -- Edition account has an invalid length
- **accountAlreadyResized** (Code: 201 / `201` / `0xc9`) -- Account has already been resized
- **conditionsForClosingNotMet** (Code: 202 / `202` / `0xca`) -- Conditions for closing not met
