import type { PackageRelease, ReleasePlan } from "./plan.ts";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function readOptional(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

const BUMP_HEADINGS: Record<string, string> = {
  major: "Major Changes",
  minor: "Minor Changes",
  patch: "Patch Changes",
  initial: "Changes",
};

/**
 * Renders the changelog section of a released package.
 */
export function renderChangelogEntry(
  release: PackageRelease,
  source: { repository: string; commit: string },
): string {
  const commitUrl = `https://github.com/${source.repository}/commit/${source.commit}`;
  const lines = [
    `## ${release.version}`,
    "",
    `### ${BUMP_HEADINGS[release.bump ?? "patch"] ?? "Changes"}`,
    "",
    `- Generated from [${source.repository}@${source.commit.slice(0, 7)}](${commitUrl}).`,
    ...(release.bump === "initial"
      ? ["- First release from the program megagraph."]
      : []),
    ...release.changes.map((change) => `- ${change.message}`),
  ];
  return `${lines.join("\n")}\n`;
}

/**
 * Prepends a section to a changesets-style changelog (`# <name>` followed by
 * `## <version>` sections), creating it if needed.
 */
export function prependChangelogEntry(
  changelog: string | null,
  name: string,
  entry: string,
): string {
  const title = `# ${name}`;
  if (changelog === null || changelog.trim() === "") {
    return `${title}\n\n${entry}`;
  }
  const trimmed = changelog.trimStart();
  if (trimmed.startsWith(title)) {
    const rest = trimmed.slice(title.length).trimStart();
    return `${title}\n\n${entry}\n${rest}`;
  }
  return `${title}\n\n${entry}\n${trimmed}`;
}

/**
 * Applies a release plan to the generated packages in `clientsDir`: writes
 * each package's release version into its manifest and brings its changelog
 * up to date, starting from the release state's changelog in `mirrorDir`
 * (or, for a new package, the seed changelog generated from programs/).
 */
export async function applyRelease(input: {
  plan: ReleasePlan;
  clientsDir: string;
  mirrorDir: string;
  source: { repository: string; commit: string };
}): Promise<void> {
  for (const release of input.plan.packages) {
    const packageDir = join(input.clientsDir, release.path);
    const manifestPath = join(packageDir, "package.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf-8")) as {
      version: string;
    };
    manifest.version = release.version;
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const changelogPath = join(packageDir, "CHANGELOG.md");
    const previous =
      release.previousVersion === null
        ? await readOptional(changelogPath)
        : await readOptional(
            join(input.mirrorDir, release.path, "CHANGELOG.md"),
          );
    const changelog =
      release.bump === null
        ? previous
        : prependChangelogEntry(
            previous,
            release.name,
            renderChangelogEntry(release, input.source),
          );
    if (changelog !== null) {
      await writeFile(changelogPath, changelog);
    }
  }
}
