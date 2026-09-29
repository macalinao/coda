# Spl Governance Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fspl-governance.svg)](https://www.npmjs.com/package/%40solana-programs%2Fspl-governance)

- Program ID: `GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw`
- TypeScript Client: [`@solana-programs/spl-governance`](https://www.npmjs.com/package/@solana-programs/spl-governance)

## Table of Contents

- [Accounts](#accounts)
  - [governanceV2](#governanceV2)
  - [realmV1](#realmV1)
  - [tokenOwnerRecordV1](#tokenOwnerRecordV1)
  - [governanceV1](#governanceV1)
  - [proposalV1](#proposalV1)
  - [signatoryRecordV1](#signatoryRecordV1)
  - [proposalInstructionV1](#proposalInstructionV1)
  - [voteRecordV1](#voteRecordV1)
  - [programMetadata](#programMetadata)
  - [proposalV2](#proposalV2)
  - [proposalDeposit](#proposalDeposit)
  - [proposalTransactionV2](#proposalTransactionV2)
  - [realmV2](#realmV2)
  - [realmConfigAccount](#realmConfigAccount)
  - [requiredSignatory](#requiredSignatory)
  - [signatoryRecordV2](#signatoryRecordV2)
  - [tokenOwnerRecordV2](#tokenOwnerRecordV2)
  - [legacyTokenOwnerRecord](#legacyTokenOwnerRecord)
  - [voteRecordV2](#voteRecordV2)
- [Instructions](#instructions)
  - [createRealm](#createRealm)
  - [depositGoverningTokens](#depositGoverningTokens)
  - [withdrawGoverningTokens](#withdrawGoverningTokens)
  - [setGovernanceDelegate](#setGovernanceDelegate)
  - [createGovernance](#createGovernance)
  - [createProgramGovernance](#createProgramGovernance)
  - [createProposal](#createProposal)
  - [addSignatory](#addSignatory)
  - [legacy1](#legacy1)
  - [insertTransaction](#insertTransaction)
  - [removeTransaction](#removeTransaction)
  - [cancelProposal](#cancelProposal)
  - [signOffProposal](#signOffProposal)
  - [castVote](#castVote)
  - [finalizeVote](#finalizeVote)
  - [relinquishVote](#relinquishVote)
  - [executeTransaction](#executeTransaction)
  - [createMintGovernance](#createMintGovernance)
  - [createTokenGovernance](#createTokenGovernance)
  - [setGovernanceConfig](#setGovernanceConfig)
  - [flagTransactionError](#flagTransactionError)
  - [setRealmAuthority](#setRealmAuthority)
  - [setRealmConfig](#setRealmConfig)
  - [createTokenOwnerRecord](#createTokenOwnerRecord)
  - [updateProgramMetadata](#updateProgramMetadata)
  - [createNativeTreasury](#createNativeTreasury)
  - [revokeGoverningTokens](#revokeGoverningTokens)
  - [refundProposalDeposit](#refundProposalDeposit)
  - [completeProposal](#completeProposal)
  - [addRequiredSignatory](#addRequiredSignatory)
  - [removeRequiredSignatory](#removeRequiredSignatory)
- [PDAs](#pdas)
  - [realm](#realm)
  - [communityTokenHolding](#communityTokenHolding)
  - [councilTokenHolding](#councilTokenHolding)
  - [realmConfig](#realmConfig)
  - [tokenOwnerRecord](#tokenOwnerRecord)
  - [governingTokenHolding](#governingTokenHolding)
  - [governance](#governance)
  - [nativeTreasury](#nativeTreasury)
  - [proposal](#proposal)
  - [proposalDeposit](#proposalDeposit)
  - [signatoryRecord](#signatoryRecord)
  - [proposalTransaction](#proposalTransaction)
  - [voteRecord](#voteRecord)
  - [requiredSignatory](#requiredSignatory)
- [Types](#types)
  - [governanceConfig](#governanceConfig)
  - [nativeTreasury](#nativeTreasury)
  - [proposalOption](#proposalOption)
  - [instructionData](#instructionData)
  - [accountMetaData](#accountMetaData)
  - [realmConfigParams](#realmConfigParams)
  - [governingTokenConfigParams](#governingTokenConfigParams)
  - [governingTokenConfigAccountArgs](#governingTokenConfigAccountArgs)
  - [realmConfig](#realmConfig)
  - [realmConfigParamsV1](#realmConfigParamsV1)
  - [governingTokenConfig](#governingTokenConfig)
  - [voteChoice](#voteChoice)
  - [reserved110](#reserved110)
  - [reserved119](#reserved119)
  - [governanceAccountType](#governanceAccountType)
  - [proposalState](#proposalState)
  - [voteThreshold](#voteThreshold)
  - [voteTipping](#voteTipping)
  - [transactionExecutionStatus](#transactionExecutionStatus)
  - [instructionExecutionFlags](#instructionExecutionFlags)
  - [mintMaxVoterWeightSource](#mintMaxVoterWeightSource)
  - [voteWeightV1](#voteWeightV1)
  - [optionVoteResult](#optionVoteResult)
  - [voteType](#voteType)
  - [multiChoiceType](#multiChoiceType)
  - [setRealmAuthorityAction](#setRealmAuthorityAction)
  - [governanceInstructionV1](#governanceInstructionV1)
  - [governingTokenType](#governingTokenType)
  - [vote](#vote)
  - [voteKind](#voteKind)
  - [unixTimestamp](#unixTimestamp)
  - [slot](#slot)
- [Errors](#errors)

## Accounts

### governanceV2

**Fields:**

| Field                      | Type                                              | Description |
| -------------------------- | ------------------------------------------------- | ----------- |
| `accountType`              | [governanceAccountType](#governanceAccountType-3) | -           |
| `realm`                    | `PublicKey`                                       | -           |
| `governedAccount`          | `PublicKey`                                       | -           |
| `reserved1`                | `u32`                                             | -           |
| `config`                   | [governanceConfig](#governanceConfig-3)           | -           |
| `reservedV2`               | [reserved119](#reserved119-3)                     | -           |
| `requiredSignatoriesCount` | `u8`                                              | -           |
| `activeProposalCount`      | `u64`                                             | -           |

### realmV1

**Fields:**

| Field                 | Type                                              | Description |
| --------------------- | ------------------------------------------------- | ----------- |
| `accountType`         | [governanceAccountType](#governanceAccountType-3) | -           |
| `communityMint`       | `PublicKey`                                       | -           |
| `config`              | [realmConfig](#realmConfig-3)                     | -           |
| `reserved`            | `u8`[6]                                           | -           |
| `votingProposalCount` | `u16`                                             | -           |
| `authority`           | `PublicKey`                                       | null        | -   |
| `name`                | `unknown`                                         | -           |

### tokenOwnerRecordV1

**Fields:**

| Field                         | Type                                              | Description |
| ----------------------------- | ------------------------------------------------- | ----------- |
| `accountType`                 | [governanceAccountType](#governanceAccountType-3) | -           |
| `realm`                       | `PublicKey`                                       | -           |
| `governingTokenMint`          | `PublicKey`                                       | -           |
| `governingTokenOwner`         | `PublicKey`                                       | -           |
| `governingTokenDepositAmount` | `u64`                                             | -           |
| `unrelinquishedVotesCount`    | `u64`                                             | -           |
| `outstandingProposalCount`    | `u8`                                              | -           |
| `version`                     | `u8`                                              | -           |
| `reserved`                    | `u8`[6]                                           | -           |
| `governanceDelegate`          | `PublicKey`                                       | null        | -   |

### governanceV1

**Fields:**

| Field             | Type                                              | Description |
| ----------------- | ------------------------------------------------- | ----------- |
| `accountType`     | [governanceAccountType](#governanceAccountType-3) | -           |
| `realm`           | `PublicKey`                                       | -           |
| `governedAccount` | `PublicKey`                                       | -           |
| `proposalsCount`  | `u32`                                             | -           |
| `config`          | [governanceConfig](#governanceConfig-3)           | -           |

### proposalV1

**Fields:**

| Field                       | Type                                                      | Description |
| --------------------------- | --------------------------------------------------------- | ----------- |
| `accountType`               | [governanceAccountType](#governanceAccountType-3)         | -           |
| `governance`                | `PublicKey`                                               | -           |
| `governingTokenMint`        | `PublicKey`                                               | -           |
| `state`                     | [proposalState](#proposalState-3)                         | -           |
| `tokenOwnerRecord`          | `PublicKey`                                               | -           |
| `signatoriesCount`          | `u8`                                                      | -           |
| `signatoriesSignedOffCount` | `u8`                                                      | -           |
| `yesVotesCount`             | `u64`                                                     | -           |
| `noVotesCount`              | `u64`                                                     | -           |
| `instructionsExecutedCount` | `u16`                                                     | -           |
| `instructionsCount`         | `u16`                                                     | -           |
| `instructionsNextIndex`     | `u16`                                                     | -           |
| `draftAt`                   | [unixTimestamp](#unixTimestamp-3)                         | -           |
| `signingOffAt`              | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `votingAt`                  | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `votingAtSlot`              | [slot](#slot-3)                                           | null        | -   |
| `votingCompletedAt`         | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `executingAt`               | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `closedAt`                  | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `executionFlags`            | [instructionExecutionFlags](#instructionExecutionFlags-3) | -           |
| `maxVoteWeight`             | `u64`                                                     | null        | -   |
| `voteThreshold`             | [voteThreshold](#voteThreshold-3)                         | null        | -   |
| `name`                      | `unknown`                                                 | -           |
| `descriptionLink`           | `unknown`                                                 | -           |

### signatoryRecordV1

**Fields:**

| Field         | Type                                              | Description |
| ------------- | ------------------------------------------------- | ----------- |
| `accountType` | [governanceAccountType](#governanceAccountType-3) | -           |
| `proposal`    | `PublicKey`                                       | -           |
| `signatory`   | `PublicKey`                                       | -           |
| `signedOff`   | `boolean`                                         | -           |

### proposalInstructionV1

**Fields:**

| Field              | Type                                                        | Description |
| ------------------ | ----------------------------------------------------------- | ----------- |
| `accountType`      | [governanceAccountType](#governanceAccountType-3)           | -           |
| `proposal`         | `PublicKey`                                                 | -           |
| `instructionIndex` | `u16`                                                       | -           |
| `holdUpTime`       | `u32`                                                       | -           |
| `instruction`      | [instructionData](#instructionData-3)                       | -           |
| `executedAt`       | [unixTimestamp](#unixTimestamp-3)                           | null        | -   |
| `executionStatus`  | [transactionExecutionStatus](#transactionExecutionStatus-3) | -           |

### voteRecordV1

**Fields:**

| Field                 | Type                                              | Description |
| --------------------- | ------------------------------------------------- | ----------- |
| `accountType`         | [governanceAccountType](#governanceAccountType-3) | -           |
| `proposal`            | `PublicKey`                                       | -           |
| `governingTokenOwner` | `PublicKey`                                       | -           |
| `isRelinquished`      | `boolean`                                         | -           |
| `voteWeight`          | [voteWeightV1](#voteWeightV1-3)                   | -           |

### programMetadata

**Fields:**

| Field         | Type                                              | Description |
| ------------- | ------------------------------------------------- | ----------- |
| `accountType` | [governanceAccountType](#governanceAccountType-3) | -           |
| `updatedAt`   | [slot](#slot-3)                                   | -           |
| `version`     | `unknown`                                         | -           |
| `reserved`    | `u8`[64]                                          | -           |

### proposalV2

**Fields:**

| Field                       | Type                                                      | Description |
| --------------------------- | --------------------------------------------------------- | ----------- |
| `accountType`               | [governanceAccountType](#governanceAccountType-3)         | -           |
| `governance`                | `PublicKey`                                               | -           |
| `governingTokenMint`        | `PublicKey`                                               | -           |
| `state`                     | [proposalState](#proposalState-3)                         | -           |
| `tokenOwnerRecord`          | `PublicKey`                                               | -           |
| `signatoriesCount`          | `u8`                                                      | -           |
| `signatoriesSignedOffCount` | `u8`                                                      | -           |
| `voteType`                  | [voteType](#voteType-3)                                   | -           |
| `options`                   | [proposalOption](#proposalOption-3)[]                     | -           |
| `denyVoteWeight`            | `u64`                                                     | null        | -   |
| `reserved1`                 | `u8`                                                      | -           |
| `abstainVoteWeight`         | `u64`                                                     | null        | -   |
| `startVotingAt`             | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `draftAt`                   | [unixTimestamp](#unixTimestamp-3)                         | -           |
| `signingOffAt`              | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `votingAt`                  | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `votingAtSlot`              | [slot](#slot-3)                                           | null        | -   |
| `votingCompletedAt`         | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `executingAt`               | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `closedAt`                  | [unixTimestamp](#unixTimestamp-3)                         | null        | -   |
| `executionFlags`            | [instructionExecutionFlags](#instructionExecutionFlags-3) | -           |
| `maxVoteWeight`             | `u64`                                                     | null        | -   |
| `maxVotingTime`             | `u32`                                                     | null        | -   |
| `voteThreshold`             | [voteThreshold](#voteThreshold-3)                         | null        | -   |
| `reserved`                  | `u8`[64]                                                  | -           |
| `name`                      | `unknown`                                                 | -           |
| `descriptionLink`           | `unknown`                                                 | -           |
| `vetoVoteWeight`            | `u64`                                                     | -           |

### proposalDeposit

**Fields:**

| Field          | Type                                              | Description |
| -------------- | ------------------------------------------------- | ----------- |
| `accountType`  | [governanceAccountType](#governanceAccountType-3) | -           |
| `proposal`     | `PublicKey`                                       | -           |
| `depositPayer` | `PublicKey`                                       | -           |
| `reserved`     | `u8`[64]                                          | -           |

### proposalTransactionV2

**Fields:**

| Field              | Type                                                        | Description |
| ------------------ | ----------------------------------------------------------- | ----------- |
| `accountType`      | [governanceAccountType](#governanceAccountType-3)           | -           |
| `proposal`         | `PublicKey`                                                 | -           |
| `optionIndex`      | `u8`                                                        | -           |
| `transactionIndex` | `u16`                                                       | -           |
| `holdUpTime`       | `u32`                                                       | -           |
| `instructions`     | [instructionData](#instructionData-3)[]                     | -           |
| `executedAt`       | [unixTimestamp](#unixTimestamp-3)                           | null        | -   |
| `executionStatus`  | [transactionExecutionStatus](#transactionExecutionStatus-3) | -           |
| `reservedV2`       | `u8`[8]                                                     | -           |

### realmV2

**Fields:**

| Field           | Type                                              | Description |
| --------------- | ------------------------------------------------- | ----------- |
| `accountType`   | [governanceAccountType](#governanceAccountType-3) | -           |
| `communityMint` | `PublicKey`                                       | -           |
| `config`        | [realmConfig](#realmConfig-3)                     | -           |
| `reserved`      | `u8`[6]                                           | -           |
| `legacy1`       | `u16`                                             | -           |
| `authority`     | `PublicKey`                                       | null        | -   |
| `name`          | `unknown`                                         | -           |
| `reservedV2`    | `u8`[128]                                         | -           |

### realmConfigAccount

**Fields:**

| Field                  | Type                                              | Description |
| ---------------------- | ------------------------------------------------- | ----------- |
| `accountType`          | [governanceAccountType](#governanceAccountType-3) | -           |
| `realm`                | `PublicKey`                                       | -           |
| `communityTokenConfig` | [governingTokenConfig](#governingTokenConfig-3)   | -           |
| `councilTokenConfig`   | [governingTokenConfig](#governingTokenConfig-3)   | -           |
| `reserved`             | [reserved110](#reserved110-3)                     | -           |

### requiredSignatory

**Fields:**

| Field            | Type                                              | Description |
| ---------------- | ------------------------------------------------- | ----------- |
| `accountType`    | [governanceAccountType](#governanceAccountType-3) | -           |
| `accountVersion` | `u8`                                              | -           |
| `governance`     | `PublicKey`                                       | -           |
| `signatory`      | `PublicKey`                                       | -           |

### signatoryRecordV2

**Fields:**

| Field         | Type                                              | Description |
| ------------- | ------------------------------------------------- | ----------- |
| `accountType` | [governanceAccountType](#governanceAccountType-3) | -           |
| `proposal`    | `PublicKey`                                       | -           |
| `signatory`   | `PublicKey`                                       | -           |
| `signedOff`   | `boolean`                                         | -           |
| `reservedV2`  | `u8`[8]                                           | -           |

### tokenOwnerRecordV2

**Fields:**

| Field                         | Type                                              | Description |
| ----------------------------- | ------------------------------------------------- | ----------- |
| `accountType`                 | [governanceAccountType](#governanceAccountType-3) | -           |
| `realm`                       | `PublicKey`                                       | -           |
| `governingTokenMint`          | `PublicKey`                                       | -           |
| `governingTokenOwner`         | `PublicKey`                                       | -           |
| `governingTokenDepositAmount` | `u64`                                             | -           |
| `unrelinquishedVotesCount`    | `u64`                                             | -           |
| `outstandingProposalCount`    | `u8`                                              | -           |
| `version`                     | `u8`                                              | -           |
| `reserved`                    | `u8`[6]                                           | -           |
| `governanceDelegate`          | `PublicKey`                                       | null        | -   |
| `reservedV2`                  | `u8`[128]                                         | -           |

### legacyTokenOwnerRecord

**Fields:**

| Field                         | Type                                              | Description |
| ----------------------------- | ------------------------------------------------- | ----------- |
| `accountType`                 | [governanceAccountType](#governanceAccountType-3) | -           |
| `realm`                       | `PublicKey`                                       | -           |
| `governingTokenMint`          | `PublicKey`                                       | -           |
| `governingTokenOwner`         | `PublicKey`                                       | -           |
| `governingTokenDepositAmount` | `u64`                                             | -           |
| `unrelinquishedVotesCount`    | `u32`                                             | -           |
| `totalVotesCount`             | `u32`                                             | -           |
| `outstandingProposalCount`    | `u8`                                              | -           |
| `reserved`                    | `u8`[7]                                           | -           |
| `governanceDelegate`          | `PublicKey`                                       | null        | -   |
| `reservedV2`                  | `u8`[128]                                         | -           |

### voteRecordV2

**Fields:**

| Field                 | Type                                              | Description |
| --------------------- | ------------------------------------------------- | ----------- |
| `accountType`         | [governanceAccountType](#governanceAccountType-3) | -           |
| `proposal`            | `PublicKey`                                       | -           |
| `governingTokenOwner` | `PublicKey`                                       | -           |
| `isRelinquished`      | `boolean`                                         | -           |
| `voterWeight`         | `u64`                                             | -           |
| `vote`                | [vote](#vote-3)                                   | -           |
| `reservedV2`          | `u8`[8]                                           | -           |

## Instructions

### createRealm

**Accounts:**

| Account                        | Type               | Description                                                                               |
| ------------------------------ | ------------------ | ----------------------------------------------------------------------------------------- |
| `realmAccount`                 | writable           | Governance Realm account                                                                  |
| `realmAuthority`               | readonly           | The authority of the Realm                                                                |
| `communityTokenMint`           | readonly           | The mint address of the token to be used as the community mint                            |
| `communityTokenHoldingAccount` | writable           | The account to hold the community tokens. PDA seeds=['governance', realm, community_mint] |
| `payer`                        | signer, writable   | the payer of this transaction                                                             |
| `systemProgram`                | readonly           | System Program                                                                            |
| `tokenProgram`                 | readonly           | SPL Token Program                                                                         |
| `rent`                         | readonly           | SysVar Rent                                                                               |
| `councilTokenMint`             | optional           | The mint address of the token to be used as the council mint                              |
| `councilTokenHoldingAccount`   | writable, optional | The account to hold the council tokens. PDA seeds: ['governance',realm,council_mint]      |
| `realmConfig`                  | writable           | Realm Config account                                                                      |
| `communityVoterWeightAddin`    | optional           | Optional Community Voter Weight Addin Program Id                                          |
| `maxCommunityVoterWeightAddin` | optional           | Optional Max Community Voter Weight Addin Program Id                                      |
| `councilVoterWeightAddin`      | optional           | Optional Council Voter Weight Addin Program Id                                            |
| `maxCouncilVoterWeightAddin`   | optional           | Optional Max Council Voter Weight Addin Program Id                                        |

**Arguments:**

| Argument        | Type                                      | Description |
| --------------- | ----------------------------------------- | ----------- |
| `discriminator` | `u8`                                      | -           |
| `name`          | `unknown`                                 | -           |
| `configArgs`    | [realmConfigParams](#realmConfigParams-3) | -           |

### depositGoverningTokens

**Accounts:**

| Account                                | Type             | Description                                                                                                         |
| -------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `realmAccount`                         | readonly         | -                                                                                                                   |
| `governingTokenHoldingAccount`         | writable         | seeds=['governance', realm, governing_token_mint]                                                                   |
| `governingTokenSourceAccount`          | writable         | It can either be spl-token TokenAccount or MintAccount. Tokens will be transferred or minted to the holding account |
| `governingTokenOwnerAccount`           | signer           | -                                                                                                                   |
| `governingTokenSourceAccountAuthority` | signer           | It should be owner for TokenAccount and mint_authority for MintAccount                                              |
| `tokenOwnerRecord`                     | writable         | seeds=['governance', realm, governing_token_mint, governing_token_owner]                                            |
| `payer`                                | signer, writable | -                                                                                                                   |
| `systemProgram`                        | readonly         | -                                                                                                                   |
| `tokenProgram`                         | readonly         | -                                                                                                                   |
| `realmConfigAccount`                   | readonly         | seeds=['realm-config', realm]                                                                                       |

**Arguments:**

| Argument        | Type  | Description |
| --------------- | ----- | ----------- |
| `discriminator` | `u8`  | -           |
| `amount`        | `u64` | -           |

### withdrawGoverningTokens

**Accounts:**

| Account                            | Type     | Description                                                             |
| ---------------------------------- | -------- | ----------------------------------------------------------------------- |
| `realmAccount`                     | readonly | -                                                                       |
| `governingTokenHoldingAccount`     | writable | seeds=['governance', realm, governing_token_mint]                       |
| `governingTokenDestinationAccount` | writable | All tokens will be transferred to this account                          |
| `governingTokenOwnerAccount`       | signer   | -                                                                       |
| `tokenOwnerRecord`                 | writable | seeds=['governance',realm, governing_token_mint, governing_token_owner] |
| `tokenProgram`                     | readonly | -                                                                       |
| `realmConfigAccount`               | readonly | seeds=['realm-config', realm]                                           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### setGovernanceDelegate

**Accounts:**

| Account                  | Type     | Description                                          |
| ------------------------ | -------- | ---------------------------------------------------- |
| `currentDelegateOrOwner` | signer   | Current governance delegate or governing token owner |
| `tokenOwnerRecord`       | writable | -                                                    |

**Arguments:**

| Argument                | Type        | Description |
| ----------------------- | ----------- | ----------- |
| `discriminator`         | `u8`        | -           |
| `newGovernanceDelegate` | `PublicKey` | null        | -   |

### createGovernance

**Accounts:**

| Account                     | Type     | Description                                                                                                                                                             |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `realmAccount`              | readonly | Realm account the created governance belongs to                                                                                                                         |
| `governanceAccount`         | writable | seeds=['account-governance', realm, governed_account]                                                                                                                   |
| `governedAccount`           | readonly | Account governed by this Governance (governing_account). Note: the account doesn't have to exist and can be used only as a unique identified for the Governance account |
| `governingTokenOwnerRecord` | readonly | Used only if not signed by RealmAuthority                                                                                                                               |
| `payer`                     | signer   | -                                                                                                                                                                       |
| `systemProgram`             | readonly | -                                                                                                                                                                       |
| `governanceAuthority`       | signer   | -                                                                                                                                                                       |
| `realmConfigAccount`        | readonly | seeds=['realm-config', realm]                                                                                                                                           |
| `voterWeightRecord`         | optional | Optional Voter Weight Record                                                                                                                                            |

**Arguments:**

| Argument        | Type                                    | Description |
| --------------- | --------------------------------------- | ----------- |
| `discriminator` | `u8`                                    | -           |
| `config`        | [governanceConfig](#governanceConfig-3) | -           |

### createProgramGovernance

**Accounts:**

| Account                       | Type     | Description                                                                          |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `realmAccount`                | readonly | Realm account the created Governance belongs to                                      |
| `programGovernanceAccount`    | writable | Program Governance account. seeds: ['program-governance', realm, governed_program]   |
| `governedProgram`             | readonly | Program governed by this Governance account                                          |
| `programData`                 | writable | Program Data account of the Program governed by this Governance account              |
| `currentUpgradeAuthority`     | signer   | Current Upgrade Authority account of the Program governed by this Governance account |
| `governingTokenOwnerRecord`   | readonly | Governing TokenOwnerRecord account (Used only if not signed by RealmAuthority)       |
| `payer`                       | signer   | -                                                                                    |
| `bpfUpgradeableLoaderProgram` | readonly | bpf_upgradeable_loader_program program                                               |
| `systemProgram`               | readonly | -                                                                                    |
| `governanceAuthority`         | signer   | -                                                                                    |
| `realmConfig`                 | readonly | RealmConfig account. seeds=['realm-config', realm]                                   |
| `voterWeightRecord`           | optional | Optional Voter Weight Record                                                         |

**Arguments:**

| Argument                   | Type                                    | Description |
| -------------------------- | --------------------------------------- | ----------- |
| `discriminator`            | `u8`                                    | -           |
| `config`                   | [governanceConfig](#governanceConfig-3) | -           |
| `transferUpgradeAuthority` | `boolean`                               | -           |

### createProposal

**Accounts:**

| Account                  | Type               | Description                                                                                                                                                                    |
| ------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `realmAccount`           | readonly           | Realm account the created Proposal belongs to                                                                                                                                  |
| `proposalAccount`        | writable           | Proposal account. PDA seeds ['governance',governance, governing_token_mint, proposal_index]                                                                                    |
| `governanceAccount`      | writable           | Governance account                                                                                                                                                             |
| `tokenOwnerRecord`       | writable           | TokenOwnerRecord account of the Proposal owner                                                                                                                                 |
| `governingTokenMint`     | readonly           | Token Mint the Proposal is created for                                                                                                                                         |
| `governanceAuthority`    | signer             | Governance Authority (Token Owner or Governance Delegate)                                                                                                                      |
| `payer`                  | signer             | -                                                                                                                                                                              |
| `systemProgram`          | readonly           | -                                                                                                                                                                              |
| `realmConfig`            | readonly           | RealmConfig account. PDA seeds: ['realm-config', realm]                                                                                                                        |
| `voterWeightRecord`      | writable, optional | Optional Voter Weight Record                                                                                                                                                   |
| `proposalDepositAccount` | optional           | Optional Proposal deposit is required when there are more active proposals than the configured deposit exempt amount. PDA seeds: ['proposal-deposit', proposal, deposit payer] |

**Arguments:**

| Argument          | Type                    | Description |
| ----------------- | ----------------------- | ----------- |
| `discriminator`   | `u8`                    | -           |
| `name`            | `unknown`               | -           |
| `descriptionLink` | `unknown`               | -           |
| `voteType`        | [voteType](#voteType-3) | -           |
| `options`         | `unknown`[]             | -           |
| `useDenyOption`   | `boolean`               | -           |
| `proposalSeed`    | `PublicKey`             | -           |

### addSignatory

**Accounts:**

| Account                  | Type     | Description                                               |
| ------------------------ | -------- | --------------------------------------------------------- |
| `proposalAccount`        | writable | Proposal Account associated with the governance           |
| `tokenOwnerRecord`       | readonly | TokenOwnerRecord account of the Proposal owner            |
| `governanceAuthority`    | signer   | Governance Authority (Token Owner or Governance Delegate) |
| `signatoryRecordAccount` | writable | Signatory Record Account                                  |
| `payer`                  | signer   | -                                                         |
| `systemProgram`          | readonly | -                                                         |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `u8`        | -           |
| `signatory`     | `PublicKey` | -           |

### legacy1

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### insertTransaction

**Accounts:**

| Account                      | Type     | Description                                                                            |
| ---------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `governanceAccount`          | readonly | -                                                                                      |
| `proposalAccount`            | writable | -                                                                                      |
| `tokenOwnerRecord`           | readonly | TokenOwnerRecord account of the Proposal owner                                         |
| `governanceAuthority`        | signer   | Governance Authority (Token Owner or Governance Delegate)                              |
| `proposalTransactionAccount` | writable | ProposalTransaction, account. PDA seeds: ['governance', proposal, option_index, index] |
| `payer`                      | signer   | -                                                                                      |
| `systemProgram`              | readonly | -                                                                                      |
| `rent`                       | readonly | -                                                                                      |

**Arguments:**

| Argument        | Type                                    | Description |
| --------------- | --------------------------------------- | ----------- |
| `discriminator` | `u8`                                    | -           |
| `optionIndex`   | `u8`                                    | -           |
| `index`         | `u16`                                   | -           |
| `holdUpTime`    | `u32`                                   | -           |
| `instructions`  | [instructionData](#instructionData-3)[] | -           |

### removeTransaction

**Accounts:**

| Account                      | Type     | Description                                                                                    |
| ---------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `proposalAccount`            | writable | -                                                                                              |
| `tokenOwnerRecord`           | readonly | TokenOwnerRecord account of the Proposal owner                                                 |
| `governanceAuthority`        | signer   | Governance Authority (Token Owner or Governance Delegate)                                      |
| `proposalTransactionAccount` | writable | -                                                                                              |
| `beneficiaryAccount`         | writable | Beneficiary Account which would receive lamports from the disposed ProposalTransaction account |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### cancelProposal

**Accounts:**

| Account               | Type     | Description                                               |
| --------------------- | -------- | --------------------------------------------------------- |
| `realmAccount`        | writable | -                                                         |
| `governanceAccount`   | writable | -                                                         |
| `proposalAccount`     | writable | -                                                         |
| `tokenOwnerRecord`    | writable | TokenOwnerRecord account of the Proposal owner            |
| `governanceAuthority` | signer   | Governance authority (Token Owner or Governance Delegate) |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### signOffProposal

**Accounts:**

| Account             | Type     | Description                                                                                                                                                                      |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `realmAccount`      | readonly | -                                                                                                                                                                                |
| `governanceAccount` | readonly | -                                                                                                                                                                                |
| `proposalAccount`   | writable | -                                                                                                                                                                                |
| `signatoryAccount`  | signer   | Signatory account signing off the Proposal. Or Proposal owner if the owner hasn't appointed any signatories                                                                      |
| `tokenOwnerRecord`  | writable | TokenOwnerRecord for the Proposal owner, required when the owner signs off the Proposal. Or `[writable]` SignatoryRecord account, required when non owner signs off the Proposal |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### castVote

**Accounts:**

| Account                    | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `realmAccount`             | readonly | -                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `governanceAccount`        | writable | -                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `proposalAccount`          | writable | -                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `proposalTokenOwnerRecord` | writable | TokenOwnerRecord of the Proposal owner                                                                                                                                                                                                                                                                                                                                                                                           |
| `voterTokenOwnerRecord`    | writable | TokenOwnerRecord of the voter. PDA seeds: ['governance',realm, vote_governing_token_mint, governing_token_owner]                                                                                                                                                                                                                                                                                                                 |
| `governanceAuthority`      | signer   | Governance Authority (Token Owner or Governance Delegate)                                                                                                                                                                                                                                                                                                                                                                        |
| `proposalVoteRecord`       | writable | Proposal VoteRecord account. PDA seeds: ['governance',proposal,token_owner_record]                                                                                                                                                                                                                                                                                                                                               |
| `governingTokenMint`       | readonly | The Governing Token Mint which is used to cast the vote (vote_governing_token_mint). The voting token mint is the governing_token_mint of the Proposal for Approve, Deny and Abstain votes. For Veto vote the voting token mint is the mint of the opposite voting population. Council mint to veto Community proposals and Community mint to veto Council proposals Note: In the current version only Council veto is supported |
| `payer`                    | signer   | -                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `systemProgram`            | readonly | -                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `realmConfigAccount`       | readonly | RealmConfig account. PDA seeds: ['realm-config', realm]                                                                                                                                                                                                                                                                                                                                                                          |
| `voterWeightRecord`        | optional | Optional Voter Weight Record                                                                                                                                                                                                                                                                                                                                                                                                     |
| `maxVoterWeightRecord`     | optional | Optional Max Voter Weight Record                                                                                                                                                                                                                                                                                                                                                                                                 |

**Arguments:**

| Argument        | Type            | Description |
| --------------- | --------------- | ----------- |
| `discriminator` | `u8`            | -           |
| `vote`          | [vote](#vote-3) | -           |

### finalizeVote

**Accounts:**

| Account                | Type     | Description                                             |
| ---------------------- | -------- | ------------------------------------------------------- |
| `realmAccount`         | readonly | -                                                       |
| `governanceAccount`    | writable | -                                                       |
| `proposalAccount`      | writable | -                                                       |
| `tokenOwnerRecord`     | writable | TokenOwnerRecord of the Proposal owner                  |
| `governingTokenMint`   | readonly | -                                                       |
| `realmConfig`          | readonly | RealmConfig account. PDA seeds: ['realm-config', realm] |
| `maxVoterWeightRecord` | optional | Optional Max Voter Weight Record                        |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### relinquishVote

**Accounts:**

| Account               | Type               | Description                                                                                                                                             |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `realmAccount`        | readonly           | -                                                                                                                                                       |
| `governanceAccount`   | readonly           | -                                                                                                                                                       |
| `proposalAccount`     | writable           | -                                                                                                                                                       |
| `tokenOwnerRecord`    | writable           | TokenOwnerRecord account. PDA seeds: ['governance',realm, vote_governing_token_mint, governing_token_owner]                                             |
| `proposalVoteRecord`  | writable           | Proposal VoteRecord account. PDA seeds: ['governance',proposal, token_owner_record]                                                                     |
| `governingTokenMint`  | readonly           | The Governing Token Mint which was used to cast the vote (vote_governing_token_mint)                                                                    |
| `governanceAuthority` | signer, optional   | -                                                                                                                                                       |
| `beneficiaryAccount`  | writable, optional | Optional Beneficiary account which would receive lamports when VoteRecord Account is disposed. It's required only when Proposal is still being voted on |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### executeTransaction

**Accounts:**

| Account                      | Type     | Description |
| ---------------------------- | -------- | ----------- |
| `governanceAccount`          | readonly | -           |
| `proposalAccount`            | writable | -           |
| `proposalTransactionAccount` | writable | -           |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### createMintGovernance

**Accounts:**

| Account                     | Type     | Description                                                                    |
| --------------------------- | -------- | ------------------------------------------------------------------------------ |
| `realmAccount`              | readonly | Realm account the created Governance belongs to                                |
| `mintGovernanceAccount`     | writable | Mint Governance account. seeds=['mint-governance', realm, governed_mint]       |
| `governedMint`              | writable | Mint governed by this Governance account                                       |
| `mintAuthority`             | signer   | Current Mint authority (MintTokens and optionally FreezeAccount)               |
| `governingTokenOwnerRecord` | readonly | Governing TokenOwnerRecord account (Used only if not signed by RealmAuthority) |
| `payer`                     | signer   | -                                                                              |
| `tokenProgram`              | readonly | -                                                                              |
| `systemProgram`             | readonly | -                                                                              |
| `governanceAuthority`       | signer   | -                                                                              |
| `realmConfig`               | readonly | RealmConfig account. seeds=['realm-config', realm]                             |
| `voterWeightRecord`         | optional | Optional Voter Weight Record                                                   |

**Arguments:**

| Argument                  | Type                                    | Description |
| ------------------------- | --------------------------------------- | ----------- |
| `discriminator`           | `u8`                                    | -           |
| `config`                  | [governanceConfig](#governanceConfig-3) | -           |
| `transferMintAuthorities` | `boolean`                               | -           |

### createTokenGovernance

**Accounts:**

| Account                     | Type     | Description                                                                   |
| --------------------------- | -------- | ----------------------------------------------------------------------------- |
| `realmAccount`              | readonly | Realm account the created Governance belongs to                               |
| `tokenGovernanceAccount`    | writable | Token Governance account. seeds=['token-governance', realm, governed_token]   |
| `tokenAccount`              | writable | Token account governed by this Governance account                             |
| `tokenAccountAuthority`     | signer   | Current token account authority (AccountOwner and optionally CloseAccount     |
| `governingTokenOwnerRecord` | readonly | Governing TokenOwnerRecord account (Used only if not signed by RealmAuthority |
| `payer`                     | signer   | -                                                                             |
| `tokenProgram`              | readonly | -                                                                             |
| `systemProgram`             | readonly | -                                                                             |
| `governanceAuthority`       | signer   | -                                                                             |
| `realmConfig`               | readonly | seeds=['realm-config', realm]                                                 |
| `voterWeightRecord`         | optional | Optional Voter Weight Record                                                  |

**Arguments:**

| Argument                     | Type                                    | Description |
| ---------------------------- | --------------------------------------- | ----------- |
| `discriminator`              | `u8`                                    | -           |
| `config`                     | [governanceConfig](#governanceConfig-3) | -           |
| `transferAccountAuthorities` | `boolean`                               | -           |

### setGovernanceConfig

**Accounts:**

| Account             | Type             | Description                              |
| ------------------- | ---------------- | ---------------------------------------- |
| `governanceAccount` | signer, writable | The governance account the config is for |

**Arguments:**

| Argument        | Type                                    | Description |
| --------------- | --------------------------------------- | ----------- |
| `discriminator` | `u8`                                    | -           |
| `config`        | [governanceConfig](#governanceConfig-3) | -           |

### flagTransactionError

**Accounts:**

| Account                      | Type     | Description                                               |
| ---------------------------- | -------- | --------------------------------------------------------- |
| `proposalAccount`            | writable | -                                                         |
| `tokenOwnerRecord`           | readonly | TokenOwnerRecord account of the Proposal owner            |
| `governanceAuthority`        | signer   | Governance Authority (Token Owner or Governance Delegate) |
| `proposalTransactionAccount` | writable | ProposalTransaction account to flag                       |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### setRealmAuthority

**Accounts:**

| Account             | Type     | Description                                   |
| ------------------- | -------- | --------------------------------------------- |
| `realmAccount`      | writable | -                                             |
| `realmAuthority`    | signer   | -                                             |
| `newRealmAuthority` | optional | Must be one of the realm governances when set |

**Arguments:**

| Argument        | Type                                                  | Description |
| --------------- | ----------------------------------------------------- | ----------- |
| `discriminator` | `u8`                                                  | -           |
| `action`        | [setRealmAuthorityAction](#setRealmAuthorityAction-3) | -           |

### setRealmConfig

**Accounts:**

| Account                                 | Type               | Description                                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `realmAccount`                          | writable           | -                                                                                                                                                                                                                                                                                                     |
| `realmAuthority`                        | signer             | -                                                                                                                                                                                                                                                                                                     |
| `councilTokenMint`                      | optional           | Council Token Mint - optional. Note: In the current version it's only possible to remove council mint (set it to None) After setting council to None it won't be possible to withdraw the tokens from the Realm any longer. If that's required then it must be done before executing this instruction |
| `councilTokenHoldingAccount`            | writable, optional | Optional unless council is used. seeds=['governance', realm, council_mint]                                                                                                                                                                                                                            |
| `systemProgram`                         | readonly           | -                                                                                                                                                                                                                                                                                                     |
| `realmConfig`                           | writable           | RealmConfig account. seeds=['realm-config', realm]                                                                                                                                                                                                                                                    |
| `communityVoterWeightAddinProgramId`    | optional           | Optional Community Voter Weight Addin Program Id                                                                                                                                                                                                                                                      |
| `maxCommunityVoterWeightAddinProgramId` | optional           | Optional Max Community Voter Weight Addin Program Id                                                                                                                                                                                                                                                  |
| `councilVoterWeightAddinProgramId`      | optional           | Optional Council Voter Weight Adding Program Id                                                                                                                                                                                                                                                       |
| `maxCouncilVoterWeightAddinProgramId`   | optional           | Optional Max Council Voter Weight Addin Program Id                                                                                                                                                                                                                                                    |
| `payer`                                 | signer, optional   | Optional Payer. Required if RealmConfig doesn't exist and needs to be created                                                                                                                                                                                                                         |

**Arguments:**

| Argument        | Type                                      | Description |
| --------------- | ----------------------------------------- | ----------- |
| `discriminator` | `u8`                                      | -           |
| `configArgs`    | [realmConfigParams](#realmConfigParams-3) | -           |

### createTokenOwnerRecord

**Accounts:**

| Account                      | Type     | Description                                                              |
| ---------------------------- | -------- | ------------------------------------------------------------------------ |
| `realmAccount`               | readonly | -                                                                        |
| `governingTokenOwnerAccount` | readonly | -                                                                        |
| `tokenOwnerRecord`           | writable | seeds=['governance', realm, governing_token_mint, governing_token_owner] |
| `governingTokenMint`         | readonly | -                                                                        |
| `payer`                      | signer   | -                                                                        |
| `systemProgram`              | readonly | -                                                                        |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### updateProgramMetadata

**Accounts:**

| Account                  | Type     | Description        |
| ------------------------ | -------- | ------------------ |
| `programMetadataAccount` | writable | seeds=['metadata'] |
| `payer`                  | signer   | -                  |
| `systemProgram`          | readonly | -                  |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### createNativeTreasury

**Accounts:**

| Account                 | Type     | Description                                    |
| ----------------------- | -------- | ---------------------------------------------- |
| `governanceAccount`     | readonly | Governance account the treasury account is for |
| `nativeTreasuryAccount` | writable | seeds=['native-treasury', governance]          |
| `payer`                 | signer   | -                                              |
| `systemProgram`         | readonly | -                                              |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### revokeGoverningTokens

**Accounts:**

| Account                                   | Type     | Description                                                              |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `realmAccount`                            | readonly | -                                                                        |
| `governingTokenHoldingAccount`            | writable | seeds=['governance', realm, governing_token_mint]                        |
| `tokenOwnerRecord`                        | writable | seeds=['governance', realm, governing_token_mint, governing_token_owner] |
| `governingTokenMint`                      | writable | -                                                                        |
| `governingTokenMintAuthorityOrTokenOwner` | signer   | GoverningTokenMint mint_authority                                        |
| `realmConfigAccount`                      | readonly | seeds=['realm-config', realm]                                            |
| `tokenProgram`                            | readonly | -                                                                        |

**Arguments:**

| Argument        | Type  | Description |
| --------------- | ----- | ----------- |
| `discriminator` | `u8`  | -           |
| `amount`        | `u64` | -           |

### refundProposalDeposit

**Accounts:**

| Account                  | Type     | Description                                              |
| ------------------------ | -------- | -------------------------------------------------------- |
| `proposalAccount`        | readonly | -                                                        |
| `proposalDepositAccount` | writable | PDA Seeds: ['proposal-deposit', proposal, deposit payer] |
| `proposalDepositPayer`   | writable | Proposal Deposit Payer (beneficiary) account             |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### completeProposal

**Accounts:**

| Account                     | Type     | Description                                    |
| --------------------------- | -------- | ---------------------------------------------- |
| `proposalAccount`           | writable | -                                              |
| `tokenOwnerRecord`          | readonly | TokenOwnerRecord account of the Proposal owner |
| `completeProposalAuthority` | signer   | Token Owner or Delegate                        |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

### addRequiredSignatory

**Accounts:**

| Account                    | Type             | Description                              |
| -------------------------- | ---------------- | ---------------------------------------- |
| `governanceAccount`        | signer, writable | The Governance account the config is for |
| `requiredSignatoryAccount` | writable         | -                                        |
| `payer`                    | signer           | -                                        |
| `systemProgram`            | readonly         | -                                        |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `u8`        | -           |
| `signatory`     | `PublicKey` | -           |

### removeRequiredSignatory

**Accounts:**

| Account                    | Type             | Description                                                                                  |
| -------------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `governanceAccount`        | signer, writable | -                                                                                            |
| `requiredSignatoryAccount` | writable         | -                                                                                            |
| `beneficiaryAccount`       | writable         | Beneficiary Account which would receive lamports from the disposed RequiredSignatory Account |

**Arguments:**

| Argument        | Type | Description |
| --------------- | ---- | ----------- |
| `discriminator` | `u8` | -           |

## PDAs

### realm

Realm account identified by its name

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `name`     | `string`         | -           |

### communityTokenHolding

Community token holding account of a realm

**Seeds:**

| Seed            | Type             | Description |
| --------------- | ---------------- | ----------- |
| `constant`      | bytes (constant) | -           |
| `realm`         | `PublicKey`      | -           |
| `communityMint` | `PublicKey`      | -           |

### councilTokenHolding

Council token holding account of a realm

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `realm`       | `PublicKey`      | -           |
| `councilMint` | `PublicKey`      | -           |

### realmConfig

Configuration of a realm

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `realm`    | `PublicKey`      | -           |

### tokenOwnerRecord

Token owner's record within a realm

**Seeds:**

| Seed                  | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `constant`            | bytes (constant) | -           |
| `realm`               | `PublicKey`      | -           |
| `governingTokenMint`  | `PublicKey`      | -           |
| `governingTokenOwner` | `PublicKey`      | -           |

### governingTokenHolding

Governing token holding account

**Seeds:**

| Seed                 | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `constant`           | bytes (constant) | -           |
| `realm`              | `PublicKey`      | -           |
| `governingTokenMint` | `PublicKey`      | -           |

### governance

Governance account within a realm

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `realm`    | `PublicKey`      | -           |
| `seed`     | `PublicKey`      | -           |

### nativeTreasury

Governance's native SOL treasury account

**Seeds:**

| Seed         | Type             | Description |
| ------------ | ---------------- | ----------- |
| `constant`   | bytes (constant) | -           |
| `governance` | `PublicKey`      | -           |

### proposal

Governance proposal

**Seeds:**

| Seed                 | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `constant`           | bytes (constant) | -           |
| `governance`         | `PublicKey`      | -           |
| `governingTokenMint` | `PublicKey`      | -           |
| `proposalSeed`       | `PublicKey`      | -           |

### proposalDeposit

Proposal deposit made by a specific payer

**Seeds:**

| Seed           | Type             | Description |
| -------------- | ---------------- | ----------- |
| `constant`     | bytes (constant) | -           |
| `proposal`     | `PublicKey`      | -           |
| `depositPayer` | `PublicKey`      | -           |

### signatoryRecord

Signatory's record on a proposal

**Seeds:**

| Seed        | Type             | Description |
| ----------- | ---------------- | ----------- |
| `constant`  | bytes (constant) | -           |
| `proposal`  | `PublicKey`      | -           |
| `signatory` | `PublicKey`      | -           |

### proposalTransaction

Transaction within a proposal option

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `proposal`    | `PublicKey`      | -           |
| `optionIndex` | `u8`             | -           |
| `index`       | `u16`            | -           |

### voteRecord

Vote record on a proposal

**Seeds:**

| Seed               | Type             | Description |
| ------------------ | ---------------- | ----------- |
| `constant`         | bytes (constant) | -           |
| `proposal`         | `PublicKey`      | -           |
| `tokenOwnerRecord` | `PublicKey`      | -           |

### requiredSignatory

Required signatory on a governance

**Seeds:**

| Seed         | Type             | Description |
| ------------ | ---------------- | ----------- |
| `constant`   | bytes (constant) | -           |
| `governance` | `PublicKey`      | -           |
| `signatory`  | `PublicKey`      | -           |

## Types

### governanceConfig

**Definition:**

```typescript
{
  communityVoteThreshold: voteThreshold;
  minCommunityWeightToCreateProposal: bigint;
  minTransactionHoldUpTime: bigint;
  votingBaseTime: bigint;
  communityVoteTipping: voteTipping;
  councilVoteThreshold: voteThreshold;
  councilVetoVoteThreshold: voteThreshold;
  minCouncilWeightToCreateProposal: bigint;
  councilVoteTipping: voteTipping;
  communityVetoVoteThreshold: voteThreshold;
  votingCoolOffTime: bigint;
  depositExemptProposalCount: bigint;
}
```

### nativeTreasury

**Definition:**

```typescript
{
}
```

### proposalOption

**Definition:**

```typescript
{
  label: unknown;
  voteWeight: bigint;
  voteResult: optionVoteResult;
  transactionsExecutedCount: bigint;
  transactionsCount: bigint;
  transactionsNextIndex: bigint;
}
```

### instructionData

**Definition:**

```typescript
{
  programId: PublicKey;
  accounts: accountMetaData[];
  data: unknown;
}
```

### accountMetaData

**Definition:**

```typescript
{
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
}
```

### realmConfigParams

**Definition:**

```typescript
{
  useCouncilMint: boolean;
  minCommunityWeightToCreateGovernance: bigint;
  communityMintMaxVoterWeightSource: mintMaxVoterWeightSource;
  communityTokenConfigArgs: governingTokenConfigParams;
  councilTokenConfigArgs: governingTokenConfigParams;
}
```

### governingTokenConfigParams

**Definition:**

```typescript
{
  useVoterWeightAddin: boolean;
  useMaxVoterWeightAddin: boolean;
  tokenType: governingTokenType;
}
```

### governingTokenConfigAccountArgs

**Definition:**

```typescript
{
  voterWeightAddin: PublicKey | null;
  maxVoterWeightAddin: PublicKey | null;
  tokenType: governingTokenType;
}
```

### realmConfig

**Definition:**

```typescript
{
  legacy1: bigint;
  legacy2: bigint;
  reserved: bigint[6];
  minCommunityWeightToCreateGovernance: bigint;
  communityMintMaxVoterWeightSource: mintMaxVoterWeightSource;
  councilMint: PublicKey | null;
}
```

### realmConfigParamsV1

**Definition:**

```typescript
{
  useCouncilMint: boolean;
  minCommunityWeightToCreateGovernance: bigint;
  communityMintMaxVoterWeightSource: mintMaxVoterWeightSource;
}
```

### governingTokenConfig

**Definition:**

```typescript
{
  voterWeightAddin: PublicKey | null;
  maxVoterWeightAddin: PublicKey | null;
  tokenType: governingTokenType;
  reserved: bigint[8];
}
```

### voteChoice

**Definition:**

```typescript
{
  rank: bigint;
  weightPercentage: bigint;
}
```

### reserved110

**Definition:**

```typescript
{
  reserved64: bigint[64];
  reserved32: bigint[32];
  reserved14: bigint[14];
}
```

### reserved119

**Definition:**

```typescript
{
  reserved64: bigint[64];
  reserved32: bigint[32];
  reserved23: bigint[23];
}
```

### governanceAccountType

**Definition:**

```typescript
| { kind: "uninitialized" }
  | { kind: "realmV1" }
  | { kind: "tokenOwnerRecordV1" }
  | { kind: "governanceV1" }
  | { kind: "programGovernanceV1" }
  | { kind: "proposalV1" }
  | { kind: "signatoryRecordV1" }
  | { kind: "voteRecordV1" }
  | { kind: "proposalInstructionV1" }
  | { kind: "mintGovernanceV1" }
  | { kind: "tokenGovernanceV1" }
  | { kind: "realmConfig" }
  | { kind: "voteRecordV2" }
  | { kind: "proposalTransactionV2" }
  | { kind: "proposalV2" }
  | { kind: "programMetadata" }
  | { kind: "realmV2" }
  | { kind: "tokenOwnerRecordV2" }
  | { kind: "governanceV2" }
  | { kind: "programGovernanceV2" }
  | { kind: "mintGovernanceV2" }
  | { kind: "tokenGovernanceV2" }
  | { kind: "signatoryRecordV2" }
  | { kind: "proposalDeposit" }
  | { kind: "requiredSignatory" }
```

### proposalState

**Definition:**

```typescript
| { kind: "draft" }
  | { kind: "signingOff" }
  | { kind: "voting" }
  | { kind: "succeeded" }
  | { kind: "executing" }
  | { kind: "completed" }
  | { kind: "cancelled" }
  | { kind: "defeated" }
  | { kind: "executingWithErrors" }
  | { kind: "vetoed" }
```

### voteThreshold

**Definition:**

```typescript
| { kind: "yesVotePercentage"; value: [bigint] }
  | { kind: "quorumPercentage"; value: [bigint] }
  | { kind: "disabled" }
```

### voteTipping

**Definition:**

```typescript
| { kind: "strict" }
  | { kind: "early" }
  | { kind: "disabled" }
```

### transactionExecutionStatus

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "success" }
  | { kind: "error" }
```

### instructionExecutionFlags

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "ordered" }
  | { kind: "useTransaction" }
```

### mintMaxVoterWeightSource

**Definition:**

```typescript
| { kind: "supplyFraction"; value: [bigint] }
  | { kind: "absolute"; value: [bigint] }
```

### voteWeightV1

**Definition:**

```typescript
| { kind: "yes"; value: [bigint] }
  | { kind: "no"; value: [bigint] }
```

### optionVoteResult

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "succeeded" }
  | { kind: "defeated" }
```

### voteType

**Definition:**

```typescript
| { kind: "singleChoice" }
  | { kind: "multiChoice"; choiceType: multiChoiceType; minVoterOptions: bigint; maxVoterOptions: bigint; maxWinningOptions: bigint }
```

### multiChoiceType

**Definition:**

```typescript
| { kind: "fullWeight" }
  | { kind: "weighted" }
```

### setRealmAuthorityAction

**Definition:**

```typescript
| { kind: "setUnchecked" }
  | { kind: "setChecked" }
  | { kind: "remove" }
```

### governanceInstructionV1

**Definition:**

```typescript
| { kind: "createRealm"; name: unknown; configArgs: realmConfigParamsV1 }
  | { kind: "depositGoverningTokens"; amount: bigint }
```

### governingTokenType

**Definition:**

```typescript
| { kind: "liquid" }
  | { kind: "membership" }
  | { kind: "dormant" }
```

### vote

**Definition:**

```typescript
| { kind: "approve"; value: [voteChoice[]] }
  | { kind: "deny" }
  | { kind: "abstain" }
  | { kind: "veto" }
```

### voteKind

**Definition:**

```typescript
| { kind: "electorate" }
  | { kind: "veto" }
```

### unixTimestamp

**Definition:**

```typescript
bigint;
```

### slot

**Definition:**

```typescript
bigint;
```

## Errors

- **500 - InvalidInstruction**: Invalid instruction passed to program _(Hex: `0x1f4`)_
- **501 - RealmAlreadyExists**: Realm with the given name and governing mints already exists _(Hex: `0x1f5`)_
- **502 - InvalidRealm**: Invalid realm _(Hex: `0x1f6`)_
- **503 - InvalidGoverningTokenMint**: Invalid Governing Token Mint _(Hex: `0x1f7`)_
- **504 - GoverningTokenOwnerMustSign**: Governing Token Owner must sign transaction _(Hex: `0x1f8`)_
- **505 - GoverningTokenOwnerOrDelegateMustSign**: Governing Token Owner or Delegate must sign transaction _(Hex: `0x1f9`)_
- **506 - AllVotesMustBeRelinquishedToWithdrawGoverningTokens**: All votes must be relinquished to withdraw governing tokens _(Hex: `0x1fa`)_
- **507 - InvalidTokenOwnerRecordAccountAddress**: Invalid Token Owner Record account address _(Hex: `0x1fb`)_
- **508 - InvalidGoverningMintForTokenOwnerRecord**: Invalid GoverningMint for TokenOwnerRecord _(Hex: `0x1fc`)_
- **509 - InvalidRealmForTokenOwnerRecord**: Invalid Realm for TokenOwnerRecord _(Hex: `0x1fd`)_
- **510 - InvalidProposalForProposalTransaction**: Invalid Proposal for ProposalTransaction, _(Hex: `0x1fe`)_
- **511 - InvalidSignatoryAddress**: Invalid Signatory account address _(Hex: `0x1ff`)_
- **512 - SignatoryAlreadySignedOff**: Signatory already signed off _(Hex: `0x200`)_
- **513 - SignatoryMustSign**: Signatory must sign _(Hex: `0x201`)_
- **514 - InvalidProposalOwnerAccount**: Invalid Proposal Owner _(Hex: `0x202`)_
- **515 - InvalidProposalForVoterRecord**: Invalid Proposal for VoterRecord _(Hex: `0x203`)_
- **516 - InvalidGoverningTokenOwnerForVoteRecord**: Invalid GoverningTokenOwner for VoteRecord _(Hex: `0x204`)_
- **517 - InvalidVoteThresholdPercentage**: Invalid Governance config: Vote threshold percentage out of range _(Hex: `0x205`)_
- **518 - ProposalAlreadyExists**: Proposal for the given Governance, Governing Token Mint and index already exists _(Hex: `0x206`)_
- **519 - VoteAlreadyExists**: Token Owner already voted on the Proposal _(Hex: `0x207`)_
- **520 - NotEnoughTokensToCreateProposal**: Owner doesn't have enough governing tokens to create Proposal _(Hex: `0x208`)_
- **521 - InvalidStateCannotEditSignatories**: Invalid State: Can't edit Signatories _(Hex: `0x209`)_
- **522 - InvalidProposalState**: Invalid Proposal state _(Hex: `0x20a`)_
- **523 - InvalidStateCannotEditTransactions**: Invalid State: Can't edit transactions _(Hex: `0x20b`)_
- **524 - InvalidStateCannotExecuteTransaction**: Invalid State: Can't execute transaction _(Hex: `0x20c`)_
- **525 - CannotExecuteTransactionWithinHoldUpTime**: Can't execute transaction within its hold up time _(Hex: `0x20d`)_
- **526 - TransactionAlreadyExecuted**: Transaction already executed _(Hex: `0x20e`)_
- **527 - InvalidTransactionIndex**: Invalid Transaction index _(Hex: `0x20f`)_
- **528 - TransactionHoldUpTimeBelowRequiredMin**: Transaction hold up time is below the min specified by Governance _(Hex: `0x210`)_
- **529 - TransactionAlreadyExists**: Transaction at the given index for the Proposal already exists _(Hex: `0x211`)_
- **530 - InvalidStateCannotSignOff**: Invalid State: Can't sign off _(Hex: `0x212`)_
- **531 - InvalidStateCannotVote**: Invalid State: Can't vote _(Hex: `0x213`)_
- **532 - InvalidStateCannotFinalize**: Invalid State: Can't finalize vote _(Hex: `0x214`)_
- **533 - InvalidStateCannotCancelProposal**: Invalid State: Can't cancel Proposal _(Hex: `0x215`)_
- **534 - VoteAlreadyRelinquished**: Vote already relinquished _(Hex: `0x216`)_
- **535 - CannotFinalizeVotingInProgress**: Can't finalize vote. Voting still in progress _(Hex: `0x217`)_
- **536 - ProposalVotingTimeExpired**: Proposal voting time expired _(Hex: `0x218`)_
- **537 - InvalidSignatoryMint**: Invalid Signatory Mint _(Hex: `0x219`)_
- **538 - InvalidGovernanceForProposal**: Proposal does not belong to the given Governance _(Hex: `0x21a`)_
- **539 - InvalidGoverningMintForProposal**: Proposal does not belong to given Governing Mint _(Hex: `0x21b`)_
- **540 - MintAuthorityMustSign**: Current mint authority must sign transaction _(Hex: `0x21c`)_
- **541 - InvalidMintAuthority**: Invalid mint authority _(Hex: `0x21d`)_
- **542 - MintHasNoAuthority**: Mint has no authority _(Hex: `0x21e`)_
- **543 - SplTokenAccountWithInvalidOwner**: Invalid Token account owner _(Hex: `0x21f`)_
- **544 - SplTokenMintWithInvalidOwner**: Invalid Mint account owner _(Hex: `0x220`)_
- **545 - SplTokenAccountNotInitialized**: Token Account is not initialized _(Hex: `0x221`)_
- **546 - SplTokenAccountDoesNotExist**: Token Account doesn't exist _(Hex: `0x222`)_
- **547 - SplTokenInvalidTokenAccountData**: Token account data is invalid _(Hex: `0x223`)_
- **548 - SplTokenInvalidMintAccountData**: Token mint account data is invalid _(Hex: `0x224`)_
- **549 - SplTokenMintNotInitialized**: Token Mint account is not initialized _(Hex: `0x225`)_
- **550 - SplTokenMintDoesNotExist**: Token Mint account doesn't exist _(Hex: `0x226`)_
- **551 - InvalidProgramDataAccountAddress**: Invalid ProgramData account address _(Hex: `0x227`)_
- **552 - InvalidProgramDataAccountData**: Invalid ProgramData account Data _(Hex: `0x228`)_
- **553 - InvalidUpgradeAuthority**: Provided upgrade authority doesn't match current program upgrade authority _(Hex: `0x229`)_
- **554 - UpgradeAuthorityMustSign**: Current program upgrade authority must sign transaction _(Hex: `0x22a`)_
- **555 - ProgramNotUpgradable**: Given program is not upgradable _(Hex: `0x22b`)_
- **556 - InvalidTokenOwner**: Invalid token owner _(Hex: `0x22c`)_
- **557 - TokenOwnerMustSign**: Current token owner must sign transaction _(Hex: `0x22d`)_
- **558 - VoteThresholdTypeNotSupported**: Given VoteThresholdType is not supported _(Hex: `0x22e`)_
- **559 - VoteWeightSourceNotSupported**: Given VoteWeightSource is not supported _(Hex: `0x22f`)_
- **560 - Legacy1**: Legacy1 _(Hex: `0x230`)_
- **561 - GovernancePdaMustSign**: Governance PDA must sign _(Hex: `0x231`)_
- **562 - TransactionAlreadyFlaggedWithError**: Transaction already flagged with error _(Hex: `0x232`)_
- **563 - InvalidRealmForGovernance**: Invalid Realm for Governance _(Hex: `0x233`)_
- **564 - InvalidAuthorityForRealm**: Invalid Authority for Realm _(Hex: `0x234`)_
- **565 - RealmHasNoAuthority**: Realm has no authority _(Hex: `0x235`)_
- **566 - RealmAuthorityMustSign**: Realm authority must sign _(Hex: `0x236`)_
- **567 - InvalidGoverningTokenHoldingAccount**: Invalid governing token holding account _(Hex: `0x237`)_
- **568 - RealmCouncilMintChangeIsNotSupported**: Realm council mint change is not supported _(Hex: `0x238`)_
- **569 - InvalidMaxVoterWeightAbsoluteValue**: Invalid max voter weight absolute value _(Hex: `0x239`)_
- **570 - InvalidMaxVoterWeightSupplyFraction**: Invalid max voter weight supply fraction _(Hex: `0x23a`)_
- **571 - NotEnoughTokensToCreateGovernance**: Owner doesn't have enough governing tokens to create Governance _(Hex: `0x23b`)_
- **572 - TooManyOutstandingProposals**: Too many outstanding proposals _(Hex: `0x23c`)_
- **573 - AllProposalsMustBeFinalisedToWithdrawGoverningTokens**: All proposals must be finalized to withdraw governing tokens _(Hex: `0x23d`)_
- **574 - InvalidVoterWeightRecordForRealm**: Invalid VoterWeightRecord for Realm _(Hex: `0x23e`)_
- **575 - InvalidVoterWeightRecordForGoverningTokenMint**: Invalid VoterWeightRecord for GoverningTokenMint _(Hex: `0x23f`)_
- **576 - InvalidVoterWeightRecordForTokenOwner**: Invalid VoterWeightRecord for TokenOwner _(Hex: `0x240`)_
- **577 - VoterWeightRecordExpired**: VoterWeightRecord expired _(Hex: `0x241`)_
- **578 - InvalidRealmConfigForRealm**: Invalid RealmConfig for Realm _(Hex: `0x242`)_
- **579 - TokenOwnerRecordAlreadyExists**: TokenOwnerRecord already exists _(Hex: `0x243`)_
- **580 - GoverningTokenDepositsNotAllowed**: Governing token deposits not allowed _(Hex: `0x244`)_
- **581 - InvalidVoteChoiceWeightPercentage**: Invalid vote choice weight percentage _(Hex: `0x245`)_
- **582 - VoteTypeNotSupported**: Vote type not supported _(Hex: `0x246`)_
- **583 - InvalidProposalOptions**: Invalid proposal options _(Hex: `0x247`)_
- **584 - ProposalIsNotExecutable**: Proposal is not not executable _(Hex: `0x248`)_
- **585 - DenyVoteIsNotAllowed**: Deny vote is not allowed _(Hex: `0x249`)_
- **586 - CannotExecuteDefeatedOption**: Cannot execute defeated option _(Hex: `0x24a`)_
- **587 - VoterWeightRecordInvalidAction**: VoterWeightRecord invalid action _(Hex: `0x24b`)_
- **588 - VoterWeightRecordInvalidActionTarget**: VoterWeightRecord invalid action target _(Hex: `0x24c`)_
- **589 - InvalidMaxVoterWeightRecordForRealm**: Invalid MaxVoterWeightRecord for Realm _(Hex: `0x24d`)_
- **590 - InvalidMaxVoterWeightRecordForGoverningTokenMint**: Invalid MaxVoterWeightRecord for GoverningTokenMint _(Hex: `0x24e`)_
- **591 - MaxVoterWeightRecordExpired**: MaxVoterWeightRecord expired _(Hex: `0x24f`)_
- **592 - NotSupportedVoteType**: Not supported VoteType _(Hex: `0x250`)_
- **593 - RealmConfigChangeNotAllowed**: RealmConfig change not allowed _(Hex: `0x251`)_
- **594 - GovernanceConfigChangeNotAllowed**: GovernanceConfig change not allowed _(Hex: `0x252`)_
- **595 - AtLeastOneVoteThresholdRequired**: At least one VoteThreshold is required _(Hex: `0x253`)_
- **596 - ReservedBufferMustBeEmpty**: Reserved buffer must be empty _(Hex: `0x254`)_
- **597 - CannotRelinquishInFinalizingState**: Cannot Relinquish in Finalizing state _(Hex: `0x255`)_
- **598 - InvalidRealmConfigAddress**: Invalid RealmConfig account address _(Hex: `0x256`)_
- **599 - CannotDepositDormantTokens**: Cannot deposit dormant tokens _(Hex: `0x257`)_
- **600 - CannotWithdrawMembershipTokens**: Cannot withdraw membership tokens _(Hex: `0x258`)_
- **601 - CannotRevokeGoverningTokens**: Cannot revoke GoverningTokens _(Hex: `0x259`)_
- **602 - InvalidRevokeAmount**: Invalid Revoke amount _(Hex: `0x25a`)_
- **603 - InvalidGoverningTokenSource**: Invalid GoverningToken source _(Hex: `0x25b`)_
- **604 - CannotChangeCommunityTokenTypeToMembership**: Cannot change community TokenType to Membership _(Hex: `0x25c`)_
- **605 - VoterWeightThresholdDisabled**: Voter weight threshold disabled _(Hex: `0x25d`)_
- **606 - VoteNotAllowedInCoolOffTime**: Vote not allowed in cool off time _(Hex: `0x25e`)_
- **607 - CannotRefundProposalDeposit**: Cannot refund ProposalDeposit _(Hex: `0x25f`)_
- **608 - InvalidProposalForProposalDeposit**: Invalid Proposal for ProposalDeposit _(Hex: `0x260`)_
- **609 - InvalidDepositExemptProposalCount**: Invalid deposit_exempt_proposal_count _(Hex: `0x261`)_
- **610 - GoverningTokenMintNotAllowedToVote**: GoverningTokenMint not allowed to vote _(Hex: `0x262`)_
- **611 - InvalidDepositPayerForProposalDeposit**: Invalid deposit Payer for ProposalDeposit _(Hex: `0x263`)_
- **612 - InvalidStateNotFinal**: Invalid State: Proposal is not in final state _(Hex: `0x264`)_
- **613 - InvalidStateToCompleteProposal**: Invalid state for proposal state transition to Completed _(Hex: `0x265`)_
- **614 - InvalidNumberOfVoteChoices**: Invalid number of vote choices _(Hex: `0x266`)_
- **615 - RankedVoteIsNotSupported**: Ranked vote is not supported _(Hex: `0x267`)_
- **616 - ChoiceWeightMustBe100Percent**: Choice weight must be 100% _(Hex: `0x268`)_
- **617 - SingleChoiceOnlyIsAllowed**: Single choice only is allowed _(Hex: `0x269`)_
- **618 - AtLeastSingleChoiceIsRequired**: At least single choice is required _(Hex: `0x26a`)_
- **619 - TotalVoteWeightMustBe100Percent**: Total vote weight must be 100% _(Hex: `0x26b`)_
- **620 - InvalidMultiChoiceProposalParameters**: Invalid multi choice proposal parameters _(Hex: `0x26c`)_
- **621 - InvalidGovernanceForRequiredSignatory**: Invalid Governance for RequiredSignatory _(Hex: `0x26d`)_
- **622 - SignatoryRecordAlreadyExists**: Signatory Record has already been created _(Hex: `0x26e`)_
- **623 - InstructionDeprecated**: Instruction has been removed _(Hex: `0x26f`)_
- **624 - MissingRequiredSignatories**: Proposal is missing required signatories _(Hex: `0x270`)_
