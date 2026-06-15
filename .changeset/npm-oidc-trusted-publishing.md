---
"@macalinao/codama-instruction-accounts-dedupe-visitor": patch
"@macalinao/codama-nodes-from-anchor-x": patch
"@macalinao/codama-rename-visitor": patch
"@macalinao/codama-renderers-js-esm": patch
"@macalinao/codama-renderers-markdown": patch
"@macalinao/coda": patch
"@macalinao/coda-visitors": patch
"@macalinao/create-coda": patch
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

Switch releases to npm OIDC trusted publishing.

Packages are now published without an `NPM_TOKEN`: the release workflow uses `id-token: write`, and `ci-publish.sh` packs each package with `bun pm pack` (resolving `catalog:`/`workspace:` protocols) and publishes the tarball with `npm publish`, which supports OIDC and generates provenance attestations. No change to published package contents.
