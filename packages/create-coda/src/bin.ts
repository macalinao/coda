#!/usr/bin/env node

import { existsSync } from "node:fs";
import { cp, mkdir, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const projectName = process.argv[2] ?? "my-coda-client";
  const targetDir = resolve(process.cwd(), projectName);

  // Check if directory already exists
  if (existsSync(targetDir)) {
    const files = await readdir(targetDir);
    if (files.length > 0) {
      console.error(
        `Error: Directory ${projectName} already exists and is not empty.`,
      );
      process.exit(1);
    }
  }

  // Create target directory
  await mkdir(targetDir, { recursive: true });

  // Copy template files (template is at the package root, not in dist)
  const templateDir = join(__dirname, "..", "template");
  await cp(templateDir, targetDir, { recursive: true });

  console.log(`✨ Created Coda client project at ${projectName}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  cd ${projectName}`);
  console.log("  bun install");
  console.log("  # Add your IDL file to idls/ directory");
  console.log("  bun run codegen");
  console.log("  bun run build");
  console.log("");
  console.log("Happy coding! 🚀");
}

main().catch((error: unknown) => {
  console.error("Error creating project:", error);
  process.exit(1);
});
