---
"@solana-programs/goki-smart-wallet": minor
"@solana-programs/goki-token-signer": minor
"@solana-programs/kamino-farms": minor
"@solana-programs/kamino-lending": minor
"@solana-programs/mpl-bubblegum": minor
"@solana-programs/quarry-merge-mine": minor
"@solana-programs/quarry-mine": minor
"@solana-programs/quarry-mint-wrapper": minor
"@solana-programs/quarry-operator": minor
"@solana-programs/quarry-redeemer": minor
"@solana-programs/quarry-registry": minor
"@solana-programs/tribeca-govern": minor
"@solana-programs/tribeca-locked-voter": minor
---

Publish exactly one program per package.

**Breaking:** the multi-program clients are split, and the combined packages are no longer published:

- `@solana-programs/quarry` → `@solana-programs/quarry-mine`, `quarry-merge-mine`, `quarry-mint-wrapper`, `quarry-operator`, `quarry-redeemer`, `quarry-registry`
- `@solana-programs/goki` → `@solana-programs/goki-smart-wallet`, `goki-token-signer`
- `@solana-programs/tribeca` → `@solana-programs/tribeca-govern`, `tribeca-locked-voter`
- `@solana-programs/kamino-lending` no longer contains the Farms program; it is now `@solana-programs/kamino-farms`, which `kamino-lending` depends on for `FARMS_PROGRAM_ADDRESS`.

Exported names are unchanged, so migrating is a matter of changing the import source. Programs that link to another program's nodes now depend on that program's package and import its helpers instead of duplicating them: `quarry-mine` imports `findMinterPda` from `quarry-mint-wrapper`; `quarry-merge-mine` and `quarry-operator` import `findMinerPda` / `findQuarryPda` from `quarry-mine`.

**Breaking (`@solana-programs/mpl-bubblegum`):** the duplicated Token Metadata helpers (`findMetadataPda`, `findMasterEditionPda`, `MPL_TOKEN_METADATA_PROGRAM_ADDRESS` and the rest of the `mplTokenMetadata` program module) are removed. Bubblegum now depends on `@solana-programs/token-metadata` and its collection instructions derive those PDAs with the helpers from that package.

`@solana-programs/kamino-farms` also ships `updateGlobalConfig` and `updateGlobalConfigAdmin` instruction builders for the Farms program, which the combined client silently overwrote with Kamino Lending's same-named instructions.
