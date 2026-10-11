import type { ProgramMetadataConfig } from "./define-program.ts";
import type { ProgramMetadata } from "./program-metadata.ts";
import { describe, expect, test } from "bun:test";
import { programNode } from "codama";
import {
  diffProgramMetadata,
  gitFileUrl,
  resolveProgramMetadata,
} from "./program-metadata.ts";
import { renderProgramSection } from "./templates.ts";

const MAINNET = "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB";
const DEVNET = "11111111111111111111111111111111";
const COMMIT = "0123456789abcdef0123456789abcdef01234567";

const resolve = (
  config: ProgramMetadataConfig | undefined,
  knownPrograms: string[] = ["quarryMine", "quarryMineV2"],
) =>
  resolveProgramMetadata({
    config,
    program: "quarryMine",
    publicKey: MAINNET,
    knownPrograms: new Set(knownPrograms),
    where: "programs/quarry/mine",
  });

describe("resolveProgramMetadata", () => {
  test("defaults the mainnet address to the IDL's and the status to active", () => {
    expect(resolve(undefined)).toEqual({
      addresses: { mainnet: MAINNET },
      status: "active",
    });
  });

  test("emits configured fields in a fixed order, and nothing undefined", () => {
    const metadata = resolve({
      status: "deprecated",
      supersededBy: "quarryMineV2",
      audits: [{ url: "https://example.com/audit.pdf", auditor: "Firm" }],
      docs: "https://docs.example.com",
      addresses: { devnet: DEVNET, mainnet: MAINNET },
      idlSource: {
        path: "idl.json",
        commit: COMMIT,
        repository: "https://github.com/QuarryProtocol/quarry",
      },
      repository: "https://github.com/QuarryProtocol/quarry",
      description: "Liquidity mining.",
      displayName: "Quarry Mine",
    });
    expect(Object.keys(metadata)).toEqual([
      "displayName",
      "description",
      "repository",
      "idlSource",
      "addresses",
      "docs",
      "audits",
      "status",
      "supersededBy",
    ]);
    expect(Object.keys(metadata.idlSource ?? {})).toEqual([
      "repository",
      "commit",
      "path",
    ]);
    expect(Object.keys(metadata.addresses)).toEqual(["mainnet", "devnet"]);
    expect(JSON.stringify(metadata)).not.toContain("null");
  });

  test("rejects a mainnet address that differs from the IDL's", () => {
    expect(() => resolve({ addresses: { mainnet: DEVNET } })).toThrow(
      "programs/quarry/mine: program.addresses.mainnet (11111111111111111111111111111111) does not match the IDL's address",
    );
  });

  test("rejects malformed addresses, URLs, commits and dates", () => {
    expect(() => resolve({ addresses: { devnet: "not-an-address" } })).toThrow(
      "not a base58 address",
    );
    expect(() =>
      resolve({ addresses: { testnet: DEVNET } as Record<string, string> }),
    ).toThrow("program.addresses.testnet is not a known cluster");
    expect(() => resolve({ repository: "github.com/x/y" })).toThrow(
      "program.repository is not a URL",
    );
    expect(() => resolve({ docs: "http://example.com" })).toThrow(
      "program.docs must be an https URL",
    );
    expect(() =>
      resolve({
        idlSource: {
          repository: "https://github.com/x/y",
          commit: "abc1234",
          path: "idl.json",
        },
      }),
    ).toThrow("full 40-character commit hash");
    expect(() =>
      resolve({
        audits: [
          { auditor: "Firm", url: "https://example.com", date: "June 2021" },
        ],
      }),
    ).toThrow("program.audits[0].date must be YYYY-MM or YYYY-MM-DD");
    expect(() => resolve({ displayName: " " })).toThrow(
      "program.displayName must not be empty",
    );
  });

  test("supersededBy requires a deprecated status and a known, other program", () => {
    expect(() => resolve({ supersededBy: "quarryMineV2" })).toThrow(
      'requires program.status "deprecated"',
    );
    expect(() =>
      resolve({ status: "deprecated", supersededBy: "quarryMine" }),
    ).toThrow("names the program itself");
    expect(() =>
      resolve({ status: "deprecated", supersededBy: "unknownProgram" }),
    ).toThrow('names "unknownProgram", which is not a program of the graph');
    expect(
      resolve({ status: "deprecated", supersededBy: "quarryMineV2" })
        .supersededBy,
    ).toBe("quarryMineV2");
  });
});

describe("diffProgramMetadata", () => {
  const base: ProgramMetadata = {
    addresses: { mainnet: MAINNET },
    status: "active",
  };

  test("reports every changed key as a fix", () => {
    expect(
      diffProgramMetadata(base, {
        ...base,
        addresses: { mainnet: MAINNET, devnet: DEVNET },
        status: "deprecated",
        docs: "https://docs.example.com",
      }),
    ).toEqual([
      { level: "fix", message: "Updated program metadata `addresses`" },
      { level: "fix", message: "Updated program metadata `docs`" },
      { level: "fix", message: "Updated program metadata `status`" },
    ]);
    expect(diffProgramMetadata(base, { ...base })).toEqual([]);
  });

  test("ignores a release state that predates metadata", () => {
    expect(diffProgramMetadata(undefined, base)).toEqual([]);
  });
});

describe("gitFileUrl", () => {
  test("links GitHub files at the commit, else the tag", () => {
    expect(
      gitFileUrl({
        repository: "https://github.com/solana-program/token",
        tag: "js@v0.17.0",
        commit: COMMIT,
        path: "idl.json",
      }),
    ).toBe(`https://github.com/solana-program/token/blob/${COMMIT}/idl.json`);
    expect(
      gitFileUrl({
        repository: "https://github.com/solana-program/token.git",
        tag: "js@v0.17.0",
        path: "/program/idl.json",
      }),
    ).toBe(
      "https://github.com/solana-program/token/blob/js%40v0.17.0/program/idl.json",
    );
    expect(
      gitFileUrl({ repository: "https://gitlab.com/x/y", path: "idl.json" }),
    ).toBeNull();
  });
});

describe("renderProgramSection", () => {
  const mirror = { repository: "org/mirror", defaultBranch: "main" };
  const program = programNode({ name: "quarryMine", publicKey: MAINNET });

  test("renders only the name, address and reference without metadata", () => {
    expect(
      renderProgramSection({
        program,
        metadata: resolve(undefined),
        docsFile: "docs/quarry-mine.md",
        mirror,
      }),
    ).toBe(
      [
        "## Program",
        "",
        "- Name: `quarryMine`",
        `- Address: \`${MAINNET}\``,
        "- Reference: [docs/quarry-mine.md](./docs/quarry-mine.md)",
      ].join("\n"),
    );
  });

  test("renders addresses, sources, audits and the successor", () => {
    expect(
      renderProgramSection({
        program,
        metadata: resolve({
          displayName: "Quarry Mine",
          description: "Liquidity mining.",
          repository: "https://github.com/QuarryProtocol/quarry",
          idlSource: {
            repository: "https://github.com/QuarryProtocol/quarry",
            tag: "v5.0.0",
            commit: COMMIT,
            path: "idls/quarry_mine.json",
          },
          addresses: { devnet: DEVNET },
          audits: [
            {
              auditor: "Firm",
              url: "https://example.com/audit.pdf",
              date: "2021-06",
            },
          ],
          status: "deprecated",
          supersededBy: "quarryMineV2",
        }),
        docsFile: "docs/quarry-mine.md",
        mirror,
        successor: {
          program: "quarryMineV2",
          packageName: "@solana-programs/quarry-mine-v2",
          path: "packages/quarry/mine-v2",
        },
      }),
    ).toBe(
      [
        "## Program",
        "",
        "**Quarry Mine**: Liquidity mining.",
        "",
        "- Name: `quarryMine`",
        "- Status: deprecated, superseded by `quarryMineV2` ([`@solana-programs/quarry-mine-v2`](https://www.npmjs.com/package/@solana-programs/quarry-mine-v2) ([source](https://github.com/org/mirror/tree/main/packages/quarry/mine-v2)))",
        `- Address: \`${MAINNET}\``,
        `- Devnet address: \`${DEVNET}\``,
        "- Source: https://github.com/QuarryProtocol/quarry",
        `- IDL: [\`idls/quarry_mine.json\`](https://github.com/QuarryProtocol/quarry/blob/${COMMIT}/idls/quarry_mine.json) of https://github.com/QuarryProtocol/quarry (tag \`v5.0.0\`, commit \`0123456\`)`,
        "- Audits:",
        "  - [Firm](https://example.com/audit.pdf) (2021-06)",
        "- Reference: [docs/quarry-mine.md](./docs/quarry-mine.md)",
      ].join("\n"),
    );
  });
});
