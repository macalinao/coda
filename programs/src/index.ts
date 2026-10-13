/**
 * Every program of the Coda program megagraph, one namespace per protocol:
 * its `protocol.config.ts` as `protocol` and, per program, the exports of its
 * `program.config.ts` (`config` is the default export) and its IDL as `idl`.
 * Each protocol and program is also importable from its own subpath, e.g.
 * `@solana-programs/definitions/quarry/mine`.
 */

export * as goki from "./goki/index.ts";
export * as kamino from "./kamino/index.ts";
export * as metaplex from "./metaplex/index.ts";
export * as meteora from "./meteora/index.ts";
export * as orca from "./orca/index.ts";
export * as quarry from "./quarry/index.ts";
export * as solana from "./solana/index.ts";
export * as spl from "./spl/index.ts";
export * as tribeca from "./tribeca/index.ts";
