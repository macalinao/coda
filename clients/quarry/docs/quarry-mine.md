# Quarry Mine Program

[![npm version](https://badge.fury.io/js/%40macalinao%2Fclients-quarry.svg)](https://www.npmjs.com/package/%40macalinao%2Fclients-quarry)

- Program ID: `QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB`
- TypeScript Client: [`@macalinao/clients-quarry`](https://www.npmjs.com/package/@macalinao/clients-quarry)

## Table of Contents

- [Accounts](#accounts)
  - [rewarder](#rewarder)
  - [quarry](#quarry)
  - [miner](#miner)
- [Instructions](#instructions)
  - [newRewarder](#newRewarder)
  - [newRewarderV2](#newRewarderV2)
  - [setPauseAuthority](#setPauseAuthority)
  - [pause](#pause)
  - [unpause](#unpause)
  - [transferAuthority](#transferAuthority)
  - [acceptAuthority](#acceptAuthority)
  - [setAnnualRewards](#setAnnualRewards)
  - [createQuarry](#createQuarry)
  - [createQuarryV2](#createQuarryV2)
  - [setRewardsShare](#setRewardsShare)
  - [setFamine](#setFamine)
  - [updateQuarryRewards](#updateQuarryRewards)
  - [createMiner](#createMiner)
  - [createMinerV2](#createMinerV2)
  - [claimRewards](#claimRewards)
  - [claimRewardsV2](#claimRewardsV2)
  - [stakeTokens](#stakeTokens)
  - [withdrawTokens](#withdrawTokens)
  - [rescueTokens](#rescueTokens)
  - [extractFees](#extractFees)
- [PDAs](#pdas)
  - [rewarder](#rewarder)
  - [quarry](#quarry)
  - [miner](#miner)
- [Types](#types)
  - [stakeAction](#stakeAction)
  - [claimEvent](#claimEvent)
  - [minerCreateEvent](#minerCreateEvent)
  - [quarryCreateEvent](#quarryCreateEvent)
  - [newRewarderEvent](#newRewarderEvent)
  - [stakeEvent](#stakeEvent)
  - [withdrawEvent](#withdrawEvent)
  - [rewarderAnnualRewardsUpdateEvent](#rewarderAnnualRewardsUpdateEvent)
  - [quarryRewardsUpdateEvent](#quarryRewardsUpdateEvent)
- [Errors](#errors)

## Accounts

### rewarder

**Fields:**

| Field                  | Type        | Description |
| ---------------------- | ----------- | ----------- |
| `discriminator`        | `unknown`   |             |
| `base`                 | `PublicKey` |             |
| `bump`                 | `u8`        |             |
| `authority`            | `PublicKey` |             |
| `pendingAuthority`     | `PublicKey` |             |
| `numQuarries`          | `u16`       |             |
| `annualRewardsRate`    | `u64`       |             |
| `totalRewardsShares`   | `u64`       |             |
| `mintWrapper`          | `PublicKey` |             |
| `rewardsTokenMint`     | `PublicKey` |             |
| `claimFeeTokenAccount` | `PublicKey` |             |
| `maxClaimFeeMillibps`  | `u64`       |             |
| `pauseAuthority`       | `PublicKey` |             |
| `isPaused`             | `boolean`   |             |

### quarry

**Fields:**

| Field                   | Type        | Description |
| ----------------------- | ----------- | ----------- |
| `discriminator`         | `unknown`   |             |
| `rewarder`              | `PublicKey` |             |
| `tokenMintKey`          | `PublicKey` |             |
| `bump`                  | `u8`        |             |
| `index`                 | `u16`       |             |
| `tokenMintDecimals`     | `u8`        |             |
| `famineTs`              | `i64`       |             |
| `lastUpdateTs`          | `i64`       |             |
| `rewardsPerTokenStored` | `u128`      |             |
| `annualRewardsRate`     | `u64`       |             |
| `rewardsShare`          | `u64`       |             |
| `totalTokensDeposited`  | `u64`       |             |
| `numMiners`             | `u64`       |             |

### miner

**Fields:**

| Field                 | Type        | Description |
| --------------------- | ----------- | ----------- |
| `discriminator`       | `unknown`   |             |
| `quarry`              | `PublicKey` |             |
| `authority`           | `PublicKey` |             |
| `bump`                | `u8`        |             |
| `tokenVaultKey`       | `PublicKey` |             |
| `rewardsEarned`       | `u64`       |             |
| `rewardsPerTokenPaid` | `u128`      |             |
| `balance`             | `u64`       |             |
| `index`               | `u64`       |             |

## Instructions

### newRewarder

**Accounts:**

| Account                | Type             | Description |
| ---------------------- | ---------------- | ----------- |
| `base`                 | signer           |             |
| `rewarder`             | writable         |             |
| `initialAuthority`     | readonly         |             |
| `payer`                | signer, writable |             |
| `systemProgram`        | readonly         |             |
| `unusedAccount`        | readonly         |             |
| `mintWrapper`          | readonly         |             |
| `rewardsTokenMint`     | readonly         |             |
| `claimFeeTokenAccount` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### newRewarderV2

**Accounts:**

| Account                | Type             | Description |
| ---------------------- | ---------------- | ----------- |
| `base`                 | signer           |             |
| `rewarder`             | writable         |             |
| `initialAuthority`     | readonly         |             |
| `payer`                | signer, writable |             |
| `systemProgram`        | readonly         |             |
| `mintWrapper`          | readonly         |             |
| `rewardsTokenMint`     | readonly         |             |
| `claimFeeTokenAccount` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setPauseAuthority

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `authAuthority`     | signer   |             |
| `authRewarder`      | writable |             |
| `newPauseAuthority` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### pause

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `pauseAuthority` | signer   |             |
| `rewarder`       | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### unpause

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `pauseAuthority` | signer   |             |
| `rewarder`       | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### transferAuthority

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `authority` | signer   |             |
| `rewarder`  | writable |             |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   |             |
| `newAuthority`  | `PublicKey` |             |

### acceptAuthority

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `authority` | signer   |             |
| `rewarder`  | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setAnnualRewards

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `authAuthority` | signer   |             |
| `authRewarder`  | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `newRate`       | `u64`     |             |

### createQuarry

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `quarry`        | writable         |             |
| `authAuthority` | signer           |             |
| `authRewarder`  | writable         |             |
| `tokenMint`     | readonly         |             |
| `payer`         | signer, writable |             |
| `unusedAccount` | readonly         |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### createQuarryV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `quarry`        | writable         |             |
| `authAuthority` | signer           |             |
| `authRewarder`  | writable         |             |
| `tokenMint`     | readonly         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setRewardsShare

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `authAuthority` | signer   |             |
| `authRewarder`  | writable |             |
| `quarry`        | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `newShare`      | `u64`     |             |

### setFamine

**Accounts:**

| Account         | Type     | Description |
| --------------- | -------- | ----------- |
| `authAuthority` | signer   |             |
| `authRewarder`  | readonly |             |
| `quarry`        | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `famineTs`      | `i64`     |             |

### updateQuarryRewards

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `quarry`   | writable |             |
| `rewarder` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### createMiner

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `authority`     | signer           |             |
| `miner`         | writable         |             |
| `quarry`        | writable         |             |
| `rewarder`      | readonly         |             |
| `systemProgram` | readonly         |             |
| `payer`         | signer, writable |             |
| `tokenMint`     | readonly         |             |
| `minerVault`    | readonly         |             |
| `tokenProgram`  | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### createMinerV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `authority`     | signer           |             |
| `miner`         | writable         |             |
| `quarry`        | writable         |             |
| `rewarder`      | readonly         |             |
| `systemProgram` | readonly         |             |
| `payer`         | signer, writable |             |
| `tokenMint`     | readonly         |             |
| `minerVault`    | readonly         |             |
| `tokenProgram`  | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### claimRewards

**Accounts:**

| Account                     | Type     | Description |
| --------------------------- | -------- | ----------- |
| `mintWrapper`               | writable |             |
| `mintWrapperProgram`        | readonly |             |
| `minter`                    | writable |             |
| `rewardsTokenMint`          | writable |             |
| `rewardsTokenAccount`       | writable |             |
| `claimFeeTokenAccount`      | writable |             |
| `claimV1Authority`          | signer   |             |
| `claimV1Miner`              | writable |             |
| `claimV1Quarry`             | writable |             |
| `claimV1UnusedMinerVault`   | readonly |             |
| `claimV1UnusedTokenAccount` | readonly |             |
| `claimV1TokenProgram`       | readonly |             |
| `claimV1Rewarder`           | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### claimRewardsV2

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `mintWrapper`          | writable |             |
| `mintWrapperProgram`   | readonly |             |
| `minter`               | writable |             |
| `rewardsTokenMint`     | writable |             |
| `rewardsTokenAccount`  | writable |             |
| `claimFeeTokenAccount` | writable |             |
| `claimAuthority`       | signer   |             |
| `claimMiner`           | writable |             |
| `claimQuarry`          | writable |             |
| `claimTokenProgram`    | readonly |             |
| `claimRewarder`        | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### stakeTokens

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `authority`    | signer   |             |
| `miner`        | writable |             |
| `quarry`       | writable |             |
| `minerVault`   | writable |             |
| `tokenAccount` | writable |             |
| `tokenProgram` | readonly |             |
| `rewarder`     | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### withdrawTokens

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `authority`    | signer   |             |
| `miner`        | writable |             |
| `quarry`       | writable |             |
| `minerVault`   | writable |             |
| `tokenAccount` | writable |             |
| `tokenProgram` | readonly |             |
| `rewarder`     | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### rescueTokens

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `miner`                   | readonly |             |
| `authority`               | signer   |             |
| `minerTokenAccount`       | writable |             |
| `destinationTokenAccount` | writable |             |
| `tokenProgram`            | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### extractFees

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `rewarder`             | readonly |             |
| `claimFeeTokenAccount` | writable |             |
| `feeToTokenAccount`    | writable |             |
| `tokenProgram`         | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

## PDAs

### rewarder

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      |             |

### quarry

**Seeds:**

| Seed        | Type             | Description |
| ----------- | ---------------- | ----------- |
| `constant`  | bytes (constant) | -           |
| `rewarder`  | `PublicKey`      |             |
| `tokenMint` | `PublicKey`      |             |

### miner

**Seeds:**

| Seed        | Type             | Description |
| ----------- | ---------------- | ----------- |
| `constant`  | bytes (constant) | -           |
| `quarry`    | `PublicKey`      |             |
| `authority` | `PublicKey`      |             |

## Types

### stakeAction

**Definition:**

```typescript
| { kind: "stake" }
  | { kind: "withdraw" }
```

### claimEvent

**Definition:**

```typescript
{
  authority: PublicKey;
  stakedToken: PublicKey;
  rewardsToken: PublicKey;
  amount: bigint;
  fees: bigint;
  timestamp: bigint;
}
```

### minerCreateEvent

**Definition:**

```typescript
{
  authority: PublicKey;
  quarry: PublicKey;
  miner: PublicKey;
}
```

### quarryCreateEvent

**Definition:**

```typescript
{
  tokenMint: PublicKey;
  timestamp: bigint;
}
```

### newRewarderEvent

**Definition:**

```typescript
{
  authority: PublicKey;
  timestamp: bigint;
}
```

### stakeEvent

**Definition:**

```typescript
{
  authority: PublicKey;
  token: PublicKey;
  amount: bigint;
  timestamp: bigint;
}
```

### withdrawEvent

**Definition:**

```typescript
{
  authority: PublicKey;
  token: PublicKey;
  amount: bigint;
  timestamp: bigint;
}
```

### rewarderAnnualRewardsUpdateEvent

**Definition:**

```typescript
{
  previousRate: bigint;
  newRate: bigint;
  timestamp: bigint;
}
```

### quarryRewardsUpdateEvent

**Definition:**

```typescript
{
  tokenMint: PublicKey;
  annualRewardsRate: bigint;
  rewardsShare: bigint;
  timestamp: bigint;
}
```

## Errors

- **6000 - Unauthorized**: You are not authorized to perform this action. _(Hex: `0x1770`)_
- **6001 - InsufficientBalance**: Insufficient staked balance for withdraw request. _(Hex: `0x1771`)_
- **6002 - PendingAuthorityNotSet**: Pending authority not set _(Hex: `0x1772`)_
- **6003 - InvalidRewardsShare**: Invalid quarry rewards share _(Hex: `0x1773`)_
- **6004 - InsufficientAllowance**: Insufficient allowance. _(Hex: `0x1774`)_
- **6005 - NewVaultNotEmpty**: New vault not empty. _(Hex: `0x1775`)_
- **6006 - NotEnoughTokens**: Not enough tokens. _(Hex: `0x1776`)_
- **6007 - InvalidTimestamp**: Invalid timestamp. _(Hex: `0x1777`)_
- **6008 - InvalidMaxClaimFee**: Invalid max claim fee. _(Hex: `0x1778`)_
- **6009 - MaxAnnualRewardsRateExceeded**: Max annual rewards rate exceeded. _(Hex: `0x1779`)_
- **6010 - Paused**: Rewarder is paused. _(Hex: `0x177a`)_
- **6011 - UpperboundExceeded**: Rewards earned exceeded quarry's upper bound. _(Hex: `0x177b`)_
