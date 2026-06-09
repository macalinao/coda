import type {
  InstructionAccountNode,
  InstructionArgumentNode,
  InstructionNode,
} from "@codama/nodes";
import type { RenderContext } from "../types.js";
import { renderDiscriminators } from "./render-discriminators.js";
import { renderTypeNode } from "./renderType.js";

export function renderInstruction(
  instruction: InstructionNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  lines.push(`### ${instruction.name}`);
  lines.push("");

  if (instruction.docs && instruction.docs.length > 0) {
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
    instruction.discriminators &&
    instruction.discriminators.length > 0 &&
    context.options.hideDiscriminators === false
  ) {
    lines.push(...renderDiscriminators(instruction.discriminators));
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
