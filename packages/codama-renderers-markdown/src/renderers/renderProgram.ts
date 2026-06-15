import type { ProgramNode } from "@codama/nodes";
import type { RenderContext } from "../types.js";
import {
  getAllAccounts,
  getAllDefinedTypes,
  getAllErrors,
  getAllInstructionsWithSubs,
  getAllPdas,
} from "@codama/nodes";
import { renderAccount } from "./renderAccount.js";
import { renderError } from "./renderError.js";
import { renderInstruction } from "./renderInstruction.js";
import { renderPda } from "./renderPda.js";
import { renderDefinedType } from "./renderType.js";

const CAPITAL_LETTER_REGEX = /([A-Z])/g;
const FIRST_CHAR_REGEX = /^./;
const UNDERSCORE_REGEX = /_/g;

function toAnchor(name: string): string {
  return name.replace(UNDERSCORE_REGEX, "-");
}

/**
 * Renders a `## Title` section followed by one rendered line per item, each
 * separated by a blank line. Returns an empty array when there are no items.
 */
function renderSection<T>(
  title: string,
  items: readonly T[],
  renderItem: (item: T) => string,
): string[] {
  if (items.length === 0) {
    return [];
  }
  const lines = [`## ${title}`, ""];
  for (const item of items) {
    lines.push(renderItem(item));
    lines.push("");
  }
  return lines;
}

function renderTableOfContents(
  accounts: readonly { name: string }[],
  instructions: readonly { name: string }[],
  pdas: readonly { name: string }[],
  types: readonly { name: string }[],
  hasErrors: boolean,
): string[] {
  const lines = ["## Table of Contents", ""];

  if (accounts.length > 0) {
    lines.push("- [Accounts](#accounts)");
    for (const account of accounts) {
      lines.push(`  - [${account.name}](#${toAnchor(account.name)})`);
    }
  }

  if (instructions.length > 0) {
    lines.push("- [Instructions](#instructions)");
    for (const instruction of instructions) {
      lines.push(`  - [${instruction.name}](#${toAnchor(instruction.name)})`);
    }
  }

  if (pdas.length > 0) {
    lines.push("- [PDAs](#pdas)");
    for (const pda of pdas) {
      lines.push(`  - [${pda.name}](#${toAnchor(pda.name)})`);
    }
  }

  if (types.length > 0) {
    lines.push("- [Types](#types)");
    for (const type of types) {
      lines.push(`  - [${type.name}](#${toAnchor(type.name)})`);
    }
  }

  if (hasErrors) {
    lines.push("- [Errors](#errors)");
  }

  lines.push("");
  return lines;
}

export function renderProgram(
  program: ProgramNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  // Title - convert camelCase to Title Case
  const titleCase = program.name
    .replace(CAPITAL_LETTER_REGEX, " $1") // Add space before capitals
    .replace(FIRST_CHAR_REGEX, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
  lines.push(`# ${titleCase} Program`);
  lines.push("");

  // NPM Package Badge (if provided)
  if (context.options.npmPackageName) {
    const packageName = context.options.npmPackageName;
    const encodedPackageName = encodeURIComponent(packageName);
    lines.push(
      `[![npm version](https://badge.fury.io/js/${encodedPackageName}.svg)](https://www.npmjs.com/package/${encodedPackageName})`,
    );
    lines.push("");
  }

  // Description
  if (program.docs && program.docs.length > 0) {
    lines.push("## Description");
    lines.push("");
    for (const doc of program.docs) {
      lines.push(doc);
      lines.push("");
    }
  }

  // Program ID
  if (program.publicKey) {
    const address =
      context.options.formatAddress?.(program.publicKey) ?? program.publicKey;
    lines.push(`- Program ID: \`${address}\``);
  }

  // TypeScript Client Link (if NPM package provided)
  if (context.options.npmPackageName) {
    const packageName = context.options.npmPackageName;
    lines.push(
      `- TypeScript Client: [\`${packageName}\`](https://www.npmjs.com/package/${packageName})`,
    );
  }

  const accounts = getAllAccounts(program);
  const instructions = getAllInstructionsWithSubs(program);
  const pdas = getAllPdas(program);
  const types = getAllDefinedTypes(program);
  const errors = getAllErrors(program);

  // Table of Contents
  if (context.options.renderTableOfContents !== false) {
    lines.push(
      ...renderTableOfContents(
        accounts,
        instructions,
        pdas,
        types,
        errors.length > 0,
      ),
    );
  }

  lines.push(
    ...renderSection("Accounts", accounts, (account) =>
      renderAccount(account, context),
    ),
  );
  lines.push(
    ...renderSection("Instructions", instructions, (instruction) =>
      renderInstruction(instruction, context),
    ),
  );
  lines.push(...renderSection("PDAs", pdas, (pda) => renderPda(pda, context)));
  lines.push(
    ...renderSection("Types", types, (type) =>
      renderDefinedType(type, context),
    ),
  );

  // Errors
  if (errors.length > 0) {
    lines.push("## Errors");
    lines.push("");

    for (const error of errors) {
      lines.push(renderError(error));
    }
    lines.push("");
  }

  return lines.join("\n");
}
