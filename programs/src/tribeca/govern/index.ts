import type { AnchorIdl } from "@codama/nodes-from-anchor";
import idlJson from "./idl.json" with { type: "json" };

export * from "./program.config.ts";
export { default as config } from "./program.config.ts";

/** The program's Anchor IDL, the input of its generated client. */
export const idl: AnchorIdl = idlJson as AnchorIdl;
