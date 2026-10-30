---
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-rename-visitor": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/coda": patch
"@macalinao/coda-visitors": patch
"@macalinao/create-coda": patch
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
