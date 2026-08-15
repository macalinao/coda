---
"@solana-programs/squads": minor
---

Add `@solana-programs/squads`, a `@solana/kit`-native TypeScript client for
Squads Protocol v4 (`SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf`).

Covers all 36 instructions, 9 accounts and 45 errors from the Squads v4 IDL,
plus `find*Pda` helpers for the program config, multisig, vault, transaction,
proposal, batch transaction, ephemeral signer and spending limit derivations.
The seeds match `@sqds/multisig` exactly, so addresses are interchangeable
with the official SDK.
