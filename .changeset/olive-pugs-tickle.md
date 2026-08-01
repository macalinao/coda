---
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-rename-visitor": patch
"@macalinao/coda-visitors": patch
"@macalinao/create-coda": patch
"@macalinao/coda": patch
"@macalinao/clients-kamino-lending": patch
"@macalinao/clients-meteora-damm-v2": patch
"@macalinao/clients-mpl-bubblegum": patch
"@macalinao/clients-mpl-core": patch
"@macalinao/clients-mpl-token-auth-rules": patch
"@macalinao/clients-orca-whirlpools": patch
"@macalinao/clients-quarry": patch
"@macalinao/clients-spl-governance": patch
"@macalinao/clients-spl-stake-pool": patch
"@macalinao/clients-token-metadata": patch
"@macalinao/clients-tribeca": patch
"@macalinao/clients-voter-stake-registry": patch
---

Upgrade `@macalinao/tsconfig` to v4 and tighten type checking.

The shared base config now enables `exactOptionalPropertyTypes`,
`noImplicitReturns`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`,
`moduleDetection: "force"`, and the `.ts` import-extension flags. Packages
dropped their local copies of the import-extension flags now that the base
supplies them.

Generated clients opt out of `erasableSyntaxOnly`, since Codama emits
TypeScript `enum` declarations for IDL enum types.

Published output is unchanged; these are compile-time checks only.
