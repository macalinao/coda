import type { ProgramNode } from "codama";
import type { Megagraph, UmbrellaPackage } from "./build-graph.ts";
import type { BundleMember } from "./bundle.ts";
import type { ProgramSource, ProtocolSource } from "./load-programs.ts";
import type {
  MirrorLocation,
  PackageDependency,
  PackageTemplateInput,
} from "./templates.ts";
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

/** Scope of the packages that publish Solana program clients. */
const PROGRAM_CLIENT_SCOPE = /^@solana-program\//;

const IMPORT_SPECIFIER = /from\s+["']([^"']+)["']/g;

/**
 * Derives a package's peer dependencies on external program packages from
 * the imports of its rendered code, and fails on an import of a program
 * client package that is not a declared external (e.g. `@solana-program/system`
 * would have to be added as one).
 */
async function getExternalPeers(
  generatedDir: string,
  externals: Megagraph["externals"],
  packageName: string,
): Promise<Record<string, string>> {
  const ranges = new Map(
    externals.map((external) => [external.packageName, external.peerRange]),
  );
  const peers: Record<string, string> = {};
  const files = (await readdir(generatedDir, { recursive: true })).filter(
    (file) => file.endsWith(".ts"),
  );
  for (const file of files) {
    const code = await readFile(join(generatedDir, file), "utf-8");
    for (const [, specifier] of code.matchAll(IMPORT_SPECIFIER)) {
      if (specifier === undefined || !PROGRAM_CLIENT_SCOPE.test(specifier)) {
        continue;
      }
      const range = ranges.get(specifier);
      if (range === undefined) {
        throw new Error(
          `${packageName}: generated code imports ${specifier}, which is not a declared external program`,
        );
      }
      peers[specifier] = range;
    }
  }
  return peers;
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
  /** Peer dependencies every generated package declares (e.g. `@solana/kit`). */
  peerDependencies: Record<string, string>;
  /** Where the generated packages are published as source (READMEs link to it). */
  mirror: MirrorLocation;
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

  const externalsByProgram = new Map(
    megagraph.externals.map((entry) => [entry.program, entry]),
  );
  const peersByPackage = new Map<string, Record<string, string>>();

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

    // Links into external programs become peer dependencies, derived from
    // the rendered imports below; the rest are workspace dependencies.
    const dependencies: PackageDependency[] = entry.dependencies
      .filter((name) => !externalsByProgram.has(name))
      .map((name) => {
        const dependency = packagesByProgram.get(name);
        if (dependency === undefined) {
          throw new Error(
            `Program "${entry.program}" links to unknown program "${name}"`,
          );
        }
        return {
          program: name,
          packageName: dependency.packageName,
          path: getProgramPackagePath(dependency),
        };
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
        packagesByProgram.get(name)?.packageName ??
          externalsByProgram.get(name)?.packageName ??
          name,
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
      path: getProgramPackagePath(entry),
      mirror: input.mirror,
      dependencies,
      peerDependencies: input.peerDependencies,
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

    templateInput.peerDependencies = {
      ...input.peerDependencies,
      ...(await getExternalPeers(
        join(packageDir, "src", "generated"),
        megagraph.externals,
        entry.packageName,
      )),
    };
    peersByPackage.set(entry.packageName, templateInput.peerDependencies);

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
      await generateUmbrella(
        umbrella,
        protocol,
        input,
        packagesByProgram,
        peersByPackage,
      ),
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
  peersByPackage: Map<string, Record<string, string>>,
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
  const memberPath = (program: string): string => {
    const member = packagesByProgram.get(program);
    return member === undefined ? "" : getProgramPackagePath(member);
  };
  const templateInput: PackageTemplateInput = {
    name: umbrella.packageName,
    version: umbrella.version,
    description: config.description,
    keywords: [...(protocol.config.keywords ?? []), ...(config.keywords ?? [])],
    source: relative(input.repoRoot, protocol.dir),
    path: getUmbrellaPackagePath(umbrella.protocol),
    mirror: input.mirror,
    dependencies: members.map(({ program, packageName }) => ({
      program,
      packageName,
      path: memberPath(program),
    })),
    // An umbrella re-exports its members, so it takes the union of their
    // peers.
    peerDependencies: Object.assign(
      {},
      input.peerDependencies,
      ...members.map((member) => peersByPackage.get(member.packageName) ?? {}),
    ) as Record<string, string>,
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
        path: memberPath(program),
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
