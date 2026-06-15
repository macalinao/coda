# @macalinao/grill-cli

## 0.5.0

### Minor Changes

- 4592662: Update tooling and dependencies to latest.
  - **@solana/kit v6** (from v5): this is a breaking peer dependency bump for all generated clients. Consumers must upgrade to `@solana/kit@^6`.
  - **Codama renderers**: `@codama/renderers-js` v2 and `@codama/renderers-rust` v3. Generated clients now import shared helpers from `@solana/program-client-core` (declared as a peer dependency alongside `@solana/kit`) and expose a `<program>Program()` client plugin. The previous `shared/` output directory is no longer generated.
  - **Solana program clients**: `@solana-program/{system,token,token-2022,memo}` and `@solana/sysvars` bumped to their latest majors.
  - **Toolchain**: TypeScript 6, ESLint 10, Biome 2.4, Turbo 2.9, and other dev dependencies updated to latest. A 7-day `minimumReleaseAge` supply-chain gate is now configured in `bunfig.toml`.

  All clients have been regenerated against the updated toolchain.

### Patch Changes

- a3096dc: `coda generate` now scaffolds a `src/index.ts` barrel re-exporting the generated client when one is missing. Previously only the `generated/` directory was emitted, so a package whose entry point compiles from `src/index.ts` would build with no errors yet produce no entry file, publishing a broken package that resolves to nothing. Existing entry files are never overwritten.
- b0b616b: Switch releases to npm OIDC trusted publishing.

  Packages are now published without an `NPM_TOKEN`: the release workflow uses `id-token: write`, and `ci-publish.sh` packs each package with `bun pm pack` (resolving `catalog:`/`workspace:` protocols) and publishes the tarball with `npm publish`, which supports OIDC and generates provenance attestations. No change to published package contents.

- 91adfbb: Restore event codec generation.

  `@codama/nodes-from-anchor` v1.5 now parses Anchor events into dedicated event nodes (excluded from defined types), and `@codama/renderers-js` v2 no longer renders events at all. As a result, event codecs stopped being generated after the toolchain bump.

  A new `eventsToDefinedTypesVisitor()` (exported from `@macalinao/coda-visitors`) lifts each program's events back into its defined types so the JS renderer emits a struct codec per event again. It is applied automatically by the `coda` CLI pipeline. Affected clients have been regenerated and their event types restored.

- Updated dependencies [b0b616b]
- Updated dependencies [91adfbb]
- Updated dependencies [4592662]
  - @macalinao/codama-nodes-from-anchor-x@0.2.0
  - @macalinao/codama-rename-visitor@0.4.0
  - @macalinao/codama-renderers-js-esm@0.5.0
  - @macalinao/codama-renderers-markdown@0.5.0
  - @macalinao/coda-visitors@0.2.0

## 0.4.10

### Patch Changes

- e3d8e0f: Regenerate all clients
- f199765: Update all dependencies
- Updated dependencies [e3d8e0f]
- Updated dependencies [f199765]
  - @macalinao/codama-nodes-from-anchor-x@0.1.3
  - @macalinao/codama-renderers-markdown@0.4.3
  - @macalinao/codama-renderers-js-esm@0.4.5
  - @macalinao/codama-rename-visitor@0.3.3
  - @macalinao/coda-visitors@0.1.9

## 0.4.9

### Patch Changes

- 519b847: Update build script to use TypeScript cache
- Updated dependencies [519b847]
  - @macalinao/codama-nodes-from-anchor-x@0.1.2
  - @macalinao/codama-renderers-markdown@0.4.2
  - @macalinao/codama-renderers-js-esm@0.4.4
  - @macalinao/codama-rename-visitor@0.3.2
  - @macalinao/coda-visitors@0.1.8

## 0.4.8

### Patch Changes

- 9d147c5: Fix bug where ATA program had the wrong default value

## 0.4.7

### Patch Changes

- 778f6ec: Update deps

## 0.4.6

### Patch Changes

- cd86950: Adds more account defaults
- Updated dependencies [cd86950]
  - @macalinao/coda-visitors@0.1.7

## 0.4.5

### Patch Changes

- 43b1550: Update docs

## 0.4.4

### Patch Changes

- 2b7c11f: Add default instruction account values for many programs
- Updated dependencies [2b7c11f]
  - @macalinao/coda-visitors@0.1.3

## 0.4.3

### Patch Changes

- c688299: Version bumps
- ddbbb20: Use ^ for workspace versions

## 0.4.2

### Patch Changes

- Updated dependencies [9bddb41]
  - @macalinao/coda-visitors@0.1.2

## 0.4.1

### Patch Changes

- 499a750: Adds coda-visitors package and clients-voter-stake-registry
- 233d0ea: Update to latest dependencies
- Updated dependencies [499a750]
- Updated dependencies [233d0ea]
  - @macalinao/coda-visitors@0.1.1
  - @macalinao/codama-renderers-js-esm@0.4.1

## 0.4.0

### Minor Changes

- 5750530: Update Codama to latest

### Patch Changes

- Updated dependencies [5750530]
  - @macalinao/codama-renderers-markdown@0.4.0
  - @macalinao/codama-renderers-js-esm@0.4.0

## 0.3.0

### Minor Changes

- 05ba138: Update all dependencies

### Patch Changes

- Updated dependencies [05ba138]
  - @macalinao/codama-nodes-from-anchor-x@0.1.0
  - @macalinao/codama-renderers-markdown@0.3.0
  - @macalinao/codama-renderers-js-esm@0.3.0
  - @macalinao/codama-rename-visitor@0.3.0

## 0.2.9

### Patch Changes

- 44307ce: Dependency updates
- Updated dependencies [44307ce]
  - @macalinao/codama-nodes-from-anchor-x@0.0.6
  - @macalinao/codama-renderers-markdown@0.2.3
  - @macalinao/codama-rename-visitor@0.2.3

## 0.2.8

### Patch Changes

- 0f83101: Add coda idl command for printing the underlying codama IDL

## 0.2.7

### Patch Changes

- 2de0764: Support generation of Rust clients

## 0.2.6

### Patch Changes

- 2d0ba5c: Dependency cleanup
- Updated dependencies [2d0ba5c]
  - @macalinao/codama-nodes-from-anchor-x@0.0.5
  - @macalinao/codama-renderers-markdown@0.2.2
  - @macalinao/codama-renderers-js-esm@0.2.4
  - @macalinao/codama-rename-visitor@0.2.2

## 0.2.5

### Patch Changes

- @macalinao/codama-nodes-from-anchor-x@0.0.4

## 0.2.4

### Patch Changes

- a576929: docs
- Updated dependencies [bb9d597]
- Updated dependencies [22dd624]
- Updated dependencies [a576929]
  - @macalinao/codama-nodes-from-anchor-x@0.0.3
  - @macalinao/codama-renderers-markdown@0.2.1
  - @macalinao/codama-renderers-js-esm@0.2.3
  - @macalinao/codama-rename-visitor@0.2.1

## 0.2.3

### Patch Changes

- b1da1c7: Update documentation
- Updated dependencies [dff409a]
- Updated dependencies [b1da1c7]
- Updated dependencies [9d59913]
  - @macalinao/codama-renderers-markdown@0.2.0
  - @macalinao/codama-nodes-from-anchor-x@0.0.2
  - @macalinao/codama-renderers-js-esm@0.2.2
  - @macalinao/codama-rename-visitor@0.2.0

## 0.2.2

### Patch Changes

- f7a50ca: Add codama-renderers-markdown
- Updated dependencies [f7a50ca]
  - @macalinao/codama-renderers-markdown@0.1.1

## 0.2.1

### Patch Changes

- 205f0d8: Add documentation site
- 80235e4: Update README for copyright notices
- 5d0f4f1: Update all dependencies
- Updated dependencies [80235e4]
  - @macalinao/codama-renderers-js-esm@0.2.1

## 0.2.0

### Minor Changes

- b06099b: Rename to Coda

### Patch Changes

- Updated dependencies [b06099b]
  - @macalinao/codama-renderers-js-esm@0.2.0

## 0.1.2

### Patch Changes

- 4e5efaa: Clean up dependencies and peer dependencies
- 2cd4a4b: Move @types/bun into catalog
- Updated dependencies [4e5efaa]
- Updated dependencies [2cd4a4b]
  - @macalinao/codama-renderers-js-esm@0.1.1

## 0.1.1

### Patch Changes

- 0d09839: Regenerate token metadata client
- 97ba1ec: Pass in Anchor IDL to visitors array

## 0.1.0

### Minor Changes

- 356a03c: Rename to Grill CLI

### Patch Changes

- Updated dependencies [356a03c]
  - @macalinao/codama-renderers-js-esm@0.1.0
