---
"@macalinao/codama-renderers-js-esm": minor
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

Generated sources now import with explicit `.ts` extensions, so a client's
`src/` runs directly under Node's native type stripping — Node resolves
specifiers literally, and the previous `.js` specifiers pointed at files that
only exist after a build. `rewriteRelativeImportExtensions` rewrites them back
to `.js` when the package is compiled, so the published `dist/` (which is what
the `exports` map serves) is unchanged in shape and still carries `.js`.

Internally this is now `@codama/renderers-js`'s own `importExtension` option
rather than hand-rolled post-processing. `ESM_DEPENDENCY_MAP` is deprecated as
a result: it is no longer applied to the render and will be removed in the next
major.
