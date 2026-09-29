import type { Change } from "./classify.ts";
import semver from "semver";

/** A package.json, as far as release planning is concerned. */
export type Manifest = Record<string, unknown> & {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/** Fields that change what consumers import or install. */
const INTERFACE_FIELDS = new Set([
  "exports",
  "main",
  "module",
  "types",
  "type",
  "sideEffects",
  "files",
  "bin",
  "engines",
]);

/** Fields that only describe the package. */
const METADATA_FIELDS = new Set([
  "description",
  "keywords",
  "homepage",
  "author",
  "license",
  "repository",
  "publishConfig",
  "scripts",
  "devDependencies",
]);

/** Fields compared separately, or that the release itself sets. */
const HANDLED_FIELDS = new Set([
  "name",
  "version",
  "dependencies",
  "peerDependencies",
]);

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Whether every version `before` accepts is also accepted by `after`. */
function isWidening(before: string, after: string): boolean {
  try {
    return semver.subset(before, after);
  } catch {
    return false;
  }
}

/**
 * Lists the changes between two versions of a generated package's manifest.
 *
 * Peer dependencies: a new peer, or a narrower range, is breaking; a wider
 * range, or a removed peer, is a fix. Dependencies (the linked program
 * packages) are fixes; their version changes propagate separately. Entry
 * points and module format changes are breaking, descriptive fields are
 * fixes, and any other change is breaking.
 */
export function diffManifest(before: Manifest, after: Manifest): Change[] {
  const changes: Change[] = [];

  const beforePeers = before.peerDependencies ?? {};
  const afterPeers = after.peerDependencies ?? {};
  for (const [name, range] of Object.entries(afterPeers)) {
    const previous = beforePeers[name];
    if (previous === undefined) {
      changes.push({
        level: "breaking",
        message: `Added peer dependency \`${name}@${range}\``,
      });
    } else if (previous !== range) {
      changes.push(
        isWidening(previous, range)
          ? {
              level: "fix",
              message: `Widened peer dependency \`${name}\` to \`${range}\``,
            }
          : {
              level: "breaking",
              message: `Changed peer dependency \`${name}\` from \`${previous}\` to \`${range}\``,
            },
      );
    }
  }
  for (const name of Object.keys(beforePeers)) {
    if (!(name in afterPeers)) {
      changes.push({
        level: "fix",
        message: `Removed peer dependency \`${name}\``,
      });
    }
  }

  const beforeDependencies = before.dependencies ?? {};
  const afterDependencies = after.dependencies ?? {};
  for (const name of Object.keys(afterDependencies)) {
    if (!(name in beforeDependencies)) {
      changes.push({ level: "fix", message: `Added dependency \`${name}\`` });
    } else if (beforeDependencies[name] !== afterDependencies[name]) {
      changes.push({
        level: "fix",
        message: `Changed the range of dependency \`${name}\``,
      });
    }
  }
  for (const name of Object.keys(beforeDependencies)) {
    if (!(name in afterDependencies)) {
      changes.push({ level: "fix", message: `Removed dependency \`${name}\`` });
    }
  }

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const key of [...keys].toSorted()) {
    if (HANDLED_FIELDS.has(key) || same(before[key], after[key])) {
      continue;
    }
    if (METADATA_FIELDS.has(key)) {
      changes.push({
        level: "fix",
        message: `Updated package.json \`${key}\``,
      });
    } else if (INTERFACE_FIELDS.has(key)) {
      changes.push({
        level: "breaking",
        message: `Changed package.json \`${key}\``,
      });
    } else {
      changes.push({
        level: "breaking",
        message: `Changed package.json \`${key}\` (unrecognised field)`,
      });
    }
  }
  return changes;
}
