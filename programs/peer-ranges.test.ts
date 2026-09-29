import type { PeerMatrix } from "@macalinao/megagraph";
import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { checkPeerRanges } from "@macalinao/megagraph";
import { KIT_RANGE, TOKEN_RANGE } from "./peer-ranges.ts";

async function snapshot(slug: string): Promise<PeerMatrix> {
  return JSON.parse(
    await readFile(join(import.meta.dirname, slug, "npm-peers.json"), "utf-8"),
  ) as PeerMatrix;
}

describe("peer ranges", () => {
  test("@solana-program/token is aligned with @solana/kit", async () => {
    expect(
      checkPeerRanges({
        matrix: await snapshot("solana/token"),
        externalRange: TOKEN_RANGE,
        sharedPeer: "@solana/kit",
        sharedRange: KIT_RANGE,
      }),
    ).toEqual([]);
  });
});
