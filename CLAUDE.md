# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coda is an automated client generation tool for Solana programs. Built on top of [Codama](https://github.com/codama-idl/codama), Coda provides a zero-config CLI that transforms Anchor IDLs into modern TypeScript clients with full type safety and ES modules support.

The monorepo contains:
- **Coda CLI** - The main tool for generating TypeScript clients from Anchor IDLs
- **Codama utilities** - Custom visitors and renderers for enhanced code generation
- **Generated clients** - Pre-built clients for popular Solana programs

## Technology Stack

- **Package Manager**: Bun (v1.2.20)
- **Build System**: Turbo for monorepo orchestration
- **Language**: TypeScript with ES modules
- **Code Generation**: Codama for AST transformations
- **Code Quality**: Biome for formatting, ESLint for linting
- **Testing**: Bun test runner

## Essential Commands

```bash
# Development
bun install                  # Install all dependencies
bun run build                # Build all packages
bun run build:watch          # Watch mode for all packages
bun run build:watch:packages # Watch mode for packages only

# Code Generation
bun run codegen             # Run code generation for all clients
bunx coda generate          # Generate client with Coda CLI
bunx coda init             # Initialize coda.config.mjs

# Code Quality
bun run lint                 # Run biome check + eslint
bun run lint:fix            # Fix linting issues
biome check --write         # Format with biome

# Testing
bun run test                # Run all tests
bun test                    # Run tests directly

# Package Publishing
bun run changeset           # Create changeset for version bumps
bun run ci:publish          # Publish packages to npm

# IMPORTANT: After making code changes
bun run build                # Build to check for TypeScript errors
bun run lint:fix            # Fix linting and formatting issues
```

## Repository Structure

```
coda/
├── packages/                # Core packages
│   ├── coda/               # Main CLI tool (@macalinao/coda)
│   ├── codama-instruction-accounts-dedupe-visitor/  # Flattens nested accounts
│   └── codama-renderers-js-esm/                    # ESM-native renderer
├── clients/                # Generated client libraries
│   └── token-metadata/     # Metaplex Token Metadata client
├── docs/                   # Documentation
└── scripts/               # Build and CI scripts
```

## Core Packages

### 1. **@macalinao/coda** - CLI for client generation
   - Zero-config by default (looks for `./target/idl/program.json`)
   - Configurable via `coda.config.mjs`
   - Generates TypeScript clients with full type safety
   - Built on Codama for extensibility

### 2. **@macalinao/codama-instruction-accounts-dedupe-visitor**
   - Flattens nested account structures from Anchor IDL
   - Preserves relationships through naming conventions
   - Updates PDA seeds when accounts are flattened

### 3. **@macalinao/codama-renderers-js-esm**
   - ESM-native TypeScript renderer for Codama
   - Adds `.js` extensions to all imports
   - Removes Node.js-specific environment checks
   - Ensures compatibility with `"type": "module"`

### 4. **@macalinao/clients-token-metadata**
   - Pre-generated client for Metaplex Token Metadata program
   - Includes custom PDAs and type definitions
   - Ready-to-use with `@solana/web3.js`

## How Coda Works

1. **Parse IDL**: Reads Anchor IDL file (JSON format)
2. **Create AST**: Converts to Codama's node structure
3. **Apply Visitors**: Transforms the AST (custom PDAs, flattening, etc.)
4. **Generate Code**: Renders TypeScript with ESM support
5. **Output Files**: Creates organized file structure with types, instructions, accounts, etc.

## Configuration (coda.config.mjs)

```javascript
import { defineConfig } from "@macalinao/coda";
import { addPdasVisitor } from "codama";

export default defineConfig({
  // Optional: Custom paths
  idlPath: "./idls/my_program.json",
  outputDir: "./src/generated",
  
  // Optional: Codama visitors for customization
  visitors: [
    addPdasVisitor({
      // Add custom PDAs
    })
  ]
});
```

## Code Style Guidelines

### TypeScript
- Use specific types, avoid `any`
- Prefer interfaces over type aliases for objects
- Use `import type` for type-only imports (enforced by Biome)
- Arrays use shorthand syntax: `string[]` not `Array<string>`
- **Use double quotes for strings** (not single quotes)
- ES modules with `.js` extensions for imports

### After Making Code Changes
**Always run these commands to ensure code quality:**
1. `bun run build` - Check for TypeScript errors
2. `bun run lint:fix` - Fix linting and formatting issues

### Biome/ESLint Configuration
- No floating promises (must be handled)
- Use const assertions where applicable
- No non-null assertions are allowed
- Simplified logic expressions required
- No double equals (use === instead)
- Imports are auto-organized on save

## Turborepo Configuration

Tasks are defined in turbo.json:
- `build`: Depends on upstream builds, outputs to `./dist/**`
- `lint`: Depends on upstream builds
- `test`: Depends on build, no caching
- `codegen`: Outputs to `./src/generated/**`, no caching
- Tasks run in topological order respecting dependencies

## Adding a New Client

1. **Add IDL file**: Place in `clients/[program-name]/idls/`
2. **Create config**: Add `coda.config.mjs` with any custom visitors
3. **Add package.json**: Include build and codegen scripts
4. **Generate client**: Run `bun run codegen`
5. **Build**: Run `bun run build`

Example package.json for a client:
```json
{
  "name": "@macalinao/clients-[program-name]",
  "scripts": {
    "build": "tsc",
    "codegen": "coda generate",
    "clean": "rm -fr dist/"
  }
}
```

## CI/CD

GitHub Actions workflow runs on push/PR to main:
- Installs dependencies with frozen lockfile
- Builds all packages
- Runs linting (biome + eslint)
- Runs tests
- Checks TypeScript compilation

## Publishing Workflow

1. Create changeset: `bun run changeset`
2. Version packages: `bun run ci:version`
3. Publish to npm: `bun run ci:publish`
4. Changesets handle version bumping and changelog generation

## Package Structure Guidelines

When creating new packages:
- Use TypeScript directly with `tsc` for building (no tsup/rollup/etc)
- Follow the same structure as existing packages
- Scripts should be: `build`, `clean`, `lint`, `test`, `codegen` (if applicable)
- All packages use ES modules (`"type": "module"` in package.json)
- Keep package.json scripts simple and consistent

## Working with Generated Code

Generated clients provide:
- **Instructions**: Typed builders for all program instructions
- **Accounts**: Decoders and fetchers for all account types
- **Types**: All TypeScript types from the IDL
- **PDAs**: Helper functions for program-derived addresses
- **Errors**: Typed error enums and handlers

Example usage:
```typescript
import { createTransferInstruction } from "./generated";
import { createSolanaRpc } from "@solana/web3.js";

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");
const instruction = createTransferInstruction({
  source: sourceAddress,
  destination: destAddress,
  authority: authorityAddress,
  amount: 1000n
});
```

## Troubleshooting

### Common Issues

1. **IDL not found**: Ensure Anchor program is built (`anchor build`)
2. **Config not loading**: Check file is named `coda.config.mjs` with `.mjs` extension
3. **Import errors**: Ensure all imports use `.js` extensions for local files
4. **Type errors**: Run `bun run build` to check TypeScript compilation

### Debug Commands

```bash
# Check generated files
ls -la ./src/generated/

# Verify config is valid
node -e "import('./coda.config.mjs').then(c => console.log(c.default))"

# Clean and rebuild
bun run clean && bun run codegen && bun run build
```