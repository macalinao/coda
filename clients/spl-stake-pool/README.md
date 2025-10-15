# @macalinao/clients-spl-stake-pool

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-spl-stake-pool.svg)](https://www.npmjs.com/package/@macalinao/clients-spl-stake-pool)

TypeScript client for the SPL Stake Pool program, generated using Coda with full ESM support.

## Installation

```bash
bun add @macalinao/clients-spl-stake-pool
```

## Development

This client is generated from the SPL Stake Pool IDL using Coda CLI:

```bash
# Generate the client from idls/spl_stake_pool.json
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file defines custom PDAs for the SPL Stake Pool program, including:

- Withdraw authority for the stake pool
- Stake accounts for validators
- Stake accounts with custom seeds
- Transient stake accounts for delegation operations
- Ephemeral stake accounts for temporary operations

## Usage

```typescript
import { 
  findWithdrawAuthorityPda,
  findStakePda 
} from "@macalinao/clients-spl-stake-pool";

// Get withdraw authority PDA
const withdrawAuthorityPda = await findWithdrawAuthorityPda({ 
  stakePool: stakePoolPublicKey 
});

// Get stake account PDA
const stakePda = await findStakePda({
  voteAccount: validatorVoteAccount,
  stakePool: stakePoolPublicKey
});

// Use the generated client functions
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
