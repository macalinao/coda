import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/** Whether an exported name is only a type, or (also) a runtime value. */
export type ExportKind = "type" | "value";

const EXPORT_DECLARATION =
  /^export\s+(?:declare\s+)?(async\s+function|function|const|let|var|class|enum|type|interface)\s+([A-Za-z_$][\w$]*)/gm;

/**
 * Collects the names a generated package exports, by scanning the
 * declarations in its `src/generated/` files. The renderer only ever exports
 * top-level declarations from those files (barrels only `export *` them), so
 * this is exhaustive for generated packages.
 */
export async function collectGeneratedExports(
  packageDir: string,
): Promise<Map<string, ExportKind>> {
  const generatedDir = join(packageDir, "src", "generated");
  const files = (await readdir(generatedDir, { recursive: true }))
    .filter((file) => file.endsWith(".ts") && !file.endsWith("index.ts"))
    .toSorted();

  const exports = new Map<string, ExportKind>();
  for (const file of files) {
    const code = await readFile(join(generatedDir, file), "utf-8");
    for (const match of code.matchAll(EXPORT_DECLARATION)) {
      const [, keyword, name] = match;
      if (keyword === undefined || name === undefined) {
        continue;
      }
      const kind: ExportKind =
        keyword === "type" || keyword === "interface" ? "type" : "value";
      if (exports.get(name) !== "value") {
        exports.set(name, kind);
      }
    }
  }
  return exports;
}

/** A program package bundled by an umbrella package. */
export interface BundleMember {
  program: string;
  packageName: string;
  exports: Map<string, ExportKind>;
}

/** How an umbrella package re-exports its members. */
export interface BundleExportPlan {
  /**
   * Names exported by more than one member, mapped to the member that wins
   * them (the first listed), with the kind of that member's export.
   */
  conflicts: Map<string, { winner: BundleMember; kind: ExportKind }>;
  /**
   * Members that lost at least one name, re-exported under a namespace named
   * after their program so that the shadowed exports remain reachable.
   */
  namespaced: BundleMember[];
}

/**
 * Plans the re-exports of an umbrella package.
 *
 * Every member is re-exported flat with `export *`, so an umbrella exposes the
 * same names the combined multi-program client did. Two `export *` of the same
 * name are ambiguous (and a TypeScript error), so each name exported by more
 * than one member is re-exported explicitly from the member listed first, and
 * every member that lost a name is additionally exported as a namespace.
 *
 * Throws if a namespace would collide with a flat export.
 */
export function planBundleExports(members: BundleMember[]): BundleExportPlan {
  const owners = new Map<string, BundleMember[]>();
  for (const member of members) {
    for (const name of member.exports.keys()) {
      owners.set(name, [...(owners.get(name) ?? []), member]);
    }
  }

  const conflicts = new Map<
    string,
    { winner: BundleMember; kind: ExportKind }
  >();
  const losers = new Set<BundleMember>();
  for (const [name, memberList] of [...owners].toSorted(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const [winner, ...rest] = memberList;
    if (winner === undefined || rest.length === 0) {
      continue;
    }
    conflicts.set(name, { winner, kind: winner.exports.get(name) ?? "value" });
    for (const loser of rest) {
      losers.add(loser);
    }
  }

  const namespaced = members.filter((member) => losers.has(member));
  for (const member of namespaced) {
    if (owners.has(member.program)) {
      throw new Error(
        `Cannot export program "${member.program}" as a namespace: a bundled package already exports that name`,
      );
    }
  }
  return { conflicts, namespaced };
}

/**
 * Renders the `src/index.ts` of an umbrella package.
 */
export function renderBundleIndex(
  header: string,
  members: BundleMember[],
  plan: BundleExportPlan,
): string {
  const lines = [
    header,
    "",
    ...members.map((member) => `export * from "${member.packageName}";`),
  ];

  if (plan.conflicts.size > 0) {
    lines.push(
      "",
      "// Names exported by more than one bundled program resolve to the program",
      "// with the highest precedence in the umbrella config.",
    );
    for (const member of members) {
      const won = [...plan.conflicts].filter(
        ([, conflict]) => conflict.winner === member,
      );
      const values = won
        .filter(([, conflict]) => conflict.kind === "value")
        .map(([name]) => name);
      const types = won
        .filter(([, conflict]) => conflict.kind === "type")
        .map(([name]) => name);
      if (values.length > 0) {
        lines.push(
          `export { ${values.join(", ")} } from "${member.packageName}";`,
        );
      }
      if (types.length > 0) {
        lines.push(
          `export type { ${types.join(", ")} } from "${member.packageName}";`,
        );
      }
    }
  }

  if (plan.namespaced.length > 0) {
    lines.push(
      "",
      "// Programs whose exports are shadowed above, in full under a namespace.",
      ...plan.namespaced.map(
        (member) =>
          `export * as ${member.program} from "${member.packageName}";`,
      ),
    );
  }
  return `${lines.join("\n")}\n`;
}
