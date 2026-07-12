---
"@macalinao/clients-token-metadata": minor
---

Derive collection PDAs as instruction account defaults for the collection
verification instructions. The collection Metadata (`collection`) and master
edition (`collectionMasterEditionAccount`) accounts are now resolved
automatically from the required `collectionMint` across `verifyCollection`,
`unverifyCollection`, `setAndVerifyCollection`, `verifySizedCollectionItem`,
`unverifySizedCollectionItem`, and `setAndVerifySizedCollectionItem`, and the
`collectionMetadata` account is resolved for `setCollectionSize` and
`bubblegumSetCollectionSize`.
