# @macalinao/clients-voter-stake-registry

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-voter-stake-registry.svg)](https://www.npmjs.com/package/@macalinao/clients-voter-stake-registry)

TypeScript client for the Realms [Voter Stake Registry program](https://github.com/Grape-Labs/voter-stake-registry/) by Grape, generated using Coda with full ESM support.

## Installation

```bash
bun add @macalinao/clients-voter-stake-registry
```

## Development

This client is generated from the Voter Stake Registry IDL using Coda CLI:

```bash
# Generate the client from idls/voter_stake_registry.json
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file defines custom PDAs for the Voter Stake Registry program, including:

- **Registrar**: The voting registrar account - one per governance realm and governing mint
- **Voter**: Individual voter accounts tied to a registrar and voter authority
- **Voter Weight Record**: The account shown to spl-governance to prove vote weight

## Usage

```typescript
import {
  findRegistrarPda,
  findVoterPda,
  findVoterWeightRecordPda,
} from "@macalinao/clients-voter-stake-registry";

// Get the registrar PDA
const registrarPda = await findRegistrarPda({
  realm: realmPublicKey,
  realmGoverningTokenMint: mintPublicKey,
});

// Get a voter PDA
const voterPda = await findVoterPda({
  registrar: registrarPublicKey,
  voterAuthority: authorityPublicKey,
});

// Get a voter weight record PDA
const voterWeightRecordPda = await findVoterWeightRecordPda({
  registrar: registrarPublicKey,
  voterAuthority: authorityPublicKey,
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
