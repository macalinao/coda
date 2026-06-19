# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coda is an automated client generation tool for Solana programs. Built on top of [Codama](https://github.com/codama-idl/codama), Coda provides a CLI that transforms Anchor IDLs into modern TypeScript clients with full type safety and ES modules support.

The monorepo contains:

- **Coda CLI** - The main tool for generating TypeScript clients from Anchor IDLs
- **Codama utilities** - Custom visitors and renderers for enhanced code generation
- **Generated clients** - Pre-built clients for popular Solana programs

## Technology Stack

- **Package Manager**: Bun (v1.2.20)
- **Build System**: Turbo for monorepo orchestration
- **Language**: TypeScript with ES modules
- **Code Generation**: Codama for AST transformations
- **Code Quality**: oxlint for linting (type-aware + type-checking via oxlint-tsgolint), oxfmt for formatting, Prettier for Markdown/JSON
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
coda generate               # Generate client with Coda CLI
coda init                  # Initialize coda.config.ts

# Code Quality
bun run lint                 # Run oxlint (lint + type-check) and check formatting
bun run lint:fix            # Apply oxlint autofixes and format with oxfmt
bun run format              # Format with oxfmt (code) + prettier (md/mdx)

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
├── docs/                   # Documentation site (Fumadocs + Next.js)
├── scripts/               # Build and CI scripts
└── vendor/                 # Vendored dependencies for reference
    └── fumadocs/          # Fumadocs source for configuration reference
```

## Core Packages

### 1. **@macalinao/coda** - CLI for client generation

- Works out of the box (looks for `./idls/*.json` by default)
- Configurable via `coda.config.ts`
- Generates TypeScript clients with full type safety
- Built on Codama for extensibility
- Supports glob patterns for IDL discovery

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
- Ready-to-use TypeScript client

## How Coda Works

1. **Parse IDL**: Reads Anchor IDL file (JSON format)
2. **Create AST**: Converts to Codama's node structure
3. **Apply Visitors**: Transforms the AST (custom PDAs, flattening, etc.)
4. **Generate Code**: Renders TypeScript with ESM support
5. **Output Files**: Creates organized file structure with types, instructions, accounts, etc.

## Configuration (coda.config.ts)

### Default Configuration

Coda automatically discovers IDLs without any configuration:

- Looks for `./idls/*.json` by default
- Place your IDL files in the `idls/` directory
- No config file needed for basic usage!

### Single IDL Configuration

For projects with a single program (like [token-metadata](https://github.com/macalinao/coda/tree/master/clients/token-metadata)):

```javascript
import { defineConfig } from "@macalinao/coda";
import { addPdasVisitor } from "codama";

export default defineConfig({
  // Optional: Custom path for single IDL
  idlPath: "./idls/my_program.json",
  outputDir: "./src/generated",

  // Optional: Codama visitors for customization
  visitors: [
    addPdasVisitor({
      // Add custom PDAs
    }),
  ],
});
```

### Multiple IDL Configuration with Glob Pattern

For projects with multiple programs (like [quarry](https://github.com/macalinao/coda/tree/master/clients/quarry)):

```javascript
import { defineConfig } from "@macalinao/coda";

export default defineConfig({
  // Use glob pattern to match all IDLs
  idlPath: "./idls/*.json",
  outputDir: "./src/generated",

  // Optional: Add PDAs and other visitors for each program
  visitors: [
    // Custom visitors for each program
  ],
});
```

### Multiple IDL Configuration with Array

You can also explicitly list IDL files:

```javascript
import { defineConfig } from "@macalinao/coda";

export default defineConfig({
  // Array of specific IDL paths
  idlPath: [
    "./idls/program1.json",
    "./idls/program2.json",
    "./custom/path/program3.json",
  ],
  outputDir: "./src/generated",
});
```

### Advanced Glob Patterns

Use specific patterns to match only certain IDLs:

```javascript
import { defineConfig } from "@macalinao/coda";

export default defineConfig({
  // Match only IDLs starting with "quarry_"
  idlPath: "./idls/quarry_*.json",
  // Or combine multiple patterns
  // idlPath: ["./idls/quarry_*.json", "./extra/*.json"],
  outputDir: "./src/generated",
});
```

## Code Style Guidelines

### TypeScript

- Use specific types, avoid `any`
- Prefer interfaces over type aliases for objects
- Use `import type` for type-only imports (enforced by oxlint)
- Arrays use shorthand syntax: `string[]` not `Array<string>`
- **Use double quotes for strings** (not single quotes)
- ES modules with `.js` extensions for imports
- **File naming**: Use kebab-case for all TypeScript files (e.g., `root-node-from-anchor.ts`, `create-codama-from-idls.ts`)

### After Making Code Changes

**Always run these commands to ensure code quality:**

1. `bun run build` - Check for TypeScript errors
2. `bun run lint:fix` - Fix linting and formatting issues

### oxlint Configuration

Linting is configured in the root `.oxlintrc.json` and runs as a single
pass over the whole repo via `oxlint --disable-nested-config`. It enables
the `correctness`, `suspicious`, and `perf` categories plus a curated set
of high-value type-aware rules, with `typeAware` and `typeCheck` on (so
oxlint also reports TypeScript compiler errors). Overrides relax generated
code (`clients/*/src/generated/**`), CLI console output, and tests.

- No floating promises (must be handled)
- No explicit `any`
- No non-null assertions outside tests
- Type-only imports must use `import type` (separated)
- No `console` outside the CLI packages and build scripts

Formatting is handled by oxfmt (code) and Prettier (Markdown/JSON);
oxfmt is scoped to code via `.oxfmtrc.json` ignorePatterns.

## Turborepo Configuration

Tasks are defined in turbo.json:

- `build`: Depends on upstream builds, outputs to `./dist/**`
- `test`: Depends on build, no caching
- `codegen`: Outputs to `./src/generated/**`, no caching
- Tasks run in topological order respecting dependencies

## Adding a New Client

1. **Add IDL file**: Place in `clients/[program-name]/idls/`
2. **Create config**: Add `coda.config.ts` with any custom visitors
3. **Add package.json**: Include build (`"build": "tsdown"`) and codegen scripts
4. **Generate client**: Run `bun run codegen`
5. **Build**: Run `bun run build`

No per-package `tsdown.config.ts` is needed — tsdown walks up to the shared root `tsdown.config.ts`.

Example package.json for a client:

```json
{
  "name": "@macalinao/clients-[program-name]",
  "scripts": {
    "build": "tsdown",
    "codegen": "coda generate",
    "clean": "rm -fr dist/"
  }
}
```

## CI/CD

GitHub Actions workflow runs on push/PR to main:

- Installs dependencies with frozen lockfile
- Builds all packages
- Runs oxlint (lint + type-aware type-checking) and checks formatting with oxfmt
- Runs tests
- Type-checks the coda.config.ts files

## Publishing Workflow

1. Create changeset: `bun run changeset`
2. Version packages: `bun run ci:version`
3. Publish to npm: `bun run ci:publish`
4. Changesets handle version bumping and changelog generation

## Package Structure Guidelines

When creating new packages:

- Build with [tsdown](https://tsdown.dev). The shared root `tsdown.config.ts` is auto-resolved (tsdown walks up the directory tree), so packages need no config of their own. Only add a local `tsdown.config.ts` to override — e.g. extra `entry` points for a CLI binary, as `packages/coda` and `packages/create-coda` do
- Follow the same structure as existing packages
- Scripts should be: `build`, `clean`, `test`, `codegen` (if applicable). Linting is a single repo-wide `oxlint` pass run from the root, so packages do not need their own `lint` script
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

const instruction = createTransferInstruction({
  source: sourceAddress,
  destination: destAddress,
  authority: authorityAddress,
  amount: 1000n,
});
```

## Documentation Guidelines

### Writing Good Documentation

When writing documentation for Coda or generated clients:

1. **Command Examples**:
   - Always show direct command usage: `coda generate`, not `bunx coda generate` or `npx coda`
   - Assume users have installed the package globally or are using it directly
   - Show the simplest path to success

2. **Code Examples**:
   - Provide complete, runnable examples
   - Show imports clearly at the top
   - Use TypeScript for all examples
   - Include types where helpful for clarity

3. **Structure**:
   - Start with the most common use case
   - Progress from simple to complex
   - Link to relevant examples in the repository
   - Use clear headings and subheadings

4. **Best Practices**:
   - Explain the "why" not just the "how"
   - Include error messages users might see
   - Provide solutions to common problems
   - Keep examples concise but complete

5. **Links and References**:
   - Link to example repositories (e.g., token-metadata for single IDL, quarry for multiple IDLs)
   - Reference the official Codama documentation where appropriate
   - Include links to Anchor documentation for IDL-related topics

## Documentation Site

The `apps/docs/` folder contains the documentation site built with Fumadocs and Next.js 15. The structure follows the Fumadocs reference implementation in `vendor/fumadocs/apps/docs/`.

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Documentation**: Fumadocs UI
- **Styling**: Tailwind CSS v4 (no config file needed, uses @source directives)
- **MDX**: Fumadocs MDX with Shiki syntax highlighting
- **Themes**: Catppuccin Latte (light) / Catppuccin Mocha (dark) for code blocks
- **Linting**: oxlint (via the shared root `.oxlintrc.json`)

### Development

```bash
cd apps/docs
bun run dev     # Start dev server on localhost:3000
bun run build   # Build for production
```

### Adding Documentation

1. Create MDX files in `apps/docs/content/docs/`
2. Update navigation in `meta.json` files if needed
3. Code blocks automatically get syntax highlighting
4. Use frontmatter for page metadata (title, description)
5. **Important**: Do NOT include `# Title` headers in MDX files - the title is already specified in the YAML frontmatter and will be rendered automatically

### Key Files

- `src/app/layout.config.tsx` - Site branding and navigation
- `source.config.ts` - MDX and syntax highlighting config
- `src/app/global.css` - Tailwind v4 imports with @source directives
- `content/docs/` - Documentation content in MDX

### MDX Writing Guidelines

- **No redundant headers**: Since the title is specified in YAML frontmatter, do NOT add `# Title` as the first line of content
- Start documentation content directly with the introduction paragraph or first section (`##`)
- The title from frontmatter will be automatically rendered by Fumadocs

## Troubleshooting

### Common Issues

1. **IDL not found**: Ensure Anchor program is built (`anchor build`)
2. **Config not loading**: Check file is named `coda.config.ts` with `.ts` extension
3. **Import errors**: Ensure all imports use `.js` extensions for local files
4. **Type errors**: Run `bun run build` to check TypeScript compilation

### Debug Commands

```bash
# Check generated files
ls -la ./src/generated/

# Verify config is valid
node -e "import('./coda.config.ts').then(c => console.log(c.default))"

# Clean and rebuild
bun run clean && bun run codegen && bun run build
```
