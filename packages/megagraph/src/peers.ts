import semver from "semver";

/**
 * What an external package declares, per published version: its peer
 * dependencies (and dependencies, for reference).
 */
export interface PeerMatrix {
  package: string;
  versions: Record<
    string,
    {
      peerDependencies?: Record<string, string>;
      dependencies?: Record<string, string>;
    }
  >;
}

/**
 * Checks that an external package's peer range is consistent with our own
 * range of a shared peer (e.g. `@solana/kit`):
 *
 * - every published version in `externalRange` declares a range of
 *   `sharedPeer` that intersects `sharedRange` (so a consumer can install it
 *   next to a supported version of the shared peer), and
 * - every major of `sharedRange` (each `||` alternative) is supported by at
 *   least one version in `externalRange`.
 *
 * Returns the problems found; empty when consistent. This fails as soon as
 * one range changes without the other, e.g. when `@solana/kit` 9 is added to
 * `sharedRange` before an external version supporting it is.
 */
export function checkPeerRanges(input: {
  matrix: PeerMatrix;
  externalRange: string;
  sharedPeer: string;
  sharedRange: string;
}): string[] {
  const { matrix, externalRange, sharedPeer, sharedRange } = input;
  const problems: string[] = [];
  const versions = Object.keys(matrix.versions)
    .filter(
      (version) =>
        semver.valid(version) !== null &&
        semver.prerelease(version) === null &&
        semver.satisfies(version, externalRange),
    )
    .toSorted(semver.compare);
  if (versions.length === 0) {
    return [
      `No published version of ${matrix.package} satisfies ${externalRange}`,
    ];
  }

  const declared = new Map<string, string>();
  for (const version of versions) {
    const range = matrix.versions[version]?.peerDependencies?.[sharedPeer];
    if (range === undefined) {
      problems.push(
        `${matrix.package}@${version} does not declare a ${sharedPeer} peer`,
      );
      continue;
    }
    declared.set(version, range);
    if (!semver.intersects(range, sharedRange)) {
      problems.push(
        `${matrix.package}@${version} needs ${sharedPeer} ${range}, which does not intersect our ${sharedRange}`,
      );
    }
  }

  for (const alternative of sharedRange
    .split("||")
    .map((part) => part.trim())) {
    const supported = [...declared].filter(([, range]) =>
      semver.intersects(range, alternative),
    );
    if (supported.length === 0) {
      problems.push(
        `No version of ${matrix.package} in ${externalRange} supports ${sharedPeer} ${alternative}`,
      );
    }
  }
  return problems;
}

/**
 * Checks an external package's range against every shared peer it also
 * declares (e.g. the generated clients' `@solana/kit` range). Returns the
 * problems found and the shared peers that were checked.
 */
export function checkExternalPeerRanges(input: {
  matrix: PeerMatrix;
  externalRange: string;
  peerDependencies: Record<string, string>;
}): { problems: string[]; checked: [string, string][] } {
  const checked = Object.entries(input.peerDependencies).filter(([name]) =>
    Object.values(input.matrix.versions).some(
      (version) => version.peerDependencies?.[name] !== undefined,
    ),
  );
  return {
    checked,
    problems: checked.flatMap(([sharedPeer, sharedRange]) =>
      checkPeerRanges({
        matrix: input.matrix,
        externalRange: input.externalRange,
        sharedPeer,
        sharedRange,
      }),
    ),
  };
}
