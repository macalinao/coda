import type { RootNode } from "@macalinao/coda";
import idlJson from "./idl.json" with { type: "json" };

export * from "./program.config.ts";
export { default as config } from "./program.config.ts";

// JSON imports widen string literals, so the node kinds do not type-check as
// literals; the IDL is a valid rootNode (megagraph validates it on every build).
/** The program's Codama IDL (a `rootNode`), vendored from its npm package. */
export const idl: RootNode = idlJson as unknown as RootNode;
