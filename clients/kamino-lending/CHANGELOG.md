# @macalinao/clients-kamino-lending

## 0.6.2

### Patch Changes

- dc55630: Update dependencies to their latest versions. Notably, this upgrades `@solana/kit` and `@solana/program-client-core` to v7, `codama` (and its `@codama/*` subpackages) to v1.9, and `typescript` to v7. The generated clients were regenerated with the updated Codama renderers, so downstream consumers should use `@solana/kit` v7. All installs respect the repository's 7-day minimum release age gate.

## 0.6.1

### Patch Changes

- d2bcecb: Migrate the toolchain from Biome + ESLint to the [oxc](https://oxc.rs) tooling (`oxlint` + `oxfmt`) with type-aware linting enabled. Source files were reformatted and some renderer modules renamed to kebab-case. No public API changes.
- 855858f: Migrate the package build from `tsc` to [tsdown](https://tsdown.dev). Builds now resolve the shared root `tsdown.config.ts` automatically and emit ESM with type declarations, sourcemaps, and declaration maps (unbundled, preserving source structure). No public API changes.

## 0.6.0

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

## 0.5.4

### Patch Changes

- e3d8e0f: Regenerate all clients

## 0.5.3

### Patch Changes

- 519b847: Update build script to use TypeScript cache

## 0.5.2

### Patch Changes

- cd86950: Adds more account defaults

## 0.5.1

### Patch Changes

- 64f22ed: Update dependencies
- b2958d8: Use FixedSizeEncoder for more types

## 0.5.0

### Minor Changes

- 8f4eef2: Update Kamino Lending PDAs

## 0.4.3

### Patch Changes

- 43b1550: Update docs

## 0.4.2

### Patch Changes

- d5b3e07: Set default for farms program
- 2b7c11f: Add default instruction account values for many programs

## 0.4.1

### Patch Changes

- ddbbb20: Use ^ for workspace versions

## 0.4.0

### Minor Changes

- 5750530: Update Codama to latest

## 0.3.0

### Minor Changes

- 05ba138: Update all dependencies

## 0.2.2

### Patch Changes

- 44307ce: Dependency updates

## 0.2.1

### Patch Changes

- 2d0ba5c: Dependency cleanup

## 0.2.0

### Minor Changes

- 7d24ee5: Only prefix instruction accounts if there are duplicates

## 0.1.1

### Patch Changes

- 74221c5: Docs

## 0.1.0

### Minor Changes

- fa9af71: Add an index.ts

### Patch Changes

- bb9d597: Update readmes
- 22dd624: Update docs and readmes
- a576929: docs

## 0.0.2

### Patch Changes

- b1da1c7: Update documentation
