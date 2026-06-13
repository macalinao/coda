---
"@macalinao/coda-visitors": minor
"@macalinao/coda": patch
"@macalinao/clients-meteora-damm-v2": patch
"@macalinao/clients-orca-whirlpools": patch
"@macalinao/clients-quarry": patch
"@macalinao/clients-tribeca": patch
---

Restore event codec generation.

`@codama/nodes-from-anchor` v1.5 now parses Anchor events into dedicated event nodes (excluded from defined types), and `@codama/renderers-js` v2 no longer renders events at all. As a result, event codecs stopped being generated after the toolchain bump.

A new `eventsToDefinedTypesVisitor()` (exported from `@macalinao/coda-visitors`) lifts each program's events back into its defined types so the JS renderer emits a struct codec per event again. It is applied automatically by the `coda` CLI pipeline. Affected clients have been regenerated and their event types restored.
