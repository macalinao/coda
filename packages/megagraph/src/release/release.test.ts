import type { Megagraph } from "../build-graph.ts";
import type { ProgramNode } from "codama";
import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pdaNode, programNode, rootNode } from "codama";
import { writeMegagraph } from "../graph-files.ts";
import { applyRelease, prependChangelogEntry } from "./apply.ts";
import { diffManifest } from "./manifest.ts";
import { bumpVersion, planRelease } from "./plan.ts";

describe("bumpVersion", () => {
  test("0.x releases breaking changes as minor and everything else as patch", () => {
    expect(bumpVersion("0.8.1", "breaking")).toEqual({
      version: "0.9.0",
      bump: "minor",
    });
    expect(bumpVersion("0.8.1", "feature")).toEqual({
      version: "0.8.2",
      bump: "patch",
    });
    expect(bumpVersion("0.8.1", "fix")).toEqual({
      version: "0.8.2",
      bump: "patch",
    });
  });

  test(">= 1.0 follows semver", () => {
    expect(bumpVersion("1.2.3", "breaking").version).toBe("2.0.0");
    expect(bumpVersion("1.2.3", "feature").version).toBe("1.3.0");
    expect(bumpVersion("1.2.3", "fix").version).toBe("1.2.4");
  });
});

describe("diffManifest", () => {
  const base = {
    name: "@solana-programs/x",
    version: "0.1.0",
    description: "X",
    exports: { ".": "./dist/index.js" },
    peerDependencies: { "@solana/kit": "^7.0.0" },
  };
  const levels = (after: Record<string, unknown>) =>
    diffManifest(base, { ...base, ...after }).map((change) => change.level);

  test("ignores the version", () => {
    expect(diffManifest(base, { ...base, version: "9.9.9" })).toEqual([]);
  });

  test("widening a peer range is a fix, narrowing it or adding a peer is breaking", () => {
    expect(
      levels({ peerDependencies: { "@solana/kit": "^7.0.0 || ^8.0.0" } }),
    ).toEqual(["fix"]);
    expect(levels({ peerDependencies: { "@solana/kit": "^7.2.0" } })).toEqual([
      "breaking",
    ]);
    expect(
      levels({
        peerDependencies: {
          "@solana/kit": "^7.0.0",
          "@solana/web3.js": "^1.0.0",
        },
      }),
    ).toEqual(["breaking"]);
  });

  test("entry point changes are breaking, descriptive fields fixes, unknown fields breaking", () => {
    expect(levels({ exports: { ".": "./dist/main.js" } })).toEqual([
      "breaking",
    ]);
    expect(levels({ description: "Y" })).toEqual(["fix"]);
    expect(levels({ somethingNew: true })).toEqual(["breaking"]);
  });
});

describe("prependChangelogEntry", () => {
  test("inserts the entry below the title", () => {
    expect(
      prependChangelogEntry(
        "# @x/y\n\n## 0.1.0\n\n- old\n",
        "@x/y",
        "## 0.2.0\n\n- new\n",
      ),
    ).toBe("# @x/y\n\n## 0.2.0\n\n- new\n\n## 0.1.0\n\n- old\n");
    expect(prependChangelogEntry(null, "@x/y", "## 0.1.0\n")).toBe(
      "# @x/y\n\n## 0.1.0\n",
    );
  });
});

async function writeManifest(
  root: string,
  path: string,
  manifest: Record<string, unknown>,
): Promise<void> {
  await mkdir(join(root, path), { recursive: true });
  await writeFile(join(root, path, "package.json"), JSON.stringify(manifest));
}

function graph(programs: ProgramNode[]): Megagraph {
  const [first, ...rest] = programs;
  if (first === undefined) throw new Error("fixture");
  return {
    root: rootNode(first, rest),
    protocols: [],
    packages: [
      {
        program: "mintWrapper",
        protocol: "q",
        slug: "q/mint-wrapper",
        packageName: "@s/q-mint-wrapper",
        version: "0.1.0",
        dependencies: [],
      },
      {
        program: "mine",
        protocol: "q",
        slug: "q/mine",
        packageName: "@s/q-mine",
        version: "0.1.0",
        dependencies: ["mintWrapper"],
      },
      {
        program: "registry",
        protocol: "q",
        slug: "q/registry",
        packageName: "@s/q-registry",
        version: "0.1.0",
        dependencies: [],
      },
    ],
    externals: [],
    umbrellas: [
      {
        protocol: "q",
        packageName: "@s/q",
        version: "0.1.0",
        programs: ["mine", "mintWrapper", "registry"],
      },
    ],
  };
}

describe("planRelease and applyRelease", () => {
  test("classifies, propagates to dependents and umbrellas, and writes changelogs", async () => {
    const root = await mkdtemp(join(tmpdir(), "megagraph-release-"));
    const clients = join(root, "clients");
    const mirror = join(root, "mirror");
    const wrapper = (pdas: string[]) =>
      programNode({
        name: "mintWrapper",
        publicKey: "QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV",
        pdas: pdas.map((name) => pdaNode({ name, seeds: [] })),
      });
    const mine = programNode({
      name: "mine",
      publicKey: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
    });
    const registry = programNode({
      name: "registry",
      publicKey: "QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc",
    });

    await writeMegagraph(
      join(mirror, "graph"),
      graph([wrapper(["minter"]), mine, registry]),
    );
    const next = graph([wrapper(["minter", "mintWrapper"]), mine, registry]);
    const manifests: [string, Record<string, unknown>][] = [
      ["packages/q/mint-wrapper", { name: "@s/q-mint-wrapper" }],
      [
        "packages/q/mine",
        {
          name: "@s/q-mine",
          dependencies: { "@s/q-mint-wrapper": "workspace:^" },
        },
      ],
      ["packages/q/registry", { name: "@s/q-registry" }],
      [
        "packages/q",
        {
          name: "@s/q",
          dependencies: {
            "@s/q-mine": "workspace:^",
            "@s/q-mint-wrapper": "workspace:^",
            "@s/q-registry": "workspace:^",
          },
        },
      ],
    ];
    for (const [path, manifest] of manifests) {
      await writeManifest(mirror, path, { ...manifest, version: "1.2.0" });
      await writeManifest(clients, path, { ...manifest, version: "0.1.0" });
    }
    await writeFile(
      join(mirror, "packages/q/mine/CHANGELOG.md"),
      "# @s/q-mine\n\n## 1.2.0\n\n- Before\n",
    );

    const plan = await planRelease({
      megagraph: next,
      clientsDir: clients,
      mirrorDir: mirror,
    });
    const byName = Object.fromEntries(
      plan.packages.map((release) => [release.name, release]),
    );
    expect(byName["@s/q-mint-wrapper"]).toMatchObject({
      version: "1.3.0",
      bump: "minor",
      level: "feature",
    });
    expect(byName["@s/q-mine"]).toMatchObject({
      version: "1.2.1",
      bump: "patch",
      level: "fix",
    });
    expect(byName["@s/q-registry"]).toMatchObject({
      version: "1.2.0",
      bump: null,
      level: null,
    });
    expect(byName["@s/q"]).toMatchObject({
      version: "1.3.0",
      bump: "minor",
      level: "feature",
    });

    await applyRelease({
      plan,
      clientsDir: clients,
      mirrorDir: mirror,
      source: { repository: "macalinao/coda", commit: "0123456789abcdef" },
    });
    const mineManifest = JSON.parse(
      await readFile(join(clients, "packages/q/mine/package.json"), "utf-8"),
    ) as { version: string };
    expect(mineManifest.version).toBe("1.2.1");
    const registryManifest = JSON.parse(
      await readFile(
        join(clients, "packages/q/registry/package.json"),
        "utf-8",
      ),
    ) as { version: string };
    expect(registryManifest.version).toBe("1.2.0");
    expect(
      await readFile(join(clients, "packages/q/mine/CHANGELOG.md"), "utf-8"),
    ).toBe(
      [
        "# @s/q-mine",
        "",
        "## 1.2.1",
        "",
        "### Patch Changes",
        "",
        "- Generated from [macalinao/coda@0123456](https://github.com/macalinao/coda/commit/0123456789abcdef).",
        "- Updated dependency `@s/q-mint-wrapper`",
        "",
        "## 1.2.0",
        "",
        "- Before",
        "",
      ].join("\n"),
    );
  });

  test("an empty release state makes every package new", async () => {
    const root = await mkdtemp(join(tmpdir(), "megagraph-release-"));
    const clients = join(root, "clients");
    await writeManifest(clients, "packages/q/mint-wrapper", {
      name: "@s/q-mint-wrapper",
      version: "0.1.0",
    });
    await writeManifest(clients, "packages/q/mine", {
      name: "@s/q-mine",
      version: "0.1.0",
    });
    await writeManifest(clients, "packages/q/registry", {
      name: "@s/q-registry",
      version: "0.1.0",
    });
    await writeManifest(clients, "packages/q", {
      name: "@s/q",
      version: "0.4.0",
    });
    const plan = await planRelease({
      megagraph: graph([programNode({ name: "mintWrapper", publicKey: "x" })]),
      clientsDir: clients,
      mirrorDir: join(root, "empty-mirror"),
    });
    expect(
      plan.packages.map((release) => [
        release.name,
        release.bump,
        release.version,
      ]),
    ).toEqual([
      ["@s/q", "initial", "0.4.0"],
      ["@s/q-mine", "initial", "0.1.0"],
      ["@s/q-mint-wrapper", "initial", "0.1.0"],
      ["@s/q-registry", "initial", "0.1.0"],
    ]);
  });
});
