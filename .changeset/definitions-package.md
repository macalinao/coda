---
"@solana-programs/definitions": minor
"@macalinao/megagraph": minor
---

New package `@solana-programs/definitions`: the definition of every program the `@solana-programs/*` clients are generated from, so you can generate your own clients for them or build clients that link into them. Each program is importable on its own subpath, e.g. `import { definition, idl, pdas, program } from "@solana-programs/definitions/quarry/mine"`: `definition` is its `defineProgram` definition (protocol, name, program handle, IDL, PDA handles, Coda visitors and on-chain `metadata`), `idl` its Anchor IDL (a Codama `rootNode` for external programs such as `solana/token`, whose `definition.npm` names the package publishing their client), and `program` / `pdas` its typed handles. The package root exports one namespace per protocol (`import { quarry } from "@solana-programs/definitions"`, then `quarry.mine.idl` and `quarry.protocol`), and the raw IDLs are exported as `@solana-programs/definitions/<protocol>/<program>/idl.json`. Release metadata of the generated packages (names, versions, release notes, umbrellas) is not part of the package.

`@macalinao/megagraph` reads the megagraph from `programs/src/megagraph.config.ts`, so `programs/` can be an ordinary buildable package, and `megagraph export` copies the whole `programs/` package into the mirror.
