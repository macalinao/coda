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

export function renderProgram(
  program: ProgramNode,
  context: RenderContext,
): string {
  const lines: string[] = [];

  // Title - convert camelCase to Title Case
  const titleCase = program.name
    .replace(/([A-Z])/g, " $1") // Add space before capitals
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
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
  if (program.docs?.length) {
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

  // Table of Contents
  if (context.options.renderTableOfContents !== false) {
    lines.push("## Table of Contents");
    lines.push("");

    const accounts = getAllAccounts(program);
    const instructions = getAllInstructionsWithSubs(program);
    const types = getAllDefinedTypes(program);
    const errors = getAllErrors(program);
    const pdas = getAllPdas(program);

    if (accounts.length > 0) {
      lines.push("- [Accounts](#accounts)");
      for (const account of accounts) {
        lines.push(
          `  - [${account.name}](#${account.name.replace(/_/g, "-")})`,
        );
      }
    }

    if (instructions.length > 0) {
      lines.push("- [Instructions](#instructions)");
      for (const instruction of instructions) {
        lines.push(
          `  - [${instruction.name}](#${instruction.name.replace(/_/g, "-")})`,
        );
      }
    }

    if (pdas.length > 0) {
      lines.push("- [PDAs](#pdas)");
      for (const pda of pdas) {
        lines.push(`  - [${pda.name}](#${pda.name.replace(/_/g, "-")})`);
      }
    }

    if (types.length > 0) {
      lines.push("- [Types](#types)");
      for (const type of types) {
        lines.push(`  - [${type.name}](#${type.name.replace(/_/g, "-")})`);
      }
    }

    if (errors.length > 0) {
      lines.push("- [Errors](#errors)");
    }

    lines.push("");
  }

  // Accounts
  const accounts = getAllAccounts(program);
  if (accounts.length > 0) {
    lines.push("## Accounts");
    lines.push("");

    for (const account of accounts) {
      lines.push(renderAccount(account, context));
      lines.push("");
    }
  }

  // Instructions
  const instructions = getAllInstructionsWithSubs(program);
  if (instructions.length > 0) {
    lines.push("## Instructions");
    lines.push("");

    for (const instruction of instructions) {
      lines.push(renderInstruction(instruction, context));
      lines.push("");
    }
  }

  // PDAs
  const pdas = getAllPdas(program);
  if (pdas.length > 0) {
    lines.push("## PDAs");
    lines.push("");

    for (const pda of pdas) {
      lines.push(renderPda(pda, context));
      lines.push("");
    }
  }

  // Types
  const types = getAllDefinedTypes(program);
  if (types.length > 0) {
    lines.push("## Types");
    lines.push("");

    for (const type of types) {
      lines.push(renderDefinedType(type, context));
      lines.push("");
    }
  }

  // Errors
  const errors = getAllErrors(program);
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
