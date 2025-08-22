import type {
  InstructionAccountNode,
  InstructionArgumentNode,
  InstructionNode,
} from "@codama/nodes";
import { isNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";
import { renderTypeNode } from "./renderType.js";

export function renderInstruction(
  instruction: InstructionNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  lines.push(`### ${instruction.name}`);
  lines.push("");

  if (instruction.docs?.length) {
    for (const doc of instruction.docs) {
      lines.push(doc);
      lines.push("");
    }
  }

  // Accounts
  if (instruction.accounts.length > 0) {
    lines.push("**Accounts:**");
    lines.push("");
    lines.push("| Account | Type | Description |");
    lines.push("| ------- | ---- | ----------- |");

    for (const account of instruction.accounts) {
      lines.push(renderInstructionAccount(account));
    }
    lines.push("");
  }

  // Arguments
  if (instruction.arguments.length > 0) {
    lines.push("**Arguments:**");
    lines.push("");
    lines.push("| Argument | Type | Description |");
    lines.push("| -------- | ---- | ----------- |");

    for (const arg of instruction.arguments) {
      lines.push(renderInstructionArgument(arg, context));
    }
    lines.push("");
  }

  // Discriminator - only show if hideDiscriminators is explicitly false (default is true = hidden)
  if (
    instruction.discriminators?.length &&
    context.options.hideDiscriminators === false
  ) {
    lines.push("**Discriminator:**");
    lines.push("");
    for (const discriminator of instruction.discriminators) {
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
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

function renderInstructionAccount(account: InstructionAccountNode): string {
  const constraints: string[] = [];

  if (account.isSigner !== false) {
    constraints.push("signer");
  }
  if (account.isWritable) {
    constraints.push("writable");
  }
  if (account.isOptional) {
    constraints.push("optional");
  }

  const type = constraints.length > 0 ? constraints.join(", ") : "readonly";
  const description = account.docs?.join(" ") ?? "-";

  return `| \`${account.name}\` | ${type} | ${description} |`;
}

function renderInstructionArgument(
  arg: InstructionArgumentNode,
  context: RenderContext,
): string {
  const type = renderTypeNode(arg.type, context);
  const description = arg.docs?.join(" ") ?? "-";

  return `| \`${arg.name}\` | ${type} | ${description} |`;
}
