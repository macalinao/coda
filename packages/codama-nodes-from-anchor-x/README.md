# @macalinao/codama-nodes-from-anchor-x

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-nodes-from-anchor-x.svg)](https://www.npmjs.com/package/@macalinao/codama-nodes-from-anchor-x)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-nodes-from-anchor-x.svg)](https://www.npmjs.com/package/@macalinao/codama-nodes-from-anchor-x)

Create Codama root nodes from Anchor IDLs - supports both single and multiple IDL scenarios.

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

## Features

- Two functions for different use cases:
  - `rootNodeFromAnchor` - Single IDL conversion
  - `rootNodeFromAnchorIdls` - Multiple IDL conversion
- Supports both Anchor IDL v0.0.0 and v0.1.0 formats
- Automatically detects IDL version and uses appropriate parser
- First IDL becomes the main program, others are additional programs
- Converts snake_case names to camelCase for JavaScript/TypeScript

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

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0