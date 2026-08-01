---
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-rename-visitor": patch
"@macalinao/coda-visitors": patch
"@macalinao/create-coda": patch
"@macalinao/coda": patch
---

Use `.ts` relative import extensions in hand-written package source.

Package sources now import each other with `.ts` extensions, enabled by
`allowImportingTsExtensions` and `rewriteRelativeImportExtensions`. TypeScript
rewrites these to `.js` on emit, so published output is unchanged — `dist`
still ships `.js` specifiers in both the JavaScript and declaration files.

Generated clients are unaffected and continue to use `.js` extensions.
