# @solana-programs/goki

## 0.5.0

### Minor Changes

- 7aa9de1: **Breaking:** regenerated with `@codama/renderers-js` 2.8. The peer dependency
  on `@solana/kit` and `@solana/program-client-core` is now `^8.5.0`.
  
  No exports were added, removed or renamed, but the signatures changed:
  
  - **Instruction builders accept more account inputs.** Non-signer accounts take
    any `InstructionAccountInput`: an `Address`, a `ProgramDerivedAddress`, any
    object with an `address` property (`HasAddress`, e.g. web3.js `PublicKey`),
    or an account meta like `{ address, role: AccountRole.READONLY }` to override
    the IDL role. Signer accounts take a `TransactionSigner` or an
    `AccountSignerMeta`.
  - **Builder and `*Input` type parameters now capture the input value, not the
    address string.** Code that passes explicit type arguments, such as
    `ClaimRewardsInput<"1111...">`, must pass the input type instead, such as
    `ClaimRewardsInput<Address<"1111...">>`.
  - **Signers passed for non-signer accounts are no longer attached as
    signers.** They contribute only their address. Passing a non-signer value
    for a signer account now throws.
  - **Public keys in loose types are `Address | HasAddress`.** This applies to
    `*Args`, `*Seeds`, instruction data args and defined types. Code that reads
    these fields and expects a plain `Address`, such as `seeds.owner`, needs
    updating. `*Args` types that used to be aliases (`type FooArgs = Foo`) are
    now separate types. Strict types and decoders still yield `Address`.
  - **`programAddress` overrides accept `Address | HasAddress`.** This covers
    instruction builders, `find*Pda`, `fetch*FromSeeds`, the `<program>Program()`
    plugin (which now takes `{ programAddress }` and forwards it to every
    instruction and PDA), and `is<Program>Error`, which takes a trailing
    `{ programAddress }`.
  - **Account fetchers accept a Kit client as well as an RPC, and
    `Address | HasAddress` addresses.** For example,
    `fetchMetadata(client, publicKey)` works.

## 0.4.2

### Patch Changes

- 5e2330f: Update dependencies to their latest release-age-eligible versions.
  
  - **`@macalinao/coda-visitors` moves to `@solana-program/memo` `^0.16.0`,
    `@solana-program/system` `^0.16.0`, `@solana-program/token` `^0.18.0`,
    `@solana-program/token-2022` `^0.20.0` and `@solana/sysvars` `^8.5.0`.**
    The memo package now exports the new v4 Memo program as
    `MEMO_PROGRAM_ADDRESS`; `MEMO_PROGRAM_VALUE_NODE` keeps pointing at the v3
    program (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`) so generated clients
    are unchanged.
  - **`@solana/kit` and `@solana/program-client-core` move to `^8.5.0`** in the
    workspace catalog. The published peer ranges
    (`^6.10.0 || ^7.0.0 || ^8.0.0`) are unchanged.
  - **`@macalinao/codama-renderers-js-esm` holds `@codama/renderers-js` at
    `~2.4.0`.** Later releases change the generated client API and emit code that
    does not type-check under `exactOptionalPropertyTypes`.
  - **The scaffolded project from `create-coda` now pins `@macalinao/coda` at
    `^0.7.1`** and oxlint `1.90.0` / oxlint-tsgolint `7.0.2005`.
  - Build toolchain: tsdown `0.23.1`, turbo `2.11.10`, size-limit `14.3.0`,
    oxlint `1.90.0`, oxfmt `0.75.0`. `coda generate` output is byte-identical.

## 0.4.1

### Patch Changes

- 9162594: Update dependencies to their latest release-age-eligible versions.
  
  - **`@solana/kit` and `@solana/program-client-core` move to `^8.3.0`** in the
    workspace catalog. The published peer ranges
    (`^6.10.0 || ^7.0.0 || ^8.0.0`) are unchanged, so consumers are not forced to
    upgrade.
  - **`@solana-program/token-2022` moves to `^0.17.0`** in `@macalinao/coda-visitors`.
  - **The scaffolded project from `create-coda` now pins `@macalinao/coda` at
    `^0.7.0`** instead of the long-stale `^0.4.10`.
  - Build toolchain: TypeScript `7.0.2`, tsdown `0.23.0`, turbo `2.10.13`. No
    source changes were required, and `coda generate` output is byte-identical.

## 0.4.0

### Minor Changes

- 0db9756: The `@solana/kit` and `@solana/program-client-core` peer dependencies now
  declare the major versions they actually support — `^6.10.0 || ^7.0.0 ||
  ^8.0.0` — instead of `*`.
  
  `*` accepted any version, so a project on a `@solana/kit` too old to satisfy
  the generated code installed cleanly and then failed at type-check or runtime
  with a missing export. The range above is verified: every client's sources
  type-check against 6.10.0, 7.x and 8.x, and 6.9.0 is excluded because it
  predates the `ExtendedClient` type the generated program clients import.
  
  Consumers already on a supported version are unaffected. Anyone below 6.10.0
  will now see a peer-dependency warning at install time rather than a type
  error later.

## 0.3.0

### Minor Changes

- 965f183: Generated sources now import with explicit `.ts` extensions, so a client's
  `src/` runs directly under Node's native type stripping — Node resolves
  specifiers literally, and the previous `.js` specifiers pointed at files that
  only exist after a build. `rewriteRelativeImportExtensions` rewrites them back
  to `.js` when the package is compiled, so the published `dist/` (which is what
  the `exports` map serves) is unchanged in shape and still carries `.js`.
  
  Internally this is now `@codama/renderers-js`'s own `importExtension` option
  rather than hand-rolled post-processing. `ESM_DEPENDENCY_MAP` is deprecated as
  a result: it is no longer applied to the render and will be removed in the next
  major.
- 068c8a9: Update dependencies to latest, most notably `@solana/kit` 8 and Codama 1.10.
  
  - **`@solana/kit` and `@solana/program-client-core` move to `^8.2.0`.** Both are
    peer dependencies of every generated client, so consumers should upgrade
    alongside this release.
  - **Generated PDA finders now receive the instruction's `programAddress`.**
    `@codama/renderers-js` 2.4.0 threads the resolved program address into
    `find<Name>Pda(...)` calls when resolving default accounts, so PDAs on clients
    rendered for a non-default program address now derive correctly.
  - **Codama 1.10 omits empty arrays** on `rootNode`, `programNode`,
    `instructionNode`, `pdaNode` and the type nodes rather than emitting `[]`.
    The visitors and the Markdown renderer now treat those fields as optional, so
    IDLs with no accounts, arguments, seeds, fields or variants no longer crash
    code generation.

## 0.2.0

### Minor Changes

- dfbec8e: Add a generated TypeScript client for the Goki protocol, covering both the Smart
  Wallet program (`GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH`) and the Token
  Signer program (`NFTUJzSHuUCsMMqMRJpB7PmbsaU7Wm51acdPk2FXMLn`).

  Includes typed instruction builders, account decoders and fetchers, error types,
  and PDA helpers (`findSmartWalletPda`, `findTransactionPda`,
  `findSubaccountInfoPda`, `findWalletDerivedPda`, `findOwnerInvokerPda`,
  `findNftSignerPda`). Goki smart wallets are what Tribeca governance uses to
  execute passed proposals, so this pairs with the existing Tribeca client.
