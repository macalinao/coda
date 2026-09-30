import type { CliContext } from "./context.ts";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rootVersion } from "./context.ts";
import { findWorkspacePackages } from "./workspace-packages.ts";

/**
 * `compat --kit <version> [--with <pkg>@<version>]... --clients <names>`:
 * type-checks the sources of generated client packages (and the workspace
 * packages they depend on) against exact versions of `@solana/kit`,
 * `@solana/program-client-core` and external packages, in a scratch project
 * whose overrides pin a single version of each. Verifies the peer ranges we
 * publish, one combination at a time.
 */
export async function compatCommand(
  context: CliContext,
  options: { kit: string; with: string[]; clients: string[] },
): Promise<void> {
  const packages = await findWorkspacePackages(context.clientsDir);
  const byName = new Map(packages.map((entry) => [entry.name, entry]));
  const selected = new Set<string>();
  const add = (name: string) => {
    const entry = byName.get(name);
    if (entry === undefined) {
      throw new Error(`${name} is not a generated package; run codegen first`);
    }
    if (selected.has(name)) {
      return;
    }
    selected.add(name);
    for (const dependency of entry.dependencies) {
      if (byName.has(dependency)) {
        add(dependency);
      }
    }
  };
  for (const name of options.clients) {
    add(name);
  }

  const scratch = await mkdtemp(join(tmpdir(), "megagraph-compat-"));
  const paths: Record<string, string[]> = {};
  for (const name of selected) {
    const entry = byName.get(name);
    if (entry === undefined) {
      continue;
    }
    const target = join("pkgs", entry.path);
    await cp(join(entry.dir, "src"), join(scratch, target, "src"), {
      recursive: true,
    });
    paths[name] = [`./${target}/src/index.ts`];
  }

  const pinned: Record<string, string> = {
    "@solana/kit": options.kit,
    "@solana/program-client-core": options.kit,
  };
  for (const spec of options.with) {
    const at = spec.lastIndexOf("@");
    if (at <= 0) {
      throw new Error(`--with expects <package>@<version>, got ${spec}`);
    }
    pinned[spec.slice(0, at)] = spec.slice(at + 1);
  }
  await writeFile(
    join(scratch, "package.json"),
    `${JSON.stringify(
      {
        name: "megagraph-compat",
        private: true,
        type: "module",
        dependencies: {
          ...pinned,
          "@types/node": rootVersion(context, "@types/node"),
          typescript: rootVersion(context, "typescript"),
        },
        overrides: pinned,
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    join(scratch, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2024",
          lib: ["ES2024"],
          module: "preserve",
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          noEmit: true,
          strict: true,
          exactOptionalPropertyTypes: true,
          noUncheckedIndexedAccess: true,
          skipLibCheck: true,
          verbatimModuleSyntax: true,
          types: ["node"],
          paths,
        },
        include: ["pkgs/**/*.ts"],
      },
      null,
      2,
    )}\n`,
  );

  const label = Object.entries(pinned)
    .map(([name, version]) => `${name}@${version}`)
    .join(" + ");
  console.log(
    `Type-checking ${[...selected].join(", ")} against ${label} in ${scratch}`,
  );
  const install = spawnSync(process.execPath, ["install"], {
    cwd: scratch,
    stdio: "inherit",
  });
  if (install.status !== 0) {
    throw new Error(`bun install failed in ${scratch}`);
  }
  const check = spawnSync(
    join(scratch, "node_modules", ".bin", "tsc"),
    ["-p", "."],
    { cwd: scratch, stdio: "inherit" },
  );
  if (check.status !== 0) {
    throw new Error(`Type check failed against ${label} (scratch: ${scratch})`);
  }
  console.log(`OK: ${label}`);
}
