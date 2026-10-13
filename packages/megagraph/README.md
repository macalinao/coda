# @macalinao/megagraph

Builds one validated [Codama](https://github.com/codama-idl/codama) graph of many Solana programs and generates one client package per program from it.

Each program has a **definition**, what the program is, and **release metadata**, how its client package is released. Definitions are useful on their own (e.g. to build your own Codama clients that link into these programs); release metadata only matters to this repository's release pipeline, so it lives in separate files that are not exported.

```ts
// programs/src/quarry/protocol.config.ts
export default defineProtocol({ name: "quarry", displayName: "Quarry", description: "..." });

// programs/src/quarry/mine/program.config.ts
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";
import * as quarryMintWrapper from "../mint-wrapper/program.config.ts";

export const idl = idlJson as AnchorIdl;
export const program = programHandle("quarryMine");
export const pdas = definePdas(program, { ... });

export default defineProgram({
  protocol,
  name: "mine",
  program,
  idl,
  pdas,
  metadata: { displayName: "Quarry Mine", addresses: { devnet: "..." } },
  visitors: [pdas.visitor /* links into quarryMintWrapper.pdas... */],
});

// programs/src/quarry/mine/release.config.ts
import definition from "./program.config.ts";
export default defineProgramRelease({
  program: definition,
  package: { description: "TypeScript client for ...", version: "0.1.0" },
});
```

- `defineProtocol({ name, displayName, description, homepage?, repository? })`: a protocol. `name` is kebab-case.
- `defineProgram({ protocol, name, program, idl, pdas?, metadata?, visitors?, instructionAccountDefaultValues? })`: a program, with its Anchor IDL, its `programHandle`, the `definePdas` handles other definitions link against, and the Coda visitors that complete its IDL. `metadata` describes the on-chain program (all optional): `displayName`, `description`, `repository`, `idlSource` (`{ repository, tag?, commit?, path }`), `addresses` (`mainnet` defaults to the IDL's address and must equal it, or is `null` for a program not deployed on mainnet; `devnet`), `docs`, `audits` and `status` (`"active"` or `"deprecated"` with an optional `supersededBy` program handle or name). The graph build validates it and records it in `graph/packages.json`; generated READMEs render it in their Program section, and the release pipeline treats changes to it as fixes.
- `defineExternalProgram({ protocol, name, idl, npm: { package, range }, source, handles })`: a program whose client is published elsewhere (e.g. `@solana-program/token`), with its vendored Codama IDL. It is linked to and validated, never generated, and becomes a peer dependency of the packages whose code imports it.
- `defineProgramRelease({ program, package: { name?, description, keywords?, version, releaseNotes? } })`: the npm package generated for a program. `name` defaults to `@solana-programs/<protocol>-<program>`; `version` and `releaseNotes` are only used for its first release.
- `defineProtocolRelease({ protocol, keywords?, umbrella? })`: keywords shared by a protocol's packages, and an optional umbrella package re-exporting all of its programs (`precedence` lists program definitions whose exports win name conflicts).
- `defineMegagraph({ programs, externals, protocols, peerDependencies, workspace, sourceRepository })` in `programs/src/megagraph.config.ts`: the registry. `programs` lists every program release, `externals` every external definition and `protocols` the protocol releases, all by import, so dependencies between programs are visible as imports. Nothing is discovered by globbing.

A program's directory, `programs/src/<protocol>/<program>/` (from the protocol's and the program's `name`), must exist: it holds the optional `README.md` (merged into the generated README) and `CHANGELOG.md` seed, and generated READMEs link to it. By convention it also holds `idl.json`, `program.config.ts` and `release.config.ts`.

- `loadPrograms(programsDir)` imports `megagraph.config.ts` and resolves it with `resolvePrograms(config, programsDir)`: names are kebab-case and unique, directories exist, and every protocol release belongs to a listed program's protocol.
- `buildMegagraph(sources)` runs each program's definition, merges every program into one root and validates it: every link resolves, program and package names are unique, and there are no package cycles.
- `generatePackages(...)` renders each program into its own package. Program-qualified links (`pdaLinkNode("metadata", "tokenMetadata")`) become dependencies on the owning package, whose helpers are imported instead of duplicated. Bundles re-export their programs.

The `megagraph` CLI (Bun) drives it from a repository root holding `programs/src/megagraph.config.ts` (`defineMegagraph`). `programs/` is a workspace package whose `src/` holds the inputs, so the definitions can be built and published too (as in coda, where they are `@solana-programs/definitions`; the `release.config.ts` files and `megagraph.config.ts` are left out of the package):

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

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
