# Voter Stake Registry Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fvoter-stake-registry.svg)](https://www.npmjs.com/package/%40solana-programs%2Fvoter-stake-registry)

- Program ID: `vsr2nfGVNHmSY8uxoBGqq8AQbwz3JwaEaHqGbsTPXqQ`
- TypeScript Client: [`@solana-programs/voter-stake-registry`](https://www.npmjs.com/package/@solana-programs/voter-stake-registry)

## Table of Contents

- [Accounts](#accounts)
  - [registrar](#registrar)
  - [voter](#voter)
  - [voterWeightRecord](#voterWeightRecord)
- [Instructions](#instructions)
  - [createRegistrar](#createRegistrar)
  - [configureVotingMint](#configureVotingMint)
  - [createVoter](#createVoter)
  - [createDepositEntry](#createDepositEntry)
  - [deposit](#deposit)
  - [withdraw](#withdraw)
  - [grant](#grant)
  - [clawback](#clawback)
  - [closeDepositEntry](#closeDepositEntry)
  - [resetLockup](#resetLockup)
  - [internalTransferLocked](#internalTransferLocked)
  - [internalTransferUnlocked](#internalTransferUnlocked)
  - [updateVoterWeightRecord](#updateVoterWeightRecord)
  - [updateMaxVoteWeight](#updateMaxVoteWeight)
  - [closeVoter](#closeVoter)
  - [logVoterInfo](#logVoterInfo)
  - [setTimeOffset](#setTimeOffset)
- [PDAs](#pdas)
  - [registrar](#registrar)
  - [voter](#voter)
  - [voterWeightRecord](#voterWeightRecord)
- [Types](#types)
  - [depositEntry](#depositEntry)
  - [vestingInfo](#vestingInfo)
  - [lockingInfo](#lockingInfo)
  - [lockup](#lockup)
  - [votingMintConfig](#votingMintConfig)
  - [lockupKind](#lockupKind)
  - [voterInfo](#voterInfo)
  - [depositEntryInfo](#depositEntryInfo)
- [Errors](#errors)

## Accounts

### registrar

**Fields:**

| Field                     | Type                                       | Description |
| ------------------------- | ------------------------------------------ | ----------- |
| `discriminator`           | `unknown`                                  | -           |
| `governanceProgramId`     | `PublicKey`                                | -           |
| `realm`                   | `PublicKey`                                | -           |
| `realmGoverningTokenMint` | `PublicKey`                                | -           |
| `realmAuthority`          | `PublicKey`                                | -           |
| `reserved1`               | `u8`[32]                                   | -           |
| `votingMints`             | [votingMintConfig](#votingMintConfig-3)[4] | -           |
| `timeOffset`              | `i64`                                      | -           |
| `bump`                    | `u8`                                       | -           |
| `reserved2`               | `u8`[7]                                    | -           |
| `reserved3`               | `u64`[11]                                  | -           |

### voter

**Fields:**

| Field                   | Type                                | Description |
| ----------------------- | ----------------------------------- | ----------- |
| `discriminator`         | `unknown`                           | -           |
| `voterAuthority`        | `PublicKey`                         | -           |
| `registrar`             | `PublicKey`                         | -           |
| `deposits`              | [depositEntry](#depositEntry-3)[32] | -           |
| `voterBump`             | `u8`                                | -           |
| `voterWeightRecordBump` | `u8`                                | -           |
| `reserved`              | `u8`[94]                            | -           |

### voterWeightRecord

**Fields:**

| Field                 | Type        | Description |
| --------------------- | ----------- | ----------- |
| `discriminator`       | `unknown`   | -           |
| `realm`               | `PublicKey` | -           |
| `governingTokenMint`  | `PublicKey` | -           |
| `governingTokenOwner` | `PublicKey` | -           |
| `voterWeight`         | `u64`       | -           |
| `voterWeightExpiry`   | `u64`       | null        | -   |
| `weightAction`        | `u8`        | null        | -   |
| `weightActionTarget`  | `PublicKey` | null        | -   |

## Instructions

### createRegistrar

**Accounts:**

| Account                   | Type             | Description |
| ------------------------- | ---------------- | ----------- |
| `registrar`               | writable         | -           |
| `realm`                   | readonly         | -           |
| `governanceProgramId`     | readonly         | -           |
| `realmGoverningTokenMint` | readonly         | -           |
| `realmAuthority`          | signer           | -           |
| `payer`                   | signer, writable | -           |
| `systemProgram`           | readonly         | -           |
| `rent`                    | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `registrarBump` | `u8`      | -           |

### configureVotingMint

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | writable | -           |
| `realmAuthority` | signer   | -           |
| `mint`           | readonly | -           |

**Arguments:**

| Argument                               | Type        | Description |
| -------------------------------------- | ----------- | ----------- |
| `discriminator`                        | `unknown`   | -           |
| `idx`                                  | `u16`       | -           |
| `digitShift`                           | `i8`        | -           |
| `baselineVoteWeightScaledFactor`       | `u64`       | -           |
| `maxExtraLockupVoteWeightScaledFactor` | `u64`       | -           |
| `lockupSaturationSecs`                 | `u64`       | -           |
| `grantAuthority`                       | `PublicKey` | null        | -   |

### createVoter

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `registrar`         | readonly         | -           |
| `voter`             | writable         | -           |
| `voterAuthority`    | signer           | -           |
| `voterWeightRecord` | writable         | -           |
| `payer`             | signer, writable | -           |
| `systemProgram`     | readonly         | -           |
| `rent`              | readonly         | -           |
| `instructions`      | readonly         | -           |

**Arguments:**

| Argument                | Type      | Description |
| ----------------------- | --------- | ----------- |
| `discriminator`         | `unknown` | -           |
| `voterBump`             | `u8`      | -           |
| `voterWeightRecordBump` | `u8`      | -           |

### createDepositEntry

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `registrar`              | readonly         | -           |
| `voter`                  | writable         | -           |
| `vault`                  | writable         | -           |
| `voterAuthority`         | signer           | -           |
| `payer`                  | signer, writable | -           |
| `depositMint`            | readonly         | -           |
| `systemProgram`          | readonly         | -           |
| `tokenProgram`           | readonly         | -           |
| `associatedTokenProgram` | readonly         | -           |
| `rent`                   | readonly         | -           |

**Arguments:**

| Argument            | Type                        | Description |
| ------------------- | --------------------------- | ----------- |
| `discriminator`     | `unknown`                   | -           |
| `depositEntryIndex` | `u8`                        | -           |
| `kind`              | [lockupKind](#lockupKind-3) | -           |
| `startTs`           | `u64`                       | null        | -   |
| `periods`           | `u32`                       | -           |
| `allowClawback`     | `boolean`                   | -           |

### deposit

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `registrar`        | readonly | -           |
| `voter`            | writable | -           |
| `vault`            | writable | -           |
| `depositToken`     | writable | -           |
| `depositAuthority` | signer   | -           |
| `tokenProgram`     | readonly | -           |

**Arguments:**

| Argument            | Type      | Description |
| ------------------- | --------- | ----------- |
| `discriminator`     | `unknown` | -           |
| `depositEntryIndex` | `u8`      | -           |
| `amount`            | `u64`     | -           |

### withdraw

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `registrar`         | readonly | -           |
| `voter`             | writable | -           |
| `voterAuthority`    | signer   | -           |
| `tokenOwnerRecord`  | readonly | -           |
| `voterWeightRecord` | writable | -           |
| `vault`             | writable | -           |
| `destination`       | writable | -           |
| `tokenProgram`      | readonly | -           |

**Arguments:**

| Argument            | Type      | Description |
| ------------------- | --------- | ----------- |
| `discriminator`     | `unknown` | -           |
| `depositEntryIndex` | `u8`      | -           |
| `amount`            | `u64`     | -           |

### grant

**Accounts:**

| Account                  | Type             | Description |
| ------------------------ | ---------------- | ----------- |
| `registrar`              | readonly         | -           |
| `voter`                  | writable         | -           |
| `voterAuthority`         | readonly         | -           |
| `voterWeightRecord`      | writable         | -           |
| `vault`                  | writable         | -           |
| `depositToken`           | writable         | -           |
| `tokenAuthority`         | signer           | -           |
| `grantAuthority`         | signer           | -           |
| `payer`                  | signer, writable | -           |
| `depositMint`            | readonly         | -           |
| `systemProgram`          | readonly         | -           |
| `tokenProgram`           | readonly         | -           |
| `associatedTokenProgram` | readonly         | -           |
| `rent`                   | readonly         | -           |

**Arguments:**

| Argument                | Type                        | Description |
| ----------------------- | --------------------------- | ----------- |
| `discriminator`         | `unknown`                   | -           |
| `voterBump`             | `u8`                        | -           |
| `voterWeightRecordBump` | `u8`                        | -           |
| `kind`                  | [lockupKind](#lockupKind-3) | -           |
| `startTs`               | `u64`                       | null        | -   |
| `periods`               | `u32`                       | -           |
| `allowClawback`         | `boolean`                   | -           |
| `amount`                | `u64`                       | -           |

### clawback

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | readonly | -           |
| `realmAuthority` | signer   | -           |
| `voter`          | writable | -           |
| `vault`          | writable | -           |
| `destination`    | writable | -           |
| `tokenProgram`   | readonly | -           |

**Arguments:**

| Argument            | Type      | Description |
| ------------------- | --------- | ----------- |
| `discriminator`     | `unknown` | -           |
| `depositEntryIndex` | `u8`      | -           |

### closeDepositEntry

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `voter`          | writable | -           |
| `voterAuthority` | signer   | -           |

**Arguments:**

| Argument            | Type      | Description |
| ------------------- | --------- | ----------- |
| `discriminator`     | `unknown` | -           |
| `depositEntryIndex` | `u8`      | -           |

### resetLockup

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | readonly | -           |
| `voter`          | writable | -           |
| `voterAuthority` | signer   | -           |

**Arguments:**

| Argument            | Type                        | Description |
| ------------------- | --------------------------- | ----------- |
| `discriminator`     | `unknown`                   | -           |
| `depositEntryIndex` | `u8`                        | -           |
| `kind`              | [lockupKind](#lockupKind-3) | -           |
| `periods`           | `u32`                       | -           |

### internalTransferLocked

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | readonly | -           |
| `voter`          | writable | -           |
| `voterAuthority` | signer   | -           |

**Arguments:**

| Argument                  | Type      | Description |
| ------------------------- | --------- | ----------- |
| `discriminator`           | `unknown` | -           |
| `sourceDepositEntryIndex` | `u8`      | -           |
| `targetDepositEntryIndex` | `u8`      | -           |
| `amount`                  | `u64`     | -           |

### internalTransferUnlocked

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | readonly | -           |
| `voter`          | writable | -           |
| `voterAuthority` | signer   | -           |

**Arguments:**

| Argument                  | Type      | Description |
| ------------------------- | --------- | ----------- |
| `discriminator`           | `unknown` | -           |
| `sourceDepositEntryIndex` | `u8`      | -           |
| `targetDepositEntryIndex` | `u8`      | -           |
| `amount`                  | `u64`     | -           |

### updateVoterWeightRecord

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `registrar`         | readonly | -           |
| `voter`             | readonly | -           |
| `voterWeightRecord` | writable | -           |
| `systemProgram`     | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### updateMaxVoteWeight

**Accounts:**

| Account               | Type     | Description |
| --------------------- | -------- | ----------- |
| `registrar`           | readonly | -           |
| `maxVoteWeightRecord` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### closeVoter

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | readonly | -           |
| `voter`          | writable | -           |
| `voterAuthority` | signer   | -           |
| `solDestination` | writable | -           |
| `tokenProgram`   | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### logVoterInfo

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `registrar` | readonly | -           |
| `voter`     | readonly | -           |

**Arguments:**

| Argument            | Type      | Description |
| ------------------- | --------- | ----------- |
| `discriminator`     | `unknown` | -           |
| `depositEntryBegin` | `u8`      | -           |
| `depositEntryCount` | `u8`      | -           |

### setTimeOffset

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `registrar`      | writable | -           |
| `realmAuthority` | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `timeOffset`    | `i64`     | -           |

## PDAs

### registrar

The voting registrar. There can only be a single registrar

per governance realm and governing mint.

**Seeds:**

| Seed                      | Type             | Description |
| ------------------------- | ---------------- | ----------- |
| `realm`                   | `PublicKey`      | -           |
| `constant`                | bytes (constant) | -           |
| `realmGoverningTokenMint` | `PublicKey`      | -           |

### voter

The voter account for a given voter authority.

Each voter authority has a unique voter account per registrar.

**Seeds:**

| Seed             | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `registrar`      | `PublicKey`      | -           |
| `constant`       | bytes (constant) | -           |
| `voterAuthority` | `PublicKey`      | -           |

### voterWeightRecord

The voter weight record is the account that will be shown to spl-governance

to prove how much vote weight the voter has. See update_voter_weight_record.

**Seeds:**

| Seed             | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `registrar`      | `PublicKey`      | -           |
| `constant`       | bytes (constant) | -           |
| `voterAuthority` | `PublicKey`      | -           |

## Types

### depositEntry

**Definition:**

```typescript
{
  lockup: lockup;
  amountDepositedNative: bigint;
  amountInitiallyLockedNative: bigint;
  isUsed: boolean;
  allowClawback: boolean;
  votingMintConfigIdx: bigint;
  reserved: bigint[29];
}
```

### vestingInfo

**Definition:**

```typescript
{
  rate: bigint;
  nextTimestamp: bigint;
}
```

### lockingInfo

**Definition:**

```typescript
{
  amount: bigint;
  endTimestamp: bigint | null;
  vesting: vestingInfo | null;
}
```

### lockup

**Definition:**

```typescript
{
  startTs: bigint;
  endTs: bigint;
  kind: lockupKind;
  reserved: bigint[15];
}
```

### votingMintConfig

**Definition:**

```typescript
{
  mint: PublicKey;
  grantAuthority: PublicKey;
  baselineVoteWeightScaledFactor: bigint;
  maxExtraLockupVoteWeightScaledFactor: bigint;
  lockupSaturationSecs: bigint;
  digitShift: bigint;
  reserved1: bigint[7];
  reserved2: bigint[7];
}
```

### lockupKind

**Definition:**

```typescript
| { kind: "none" }
  | { kind: "daily" }
  | { kind: "monthly" }
  | { kind: "cliff" }
  | { kind: "constant" }
```

### voterInfo

**Definition:**

```typescript
{
  votingPower: bigint;
  votingPowerBaseline: bigint;
}
```

### depositEntryInfo

**Definition:**

```typescript
{
  depositEntryIndex: bigint;
  votingMintConfigIndex: bigint;
  unlocked: bigint;
  votingPower: bigint;
  votingPowerBaseline: bigint;
  locking: lockingInfo | null;
}
```

## Errors

- **6000 - InvalidRate**: Exchange rate must be greater than zero _(Hex: `0x1770`)_
- **6001 - RatesFull**: _(Hex: `0x1771`)_
- **6002 - VotingMintNotFound**: _(Hex: `0x1772`)_
- **6003 - DepositEntryNotFound**: _(Hex: `0x1773`)_
- **6004 - DepositEntryFull**: _(Hex: `0x1774`)_
- **6005 - VotingTokenNonZero**: _(Hex: `0x1775`)_
- **6006 - OutOfBoundsDepositEntryIndex**: _(Hex: `0x1776`)_
- **6007 - UnusedDepositEntryIndex**: _(Hex: `0x1777`)_
- **6008 - InsufficientUnlockedTokens**: _(Hex: `0x1778`)_
- **6009 - UnableToConvert**: _(Hex: `0x1779`)_
- **6010 - InvalidLockupPeriod**: _(Hex: `0x177a`)_
- **6011 - InvalidEndTs**: _(Hex: `0x177b`)_
- **6012 - InvalidDays**: _(Hex: `0x177c`)_
- **6013 - VotingMintConfigIndexAlreadyInUse**: _(Hex: `0x177d`)_
- **6014 - OutOfBoundsVotingMintConfigIndex**: _(Hex: `0x177e`)_
- **6015 - InvalidDecimals**: Exchange rate decimals cannot be larger than registrar decimals _(Hex: `0x177f`)_
- **6016 - InvalidToDepositAndWithdrawInOneSlot**: _(Hex: `0x1780`)_
- **6017 - ShouldBeTheFirstIxInATx**: _(Hex: `0x1781`)_
- **6018 - ForbiddenCpi**: _(Hex: `0x1782`)_
- **6019 - InvalidMint**: _(Hex: `0x1783`)_
- **6020 - DebugInstruction**: _(Hex: `0x1784`)_
- **6021 - ClawbackNotAllowedOnDeposit**: _(Hex: `0x1785`)_
- **6022 - DepositStillLocked**: _(Hex: `0x1786`)_
- **6023 - InvalidAuthority**: _(Hex: `0x1787`)_
- **6024 - InvalidTokenOwnerRecord**: _(Hex: `0x1788`)_
- **6025 - InvalidRealmAuthority**: _(Hex: `0x1789`)_
- **6026 - VoterWeightOverflow**: _(Hex: `0x178a`)_
- **6027 - LockupSaturationMustBePositive**: _(Hex: `0x178b`)_
- **6028 - VotingMintConfiguredWithDifferentIndex**: _(Hex: `0x178c`)_
- **6029 - InternalProgramError**: _(Hex: `0x178d`)_
- **6030 - InsufficientLockedTokens**: _(Hex: `0x178e`)_
- **6031 - MustKeepTokensLocked**: _(Hex: `0x178f`)_
- **6032 - InvalidLockupKind**: _(Hex: `0x1790`)_
- **6033 - InvalidChangeToClawbackDepositEntry**: _(Hex: `0x1791`)_
- **6034 - InternalErrorBadLockupVoteWeight**: _(Hex: `0x1792`)_
- **6035 - DepositStartTooFarInFuture**: _(Hex: `0x1793`)_
- **6036 - VaultTokenNonZero**: _(Hex: `0x1794`)_
- **6037 - InvalidTimestampArguments**: _(Hex: `0x1795`)_
