# @macalinao/clients-kamino-lending

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-kamino-lending.svg)](https://www.npmjs.com/package/@macalinao/clients-kamino-lending)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/clients-kamino-lending.svg)](https://www.npmjs.com/package/@macalinao/clients-kamino-lending)

TypeScript client for the Kamino Lending program on Solana.

## Installation

```bash
bun add @macalinao/clients-kamino-lending
```

Or with npm:
```bash
npm install @macalinao/clients-kamino-lending
```

## Program Information

- **Program ID**: `KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD`
- **Network**: Mainnet-beta

## Usage

```typescript
import { 
  createInitializeInstruction,
  fetchLendingMarket,
  // ... other exports
} from "@macalinao/clients-kamino-lending";
import { createSolanaRpc } from "@solana/web3.js";

// Connect to Solana
const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

// Fetch account data
const lendingMarket = await fetchLendingMarket(rpc, marketAddress);

// Create instructions
const instruction = createInitializeInstruction({
  // ... instruction parameters
});
```

## Generated Code

This client is automatically generated from the Kamino Lending IDL using [Coda](https://coda.ianm.com). The generated code includes:

- **Instructions**: Builders for all program instructions
- **Accounts**: Decoders and fetchers for all account types
- **Types**: TypeScript types for all program structures
- **Errors**: Typed error codes and messages
- **PDAs**: Helper functions for program-derived addresses

## Development

### Regenerate Client

To regenerate the client code after IDL updates:

```bash
bun run codegen
```

### Build

```bash
bun run build
```

### Clean

```bash
bun run clean
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0