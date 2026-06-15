import type { AccountNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";
import { isNode, resolveNestedTypeNode } from "@codama/nodes";
import { renderDiscriminators } from "./render-discriminators.js";
import { renderTypeNode } from "./renderType.js";

export function renderAccount(
  account: AccountNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  lines.push(`### ${account.name}`);
  lines.push("");

  if (account.docs && account.docs.length > 0) {
    for (const doc of account.docs) {
      lines.push(doc);
      lines.push("");
    }
  }

  // Only show discriminators if hideDiscriminators is explicitly false (default is true = hidden)
  if (
    account.discriminators &&
    account.discriminators.length > 0 &&
    context.options.hideDiscriminators === false
  ) {
    lines.push(...renderDiscriminators(account.discriminators));
  }

  if (account.size != null) {
    lines.push(`**Size:** ${String(account.size)} bytes`);
    lines.push("");
  }

  lines.push("**Fields:**");
  lines.push("");
  lines.push("| Field | Type | Description |");
  lines.push("| ----- | ---- | ----------- |");

  const resolvedData = resolveNestedTypeNode(account.data);
  if (isNode(resolvedData, ["structTypeNode"])) {
    for (const field of resolvedData.fields) {
      const fieldType = renderTypeNode(field.type, context);
      const description = field.docs?.join(" ") ?? "-";
      lines.push(`| \`${field.name}\` | ${fieldType} | ${description} |`);
    }
  }

  return lines.join("\n");
}
