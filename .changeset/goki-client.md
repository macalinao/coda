---
"@solana-programs/goki": minor
---

Add a generated TypeScript client for the Goki protocol, covering both the Smart
Wallet program (`GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH`) and the Token
Signer program (`NFTUJzSHuUCsMMqMRJpB7PmbsaU7Wm51acdPk2FXMLn`).

Includes typed instruction builders, account decoders and fetchers, error types,
and PDA helpers (`findSmartWalletPda`, `findTransactionPda`,
`findSubaccountInfoPda`, `findNftSignerPda`). Goki smart wallets are what Tribeca
governance uses to execute passed proposals, so this pairs with the existing
Tribeca client.
