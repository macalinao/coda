---
"@macalinao/codama-instruction-accounts-dedupe-visitor": minor
"@macalinao/codama-nodes-from-anchor-x": minor
"@macalinao/codama-rename-visitor": minor
"@macalinao/codama-renderers-js-esm": minor
"@macalinao/codama-renderers-markdown": minor
"@macalinao/coda-visitors": minor
"@macalinao/create-coda": minor
"@macalinao/coda": minor
"@solana-programs/goki": minor
"@solana-programs/kamino-lending": minor
"@solana-programs/meteora-damm-v2": minor
"@solana-programs/mpl-bubblegum": minor
"@solana-programs/mpl-core": minor
"@solana-programs/mpl-token-auth-rules": minor
"@solana-programs/orca-whirlpools": minor
"@solana-programs/quarry": minor
"@solana-programs/spl-governance": minor
"@solana-programs/spl-stake-pool": minor
"@solana-programs/token-metadata": minor
"@solana-programs/tribeca": minor
"@solana-programs/voter-stake-registry": minor
---

Update dependencies to latest, most notably `@solana/kit` 8 and Codama 1.10.

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
