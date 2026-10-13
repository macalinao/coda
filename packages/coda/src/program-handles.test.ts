import { describe, expect, test } from "bun:test";
import {
  accountValueNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  programLinkNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  visit,
} from "codama";
import {
  constant,
  definePdas,
  programHandle,
  variable,
} from "./program-handles.ts";

/** Compares nodes structurally; their generic types differ. */
function json(value: unknown): string {
  return JSON.stringify(value);
}

const program = programHandle("quarryMine");
const pdas = definePdas(program, {
  miner: {
    docs: ["A miner"],
    seeds: [
      constant("Miner"),
      variable("quarry", publicKeyTypeNode()),
      variable("authority", publicKeyTypeNode()),
    ],
  },
  rewarder: { seeds: [constant("Rewarder")] },
});

describe("programHandle", () => {
  test("creates program-qualified links", () => {
    expect(json(program.link)).toBe(json(programLinkNode("quarryMine")));
    expect(json(program.pda("quarry"))).toBe(
      json(pdaLinkNode("quarry", "quarryMine")),
    );
  });
});

describe("definePdas", () => {
  test("links and values are qualified with the program", () => {
    expect(json(pdas.miner.link)).toBe(
      json(pdaLinkNode("miner", "quarryMine")),
    );
    expect(
      json(
        pdas.miner.value({
          authority: accountValueNode("mm"),
          quarry: accountValueNode("quarry"),
        }),
      ),
    ).toBe(
      // Seed values follow the PDA's seed order.
      json(
        pdaValueNode(pdaLinkNode("miner", "quarryMine"), [
          pdaSeedValueNode("quarry", accountValueNode("quarry")),
          pdaSeedValueNode("authority", accountValueNode("mm")),
        ]),
      ),
    );
    expect(json(pdas.rewarder.value())).toBe(
      json(pdaValueNode(pdaLinkNode("rewarder", "quarryMine"), [])),
    );
  });

  test("the visitor adds the PDAs to their program", () => {
    const root = visit(
      rootNode(
        programNode({
          name: "quarryMine",
          publicKey: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
        }),
      ),
      pdas.visitor,
    ) as ReturnType<typeof rootNode>;
    const added = root.program.pdas ?? [];
    expect(json(added.map((pda) => pda.name))).toBe(
      json(["miner", "rewarder"]),
    );
    expect(json(added[0]?.docs)).toBe(json(["A miner"]));
  });
});
