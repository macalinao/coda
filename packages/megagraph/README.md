# @macalinao/megagraph

Builds one validated [Codama](https://github.com/codama-idl/codama) graph of many Solana programs and generates one client package per program from it.

Each program lives in `programs/<slug>/` (`idl.json`, `program.config.ts` using `defineProgram`, optional `README.md`); umbrella packages are declared with `defineBundles` in `programs/bundles.ts`.

- `buildMegagraph(programs, bundles)` runs each program's config, merges every program into one root and validates it: every link resolves, program and package names are unique, and there are no package cycles.
- `generatePackages(...)` renders each program into its own package. Program-qualified links (`pdaLinkNode("metadata", "tokenMetadata")`) become dependencies on the owning package, whose helpers are imported instead of duplicated. Bundles re-export their programs.

See the [coda repository](https://github.com/macalinao/coda) for the driver script (`scripts/megagraph.ts`).

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
