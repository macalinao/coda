---
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-rename-visitor": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/coda-visitors": patch
"@macalinao/create-coda": patch
"@macalinao/coda": patch
"@solana-programs/goki": patch
"@solana-programs/kamino-lending": patch
"@solana-programs/meteora-damm-v2": patch
"@solana-programs/mpl-bubblegum": patch
"@solana-programs/mpl-core": patch
"@solana-programs/mpl-token-auth-rules": patch
"@solana-programs/orca-whirlpools": patch
"@solana-programs/quarry": patch
"@solana-programs/spl-governance": patch
"@solana-programs/spl-stake-pool": patch
"@solana-programs/token-metadata": patch
"@solana-programs/tribeca": patch
"@solana-programs/voter-stake-registry": patch
---

Update dependencies to their latest release-age-eligible versions.

- **`@solana/kit` and `@solana/program-client-core` move to `^8.3.0`** in the
  workspace catalog. The published peer ranges
  (`^6.10.0 || ^7.0.0 || ^8.0.0`) are unchanged, so consumers are not forced to
  upgrade.
- **`@solana-program/token-2022` moves to `^0.17.0`** in `@macalinao/coda-visitors`.
- **The scaffolded project from `create-coda` now pins `@macalinao/coda` at
  `^0.7.0`** instead of the long-stale `^0.4.10`.
- Build toolchain: TypeScript `7.0.2`, tsdown `0.23.0`, turbo `2.10.13`. No
  source changes were required, and `coda generate` output is byte-identical.
