# Quarry Merge Mine Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fquarry-merge-mine.svg)](https://www.npmjs.com/package/%40solana-programs%2Fquarry-merge-mine)

- Program ID: `QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto`
- TypeScript Client: [`@solana-programs/quarry-merge-mine`](https://www.npmjs.com/package/@solana-programs/quarry-merge-mine)

## Table of Contents

- [Accounts](#accounts)
  - [mergePool](#mergePool)
  - [mergeMiner](#mergeMiner)
- [Instructions](#instructions)
  - [newPool](#newPool)
  - [newPoolV2](#newPoolV2)
  - [initMergeMiner](#initMergeMiner)
  - [initMergeMinerV2](#initMergeMinerV2)
  - [initMinerMM](#initMinerMM)
  - [initMinerMMV2](#initMinerMMV2)
  - [stakePrimaryMiner](#stakePrimaryMiner)
  - [stakeReplicaMiner](#stakeReplicaMiner)
  - [unstakePrimaryMiner](#unstakePrimaryMiner)
  - [unstakeAllReplicaMiner](#unstakeAllReplicaMiner)
  - [withdrawTokensMM](#withdrawTokensMM)
  - [rescueTokensMM](#rescueTokensMM)
  - [claimRewardsMM](#claimRewardsMM)
- [PDAs](#pdas)
  - [mergePool](#mergePool)
  - [replicaMint](#replicaMint)
  - [mergeMiner](#mergeMiner)
- [Types](#types)
  - [newMergePoolEvent](#newMergePoolEvent)
  - [initMergeMinerEvent](#initMergeMinerEvent)
  - [initMinerEvent](#initMinerEvent)
  - [stakePrimaryEvent](#stakePrimaryEvent)
  - [stakeReplicaEvent](#stakeReplicaEvent)
  - [unstakePrimaryEvent](#unstakePrimaryEvent)
  - [unstakeReplicaEvent](#unstakeReplicaEvent)
  - [withdrawTokensEvent](#withdrawTokensEvent)
  - [claimEventMM](#claimEventMM)
- [Errors](#errors)

## Accounts

### mergePool

**Fields:**

| Field                 | Type        | Description |
| --------------------- | ----------- | ----------- |
| `discriminator`       | `unknown`   | -           |
| `primaryMint`         | `PublicKey` | -           |
| `bump`                | `u8`        | -           |
| `replicaMint`         | `PublicKey` | -           |
| `mmCount`             | `u64`       | -           |
| `totalPrimaryBalance` | `u64`       | -           |
| `totalReplicaBalance` | `u64`       | -           |
| `reserved`            | `u64`[16]   | -           |

### mergeMiner

**Fields:**

| Field            | Type        | Description |
| ---------------- | ----------- | ----------- |
| `discriminator`  | `unknown`   | -           |
| `pool`           | `PublicKey` | -           |
| `owner`          | `PublicKey` | -           |
| `bump`           | `u8`        | -           |
| `index`          | `u64`       | -           |
| `primaryBalance` | `u64`       | -           |
| `replicaBalance` | `u64`       | -           |

## Instructions

### newPool

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | writable         | -           |
| `primaryMint`   | readonly         | -           |
| `replicaMint`   | writable         | -           |
| `payer`         | signer, writable | -           |
| `tokenProgram`  | readonly         | -           |
| `systemProgram` | readonly         | -           |
| `rent`          | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |
| `mintBump`      | `u8`      | -           |

### newPoolV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | writable         | -           |
| `primaryMint`   | readonly         | -           |
| `replicaMint`   | writable         | -           |
| `payer`         | signer, writable | -           |
| `tokenProgram`  | readonly         | -           |
| `systemProgram` | readonly         | -           |
| `rent`          | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### initMergeMiner

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         | -           |
| `owner`         | readonly         | -           |
| `mm`            | writable         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |

### initMergeMinerV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         | -           |
| `owner`         | readonly         | -           |
| `mm`            | writable         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### initMinerMM

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         | -           |
| `mm`            | readonly         | -           |
| `miner`         | writable         | -           |
| `quarry`        | writable         | -           |
| `rewarder`      | readonly         | -           |
| `tokenMint`     | readonly         | -           |
| `minerVault`    | readonly         | -           |
| `payer`         | signer, writable | -           |
| `mineProgram`   | readonly         | -           |
| `systemProgram` | readonly         | -           |
| `tokenProgram`  | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |

### initMinerMMV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `pool`          | readonly         | -           |
| `mm`            | readonly         | -           |
| `miner`         | writable         | -           |
| `quarry`        | writable         | -           |
| `rewarder`      | readonly         | -           |
| `tokenMint`     | readonly         | -           |
| `minerVault`    | readonly         | -           |
| `payer`         | signer, writable | -           |
| `mineProgram`   | readonly         | -           |
| `systemProgram` | readonly         | -           |
| `tokenProgram`  | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### stakePrimaryMiner

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `mmOwner`               | signer   | -           |
| `mmPrimaryTokenAccount` | writable | -           |
| `pool`                  | writable | -           |
| `mm`                    | writable | -           |
| `rewarder`              | readonly | -           |
| `quarry`                | writable | -           |
| `miner`                 | writable | -           |
| `minerVault`            | writable | -           |
| `tokenProgram`          | readonly | -           |
| `mineProgram`           | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### stakeReplicaMiner

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `mmOwner`                 | signer   | -           |
| `replicaMint`             | writable | -           |
| `replicaMintTokenAccount` | writable | -           |
| `pool`                    | writable | -           |
| `mm`                      | writable | -           |
| `rewarder`                | readonly | -           |
| `quarry`                  | writable | -           |
| `miner`                   | writable | -           |
| `minerVault`              | writable | -           |
| `tokenProgram`            | readonly | -           |
| `mineProgram`             | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### unstakePrimaryMiner

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `mmOwner`               | signer   | -           |
| `mmPrimaryTokenAccount` | writable | -           |
| `pool`                  | writable | -           |
| `mm`                    | writable | -           |
| `rewarder`              | readonly | -           |
| `quarry`                | writable | -           |
| `miner`                 | writable | -           |
| `minerVault`            | writable | -           |
| `tokenProgram`          | readonly | -           |
| `mineProgram`           | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `amount`        | `u64`     | -           |

### unstakeAllReplicaMiner

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `mmOwner`                 | signer   | -           |
| `replicaMint`             | writable | -           |
| `replicaMintTokenAccount` | writable | -           |
| `pool`                    | writable | -           |
| `mm`                      | writable | -           |
| `rewarder`                | readonly | -           |
| `quarry`                  | writable | -           |
| `miner`                   | writable | -           |
| `minerVault`              | writable | -           |
| `tokenProgram`            | readonly | -           |
| `mineProgram`             | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### withdrawTokensMM

**Accounts:**

| Account            | Type     | Description |
| ------------------ | -------- | ----------- |
| `owner`            | signer   | -           |
| `pool`             | readonly | -           |
| `mm`               | writable | -           |
| `withdrawMint`     | readonly | -           |
| `mmTokenAccount`   | writable | -           |
| `tokenDestination` | writable | -           |
| `tokenProgram`     | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### rescueTokensMM

**Accounts:**

| Account                   | Type     | Description |
| ------------------------- | -------- | ----------- |
| `mmOwner`                 | signer   | -           |
| `mergePool`               | readonly | -           |
| `mm`                      | readonly | -           |
| `miner`                   | readonly | -           |
| `minerTokenAccount`       | writable | -           |
| `destinationTokenAccount` | writable | -           |
| `quarryMineProgram`       | readonly | -           |
| `tokenProgram`            | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### claimRewardsMM

**Accounts:**

| Account                | Type     | Description |
| ---------------------- | -------- | ----------- |
| `mintWrapper`          | writable | -           |
| `mintWrapperProgram`   | readonly | -           |
| `minter`               | writable | -           |
| `rewardsTokenMint`     | writable | -           |
| `rewardsTokenAccount`  | writable | -           |
| `claimFeeTokenAccount` | writable | -           |
| `stakeTokenAccount`    | writable | -           |
| `pool`                 | writable | -           |
| `mm`                   | writable | -           |
| `rewarder`             | readonly | -           |
| `quarry`               | writable | -           |
| `miner`                | writable | -           |
| `minerVault`           | writable | -           |
| `tokenProgram`         | readonly | -           |
| `mineProgram`          | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

## PDAs

### mergePool

Merge pool that allows staking multiple quarry rewards as one

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `primaryMint` | `PublicKey`      | -           |

### replicaMint

Replica mint token for the merge pool

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `pool`     | `PublicKey`      | -           |

### mergeMiner

Merge miner account for a user in a merge pool

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `pool`     | `PublicKey`      | -           |
| `owner`    | `PublicKey`      | -           |

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

- **6000 - Unauthorized**: Unauthorized. _(Hex: `0x1770`)_
- **6001 - InsufficientBalance**: Insufficient balance. _(Hex: `0x1771`)_
- **6002 - InvalidMiner**: Invalid miner for the given quarry. _(Hex: `0x1772`)_
- **6003 - CannotWithdrawReplicaMint**: Cannot withdraw a replica mint. _(Hex: `0x1773`)_
- **6004 - OutstandingReplicaTokens**: User must first withdraw from all replica quarries. _(Hex: `0x1774`)_
- **6005 - ReplicaDecimalsMismatch**: The replica mint must have the same number of decimals as the primary mint. _(Hex: `0x1775`)_
- **6006 - ReplicaNonZeroSupply**: The replica mint must have zero supply. _(Hex: `0x1776`)_
