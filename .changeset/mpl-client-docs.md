---
"@macalinao/codama-renderers-js-esm": minor
"@macalinao/coda-visitors": minor
---

Add documentation tooling for generated clients:

- `@macalinao/coda-visitors` now exports `setStructFieldDocsVisitor`, which
  injects docs onto individual struct fields (account data fields and the
  fields of instruction-argument structs) — something the built-in
  `updateInstructionsVisitor` / `updateDefinedTypesVisitor` cannot reach.
- `@macalinao/codama-renderers-js-esm` now emits instruction-level `docs` as
  JSDoc blocks above the generated `get<Name>Instruction` /
  `get<Name>InstructionAsync` builder functions. The upstream
  `@codama/renderers-js` templates dropped these.
