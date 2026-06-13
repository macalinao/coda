import type { DefinedTypeNode, ProgramNode, TypeNode } from "codama";
import { bottomUpTransformerVisitor, definedTypeNode } from "codama";

/**
 * Converts every {@link EventNode} on a program into a {@link DefinedTypeNode}
 * so that events are emitted as regular types by the JavaScript renderer.
 *
 * As of `@codama/nodes-from-anchor` v1.5, Anchor events are parsed into
 * dedicated `eventNode`s (separate from defined types), and
 * `@codama/renderers-js` v2 no longer renders events at all. This visitor
 * restores the previous behavior of generating a struct codec per event by
 * re-homing each event's data into the program's defined types.
 *
 * The event data is wrapped in a `hiddenPrefixTypeNode` carrying the
 * Anchor discriminator; we unwrap it so the rendered type is a plain struct
 * (matching the historical output), then drop the now-empty `events` list.
 *
 * @returns A bottom-up transformer visitor that lifts events into defined types
 *
 * @example
 * ```typescript
 * const visitor = eventsToDefinedTypesVisitor();
 * codama.update(visitor);
 * ```
 */
export function eventsToDefinedTypesVisitor() {
  return bottomUpTransformerVisitor([
    {
      select: "[programNode]",
      transform: (node) => {
        const program = node as ProgramNode;
        if (!program.events || program.events.length === 0) {
          return node;
        }

        const eventTypes: DefinedTypeNode[] = program.events.map((event) => {
          // Event data is a hiddenPrefixTypeNode wrapping the struct with the
          // Anchor discriminator prefix. Unwrap it to emit a plain struct.
          const type: TypeNode =
            event.data.kind === "hiddenPrefixTypeNode"
              ? event.data.type
              : event.data;
          return definedTypeNode({
            docs: event.docs,
            name: event.name,
            type,
          });
        });

        return {
          ...program,
          definedTypes: [...program.definedTypes, ...eventTypes],
          events: [],
        };
      },
    },
  ]);
}
