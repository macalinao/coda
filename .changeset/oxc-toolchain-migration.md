---
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
"@macalinao/coda": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/coda-visitors": patch
---

Migrate the toolchain from Biome + ESLint to the [oxc](https://oxc.rs) tooling (`oxlint` + `oxfmt`) with type-aware linting enabled. Source files were reformatted and some renderer modules renamed to kebab-case. No public API changes.
