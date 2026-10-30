/**
 * Lets the `programAddress` override of generated instruction builders accept
 * an explicit `undefined`, so the generated code type-checks under
 * `exactOptionalPropertyTypes`.
 *
 * Since `@codama/renderers-js` 2.7.0, the generated program plugin forwards a
 * program address override to every instruction builder as
 * `{ programAddress: instructionConfig?.programAddress ?? config.programAddress }`,
 * whose value is `undefined` when neither config sets it. The builders declare
 * the override as `programAddress?: TProgramAddress | { ... }` without
 * `| undefined`, so with `exactOptionalPropertyTypes` every forwarding call
 * fails with TS2379. The `find*Pda` functions, which `fetch*FromSeeds` forwards
 * to the same way, already declare `| undefined`; this brings the instruction
 * builders in line with them.
 *
 * Widening the parameter is safe at runtime: the builders resolve the override
 * with `config?.programAddress ?? <PROGRAM_ADDRESS>`, so an explicit
 * `undefined` falls back to the program address constant just like an omitted
 * one.
 *
 * Should be upstreamed to `@codama/renderers-js`, after which this pass becomes
 * a no-op and can be removed.
 */
const PROGRAM_ADDRESS_OVERRIDE =
  "programAddress?: TProgramAddress | { readonly address: TProgramAddress }";

/**
 * Matched as a literal, not a pattern. The pass runs on the raw renderer
 * output, before any formatting, where the upstream template always emits this
 * exact text, and a fixed search cannot backtrack.
 */
const BUILDER_PROGRAM_ADDRESS_CONFIG = `config?: { ${PROGRAM_ADDRESS_OVERRIDE} }`;

export function allowUndefinedProgramAddress(code: string): string {
  return code.replaceAll(
    BUILDER_PROGRAM_ADDRESS_CONFIG,
    `config?: { ${PROGRAM_ADDRESS_OVERRIDE} | undefined }`,
  );
}
