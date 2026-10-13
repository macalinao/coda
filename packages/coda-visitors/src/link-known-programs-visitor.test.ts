import { describe, expect, test } from "bun:test";
import {
  accountValueNode,
  instructionAccountNode,
  instructionNode,
  pdaNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  variablePdaSeedNode,
  visit,
} from "codama";
import { linkKnownProgramsVisitor } from "./link-known-programs-visitor.ts";
import { associatedTokenAccountValueNode } from "./nodes/associated-token-account-value-node.ts";
import { TOKEN_PROGRAM_VALUE_NODE } from "./nodes/program-value-nodes.ts";

const local = programNode({
  name: "quarryRedeemer",
  publicKey: "QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9",
  instructions: [
    instructionNode({
      name: "redeemTokens",
      accounts: [
        instructionAccountNode({
          name: "tokenProgram",
          isSigner: false,
          isWritable: false,
          defaultValue: TOKEN_PROGRAM_VALUE_NODE,
        }),
        instructionAccountNode({
          name: "iouSource",
          isSigner: false,
          isWritable: true,
          defaultValue: associatedTokenAccountValueNode({
            owner: accountValueNode("sourceAuthority"),
            mint: accountValueNode("iouMint"),
          }),
        }),
      ],
    }),
  ],
});

const token = programNode({
  name: "token",
  publicKey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
});
const associatedToken = programNode({
  name: "associatedToken",
  publicKey: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  pdas: [
    pdaNode({
      name: "associatedToken",
      seeds: [
        variablePdaSeedNode("owner", publicKeyTypeNode()),
        variablePdaSeedNode("tokenProgram", publicKeyTypeNode()),
        variablePdaSeedNode("mint", publicKeyTypeNode()),
      ],
    }),
  ],
});

function defaults(root: unknown): unknown[] {
  const [instruction] = (
    root as {
      program: { instructions: { accounts: { defaultValue: unknown }[] }[] };
    }
  ).program.instructions;
  return (instruction?.accounts ?? []).map((account) => account.defaultValue);
}

describe("linkKnownProgramsVisitor", () => {
  test("links program addresses and the associated token PDA when the programs are in the root", () => {
    const root = visit(
      rootNode(local, [token, associatedToken]),
      linkKnownProgramsVisitor(["token", "associatedToken"]),
    );
    const [tokenProgram, iouSource] = defaults(root) as [
      { kind: string; name: string },
      {
        kind: string;
        pda: { kind: string; name: string; program?: { name: string } };
      },
    ];
    expect(tokenProgram).toMatchObject({
      kind: "programLinkNode",
      name: "token",
    });
    expect(iouSource.pda).toMatchObject({
      kind: "pdaLinkNode",
      name: "associatedToken",
      program: { name: "associatedToken" },
    });
  });

  test("leaves a root without those programs unchanged", () => {
    const before = rootNode(local);
    const after = visit(
      before,
      linkKnownProgramsVisitor(["token", "associatedToken"]),
    );
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });
});
