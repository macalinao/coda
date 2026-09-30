/**
 * Classifies the difference between two versions of a program node for
 * release versioning.
 *
 * - breaking: anything removed, renamed (a removal plus an addition),
 *   reordered or changed in an instruction, account, type, PDA, error, field,
 *   argument, seed or discriminator; an instruction account that became
 *   required; any change this module does not recognise.
 * - feature: new instructions, accounts, types, PDAs, errors, constants and
 *   events; enum variants appended at the end; optional instruction accounts
 *   appended at the end; an instruction account that became optional or
 *   gained a default value.
 * - fix: documentation-only changes, and program metadata (`version`,
 *   `origin`).
 */

/** How much a change affects consumers of the generated package. */
export type ChangeLevel = "breaking" | "feature" | "fix";

export interface Change {
  level: ChangeLevel;
  message: string;
}

const LEVEL_RANK: Record<ChangeLevel, number> = {
  fix: 1,
  feature: 2,
  breaking: 3,
};

/** The most severe level among `changes`, or `null` when there are none. */
export function maxLevel(
  levels: Iterable<ChangeLevel | null>,
): ChangeLevel | null {
  let max: ChangeLevel | null = null;
  for (const level of levels) {
    if (
      level !== null &&
      (max === null || LEVEL_RANK[level] > LEVEL_RANK[max])
    ) {
      max = level;
    }
  }
  return max;
}

/** Program-level lists whose order does not matter. */
const UNORDERED_PROGRAM_LISTS = new Set([
  "accounts",
  "instructions",
  "definedTypes",
  "pdas",
  "errors",
  "constants",
  "events",
]);

/** Program-level keys that are metadata rather than interface. */
const PROGRAM_METADATA_KEYS = new Set(["version", "origin"]);

const KIND_LABELS: Record<string, string> = {
  accountNode: "account",
  constantNode: "constant",
  definedTypeNode: "type",
  enumEmptyVariantTypeNode: "variant",
  enumStructVariantTypeNode: "variant",
  enumTupleVariantTypeNode: "variant",
  errorNode: "error",
  eventNode: "event",
  instructionAccountNode: "account",
  instructionArgumentNode: "argument",
  instructionNode: "instruction",
  instructionRemainingAccountsNode: "remaining accounts",
  pdaNode: "PDA",
  programNode: "program",
  structFieldTypeNode: "field",
  variablePdaSeedNode: "seed",
};

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

interface Frame {
  label: string;
  name: string;
}

function isObject(value: Json | undefined): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNamed(
  value: Json | undefined,
): value is JsonObject & { name: string } {
  return isObject(value) && typeof value.name === "string";
}

function frameOf(node: JsonObject): Frame | null {
  if (typeof node.name !== "string" || typeof node.kind !== "string") {
    return null;
  }
  return { label: KIND_LABELS[node.kind] ?? node.kind, name: node.name };
}

/** e.g. "field `amount` of type `Miner`" */
function describe(frames: Frame[]): string {
  return frames
    .toReversed()
    .map((frame) => `${frame.label} \`${frame.name}\``)
    .join(" of ");
}

function deepEqual(a: Json | undefined, b: Json | undefined): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Whether two values only differ in their `docs`. */
function withoutDocs(value: Json | undefined): Json | undefined {
  if (Array.isArray(value)) {
    return value.map((item) => withoutDocs(item) ?? null);
  }
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "docs")
        .map(([key, item]) => [key, withoutDocs(item) ?? null]),
    );
  }
  return value;
}

class Differ {
  readonly changes: Change[] = [];

  add(level: ChangeLevel, message: string): void {
    if (!this.changes.some((change) => change.message === message)) {
      this.changes.push({ level, message });
    }
  }

  node(before: JsonObject, after: JsonObject, frames: Frame[]): void {
    if (before.kind !== after.kind) {
      this.add("breaking", `Changed ${describe(frames) || "program"}`);
      return;
    }
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of [...keys].toSorted()) {
      this.key(before, after, key, frames);
    }
  }

  key(
    before: JsonObject,
    after: JsonObject,
    key: string,
    frames: Frame[],
  ): void {
    const a = before[key];
    const b = after[key];
    if (deepEqual(a, b)) {
      return;
    }
    const where = describe(frames) || "the program";
    if (key === "docs") {
      this.add("fix", `Updated docs of ${where}`);
      return;
    }
    if (before.kind === "programNode" && PROGRAM_METADATA_KEYS.has(key)) {
      this.add("fix", `Updated program ${key}`);
      return;
    }
    if (before.kind === "instructionAccountNode") {
      if (key === "isOptional") {
        this.add(
          b === true ? "feature" : "breaking",
          b === true ? `Made ${where} optional` : `Made ${where} required`,
        );
        return;
      }
      if (key === "defaultValue") {
        if (a === undefined || a === null) {
          this.add("feature", `Added a default value for ${where}`);
        } else if (b === undefined || b === null) {
          this.add("breaking", `Removed the default value of ${where}`);
        } else if (deepEqual(withoutDocs(a), withoutDocs(b))) {
          this.add("fix", `Updated docs of the default value of ${where}`);
        } else {
          this.add("breaking", `Changed the default value of ${where}`);
        }
        return;
      }
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      const unordered =
        before.kind === "programNode" && UNORDERED_PROGRAM_LISTS.has(key);
      this.list(a, b, key, frames, before.kind === "programNode", unordered);
      return;
    }
    if (isObject(a) && isObject(b)) {
      const frame = frameOf(b);
      this.node(a, b, frame ? [...frames, frame] : frames);
      return;
    }
    if (deepEqual(withoutDocs(a), withoutDocs(b))) {
      this.add("fix", `Updated docs of ${where}`);
      return;
    }
    this.add("breaking", `Changed ${key} of ${where}`);
  }

  list(
    before: Json[],
    after: Json[],
    key: string,
    frames: Frame[],
    topLevel: boolean,
    unordered: boolean,
  ): void {
    const where = describe(frames) || "the program";
    if (!before.every(isNamed) || !after.every(isNamed)) {
      if (before.length !== after.length) {
        this.add("breaking", `Changed ${key} of ${where}`);
        return;
      }
      before.forEach((item, index) => {
        const next = after[index];
        if (isObject(item) && isObject(next)) {
          const frame = frameOf(next);
          this.node(item, next, frame ? [...frames, frame] : frames);
        } else if (!deepEqual(item, next)) {
          this.add("breaking", `Changed ${key} of ${where}`);
        }
      });
      return;
    }

    const beforeNames = before.map((item) => item.name);
    const afterNames = after.map((item) => item.name);
    const byName = new Map(before.map((item) => [item.name, item]));
    const nested = (item: JsonObject & { name: string }) => {
      const frame = frameOf(item);
      const label = frame ? describe([...frames, frame]) : `\`${item.name}\``;
      return topLevel && frame ? `${frame.label} \`${item.name}\`` : label;
    };

    for (const item of before) {
      if (!afterNames.includes(item.name)) {
        this.add("breaking", `Removed ${nested(item)}`);
      }
    }
    for (const [index, item] of after.entries()) {
      if (byName.has(item.name)) {
        continue;
      }
      const appended =
        index >= before.length &&
        after
          .slice(0, before.length)
          .every(
            (existing, position) => existing.name === beforeNames[position],
          );
      const isVariant =
        typeof item.kind === "string" && item.kind.startsWith("enum");
      const isOptionalAccount =
        item.kind === "instructionAccountNode" && item.isOptional === true;
      const level: ChangeLevel =
        unordered || (appended && (isVariant || isOptionalAccount))
          ? "feature"
          : "breaking";
      this.add(level, `Added ${nested(item)}`);
    }

    if (!unordered) {
      const common = afterNames.filter((name) => beforeNames.includes(name));
      const previousOrder = beforeNames.filter((name) => common.includes(name));
      if (!deepEqual(common, previousOrder)) {
        this.add("breaking", `Reordered ${key} of ${where}`);
      }
    }

    for (const item of after) {
      const previous = byName.get(item.name);
      if (previous !== undefined) {
        const frame = frameOf(item);
        this.node(previous, item, frame ? [...frames, frame] : frames);
      }
    }
  }
}

/**
 * Lists the changes between two versions of a program node (as JSON).
 */
export function diffProgram(before: unknown, after: unknown): Change[] {
  const differ = new Differ();
  if (!isObject(before as Json) || !isObject(after as Json)) {
    throw new Error("diffProgram expects two program nodes");
  }
  differ.node(before as JsonObject, after as JsonObject, []);
  return differ.changes;
}
