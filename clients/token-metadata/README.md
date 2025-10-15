# @macalinao/clients-token-metadata

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-token-metadata.svg)](https://www.npmjs.com/package/@macalinao/clients-token-metadata)

TypeScript client for the Metaplex Token Metadata program, generated using Codama with full ESM support.

## Installation

```bash
bun add @macalinao/clients-token-metadata
```

## Development

This client is generated from the Token Metadata IDL using Coda CLI:

```bash
# Generate the client from idls/token_metadata.json
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file adds custom PDAs to the generated client, including the standard metadata PDA derivation.

## Usage

```typescript
import {
  getCreateMetadataAccountInstruction,
  fetchMetadata,
} from "@macalinao/clients-token-metadata";

// Fetch metadata account
const metadata = await fetchMetadata(rpc, metadataAddress);

// Create metadata account instruction
const instruction = getCreateMetadataAccountInstruction({
  // ... instruction parameters
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
