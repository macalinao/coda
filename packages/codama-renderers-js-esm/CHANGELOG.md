# @macalinao/codama-renderers-js-esm

## 0.5.0

### Minor Changes

- 4592662: Update tooling and dependencies to latest.
  - **@solana/kit v6** (from v5): this is a breaking peer dependency bump for all generated clients. Consumers must upgrade to `@solana/kit@^6`.
  - **Codama renderers**: `@codama/renderers-js` v2 and `@codama/renderers-rust` v3. Generated clients now import shared helpers from `@solana/program-client-core` (declared as a peer dependency alongside `@solana/kit`) and expose a `<program>Program()` client plugin. The previous `shared/` output directory is no longer generated.
  - **Solana program clients**: `@solana-program/{system,token,token-2022,memo}` and `@solana/sysvars` bumped to their latest majors.
  - **Toolchain**: TypeScript 6, ESLint 10, Biome 2.4, Turbo 2.9, and other dev dependencies updated to latest. A 7-day `minimumReleaseAge` supply-chain gate is now configured in `bunfig.toml`.

  All clients have been regenerated against the updated toolchain.

### Patch Changes

- b0b616b: Switch releases to npm OIDC trusted publishing.

  Packages are now published without an `NPM_TOKEN`: the release workflow uses `id-token: write`, and `ci-publish.sh` packs each package with `bun pm pack` (resolving `catalog:`/`workspace:` protocols) and publishes the tarball with `npm publish`, which supports OIDC and generates provenance attestations. No change to published package contents.

## 0.4.5

### Patch Changes

- e3d8e0f: Regenerate all clients
- f199765: Update all dependencies

## 0.4.4

### Patch Changes

- 519b847: Update build script to use TypeScript cache

## 0.4.3

### Patch Changes

- 64f22ed: Update dependencies

## 0.4.2

### Patch Changes

- a5d0028: Fix references to bun types
- 95bbbdc: Make sure everything has @types/bun dev dependency

## 0.4.1

### Patch Changes

- 233d0ea: Update to latest dependencies

## 0.4.0

### Minor Changes

- 5750530: Update Codama to latest

## 0.3.0

### Minor Changes

- 05ba138: Update all dependencies

## 0.2.4

### Patch Changes

- 2d0ba5c: Dependency cleanup

## 0.2.3

### Patch Changes

- bb9d597: Update readmes
- 22dd624: Update docs and readmes
- a576929: docs

## 0.2.2

### Patch Changes

- b1da1c7: Update documentation

## 0.2.1

### Patch Changes

- 80235e4: Update README for copyright notices

## 0.2.0

### Minor Changes

- b06099b: Rename to Coda

## 0.1.1

### Patch Changes

- 4e5efaa: Clean up dependencies and peer dependencies
- 2cd4a4b: Move @types/bun into catalog

## 0.1.0

### Minor Changes

- 356a03c: Rename to Grill CLI
