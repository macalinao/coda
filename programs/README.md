# @solana-programs/definitions

The definition of every program the `@solana-programs/*` clients are generated from: each program's IDL, typed handles to it and its PDAs, the [Coda](https://coda.ianm.com) visitors that complete its IDL, and metadata of the on-chain program (addresses, sources, audits, status), grouped by protocol. Use it to generate your own clients for these programs, to build clients that link into them, or to read their IDLs, without vendoring them.

It contains definitions only: how the `@solana-programs/*` packages are named, versioned and released is not part of it.

```bash
bun add @solana-programs/definitions
```

## Usage

Each program's entry exports its definition (a `defineProgram` object from [`@macalinao/megagraph`](https://www.npmjs.com/package/@macalinao/megagraph)) as `definition`, its IDL as `idl`, its program handle as `program` and its PDA handles as `pdas`:

```typescript
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { definition, idl, pdas, program } from "@solana-programs/definitions/quarry/mine";

const root = rootNodeFromAnchor(idl);
console.log(definition.metadata?.displayName, program.name, Object.keys(pdas));
```

A definition holds everything needed to run its Coda visitors. Defaults that link into another program's PDAs (e.g. Quarry Mine's `minter` account, a Quarry Mint Wrapper PDA) only resolve when that program's PDAs are in the root too, which `processConfig`'s `contextPrograms` option provides:

```typescript
import { processConfig } from "@macalinao/coda";
import { definition } from "@solana-programs/definitions/quarry/mine";

const { codama } = await processConfig(
  { visitors: definition.visitors },
  { idls: [definition.idl] },
);
```

Handles are program-qualified, so your own Codama/Coda config can link into these programs, e.g. as an instruction account default:

```typescript
import { accountValueNode } from "@macalinao/coda";
import { pdas } from "@solana-programs/definitions/quarry/mine";

const defaultValue = pdas.miner.value({
  quarry: accountValueNode("quarry"),
  authority: accountValueNode("authority"),
});
```

The package root exports one namespace per protocol, holding its `defineProtocol` definition as `protocol` and one namespace per program:

```typescript
import { kamino, quarry } from "@solana-programs/definitions";

quarry.protocol.displayName; // "Quarry"
kamino.lending.idl;
```

The raw IDL files are also exported:

```typescript
import idl from "@solana-programs/definitions/quarry/mine/idl.json" with { type: "json" };
```

External programs (e.g. `solana/token`, whose client is `@solana-program/token`) are `defineExternalProgram` definitions: their `idl` is a Codama `rootNode` instead of an Anchor IDL, and `definition.npm` names the package their client is published in.

## Layout

```
src/
├── index.ts                     # one namespace per protocol
├── megagraph.config.ts          # the registry (not published)
└── <protocol>/
    ├── protocol.config.ts       # defineProtocol
    ├── release.config.ts        # keywords, umbrella package (not published)
    ├── index.ts                 # protocol + one namespace per program
    └── <program>/
        ├── idl.json             # the program's IDL
        ├── program.config.ts    # defineProgram / defineExternalProgram
        ├── release.config.ts    # npm package, first version (not published)
        ├── index.ts             # definition, idl, program, pdas, ...
        └── README.md            # optional, merged into the generated README
```

In [macalinao/coda](https://github.com/macalinao/coda), `src/` is also what [`@macalinao/megagraph`](https://www.npmjs.com/package/@macalinao/megagraph) builds the program graph and the generated clients from.

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
