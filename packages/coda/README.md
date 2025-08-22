# Coda

Automated client generation for Solana programs.

## Why Coda?

Building on Solana requires interacting with on-chain programs through their IDLs (Interface Definition Language). Traditionally, developers need to:

1. **Manually write client code** for each program they interact with
2. **Keep clients in sync** when programs update
3. **Handle serialization/deserialization** of complex data structures
4. **Maintain type safety** across their application

This leads to:
- **Boilerplate code** that's error-prone and time-consuming to write
- **Version mismatches** between your client and the on-chain program
- **Type errors** that only surface at runtime
- **Inconsistent implementations** across different projects

**Coda solves these problems** by automatically generating type-safe, production-ready clients from your program's IDL. Built on top of [Codama](https://github.com/codama-idl/codama), Coda provides a zero-config CLI that transforms Anchor IDLs into modern TypeScript clients with full type safety and ES modules support.

## Features

- 🚀 **Zero configuration** - Works out of the box with sensible defaults
- 🔧 **Fully customizable** - Extend and transform generated code with visitors
- 📦 **ES modules native** - Modern JavaScript with proper `.js` extensions
- 🎯 **Type-safe** - Full TypeScript support with precise types
- 🔄 **Anchor compatible** - Works with any Anchor IDL
- 🏗️ **Extensible** - Add custom visitors to transform the Codama tree
- ⚡ **Fast** - Optimized code generation pipeline

## Installation

```bash
bun add -D @macalinao/coda
```

Or with npm:
```bash
npm install -D @macalinao/coda
```

## Quick Start

### 1. Generate a client from your Anchor IDL

```bash
# Using default paths
bunx coda generate

# With custom paths
bunx coda generate --idl ./target/idl/my_program.json --output ./src/generated
```

By default, Coda looks for:
- IDL at `./target/idl/program.json`
- Outputs to `./src/generated`

### 2. Use the generated client

```typescript
import { createTransferInstruction } from "./generated";
import { Address, pipe } from "@solana/web3.js";

// Create an instruction with full type safety
const instruction = createTransferInstruction({
  source: sourceAddress,
  destination: destAddress,
  authority: authorityAddress,
  amount: 1000n,
});

// Use with your Solana client
const transaction = pipe(
  createTransaction({ version: "legacy" }),
  tx => addInstruction(instruction, tx),
  tx => setTransactionFeePayer(payerAddress, tx)
);
```

## Configuration

Create a `coda.config.mjs` file to customize code generation:

```bash
bunx coda init
```

This creates a configuration file where you can:
- Set custom IDL and output paths
- Add Codama visitors to transform generated code
- Configure program-specific settings

### Example configuration

```javascript
// coda.config.mjs
import { defineConfig } from "@macalinao/coda";
import { addPdasVisitor } from "codama";

export default defineConfig({
  // Custom paths (optional)
  idlPath: "./idls/my_program.json",
  outputDir: "./src/clients/my_program",
  
  // Add visitors to customize generation
  visitors: [
    // Add custom PDAs
    addPdasVisitor({
      myAccount: [
        {
          name: "authority",
          seeds: [
            { kind: "constant", value: "authority" },
            { kind: "variable", name: "user", type: publicKeyTypeNode() }
          ]
        }
      ]
    })
  ]
});
```

### Dynamic configuration

You can also use a function to access the IDL and conditionally apply visitors:

```javascript
export default defineConfig({
  visitors: ({ idl }) => {
    const visitors = [];
    
    // Conditionally add visitors based on IDL content
    if (idl.name === "my_program") {
      visitors.push(myCustomVisitor());
    }
    
    return visitors;
  }
});
```

## What Gets Generated

Coda generates a complete TypeScript client with:

### Instructions
```typescript
// Fully typed instruction builders
export function createTransferInstruction(
  input: TransferInstructionInput
): Instruction;

// With proper discriminators and serialization
export function getTransferInstructionDataEncoder(): Encoder<TransferArgs>;
```

### Accounts
```typescript
// Account decoders with type safety
export function decodeTokenAccount(
  encodedAccount: EncodedAccount
): TokenAccount;

// Fetch and decode in one step
export async function fetchTokenAccount(
  rpc: Rpc,
  address: Address
): Promise<TokenAccount>;
```

### Types
```typescript
// All types from your IDL
export type TokenAccount = {
  mint: Address;
  owner: Address;
  amount: bigint;
  // ... other fields
};
```

### PDAs
```typescript
// PDA helpers with proper seed derivation
export async function findAuthorityPda(
  seeds: {
    user: Address;
  }
): Promise<[Address, number]>;
```

### Errors
```typescript
// Typed error codes
export enum MyProgramError {
  InvalidAmount = 0x1770,
  Unauthorized = 0x1771,
  // ...
}
```

## CLI Commands

### `coda generate`

Generate TypeScript clients from an Anchor IDL.

```bash
bunx coda generate [options]

Options:
  -i, --idl <path>      Path to Anchor IDL file (default: "./target/idl/program.json")
  -o, --output <path>   Output directory (default: "./src/generated")
  -c, --config <path>   Path to config file (default: "./coda.config.mjs")
```

### `coda init`

Initialize a new configuration file.

```bash
bunx coda init [options]

Options:
  -c, --config <path>   Path for config file (default: "./coda.config.mjs")
```

## Integration with Build Tools

### Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "codegen": "coda generate",
    "codegen:watch": "coda generate --watch"
  }
}
```

### Turbo Integration

For monorepos using Turborepo:

```json
// turbo.json
{
  "tasks": {
    "codegen": {
      "outputs": ["./src/generated/**"],
      "cache": false
    }
  }
}
```

## Advanced Usage

### Custom Visitors

Extend and transform the generated code using Codama visitors:

```javascript
// coda.config.mjs
import { defineConfig } from "@macalinao/coda";
import { updateInstructionsVisitor } from "codama";

const customVisitor = updateInstructionsVisitor({
  // Customize specific instructions
  transfer: {
    // Add custom defaults
    defaults: {
      amount: 0n
    }
  }
});

export default defineConfig({
  visitors: [customVisitor]
});
```

### Multiple Programs

Generate clients for multiple programs:

```bash
# Main program
bunx coda generate --idl ./idls/main.json --output ./src/clients/main

# Auxiliary program  
bunx coda generate --idl ./idls/aux.json --output ./src/clients/aux
```

Or with separate configs:

```javascript
// coda.main.mjs
export default defineConfig({
  idlPath: "./idls/main.json",
  outputDir: "./src/clients/main"
});

// coda.aux.mjs
export default defineConfig({
  idlPath: "./idls/aux.json",
  outputDir: "./src/clients/aux"
});
```

```bash
bunx coda generate --config ./coda.main.mjs
bunx coda generate --config ./coda.aux.mjs
```

## Working with Generated Clients

### With @solana/web3.js v2

```typescript
import { createSolanaRpc } from "@solana/web3.js";
import { 
  fetchTokenAccount,
  createTransferInstruction 
} from "./generated";

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

// Fetch and decode accounts
const account = await fetchTokenAccount(rpc, accountAddress);
console.log(`Balance: ${account.amount}`);

// Build instructions
const ix = createTransferInstruction({
  source: account.address,
  destination: destAddress,
  authority: wallet.address,
  amount: 100n
});
```

### With Transaction Builders

```typescript
import { pipe } from "@solana/web3.js";
import { 
  createInitializeInstruction,
  createTransferInstruction 
} from "./generated";

const transaction = pipe(
  createTransaction({ version: "legacy" }),
  tx => addInstruction(createInitializeInstruction({...}), tx),
  tx => addInstruction(createTransferInstruction({...}), tx),
  tx => setTransactionFeePayer(wallet.address, tx)
);

const signature = await sendAndConfirmTransaction(client, transaction);
```

## Philosophy

Coda follows these principles:

1. **Zero-config by default** - Should work immediately after installation
2. **Progressive customization** - Simple things simple, complex things possible
3. **Type safety first** - Catch errors at compile time, not runtime
4. **Modern JavaScript** - ES modules, async/await, bigint support
5. **Codama-powered** - Leverage the full Codama ecosystem

## Comparison with Alternatives

### vs Anchor TypeScript Client

- ✅ **ES modules native** - No build step required
- ✅ **Customizable** - Transform generated code with visitors
- ✅ **Lighter weight** - Only generates what you need
- ✅ **Better tree-shaking** - Modular exports

### vs Manual Implementation

- ✅ **Always in sync** - Regenerate when IDL changes
- ✅ **Type-safe** - No runtime type errors
- ✅ **Consistent** - Same patterns across all programs
- ✅ **Time-saving** - No boilerplate to write

## Troubleshooting

### IDL Not Found

Ensure your Anchor program is built:
```bash
anchor build
```

Or specify the path explicitly:
```bash
bunx coda generate --idl ./path/to/idl.json
```

### Config Not Loading

1. Check file is named `coda.config.mjs` (note the `.mjs`)
2. Ensure it has a default export
3. Try specifying explicitly: `--config ./coda.config.mjs`

### Types Not Resolving

Make sure TypeScript can find the generated files:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/generated/*": ["./src/generated/*"]
    }
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
