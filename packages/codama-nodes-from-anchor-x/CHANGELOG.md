# @macalinao/codama-nodes-from-anchor-x

## 0.2.1

### Patch Changes

- d2bcecb: Migrate the toolchain from Biome + ESLint to the [oxc](https://oxc.rs) tooling (`oxlint` + `oxfmt`) with type-aware linting enabled. Source files were reformatted and some renderer modules renamed to kebab-case. No public API changes.
- 855858f: Migrate the package build from `tsc` to [tsdown](https://tsdown.dev). Builds now resolve the shared root `tsdown.config.ts` automatically and emit ESM with type declarations, sourcemaps, and declaration maps (unbundled, preserving source structure). No public API changes.
- Updated dependencies [855858f]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.5.1

## 0.2.0

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

- Updated dependencies [b0b616b]
- Updated dependencies [4592662]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.5.0

## 0.1.3

### Patch Changes

- e3d8e0f: Regenerate all clients
- Updated dependencies [e3d8e0f]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.4.3

## 0.1.2

### Patch Changes

- 519b847: Update build script to use TypeScript cache
- Updated dependencies [519b847]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.4.2

## 0.1.1

### Patch Changes

- a5d0028: Fix references to bun types
- 95bbbdc: Make sure everything has @types/bun dev dependency
- Updated dependencies [a5d0028]
- Updated dependencies [95bbbdc]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.4.1

## 0.1.0

### Minor Changes

- 05ba138: Update all dependencies

### Patch Changes

- Updated dependencies [05ba138]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.4.0

## 0.0.6

### Patch Changes

- 44307ce: Dependency updates
- Updated dependencies [44307ce]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.3.2

## 0.0.5

### Patch Changes

- 2d0ba5c: Dependency cleanup
- Updated dependencies [2d0ba5c]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.3.1

## 0.0.4

### Patch Changes

- Updated dependencies [7d24ee5]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.3.0

## 0.0.3

### Patch Changes

- bb9d597: Update readmes
- 22dd624: Update docs and readmes
- a576929: docs
- Updated dependencies [bb9d597]
- Updated dependencies [22dd624]
- Updated dependencies [a576929]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.2.3

## 0.0.2

### Patch Changes

- b1da1c7: Update documentation
- Updated dependencies [b1da1c7]
- Updated dependencies [fd54620]
  - @macalinao/codama-instruction-accounts-dedupe-visitor@0.2.2
