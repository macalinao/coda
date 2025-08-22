# Quarry Mint Wrapper Program

[![npm version](https://badge.fury.io/js/%40macalinao%2Fclients-quarry.svg)](https://www.npmjs.com/package/%40macalinao%2Fclients-quarry)

- Program ID: `QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV`
- TypeScript Client: [`@macalinao/clients-quarry`](https://www.npmjs.com/package/@macalinao/clients-quarry)

## Table of Contents

- [Accounts](#accounts)
  - [mintWrapper](#mintWrapper)
  - [minter](#minter)
- [Instructions](#instructions)
  - [newWrapper](#newWrapper-1)
  - [newWrapperV2](#newWrapperV2-1)
  - [transferAdmin](#transferAdmin-1)
  - [acceptAdmin](#acceptAdmin-1)
  - [newMinter](#newMinter-1)
  - [newMinterV2](#newMinterV2-1)
  - [minterUpdate](#minterUpdate-1)
  - [performMint](#performMint-1)
- [PDAs](#pdas)
  - [mintWrapper](#mintWrapper-2)
  - [minter](#minter-2)
- [Types](#types)
  - [newMintWrapperEvent](#newMintWrapperEvent-3)
  - [mintWrapperAdminProposeEvent](#mintWrapperAdminProposeEvent-3)
  - [mintWrapperAdminUpdateEvent](#mintWrapperAdminUpdateEvent-3)
  - [newMinterEvent](#newMinterEvent-3)
  - [minterAllowanceUpdateEvent](#minterAllowanceUpdateEvent-3)
  - [minterMintEvent](#minterMintEvent-3)
- [Errors](#errors)

## Accounts

### mintWrapper

**Fields:**

| Field            | Type        | Description |
| ---------------- | ----------- | ----------- |
| `discriminator`  | `unknown`   |             |
| `base`           | `PublicKey` |             |
| `bump`           | `u8`        |             |
| `hardCap`        | `u64`       |             |
| `admin`          | `PublicKey` |             |
| `pendingAdmin`   | `PublicKey` |             |
| `tokenMint`      | `PublicKey` |             |
| `numMinters`     | `u64`       |             |
| `totalAllowance` | `u64`       |             |
| `totalMinted`    | `u64`       |             |

### minter

**Fields:**

| Field             | Type        | Description |
| ----------------- | ----------- | ----------- |
| `discriminator`   | `unknown`   |             |
| `mintWrapper`     | `PublicKey` |             |
| `minterAuthority` | `PublicKey` |             |
| `bump`            | `u8`        |             |
| `index`           | `u64`       |             |
| `allowance`       | `u64`       |             |
| `totalMinted`     | `u64`       |             |

## Instructions

### newWrapper

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `base`          | signer           |             |
| `mintWrapper`   | writable         |             |
| `admin`         | readonly         |             |
| `tokenMint`     | readonly         |             |
| `tokenProgram`  | readonly         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |
| `hardCap`       | `u64`     |             |

### newWrapperV2

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `base`          | signer           |             |
| `mintWrapper`   | writable         |             |
| `admin`         | readonly         |             |
| `tokenMint`     | readonly         |             |
| `tokenProgram`  | readonly         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `hardCap`       | `u64`     |             |

### transferAdmin

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `mintWrapper` | writable |             |
| `admin`       | signer   |             |
| `nextAdmin`   | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### acceptAdmin

**Accounts:**

| Account        | Type     | Description |
| -------------- | -------- | ----------- |
| `mintWrapper`  | writable |             |
| `pendingAdmin` | signer   |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### newMinter

**Accounts:**

| Account              | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `mintWrapper`        | writable         |             |
| `admin`              | signer           |             |
| `newMinterAuthority` | readonly         |             |
| `minter`             | writable         |             |
| `payer`              | signer, writable |             |
| `systemProgram`      | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### newMinterV2

**Accounts:**

| Account              | Type             | Description |
| -------------------- | ---------------- | ----------- |
| `mintWrapper`        | writable         |             |
| `admin`              | signer           |             |
| `newMinterAuthority` | readonly         |             |
| `minter`             | writable         |             |
| `payer`              | signer, writable |             |
| `systemProgram`      | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

### minterUpdate

**Accounts:**

| Account       | Type     | Description |
| ------------- | -------- | ----------- |
| `mintWrapper` | writable |             |
| `admin`       | signer   |             |
| `minter`      | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `allowance`     | `u64`     |             |

### performMint

**Accounts:**

| Account           | Type     | Description |
| ----------------- | -------- | ----------- |
| `mintWrapper`     | writable |             |
| `minterAuthority` | signer   |             |
| `tokenMint`       | writable |             |
| `destination`     | writable |             |
| `minter`          | writable |             |
| `tokenProgram`    | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

## PDAs

### mintWrapper

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `base`     | `PublicKey`      |             |

### minter

**Seeds:**

| Seed        | Type             | Description |
| ----------- | ---------------- | ----------- |
| `constant`  | bytes (constant) | -           |
| `wrapper`   | `PublicKey`      |             |
| `authority` | `PublicKey`      |             |

## Types

### newMintWrapperEvent

**Definition:**

```typescript
{
  mintWrapper: PublicKey;
  hardCap: bigint;
  admin: PublicKey;
  tokenMint: PublicKey;
}
```

### mintWrapperAdminProposeEvent

**Definition:**

```typescript
{
  mintWrapper: PublicKey;
  currentAdmin: PublicKey;
  pendingAdmin: PublicKey;
}
```

### mintWrapperAdminUpdateEvent

**Definition:**

```typescript
{
  mintWrapper: PublicKey;
  previousAdmin: PublicKey;
  admin: PublicKey;
}
```

### newMinterEvent

**Definition:**

```typescript
{
  mintWrapper: PublicKey;
  minter: PublicKey;
  index: bigint;
  minterAuthority: PublicKey;
}
```

### minterAllowanceUpdateEvent

**Definition:**

```typescript
{
  mintWrapper: PublicKey;
  minter: PublicKey;
  previousAllowance: bigint;
  allowance: bigint;
}
```

### minterMintEvent

**Definition:**

```typescript
{
  mintWrapper: PublicKey;
  minter: PublicKey;
  amount: bigint;
  destination: PublicKey;
}
```

## Errors

- **unauthorized** (Code: 6000 / `6000` / `0x1770`) -- You are not authorized to perform this action.
- **hardcapExceeded** (Code: 6001 / `6001` / `0x1771`) -- Cannot mint over hard cap.
- **minterAllowanceExceeded** (Code: 6002 / `6002` / `0x1772`) -- Minter allowance exceeded.
