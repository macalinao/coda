# @solana-programs/goki

[![npm version](https://img.shields.io/npm/v/@solana-programs/goki.svg)](https://www.npmjs.com/package/@solana-programs/goki)

TypeScript client for the Goki programs (Smart Wallet and Token Signer), generated using Coda CLI with full ESM support.

## Installation

```bash
bun add @solana-programs/goki
```

## About Goki

Goki is a multisig and smart wallet protocol on Solana, made up of two programs:

- **Smart Wallet**: An owner-threshold multisig that proposes, approves, and executes arbitrary instructions, optionally behind a timelock
- **Token Signer**: Lets the holder of an NFT sign instructions on behalf of a PDA derived from that NFT's mint

This client pairs with [`@macalinao/clients-tribeca`](../tribeca): Tribeca governance executes passed proposals through a Goki smart wallet, so the two are almost always used together.

## Programs Included

### Smart Wallet Program

- **SmartWallet**: Owner set, threshold, and timelock configuration for a multisig
- **Transaction**: A proposed instruction bundle, its approvals, and its execution status
- **SubaccountInfo**: Metadata describing a derived or owner-invoker subaccount

### Token Signer Program

- **InvokeSignedInstruction**: Invokes an instruction signed by the PDA of an NFT mint, authorized by the NFT's holder

## Development

This client is generated from the Goki IDLs using Coda CLI:

```bash
# Generate the client from idls/
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The IDLs are legacy Anchor 0.x IDLs that declare their PDA seeds inline on instruction accounts, which the Anchor-to-Codama parser does not carry over. `coda.config.ts` redeclares those seeds so the client ships PDA helpers, and links each account to its PDA.

The full set of PDA helpers:

| Helper | Seeds |
| --- | --- |
| `findSmartWalletPda({ base })` | `"GokiSmartWallet"`, base |
| `findTransactionPda({ smartWallet, index })` | `"GokiTransaction"`, smart wallet, index |
| `findSubaccountInfoPda({ subaccount })` | `"GokiSubaccountInfo"`, subaccount |
| `findWalletDerivedPda({ smartWallet, index })` | `"GokiSmartWalletDerived"`, smart wallet, index |
| `findOwnerInvokerPda({ smartWallet, index })` | `"GokiSmartWalletOwnerInvoker"`, smart wallet, index |
| `findNftSignerPda({ mint })` | `"GokiTokenSigner"`, mint |

`walletDerived` and `ownerInvoker` are subaccount addresses rather than stored accounts — they back `executeTransactionDerived` and `ownerInvokeInstruction` respectively, and have no on-chain struct to decode.

## Usage

```typescript
import {
  fetchSmartWallet,
  fetchTransaction,
  findSmartWalletPda,
  findTransactionPda,
  getApproveInstruction,
  getCreateTransactionInstruction,
} from "@solana-programs/goki";

const [smartWallet] = await findSmartWalletPda({ base: baseAddress });
const wallet = await fetchSmartWallet(rpc, smartWallet);

const [transaction] = await findTransactionPda({
  smartWallet,
  index: wallet.data.numTransactions,
});

const createIx = getCreateTransactionInstruction({
  smartWallet,
  transaction,
  proposer: proposerSigner,
  payer: payerSigner,
  bump: 0,
  instructions: [
    /* TXInstruction[] */
  ],
});

const approveIx = getApproveInstruction({
  smartWallet,
  transaction,
  owner: ownerSigner,
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
