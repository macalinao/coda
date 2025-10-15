# @macalinao/clients-quarry

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-quarry.svg)](https://www.npmjs.com/package/@macalinao/clients-quarry)

TypeScript client for the Quarry protocol programs, generated using Coda CLI with full ESM support.

## Installation

```bash
bun add @macalinao/clients-quarry
```

## Programs Included

This client includes all Quarry protocol programs:

- **Quarry Mine** - Core mining/staking program
- **Quarry Mint Wrapper** - Mint wrapper for rewards
- **Quarry Operator** - Operator delegation system
- **Quarry Merge Mine** - Merge mining functionality
- **Quarry Redeemer** - Token redemption mechanism
- **Quarry Registry** - Registry for quarries

## Development

This client is generated from multiple Quarry IDLs using Coda CLI:

```bash
# Generate the client from all IDLs in idls/
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file is configured to load all Quarry protocol IDLs and generate a unified client.

## Usage

```typescript
import {
  getCreateMinerInstruction,
  fetchMiner,
} from "@macalinao/clients-quarry";

// Fetch miner account
const miner = await fetchMiner(rpc, minerAddress);

// Create miner instruction
const instruction = getCreateMinerInstruction({
  // ... instruction parameters
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
