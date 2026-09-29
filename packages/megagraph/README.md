# @macalinao/megagraph

Builds one validated [Codama](https://github.com/codama-idl/codama) graph of many Solana programs and generates one client package per program from it.

Each program lives in `programs/<protocol>/<program>/` (`idl.json`, `program.config.ts` using `defineProgram`, optional `README.md`); each protocol has a `programs/<protocol>/protocol.config.ts` (`defineProtocol`), which can declare an umbrella package re-exporting all of its programs.

- `buildMegagraph(programs, bundles)` runs each program's config, merges every program into one root and validates it: every link resolves, program and package names are unique, and there are no package cycles.
- `generatePackages(...)` renders each program into its own package. Program-qualified links (`pdaLinkNode("metadata", "tokenMetadata")`) become dependencies on the owning package, whose helpers are imported instead of duplicated. Bundles re-export their programs.

The `megagraph` CLI (Bun) drives it from a repository root holding `programs/megagraph.config.ts` (`defineMegagraph`):

```bash
megagraph graph                       # programs/ -> graph/
megagraph generate                    # graph/ + programs/ -> clients/
megagraph clients <install|build|typecheck|test|lint|fingerprint>
megagraph export <out-dir> [--source-commit <sha>]
megagraph release plan --mirror <dir>
megagraph release apply --mirror <dir> --commit <sha>
megagraph publish <workspace-dir> [--dry-run]
megagraph peers [--refresh|--verify]
megagraph compat --kit <version> [--with <pkg>@<version>]... --clients <a,b>
```

External programs (clients published elsewhere, e.g. `@solana-program/token`) are declared with `defineExternalProgram` next to a vendored Codama IDL: they are linked to and validated, never generated, and become peer dependencies of the packages whose code imports them.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
