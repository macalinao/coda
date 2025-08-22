# Quarry Merge Mine Program

[![npm version](https://badge.fury.io/js/%40macalinao%2Fclients-quarry.svg)](https://www.npmjs.com/package/%40macalinao%2Fclients-quarry)

- Program ID: `QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto`
- TypeScript Client: [`@macalinao/clients-quarry`](https://www.npmjs.com/package/@macalinao/clients-quarry)

## Table of Contents

- [Accounts](#accounts)
  - [mergePool](#mergePool)
  - [mergeMiner](#mergeMiner)
- [Instructions](#instructions)
  - [newPool](#newPool-1)
  - [newPoolV2](#newPoolV2-1)
  - [initMergeMiner](#initMergeMiner-1)
  - [initMergeMinerV2](#initMergeMinerV2-1)
  - [initMinerMM](#initMinerMM-1)
  - [initMinerMMV2](#initMinerMMV2-1)
  - [stakePrimaryMiner](#stakePrimaryMiner-1)
  - [stakeReplicaMiner](#stakeReplicaMiner-1)
  - [unstakePrimaryMiner](#unstakePrimaryMiner-1)
  - [unstakeAllReplicaMiner](#unstakeAllReplicaMiner-1)
  - [withdrawTokensMM](#withdrawTokensMM-1)
  - [rescueTokensMM](#rescueTokensMM-1)
  - [claimRewardsMM](#claimRewardsMM-1)
- [PDAs](#pdas)
  - [mergePool](#mergePool-2)
  - [replicaMint](#replicaMint-2)
  - [mergeMiner](#mergeMiner-2)
- [Types](#types)
  - [newMergePoolEvent](#newMergePoolEvent-3)
  - [initMergeMinerEvent](#initMergeMinerEvent-3)
  - [initMinerEvent](#initMinerEvent-3)
  - [stakePrimaryEvent](#stakePrimaryEvent-3)
  - [stakeReplicaEvent](#stakeReplicaEvent-3)
  - [unstakePrimaryEvent](#unstakePrimaryEvent-3)
  - [unstakeReplicaEvent](#unstakeReplicaEvent-3)
  - [withdrawTokensEvent](#withdrawTokensEvent-3)
  - [claimEventMM](#claimEventMM-3)
- [Errors](#errors)

## Accounts

### mergePool

**Fields:**

| Field                 | Type        | Description |
| --------------------- | ----------- | ----------- |
| `discriminator`       | `unknown`   |             |
| `primaryMint`         | `PublicKey` |             |
| `bump`                | `u8`        |             |
| `replicaMint`         | `PublicKey` |             |
| `mmCount`             | `u64`       |             |
| `totalPrimaryBalance` | `u64`       |             |
| `totalReplicaBalance` | `u64`       |             |
| `reserved`            | `u64`[16]   |             |

### mergeMiner

**Fields:**

| Field            | Type        | Description |
| ---------------- | ----------- | ----------- |
| `discriminator`  | `unknown`   |             |
| `pool`           | `PublicKey` |             |
| `owner`          | `PublicKey` |             |
| `bump`           | `u8`        |             |
| `index`          | `u64`       |             |
| `primaryBalance` | `u64`       |             |
| `replicaBalance` | `u64`       |             |

## Instructions

### newPool

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | writable         |             |
| `primaryMint`   | readonly         |             |
| `replicaMint`   | writable         |             |
| `payer`         | signer, writable |             |
| `tokenProgram`  | readonly         |             |
| `systemProgram` | readonly         |             |
| `rent`          | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |
| `mintBump`      | `u8`      |             |

### newPoolV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | writable         |             |
| `primaryMint`   | readonly         |             |
| `replicaMint`   | writable         |             |
| `payer`         | signer, writable |             |
| `tokenProgram`  | readonly         |             |
| `systemProgram` | readonly         |             |
| `rent`          | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### initMergeMiner

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         |             |
| `owner`         | readonly         |             |
| `mm`            | writable         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### initMergeMinerV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         |             |
| `owner`         | readonly         |             |
| `mm`            | writable         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### initMinerMM

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         |             |
| `mm`            | readonly         |             |
| `miner`         | writable         |             |
| `quarry`        | writable         |             |
| `rewarder`      | readonly         |             |
| `tokenMint`     | readonly         |             |
| `minerVault`    | readonly         |             |
| `payer`         | signer, writable |             |
| `mineProgram`   | readonly         |             |
| `systemProgram` | readonly         |             |
| `tokenProgram`  | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### initMinerMMV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         |             |
| `mm`            | readonly         |             |
| `miner`         | writable         |             |
| `quarry`        | writable         |             |
| `rewarder`      | readonly         |             |
| `tokenMint`     | readonly         |             |
| `minerVault`    | readonly         |             |
| `payer`         | signer, writable |             |
| `mineProgram`   | readonly         |             |
| `systemProgram` | readonly         |             |
| `tokenProgram`  | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### stakePrimaryMiner

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `mmOwner`               | signer   |             |
| `mmPrimaryTokenAccount` | writable |             |
| `pool`                  | writable |             |
| `mm`                    | writable |             |
| `rewarder`              | readonly |             |
| `quarry`                | writable |             |
| `miner`                 | writable |             |
| `minerVault`            | writable |             |
| `tokenProgram`          | readonly |             |
| `mineProgram`           | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### stakeReplicaMiner

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `mmOwner`                 | signer   |             |
| `replicaMint`             | writable |             |
| `replicaMintTokenAccount` | writable |             |
| `pool`                    | writable |             |
| `mm`                      | writable |             |
| `rewarder`                | readonly |             |
| `quarry`                  | writable |             |
| `miner`                   | writable |             |
| `minerVault`              | writable |             |
| `tokenProgram`            | readonly |             |
| `mineProgram`             | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### unstakePrimaryMiner

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `mmOwner`               | signer   |             |
| `mmPrimaryTokenAccount` | writable |             |
| `pool`                  | writable |             |
| `mm`                    | writable |             |
| `rewarder`              | readonly |             |
| `quarry`                | writable |             |
| `miner`                 | writable |             |
| `minerVault`            | writable |             |
| `tokenProgram`          | readonly |             |
| `mineProgram`           | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### unstakeAllReplicaMiner

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `mmOwner`                 | signer   |             |
| `replicaMint`             | writable |             |
| `replicaMintTokenAccount` | writable |             |
| `pool`                    | writable |             |
| `mm`                      | writable |             |
| `rewarder`                | readonly |             |
| `quarry`                  | writable |             |
| `miner`                   | writable |             |
| `minerVault`              | writable |             |
| `tokenProgram`            | readonly |             |
| `mineProgram`             | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### withdrawTokensMM

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `owner`            | signer   |             |
| `pool`             | readonly |             |
| `mm`               | writable |             |
| `withdrawMint`     | readonly |             |
| `mmTokenAccount`   | writable |             |
| `tokenDestination` | writable |             |
| `tokenProgram`     | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### rescueTokensMM

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `mmOwner`                 | signer   |             |
| `mergePool`               | readonly |             |
| `mm`                      | readonly |             |
| `miner`                   | readonly |             |
| `minerTokenAccount`       | writable |             |
| `destinationTokenAccount` | writable |             |
| `quarryMineProgram`       | readonly |             |
| `tokenProgram`            | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### claimRewardsMM

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `mintWrapper`          | writable |             |
| `mintWrapperProgram`   | readonly |             |
| `minter`               | writable |             |
| `rewardsTokenMint`     | writable |             |
| `rewardsTokenAccount`  | writable |             |
| `claimFeeTokenAccount` | writable |             |
| `stakeTokenAccount`    | writable |             |
| `pool`                 | writable |             |
| `mm`                   | writable |             |
| `rewarder`             | readonly |             |
| `quarry`               | writable |             |
| `miner`                | writable |             |
| `minerVault`           | writable |             |
| `tokenProgram`         | readonly |             |
| `mineProgram`          | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

## PDAs

### mergePool

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `primaryMint` | `PublicKey`      |             |

### replicaMint

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `pool`     | `PublicKey`      |             |

### mergeMiner

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `pool`     | `PublicKey`      |             |
| `owner`    | `PublicKey`      |             |

## Types

### newMergePoolEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  primaryMint: PublicKey;
}
```

### initMergeMinerEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  primaryMint: PublicKey;
  owner: PublicKey;
}
```

### initMinerEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  miner: PublicKey;
}
```

### stakePrimaryEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  miner: PublicKey;
  owner: PublicKey;
  amount: bigint;
}
```

### stakeReplicaEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  miner: PublicKey;
  owner: PublicKey;
  amount: bigint;
}
```

### unstakePrimaryEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  miner: PublicKey;
  owner: PublicKey;
  amount: bigint;
}
```

### unstakeReplicaEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  miner: PublicKey;
  owner: PublicKey;
  amount: bigint;
}
```

### withdrawTokensEvent

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  owner: PublicKey;
  mint: PublicKey;
  amount: bigint;
}
```

### claimEventMM

**Definition:**

```typescript
{
  pool: PublicKey;
  mm: PublicKey;
  mint: PublicKey;
  amount: bigint;
  initialBalance: bigint;
  endBalance: bigint;
}
```

## Errors

- **unauthorized** (Code: 6000 / `6000` / `0x1770`) -- Unauthorized.
- **insufficientBalance** (Code: 6001 / `6001` / `0x1771`) -- Insufficient balance.
- **invalidMiner** (Code: 6002 / `6002` / `0x1772`) -- Invalid miner for the given quarry.
- **cannotWithdrawReplicaMint** (Code: 6003 / `6003` / `0x1773`) -- Cannot withdraw a replica mint.
- **outstandingReplicaTokens** (Code: 6004 / `6004` / `0x1774`) -- User must first withdraw from all replica quarries.
- **replicaDecimalsMismatch** (Code: 6005 / `6005` / `0x1775`) -- The replica mint must have the same number of decimals as the primary mint.
- **replicaNonZeroSupply** (Code: 6006 / `6006` / `0x1776`) -- The replica mint must have zero supply.
