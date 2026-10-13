import type {
  InstructionInputValueNode,
  Node,
  ProgramNode,
  RootNode,
  Visitor,
} from "codama";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  isNode,
  pdaLinkNode,
  pdaValueNode,
  programLinkNode,
  rootNodeVisitor,
  visit,
} from "codama";
import { associatedTokenAccountPdaNode } from "./nodes/associated-token-account-value-node.ts";

/** Name of the associated token account PDA in the SPL Token Codama IDL. */
const ASSOCIATED_TOKEN_PDA = "associatedToken";

function programsOf(root: RootNode): ProgramNode[] {
  return [root.program, ...(root.additionalPrograms ?? [])];
}

/**
 * Replaces inline program addresses and the inline associated token account
 * PDA with links, for the programs named in `programNames` that are present
 * in the root.
 *
 * - An instruction account default that is the address of one of those
 *   programs (e.g. `TOKEN_PROGRAM_VALUE_NODE` for `tokenProgram`) becomes a
 *   `programLinkNode`, so generated code imports the program's address
 *   constant instead of inlining it.
 * - A PDA value built from `associatedTokenAccountValueNode` becomes a
 *   `pdaValueNode` linked to the `associatedToken` PDA of the program that
 *   declares it, so generated code calls that package's
 *   `findAssociatedTokenPda`.
 *
 * Programs missing from the root are left alone, so a root without them
 * (e.g. a plain `coda generate`) renders exactly as before. Addresses inside
 * PDA seed values stay inline: seeds cannot hold program links.
 */
export function linkKnownProgramsVisitor(
  programNames: readonly string[],
): Visitor<Node | null, "rootNode"> {
  return rootNodeVisitor((root): Node | null => {
    const known = programsOf(root).filter((program) =>
      programNames.includes(program.name),
    );
    if (known.length === 0) {
      return root;
    }
    const programByAddress = new Map(
      known.map((program) => [program.publicKey, program.name]),
    );
    const associatedTokenProgram = known.find((program) =>
      (program.pdas ?? []).some((pda) => pda.name === ASSOCIATED_TOKEN_PDA),
    );

    const linkDefault = (
      value: InstructionInputValueNode,
    ): InstructionInputValueNode => {
      if (isNode(value, "publicKeyValueNode")) {
        const name = programByAddress.get(value.publicKey);
        return name === undefined ? value : programLinkNode(name);
      }
      if (isNode(value, "conditionalValueNode")) {
        return {
          ...value,
          ...(value.ifTrue && { ifTrue: linkDefault(value.ifTrue) }),
          ...(value.ifFalse && { ifFalse: linkDefault(value.ifFalse) }),
        };
      }
      return value;
    };

    return visit(
      root,
      bottomUpTransformerVisitor([
        {
          select: "[pdaValueNode]",
          transform: (node) => {
            assertIsNode(node, "pdaValueNode");
            const pda = node.pda;
            if (
              associatedTokenProgram === undefined ||
              !isNode(pda, "pdaNode") ||
              pda.name !== associatedTokenAccountPdaNode.name ||
              pda.programId !== associatedTokenAccountPdaNode.programId
            ) {
              return node;
            }
            return pdaValueNode(
              pdaLinkNode(ASSOCIATED_TOKEN_PDA, associatedTokenProgram.name),
              node.seeds,
            );
          },
        },
        {
          select: "[instructionAccountNode]",
          transform: (node) => {
            assertIsNode(node, "instructionAccountNode");
            const account = node;
            if (account.defaultValue === undefined) {
              return node;
            }
            return {
              ...account,
              defaultValue: linkDefault(account.defaultValue),
            };
          },
        },
      ]),
    );
  });
}
