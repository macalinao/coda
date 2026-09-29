---
"@macalinao/coda": minor
"@macalinao/codama-renderers-js-esm": minor
---

Support generating one package per program from a shared program graph.

- `@macalinao/coda`: `resolveIdlPaths` and `processIdls` accept a `baseDir` that relative IDL paths are resolved against instead of the working directory. The new `processConfig(config, { baseDir, contextPrograms, quiet })` runs a config without loading it from disk; `contextPrograms` are added to the root while the config's visitors run so program-qualified links into them resolve.
- `@macalinao/codama-renderers-js-esm`: `renderESMTypeScriptVisitor(path, options)` takes an optional `externalPrograms` map (program name to module) and `linkOverrides`. External programs are rendered only so links into them resolve: their files are dropped, the barrels only export local programs, and every local link into them is imported from the given module. The renderer throws when a linked external name collides with a local node, since `linkOverrides` are keyed by name only.
