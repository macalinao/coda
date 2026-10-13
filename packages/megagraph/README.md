# @macalinao/megagraph

Builds one validated [Codama](https://github.com/codama-idl/codama) graph of many Solana programs and generates one client package per program from it.

Each program lives in `programs/src/<protocol>/<program>/` (`idl.json`, `program.config.ts` using `defineProgram`, optional `README.md`); each protocol has a `programs/src/<protocol>/protocol.config.ts` (`defineProtocol`), which can declare an umbrella package re-exporting all of its programs.

`defineProgram({ package, program })` separates the npm package (`package`: name, description, keywords, first version) from the on-chain program it targets (`program`, all optional): `displayName`, `description`, `repository`, `idlSource` (`{ repository, tag?, commit?, path }`), `addresses` (`mainnet` defaults to the IDL's address and must equal it, or is `null` for a program not deployed on mainnet; `devnet`), `docs`, `audits` and `status` (`"active"` or `"deprecated"` with an optional `supersededBy` program). The graph build validates it and records it in `graph/packages.json`; generated READMEs render it in their Program section, and the release pipeline treats changes to it as fixes.

- `buildMegagraph(programs, bundles)` runs each program's config, merges every program into one root and validates it: every link resolves, program and package names are unique, and there are no package cycles.
- `generatePackages(...)` renders each program into its own package. Program-qualified links (`pdaLinkNode("metadata", "tokenMetadata")`) become dependencies on the owning package, whose helpers are imported instead of duplicated. Bundles re-export their programs.

The `megagraph` CLI (Bun) drives it from a repository root holding `programs/src/megagraph.config.ts` (`defineMegagraph`). `programs/` is a workspace package whose `src/` holds the inputs, so they can be built and published too (as in coda, where it is `@solana-programs/programs`):

```bash
megagraph graph                       # programs/src/ -> graph/
megagraph generate                    # graph/ + programs/src/ -> clients/
megagraph clients <install|build|typecheck|test|lint|fingerprint>
megagraph export <out-dir> [--source-commit <sha>]
megagraph release plan --mirror <dir>
megagraph release apply --mirror <dir> --commit <sha>
megagraph publish <workspace-dir> [--dry-run]
megagraph peers [--refresh|--verify]
megagraph compat --kit <version> [--with <pkg>@<version>]... --clients <a,b>
```

External programs (clients published elsewhere, e.g. `@solana-program/token`) are declared with `defineExternalProgram({ npm: { package, range }, source, handles })` next to a vendored Codama IDL: they are linked to and validated, never generated, and become peer dependencies of the packages whose code imports them.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
