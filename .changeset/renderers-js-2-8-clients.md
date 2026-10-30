---
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

**Breaking:** regenerated with `@codama/renderers-js` 2.8. The peer dependency
on `@solana/kit` and `@solana/program-client-core` is now `^8.5.0`.

No exports were added, removed or renamed, but the signatures changed:

- **Instruction builders accept more account inputs.** Non-signer accounts take
  any `InstructionAccountInput`: an `Address`, a `ProgramDerivedAddress`, any
  object with an `address` property (`HasAddress`, e.g. web3.js `PublicKey`),
  or an account meta like `{ address, role: AccountRole.READONLY }` to override
  the IDL role. Signer accounts take a `TransactionSigner` or an
  `AccountSignerMeta`.
- **Builder and `*Input` type parameters now capture the input value, not the
  address string.** Code that passes explicit type arguments, such as
  `ClaimRewardsInput<"1111...">`, must pass the input type instead, such as
  `ClaimRewardsInput<Address<"1111...">>`.
- **Signers passed for non-signer accounts are no longer attached as
  signers.** They contribute only their address. Passing a non-signer value
  for a signer account now throws.
- **Public keys in loose types are `Address | HasAddress`.** This applies to
  `*Args`, `*Seeds`, instruction data args and defined types. Code that reads
  these fields and expects a plain `Address`, such as `seeds.owner`, needs
  updating. `*Args` types that used to be aliases (`type FooArgs = Foo`) are
  now separate types. Strict types and decoders still yield `Address`.
- **`programAddress` overrides accept `Address | HasAddress`.** This covers
  instruction builders, `find*Pda`, `fetch*FromSeeds`, the `<program>Program()`
  plugin (which now takes `{ programAddress }` and forwards it to every
  instruction and PDA), and `is<Program>Error`, which takes a trailing
  `{ programAddress }`.
- **Account fetchers accept a Kit client as well as an RPC, and
  `Address | HasAddress` addresses.** For example,
  `fetchMetadata(client, publicKey)` works.
