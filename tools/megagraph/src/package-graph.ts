import type { NodeKind, ProgramNode, RootNode } from "codama";
import {
  getRecordLinkablesVisitor,
  interceptVisitor,
  isNode,
  LinkableDictionary,
  NodeStack,
  pipe,
  recordNodeStackVisitor,
  visit,
  voidVisitor,
} from "codama";

/** Every link node kind Codama defines. */
const LINK_NODE_KINDS: NodeKind[] = [
  "accountLinkNode",
  "definedTypeLinkNode",
  "instructionAccountLinkNode",
  "instructionArgumentLinkNode",
  "instructionLinkNode",
  "pdaLinkNode",
  "programLinkNode",
];

/** Link kinds that can point into another program. */
const PROGRAM_QUALIFIED_LINK_KINDS = new Set<string>([
  "accountLinkNode",
  "definedTypeLinkNode",
  "instructionLinkNode",
  "pdaLinkNode",
  "programLinkNode",
]);

interface LinkLike {
  kind: string;
  name: string;
  program?: { name: string };
}

/**
 * Collects the names of the programs a program links into, other than
 * itself. Walks the plain node tree since links can be nested anywhere.
 */
export function getLinkedProgramNames(program: ProgramNode): string[] {
  const names = new Set<string>();
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const item of value) {
        walk(item);
      }
      return;
    }
    if (typeof value !== "object" || value === null) {
      return;
    }
    const node = value as Partial<LinkLike>;
    if (
      typeof node.kind === "string" &&
      PROGRAM_QUALIFIED_LINK_KINDS.has(node.kind) &&
      typeof node.name === "string"
    ) {
      const target =
        node.kind === "programLinkNode" ? node.name : node.program?.name;
      if (target !== undefined && target !== program.name) {
        names.add(target);
      }
    }
    for (const child of Object.values(value)) {
      walk(child);
    }
  };
  walk(program);
  return [...names].toSorted();
}

/**
 * Maps each program name to the sorted names of the programs it links into.
 */
export function getProgramDependencies(
  programs: ProgramNode[],
): Map<string, string[]> {
  return new Map(
    programs.map((program) => [program.name, getLinkedProgramNames(program)]),
  );
}

/**
 * A link node that does not resolve, with the path of nodes leading to it.
 */
export interface UnresolvedLink {
  kind: string;
  name: string;
  program: string | undefined;
  path: string;
}

/**
 * Finds every link node in the root that does not resolve to a node.
 */
export function findUnresolvedLinks(root: RootNode): UnresolvedLink[] {
  const linkables = new LinkableDictionary();
  visit(root, getRecordLinkablesVisitor(linkables));

  const stack = new NodeStack();
  const unresolved: UnresolvedLink[] = [];
  const visitor = pipe(
    voidVisitor(),
    (v) =>
      interceptVisitor(v, (node, next) => {
        // The program of a qualified link is itself a `programLinkNode`;
        // report the outer link only.
        const parent = stack.getPath().at(-2);
        const isLinkProgram =
          parent !== undefined && isNode(parent, LINK_NODE_KINDS);
        if (isNode(node, LINK_NODE_KINDS) && !isLinkProgram) {
          const path = stack.getPath(node.kind);
          const linkPath = path as Parameters<LinkableDictionary["getPath"]>[0];
          if (linkables.getPath(linkPath) === undefined) {
            const link = node as LinkLike;
            unresolved.push({
              kind: node.kind,
              name: link.name,
              program:
                node.kind === "programLinkNode"
                  ? link.name
                  : link.program?.name,
              path: path
                .map((pathNode) =>
                  "name" in pathNode && typeof pathNode.name === "string"
                    ? `${pathNode.kind}(${pathNode.name})`
                    : pathNode.kind,
                )
                .join(" > "),
            });
          }
        }
        next(node);
      }),
    (v) => recordNodeStackVisitor(v, stack),
  );
  visit(root, visitor);
  return unresolved;
}

/**
 * Returns the cycles in a dependency graph, each as the list of nodes that
 * form it with the first node repeated at the end. Empty when acyclic.
 */
export function findCycles(graph: Map<string, string[]>): string[][] {
  const cycles: string[][] = [];
  const state = new Map<string, "visiting" | "done">();
  const stack: string[] = [];

  const dfs = (node: string): void => {
    state.set(node, "visiting");
    stack.push(node);
    for (const dependency of graph.get(node) ?? []) {
      const dependencyState = state.get(dependency);
      if (dependencyState === "visiting") {
        cycles.push([...stack.slice(stack.indexOf(dependency)), dependency]);
      } else if (dependencyState === undefined) {
        dfs(dependency);
      }
    }
    stack.pop();
    state.set(node, "done");
  };

  for (const node of [...graph.keys()].toSorted()) {
    if (!state.has(node)) {
      dfs(node);
    }
  }
  return cycles;
}

/**
 * Returns every node reachable from `start`, excluding `start`, sorted.
 */
export function getTransitiveDependencies(
  graph: Map<string, string[]>,
  start: string,
): string[] {
  const seen = new Set<string>();
  const queue = [...(graph.get(start) ?? [])];
  for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
    if (next === start || seen.has(next)) {
      continue;
    }
    seen.add(next);
    queue.push(...(graph.get(next) ?? []));
  }
  return [...seen].toSorted();
}
