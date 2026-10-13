import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  collectGeneratedExports,
  planBundleExports,
  renderBundleIndex,
} from "./bundle.ts";

const lending = {
  program: "kaminoLending",
  packageName: "@solana-programs/kamino-klend",
  exports: new Map([
    ["getUpdateGlobalConfigInstruction", "value" as const],
    ["UpdateGlobalConfigInput", "type" as const],
    ["fetchReserve", "value" as const],
  ]),
};
const farms = {
  program: "farms",
  packageName: "@solana-programs/kamino-farms",
  exports: new Map([
    ["getUpdateGlobalConfigInstruction", "value" as const],
    ["UpdateGlobalConfigInput", "type" as const],
    ["fetchFarmState", "value" as const],
  ]),
};

describe("collectGeneratedExports", () => {
  test("reads the declarations of every generated file but the barrels", async () => {
    const dir = await mkdtemp(join(tmpdir(), "megagraph-exports-"));
    const generated = join(dir, "src", "generated");
    await mkdir(join(generated, "types"), { recursive: true });
    await writeFile(
      join(generated, "types", "key.ts"),
      [
        "const KeyLookup = { 0: 'A', A: 0 } as const;",
        "export const Key = KeyLookup;",
        "export type Key = (typeof Key)[keyof typeof Key];",
        "export type KeyArgs = Key;",
        "export async function fetchKey() {}",
      ].join("\n"),
    );
    await writeFile(
      join(generated, "types", "index.ts"),
      "export * from './key.ts';\nexport const notScanned = 1;",
    );

    expect(await collectGeneratedExports(dir)).toEqual(
      new Map([
        ["Key", "value"],
        ["KeyArgs", "type"],
        ["fetchKey", "value"],
      ]),
    );
  });
});

describe("planBundleExports", () => {
  test("has nothing to resolve when members do not overlap", () => {
    const plan = planBundleExports([
      lending,
      { ...farms, exports: new Map([["fetchFarmState", "value"]]) },
    ]);
    expect(plan.conflicts.size).toBe(0);
    expect(plan.namespaced).toEqual([]);
  });

  test("resolves conflicts to the first member and namespaces the losers", () => {
    const plan = planBundleExports([lending, farms]);
    expect([...plan.conflicts.keys()]).toEqual([
      "getUpdateGlobalConfigInstruction",
      "UpdateGlobalConfigInput",
    ]);
    expect(plan.conflicts.get("UpdateGlobalConfigInput")).toEqual({
      winner: lending,
      kind: "type",
    });
    expect(plan.namespaced).toEqual([farms]);

    expect(renderBundleIndex("/** header */", [lending, farms], plan)).toBe(
      [
        "/** header */",
        "",
        'export * from "@solana-programs/kamino-klend";',
        'export * from "@solana-programs/kamino-farms";',
        "",
        "// Names exported by more than one bundled program resolve to the program",
        "// with the highest precedence in the umbrella config.",
        'export { getUpdateGlobalConfigInstruction } from "@solana-programs/kamino-klend";',
        'export type { UpdateGlobalConfigInput } from "@solana-programs/kamino-klend";',
        "",
        "// Programs whose exports are shadowed above, in full under a namespace.",
        'export * as farms from "@solana-programs/kamino-farms";',
        "",
      ].join("\n"),
    );
  });

  test("throws when a namespace would shadow a flat export", () => {
    const clash = {
      ...lending,
      exports: new Map([...lending.exports, ["farms", "value" as const]]),
    };
    expect(() => planBundleExports([clash, farms])).toThrow(
      /Cannot export program "farms" as a namespace/,
    );
  });
});
