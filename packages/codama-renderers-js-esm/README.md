# @macalinao/codama-renderers-js-esm

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-renderers-js-esm.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-js-esm)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-renderers-js-esm.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-js-esm)

ESM-native TypeScript renderer for [Codama](https://github.com/codama-idl/codama) JavaScript code generation. This package extends `@codama/renderers-js` to produce fully ESM-compatible TypeScript/JavaScript code.

## Used by Coda CLI

This renderer is the default TypeScript renderer used by the [Coda CLI](https://coda.ianm.com):

```bash
# Install Coda CLI - includes this ESM renderer by default
bun add -D @macalinao/coda

# Generate ESM-native TypeScript clients with zero config
coda generate
```

Coda provides the easiest way to generate type-safe Solana clients from your Anchor IDLs. Learn more at [coda.ianm.com](https://coda.ianm.com).

## Installation

```bash
bun add @macalinao/codama-renderers-js-esm
```

## Usage

Use this visitor in place of the standard Codama JavaScript renderer when you need ESM-compatible output:

```typescript
import { renderESMTypeScriptVisitor } from "@macalinao/codama-renderers-js-esm";
import { rootNode } from "codama";

// Your Codama root node (typically from parsing an IDL)
const root = rootNode(/* ... */);

// Generate ESM-compatible TypeScript code
const visitor = renderESMTypeScriptVisitor("./src/generated");
visit(root, visitor);
```

## How It Works

This package wraps `@codama/renderers-js`'s `getRenderMapVisitor` and applies a series of transformations to ensure ESM compatibility:

### 1. Custom Dependency Map

The package provides an ESM-specific dependency map that ensures all internal imports use `.js` extensions:

```typescript
{
  errors: "../errors/index.js",
  generatedAccounts: "../accounts/index.js",
  generatedInstructions: "../instructions/index.js",
  // ... etc
}
```

### 2. Import Path Transformations

- Adds `.js` extensions to all relative imports without extensions
- Converts bare directory imports to explicit `index.js` imports
- Maintains compatibility with TypeScript's module resolution

### 3. Code Improvements

- Replaces loose null checks (`value == null`) with strict checks (`value === null || value === undefined`)
- Fixes type assertions for better type safety
- Removes Node.js-specific environment checks for universal JavaScript compatibility

## Differences from @codama/renderers-js

| Feature | @codama/renderers-js | @macalinao/codama-renderers-js-esm |
|---------|----------------------|-------------------------------------|
| Module Format | CommonJS-compatible | Pure ESM |
| Import Extensions | No extensions | `.js` extensions |
| TypeScript Config | Standard | ESM-native |
| Runtime Checks | Node.js-specific | Universal |
| Null Checks | Loose (`==`) | Strict (`===`) |

## Example Output

### Before (Standard Renderer)
```typescript
import { Address } from "@solana/web3.js";
import { SomeType } from "./types";
export * from "./accounts";
```

### After (ESM Renderer)
```typescript
import { Address } from "@solana/web3.js";
import { SomeType } from "./types/index.js";
export * from "./accounts/index.js";
```

## Requirements

- Node.js 18+ or Bun
- TypeScript 5.0+ (for generated code)
- Package.json with `"type": "module"`

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
