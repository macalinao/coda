import type {
  GitFileSource,
  ProgramAudit,
  ProgramCluster,
  ProgramMetadataConfig,
  ProgramStatus,
} from "./define-program.ts";
import type { Change } from "./release/classify.ts";

/** Clusters in the order they are recorded and rendered. */
export const PROGRAM_CLUSTERS: readonly ProgramCluster[] = [
  "mainnet",
  "devnet",
];

/**
 * The resolved metadata of an on-chain program, as recorded in
 * `graph/packages.json`. Optional fields are only present when configured;
 * `addresses.mainnet` and `status` are always resolved.
 */
export interface ProgramMetadata {
  displayName?: string;
  description?: string;
  repository?: string;
  idlSource?: GitFileSource;
  addresses: Partial<Record<ProgramCluster, string>> & { mainnet: string };
  docs?: string;
  audits?: ProgramAudit[];
  status: ProgramStatus;
  supersededBy?: string;
}

const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const COMMIT_HASH = /^[0-9a-f]{40}$/;
const AUDIT_DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const STATUSES = new Set<string>(["active", "deprecated"]);

function assertText(where: string, field: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${where}: program.${field} must not be empty`);
  }
}

function assertUrl(where: string, field: string, value: string): void {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${where}: program.${field} is not a URL: ${value}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(
      `${where}: program.${field} must be an https URL: ${value}`,
    );
  }
}

function resolveGitFileSource(
  where: string,
  source: GitFileSource,
): GitFileSource {
  assertUrl(where, "idlSource.repository", source.repository);
  assertText(where, "idlSource.path", source.path);
  if (source.tag !== undefined) {
    assertText(where, "idlSource.tag", source.tag);
  }
  if (source.commit !== undefined && !COMMIT_HASH.test(source.commit)) {
    throw new Error(
      `${where}: program.idlSource.commit must be a full 40-character commit hash: ${source.commit}`,
    );
  }
  return {
    repository: source.repository,
    ...(source.tag !== undefined && { tag: source.tag }),
    ...(source.commit !== undefined && { commit: source.commit }),
    path: source.path,
  };
}

/**
 * Validates a program's metadata config and resolves it for
 * `graph/packages.json`, with fields in a fixed order.
 *
 * - `addresses.mainnet` defaults to the IDL's address and must equal it.
 * - Addresses must be base58 public keys; URLs must be https.
 * - `supersededBy` requires `status: "deprecated"` and must name another
 *   program of the graph.
 */
export function resolveProgramMetadata(input: {
  config: ProgramMetadataConfig | undefined;
  /** Codama name of the program. */
  program: string;
  /** Address of the program in its IDL. */
  publicKey: string;
  /** Codama names of every program of the graph, externals included. */
  knownPrograms: ReadonlySet<string>;
  /** Prefix of error messages, e.g. `programs/quarry/mine`. */
  where: string;
}): ProgramMetadata {
  const { config = {}, program, publicKey, knownPrograms, where } = input;

  if (config.displayName !== undefined) {
    assertText(where, "displayName", config.displayName);
  }
  if (config.description !== undefined) {
    assertText(where, "description", config.description);
  }
  if (config.repository !== undefined) {
    assertUrl(where, "repository", config.repository);
  }
  if (config.docs !== undefined) {
    assertUrl(where, "docs", config.docs);
  }

  const configured = config.addresses ?? {};
  for (const cluster of Object.keys(configured)) {
    if (!(PROGRAM_CLUSTERS as readonly string[]).includes(cluster)) {
      throw new Error(
        `${where}: program.addresses.${cluster} is not a known cluster (${PROGRAM_CLUSTERS.join(", ")})`,
      );
    }
  }
  if (configured.mainnet !== undefined && configured.mainnet !== publicKey) {
    throw new Error(
      `${where}: program.addresses.mainnet (${configured.mainnet}) does not match the IDL's address (${publicKey})`,
    );
  }
  const addresses: ProgramMetadata["addresses"] = { mainnet: publicKey };
  for (const cluster of PROGRAM_CLUSTERS) {
    const address = cluster === "mainnet" ? publicKey : configured[cluster];
    if (address === undefined) {
      continue;
    }
    if (!BASE58_ADDRESS.test(address)) {
      throw new Error(
        `${where}: program.addresses.${cluster} is not a base58 address: ${address}`,
      );
    }
    addresses[cluster] = address;
  }

  const audits = config.audits?.map((audit, index) => {
    assertText(where, `audits[${index.toString()}].auditor`, audit.auditor);
    assertUrl(where, `audits[${index.toString()}].url`, audit.url);
    if (audit.date !== undefined && !AUDIT_DATE.test(audit.date)) {
      throw new Error(
        `${where}: program.audits[${index.toString()}].date must be YYYY-MM or YYYY-MM-DD: ${audit.date}`,
      );
    }
    return {
      auditor: audit.auditor,
      url: audit.url,
      ...(audit.date !== undefined && { date: audit.date }),
    };
  });

  const status = config.status ?? "active";
  if (!STATUSES.has(status)) {
    throw new Error(
      `${where}: program.status must be "active" or "deprecated", got "${status}"`,
    );
  }
  if (config.supersededBy !== undefined) {
    if (status !== "deprecated") {
      throw new Error(
        `${where}: program.supersededBy requires program.status "deprecated"`,
      );
    }
    if (config.supersededBy === program) {
      throw new Error(
        `${where}: program.supersededBy names the program itself`,
      );
    }
    if (!knownPrograms.has(config.supersededBy)) {
      throw new Error(
        `${where}: program.supersededBy names "${config.supersededBy}", which is not a program of the graph`,
      );
    }
  }

  return {
    ...(config.displayName !== undefined && {
      displayName: config.displayName,
    }),
    ...(config.description !== undefined && {
      description: config.description,
    }),
    ...(config.repository !== undefined && { repository: config.repository }),
    ...(config.idlSource !== undefined && {
      idlSource: resolveGitFileSource(where, config.idlSource),
    }),
    addresses,
    ...(config.docs !== undefined && { docs: config.docs }),
    ...(audits !== undefined && audits.length > 0 && { audits }),
    status,
    ...(config.supersededBy !== undefined && {
      supersededBy: config.supersededBy,
    }),
  };
}

/**
 * Lists the changes between two versions of a program's metadata. Metadata
 * only describes the program, so every change is a fix. A `before` of
 * `undefined` (a release state predating metadata) yields no changes, so
 * the resolved defaults alone do not release every package; what the
 * metadata adds to a README is still caught as regenerated files.
 */
export function diffProgramMetadata(
  before: ProgramMetadata | undefined,
  after: ProgramMetadata,
): Change[] {
  if (before === undefined) {
    return [];
  }
  const previous: Partial<ProgramMetadata> = before;
  const keys = new Set([...Object.keys(previous), ...Object.keys(after)]);
  return [...keys]
    .toSorted()
    .filter(
      (key) =>
        JSON.stringify(previous[key as keyof ProgramMetadata]) !==
        JSON.stringify(after[key as keyof ProgramMetadata]),
    )
    .map((key) => ({
      level: "fix" as const,
      message: `Updated program metadata \`${key}\``,
    }));
}

/** Encodes each segment of a path, keeping its slashes. */
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

/**
 * URL of a file of a git repository at the source's commit (or tag), for
 * GitHub repositories; `null` for other hosts.
 */
export function gitFileUrl(source: GitFileSource): string | null {
  const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/.exec(
    source.repository,
  );
  if (match === null) {
    return null;
  }
  const ref = source.commit ?? source.tag ?? "HEAD";
  return `https://github.com/${match[1] ?? ""}/${match[2] ?? ""}/blob/${encodePath(ref)}/${encodePath(source.path.replace(/^\//, ""))}`;
}
