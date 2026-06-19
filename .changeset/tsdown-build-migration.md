---
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/coda-visitors": patch
"@macalinao/clients-kamino-lending": patch
"@macalinao/clients-meteora-damm-v2": patch
"@macalinao/clients-orca-whirlpools": patch
"@macalinao/clients-quarry": patch
"@macalinao/clients-spl-governance": patch
"@macalinao/clients-spl-stake-pool": patch
"@macalinao/clients-token-metadata": patch
"@macalinao/clients-tribeca": patch
"@macalinao/clients-voter-stake-registry": patch
---

Migrate the package build from `tsc` to [tsdown](https://tsdown.dev). Builds now resolve the shared root `tsdown.config.ts` automatically and emit ESM with type declarations, sourcemaps, and declaration maps (unbundled, preserving source structure). No public API changes.
