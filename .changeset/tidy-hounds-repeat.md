---
"@macalinao/codama-renderers-js-esm": minor
"@macalinao/clients-kamino-lending": minor
"@macalinao/clients-meteora-damm-v2": minor
"@macalinao/clients-mpl-bubblegum": minor
"@macalinao/clients-mpl-core": minor
"@macalinao/clients-mpl-token-auth-rules": minor
"@macalinao/clients-orca-whirlpools": minor
"@macalinao/clients-quarry": minor
"@macalinao/clients-spl-governance": minor
"@macalinao/clients-spl-stake-pool": minor
"@macalinao/clients-token-metadata": minor
"@macalinao/clients-tribeca": minor
"@macalinao/clients-voter-stake-registry": minor
"@macalinao/create-coda": patch
"@macalinao/coda": patch
---

Generate only erasable TypeScript syntax, so clients compile under
`erasableSyntaxOnly` and can be stripped rather than compiled.

`enum` declarations — scalar IDL enums plus the program account and instruction
enums — are now emitted as a `const` object paired with a union type of the same
name, and the program plugin's angle-bracket assertion became an `as` assertion.
The `const` objects keep the exact runtime shape of the enums they replace,
reverse mapping included, so `getEnumEncoder`/`getEnumDecoder` and every
`Enum.Variant` reference behave identically.

Clients no longer opt out of `erasableSyntaxOnly`; the shared base config's
setting now applies to generated code too.

This mirrors the `erasableSyntax` option proposed upstream in
[codama-idl/renderers-js#178](https://github.com/codama-idl/renderers-js/pull/178).
Unlike upstream it is always on, since Coda is opinionated about emitting modern
ESM/TypeScript.
