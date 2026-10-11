import type { ProgramCluster } from "./define-program.ts";
import type { ProgramMetadata } from "./program-metadata.ts";
import type { ProgramNode } from "codama";
import { gitFileUrl, PROGRAM_CLUSTERS } from "./program-metadata.ts";

/** Keywords every generated package carries. */
const BASE_KEYWORDS = ["coda", "solana", "client", "esm", "typescript"];

/** A package this package depends on because it links into its program. */
export interface PackageDependency {
  program: string;
  packageName: string;
  /** Directory of the package in the mirror, e.g. `packages/quarry/mine`. */
  path: string;
}

/** Where the generated packages are published as source. */
export interface MirrorLocation {
  /** GitHub repository, e.g. `toolboxdao/solana-programs`. */
  repository: string;
  defaultBranch: string;
}

/** URL of a directory of the mirror at a ref (branch or tag). */
export function mirrorTreeUrl(
  mirror: MirrorLocation,
  ref: string,
  path: string,
): string {
  return `https://github.com/${mirror.repository}/tree/${encodeURIComponent(ref)}/${path}`;
}

/** Delimits the README section `release apply` rewrites for each version. */
export const SOURCE_SECTION_START = "<!-- megagraph:source -->";
export const SOURCE_SECTION_END = "<!-- /megagraph:source -->";

/**
 * Renders the README section linking a package to its source in the mirror:
 * its directory at the release tag (`<name>@<version>`, created by the
 * release that publishes this version), on the default branch, and the
 * inputs it is generated from.
 */
export function renderSourceSection(input: {
  name: string;
  version: string;
  /** Directory of the package in the mirror. */
  path: string;
  /** Directory of the package's inputs, e.g. `programs/quarry/mine`. */
  source: string;
  mirror: MirrorLocation;
}): string {
  const { name, version, path, source, mirror } = input;
  const tag = `${name}@${version}`;
  return [
    SOURCE_SECTION_START,
    "## Source",
    "",
    `This package is generated; its source is published in [\`${mirror.repository}\`](https://github.com/${mirror.repository}):`,
    "",
    `- This release (\`${tag}\`): [\`${path}\`](${mirrorTreeUrl(mirror, tag, path)})`,
    `- Latest (\`${mirror.defaultBranch}\`): [\`${path}\`](${mirrorTreeUrl(mirror, mirror.defaultBranch, path)})`,
    `- Generator inputs: [\`${source}\`](${mirrorTreeUrl(mirror, mirror.defaultBranch, source)})`,
    SOURCE_SECTION_END,
  ].join("\n");
}

/**
 * Replaces the source section of a README (see {@link renderSourceSection}).
 * Returns the README unchanged when it has none.
 */
export function replaceSourceSection(readme: string, section: string): string {
  const start = readme.indexOf(SOURCE_SECTION_START);
  const end = readme.indexOf(SOURCE_SECTION_END);
  if (start === -1 || end === -1 || end < start) {
    return readme;
  }
  return (
    readme.slice(0, start) +
    section +
    readme.slice(end + SOURCE_SECTION_END.length)
  );
}

function mirrorLink(mirror: MirrorLocation, dependency: PackageDependency) {
  return `[\`${dependency.packageName}\`](https://www.npmjs.com/package/${dependency.packageName}) ([source](${mirrorTreeUrl(mirror, mirror.defaultBranch, dependency.path)}))`;
}

export interface PackageTemplateInput {
  /** npm package name. */
  name: string;
  version: string;
  description: string;
  keywords: string[];
  /** Directory the package is generated from, e.g. `programs/quarry/mine`. */
  source: string;
  /** Directory of the package in the generated workspace and the mirror. */
  path: string;
  mirror: MirrorLocation;
  dependencies: PackageDependency[];
  /**
   * Peer dependencies: the repository-wide ones plus the external packages
   * the generated code imports.
   */
  peerDependencies: Record<string, string>;
}

function sortKeys(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).toSorted(([a], [b]) => a.localeCompare(b)),
  );
}

/**
 * Renders the generated `package.json`.
 */
export function renderPackageJson(input: PackageTemplateInput): string {
  const keywords = [...new Set([...BASE_KEYWORDS, ...input.keywords])];
  const packageJson = {
    name: input.name,
    version: input.version,
    description: input.description,
    type: "module",
    sideEffects: false,
    author: "Ian Macalinao <me@ianm.com>",
    // The package's source in the mirror. npm provenance only checks
    // `repository`, which has to stay the publishing repository (coda).
    homepage: mirrorTreeUrl(
      input.mirror,
      input.mirror.defaultBranch,
      input.path,
    ),
    license: "Apache-2.0",
    keywords,
    main: "dist/index.js",
    types: "dist/index.d.ts",
    exports: {
      ".": {
        import: "./dist/index.js",
        types: "./dist/index.d.ts",
      },
    },
    files: ["dist/", "src/"],
    scripts: {
      build: "tsdown",
      clean: "rm -fr dist/ node_modules/ tsconfig.tsbuildinfo",
      typecheck: "tsc --noEmit",
    },
    ...(input.dependencies.length > 0 && {
      dependencies: Object.fromEntries(
        input.dependencies
          .map((dependency) => dependency.packageName)
          .toSorted()
          .map((name) => [name, "workspace:^"]),
      ),
    }),
    peerDependencies: sortKeys(input.peerDependencies),
    // Every peer is also a devDependency, from the workspace catalog, so the
    // package builds and type-checks in the workspace.
    devDependencies: sortKeys({
      "@macalinao/tsconfig": "catalog:",
      tsdown: "catalog:",
      typescript: "catalog:",
      ...Object.fromEntries(
        Object.keys(input.peerDependencies).map((name) => [name, "catalog:"]),
      ),
    }),
    publishConfig: {
      access: "public",
    },
    repository: {
      type: "git",
      url: "git+https://github.com/macalinao/coda.git",
      // Published from macalinao/coda's workflows, so npm provenance requires
      // the repository to be coda; the directory holds the package's inputs.
      directory: input.source,
    },
  };
  return `${JSON.stringify(packageJson, null, 2)}\n`;
}

/**
 * Renders the generated `tsconfig.json`.
 */
export function renderTsconfig(): string {
  return `${JSON.stringify(
    {
      extends: "@macalinao/tsconfig/tsconfig.base.json",
      // The generated error helpers read `process.env.NODE_ENV`.
      compilerOptions: { types: ["node"] },
    },
    null,
    2,
  )}\n`;
}

/**
 * Renders the doc comment at the top of the generated `src/index.ts`.
 */
export function renderEntryHeader(
  input: PackageTemplateInput,
  source: string,
): string {
  return [
    "/**",
    ` * ${input.name}`,
    " *",
    ` * ${input.description}`,
    " *",
    ` * Generated by \`bun run codegen\` from ${source}. Do not edit.`,
    " */",
  ].join("\n");
}

/**
 * Renders the generated `src/index.ts` entry barrel of a program package.
 */
export function renderEntryBarrel(input: PackageTemplateInput): string {
  return [
    renderEntryHeader(input, `${input.source}/`),
    "",
    'export * from "./generated/index.ts";',
    "",
  ].join("\n");
}

/** The program that replaces a deprecated program, and where it is published. */
export interface ProgramSuccessor {
  program: string;
  packageName: string;
  /** Directory of its package in the mirror; absent for external programs. */
  path?: string;
}

function successorLink(
  mirror: MirrorLocation,
  successor: ProgramSuccessor,
): string {
  const npm = `[\`${successor.packageName}\`](https://www.npmjs.com/package/${successor.packageName})`;
  return successor.path === undefined
    ? npm
    : `${npm} ([source](${mirrorTreeUrl(mirror, mirror.defaultBranch, successor.path)}))`;
}

/** Renders the notice shown at the top of a deprecated program's README. */
export function renderDeprecationNotice(
  program: string,
  mirror: MirrorLocation,
  successor: ProgramSuccessor | undefined,
): string {
  return [
    "> [!WARNING]",
    `> The \`${program}\` program is deprecated.${
      successor === undefined
        ? ""
        : ` Use \`${successor.program}\` (${successorLink(mirror, successor)}) instead.`
    }`,
  ].join("\n");
}

const CLUSTER_LABELS: Record<ProgramCluster, string> = {
  mainnet: "Mainnet",
  devnet: "Devnet",
};

/**
 * Renders the address lines of the Program section: the IDL's address with
 * the clusters it is deployed to, then any cluster deployed elsewhere.
 */
function renderAddresses(
  publicKey: string,
  addresses: ProgramMetadata["addresses"],
): string[] {
  const shared = PROGRAM_CLUSTERS.filter(
    (cluster) => addresses[cluster] === publicKey,
  );
  const notes = [
    ...(shared.length === 1 && shared[0] === "mainnet" ? [] : shared),
    ...(addresses.mainnet === undefined ? ["not deployed on mainnet"] : []),
  ];
  return [
    `- Address: \`${publicKey}\`${notes.length > 0 ? ` (${notes.join(", ")})` : ""}`,
    ...PROGRAM_CLUSTERS.flatMap((cluster) => {
      const address = addresses[cluster];
      return address === undefined || address === publicKey
        ? []
        : [`- ${CLUSTER_LABELS[cluster]} address: \`${address}\``];
    }),
  ];
}

/**
 * Renders the `## Program` section of a program package's README: what the
 * program is, its addresses, where its source and IDL come from, and its
 * status.
 */
export function renderProgramSection(input: {
  program: ProgramNode;
  metadata: ProgramMetadata;
  /** Path of the generated reference, relative to the README. */
  docsFile: string;
  mirror: MirrorLocation;
  successor?: ProgramSuccessor;
}): string {
  const { program, metadata, docsFile, mirror, successor } = input;
  const lines = ["## Program", ""];
  const summary = [
    metadata.displayName === undefined ? null : `**${metadata.displayName}**`,
    metadata.description ?? null,
  ].filter((part): part is string => part !== null);
  if (summary.length > 0) {
    lines.push(summary.join(": "), "");
  }
  lines.push(`- Name: \`${program.name}\``);
  if (metadata.status === "deprecated") {
    lines.push(
      `- Status: deprecated${
        successor === undefined
          ? ""
          : `, superseded by \`${successor.program}\` (${successorLink(mirror, successor)})`
      }`,
    );
  }
  lines.push(...renderAddresses(program.publicKey, metadata.addresses));
  if (metadata.repository !== undefined) {
    lines.push(`- Source: ${metadata.repository}`);
  }
  if (metadata.idlSource !== undefined) {
    const { idlSource } = metadata;
    const url = gitFileUrl(idlSource);
    const file =
      url === null
        ? `\`${idlSource.path}\``
        : `[\`${idlSource.path}\`](${url})`;
    const at = [
      idlSource.tag === undefined ? null : `tag \`${idlSource.tag}\``,
      idlSource.commit === undefined
        ? null
        : `commit \`${idlSource.commit.slice(0, 7)}\``,
    ].filter((part): part is string => part !== null);
    lines.push(
      `- IDL: ${file} of ${idlSource.repository}${at.length > 0 ? ` (${at.join(", ")})` : ""}`,
    );
  }
  if (metadata.docs !== undefined) {
    lines.push(`- Documentation: ${metadata.docs}`);
  }
  if (metadata.audits !== undefined) {
    lines.push("- Audits:");
    for (const audit of metadata.audits) {
      lines.push(
        `  - [${audit.auditor}](${audit.url})${audit.date === undefined ? "" : ` (${audit.date})`}`,
      );
    }
  }
  lines.push(`- Reference: [${docsFile}](./${docsFile})`);
  return lines.join("\n");
}

/**
 * Renders the generated `README.md`. `body` is the optional hand-written
 * `programs/<slug>/README.md`, inserted after the installation section.
 */
export function renderReadme(
  input: PackageTemplateInput,
  program: ProgramNode,
  docsFile: string,
  body: string | null,
  info: { metadata: ProgramMetadata; successor?: ProgramSuccessor },
): string {
  const { name, description } = input;
  const sections = [
    `# ${name}`,
    `[![npm version](https://img.shields.io/npm/v/${name}.svg)](https://www.npmjs.com/package/${name})`,
    description,
    `<!-- Generated by \`bun run codegen\` in macalinao/coda from ${input.source}/. Edit ${input.source}/README.md there instead. -->`,
  ];
  if (info.metadata.status === "deprecated") {
    sections.push(
      renderDeprecationNotice(program.name, input.mirror, info.successor),
    );
  }
  sections.push(
    [
      "## Installation",
      "",
      "```bash",
      `bun add ${name} @solana/kit`,
      "```",
    ].join("\n"),
  );
  if (body !== null && body.trim().length > 0) {
    sections.push(body.trim());
  }
  sections.push(
    renderProgramSection({
      program,
      metadata: info.metadata,
      docsFile,
      mirror: input.mirror,
      ...(info.successor !== undefined && { successor: info.successor }),
    }),
  );
  if (input.dependencies.length > 0) {
    sections.push(
      [
        "## Linked programs",
        "",
        "This program links to nodes of the following programs. Their generated code is imported from their own packages rather than duplicated here:",
        "",
        ...input.dependencies.map(
          (dependency) =>
            `- \`${dependency.program}\`: ${mirrorLink(input.mirror, dependency)}`,
        ),
      ].join("\n"),
    );
  }
  sections.push(
    renderSourceSection(input),
    [
      "## License",
      "",
      "Copyright © 2025 Ian Macalinao",
      "",
      "Licensed under the Apache License, Version 2.0",
    ].join("\n"),
  );
  return `${sections.join("\n\n")}\n`;
}

/**
 * Renders the generated `README.md` of an umbrella package.
 */
export function renderUmbrellaReadme(
  input: PackageTemplateInput,
  conflicts: string[],
  namespaces: PackageDependency[],
): string {
  const { name, description } = input;
  const sections = [
    `# ${name}`,
    `[![npm version](https://img.shields.io/npm/v/${name}.svg)](https://www.npmjs.com/package/${name})`,
    description,
    `<!-- Generated by \`bun run codegen\` in macalinao/coda from ${input.source}/protocol.config.ts. Do not edit. -->`,
    [
      "## Installation",
      "",
      "```bash",
      `bun add ${name} @solana/kit`,
      "```",
    ].join("\n"),
    [
      "## Included programs",
      "",
      "This package contains no code of its own: it re-exports everything from the following packages, which can also be installed individually:",
      "",
      ...input.dependencies.map(
        (dependency) =>
          `- \`${dependency.program}\`: ${mirrorLink(input.mirror, dependency)}`,
      ),
    ].join("\n"),
  ];
  if (conflicts.length > 0) {
    sections.push(
      [
        "## Name conflicts",
        "",
        `${conflicts.length.toString()} name(s) are exported by more than one of these programs. The flat export resolves to the program listed first above; the other programs are also exported in full under a namespace:`,
        "",
        ...namespaces.map(
          (namespace) =>
            `- \`${namespace.program}\` (\`import { ${namespace.program} } from "${name}"\`)`,
        ),
      ].join("\n"),
    );
  }
  sections.push(
    renderSourceSection(input),
    [
      "## License",
      "",
      "Copyright © 2025 Ian Macalinao",
      "",
      "Licensed under the Apache License, Version 2.0",
    ].join("\n"),
  );
  return `${sections.join("\n\n")}\n`;
}
