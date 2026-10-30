---
"@macalinao/codama-renderers-js-esm": minor
"@macalinao/coda": minor
"@macalinao/create-coda": minor
---

**Breaking:** `coda generate` now renders with `@codama/renderers-js` 2.8
(from 2.4). Clients generated from now on need `@solana/kit` and
`@solana/program-client-core` `^8.5.0`, and their API changes the same way the
`@solana-programs/*` clients' API does. Instruction builders take
`InstructionAccountInput` / `InstructionSignerInput` values. Builder type
parameters capture input values instead of address strings. Public keys in
`*Args` / `*Seeds` types are `Address | HasAddress`. Fetchers accept Kit
clients. Program plugins take a `{ programAddress }` override. If your code
depends on the generated API, update it after you regenerate.

The ESM renderer declares the `programAddress` override of generated
instruction builders as `... | undefined`. Without this, the program plugin
that `@codama/renderers-js` 2.7+ emits fails to type-check under
`exactOptionalPropertyTypes` (TS2379), because it forwards
`instructionConfig?.programAddress ?? config.programAddress`. The new
`allowUndefinedProgramAddress` export applies the same fix to code from other
renderers.

The `create-coda` template now declares `@solana/kit` /
`@solana/program-client-core` `^8.5.0` peers and depends on
`@macalinao/coda` `^0.8.0`.
