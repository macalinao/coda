# Quarry Registry Program

- Program ID: `QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc`

## Table of Contents

- [Accounts](#accounts)
  - [registry](#registry)
- [Instructions](#instructions)
  - [newRegistry](#newRegistry-1)
  - [syncQuarry](#syncQuarry-1)
- [PDAs](#pdas)
  - [registry](#registry-2)

## Accounts

### registry

**Fields:**

| Field           | Type          | Description |
| --------------- | ------------- | ----------- |
| `discriminator` | `unknown`     |             |
| `bump`          | `u8`          |             |
| `rewarder`      | `PublicKey`   |             |
| `tokens`        | `PublicKey`[] |             |

## Instructions

### newRegistry

**Accounts:**

| Account         | Type             | Description |
| --------------- | ---------------- | ----------- |
| `rewarder`      | readonly         |             |
| `registry`      | writable         |             |
| `payer`         | signer, writable |             |
| `systemProgram` | readonly         |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |
| `maxQuarries`   | `u16`     |             |
| `bump`          | `u8`      |             |

### syncQuarry

**Accounts:**

| Account    | Type     | Description |
| ---------- | -------- | ----------- |
| `quarry`   | readonly |             |
| `registry` | writable |             |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` |             |

## PDAs

### registry

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `rewarder` | `PublicKey`      |             |
