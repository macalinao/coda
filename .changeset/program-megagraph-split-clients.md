---
"@solana-programs/goki": minor
"@solana-programs/goki-smart-wallet": minor
"@solana-programs/goki-token-signer": minor
"@solana-programs/kamino-farms": minor
"@solana-programs/kamino-klend": minor
"@solana-programs/kamino-lending": minor
"@solana-programs/mpl-bubblegum": minor
"@solana-programs/quarry": minor
"@solana-programs/quarry-merge-mine": minor
"@solana-programs/quarry-mine": minor
"@solana-programs/quarry-mint-wrapper": minor
"@solana-programs/quarry-operator": minor
"@solana-programs/quarry-redeemer": minor
"@solana-programs/quarry-registry": minor
"@solana-programs/tribeca": minor
"@solana-programs/tribeca-govern": minor
"@solana-programs/tribeca-locked-voter": minor
---

Publish every program as its own package.

New single-program packages:

- `@solana-programs/quarry-mine`, `quarry-merge-mine`, `quarry-mint-wrapper`, `quarry-operator`, `quarry-redeemer`, `quarry-registry`
- `@solana-programs/goki-smart-wallet`, `goki-token-signer`
- `@solana-programs/tribeca-govern`, `tribeca-locked-voter`
- `@solana-programs/kamino-klend` (Kamino Lending) and `@solana-programs/kamino-farms`

`@solana-programs/quarry`, `goki`, `tribeca` and `kamino-lending` are now umbrella packages with no code of their own: they depend on and `export *` the packages above, so existing imports keep working. Every name the combined clients exported is still exported flat. Where two bundled programs export the same name, the umbrella resolves it to the program the combined client used to expose (Kamino Lending's `updateGlobalConfig*`, Locked Voter's `activateProposal*`), and it now also exports the other program in full under a namespace (`farms`, `govern`), which makes Farms' and Govern's versions of those instructions reachable for the first time.

Programs that link to another program's nodes now depend on that program's package and import its helpers instead of duplicating them: `quarry-mine` imports `findMinterPda` from `quarry-mint-wrapper`, `quarry-merge-mine` and `quarry-operator` import `findMinerPda` / `findQuarryPda` from `quarry-mine`, and `kamino-klend` imports `FARMS_PROGRAM_ADDRESS` from `kamino-farms`.

**Breaking (`@solana-programs/mpl-bubblegum`):** the duplicated Token Metadata helpers (`findMetadataPda`, `findMasterEditionPda`, `MPL_TOKEN_METADATA_PROGRAM_ADDRESS` and the rest of the `mplTokenMetadata` program module) are removed. Bubblegum now depends on `@solana-programs/token-metadata` and derives those PDAs with the helpers from that package.
