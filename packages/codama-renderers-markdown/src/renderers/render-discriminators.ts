import type { AccountNode } from "@codama/nodes";
import { isNode } from "@codama/nodes";

// Account and instruction discriminators share the same registered node type.
type DiscriminatorNode = NonNullable<AccountNode["discriminators"]>[number];

interface DiscriminatorConstant {
  kind?: string;
  type?: { kind?: string };
  data?: unknown;
  value?: unknown;
}

function renderConstantDiscriminator(
  constant: DiscriminatorConstant,
): string[] {
  if (
    constant.kind === "constantValueNode" &&
    constant.type?.kind === "bytesTypeNode"
  ) {
    // For bytes type, we need to handle the data property
    if ("data" in constant && Array.isArray(constant.data)) {
      const bytes = constant.data
        .map((b: number) => `0x${b.toString(16).padStart(2, "0")}`)
        .join(", ");
      return [`- Bytes: \`[${bytes}]\``];
    }
    return [];
  }

  if (constant.kind === "constantValueNode") {
    // For other constant values
    if (
      "value" in constant &&
      constant.value &&
      typeof constant.value === "object" &&
      "kind" in constant.value &&
      constant.value.kind === "numberValueNode"
    ) {
      const numberValue = constant.value as unknown as { number: number };
      return [`- Constant: \`${String(numberValue.number)}\``];
    }
    if ("value" in constant) {
      return [`- Constant: \`${String(constant.value)}\``];
    }
  }

  return [];
}

/**
 * Renders the `**Discriminator:**` section shared by accounts and instructions.
 */
export function renderDiscriminators(
  discriminators: readonly DiscriminatorNode[],
): string[] {
  const lines: string[] = ["**Discriminator:**", ""];
  for (const discriminator of discriminators) {
    if (isNode(discriminator, ["constantDiscriminatorNode"])) {
      // constantDiscriminatorNode has a constant property, not value
      const discriminatorNode = discriminator as {
        constant: DiscriminatorConstant;
      };
      lines.push(...renderConstantDiscriminator(discriminatorNode.constant));
    } else if (isNode(discriminator, ["fieldDiscriminatorNode"])) {
      lines.push(`- Field: \`${discriminator.name}\``);
    } else if (isNode(discriminator, ["sizeDiscriminatorNode"])) {
      lines.push(`- Size: \`${String(discriminator.size)}\``);
    }
  }
  lines.push("");
  return lines;
}
