# @macalinao/codama-nodes-from-anchor-x

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-nodes-from-anchor-x.svg)](https://www.npmjs.com/package/@macalinao/codama-nodes-from-anchor-x)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-nodes-from-anchor-x.svg)](https://www.npmjs.com/package/@macalinao/codama-nodes-from-anchor-x)

An enhanced version of `@codama/nodes-from-anchor` with additional features for improved Anchor IDL parsing and transformation. This is the default parser used by the [Coda CLI](https://github.com/macalinao/coda) for generating TypeScript clients from Solana programs.

## Features

This package extends `@codama/nodes-from-anchor` with:

- **Multi-IDL Support**: Parse and combine multiple Anchor IDLs into a single Codama root node
- **Automatic Account Flattening**: Intelligently flattens nested account structures from Anchor IDLs for v0.1.0 format
- **Program-Level Visitors**: Apply transformations at the program level for better composability
- **Enhanced IDL Support**: Seamless handling of both v0.0.0 and v0.1.0 Anchor IDL formats

## Quick Start with Coda CLI

This package is used internally by the [Coda CLI](https://coda.ianm.com) for multi-program support:

```bash
# Install Coda CLI
bun add -D @macalinao/coda

# Generate clients from multiple IDLs
coda generate --idl "./idls/*.json"
```

Learn more at [coda.ianm.com](https://coda.ianm.com).

## Installation

```bash
bun add @macalinao/codama-nodes-from-anchor-x
```

Or with npm:
```bash
npm install @macalinao/codama-nodes-from-anchor-x
```

## Usage

### Single IDL

```typescript
import { rootNodeFromAnchor } from "@macalinao/codama-nodes-from-anchor-x";
import { createFromRoot, visit } from "codama";

// Load your IDL
const idl = JSON.parse(fs.readFileSync("./idl.json", "utf-8"));

// Create a root node from single IDL
const root = rootNodeFromAnchor(idl);

// Create Codama instance and apply visitors
const codama = createFromRoot(root);
codama.accept(myVisitor);
```

### Multiple IDLs

```typescript
import { rootNodeFromAnchorIdls } from "@macalinao/codama-nodes-from-anchor-x";
import { createFromRoot, visit } from "codama";

// Load your IDLs
const idls = [
  JSON.parse(fs.readFileSync("./idls/program1.json", "utf-8")),
  JSON.parse(fs.readFileSync("./idls/program2.json", "utf-8")),
  JSON.parse(fs.readFileSync("./idls/program3.json", "utf-8")),
];

// Create a root node containing all programs
const root = rootNodeFromAnchorIdls(idls);

// Create Codama instance
const codama = createFromRoot(root);

// Apply visitors
codama.accept(myVisitor);
```

### Program Node

```typescript
import { programNodeFromAnchor } from "@macalinao/codama-nodes-from-anchor-x";

// Get just the program node (without root wrapper)
const program = programNodeFromAnchor(idl);
```

## API

### rootNodeFromAnchor

Creates a Codama root node from a single Anchor IDL.

```typescript
function rootNodeFromAnchor(idl: AnchorIdl): RootNode;
```

**Parameters:**
- `idl`: An Anchor IDL object

**Returns:**
- A Codama root node containing the program from the IDL

### rootNodeFromAnchorIdls

Creates a Codama root node from multiple Anchor IDLs.

```typescript
function rootNodeFromAnchorIdls(idls: AnchorIdl[]): RootNode;
```

**Parameters:**
- `idls`: An array of Anchor IDL objects

**Returns:**
- A Codama root node containing all programs from the IDLs

**Throws:**
- Error if no IDL files are provided
- Error if no program nodes could be created

### programNodeFromAnchor

Creates a Codama program node from a single Anchor IDL.

```typescript
function programNodeFromAnchor(idl: AnchorIdl): ProgramNode;
```

**Parameters:**
- `idl`: An Anchor IDL object

**Returns:**
- A Codama program node (without root wrapper)

## Key Improvements over @codama/nodes-from-anchor

### Automatic Account Flattening

Anchor IDL v0.1.0 often has nested account structures that need to be flattened for proper code generation. This package automatically handles this:

```javascript
// Anchor IDL with nested accounts:
{
  "name": "mint_accounts",
  "accounts": [
    { "name": "mint", "writable": true },
    { "name": "metadata", "writable": true }
  ]
}

// Automatically flattened to:
[
  { "name": "mintAccountsMint", "writable": true },
  { "name": "mintAccountsMetadata", "writable": true }
]
```

### Version Detection

The package automatically detects the IDL version (v0.0.0 or v0.1.0) and applies the appropriate parsing logic, including the account flattening visitor for v0.1.0 IDLs.

## Use Cases

### Multiple Related Programs

When working with a protocol that consists of multiple programs:

```typescript
const idls = [
  mainProgramIdl,
  stakingProgramIdl,
  rewardsProgramIdl,
];

const root = rootNodeFromAnchorIdls(idls);
// All three programs are now in the AST
```

### Program Versioning

Load different versions of the same program:

```typescript
const idls = [
  currentVersionIdl,
  legacyVersionIdl,
];

const root = rootNodeFromAnchorIdls(idls);
// Both versions available for migration tools
```

## Integration with Coda

This package is the default parser for [Coda](https://github.com/macalinao/coda), providing the foundation for generating modern, type-safe TypeScript clients for Solana programs. When you use `coda generate`, it uses this package under the hood to parse your Anchor IDLs.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0