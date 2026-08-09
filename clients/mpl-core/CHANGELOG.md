# @macalinao/clients-mpl-core

## 0.4.0

### Minor Changes

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

### Patch Changes

- b00b5d6: Upgrade `@macalinao/tsconfig` to v4 and tighten type checking.

  The shared base config now enables `exactOptionalPropertyTypes`,
  `noImplicitReturns`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`,
  `moduleDetection: "force"`, and the `.ts` import-extension flags. Packages
  dropped their local copies of the import-extension flags now that the base
  supplies them.

  Published output is unchanged; these are compile-time checks only.

## 0.3.2

### Patch Changes

- dc55630: Update dependencies to their latest versions. Notably, this upgrades `@solana/kit` and `@solana/program-client-core` to v7, `codama` (and its `@codama/*` subpackages) to v1.9, and `typescript` to v7. The generated clients were regenerated with the updated Codama renderers, so downstream consumers should use `@solana/kit` v7. All installs respect the repository's 7-day minimum release age gate.

## 0.3.1

### Patch Changes

- d2bcecb: Migrate the toolchain from Biome + ESLint to the [oxc](https://oxc.rs) tooling (`oxlint` + `oxfmt`) with type-aware linting enabled. Source files were reformatted and some renderer modules renamed to kebab-case. No public API changes.

## 0.3.0

### Minor Changes

- bb287f7: Add PDA definitions and instruction account defaults to the Metaplex clients so the generated instructions resolve their derived accounts automatically.

  **mpl-bubblegum**
  - Derive the `treeConfig` (tree authority), `voucher`, `assetId`, `collection_cpi` bubblegum signer, and decompress `mintAuthority` PDAs.
  - `treeAuthority` now auto-resolves from the merkle tree.
  - `logWrapper` / `compressionProgram` default to the correct programs per instruction version: SPL Noop / SPL Account Compression for v1, MPL Noop / MPL Account Compression for v2.
  - `mplCoreCpiSigner` defaults to the fixed signer when a core collection is present.
  - Legacy v1 collection instructions derive `collectionMetadata` and `editionAccount` as Token Metadata PDAs of the collection mint (via a bundled minimal Token Metadata program node), and disable `collectionAuthorityRecordPda` by pointing it at the program id.
  - `decompressV1` derives its Token Metadata `metadata` / `masterEdition` accounts, mint authority PDA, and the leaf owner's associated token account.

  **mpl-core**
  - Derive the per-asset `assetSigner` PDA and auto-resolve it for `executeV1`.

  **mpl-token-auth-rules**
  - Derive the `ruleSet` and `ruleSetBuffer` PDAs, and auto-resolve `bufferPda` from the payer.

## 0.2.0

### Minor Changes

- c7b3f29: Initial release of the Metaplex Bubblegum, Core, and Token Auth Rules clients. Placeholder `0.0.0` stubs were published manually to reserve the names on npm; these first real versions ship the generated clients via CI's OIDC trusted publishing.
