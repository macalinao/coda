# Quarry Mine Program

- Program ID: `QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB`

## Table of Contents

- [Accounts](#accounts)
  - [rewarder](#rewarder)
  - [quarry](#quarry)
  - [miner](#miner)
- [Instructions](#instructions)
  - [newRewarder](#newRewarder-1)
  - [newRewarderV2](#newRewarderV2-1)
  - [setPauseAuthority](#setPauseAuthority-1)
  - [pause](#pause-1)
  - [unpause](#unpause-1)
  - [transferAuthority](#transferAuthority-1)
  - [acceptAuthority](#acceptAuthority-1)
  - [setAnnualRewards](#setAnnualRewards-1)
  - [createQuarry](#createQuarry-1)
  - [createQuarryV2](#createQuarryV2-1)
  - [setRewardsShare](#setRewardsShare-1)
  - [setFamine](#setFamine-1)
  - [updateQuarryRewards](#updateQuarryRewards-1)
  - [createMiner](#createMiner-1)
  - [createMinerV2](#createMinerV2-1)
  - [claimRewards](#claimRewards-1)
  - [claimRewardsV2](#claimRewardsV2-1)
  - [stakeTokens](#stakeTokens-1)
  - [withdrawTokens](#withdrawTokens-1)
  - [rescueTokens](#rescueTokens-1)
  - [extractFees](#extractFees-1)
- [PDAs](#pdas)
  - [rewarder](#rewarder-2)
  - [quarry](#quarry-2)
  - [miner](#miner-2)
- [Types](#types)
  - [stakeAction](#stakeAction-3)
  - [claimEvent](#claimEvent-3)
  - [minerCreateEvent](#minerCreateEvent-3)
  - [quarryCreateEvent](#quarryCreateEvent-3)
  - [newRewarderEvent](#newRewarderEvent-3)
  - [stakeEvent](#stakeEvent-3)
  - [withdrawEvent](#withdrawEvent-3)
  - [rewarderAnnualRewardsUpdateEvent](#rewarderAnnualRewardsUpdateEvent-3)
  - [quarryRewardsUpdateEvent](#quarryRewardsUpdateEvent-3)
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
| `authority`         | signer   |             |
| `rewarder`          | writable |             |
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

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `authority` | signer   |             |
| `rewarder`  | writable |             |

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
| `authority`     | signer           |             |
| `rewarder`      | writable         |             |
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
| `authority`     | signer           |             |
| `rewarder`      | writable         |             |
| `tokenMint`     | readonly         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setRewardsShare

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `authority` | signer   |             |
| `rewarder`  | writable |             |
| `quarry`    | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `newShare`      | `u64`     |             |

### setFamine

**Accounts:**

| Account     | Type     | Description |
| ----------- | -------- | ----------- |
| `authority` | signer   |             |
| `rewarder`  | readonly |             |
| `quarry`    | writable |             |

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

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `mintWrapper`          | writable |             |
| `mintWrapperProgram`   | readonly |             |
| `minter`               | writable |             |
| `rewardsTokenMint`     | writable |             |
| `rewardsTokenAccount`  | writable |             |
| `claimFeeTokenAccount` | writable |             |
| `authority`            | signer   |             |
| `miner`                | writable |             |
| `quarry`               | writable |             |
| `unusedMinerVault`     | readonly |             |
| `unusedTokenAccount`   | readonly |             |
| `tokenProgram`         | readonly |             |
| `rewarder`             | readonly |             |

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
| `authority`            | signer   |             |
| `miner`                | writable |             |
| `quarry`               | writable |             |
| `tokenProgram`         | readonly |             |
| `rewarder`             | readonly |             |

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

- **unauthorized** (Code: 6000 / `6000` / `0x1770`) -- You are not authorized to perform this action.
- **insufficientBalance** (Code: 6001 / `6001` / `0x1771`) -- Insufficient staked balance for withdraw request.
- **pendingAuthorityNotSet** (Code: 6002 / `6002` / `0x1772`) -- Pending authority not set
- **invalidRewardsShare** (Code: 6003 / `6003` / `0x1773`) -- Invalid quarry rewards share
- **insufficientAllowance** (Code: 6004 / `6004` / `0x1774`) -- Insufficient allowance.
- **newVaultNotEmpty** (Code: 6005 / `6005` / `0x1775`) -- New vault not empty.
- **notEnoughTokens** (Code: 6006 / `6006` / `0x1776`) -- Not enough tokens.
- **invalidTimestamp** (Code: 6007 / `6007` / `0x1777`) -- Invalid timestamp.
- **invalidMaxClaimFee** (Code: 6008 / `6008` / `0x1778`) -- Invalid max claim fee.
- **maxAnnualRewardsRateExceeded** (Code: 6009 / `6009` / `0x1779`) -- Max annual rewards rate exceeded.
- **paused** (Code: 6010 / `6010` / `0x177a`) -- Rewarder is paused.
- **upperboundExceeded** (Code: 6011 / `6011` / `0x177b`) -- Rewards earned exceeded quarry's upper bound.
