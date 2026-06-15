import type { ConstantPdaSeedNode, PdaNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";
import { isNode } from "@codama/nodes";
import { renderTypeNode } from "./renderType.js";

export function renderPda(pda: PdaNode, context: RenderContext): string {
  const lines: string[] = [];

  lines.push(`### ${pda.name}`);
  lines.push("");

  if (pda.docs && pda.docs.length > 0) {
    for (const doc of pda.docs) {
      lines.push(doc);
      lines.push("");
    }
  }

  lines.push("**Seeds:**");
  lines.push("");
  lines.push("| Seed | Type | Description |");
  lines.push("| ---- | ---- | ----------- |");

  for (const seed of pda.seeds) {
    const row = renderPdaSeed(seed, context);
    if (row != null) {
      lines.push(row);
    }
  }

  return lines.join("\n");
}

function renderConstantSeedValue(value: ConstantPdaSeedNode["value"]): string {
  if (!isNode(value, ["constantValueNode"])) {
    return "constant";
  }
  const constantValue = value as { value: unknown };
  if (
    constantValue.value &&
    typeof constantValue.value === "object" &&
    "kind" in constantValue.value &&
    constantValue.value.kind === "numberValueNode"
  ) {
    const numberValue = constantValue.value as unknown as { number: number };
    return String(numberValue.number);
  }
  if (
    typeof constantValue.value === "string" ||
    typeof constantValue.value === "number"
  ) {
    return String(constantValue.value);
  }
  return "constant";
}

function renderPdaSeed(
  seed: PdaNode["seeds"][number],
  context: RenderContext,
): string | null {
  if (isNode(seed, ["constantPdaSeedNode"])) {
    const seedType = isNode(seed.type, ["numberTypeNode"])
      ? seed.type.format
      : "bytes";
    const value = renderConstantSeedValue(seed.value);
    return `| \`${value}\` | ${seedType} (constant) | - |`;
  }
  if (isNode(seed, ["variablePdaSeedNode"])) {
    const seedType = renderTypeNode(seed.type, context);
    const description = seed.docs?.join(" ") ?? "-";
    return `| \`${seed.name}\` | ${seedType} | ${description} |`;
  }
  return null;
}
