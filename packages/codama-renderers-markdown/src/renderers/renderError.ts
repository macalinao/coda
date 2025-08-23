import type { ErrorNode } from "@codama/nodes";
import { pascalCase } from "@codama/nodes";

export function renderError(error: ErrorNode): string {
  // Convert error code to hex with 0x prefix
  const hexCode = `0x${error.code.toString(16).toLowerCase()}`;

  const errorLine = `- **${error.code.toString(10)} - ${pascalCase(error.name)}**: ${error.message} *(Hex: \`${hexCode}\`)*`;

  return errorLine;
}
