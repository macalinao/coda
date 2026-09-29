import type { ProgramNode, RootNode } from "codama";
import type { BundlePackage, ProgramPackage } from "./build-graph.ts";
import type { BundleMember } from "./bundle.ts";
import type { BundleConfig } from "./define-program.ts";
import type { ProgramSource } from "./load-programs.ts";
import type { PackageDependency } from "./templates.ts";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderESMTypeScriptVisitor } from "@macalinao/codama-renderers-js-esm";
import { renderMarkdownVisitor } from "@macalinao/codama-renderers-markdown";
import { getAllPrograms, rootNode, visit } from "codama";
import {
  collectGeneratedExports,
  planBundleExports,
  renderBundleIndex,
} from "./bundle.ts";
import { getTransitiveDependencies } from "./package-graph.ts";
import {
  renderBundleReadme,
  renderEntryBarrel,
  renderEntryHeader,
  renderPackageJson,
  renderReadme,
  renderTsconfig,
} from "./templates.ts";

/** Files and directories in a client package that are not generated. */
const PRESERVED_ENTRIES = new Set([
  "CHANGELOG.md",
  "dist",
  "node_modules",
  ".turbo",
]);

async function readOptional(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

async function readExistingVersion(
  packageDir: string,
): Promise<string | undefined> {
  const packageJson = await readOptional(join(packageDir, "package.json"));
  if (packageJson === null) {
    return undefined;
  }
  return (JSON.parse(packageJson) as { version?: string }).version;
}

/**
 * Deletes everything in a package directory but the preserved entries, so
 * files that are no longer generated (and stale dependencies) disappear.
 */
async function resetPackageDir(packageDir: string): Promise<void> {
  await mkdir(packageDir, { recursive: true });
  for (const existing of await readdir(packageDir)) {
    if (!PRESERVED_ENTRIES.has(existing)) {
      await rm(join(packageDir, existing), { recursive: true, force: true });
    }
  }
}

/** The kebab-case file name the markdown renderer uses for a program. */
function getDocsFileName(program: ProgramNode): string {
  const kebab = program.name
    .replaceAll(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
  return `${kebab}.md`;
}

export interface GeneratePackagesInput {
  root: RootNode;
  packages: ProgramPackage[];
  bundles: BundlePackage[];
  sources: ProgramSource[];
  bundleConfigs: BundleConfig[];
  clientsDir: string;
}

/**
 * Generates every client package from the megagraph, and deletes client
 * directories that no longer correspond to a program.
 *
 * @returns The absolute paths of the generated package directories.
 */
export async function generatePackages(
  input: GeneratePackagesInput,
): Promise<string[]> {
  const programsByName = new Map<string, ProgramNode>(
    getAllPrograms(input.root).map((program) => [program.name, program]),
  );
  const packagesByProgram = new Map(
    input.packages.map((entry) => [entry.program, entry]),
  );
  const sourcesBySlug = new Map(
    input.sources.map((source) => [source.slug, source]),
  );
  const dependencyGraph = new Map(
    input.packages.map((entry) => [entry.program, entry.dependencies]),
  );

  const expectedSlugs = new Set([
    ...input.packages.map((entry) => entry.slug),
    ...input.bundles.map((entry) => entry.slug),
  ]);
  const sourceSlugs = new Set([
    ...sourcesBySlug.keys(),
    ...input.bundleConfigs.map((bundle) => bundle.slug),
  ]);
  if (
    expectedSlugs.size !== sourceSlugs.size ||
    [...expectedSlugs].some((slug) => !sourceSlugs.has(slug))
  ) {
    throw new Error(
      "graph/packages.json is out of date with programs/. Run `bun run graph` first.",
    );
  }

  // Remove client packages whose program no longer exists.
  await mkdir(input.clientsDir, { recursive: true });
  for (const entry of await readdir(input.clientsDir, {
    withFileTypes: true,
  })) {
    if (entry.isDirectory() && !expectedSlugs.has(entry.name)) {
      console.log(`Removing stale package clients/${entry.name}`);
      await rm(join(input.clientsDir, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }

  const generated: string[] = [];
  for (const entry of input.packages) {
    const program = programsByName.get(entry.program);
    const source = sourcesBySlug.get(entry.slug);
    if (program === undefined || source === undefined) {
      throw new Error(`Program "${entry.program}" is missing from the graph`);
    }

    const dependencies: PackageDependency[] = entry.dependencies.map((name) => {
      const dependency = packagesByProgram.get(name);
      if (dependency === undefined) {
        throw new Error(
          `Program "${entry.program}" links to unknown program "${name}"`,
        );
      }
      return { program: name, packageName: dependency.packageName };
    });

    // The renderer needs every program reachable through links, since a
    // linked node's own links must resolve too (e.g. to size a linked type).
    const closure = getTransitiveDependencies(dependencyGraph, entry.program);
    const externalPrograms = closure.map((name) => {
      const external = programsByName.get(name);
      if (external === undefined) {
        throw new Error(`Program "${name}" is missing from the graph`);
      }
      return external;
    });
    const renderRoot = rootNode(program, externalPrograms);
    const externalModules = Object.fromEntries(
      closure.map((name) => [
        name,
        packagesByProgram.get(name)?.packageName ?? name,
      ]),
    );

    const packageDir = join(input.clientsDir, entry.slug);
    const version =
      (await readExistingVersion(packageDir)) ??
      source.config.package.initialVersion ??
      "0.0.0";
    const templateInput = {
      slug: entry.slug,
      version,
      package: source.config.package,
      dependencies,
    };

    await resetPackageDir(packageDir);

    visit(
      renderRoot,
      renderESMTypeScriptVisitor(join(packageDir, "src", "generated"), {
        externalPrograms: externalModules,
      }),
    );

    const docsDir = join(packageDir, "docs");
    const docsFile = getDocsFileName(program);
    await visit(
      renderRoot,
      renderMarkdownVisitor(docsDir, { npmPackageName: entry.packageName }),
    );
    for (const file of await readdir(docsDir)) {
      if (file !== docsFile) {
        await rm(join(docsDir, file));
      }
    }

    const readmeBody = await readOptional(join(source.dir, "README.md"));
    await writeFile(
      join(packageDir, "package.json"),
      renderPackageJson(templateInput),
    );
    await writeFile(join(packageDir, "tsconfig.json"), renderTsconfig());
    await writeFile(
      join(packageDir, "src", "index.ts"),
      renderEntryBarrel(templateInput),
    );
    await writeFile(
      join(packageDir, "README.md"),
      renderReadme(templateInput, program, `docs/${docsFile}`, readmeBody),
    );

    console.log(
      `Generated ${entry.packageName} (clients/${entry.slug})${
        dependencies.length > 0
          ? ` -> ${dependencies.map((d) => d.packageName).join(", ")}`
          : ""
      }`,
    );
    generated.push(packageDir);
  }

  for (const entry of input.bundles) {
    const config = input.bundleConfigs.find(
      (bundle) => bundle.slug === entry.slug,
    );
    if (config === undefined) {
      throw new Error(`Bundle "${entry.slug}" is missing from programs/`);
    }
    generated.push(
      await generateBundle(entry, config, packagesByProgram, input.clientsDir),
    );
  }
  return generated;
}

/**
 * Generates an umbrella package that re-exports its bundled program packages.
 * Must run after the bundled packages are generated, since it scans their
 * exports for conflicts.
 */
async function generateBundle(
  entry: BundlePackage,
  config: BundleConfig,
  packagesByProgram: Map<string, ProgramPackage>,
  clientsDir: string,
): Promise<string> {
  const members: BundleMember[] = [];
  for (const program of entry.programs) {
    const member = packagesByProgram.get(program);
    if (member === undefined) {
      throw new Error(
        `Bundle "${entry.slug}" references unknown program "${program}"`,
      );
    }
    members.push({
      program,
      packageName: member.packageName,
      exports: await collectGeneratedExports(join(clientsDir, member.slug)),
    });
  }
  const plan = planBundleExports(members);

  const packageDir = join(clientsDir, entry.slug);
  const version =
    (await readExistingVersion(packageDir)) ??
    config.package.initialVersion ??
    "0.0.0";
  const templateInput = {
    slug: entry.slug,
    version,
    package: config.package,
    dependencies: members.map(({ program, packageName }) => ({
      program,
      packageName,
    })),
  };

  await resetPackageDir(packageDir);
  await mkdir(join(packageDir, "src"), { recursive: true });
  await writeFile(
    join(packageDir, "package.json"),
    renderPackageJson(templateInput),
  );
  await writeFile(join(packageDir, "tsconfig.json"), renderTsconfig());
  await writeFile(
    join(packageDir, "src", "index.ts"),
    renderBundleIndex(
      renderEntryHeader(templateInput, "programs/bundles.ts"),
      members,
      plan,
    ),
  );
  await writeFile(
    join(packageDir, "README.md"),
    renderBundleReadme(
      templateInput,
      [...plan.conflicts.keys()],
      plan.namespaced.map(({ program, packageName }) => ({
        program,
        packageName,
      })),
    ),
  );

  console.log(
    `Generated bundle ${entry.packageName} (clients/${entry.slug}) = ${members
      .map((member) => member.packageName)
      .join(" + ")}${
      plan.conflicts.size > 0
        ? ` (${plan.conflicts.size.toString()} conflicting name(s))`
        : ""
    }`,
  );
  return packageDir;
}
