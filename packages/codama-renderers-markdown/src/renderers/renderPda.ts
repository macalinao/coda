import type { PdaNode } from "@codama/nodes";
import { isNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";
import { renderTypeNode } from "./renderType.js";

export function renderPda(pda: PdaNode, context: RenderContext): string {
  const lines: string[] = [];

  lines.push(`### ${pda.name}`);
  lines.push("");

  if (pda.docs?.length) {
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
    if (isNode(seed, ["constantPdaSeedNode"])) {
      const seedType = isNode(seed.type, ["numberTypeNode"])
        ? seed.type.format
        : "bytes";
      let value = "constant";
      if (isNode(seed.value, ["constantValueNode"])) {
        const constantValue = seed.value as { value: unknown };
        if (
          constantValue.value &&
          typeof constantValue.value === "object" &&
          "kind" in constantValue.value &&
          constantValue.value.kind === "numberValueNode"
        ) {
          const numberValue = constantValue.value as unknown as {
            number: number;
          };
          value = String(numberValue.number);
        } else if (
          typeof constantValue.value === "string" ||
          typeof constantValue.value === "number"
        ) {
          value = String(constantValue.value);
        }
      }
      lines.push(`| \`${value}\` | ${seedType} (constant) | - |`);
    } else if (isNode(seed, ["variablePdaSeedNode"])) {
      const seedType = renderTypeNode(seed.type, context);
      const description = seed.docs?.join(" ") ?? "-";
      lines.push(`| \`${seed.name}\` | ${seedType} | ${description} |`);
    }
  }

  return lines.join("\n");
}
