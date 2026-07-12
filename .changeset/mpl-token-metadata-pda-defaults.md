---
"@macalinao/clients-token-metadata": minor
---

Derive Metaplex Token Metadata PDAs and associated token accounts as
instruction account defaults. The master edition (`edition`/`masterEdition`),
token record (`tokenRecord`/`ownerTokenRecord`/`destinationTokenRecord`), and
transfer ATAs are now resolved automatically from the `mint` (and `token`)
accounts across the Digital Asset instructions (`create`, `mint`, `transfer`,
`delegate`, `revoke`, `lock`, `unlock`, `update`, `use`, `migrate`, `resize`,
`burn`) and the dedicated master-edition instructions, so callers no longer
need to compute them by hand.
