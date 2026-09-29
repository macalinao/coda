---
"@macalinao/coda": minor
"@macalinao/codama-renderers-js-esm": minor
"@macalinao/megagraph": minor
---

Tooling for generating one package per Solana program from a shared program graph.

- `@macalinao/coda`:
  - `resolveIdlPaths` and `processIdls` accept a `baseDir` that relative IDL paths are resolved against instead of the working directory. The new `processConfig(config, { baseDir, contextPrograms, quiet })` runs a config without loading it from disk; `contextPrograms` are added to the root while the config's visitors run so program-qualified links into them resolve.
  - Typed program and PDA handles: `programHandle(name)` (`.link`, `.pda()`, `.account()`, `.definedType()`, always program-qualified) and `definePdas(program, { ... })` with `constant()`/`variable()` seeds. PDA names and variable seed names are literal types, so `pdas.miner.value({ quarry, authority })` fails to type-check on a misspelled PDA or a missing seed. `pdas.visitor` adds the PDAs to their program.
- `@macalinao/codama-renderers-js-esm`: `renderESMTypeScriptVisitor(path, options)` takes an optional `externalPrograms` map (program name to module) and `linkOverrides`. External programs are rendered only so links into them resolve: their files are dropped, the barrels only export local programs, and every local link into them is imported from the given module. The renderer throws when a linked external name collides with a local node, since `linkOverrides` are keyed by name only.
- `@macalinao/megagraph` (new): loads `programs/<protocol>/<program>/program.config.ts` (`defineProgram`) and `programs/<protocol>/protocol.config.ts` (`defineProtocol`, with an optional umbrella package), builds one validated Codama graph of every program, generates one package per program plus umbrellas into a standalone workspace, and plans and applies releases (semver bumps classified from the graph diff against the previous release, and changelogs).
