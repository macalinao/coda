# @solana-programs/kamino-lending

[![npm version](https://img.shields.io/npm/v/@solana-programs/kamino-lending.svg)](https://www.npmjs.com/package/@solana-programs/kamino-lending)
[![npm downloads](https://img.shields.io/npm/dm/@solana-programs/kamino-lending.svg)](https://www.npmjs.com/package/@solana-programs/kamino-lending)

Low-level TypeScript client for the Kamino Lending and Farms programs on Solana.

## Installation

```bash
bun add @solana-programs/kamino-lending
```

Or with npm:

```bash
npm install @solana-programs/kamino-lending
```

## Program Information

- **Program ID**: `KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD`
- **Network**: Mainnet-beta

## Usage

```typescript
import {
  getInitLendingMarketInstruction,
  fetchLendingMarket,
  // ... other exports
} from "@solana-programs/kamino-lending";
import { createSolanaRpc } from "@solana/web3.js";

// Connect to Solana
const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

// Fetch account data
const lendingMarket = await fetchLendingMarket(rpc, marketAddress);

// Create instructions
const instruction = getInitLendingMarketInstruction({
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
