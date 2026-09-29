import type { ProgramNode } from "codama";
import type { Megagraph, UmbrellaPackage } from "./build-graph.ts";
import type { BundleMember } from "./bundle.ts";
import type { ProgramSource, ProtocolSource } from "./load-programs.ts";
import type { PackageDependency, PackageTemplateInput } from "./templates.ts";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { join, relative } from "node:path";
import { renderESMTypeScriptVisitor } from "@macalinao/codama-renderers-js-esm";
import { renderMarkdownVisitor } from "@macalinao/codama-renderers-markdown";
import { getAllPrograms, rootNode, visit } from "codama";
import {
  collectGeneratedExports,
  planBundleExports,
  renderBundleIndex,
} from "./bundle.ts";
import {
  getProgramPackagePath,
  getUmbrellaPackagePath,
} from "./load-programs.ts";
import { getTransitiveDependencies } from "./package-graph.ts";
import {
  renderEntryBarrel,
  renderEntryHeader,
  renderPackageJson,
  renderReadme,
  renderTsconfig,
  renderUmbrellaReadme,
} from "./templates.ts";

/** Seed changelog a program or protocol directory may carry. */
const CHANGELOG_FILE = "CHANGELOG.md";

async function readOptional(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

async function copyOptional(from: string, to: string): Promise<void> {
  if ((await readOptional(from)) !== null) {
    await copyFile(from, to);
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
  megagraph: Megagraph;
  programs: ProgramSource[];
  protocols: ProtocolSource[];
  /** Directory holding `programs/`; used for source paths in manifests. */
  repoRoot: string;
  /**
   * Root of the generated workspace. Packages are written to
   * `<outDir>/packages/<protocol>/<program>/` and umbrellas to
   * `<outDir>/packages/<protocol>/`; `<outDir>/packages/` is replaced.
   */
  outDir: string;
}

/**
 * Generates every package of the megagraph into a fresh
 * `<outDir>/packages/` directory.
 *
 * @returns The absolute paths of the generated package directories.
 */
export async function generatePackages(
  input: GeneratePackagesInput,
): Promise<string[]> {
  const { megagraph } = input;
  const programsByName = new Map<string, ProgramNode>(
    getAllPrograms(megagraph.root).map((program) => [program.name, program]),
  );
  const packagesByProgram = new Map(
    megagraph.packages.map((entry) => [entry.program, entry]),
  );
  const sourcesBySlug = new Map(
    input.programs.map((source) => [source.slug, source]),
  );
  const dependencyGraph = new Map(
    megagraph.packages.map((entry) => [entry.program, entry.dependencies]),
  );
  if (
    megagraph.packages.length !== input.programs.length ||
    megagraph.packages.some((entry) => !sourcesBySlug.has(entry.slug))
  ) {
    throw new Error(
      "graph/packages.json is out of date with programs/. Run `bun run graph` first.",
    );
  }

  const packagesDir = join(input.outDir, "packages");
  await rm(packagesDir, { recursive: true, force: true });

  const generated: string[] = [];
  for (const entry of megagraph.packages) {
    const program = programsByName.get(entry.program);
    const source = sourcesBySlug.get(entry.slug);
    if (program === undefined || source === undefined) {
      throw new Error(`Program "${entry.program}" is missing from the graph`);
    }
    const protocol = input.protocols.find(
      (candidate) => candidate.protocol === source.protocol,
    );

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

    const packageDir = join(input.outDir, getProgramPackagePath(entry));
    const templateInput: PackageTemplateInput = {
      name: entry.packageName,
      version: entry.version,
      description: source.config.package.description,
      keywords: [
        ...(protocol?.config.keywords ?? []),
        ...(source.config.package.keywords ?? []),
      ],
      source: relative(input.repoRoot, source.dir),
      dependencies,
    };

    await mkdir(join(packageDir, "src"), { recursive: true });
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
    await copyOptional(
      join(source.dir, CHANGELOG_FILE),
      join(packageDir, CHANGELOG_FILE),
    );

    console.log(
      `Generated ${entry.packageName}@${entry.version} (packages/${entry.slug})${
        dependencies.length > 0
          ? ` -> ${dependencies.map((d) => d.packageName).join(", ")}`
          : ""
      }`,
    );
    generated.push(packageDir);
  }

  for (const umbrella of megagraph.umbrellas) {
    const protocol = input.protocols.find(
      (candidate) => candidate.protocol === umbrella.protocol,
    );
    if (protocol?.config.umbrella === undefined) {
      throw new Error(
        `programs/${umbrella.protocol}: the umbrella is missing from protocol.config.ts`,
      );
    }
    generated.push(
      await generateUmbrella(umbrella, protocol, input, packagesByProgram),
    );
  }
  return generated;
}

/**
 * Generates an umbrella package that re-exports its member program packages.
 * Must run after the members are generated, since it scans their exports for
 * conflicts.
 */
async function generateUmbrella(
  umbrella: UmbrellaPackage,
  protocol: ProtocolSource,
  input: GeneratePackagesInput,
  packagesByProgram: Map<string, Megagraph["packages"][number]>,
): Promise<string> {
  const config = protocol.config.umbrella;
  if (config === undefined) {
    throw new Error(`programs/${protocol.protocol} has no umbrella`);
  }
  const members: BundleMember[] = [];
  for (const program of umbrella.programs) {
    const member = packagesByProgram.get(program);
    if (member === undefined) {
      throw new Error(
        `The ${umbrella.packageName} umbrella references unknown program "${program}"`,
      );
    }
    members.push({
      program,
      packageName: member.packageName,
      exports: await collectGeneratedExports(
        join(input.outDir, getProgramPackagePath(member)),
      ),
    });
  }
  const plan = planBundleExports(members);

  const packageDir = join(
    input.outDir,
    getUmbrellaPackagePath(umbrella.protocol),
  );
  const templateInput: PackageTemplateInput = {
    name: umbrella.packageName,
    version: umbrella.version,
    description: config.description,
    keywords: [...(protocol.config.keywords ?? []), ...(config.keywords ?? [])],
    source: relative(input.repoRoot, protocol.dir),
    dependencies: members.map(({ program, packageName }) => ({
      program,
      packageName,
    })),
  };

  await mkdir(join(packageDir, "src"), { recursive: true });
  await writeFile(
    join(packageDir, "package.json"),
    renderPackageJson(templateInput),
  );
  await writeFile(join(packageDir, "tsconfig.json"), renderTsconfig());
  await writeFile(
    join(packageDir, "src", "index.ts"),
    renderBundleIndex(
      renderEntryHeader(
        templateInput,
        `${templateInput.source}/protocol.config.ts`,
      ),
      members,
      plan,
    ),
  );
  await writeFile(
    join(packageDir, "README.md"),
    renderUmbrellaReadme(
      templateInput,
      [...plan.conflicts.keys()],
      plan.namespaced.map(({ program, packageName }) => ({
        program,
        packageName,
      })),
    ),
  );
  await copyOptional(
    join(protocol.dir, CHANGELOG_FILE),
    join(packageDir, CHANGELOG_FILE),
  );

  console.log(
    `Generated umbrella ${umbrella.packageName}@${umbrella.version} (packages/${umbrella.protocol}) = ${members
      .map((member) => member.packageName)
      .join(" + ")}${
      plan.conflicts.size > 0
        ? ` (${plan.conflicts.size.toString()} conflicting name(s))`
        : ""
    }`,
  );
  return packageDir;
}
