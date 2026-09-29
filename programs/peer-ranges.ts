/**
 * Peer dependency ranges of the generated packages, in one place.
 *
 * `KIT_RANGE` is what every generated client supports. An external program
 * package's range must stay aligned with it: every version it admits has to
 * accept a supported `@solana/kit`, and every kit major we claim has to be
 * covered by some version. `peer-ranges.test.ts` checks that against the
 * `npm-peers.json` snapshot next to each external IDL, and
 * `bun run megagraph peers --verify` checks the snapshot against npm.
 */

/** `@solana/kit` and `@solana/program-client-core`. */
export const KIT_RANGE = "^6.10.0 || ^7.0.0 || ^8.0.0";

/**
 * `@solana-program/token`, one caret per 0.x minor (a `^0.x` range only
 * matches that minor): 0.14 needs kit ^6.5.0, 0.15 ^7.0.0, 0.16 ^8.0.0 and
 * 0.17 ^8.3.0. 0.13 and older are left out: they predate kit 6.10.
 */
export const TOKEN_RANGE = "^0.14.0 || ^0.15.0 || ^0.16.0 || ^0.17.0";
