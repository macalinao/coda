import type { ProgramNode } from "codama";
import type { Megagraph } from "../build-graph.ts";
import type { Change, ChangeLevel } from "./classify.ts";
import type { Manifest } from "./manifest.ts";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import semver from "semver";
import { readMegagraph } from "../graph-files.ts";
import {
  getProgramPackagePath,
  getUmbrellaPackagePath,
} from "../load-programs.ts";
import { diffProgram, maxLevel } from "./classify.ts";
import { replaceSourceSection, SOURCE_SECTION_START } from "../templates.ts";
import { diffManifest } from "./manifest.ts";

/** How a package's version moves in a release. */
export type Bump = "major" | "minor" | "patch" | "initial";

/** The release of one package. */
export interface PackageRelease {
  name: string;
  /** Directory relative to the workspace root, e.g. `packages/quarry/mine`. */
  path: string;
  kind: "program" | "umbrella";
  /** Version in the release state (the mirror), or `null` for a new package. */
  previousVersion: string | null;
  /** Version after the release. */
  version: string;
  /** `null` when the package does not change. */
  bump: Bump | null;
  level: ChangeLevel | null;
  changes: Change[];
}

/** A release of every generated package against the previous release state. */
export interface ReleasePlan {
  packages: PackageRelease[];
}

/** Files that the release manages or that are not part of the package. */
const IGNORED_FILES = new Set([
  "package.json",
  "CHANGELOG.md",
  "node_modules",
  "dist",
  ".turbo",
  "tsconfig.tsbuildinfo",
]);

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, "utf-8")) as T;
  } catch {
    return null;
  }
}

/**
 * Reads the files of a package, keyed by path, skipping the manifest, the
 * changelog, build output and nested packages (umbrellas contain members).
 */
async function readPackageFiles(
  dir: string,
  root: string = dir,
): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (IGNORED_FILES.has(entry.name)) {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if ((await readJson(join(path, "package.json"))) !== null) {
        continue;
      }
      for (const [file, content] of await readPackageFiles(path, root)) {
        files.set(file, content);
      }
    } else {
      const content = await readFile(path, "utf-8");
      // The README's source links name the released version, so they differ
      // between a fresh generation and the release state by design.
      files.set(
        relative(root, path),
        entry.name === "README.md"
          ? replaceSourceSection(content, SOURCE_SECTION_START)
          : content,
      );
    }
  }
  return files;
}

function filesDiffer(a: Map<string, string>, b: Map<string, string>): boolean {
  if (a.size !== b.size) {
    return true;
  }
  for (const [file, content] of a) {
    if (b.get(file) !== content) {
      return true;
    }
  }
  return false;
}

/** Applies a change level to a version: 0.x keeps breaking changes in minor. */
export function bumpVersion(
  version: string,
  level: ChangeLevel,
): { version: string; bump: Exclude<Bump, "initial"> } {
  const major = semver.major(version);
  const bump: Exclude<Bump, "initial"> =
    major === 0
      ? level === "breaking"
        ? "minor"
        : "patch"
      : level === "breaking"
        ? "major"
        : level === "feature"
          ? "minor"
          : "patch";
  const next = semver.inc(version, bump);
  if (next === null) {
    throw new Error(`Cannot bump version ${version}`);
  }
  return { version: next, bump };
}

/** Every program of a root; roots read from JSON may omit `additionalPrograms`. */
function allPrograms(root: Megagraph["root"]): ProgramNode[] {
  return [root.program, ...(root.additionalPrograms ?? [])];
}

interface PlannedPackage {
  release: PackageRelease;
  /** Names of the packages this one depends on (members for umbrellas). */
  dependencies: string[];
}

/**
 * Plans a release of the packages generated into `clientsDir` against the
 * release state in `mirrorDir` (the previous graph, manifests and
 * changelogs). A missing or empty mirror makes every package new.
 */
export async function planRelease(input: {
  megagraph: Megagraph;
  clientsDir: string;
  mirrorDir: string;
}): Promise<ReleasePlan> {
  const { megagraph, clientsDir, mirrorDir } = input;

  let previousGraph: Megagraph | null = null;
  try {
    previousGraph = await readMegagraph(join(mirrorDir, "graph"));
  } catch {
    previousGraph = null;
  }
  const previousPrograms = new Map<string, unknown>();
  if (previousGraph !== null) {
    const nodes = new Map(
      allPrograms(previousGraph.root).map((program) => [
        program.name as string,
        program,
      ]),
    );
    for (const entry of previousGraph.packages) {
      previousPrograms.set(entry.packageName, nodes.get(entry.program));
    }
  }
  const newPrograms = new Map(
    allPrograms(megagraph.root).map((program) => [
      program.name as string,
      program,
    ]),
  );

  const planned = new Map<string, PlannedPackage>();
  const describePackage = async (
    name: string,
    path: string,
    kind: "program" | "umbrella",
    programChanges: () => Change[],
    releaseNotes: string[] = [],
  ): Promise<PlannedPackage> => {
    const manifest = await readJson<Manifest>(
      join(clientsDir, path, "package.json"),
    );
    if (manifest === null) {
      throw new Error(
        `${name}: missing ${path}/package.json; run codegen first`,
      );
    }
    const previous = await readJson<Manifest>(
      join(mirrorDir, path, "package.json"),
    );
    const dependencies = Object.keys(manifest.dependencies ?? {}).filter(
      (dependency) =>
        manifest.dependencies?.[dependency]?.startsWith("workspace:"),
    );
    if (previous === null) {
      return {
        dependencies,
        release: {
          name,
          path,
          kind,
          previousVersion: null,
          version: manifest.version,
          bump: "initial",
          level: null,
          changes: releaseNotes.map((message) => ({ level: "fix", message })),
        },
      };
    }
    const changes = [...programChanges(), ...diffManifest(previous, manifest)];
    if (kind === "umbrella") {
      // Dropping a member drops everything the umbrella re-exported from it.
      for (const member of Object.keys(previous.dependencies ?? {})) {
        if (!(member in (manifest.dependencies ?? {}))) {
          changes.push({
            level: "breaking",
            message: `Removed member \`${member}\``,
          });
        }
      }
    }
    if (changes.length === 0) {
      const differs = filesDiffer(
        await readPackageFiles(join(clientsDir, path)),
        await readPackageFiles(join(mirrorDir, path)),
      );
      if (differs) {
        changes.push({ level: "fix", message: "Regenerated code changed" });
      }
    }
    return {
      dependencies,
      release: {
        name,
        path,
        kind,
        previousVersion: previous.version,
        version: previous.version,
        bump: null,
        level: maxLevel(changes.map((change) => change.level)),
        changes,
      },
    };
  };

  for (const entry of megagraph.packages) {
    planned.set(
      entry.packageName,
      await describePackage(
        entry.packageName,
        getProgramPackagePath(entry),
        "program",
        () => {
          const before = previousPrograms.get(entry.packageName);
          if (before === undefined) {
            return previousGraph === null
              ? []
              : [
                  {
                    level: "breaking",
                    message:
                      "The previous release has no graph for this package",
                  },
                ];
          }
          return diffProgram(before, newPrograms.get(entry.program));
        },
        entry.releaseNotes,
      ),
    );
  }
  for (const umbrella of megagraph.umbrellas) {
    planned.set(
      umbrella.packageName,
      await describePackage(
        umbrella.packageName,
        getUmbrellaPackagePath(umbrella.protocol),
        "umbrella",
        () => [],
        umbrella.releaseNotes,
      ),
    );
  }

  // Propagate: a package whose dependency (or member) moves to a new version
  // gets at least a patch, since its published dependency range changes; an
  // umbrella takes the most severe level of its members.
  let changed = true;
  while (changed) {
    changed = false;
    for (const { release, dependencies } of planned.values()) {
      if (release.bump === "initial") {
        continue;
      }
      const levels: (ChangeLevel | null)[] = [release.level];
      for (const dependency of dependencies) {
        const target = planned.get(dependency)?.release;
        if (target === undefined) {
          continue;
        }
        const moves = target.bump !== null || target.level !== null;
        if (moves) {
          const message = `Updated dependency \`${dependency}\``;
          if (!release.changes.some((change) => change.message === message)) {
            release.changes.push({ level: "fix", message });
          }
          levels.push("fix");
        }
        if (release.kind === "umbrella") {
          // A new member only adds exports.
          levels.push(target.bump === "initial" ? "feature" : target.level);
        }
      }
      const level = maxLevel(levels);
      if (level !== release.level) {
        release.level = level;
        changed = true;
      }
    }
  }

  for (const { release } of planned.values()) {
    if (release.bump === "initial" || release.level === null) {
      continue;
    }
    if (release.previousVersion === null) {
      continue;
    }
    const { version, bump } = bumpVersion(
      release.previousVersion,
      release.level,
    );
    release.version = version;
    release.bump = bump;
  }

  return {
    packages: [...planned.values()]
      .map(({ release }) => release)
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  };
}

/** The packages a plan releases (new or bumped). */
export function getReleasedPackages(plan: ReleasePlan): PackageRelease[] {
  return plan.packages.filter((release) => release.bump !== null);
}

/**
 * Renders a plan as Markdown, e.g. for `$GITHUB_STEP_SUMMARY`.
 */
export function renderPlanMarkdown(
  plan: ReleasePlan,
  options: { title?: string; maxChangesPerPackage?: number } = {},
): string {
  const released = getReleasedPackages(plan);
  const lines = [`## ${options.title ?? "Release plan"}`, ""];
  if (released.length === 0) {
    lines.push("No package changes.");
    return `${lines.join("\n")}\n`;
  }
  lines.push("| Package | From | To | Bump |", "| --- | --- | --- | --- |");
  for (const release of released) {
    lines.push(
      `| \`${release.name}\` | ${release.previousVersion ?? "(new)"} | ${release.version} | ${release.bump ?? ""}${release.level ? ` (${release.level})` : ""} |`,
    );
  }
  const max = options.maxChangesPerPackage ?? 30;
  for (const release of released) {
    if (release.changes.length === 0) {
      continue;
    }
    lines.push(
      "",
      `<details><summary><code>${release.name}</code>: ${release.changes.length.toString()} change(s)</summary>`,
      "",
    );
    for (const change of release.changes.slice(0, max)) {
      lines.push(
        release.bump === "initial"
          ? `- ${change.message}`
          : `- **${change.level}**: ${change.message}`,
      );
    }
    if (release.changes.length > max) {
      lines.push(`- ... and ${(release.changes.length - max).toString()} more`);
    }
    lines.push("", "</details>");
  }
  return `${lines.join("\n")}\n`;
}
