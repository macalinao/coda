import type { PeerMatrix } from "../peers.ts";
import type { CliContext } from "./context.ts";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadPrograms } from "../load-programs.ts";
import { checkExternalPeerRanges } from "../peers.ts";

/** Snapshot of an external package's peers, next to its vendored IDL. */
const SNAPSHOT_FILE = "npm-peers.json";

async function fetchMatrix(packageName: string): Promise<PeerMatrix> {
  const response = await fetch(
    `https://registry.npmjs.org/${packageName.replace("/", "%2F")}`,
  );
  if (!response.ok) {
    throw new Error(
      `Could not fetch ${packageName} from npm: ${response.status.toString()}`,
    );
  }
  const packument = (await response.json()) as {
    versions: Record<
      string,
      {
        peerDependencies?: Record<string, string>;
        dependencies?: Record<string, string>;
      }
    >;
  };
  return {
    package: packageName,
    versions: Object.fromEntries(
      Object.entries(packument.versions).map(([version, manifest]) => [
        version,
        {
          ...(manifest.peerDependencies && {
            peerDependencies: manifest.peerDependencies,
          }),
          ...(manifest.dependencies && { dependencies: manifest.dependencies }),
        },
      ]),
    ),
  };
}

function serialize(matrix: PeerMatrix): string {
  return `${JSON.stringify(matrix, null, 2)}\n`;
}

/**
 * `peers [--refresh|--verify]`: checks every external program's peer range
 * against the repository-wide peers (e.g. `@solana/kit`), using the
 * `npm-peers.json` snapshot next to its IDL. `--refresh` rewrites the
 * snapshot from npm first; `--verify` fails if the snapshot differs from npm.
 */
export async function peersCommand(
  context: CliContext,
  mode: "check" | "refresh" | "verify",
): Promise<void> {
  const { externals } = await loadPrograms(context.programsDir);
  const problems: string[] = [];
  for (const external of externals) {
    const snapshotPath = join(external.dir, SNAPSHOT_FILE);
    const packageName = external.external.npm.package;
    if (mode !== "check") {
      const fresh = serialize(await fetchMatrix(packageName));
      if (mode === "refresh") {
        await writeFile(snapshotPath, fresh);
        console.log(`Wrote programs/${external.slug}/${SNAPSHOT_FILE}`);
      } else if ((await readFile(snapshotPath, "utf-8")) !== fresh) {
        problems.push(
          `programs/${external.slug}/${SNAPSHOT_FILE} is out of date with npm; run \`bun run megagraph peers --refresh\``,
        );
      }
    }
    const matrix = JSON.parse(
      await readFile(snapshotPath, "utf-8"),
    ) as PeerMatrix;
    const { problems: found, checked: shared } = checkExternalPeerRanges({
      matrix,
      externalRange: external.external.npm.range,
      peerDependencies: context.config.peerDependencies,
    });
    problems.push(...found);
    console.log(
      `${packageName} ${external.external.npm.range}: checked against ${shared.map(([name, range]) => `${name} ${range}`).join(", ")}`,
    );
  }
  if (problems.length > 0) {
    throw new Error(
      `Peer range problems:\n${problems.map((problem) => `  - ${problem}`).join("\n")}`,
    );
  }
  console.log("Peer ranges are consistent.");
}
