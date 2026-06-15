---
"@macalinao/codama-instruction-accounts-dedupe-visitor": minor
"@macalinao/codama-nodes-from-anchor-x": minor
"@macalinao/codama-rename-visitor": minor
"@macalinao/codama-renderers-js-esm": minor
"@macalinao/codama-renderers-markdown": minor
"@macalinao/coda": minor
"@macalinao/coda-visitors": minor
"@macalinao/create-coda": minor
"@macalinao/clients-kamino-lending": minor
"@macalinao/clients-meteora-damm-v2": minor
"@macalinao/clients-orca-whirlpools": minor
"@macalinao/clients-quarry": minor
"@macalinao/clients-spl-governance": minor
"@macalinao/clients-spl-stake-pool": minor
"@macalinao/clients-token-metadata": minor
"@macalinao/clients-tribeca": minor
"@macalinao/clients-voter-stake-registry": minor
---

Update tooling and dependencies to latest.

- **@solana/kit v6** (from v5): this is a breaking peer dependency bump for all generated clients. Consumers must upgrade to `@solana/kit@^6`.
- **Codama renderers**: `@codama/renderers-js` v2 and `@codama/renderers-rust` v3. Generated clients now import shared helpers from `@solana/program-client-core` (declared as a peer dependency alongside `@solana/kit`) and expose a `<program>Program()` client plugin. The previous `shared/` output directory is no longer generated.
- **Solana program clients**: `@solana-program/{system,token,token-2022,memo}` and `@solana/sysvars` bumped to their latest majors.
- **Toolchain**: TypeScript 6, ESLint 10, Biome 2.4, Turbo 2.9, and other dev dependencies updated to latest. A 7-day `minimumReleaseAge` supply-chain gate is now configured in `bunfig.toml`.

All clients have been regenerated against the updated toolchain.
