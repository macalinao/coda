# @solana-programs/goki

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
