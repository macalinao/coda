import type { PeerMatrix } from "./peers.ts";
import { describe, expect, test } from "bun:test";
import { checkPeerRanges } from "./peers.ts";

const matrix: PeerMatrix = {
  package: "@solana-program/token",
  versions: {
    "0.10.0": { peerDependencies: { "@solana/kit": "^6.0.0" } },
    "0.14.0": { peerDependencies: { "@solana/kit": "^6.5.0" } },
    "0.15.0": { peerDependencies: { "@solana/kit": "^7.0.0" } },
    "0.16.0": { peerDependencies: { "@solana/kit": "^8.0.0" } },
    "0.17.0": { peerDependencies: { "@solana/kit": "^8.3.0" } },
  },
};
const token = "^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0";
const kit = "^6.10.0 || ^7.0.0 || ^8.0.0";
const check = (externalRange: string, sharedRange: string) =>
  checkPeerRanges({
    matrix,
    externalRange,
    sharedPeer: "@solana/kit",
    sharedRange,
  });

describe("checkPeerRanges", () => {
  test("accepts aligned ranges", () => {
    expect(check(token, kit)).toEqual([]);
  });

  test("fails when a kit major is added without an external version for it", () => {
    expect(check(token, `${kit} || ^9.0.0`)).toEqual([
      "No version of @solana-program/token in ^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0 supports @solana/kit ^9.0.0",
    ]);
  });

  test("fails when a kit major is dropped but the external range still needs it", () => {
    expect(check(token, "^7.0.0 || ^8.0.0")).toEqual([
      "@solana-program/token@0.14.0 needs @solana/kit ^6.5.0, which does not intersect our ^7.0.0 || ^8.0.0",
    ]);
  });

  test("fails when no external version covers a kit major", () => {
    expect(check("^0.15.0 || ^0.16.0 || ^0.17.0", kit)).toEqual([
      "No version of @solana-program/token in ^0.15.0 || ^0.16.0 || ^0.17.0 supports @solana/kit ^6.10.0",
    ]);
  });
});
