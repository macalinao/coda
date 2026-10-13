# @solana-programs/programs

The inputs of every `@solana-programs/*` client: each program's IDL and its [Coda](https://coda.ianm.com) config (PDAs, visitors, on-chain metadata), grouped by protocol. Use it to generate your own clients for these programs, or to read their IDLs, without vendoring them.

```bash
bun add @solana-programs/programs
```

## Usage

Each program's entry exports its IDL as `idl`, its `program.config.ts` default export (a `defineProgram` config) as `config`, and the config's named exports (the `program` handle, `pdas`, ...):

```typescript
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { config, idl, pdas } from "@solana-programs/programs/quarry/mine";

const root = rootNodeFromAnchor(idl);
console.log(config.program?.displayName, Object.keys(pdas));
```

The package root exports one namespace per protocol, holding its `protocol.config.ts` as `protocol` and one namespace per program:

```typescript
import { kamino, quarry } from "@solana-programs/programs";

quarry.protocol.displayName; // "Quarry"
kamino.lending.idl;
```

The raw IDL files are also exported:

```typescript
import idl from "@solana-programs/programs/quarry/mine/idl.json" with { type: "json" };
```

External programs (e.g. `solana/token`, whose client is `@solana-program/token`) export a Codama `rootNode` as `idl` instead of an Anchor IDL.

## Layout

```
src/
├── index.ts                     # one namespace per protocol
└── <protocol>/
    ├── protocol.config.ts       # defineProtocol (+ optional umbrella package)
    ├── index.ts                 # protocol + one namespace per program
    └── <program>/
        ├── idl.json             # the program's IDL
        ├── program.config.ts    # defineProgram / defineExternalProgram
        ├── index.ts             # config, idl and the config's named exports
        └── README.md            # optional, merged into the generated README
```

In [macalinao/coda](https://github.com/macalinao/coda), `src/` is also what [`@macalinao/megagraph`](https://www.npmjs.com/package/@macalinao/megagraph) builds the program graph and the generated clients from.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
