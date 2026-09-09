---
"@macalinao/create-coda": minor
"@solana-programs/goki": minor
"@solana-programs/kamino-lending": minor
"@solana-programs/meteora-damm-v2": minor
"@solana-programs/mpl-bubblegum": minor
"@solana-programs/mpl-core": minor
"@solana-programs/mpl-token-auth-rules": minor
"@solana-programs/orca-whirlpools": minor
"@solana-programs/quarry": minor
"@solana-programs/spl-governance": minor
"@solana-programs/spl-stake-pool": minor
"@solana-programs/token-metadata": minor
"@solana-programs/tribeca": minor
"@solana-programs/voter-stake-registry": minor
---

The `@solana/kit` and `@solana/program-client-core` peer dependencies now
declare the major versions they actually support — `^6.10.0 || ^7.0.0 ||
^8.0.0` — instead of `*`.

`*` accepted any version, so a project on a `@solana/kit` too old to satisfy
the generated code installed cleanly and then failed at type-check or runtime
with a missing export. The range above is verified: every client's sources
type-check against 6.10.0, 7.x and 8.x, and 6.9.0 is excluded because it
predates the `ExtendedClient` type the generated program clients import.

Consumers already on a supported version are unaffected. Anyone below 6.10.0
will now see a peer-dependency warning at install time rather than a type
error later.
