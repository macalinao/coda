---
"@macalinao/clients-mpl-bubblegum": minor
"@macalinao/clients-mpl-token-auth-rules": minor
"@macalinao/clients-mpl-core": minor
---

Add PDA definitions and instruction account defaults to the Metaplex clients so the generated instructions resolve their derived accounts automatically.

**mpl-bubblegum**

- Derive the `treeConfig` (tree authority), `voucher`, `assetId`, `collection_cpi` bubblegum signer, and decompress `mintAuthority` PDAs.
- `treeAuthority` now auto-resolves from the merkle tree.
- `logWrapper` / `compressionProgram` default to the correct programs per instruction version: SPL Noop / SPL Account Compression for v1, MPL Noop / MPL Account Compression for v2.
- `mplCoreCpiSigner` defaults to the fixed signer when a core collection is present.
- Legacy v1 collection instructions derive `collectionMetadata` and `editionAccount` as Token Metadata PDAs of the collection mint (via a bundled minimal Token Metadata program node), and disable `collectionAuthorityRecordPda` by pointing it at the program id.
- `decompressV1` derives its Token Metadata `metadata` / `masterEdition` accounts, mint authority PDA, and the leaf owner's associated token account.

**mpl-core**

- Derive the per-asset `assetSigner` PDA and auto-resolve it for `executeV1`.

**mpl-token-auth-rules**

- Derive the `ruleSet` and `ruleSetBuffer` PDAs, and auto-resolve `bufferPda` from the payer.
