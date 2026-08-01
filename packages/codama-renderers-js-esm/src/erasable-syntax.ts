/**
 * Rewrites the non-erasable TypeScript syntax emitted by
 * `@codama/renderers-js` into equivalent erasable syntax.
 *
 * TypeScript's `erasableSyntaxOnly` flag — and Node.js type stripping, which
 * enforces the same rule — reject syntax that carries runtime behaviour. The
 * upstream renderer emits two such constructs: `enum` declarations for scalar
 * IDL enums (plus the program account and instruction enums), and an
 * angle-bracket type assertion on the program plugin object.
 *
 * The replacements mirror upstream `@codama/renderers-js` PR #178
 * (`erasableSyntax` option), which is still unreleased. Once it ships, this
 * module can be dropped in favour of passing the option through.
 *
 * @see https://github.com/codama-idl/renderers-js/pull/178
 */

/**
 * Matches an `export enum Name { ... }` declaration, optionally preceded by the
 * docblock rendered directly above it and optionally followed by the stray
 * semicolon the defined-type fragment appends.
 *
 * The docblock group cannot span a comment terminator, so it only ever captures
 * the comment immediately above the declaration. Enum bodies contain nothing
 * but variant names and commas, so `[^}]*` safely stops at the closing brace.
 */
const ENUM_DECLARATION =
  /(?:(\/\*\*(?:[^*]|\*(?!\/))*\*\/)\r?\n)?export enum (\w+) \{([^}]*)\};?/g;

/** Matches an angle-bracket type assertion on the program plugin object. */
const PLUGIN_ASSERTION = /<(\w+Plugin)>\{/g;

/**
 * Renders the object literal that stands in for a numeric `enum`.
 *
 * The object reproduces exactly what a numeric `enum` compiles to, reverse
 * mapping included: `@solana/codecs` derives an enum's keys and values by
 * inspecting that runtime shape, so a forward-only object would make
 * `getEnumEncoder` reject every variant at runtime.
 */
function renderEnumObject(variantNames: string[]): string {
  const reverseEntries = variantNames.map(
    (name, index) => `${String(index)}: ${JSON.stringify(name)}`,
  );
  const forwardEntries = variantNames.map(
    (name, index) => `${name}: ${String(index)}`,
  );
  return `{ ${[...reverseEntries, ...forwardEntries].join(", ")} }`;
}

/**
 * Renders the erasable replacement for a single `enum` declaration.
 *
 * The object is aliased through a module-local lookup constant whose numeric
 * keys are dropped with `Omit<..., number>`. Without that, `typeof Name` would
 * include the reverse-mapping values and widen the generated decoders' return
 * types beyond what they declare. With it, `typeof Name` models the enum the
 * same way TypeScript models a real one, and the emitted `getEnumEncoder(Name)`
 * / `getEnumDecoder(Name)` calls keep working untouched.
 */
function renderErasableEnum(
  name: string,
  variantNames: string[],
  docblock: string,
): string {
  const lookupName = `${name}Lookup`;
  return [
    `const ${lookupName} = ${renderEnumObject(variantNames)} as const;`,
    "",
    `${docblock}export const ${name}: Omit<typeof ${lookupName}, number> = ${lookupName};`,
    "",
    `export type ${name} = (typeof ${name})[keyof typeof ${name}];`,
  ].join("\n");
}

/**
 * Replaces the `enum` declarations in `code` and reports which names were
 * rewritten, so that references to their members can be fixed up afterwards.
 */
function replaceEnumDeclarations(code: string): {
  code: string;
  enumNames: Set<string>;
} {
  const enumNames = new Set<string>();
  const updated = code.replace(
    ENUM_DECLARATION,
    (_match, docblock: string | undefined, name: string, body: string) => {
      const variantNames = body
        .split(",")
        .map((variant) => variant.trim())
        .filter((variant) => variant.length > 0);
      enumNames.add(name);
      return renderErasableEnum(
        name,
        variantNames,
        docblock ? `${docblock}\n` : "",
      );
    },
  );
  return { code: updated, enumNames };
}

/**
 * Rewrites references to enum members that sit in a type position.
 *
 * A `const` object only exists in the value space, so its members need a
 * `typeof` query to be named as a type. The only such reference the renderer
 * emits is the `instructionType` discriminant of the parsed instruction union.
 *
 * Two spellings have to be recognised because the discriminant is reached both
 * as a union member — `| { instructionType: X.Y } & ParsedY<TProgram>` — and,
 * once a formatter has wrapped that member across lines, as a semicolon
 * terminated property. Neither can be confused with the value-position twin
 * built by the parse function, whose members are comma separated.
 */
function useTypeofForMemberTypes(code: string, enumNames: Set<string>): string {
  if (enumNames.size === 0) {
    return code;
  }
  return (
    code
      // `| { instructionType: X.Y } & ParsedY<TProgram>`
      .replace(
        /(\|\s*\(?\{\s*)instructionType: (\w+)\.(\w+)/g,
        (match, prefix: string, enumName: string, variantName: string) =>
          enumNames.has(enumName)
            ? `${prefix}instructionType: typeof ${enumName}.${variantName}`
            : match,
      )
      // The same member once a formatter has wrapped it across lines.
      .replace(
        /instructionType: (\w+)\.(\w+);/g,
        (match, enumName: string, variantName: string) =>
          enumNames.has(enumName)
            ? `instructionType: typeof ${enumName}.${variantName};`
            : match,
      )
  );
}

/**
 * Finds the index just past the `}` closing the object literal that starts at
 * `start`, skipping over string and template literals so that a brace inside a
 * literal cannot end the scan early.
 */
function findObjectEnd(code: string, start: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let index = start; index < code.length; index++) {
    const char = code[index];
    if (quote) {
      if (char === "\\") {
        index++;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        return index + 1;
      }
    }
  }
  throw new Error("Unterminated object literal in generated code");
}

/**
 * Rewrites `<XPlugin>{ ... }` into `{ ... } as XPlugin`.
 *
 * `erasableSyntaxOnly` rejects angle-bracket assertions because they are
 * ambiguous with JSX; the `as` form is equivalent and erasable.
 */
function replacePluginAssertions(code: string): string {
  let updated = code;
  for (;;) {
    PLUGIN_ASSERTION.lastIndex = 0;
    const match = PLUGIN_ASSERTION.exec(updated);
    if (!match) {
      return updated;
    }
    const pluginType = match[1];
    const braceIndex = match.index + match[0].length - 1;
    const end = findObjectEnd(updated, braceIndex);
    updated =
      updated.slice(0, match.index) +
      updated.slice(braceIndex, end) +
      ` as ${pluginType}` +
      updated.slice(end);
  }
}

/**
 * Rewrites every non-erasable construct in a generated file so it compiles
 * under `erasableSyntaxOnly` and runs under Node.js type stripping.
 *
 * @param code - The contents of a single generated file.
 * @returns The same file with only erasable TypeScript syntax.
 *
 * @example
 * ```ts
 * makeSyntaxErasable("export enum Key {\n  V1,\n  V2,\n}");
 * // const KeyLookup = { 0: "V1", 1: "V2", V1: 0, V2: 1 } as const;
 * //
 * // export const Key: Omit<typeof KeyLookup, number> = KeyLookup;
 * //
 * // export type Key = (typeof Key)[keyof typeof Key];
 * ```
 */
export function makeSyntaxErasable(code: string): string {
  const { code: withoutEnums, enumNames } = replaceEnumDeclarations(code);
  return replacePluginAssertions(
    useTypeofForMemberTypes(withoutEnums, enumNames),
  );
}
