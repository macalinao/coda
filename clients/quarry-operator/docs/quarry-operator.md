# Quarry Operator Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fquarry-operator.svg)](https://www.npmjs.com/package/%40solana-programs%2Fquarry-operator)

- Program ID: `QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz`
- TypeScript Client: [`@solana-programs/quarry-operator`](https://www.npmjs.com/package/@solana-programs/quarry-operator)

## Table of Contents

- [Accounts](#accounts)
  - [operator](#operator)
- [Instructions](#instructions)
  - [createOperator](#createOperator)
  - [createOperatorV2](#createOperatorV2)
  - [setAdmin](#setAdmin)
  - [setRateSetter](#setRateSetter)
  - [setQuarryCreator](#setQuarryCreator)
  - [setShareAllocator](#setShareAllocator)
  - [delegateSetAnnualRewards](#delegateSetAnnualRewards)
  - [delegateCreateQuarry](#delegateCreateQuarry)
  - [delegateCreateQuarryV2](#delegateCreateQuarryV2)
  - [delegateSetRewardsShare](#delegateSetRewardsShare)
  - [delegateSetFamine](#delegateSetFamine)
- [PDAs](#pdas)
  - [operator](#operator)
- [Errors](#errors)

## Accounts

### operator

**Fields:**

| Field            | Type        | Description |
| ---------------- | ----------- | ----------- |
| `discriminator`  | `unknown`   | -           |
| `base`           | `PublicKey` | -           |
| `bump`           | `u8`        | -           |
| `rewarder`       | `PublicKey` | -           |
| `admin`          | `PublicKey` | -           |
| `rateSetter`     | `PublicKey` | -           |
| `quarryCreator`  | `PublicKey` | -           |
| `shareAllocator` | `PublicKey` | -           |
| `lastModifiedTs` | `i64`       | -           |
| `generation`     | `u64`       | -           |

## Instructions

### createOperator

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `base`              | signer           | -           |
| `operator`          | writable         | -           |
| `rewarder`          | writable         | -           |
| `admin`             | readonly         | -           |
| `payer`             | signer, writable | -           |
| `systemProgram`     | readonly         | -           |
| `quarryMineProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |

### createOperatorV2

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `base`              | signer           | -           |
| `operator`          | writable         | -           |
| `rewarder`          | writable         | -           |
| `admin`             | readonly         | -           |
| `payer`             | signer, writable | -           |
| `systemProgram`     | readonly         | -           |
| `quarryMineProgram` | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### setAdmin

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable | -           |
| `admin`    | signer   | -           |
| `delegate` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### setRateSetter

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable | -           |
| `admin`    | signer   | -           |
| `delegate` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### setQuarryCreator

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable | -           |
| `admin`    | signer   | -           |
| `delegate` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### setShareAllocator

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable | -           |
| `admin`    | signer   | -           |
| `delegate` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### delegateSetAnnualRewards

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `operator`          | writable | -           |
| `delegate`          | signer   | -           |
| `rewarder`          | writable | -           |
| `quarryMineProgram` | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `newRate`       | `u64`     | -           |

### delegateCreateQuarry

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `operator`          | writable         | -           |
| `delegate`          | signer           | -           |
| `rewarder`          | writable         | -           |
| `quarryMineProgram` | readonly         | -           |
| `quarry`            | writable         | -           |
| `tokenMint`         | readonly         | -           |
| `payer`             | signer, writable | -           |
| `unusedAccount`     | readonly         | -           |
| `systemProgram`     | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `bump`          | `u8`      | -           |

### delegateCreateQuarryV2

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `operator`          | writable         | -           |
| `delegate`          | signer           | -           |
| `rewarder`          | writable         | -           |
| `quarryMineProgram` | readonly         | -           |
| `quarry`            | writable         | -           |
| `tokenMint`         | readonly         | -           |
| `payer`             | signer, writable | -           |
| `systemProgram`     | readonly         | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |

### delegateSetRewardsShare

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `operator`          | writable | -           |
| `delegate`          | signer   | -           |
| `rewarder`          | writable | -           |
| `quarryMineProgram` | readonly | -           |
| `quarry`            | writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `newShare`      | `u64`     | -           |

### delegateSetFamine

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `operator`          | writable | -           |
| `delegate`          | signer   | -           |
| `rewarder`          | writable | -           |
| `quarryMineProgram` | readonly | -           |
| `quarry`            | writable | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `famineTs`      | `i64`     | -           |

## PDAs

### operator

Operator account with delegated authority to manage quarries

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      | -           |

## Errors

- **6000 - Unauthorized**: Signer is not authorized to perform this action. _(Hex: `0x1770`)_
- **6001 - PendingAuthorityNotSet**: Pending authority must be set to the created operator. _(Hex: `0x1771`)_
- **6002 - OperatorNotRewarderAuthority**: Operator is not the Rewarder authority. _(Hex: `0x1772`)_
