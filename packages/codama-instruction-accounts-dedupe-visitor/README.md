# @macalinao/codama-instruction-accounts-dedupe-visitor

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-instruction-accounts-dedupe-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-instruction-accounts-dedupe-visitor)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-instruction-accounts-dedupe-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-instruction-accounts-dedupe-visitor)

Codama visitor for deduplicating and flattening instruction accounts from Anchor IDL. This package helps handle nested account structures in Anchor programs by flattening them into a single-level structure with properly prefixed names.

## Quick Start with Coda CLI

This visitor is best used through the [Coda CLI](https://coda.ianm.com), which provides a complete solution for Solana client generation:

```bash
# Install Coda CLI
bun add -D @macalinao/coda

# Initialize configuration
coda init

# Add this visitor to your coda.config.mjs
```

Learn more about Coda's zero-config approach and powerful visitor system at [coda.ianm.com](https://coda.ianm.com).

## Installation

```bash
bun add @macalinao/codama-instruction-accounts-dedupe-visitor
```

## Usage

```typescript
import { instructionAccountsDedupeVisitor } from "@macalinao/codama-instruction-accounts-dedupe-visitor";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { visit } from "codama";

// Your Anchor IDL
const idl = /* your anchor IDL */;

// Create the root node from Anchor IDL
const root = rootNodeFromAnchor(idl);

// Apply the dedupe visitor
const visitor = instructionAccountsDedupeVisitor(idl);
const deduplicatedRoot = visit(root, visitor);
```

## How It Works

The visitor transforms nested account structures by:

1. **Traversing Account Groups**: Recursively processes nested account groups
2. **Prefixing Names**: Joins parent and child names with underscores
3. **Adjusting PDA Seeds**: Updates seed paths to match the flattened structure
4. **Preserving All Metadata**: Maintains all account properties and constraints

### Example Transformation

**Before (Nested Structure)**:

```typescript
{
  name: "mintAccounts",
  accounts: [
    { name: "mint", ... },
    { name: "metadata", ... }
  ]
}
```

**After (Flattened Structure)**:

```typescript
[
  { name: "mintAccounts_mint", ... },
  { name: "mintAccounts_metadata", ... }
]
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
