import { describe, expect, test } from "bun:test";
import {
  accountNode,
  accountValueNode,
  definedTypeNode,
  enumEmptyVariantTypeNode,
  enumTypeNode,
  errorNode,
  instructionAccountNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  pdaNode,
  programNode,
  publicKeyTypeNode,
  structFieldTypeNode,
  structTypeNode,
  variablePdaSeedNode,
} from "codama";
import { diffProgram, maxLevel } from "./classify.ts";

function account(name: string, isOptional = false) {
  return instructionAccountNode({
    name,
    isSigner: false,
    isWritable: false,
    isOptional,
  });
}

const base = programNode({
  name: "quarryMine",
  publicKey: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
  accounts: [
    accountNode({
      name: "miner",
      docs: ["A miner"],
      data: structTypeNode([
        structFieldTypeNode({ name: "quarry", type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: "balance", type: numberTypeNode("u64") }),
      ]),
    }),
  ],
  instructions: [
    instructionNode({
      name: "claimRewards",
      accounts: [account("miner"), account("quarry")],
      arguments: [
        instructionArgumentNode({
          name: "amount",
          type: numberTypeNode("u64"),
        }),
      ],
    }),
  ],
  definedTypes: [
    definedTypeNode({
      name: "kind",
      type: enumTypeNode([
        enumEmptyVariantTypeNode("a"),
        enumEmptyVariantTypeNode("b"),
      ]),
    }),
  ],
  pdas: [
    pdaNode({
      name: "miner",
      seeds: [
        variablePdaSeedNode("quarry", publicKeyTypeNode()),
        variablePdaSeedNode("authority", publicKeyTypeNode()),
      ],
    }),
  ],
  errors: [errorNode({ name: "unauthorized", code: 6000, message: "No" })],
});

/** The parts of the fixture the tests edit, as plain JSON. */
interface Draft {
  publicKey: string;
  version: string;
  accounts: { docs: string[]; data: { fields: unknown[] } }[];
  instructions: { name: string; accounts: unknown[]; arguments: unknown[] }[];
  definedTypes: { type: { variants: unknown[] } }[];
  pdas: { name: string }[];
  errors: unknown[];
}

/** Returns a copy of the fixture with `recipe` applied. */
function edit(recipe: (draft: Draft) => void): unknown {
  const draft = structuredClone(base) as unknown as Draft;
  recipe(draft);
  return draft;
}

/** The first element, asserting it exists. */
function first<T>(items: T[]): T {
  const [item] = items;
  if (item === undefined) {
    throw new Error("empty fixture list");
  }
  return item;
}

function classify(before: unknown, after: unknown) {
  const changes = diffProgram(before, after);
  return {
    level: maxLevel(changes.map((change) => change.level)),
    messages: changes.map((change) => change.message),
  };
}

describe("diffProgram", () => {
  test("reports nothing for identical programs", () => {
    expect(
      diffProgram(
        base,
        edit(() => undefined),
      ),
    ).toEqual([]);
  });

  test("adding an instruction or an error is a feature", () => {
    const result = classify(
      base,
      edit((draft) => {
        draft.instructions.push({
          ...instructionNode({ name: "claimRewardsV2" }),
          accounts: [],
          arguments: [],
        });
        draft.errors.push(
          errorNode({ name: "paused", code: 6001, message: "Paused" }),
        );
      }),
    );
    expect(result).toEqual({
      level: "feature",
      messages: ["Added error `paused`", "Added instruction `claimRewardsV2`"],
    });
  });

  test("removing an instruction is breaking", () => {
    const result = classify(
      base,
      edit((draft) => {
        draft.instructions = [];
      }),
    );
    expect(result).toEqual({
      level: "breaking",
      messages: ["Removed instruction `claimRewards`"],
    });
  });

  test("renaming a PDA is breaking (a removal and an addition)", () => {
    const result = classify(
      base,
      edit((draft) => {
        first(draft.pdas).name = "quarryMiner";
      }),
    );
    expect(result).toEqual({
      level: "breaking",
      messages: ["Removed PDA `miner`", "Added PDA `quarryMiner`"],
    });
  });

  test("reordering account fields is breaking", () => {
    const result = classify(
      base,
      edit((draft) => {
        const data = first(draft.accounts).data;
        const [quarry, balance] = data.fields;
        data.fields = [balance, quarry];
      }),
    );
    expect(result.level).toBe("breaking");
    expect(result.messages).toContain("Reordered fields of account `miner`");
  });

  test("adding a field to an account is breaking", () => {
    const result = classify(
      base,
      edit((draft) => {
        first(draft.accounts).data.fields.push(
          structFieldTypeNode({ name: "bump", type: numberTypeNode("u8") }),
        );
      }),
    );
    expect(result).toEqual({
      level: "breaking",
      messages: ["Added field `bump` of account `miner`"],
    });
  });

  test("changing an argument type is breaking", () => {
    const result = classify(
      base,
      edit((draft) => {
        first(draft.instructions).arguments = [
          instructionArgumentNode({
            name: "amount",
            type: numberTypeNode("u32"),
          }),
        ];
      }),
    );
    expect(result).toEqual({
      level: "breaking",
      messages: [
        "Changed format of argument `amount` of instruction `claimRewards`",
      ],
    });
  });

  test("appending an enum variant is a feature, inserting one is breaking", () => {
    const appended = edit((draft) => {
      first(draft.definedTypes).type.variants.push(
        enumEmptyVariantTypeNode("c"),
      );
    });
    const inserted = edit((draft) => {
      first(draft.definedTypes).type.variants.unshift(
        enumEmptyVariantTypeNode("c"),
      );
    });
    expect(classify(base, appended).level).toBe("feature");
    expect(classify(base, inserted).level).toBe("breaking");
  });

  test("docs-only changes are fixes", () => {
    const result = classify(
      base,
      edit((draft) => {
        first(draft.accounts).docs = ["A miner of a quarry"];
      }),
    );
    expect(result).toEqual({
      level: "fix",
      messages: ["Updated docs of account `miner`"],
    });
  });

  test("instruction accounts: optional or defaulted is a feature, required is breaking", () => {
    const optional = edit((draft) => {
      first(draft.instructions).accounts = [
        account("miner", true),
        account("quarry"),
      ];
    });
    expect(classify(base, optional).level).toBe("feature");
    expect(classify(optional, base)).toEqual({
      level: "breaking",
      messages: ["Made account `miner` of instruction `claimRewards` required"],
    });

    const defaulted = edit((draft) => {
      first(draft.instructions).accounts = [
        instructionAccountNode({
          name: "miner",
          isSigner: false,
          isWritable: false,
          defaultValue: accountValueNode("quarry"),
        }),
        account("quarry"),
      ];
    });
    expect(classify(base, defaulted).level).toBe("feature");
    expect(classify(defaulted, base).level).toBe("breaking");

    const appendOptional = edit((draft) => {
      first(draft.instructions).accounts.push(account("rent", true));
    });
    const appendRequired = edit((draft) => {
      first(draft.instructions).accounts.push(account("rent"));
    });
    expect(classify(base, appendOptional).level).toBe("feature");
    expect(classify(base, appendRequired).level).toBe("breaking");
  });

  test("changing the program address is breaking, its IDL version a fix", () => {
    const moved = edit((draft) => {
      draft.publicKey = "11111111111111111111111111111111";
    });
    const versioned = edit((draft) => {
      draft.version = "9.9.9";
    });
    expect(classify(base, moved).level).toBe("breaking");
    expect(classify(base, versioned)).toEqual({
      level: "fix",
      messages: ["Updated program version"],
    });
  });
});
