# Token Signer Program

[![npm version](https://badge.fury.io/js/%40solana-programs%2Fgoki-token-signer.svg)](https://www.npmjs.com/package/%40solana-programs%2Fgoki-token-signer)

- Program ID: `NFTUJzSHuUCsMMqMRJpB7PmbsaU7Wm51acdPk2FXMLn`
- TypeScript Client: [`@solana-programs/goki-token-signer`](https://www.npmjs.com/package/@solana-programs/goki-token-signer)

## Table of Contents

- [Instructions](#instructions)
  - [invokeSignedInstruction](#invokeSignedInstruction)
- [PDAs](#pdas)
  - [nftSigner](#nftSigner)
- [Errors](#errors)

## Instructions

### invokeSignedInstruction

**Accounts:**

| Account          | Type     | Description |
| ---------------- | -------- | ----------- |
| `ownerAuthority` | signer   | -           |
| `nftAccount`     | readonly | -           |
| `nftPda`         | readonly | -           |

**Arguments:**

| Argument        | Type      | Description |
| --------------- | --------- | ----------- |
| `discriminator` | `unknown` | -           |
| `data`          | `unknown` | -           |

## PDAs

### nftSigner

Signer PDA owned by the holder of a given NFT mint

**Seeds:**

| Seed       | Type             | Description |
| ---------- | ---------------- | ----------- |
| `constant` | bytes (constant) | -           |
| `mint`     | `PublicKey`      | -           |

## Errors

- **6000 - Unauthorized**: Unauthorized. _(Hex: `0x1770`)_
