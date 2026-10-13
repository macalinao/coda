import type { PeerMatrix } from "@macalinao/megagraph";
import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { checkExternalPeerRanges, loadPrograms } from "@macalinao/megagraph";
import megagraph from "./megagraph.config.ts";

const { externals } = await loadPrograms(import.meta.dirname);

describe("external peer ranges", () => {
  test("there is at least one external program", () => {
    expect(externals.length).toBeGreaterThan(0);
  });

  for (const external of externals) {
    test(`${external.external.npm.package} is aligned with the shared peers`, async () => {
      const matrix = JSON.parse(
        await readFile(join(external.dir, "npm-peers.json"), "utf-8"),
      ) as PeerMatrix;
      const { problems } = checkExternalPeerRanges({
        matrix,
        externalRange: external.external.npm.range,
        peerDependencies: megagraph.peerDependencies,
      });
      expect(problems).toEqual([]);
    });
  }
});
