# Quarry Operator Program

- Program ID: `QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz`

## Table of Contents

- [Accounts](#accounts)
  - [operator](#operator)
- [Instructions](#instructions)
  - [createOperator](#createOperator-1)
  - [createOperatorV2](#createOperatorV2-1)
  - [setAdmin](#setAdmin-1)
  - [setRateSetter](#setRateSetter-1)
  - [setQuarryCreator](#setQuarryCreator-1)
  - [setShareAllocator](#setShareAllocator-1)
  - [delegateSetAnnualRewards](#delegateSetAnnualRewards-1)
  - [delegateCreateQuarry](#delegateCreateQuarry-1)
  - [delegateCreateQuarryV2](#delegateCreateQuarryV2-1)
  - [delegateSetRewardsShare](#delegateSetRewardsShare-1)
  - [delegateSetFamine](#delegateSetFamine-1)
- [PDAs](#pdas)
  - [operator](#operator-2)
- [Errors](#errors)

## Accounts

### operator

**Fields:**

| Field            | Type        | Description |
| ---------------- | ----------- | ----------- |
| `discriminator`  | `unknown`   |             |
| `base`           | `PublicKey` |             |
| `bump`           | `u8`        |             |
| `rewarder`       | `PublicKey` |             |
| `admin`          | `PublicKey` |             |
| `rateSetter`     | `PublicKey` |             |
| `quarryCreator`  | `PublicKey` |             |
| `shareAllocator` | `PublicKey` |             |
| `lastModifiedTs` | `i64`       |             |
| `generation`     | `u64`       |             |

## Instructions

### createOperator

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `base`              | signer           |             |
| `operator`          | writable         |             |
| `rewarder`          | writable         |             |
| `admin`             | readonly         |             |
| `payer`             | signer, writable |             |
| `systemProgram`     | readonly         |             |
| `quarryMineProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### createOperatorV2

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `base`              | signer           |             |
| `operator`          | writable         |             |
| `rewarder`          | writable         |             |
| `admin`             | readonly         |             |
| `payer`             | signer, writable |             |
| `systemProgram`     | readonly         |             |
| `quarryMineProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setAdmin

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable |             |
| `admin`    | signer   |             |
| `delegate` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setRateSetter

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable |             |
| `admin`    | signer   |             |
| `delegate` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setQuarryCreator

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable |             |
| `admin`    | signer   |             |
| `delegate` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### setShareAllocator

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `operator` | writable |             |
| `admin`    | signer   |             |
| `delegate` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### delegateSetAnnualRewards

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `operator`          | writable |             |
| `delegate`          | signer   |             |
| `rewarder`          | writable |             |
| `quarryMineProgram` | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `newRate`       | `u64`     |             |

### delegateCreateQuarry

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `operator`          | writable         |             |
| `delegate`          | signer           |             |
| `rewarder`          | writable         |             |
| `quarryMineProgram` | readonly         |             |
| `quarry`            | writable         |             |
| `tokenMint`         | readonly         |             |
| `payer`             | signer, writable |             |
| `unusedAccount`     | readonly         |             |
| `systemProgram`     | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### delegateCreateQuarryV2

**Accounts:**

| Account             | Type             | Description |
| ------------------- | ---------------- | ----------- |
| `operator`          | writable         |             |
| `delegate`          | signer           |             |
| `rewarder`          | writable         |             |
| `quarryMineProgram` | readonly         |             |
| `quarry`            | writable         |             |
| `tokenMint`         | readonly         |             |
| `payer`             | signer, writable |             |
| `systemProgram`     | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### delegateSetRewardsShare

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `operator`          | writable |             |
| `delegate`          | signer   |             |
| `rewarder`          | writable |             |
| `quarryMineProgram` | readonly |             |
| `quarry`            | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `newShare`      | `u64`     |             |

### delegateSetFamine

**Accounts:**

| Account             | Type     | Description |
| ------------------- | -------- | ----------- |
| `operator`          | writable |             |
| `delegate`          | signer   |             |
| `rewarder`          | writable |             |
| `quarryMineProgram` | readonly |             |
| `quarry`            | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `famineTs`      | `i64`     |             |

## PDAs

### operator

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      |             |

## Errors

- **unauthorized** (Code: 6000 / `6000` / `0x1770`) -- Signer is not authorized to perform this action.
- **pendingAuthorityNotSet** (Code: 6001 / `6001` / `0x1771`) -- Pending authority must be set to the created operator.
- **operatorNotRewarderAuthority** (Code: 6002 / `6002` / `0x1772`) -- Operator is not the Rewarder authority.
