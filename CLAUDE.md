# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coda is an automated client generation tool for Solana programs. Built on top of [Codama](https://github.com/codama-idl/codama), Coda provides a CLI that transforms Anchor IDLs into modern TypeScript clients with full type safety and ES modules support.

The monorepo contains:

- **Coda CLI** - The main tool for generating TypeScript clients from Anchor IDLs
- **Codama utilities** - Custom visitors and renderers for enhanced code generation
- **Program megagraph** - Every program's IDL and config under `programs/`, merged into one Codama graph (`graph/codama.json`)
- **Generated clients** - Pre-built clients for popular Solana programs, one package per program, generated entirely from `programs/`

## Technology Stack

- **Package Manager**: Bun (v1.4.2)
- **Build System**: Turbo for monorepo orchestration
- **Language**: TypeScript with ES modules
- **Code Generation**: Codama for AST transformations
- **Code Quality**: oxlint for linting (type-aware + type-checking via oxlint-tsgolint), oxfmt for formatting
- **Testing**: Bun test runner

## Dev Environment

The repo ships a Nix flake (`flake.nix`) that provides the *runtimes* — Bun
1.4.2, Node 24, `git`, and `nixfmt`. Everything else (oxlint, oxfmt,
oxlint-tsgolint, TypeScript, turbo) is pinned in `package.json` and resolved
from `node_modules/.bin`, so there is exactly one copy of each on PATH and it
is the same one CI installs from the lockfile.

```bash
nix develop          # enter the dev shell manually
direnv allow         # or let direnv enter it automatically (uses .envrc)
```

`.envrc` runs `use flake`, which auto-watches `flake.nix` and `flake.lock`, and
`dotenv_if_exists` to load a local `.env`. Nix is optional — if you already
have Bun 1.4.2+ and Node 24+ on PATH, `bun install` works without it.
`engines` in the root `package.json` records the expected versions.

## Essential Commands

```bash
# Development
bun install                  # Install all dependencies
bun run build                # Build all packages
bun run build:watch          # Watch mode for all packages
bun run build:watch:packages # Watch mode for packages only

# Code Generation (graph/ and clients/ are generated, never committed)
bun run graph               # Build graph/ (the megagraph) from programs/
bun run codegen             # graph/, then the clients/ workspace, then `bun install` in it
bun run clients build       # Build/typecheck/test/lint the generated clients (skips if absent)
coda generate               # Generate client with Coda CLI
coda init                  # Initialize coda.config.ts

# Code Quality
bun run lint                 # Run oxlint (lint + type-check) and check formatting
bun run lint:fix            # Apply oxlint autofixes and format with oxfmt
bun run format              # Format with oxfmt

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
│   └── megagraph/          # Graph builder, generator and release planner (@macalinao/megagraph)
├── programs/               # Source of truth for every client (private workspace package)
│   └── quarry/             # protocol.config.ts (+ optional umbrella), CHANGELOG seed
│       └── mine/           # idl.json, program.config.ts, optional README.md / CHANGELOG seed
├── graph/                  # Generated, gitignored: codama.json, packages.json
├── clients/                # Generated, gitignored: standalone Bun workspace
│   └── packages/quarry/mine/  # @solana-programs/quarry-mine (umbrella at packages/quarry/)
├── scripts/megagraph.ts    # Driver: programs/ -> graph/ -> clients/, release plan/apply
├── scripts/clients.ts      # Runs install/build/typecheck/test/lint inside clients/
├── scripts/export-solana-programs.ts  # Assembles the toolboxdao/solana-programs mirror
├── scripts/publish-clients.ts          # Publishes mirror packages missing from npm
├── apps/docs/              # Documentation site (Fumadocs + Next.js)
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
- Emits only erasable syntax (no `enum`, no angle-bracket assertions), so generated clients compile under `erasableSyntaxOnly`

### 4. **@macalinao/megagraph**

- Builds and validates the program megagraph from `programs/`
- Generates one package per program (plus umbrellas) into `clients/`
- Plans and applies releases of the generated packages

### 5. **@solana-programs/token-metadata**

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

For projects with a single program:

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

For projects with multiple programs:

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
3. `bun run changeset` - Record the version bump before opening a PR (see
   [Changesets on Every PR](#changesets-on-every-pr))

### oxlint Configuration

Linting is configured in the root `.oxlintrc.json` and runs as a single
pass over the whole repo via `oxlint --disable-nested-config`. It enables
the `correctness`, `suspicious`, and `perf` categories plus a curated set
of high-value type-aware rules, with `typeAware` and `typeCheck` on (so
oxlint also reports TypeScript compiler errors). `graph/`, `clients/` and
`mirror/` are generated and ignored. Overrides relax CLI console output and
tests, and ban raw link constructors in `programs/**`.

- No floating promises (must be handled)
- No explicit `any`
- No non-null assertions outside tests
- Type-only imports must use `import type` (separated)
- No `console` outside the CLI packages and build scripts

Formatting is handled by oxfmt; it is scoped to code via
`.oxfmtrc.json` ignorePatterns.

## Turborepo Configuration

Tasks are defined in turbo.json:

- `build`: Depends on upstream builds, outputs to `./dist/**`
- `test`: Depends on build, no caching
- `codegen`: No package defines it anymore; the root `graph`/`codegen` scripts build `@macalinao/megagraph` with turbo and then run `scripts/megagraph.ts`
- Tasks run in topological order respecting dependencies

## Program Megagraph

`programs/` is the single source of truth for every `@solana-programs/*`
client, grouped by protocol:

- `programs/<protocol>/protocol.config.ts` - `defineProtocol({ displayName,
  description, homepage?, repository?, keywords?, umbrella? })`. `umbrella`
  (`{ name, description, version, precedence? }`) generates a package that
  re-exports every program of the protocol.
- `programs/<protocol>/<program>/idl.json` - the program's Anchor IDL
- `programs/<protocol>/<program>/program.config.ts` -
  `defineProgram({ package: { name?, description, keywords?, version,
  releaseNotes? }, instructionAccountDefaultValues, visitors })`. The package
  name defaults to `@solana-programs/<protocol>-<program>`; existing
  published names are set explicitly.
- `README.md` (optional) - hand-written body inserted into the generated README
- `CHANGELOG.md` (optional) - seed changelog for a package's first release

`programs/` is one private workspace package (`@solana-programs/programs`)
with its own `tsconfig.json`, so the repo-wide `bun run lint` type-checks
every config. That needs the tooling built first (`@macalinao/coda` and
`@macalinao/megagraph` resolve to their `dist/` types), which CI's build step
guarantees.

**Links are typed and always program-qualified.** Each config exports
`program = programHandle("<codama name>")` and, for PDAs it declares,
`pdas = definePdas(program, { ... })` (with `constant()`/`variable()` seeds).
Use `pdas.<name>.value({ <seed>: ... })` for PDA default values,
`pdas.<name>.link` / `program.link` / `program.pda|account|definedType(name)`
for links, and `pdas.visitor` to add the PDAs. Another program's handles are
imported from its config (`import * as quarryMine from
"../mine/program.config.ts"`); the import graph mirrors the package
dependencies and must stay acyclic. oxlint bans the raw `pdaLinkNode`,
`accountLinkNode`, `definedTypeLinkNode` and `programLinkNode` in
`programs/**`.

`bun run graph` runs every config on a root whose main program is that program
(so bare selectors like `updateAccountsVisitor({ miner })` only match it),
merges the results into one root, validates it (every link resolves, reported
as `<package>: unresolved pdaLink <program>.<name>`; unique program and
package names; no package cycles) and writes `graph/codama.json` and
`graph/packages.json` (protocols, packages, umbrellas). `bun run codegen`
then generates `clients/`, a standalone Bun workspace (not part of this
repository's workspaces, so a fresh clone installs without it):
`packages/<protocol>/<program>/` per program, `packages/<protocol>/` per
umbrella. Each link into another program becomes a `workspace:^` dependency
and an import from that package instead of re-emitted code.

Fresh clone: `bun install && bun run codegen && bun run build`.

**Releases** of `@solana-programs/*` do not use changesets. The
`release-clients.yml` workflow plans versions against the release state in
github.com/toolboxdao/solana-programs (the mirror: previous graph, versions and
changelogs) with `scripts/megagraph.ts release plan`, applies them with
`release apply`, verifies everything builds (in coda and in the exported
mirror standalone), commits and tags the release in the mirror, then
publishes the versions npm does not have. A package's `version` in its config
is only used for its first release. Classification: removed/renamed/changed/
reordered interface nodes are breaking, additions features, docs-only changes
and regenerated-code-only changes fixes, unknown changes breaking; 0.x
releases breaking changes as minor and everything else as patch.

## Adding a New Client

1. Create `programs/<protocol>/<program>/idl.json` and `program.config.ts`
   (copy an existing one), and `programs/<protocol>/protocol.config.ts` for a
   new protocol
2. Optionally add a `README.md`
3. Run `bun run codegen` and `bun run build`
4. Add size budgets for the package to `.size-limit.json`
5. A brand new npm name needs a bootstrap publish and a trusted publisher for
   `release-clients.yml` (see `scripts/bootstrap-publish.sh`)

Keep everything program-specific in `programs/` (inputs) and tooling in
`packages/*`, so the program data can move to its own repository.

## CI/CD

GitHub Actions workflow runs on push/PR to main:

- Installs dependencies with frozen lockfile
- Builds all packages
- Runs oxlint (lint + type-aware type-checking) and checks formatting with oxfmt
- Runs tests
- Generates `graph/` and `clients/` (the graph step under native Node),
  checks codegen is idempotent, and builds, type-checks and loads every
  generated client, then checks bundle sizes

`release-clients.yml` releases the generated clients (see Program Megagraph);
on pull requests it only posts the release plan to the job summary.
`release.yml` (changesets) releases only the tooling packages.

## Publishing Workflow

1. Create changeset: `bun run changeset`
2. Version packages: `bun run ci:version`
3. Publish to npm: `bun run ci:publish`
4. Changesets handle version bumping and changelog generation

### Changesets on Every PR

**Every new PR must include a changeset.** Releases of the tooling packages
are cut from the changesets on master, so a PR without one ships its changes
with no version bump and no changelog entry. The generated `@solana-programs/*`
clients are not workspace packages and are versioned by
`release-clients.yml` instead; changes to `programs/` need no changeset.

1. Run `bun run changeset`
2. Select the package(s) the PR affects
3. Choose the semver bump: `patch` for fixes and internals, `minor` for new
   backwards-compatible features, `major` for breaking changes
4. Write a summary aimed at consumers of the package — it becomes the
   changelog entry
5. Commit the generated file in `.changeset/` as part of the PR

For changes with no effect on published output — docs, CI workflows, repo
tooling — use `bun run changeset --empty` to record the deliberate decision,
or say in the PR description why no changeset is needed. This is the
exception; anything that changes what a package publishes needs a real bump.

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
   - Link to example programs (e.g., `programs/token-metadata` for a single program, the `programs/quarry-*` suite for linked programs)
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
