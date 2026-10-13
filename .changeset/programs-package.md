---
"@solana-programs/programs": minor
"@macalinao/megagraph": minor
---

New package `@solana-programs/programs`: the IDL and Coda config of every program the `@solana-programs/*` clients are generated from, so you can generate your own clients for them. Each program is importable on its own subpath, e.g. `import { idl, config, pdas, program } from "@solana-programs/programs/quarry/mine"`, where `idl` is the program's Anchor IDL (a Codama `rootNode` for external programs such as `solana/token`) and `config` its `defineProgram` config. The package root exports one namespace per protocol (`import { quarry } from "@solana-programs/programs"`, then `quarry.mine.idl` and `quarry.protocol`), and the raw IDLs are exported as `@solana-programs/programs/<protocol>/<program>/idl.json`.

`@macalinao/megagraph` reads the program inputs from `programs/src/` (`programs/src/megagraph.config.ts`, `programs/src/<protocol>/<program>/`), so `programs/` can be an ordinary buildable package, and `megagraph export` copies the whole `programs/` package into the mirror.
