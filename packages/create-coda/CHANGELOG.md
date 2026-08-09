# @macalinao/create-coda

## 0.4.3

### Patch Changes

- b00b5d6: Upgrade `@macalinao/tsconfig` to v4 and tighten type checking.

  The shared base config now enables `exactOptionalPropertyTypes`,
  `noImplicitReturns`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`,
  `moduleDetection: "force"`, and the `.ts` import-extension flags. Packages
  dropped their local copies of the import-extension flags now that the base
  supplies them.

  Published output is unchanged; these are compile-time checks only.

- 8222bd6: Generate only erasable TypeScript syntax, so clients compile under
  `erasableSyntaxOnly` and can be stripped rather than compiled.

  `enum` declarations — scalar IDL enums plus the program account and instruction
  enums — are now emitted as a `const` object paired with a union type of the same
  name, and the program plugin's angle-bracket assertion became an `as` assertion.
  The `const` objects keep the exact runtime shape of the enums they replace,
  reverse mapping included, so `getEnumEncoder`/`getEnumDecoder` and every
  `Enum.Variant` reference behave identically.

  Clients no longer opt out of `erasableSyntaxOnly`; the shared base config's
  setting now applies to generated code too.

  This mirrors the `erasableSyntax` option proposed upstream in
  [codama-idl/renderers-js#178](https://github.com/codama-idl/renderers-js/pull/178).
  Unlike upstream it is always on, since Coda is opinionated about emitting modern
  ESM/TypeScript.

## 0.4.2

### Patch Changes

- f608019: Use `.ts` relative import extensions in hand-written package source.

  Package sources now import each other with `.ts` extensions, enabled by
  `allowImportingTsExtensions` and `rewriteRelativeImportExtensions`. TypeScript
  rewrites these to `.js` on emit, so published output is unchanged — `dist`
  still ships `.js` specifiers in both the JavaScript and declaration files.

  Generated clients are unaffected and continue to use `.js` extensions.

## 0.4.1

### Patch Changes

- dc55630: Update dependencies to their latest versions. Notably, this upgrades `@solana/kit` and `@solana/program-client-core` to v7, `codama` (and its `@codama/*` subpackages) to v1.9, and `typescript` to v7. The generated clients were regenerated with the updated Codama renderers, so downstream consumers should use `@solana/kit` v7. All installs respect the repository's 7-day minimum release age gate.

## 0.4.0

### Minor Changes

- 69f133b: Support `coda.config.ts` configuration files loaded natively by Node.js.

  Coda now looks for `coda.config.ts` by default and imports it directly using
  Node's native TypeScript support (type stripping), so no build step or loader is
  required. Existing `coda.config.mjs`/`.js` files continue to work as a fallback.
  `coda init` and `create-coda` now scaffold a `coda.config.ts` using
  `defineConfig` for full type safety.

## 0.3.0

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

## 0.2.6

### Patch Changes

- e3d8e0f: Regenerate all clients
- f199765: Update all dependencies

## 0.2.5

### Patch Changes

- 519b847: Update build script to use TypeScript cache

## 0.2.4

### Patch Changes

- 778f6ec: Update deps

## 0.2.3

### Patch Changes

- 95bbbdc: Make sure everything has @types/bun dev dependency

## 0.2.2

### Patch Changes

- c688299: Version bumps
- ddbbb20: Use ^ for workspace versions

## 0.2.1

### Patch Changes

- 233d0ea: Update to latest dependencies

## 0.2.0

### Minor Changes

- 05ba138: Update all dependencies

## 0.1.1

### Patch Changes

- 44307ce: Dependency updates

## 0.1.0

### Minor Changes

- f6ca7e7: Add create-coda package

### Patch Changes

- 74221c5: Docs
