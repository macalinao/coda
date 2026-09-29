# Smart Wallet Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fgoki-smart-wallet.svg)](https://www.npmjs.com/package/%40solana-programs%2Fgoki-smart-wallet)

- Program ID: `GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH`
- TypeScript Client: [`@solana-programs/goki-smart-wallet`](https://www.npmjs.com/package/@solana-programs/goki-smart-wallet)

## Table of Contents

- [Accounts](#accounts)
  - [smartWallet](#smartWallet)
  - [transaction](#transaction)
  - [subaccountInfo](#subaccountInfo)
- [Instructions](#instructions)
  - [createSmartWallet](#createSmartWallet)
  - [setOwners](#setOwners)
  - [changeThreshold](#changeThreshold)
  - [createTransaction](#createTransaction)
  - [createTransactionWithTimelock](#createTransactionWithTimelock)
  - [approve](#approve)
  - [unapprove](#unapprove)
  - [executeTransaction](#executeTransaction)
  - [executeTransactionDerived](#executeTransactionDerived)
  - [ownerInvokeInstruction](#ownerInvokeInstruction)
  - [ownerInvokeInstructionV2](#ownerInvokeInstructionV2)
  - [createSubaccountInfo](#createSubaccountInfo)
- [PDAs](#pdas)
  - [smartWallet](#smartWallet)
  - [transaction](#transaction)
  - [subaccountInfo](#subaccountInfo)
  - [walletDerived](#walletDerived)
  - [ownerInvoker](#ownerInvoker)
- [Types](#types)
  - [tXInstruction](#tXInstruction)
  - [tXAccountMeta](#tXAccountMeta)
  - [subaccountType](#subaccountType)
  - [walletCreateEvent](#walletCreateEvent)
  - [walletSetOwnersEvent](#walletSetOwnersEvent)
  - [walletChangeThresholdEvent](#walletChangeThresholdEvent)
  - [transactionCreateEvent](#transactionCreateEvent)
  - [transactionApproveEvent](#transactionApproveEvent)
  - [transactionUnapproveEvent](#transactionUnapproveEvent)
  - [transactionExecuteEvent](#transactionExecuteEvent)
- [Errors](#errors)

## Accounts

### smartWallet

**Fields:**

| Field             | Type          | Description |
| ----------------- | ------------- | ----------- |
| `discriminator`   | `unknown`     | -           |
| `base`            | `PublicKey`   | -           |
| `bump`            | `u8`          | -           |
| `threshold`       | `u64`         | -           |
| `minimumDelay`    | `i64`         | -           |
| `gracePeriod`     | `i64`         | -           |
| `ownerSetSeqno`   | `u32`         | -           |
| `numTransactions` | `u64`         | -           |
| `owners`          | `PublicKey`[] | -           |
| `reserved`        | `u64`[16]     | -           |

### transaction

**Fields:**

| Field           | Type                                | Description |
| --------------- | ----------------------------------- | ----------- |
| `discriminator` | `unknown`                           | -           |
| `smartWallet`   | `PublicKey`                         | -           |
| `index`         | `u64`                               | -           |
| `bump`          | `u8`                                | -           |
| `proposer`      | `PublicKey`                         | -           |
| `instructions`  | [tXInstruction](#tXInstruction-3)[] | -           |
| `signers`       | `boolean`[]                         | -           |
| `ownerSetSeqno` | `u32`                               | -           |
| `eta`           | `i64`                               | -           |
| `executor`      | `PublicKey`                         | -           |
| `executedAt`    | `i64`                               | -           |

### subaccountInfo

**Fields:**

| Field            | Type                                | Description |
| ---------------- | ----------------------------------- | ----------- |
| `discriminator`  | `unknown`                           | -           |
| `smartWallet`    | `PublicKey`                         | -           |
| `subaccountType` | [subaccountType](#subaccountType-3) | -           |
| `index`          | `u64`                               | -           |

## Instructions

### createSmartWallet

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `base`          | signer           | -           |
| `smartWallet`   | writable         | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type          | Description |
| --------------- | ------------- | ----------- |
| `discriminator` | `unknown`     | -           |
| `bump`          | `u8`          | -           |
| `maxOwners`     | `u8`          | -           |
| `owners`        | `PublicKey`[] | -           |
| `threshold`     | `u64`         | -           |
| `minimumDelay`  | `i64`         | -           |

### setOwners

**Accounts:**

| Account       | Type             | Description |
| ------------- | ---------------- | ----------- |
| `smartWallet` | signer, writable | -           |

**Arguments:**

| Argument        | Type          | Description |
| --------------- | ------------- | ----------- |
| `discriminator` | `unknown`     | -           |
| `owners`        | `PublicKey`[] | -           |

### changeThreshold

**Accounts:**

| Account       | Type             | Description |
| ------------- | ---------------- | ----------- |
| `smartWallet` | signer, writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `threshold`     | `u64`     | -           |

### createTransaction

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `smartWallet`   | writable         | -           |
| `transaction`   | writable         | -           |
| `proposer`      | signer           | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type                                | Description |
| --------------- | ----------------------------------- | ----------- |
| `discriminator` | `unknown`                           | -           |
| `bump`          | `u8`                                | -           |
| `instructions`  | [tXInstruction](#tXInstruction-3)[] | -           |

### createTransactionWithTimelock

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `smartWallet`   | writable         | -           |
| `transaction`   | writable         | -           |
| `proposer`      | signer           | -           |
| `payer`         | signer, writable | -           |
| `systemProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type                                | Description |
| --------------- | ----------------------------------- | ----------- |
| `discriminator` | `unknown`                           | -           |
| `bump`          | `u8`                                | -           |
| `instructions`  | [tXInstruction](#tXInstruction-3)[] | -           |
| `eta`           | `i64`                               | -           |

### approve

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `smartWallet` | readonly | -           |
| `transaction` | writable | -           |
| `owner`       | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### unapprove

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `smartWallet` | readonly | -           |
| `transaction` | writable | -           |
| `owner`       | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### executeTransaction

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `smartWallet` | readonly | -           |
| `transaction` | writable | -           |
| `owner`       | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### executeTransactionDerived

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `smartWallet` | readonly | -           |
| `transaction` | writable | -           |
| `owner`       | signer   | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `index`         | `u64`     | -           |
| `bump`          | `u8`      | -           |

### ownerInvokeInstruction

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `smartWallet` | readonly | -           |
| `owner`       | signer   | -           |

**Arguments:**

| Argument        | Type                              | Description |
| --------------- | --------------------------------- | ----------- |
| `discriminator` | `unknown`                         | -           |
| `index`         | `u64`                             | -           |
| `bump`          | `u8`                              | -           |
| `ix`            | [tXInstruction](#tXInstruction-3) | -           |

### ownerInvokeInstructionV2

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `smartWallet` | readonly | -           |
| `owner`       | signer   | -           |

**Arguments:**

| Argument        | Type        | Description |
| --------------- | ----------- | ----------- |
| `discriminator` | `unknown`   | -           |
| `index`         | `u64`       | -           |
| `bump`          | `u8`        | -           |
| `invoker`       | `PublicKey` | -           |
| `data`          | `unknown`   | -           |

### createSubaccountInfo

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `subaccountInfo` | writable         | -           |
| `payer`          | signer, writable | -           |
| `systemProgram`  | readonly         | -           |

**Arguments:**

| Argument         | Type                                | Description |
| ---------------- | ----------------------------------- | ----------- |
| `discriminator`  | `unknown`                           | -           |
| `bump`           | `u8`                                | -           |
| `subaccount`     | `PublicKey`                         | -           |
| `smartWallet`    | `PublicKey`                         | -           |
| `index`          | `u64`                               | -           |
| `subaccountType` | [subaccountType](#subaccountType-3) | -           |

## PDAs

### smartWallet

Smart wallet (multisig) account, keyed by its base address

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      | -           |

### transaction

Transaction proposed to a smart wallet, keyed by index

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `smartWallet` | `PublicKey`      | -           |
| `index`       | `u64`            | -           |

### subaccountInfo

Metadata describing a smart wallet subaccount

**Seeds:**

| Seed         | Type             | Description |
| ------------ | ---------------- | ----------- |
| `constant`   | bytes (constant) | -           |
| `subaccount` | `PublicKey`      | -           |

### walletDerived

Subaccount derived from a smart wallet, which the wallet can sign for

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `smartWallet` | `PublicKey`      | -           |
| `index`       | `u64`            | -           |

### ownerInvoker

Subaccount an owner of a smart wallet can invoke instructions through

**Seeds:**

| Seed          | Type             | Description |
| ------------- | ---------------- | ----------- |
| `constant`    | bytes (constant) | -           |
| `smartWallet` | `PublicKey`      | -           |
| `index`       | `u64`            | -           |

## Types

### tXInstruction

**Definition:**

```typescript
{
  programId: PublicKey;
  keys: tXAccountMeta[];
  data: unknown;
}
```

### tXAccountMeta

**Definition:**

```typescript
{
  pubkey: PublicKey;
  isSigner: boolean;
  isWritable: boolean;
}
```

### subaccountType

**Definition:**

```typescript
| { kind: "derived" }
  | { kind: "ownerInvoker" }
```

### walletCreateEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  owners: PublicKey[];
  threshold: bigint;
  minimumDelay: bigint;
  timestamp: bigint;
}
```

### walletSetOwnersEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  owners: PublicKey[];
  timestamp: bigint;
}
```

### walletChangeThresholdEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  threshold: bigint;
  timestamp: bigint;
}
```

### transactionCreateEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  transaction: PublicKey;
  proposer: PublicKey;
  instructions: tXInstruction[];
  eta: bigint;
  timestamp: bigint;
}
```

### transactionApproveEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  transaction: PublicKey;
  owner: PublicKey;
  timestamp: bigint;
}
```

### transactionUnapproveEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  transaction: PublicKey;
  owner: PublicKey;
  timestamp: bigint;
}
```

### transactionExecuteEvent

**Definition:**

```typescript
{
  smartWallet: PublicKey;
  transaction: PublicKey;
  executor: PublicKey;
  timestamp: bigint;
}
```

## Errors

- **6000 - InvalidOwner**: The given owner is not part of this smart wallet. _(Hex: `0x1770`)_
- **6001 - InvalidETA**: Estimated execution block must satisfy delay. _(Hex: `0x1771`)_
- **6002 - DelayTooHigh**: Delay greater than the maximum. _(Hex: `0x1772`)_
- **6003 - NotEnoughSigners**: Not enough owners signed this transaction. _(Hex: `0x1773`)_
- **6004 - TransactionIsStale**: Transaction is past the grace period. _(Hex: `0x1774`)_
- **6005 - TransactionNotReady**: Transaction hasn't surpassed time lock. _(Hex: `0x1775`)_
- **6006 - AlreadyExecuted**: The given transaction has already been executed. _(Hex: `0x1776`)_
- **6007 - InvalidThreshold**: Threshold must be less than or equal to the number of owners. _(Hex: `0x1777`)_
- **6008 - OwnerSetChanged**: Owner set has changed since the creation of the transaction. _(Hex: `0x1778`)_
- **6009 - SubaccountOwnerMismatch**: Subaccount does not belong to smart wallet. _(Hex: `0x1779`)_
- **6010 - BufferFinalized**: Buffer already finalized. _(Hex: `0x177a`)_
- **6011 - BufferBundleNotFound**: Buffer bundle not found. _(Hex: `0x177b`)_
- **6012 - BufferBundleOutOfRange**: Buffer index specified is out of range. _(Hex: `0x177c`)_
- **6013 - BufferBundleNotFinalized**: Buffer has not been finalized. _(Hex: `0x177d`)_
- **6014 - BufferBundleExecuted**: Buffer bundle has already been executed. _(Hex: `0x177e`)_
