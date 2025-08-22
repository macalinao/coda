import type { DefinedTypeNode, TypeNode } from "@codama/nodes";
import { isNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";

export function renderDefinedType(
  type: DefinedTypeNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  lines.push(`### ${type.name}`);
  lines.push("");

  if (type.docs?.length) {
    for (const doc of type.docs) {
      lines.push(doc);
      lines.push("");
    }
  }

  lines.push("**Definition:**");
  lines.push("");
  lines.push("```typescript");
  lines.push(renderTypeNodeAsTypeScript(type.type, context));
  lines.push("```");

  return lines.join("\n");
}

export function renderTypeNode(type: TypeNode, context: RenderContext): string {
  if (isNode(type, ["booleanTypeNode"])) {
    return "`boolean`";
  }
  if (isNode(type, ["numberTypeNode"])) {
    return `\`${type.format}\``;
  }
  if (isNode(type, ["stringTypeNode"])) {
    return "`string`";
  }
  if (isNode(type, ["bytesTypeNode"])) {
    return "`bytes`";
  }
  if (isNode(type, ["publicKeyTypeNode"])) {
    return "`PublicKey`";
  }
  if (isNode(type, ["arrayTypeNode"])) {
    const itemType = renderTypeNode(type.item, context);
    if (isNode(type.count, ["fixedCountNode"])) {
      const count = type.count as { value: number };
      return `${itemType}[${String(count.value)}]`;
    }
    return `${itemType}[]`;
  }
  if (isNode(type, ["optionTypeNode"])) {
    const itemType = renderTypeNode(type.item, context);
    return `${itemType} | null`;
  }
  if (isNode(type, ["structTypeNode"])) {
    return "`struct`";
  }
  if (isNode(type, ["enumTypeNode"])) {
    return "`enum`";
  }
  if (isNode(type, ["tupleTypeNode"])) {
    const items = type.items.map((item) => renderTypeNode(item, context));
    return `[${items.join(", ")}]`;
  }
  if (isNode(type, ["mapTypeNode"])) {
    const keyType = renderTypeNode(type.key, context);
    const valueType = renderTypeNode(type.value, context);
    return `Map<${keyType}, ${valueType}>`;
  }
  if (isNode(type, ["setTypeNode"])) {
    const itemType = renderTypeNode(type.item, context);
    return `Set<${itemType}>`;
  }
  if (isNode(type, ["definedTypeLinkNode"])) {
    const linkNode = type as { name: string };
    return `[${linkNode.name}](#${linkNode.name.replace(/_/g, "-")}-3)`;
  }
  if (isNode(type, ["accountLinkNode"])) {
    const linkNode = type as { name: string };
    return `[${linkNode.name}](#${linkNode.name.replace(/_/g, "-")})`;
  }

  return "`unknown`";
}

export function renderTypeNodeAsTypeScript(
  type: TypeNode,
  context: RenderContext,
): string {
  if (isNode(type, ["structTypeNode"])) {
    const fields = type.fields.map((field) => {
      const fieldType = renderTypeNodeAsTypeScript(field.type, context);
      return `  ${field.name}: ${fieldType};`;
    });
    return `{\n${fields.join("\n")}\n}`;
  }

  if (isNode(type, ["enumTypeNode"])) {
    const variants = type.variants.map((variant) => {
      if (isNode(variant, ["enumEmptyVariantTypeNode"])) {
        return `  | { kind: "${variant.name}" }`;
      }
      if (isNode(variant, ["enumTupleVariantTypeNode"])) {
        const tupleVariant = variant as {
          name: string;
          tuple: { items: TypeNode[] };
        };
        const tupleTypes = tupleVariant.tuple.items.map((item) =>
          renderTypeNodeAsTypeScript(item, context),
        );
        return `  | { kind: "${tupleVariant.name}"; value: [${tupleTypes.join(", ")}] }`;
      }
      if (isNode(variant, ["enumStructVariantTypeNode"])) {
        const structVariant = variant as {
          name: string;
          struct: { fields: { name: string; type: TypeNode }[] };
        };
        const fields = structVariant.struct.fields.map((field) => {
          const fieldType = renderTypeNodeAsTypeScript(field.type, context);
          return `${field.name}: ${fieldType}`;
        });
        return `  | { kind: "${structVariant.name}"; ${fields.join("; ")} }`;
      }
      return "";
    });
    return variants.join("\n").trim();
  }

  if (isNode(type, ["arrayTypeNode"])) {
    const itemType = renderTypeNodeAsTypeScript(type.item, context);
    if (isNode(type.count, ["fixedCountNode"])) {
      const count = type.count as { value: number };
      return `${itemType}[${String(count.value)}]`;
    }
    return `${itemType}[]`;
  }

  if (isNode(type, ["optionTypeNode"])) {
    const itemType = renderTypeNodeAsTypeScript(type.item, context);
    return `${itemType} | null`;
  }

  if (isNode(type, ["tupleTypeNode"])) {
    const items = type.items.map((item) =>
      renderTypeNodeAsTypeScript(item, context),
    );
    return `[${items.join(", ")}]`;
  }

  if (isNode(type, ["definedTypeLinkNode"])) {
    const linkNode = type as { name: string };
    return linkNode.name;
  }

  if (isNode(type, ["accountLinkNode"])) {
    const linkNode = type as { name: string };
    return linkNode.name;
  }

  if (isNode(type, ["booleanTypeNode"])) {
    return "boolean";
  }

  if (isNode(type, ["numberTypeNode"])) {
    if (type.format.startsWith("u") || type.format.startsWith("i")) {
      return "bigint";
    }
    return "number";
  }

  if (isNode(type, ["stringTypeNode"])) {
    return "string";
  }

  if (isNode(type, ["bytesTypeNode"])) {
    return "Uint8Array";
  }

  if (isNode(type, ["publicKeyTypeNode"])) {
    return "PublicKey";
  }

  return "unknown";
}
