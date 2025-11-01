# @macalinao/clients-tribeca

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-tribeca.svg)](https://www.npmjs.com/package/@macalinao/clients-tribeca)

TypeScript client for Tribeca governance programs (Govern and Locked Voter), generated using Coda CLI with full ESM support.

## Installation

```bash
bun add @macalinao/clients-tribeca
```

## About Tribeca

Tribeca is a governance protocol on Solana that provides decentralized autonomous organization (DAO) functionality through two main programs:

- **Govern**: Core governance program for creating governors, proposals, and voting
- **Locked Voter**: Vote escrow system for token-weighted governance with time-locked voting power

## Programs Included

### Govern Program
- **Governor**: Manages proposals and voting parameters
- **Proposal**: Individual governance proposals with metadata
- **Vote**: Records individual voter decisions on proposals
- **ProposalMeta**: Additional metadata for proposals

### Locked Voter Program
- **Locker**: Manages vote escrows for a governance token
- **Escrow**: Individual user's locked tokens and voting power
- **Whitelist**: Programs authorized to interact with the locker

## Development

This client is generated from the Tribeca IDLs using Coda CLI:

```bash
# Generate the client from idls/
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file includes custom PDAs for both programs and links accounts to their corresponding PDA helpers.

## Usage

```typescript
import {
  getCastVoteInstruction,
  fetchGovernor,
  fetchProposal,
  getCreateEscrowInstruction,
  fetchLocker,
} from "@macalinao/clients-tribeca";

// Governance example
const governor = await fetchGovernor(rpc, governorAddress);
const proposal = await fetchProposal(rpc, proposalAddress);

const voteInstruction = getCastVoteInstruction({
  governor: governorAddress,
  proposal: proposalAddress,
  vote: voteAddress, // PDA automatically calculated
  voter: voterPublicKey,
  // ... other parameters
});

// Locked voter example
const locker = await fetchLocker(rpc, lockerAddress);

const escrowInstruction = getCreateEscrowInstruction({
  locker: lockerAddress,
  escrow: escrowAddress, // PDA automatically calculated
  authority: authorityPublicKey,
  // ... other parameters
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
