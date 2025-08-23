# Quarry Redeemer Program

[![npm version](https://badge.fury.io/js/%40macalinao%2Fclients-quarry.svg)](https://www.npmjs.com/package/%40macalinao%2Fclients-quarry)

- Program ID: `QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9`
- TypeScript Client: [`@macalinao/clients-quarry`](https://www.npmjs.com/package/@macalinao/clients-quarry)

## Table of Contents

- [Accounts](#accounts)
  - [redeemer](#redeemer)
- [Instructions](#instructions)
  - [createRedeemer](#createRedeemer)
  - [redeemTokens](#redeemTokens)
  - [redeemAllTokens](#redeemAllTokens)
- [PDAs](#pdas)
  - [redeemer](#redeemer)
- [Types](#types)
  - [redeemTokensEvent](#redeemTokensEvent)
- [Errors](#errors)

## Accounts

### redeemer

**Fields:**

| Field                 | Type        | Description |
| --------------------- | ----------- | ----------- |
| `discriminator`       | `unknown`   |             |
| `iouMint`             | `PublicKey` |             |
| `redemptionMint`      | `PublicKey` |             |
| `bump`                | `u8`        |             |
| `totalTokensRedeemed` | `u64`       |             |

## Instructions

### createRedeemer

**Accounts:**

| Account          | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `redeemer`       | writable         |             |
| `iouMint`        | readonly         |             |
| `redemptionMint` | readonly         |             |
| `payer`          | signer, writable |             |
| `systemProgram`  | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `bump`          | `u8`      |             |

### redeemTokens

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `redeemer`              | writable |             |
| `sourceAuthority`       | signer   |             |
| `iouMint`               | writable |             |
| `iouSource`             | writable |             |
| `redemptionVault`       | writable |             |
| `redemptionDestination` | writable |             |
| `tokenProgram`          | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `amount`        | `u64`     |             |

### redeemAllTokens

**Accounts:**

| Account                 | Type     | Description |
| ----------------------- | -------- | ----------- |
| `redeemer`              | writable |             |
| `sourceAuthority`       | signer   |             |
| `iouMint`               | writable |             |
| `iouSource`             | writable |             |
| `redemptionVault`       | writable |             |
| `redemptionDestination` | writable |             |
| `tokenProgram`          | readonly |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

## PDAs

### redeemer

**Seeds:**

| Seed             | Type             | Description |
| ---------------- | ---------------- | ----------- |
| `constant`       | bytes (constant) | -           |
| `iouMint`        | `PublicKey`      |             |
| `redemptionMint` | `PublicKey`      |             |

## Types

### redeemTokensEvent

**Definition:**

```typescript
{
  user: PublicKey;
  iouMint: PublicKey;
  redemptionMint: PublicKey;
  amount: bigint;
  timestamp: bigint;
}
```

## Errors

- **6000 - Unauthorized**: Unauthorized. _(Hex: `0x1770`)_
