import type {
  AccountLinkNode,
  ConstantPdaSeedNode,
  DefinedTypeLinkNode,
  DocsInput,
  Node,
  PdaLinkNode,
  PdaNode,
  PdaSeedValueNode,
  PdaValueNode,
  ProgramLinkNode,
  TypeNode,
  VariablePdaSeedNode,
  Visitor,
} from "codama";
import {
  accountLinkNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  definedTypeLinkNode,
  pdaLinkNode,
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  programLinkNode,
  variablePdaSeedNode,
} from "codama";

/**
 * A typed reference to a program, by its Codama name.
 *
 * Every link a handle creates is qualified with the program's name, so it
 * resolves to this program no matter which program's config it is used in.
 * Names that only exist in the IDL (e.g. an account type) cannot be checked
 * at the type level; the megagraph build reports unresolved links precisely.
 */
export interface ProgramHandle<TName extends string = string> {
  /** The Codama name of the program, e.g. `quarryMine`. */
  readonly name: TName;
  /**
   * A link to the program. Also usable as an instruction account default
   * value, which resolves to the program's address.
   */
  readonly link: ProgramLinkNode;
  /**
   * A link to a PDA the program's IDL defines. PDAs declared in a config
   * with {@link definePdas} have typed handles instead.
   */
  pda(name: string): PdaLinkNode<ProgramLinkNode>;
  /** A link to an account the program's IDL defines. */
  account(name: string): AccountLinkNode<ProgramLinkNode>;
  /** A link to a defined type the program's IDL defines. */
  definedType(name: string): DefinedTypeLinkNode<ProgramLinkNode>;
}

/**
 * Creates a {@link ProgramHandle}. Program configs export one so that other
 * configs can link to the program.
 *
 * @example
 * ```ts
 * export const program = programHandle("farms");
 * // In another program's config:
 * { account: "farmsProgram", defaultValue: farms.program.link }
 * ```
 */
export function programHandle<const TName extends string>(
  name: TName,
): ProgramHandle<TName> {
  return {
    name,
    link: programLinkNode(name),
    pda: (pdaName) => pdaLinkNode(pdaName, programLinkNode(name)),
    account: (accountName) =>
      accountLinkNode(accountName, programLinkNode(name)),
    definedType: (typeName) =>
      definedTypeLinkNode(typeName, programLinkNode(name)),
  };
}

declare const SEED_NAME: unique symbol;

/**
 * A variable PDA seed whose name is known at the type level, so that
 * {@link PdaHandle.value} can require exactly the PDA's variable seeds.
 */
export type NamedVariablePdaSeedNode<
  TName extends string = string,
  TType extends TypeNode = TypeNode,
> = VariablePdaSeedNode<TType> & { readonly [SEED_NAME]: TName };

/**
 * A variable PDA seed. Use instead of `variablePdaSeedNode` in
 * {@link definePdas}.
 */
export function variable<
  const TName extends string,
  const TType extends TypeNode,
>(
  name: TName,
  type: TType,
  docs?: DocsInput,
): NamedVariablePdaSeedNode<TName, TType> {
  return variablePdaSeedNode(name, type, docs) as NamedVariablePdaSeedNode<
    TName,
    TType
  >;
}

/** A constant UTF-8 PDA seed, e.g. `constant("Miner")`. */
export function constant(value: string): ConstantPdaSeedNode {
  return constantPdaSeedNodeFromString("utf8", value);
}

/** The seeds of a PDA declared with {@link definePdas}. */
export type PdaSeeds = readonly (
  | ConstantPdaSeedNode
  | NamedVariablePdaSeedNode
)[];

/** A PDA declared with {@link definePdas}. */
export interface PdaDefinition<TSeeds extends PdaSeeds = PdaSeeds> {
  readonly docs?: readonly string[];
  readonly seeds: TSeeds;
}

/** The names of the variable seeds of a PDA. */
export type PdaSeedNames<TSeeds extends PdaSeeds> = Extract<
  TSeeds[number],
  NamedVariablePdaSeedNode
>[typeof SEED_NAME];

/** A value for each variable seed of a PDA. */
export type PdaSeedValues<TSeeds extends PdaSeeds> = {
  readonly [K in PdaSeedNames<TSeeds>]: PdaSeedValueNode["value"];
};

/** A typed reference to a PDA declared with {@link definePdas}. */
export interface PdaHandle<
  TProgram extends string = string,
  TName extends string = string,
  TSeeds extends PdaSeeds = PdaSeeds,
> {
  readonly program: TProgram;
  readonly name: TName;
  /** A program-qualified link to the PDA. */
  readonly link: PdaLinkNode<ProgramLinkNode>;
  /** The PDA node itself. */
  readonly node: PdaNode;
  /**
   * A PDA value, e.g. an instruction account default. Takes exactly one
   * value per variable seed; a PDA without variable seeds takes none.
   */
  value(
    ...seeds: [PdaSeedNames<TSeeds>] extends [never]
      ? []
      : [seeds: PdaSeedValues<TSeeds>]
  ): PdaValueNode;
}

/** The handles returned by {@link definePdas}. */
export type PdaHandles<
  TProgram extends string,
  TPdas extends Record<string, PdaDefinition>,
> = {
  readonly [K in keyof TPdas & string]: PdaHandle<
    TProgram,
    K,
    TPdas[K]["seeds"]
  >;
} & {
  /** A visitor adding the PDAs to their program. */
  readonly visitor: Visitor<Node | null, "rootNode">;
};

/**
 * Declares PDAs of a program and returns typed handles to them.
 *
 * The PDA names and the names of their variable seeds are literal types, so a
 * misspelled PDA or a missing seed value is a type error rather than an
 * unresolved link at generation time.
 *
 * @example
 * ```ts
 * export const pdas = definePdas(program, {
 *   miner: {
 *     seeds: [
 *       constant("Miner"),
 *       variable("quarry", publicKeyTypeNode()),
 *       variable("authority", publicKeyTypeNode()),
 *     ],
 *   },
 * });
 * pdas.miner.value({
 *   quarry: accountValueNode("quarry"),
 *   authority: accountValueNode("mm"),
 * });
 * ```
 */
export function definePdas<
  const TProgram extends string,
  const TPdas extends Record<string, PdaDefinition> & { visitor?: never },
>(
  program: TProgram | ProgramHandle<TProgram>,
  pdas: TPdas,
): PdaHandles<TProgram, TPdas> {
  const programName: TProgram =
    typeof program === "string" ? program : program.name;
  const handles: Record<string, PdaHandle> = {};
  for (const [name, definition] of Object.entries(pdas)) {
    const link = pdaLinkNode(name, programLinkNode(programName));
    handles[name] = {
      program: programName,
      name,
      link,
      node: pdaNode({
        name,
        seeds: [...definition.seeds],
        ...(definition.docs && { docs: [...definition.docs] }),
      }),
      value: (...args: [] | [Record<string, PdaSeedValueNode["value"]>]) => {
        const values = args[0] ?? {};
        // Emit the seed values in the order the PDA declares its seeds.
        const seeds = definition.seeds.flatMap((seed) => {
          if (seed.kind !== "variablePdaSeedNode") {
            return [];
          }
          const value = values[seed.name];
          return value === undefined
            ? []
            : [pdaSeedValueNode(seed.name, value)];
        });
        return pdaValueNode(link, seeds);
      },
    };
  }
  const visitor = addPdasVisitor({
    [programName]: Object.values(handles).map((handle) => handle.node),
  });
  return { ...handles, visitor } as PdaHandles<TProgram, TPdas>;
}
