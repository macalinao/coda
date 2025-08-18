# @macalinao/codama-rename-visitor

A Codama visitor for renaming instructions and events within a Solana program.

## Installation

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

MIT