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
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-rename-visitor": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/coda-visitors": patch
"@macalinao/create-coda": patch
---

Update dependencies to their latest versions. Notably, this upgrades `@solana/kit` and `@solana/program-client-core` to v7, `codama` (and its `@codama/*` subpackages) to v1.9, and `typescript` to v7. The generated clients were regenerated with the updated Codama renderers, so downstream consumers should use `@solana/kit` v7. All installs respect the repository's 7-day minimum release age gate.
