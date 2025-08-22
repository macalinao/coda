import type { AccountNode } from "@codama/nodes";
import { isNode, resolveNestedTypeNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";
import { renderTypeNode } from "./renderType.js";

export function renderAccount(
  account: AccountNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  lines.push(`### ${account.name}`);
  lines.push("");

  if (account.docs?.length) {
    for (const doc of account.docs) {
      lines.push(doc);
      lines.push("");
    }
  }

  // Only show discriminators if hideDiscriminators is explicitly false (default is true = hidden)
  if (
    account.discriminators?.length &&
    context.options.hideDiscriminators === false
  ) {
    lines.push("**Discriminator:**");
    lines.push("");
    for (const discriminator of account.discriminators) {
      if (isNode(discriminator, ["constantDiscriminatorNode"])) {
        // constantDiscriminatorNode has a constant property, not value
        const discriminatorNode = discriminator as {
          constant: {
            kind?: string;
            type?: { kind?: string };
            data?: unknown;
            value?: unknown;
          };
        };
        const discriminatorConstant = discriminatorNode.constant;
        if (
          discriminatorConstant.kind === "constantValueNode" &&
          discriminatorConstant.type?.kind === "bytesTypeNode"
        ) {
          // For bytes type, we need to handle the data property
          if (
            "data" in discriminatorConstant &&
            Array.isArray(discriminatorConstant.data)
          ) {
            const bytes = discriminatorConstant.data
              .map((b: number) => `0x${b.toString(16).padStart(2, "0")}`)
              .join(", ");
            lines.push(`- Bytes: \`[${bytes}]\``);
          }
        } else if (discriminatorConstant.kind === "constantValueNode") {
          // For other constant values
          if (
            "value" in discriminatorConstant &&
            discriminatorConstant.value &&
            typeof discriminatorConstant.value === "object" &&
            "kind" in discriminatorConstant.value &&
            discriminatorConstant.value.kind === "numberValueNode"
          ) {
            const numberValue = discriminatorConstant.value as unknown as {
              number: number;
            };
            lines.push(`- Constant: \`${String(numberValue.number)}\``);
          } else if ("value" in discriminatorConstant) {
            lines.push(
              `- Constant: \`${String(discriminatorConstant.value)}\``,
            );
          }
        }
      } else if (isNode(discriminator, ["fieldDiscriminatorNode"])) {
        lines.push(`- Field: \`${discriminator.name}\``);
      } else if (isNode(discriminator, ["sizeDiscriminatorNode"])) {
        lines.push(`- Size: \`${String(discriminator.size)}\``);
      }
    }
    lines.push("");
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
