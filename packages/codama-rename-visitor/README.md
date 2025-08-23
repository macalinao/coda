# @macalinao/codama-rename-visitor

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-rename-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-rename-visitor)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-rename-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-rename-visitor)

A Codama visitor for renaming instructions and events within a Solana program.

## Quick Start with Coda CLI

This visitor works seamlessly with the [Coda CLI](https://coda.ianm.com) for automated client generation:

```bash
# Install Coda CLI
bun add -D @macalinao/coda

# Initialize configuration 
coda init

# Add this visitor to your coda.config.mjs
```

Coda provides zero-config client generation with powerful customization through visitors like this one. Learn more at [coda.ianm.com](https://coda.ianm.com).

## Installation

For direct usage:

```bash
npm install @macalinao/codama-rename-visitor
```

## Usage

This visitor allows you to rename instructions and events in your Codama IDL. It's particularly useful when you want to change the naming conventions of your program without modifying the original IDL.

### Renaming Instructions

```typescript
import { renameInstructionsVisitor } from "@macalinao/codama-rename-visitor";
import { visit } from "codama";

// Rename specific instructions
const visitor = renameInstructionsVisitor({
  oldInstructionName: "newInstructionName",
  transfer: "transferTokens",
  mint: "mintNft"
});

const updatedRoot = visit(root, visitor);
```

### Renaming Events

```typescript
import { renameEventsVisitor } from "@macalinao/codama-rename-visitor";
import { visit } from "codama";

// Rename specific events (as defined types)
const visitor = renameEventsVisitor({
  oldEventName: "newEventName",
  tokenMinted: "nftMinted",
  transferComplete: "transferFinished"
});

const updatedRoot = visit(root, visitor);
```

### Program-Specific Renaming (Recommended)

The `renameVisitor` follows the same pattern as Codama's `addPdasVisitor`, where you specify renames for specific programs:

```typescript
import { renameVisitor } from "@macalinao/codama-rename-visitor";
import { visit } from "codama";

// Rename elements in specific programs
const visitor = renameVisitor({
  quarryMine: {
    instructions: {
      claimRewards: "claimRewardsMine"
    }
  },
  token: {
    instructions: {
      transfer: "transferTokens",
      mint: "mintNft"
    },
    events: {
      tokenMinted: "nftMinted"
    }
  }
});

const updatedRoot = visit(root, visitor);
```

### Legacy Single-Program Renaming

For backward compatibility, you can still use the legacy format for single-program renaming:

```typescript
import { renameVisitor } from "@macalinao/codama-rename-visitor";
import { visit } from "codama";

// Legacy format: rename in the current program
const visitor = renameVisitor({
  instructions: {
    transfer: "transferTokens",
    mint: "mintNft"
  },
  events: {
    tokenMinted: "nftMinted",
    transferComplete: "transferFinished"
  }
});

const updatedRoot = visit(root, visitor);
```

## API

### `renameVisitor(renamesByProgram: Record<string, ProgramRenameOptions>)`

Creates a visitor that renames instructions, events, and defined types in specific programs. This is the recommended API.

- `renamesByProgram`: Object mapping program names to their rename configurations
  - Each program can specify:
    - `instructions`: Mapping of old instruction names to new names
    - `events`: Mapping of old event names to new names  
    - `definedTypes`: Mapping of old defined type names to new names

### `renameInstructionsVisitor(mapping: Record<string, string>)`

Creates a visitor that renames instructions based on the provided mapping. Applies to all programs.

### `renameEventsVisitor(mapping: Record<string, string>)`

Creates a visitor that renames events (defined types) based on the provided mapping. Applies to all programs.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
