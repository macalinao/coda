import type { ErrorNode } from "@codama/nodes";

export function renderError(error: ErrorNode): string {
  // Convert error code to hex with 0x prefix
  const hexCode = `0x${error.code.toString(16).toLowerCase()}`;
  const errorCode = String(error.code);
  const paddedCode = errorCode.padStart(3, "0");

  // Format: - **Name** (Code: decimal / `xxx` / `0xHEX`) -- Message
  const errorLine = `- **${error.name}** (Code: ${errorCode} / \`${paddedCode}\` / \`${hexCode}\`) -- ${error.message}`;

  return errorLine;
}
