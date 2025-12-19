# @macalinao/clients-spl-governance

[![npm version](https://img.shields.io/npm/v/@macalinao/clients-spl-governance.svg)](https://www.npmjs.com/package/@macalinao/clients-spl-governance)

TypeScript client for the SPL Governance program, generated using Coda with full ESM support.

IDL changes:

- `RealmConfigArgs` is renamed to `RealmConfigParams`
- `GoverningTokenConfigArgs` is renamed to `GoverningTokenConfigParams`

## Installation

```bash
bun add @macalinao/clients-spl-governance
```

## Development

This client is generated from the SPL Governance IDL using Coda CLI:

```bash
# Generate the client from idls/spl_governance.json
bun run codegen

# Build the TypeScript
bun run build
```

### Configuration

The `coda.config.mjs` file defines custom PDAs for the SPL Governance program, including:

- Realm identified by its name
- Token holding accounts for community and council tokens
- Governance accounts and proposals
- Vote records and signatory records
- Treasury accounts and transaction instructions

## Usage

```typescript
import {
  getCreateRealmInstruction,
  findRealmPda,
} from "@macalinao/clients-spl-governance";

// Create a new realm
const realmPda = await findRealmPda({ name: "my-dao" });

// Use the generated client functions
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
