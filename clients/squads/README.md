# @solana-programs/squads

[![npm version](https://img.shields.io/npm/v/@solana-programs/squads.svg)](https://www.npmjs.com/package/@solana-programs/squads)

TypeScript client for [Squads Protocol v4](https://squads.so) (`SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf`), generated using Coda with full ESM support.

This is a [`@solana/kit`](https://github.com/anza-xyz/kit)-native client. The official `@sqds/multisig` SDK is built on `@solana/web3.js` v1, so if your app has already moved to Kit this client lets you drop the v1 dependency entirely.

Generated from the IDL shipped in `@sqds/multisig@2.1.4` (`idl/squads_multisig_program.json`), which is MIT licensed.

IDL changes:

- The program node is renamed from `squads_multisig_program` to `squads`, so the generated names are `SQUADS_PROGRAM_ADDRESS`, `SquadsError`, `squadsProgram()` rather than `SQUADS_MULTISIG_PROGRAM_PROGRAM_ADDRESS` and friends. Nothing on the wire changes.

## Installation

```bash
bun add @solana-programs/squads @solana/kit
```

## Concepts

A Squads multisig is a set of members with per-member permissions and a signature threshold. Nothing executes directly. Instead:

1. Someone with `Initiate` permission creates a **transaction** account at the multisig's next transaction index.
2. A **proposal** is created for that same index and activated.
3. Members with `Vote` permission approve it until the threshold is met.
4. A member with `Execute` permission executes it, and the multisig's **vault** signs the inner instructions.

Vaults are where a multisig's assets live. Vault index 0 is the address people mean when they say "the Squad's address".

## Usage

### Deriving addresses

Every PDA in the program has a `find*Pda` helper. The derivations match `@sqds/multisig` exactly.

```typescript
import {
  findMultisigPda,
  findProgramConfigPda,
  findProposalPda,
  findTransactionPda,
  findVaultPda,
} from "@solana-programs/squads";

const [multisig] = await findMultisigPda({ createKey: createKeySigner.address });

// Vault 0 — the multisig's main treasury address.
const [vault] = await findVaultPda({ multisig, index: 0 });

// Transactions and their proposals share a transaction index.
const [transaction] = await findTransactionPda({ multisig, index: 1n });
const [proposal] = await findProposalPda({ multisig, transactionIndex: 1n });
```

### Creating a multisig

`multisigCreateV2` charges a creation fee to the treasury recorded in the global program config, so read the config first. The `multisig` account is derived for you from `createKey` when you use the async builder.

```typescript
import { generateKeyPairSigner } from "@solana/kit";
import {
  fetchProgramConfig,
  findProgramConfigPda,
  getMultisigCreateV2InstructionAsync,
} from "@solana-programs/squads";

const [programConfigPda] = await findProgramConfigPda();
const programConfig = await fetchProgramConfig(rpc, programConfigPda);

// `createKey` only signs the creation instruction; it is a throwaway keypair
// whose sole purpose is to make the multisig address unique.
const createKey = await generateKeyPairSigner();

const ix = await getMultisigCreateV2InstructionAsync({
  treasury: programConfig.data.treasury,
  createKey,
  creator,
  args: {
    configAuthority: null, // `null` = autonomous multisig (config changes go to a vote)
    threshold: 2,
    members: [
      { key: alice.address, permissions: { mask: 0b111 } }, // initiate + vote + execute
      { key: bob.address, permissions: { mask: 0b010 } }, //   vote only
      { key: carol.address, permissions: { mask: 0b010 } },
    ],
    timeLock: 0,
    rentCollector: null,
    memo: null,
  },
});
```

Permission bits are `Initiate = 0b001`, `Vote = 0b010`, `Execute = 0b100`.

### Proposing and voting

```typescript
import {
  fetchMultisig,
  findMultisigPda,
  findProposalPda,
  findTransactionPda,
  getProposalActivateInstruction,
  getProposalApproveInstruction,
  getProposalCreateInstruction,
  getVaultTransactionCreateInstruction,
} from "@solana-programs/squads";

const multisigAccount = await fetchMultisig(rpc, multisig);

// Transaction indexes are 1-based and monotonic.
const index = multisigAccount.data.transactionIndex + 1n;
const [transaction] = await findTransactionPda({ multisig, index });
const [proposal] = await findProposalPda({ multisig, transactionIndex: index });

const instructions = [
  getVaultTransactionCreateInstruction({
    multisig,
    transaction,
    creator: alice,
    rentPayer: alice,
    args: {
      vaultIndex: 0,
      ephemeralSigners: 0,
      transactionMessage, // see "Building a vault transaction message" below
      memo: null,
    },
  }),
  getProposalCreateInstruction({
    multisig,
    proposal,
    creator: alice,
    rentPayer: alice,
    args: { transactionIndex: index, draft: false },
  }),
  getProposalActivateInstruction({ multisig, member: alice, proposal }),
  getProposalApproveInstruction({
    multisig,
    member: alice,
    proposal,
    args: { memo: null },
  }),
];
```

### Building a vault transaction message

`vaultTransactionCreate` takes `transactionMessage` as raw bytes in Squads' own compact message format (`VaultTransactionMessage`), not a standard Solana message. This client generates the codec, but not the compiler that turns a list of instructions into one — you have to lay out the account keys yourself, sorted writable-signers, read-only-signers, writable-non-signers, read-only-non-signers, with the vault as the fee payer at index 0:

```typescript
import { address } from "@solana/kit";
import { getVaultTransactionMessageEncoder } from "@solana-programs/squads";

const SYSTEM_PROGRAM_ADDRESS = address("11111111111111111111111111111111");

const transactionMessage = getVaultTransactionMessageEncoder().encode({
  numSigners: 1,
  numWritableSigners: 1,
  numWritableNonSigners: 1,
  accountKeys: [vault, destination, SYSTEM_PROGRAM_ADDRESS],
  instructions: [
    {
      programIdIndex: 2,
      accountIndexes: new Uint8Array([0, 1]),
      data: transferData,
    },
  ],
  addressTableLookups: [],
});
```

### Executing

`vaultTransactionExecute` needs every account the inner instructions touch, passed as **remaining accounts** in the same order as `accountKeys`, followed by any address lookup tables. The generated builder does not derive these for you:

```typescript
import { AccountRole } from "@solana/kit";
import { getVaultTransactionExecuteInstruction } from "@solana-programs/squads";

const ix = getVaultTransactionExecuteInstruction({ multisig, proposal, transaction, member: alice });

const executeIx = {
  ...ix,
  accounts: [
    ...ix.accounts,
    { address: vault, role: AccountRole.WRITABLE },
    { address: destination, role: AccountRole.WRITABLE },
    { address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY },
  ],
};
```

Signer flags on remaining accounts must be `false` even for the vault — the program signs on its behalf via the PDA.

### Reading accounts

```typescript
import { fetchMultisig, fetchProposal, fetchVaultTransaction } from "@solana-programs/squads";

const { data: multisigData } = await fetchMultisig(rpc, multisig);
console.log(multisigData.threshold, multisigData.members.length);

const { data: proposalData } = await fetchProposal(rpc, proposal);
console.log(proposalData.status.__kind, proposalData.approved.length);
```

## What's generated

- **Instructions** — all 36, including config transactions, vault transactions, batches, transaction buffers and spending limits
- **Accounts** — `Multisig`, `Proposal`, `VaultTransaction`, `ConfigTransaction`, `Batch`, `VaultBatchTransaction`, `SpendingLimit`, `TransactionBuffer`, `ProgramConfig`
- **PDAs** — `programConfig`, `multisig`, `vault`, `transaction`, `proposal`, `batchTransaction`, `ephemeralSigner`, `spendingLimit`
- **Types** — every type in the IDL, with codecs
- **Errors** — all 45 program errors, with `SquadsError` and `getSquadsErrorMessage`

## Development

This client is generated from the Squads IDL using the Coda CLI:

```bash
# Generate the client from idls/squads_multisig_program.json
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

`coda.config.ts` renames the program node to `squads` and adds the eight PDAs above. The seeds mirror `src/pda.ts` in `@sqds/multisig@2.1.4` byte for byte.

The `transactionBuffer` PDA is **not** included: the official SDK does not expose a derivation for it, so the seeds could not be verified against a reference implementation. Pass `transactionBuffer` explicitly when using the transaction buffer instructions.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
