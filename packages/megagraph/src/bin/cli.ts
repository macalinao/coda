#!/usr/bin/env bun
/**
 * megagraph: builds the program graph, generates the client workspace, and
 * plans, applies and publishes releases. Run from the repository root (the
 * directory holding `programs/megagraph.config.ts`) or pass `--root <dir>`.
 *
 *   megagraph graph                       programs/ -> graph/
 *   megagraph generate                    graph/ + programs/ -> clients/
 *   megagraph clients <install|build|typecheck|test|lint|fingerprint>
 *   megagraph export <out-dir> [--source-commit <sha>]
 *   megagraph release plan --mirror <dir>
 *   megagraph release apply --mirror <dir> --commit <sha>
 *   megagraph publish <workspace-dir> [--dry-run]
 *   megagraph peers [--refresh|--verify]
 *   megagraph compat --kit <version> [--with <pkg>@<version>]... --clients <a,b>
 */
import { execFileSync } from "node:child_process";
import {
  clientsCommand,
  exportCommand,
  generateCommand,
  graphCommand,
  publishCommand,
  releaseApplyCommand,
  releasePlanCommand,
} from "../cli/commands.ts";
import { compatCommand } from "../cli/compat-command.ts";
import { findRoot, loadContext } from "../cli/context.ts";
import { peersCommand } from "../cli/peers-command.ts";

const args = process.argv.slice(2);

/** Removes `--<name> <value>` (every occurrence) and returns the values. */
function takeAll(name: string): string[] {
  const values: string[] = [];
  for (
    let index = args.indexOf(`--${name}`);
    index !== -1;
    index = args.indexOf(`--${name}`)
  ) {
    const value = args[index + 1];
    if (value === undefined) {
      throw new Error(`--${name} needs a value`);
    }
    values.push(value);
    args.splice(index, 2);
  }
  return values;
}

function take(name: string): string | undefined {
  return takeAll(name).at(-1);
}

function required(name: string): string {
  const value = take(name);
  if (value === undefined) {
    throw new Error(`Missing --${name} <value>`);
  }
  return value;
}

function flag(name: string): boolean {
  const index = args.indexOf(`--${name}`);
  if (index === -1) {
    return false;
  }
  args.splice(index, 1);
  return true;
}

async function main(): Promise<void> {
  const root = take("root") ?? findRoot(process.cwd());
  const [command, subcommand] = args;
  switch (command) {
    case "graph":
      return graphCommand(await loadContext(root));
    case "generate":
      return generateCommand(await loadContext(root));
    case "clients":
      return clientsCommand(await loadContext(root), subcommand ?? "");
    case "export": {
      const sourceCommit =
        take("source-commit") ??
        execFileSync("git", ["rev-parse", "HEAD"], {
          cwd: root,
          encoding: "utf-8",
        }).trim();
      if (subcommand === undefined) {
        throw new Error(
          "Usage: megagraph export <out-dir> [--source-commit <sha>]",
        );
      }
      return exportCommand(await loadContext(root), subcommand, sourceCommit);
    }
    case "release": {
      const context = await loadContext(root);
      const mirror = required("mirror");
      if (subcommand === "plan") {
        return releasePlanCommand(context, mirror);
      }
      if (subcommand === "apply") {
        return releaseApplyCommand(context, mirror, required("commit"));
      }
      throw new Error("Usage: megagraph release <plan|apply> --mirror <dir>");
    }
    case "publish": {
      const dryRun = flag("dry-run");
      const [, workspaceDir] = args;
      if (workspaceDir === undefined) {
        throw new Error("Usage: megagraph publish <workspace-dir> [--dry-run]");
      }
      return publishCommand(workspaceDir, dryRun);
    }
    case "peers": {
      const mode = flag("refresh")
        ? "refresh"
        : flag("verify")
          ? "verify"
          : "check";
      return peersCommand(await loadContext(root), mode);
    }
    case "compat":
      return compatCommand(await loadContext(root), {
        kit: required("kit"),
        with: takeAll("with"),
        clients: required("clients").split(","),
      });
    default:
      throw new Error(
        "Usage: megagraph <graph|generate|clients|export|release|publish|peers|compat> (see the header of src/bin/cli.ts)",
      );
  }
}

try {
  await main();
} catch (error) {
  console.error(
    error instanceof Error && !process.env.DEBUG ? error.message : error,
  );
  process.exit(1);
}
