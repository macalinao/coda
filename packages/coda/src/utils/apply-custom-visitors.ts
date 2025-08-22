import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { Codama } from "codama";
import type { CodaConfig } from "../config.js";

/**
 * Apply custom visitors from configuration
 */
export function applyCustomVisitors(
  codama: Codama,
  config: CodaConfig,
  idls: AnchorIdl[],
): void {
  if (config.visitors) {
    // Resolve visitors - either array or function
    const visitors =
      typeof config.visitors === "function"
        ? config.visitors({ idls })
        : config.visitors;

    if (visitors.length > 0) {
      console.log(
        `Applying ${visitors.length.toLocaleString()} custom visitor(s)...`,
      );
      for (const visitor of visitors) {
        codama.update(visitor);
      }
    }
  }
}
