# @macalinao/clients-orca-whirlpools

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-orca-whirlpools.svg)](https://www.npmjs.com/package/@macalinao/clients-orca-whirlpools)

TypeScript client for the Orca Whirlpools program, generated using Coda CLI with full ESM support.

## Installation

```bash
bun add @macalinao/clients-orca-whirlpools
```

## About Orca Whirlpools

Orca Whirlpools is a concentrated liquidity AMM (CLMM) protocol on Solana that enables efficient token swaps with capital-efficient liquidity provision. The protocol allows liquidity providers to concentrate their capital within custom price ranges.

## Development

This client is generated from the Orca Whirlpools IDL using Coda CLI:

```bash
# Generate the client from idls/
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file can be customized to add PDAs and other Codama visitors for enhanced client functionality.

## Usage

```typescript
import {} from /* generated exports */ "@macalinao/clients-orca-whirlpools";

// Use the generated client functions
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
