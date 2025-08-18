#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, "..");
const clientsDir = path.join(docsDir, "..", "clients");
const outputDir = path.join(docsDir, "content", "docs", "api", "clients");

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // Directory exists
  }
}

async function getClientPackages() {
  const dirs = await fs.readdir(clientsDir);
  const packages = [];
  
  for (const dir of dirs) {
    const pkgPath = path.join(clientsDir, dir, "package.json");
    try {
      const pkgContent = await fs.readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(pkgContent);
      packages.push({
        name: pkg.name,
        dir: dir,
        description: pkg.description || "",
        version: pkg.version
      });
    } catch (e) {
      // Not a package directory
    }
  }
  
  return packages;
}

async function generateIndexPage(packages) {
  const content = `---
title: Client Libraries API
description: Auto-generated API documentation for Coda client libraries
---

# Client Libraries API

This section contains the API documentation for all generated client libraries.

## Available Packages

${packages.map(pkg => `### ${pkg.name}

${pkg.description}

- Version: ${pkg.version}
- [View Documentation](./${pkg.dir})
`).join("\n")}

## Generated Types

Each client library includes:

- **Instructions** - Typed builders for all program instructions
- **Accounts** - Decoders and fetchers for all account types
- **Types** - All TypeScript types from the IDL
- **PDAs** - Helper functions for program-derived addresses
- **Errors** - Typed error enums and handlers
- **Programs** - Program IDs and utilities
`;

  await fs.writeFile(path.join(outputDir, "index.mdx"), content);
}

async function generatePackageDocs(pkg) {
  const pkgDir = path.join(clientsDir, pkg.dir);
  const srcDir = path.join(pkgDir, "src", "generated");
  const outDir = path.join(outputDir, pkg.dir);
  
  await ensureDir(outDir);
  
  // Generate main package page
  const mainContent = `---
title: ${pkg.name}
description: API documentation for ${pkg.name}
---

# ${pkg.name}

${pkg.description}

## Modules

- [Instructions](./${pkg.dir}/instructions) - Transaction instruction builders
- [Accounts](./${pkg.dir}/accounts) - Account decoders and fetchers
- [Types](./${pkg.dir}/types) - TypeScript type definitions
- [PDAs](./${pkg.dir}/pdas) - Program-derived address helpers
- [Errors](./${pkg.dir}/errors) - Error enums and handlers
- [Programs](./${pkg.dir}/programs) - Program IDs and utilities

## Installation

\`\`\`bash
bun add ${pkg.name}
\`\`\`

## Usage

\`\`\`typescript
import { /* exports */ } from "${pkg.name}";
\`\`\`
`;

  await fs.writeFile(path.join(outDir, "index.mdx"), mainContent);
  
  // Generate module pages
  const modules = ["instructions", "accounts", "types", "pdas", "errors", "programs"];
  
  for (const module of modules) {
    const moduleDir = path.join(srcDir, module);
    const moduleOutDir = path.join(outDir, module);
    
    try {
      const files = await fs.readdir(moduleDir);
      const tsFiles = files.filter(f => f.endsWith(".ts") && f !== "index.ts");
      
      if (tsFiles.length > 0) {
        await ensureDir(moduleOutDir);
        
        // Generate module index
        const moduleContent = `---
title: ${module.charAt(0).toUpperCase() + module.slice(1)}
description: ${module} for ${pkg.name}
---

# ${module.charAt(0).toUpperCase() + module.slice(1)}

## Available ${module.charAt(0).toUpperCase() + module.slice(1)}

${tsFiles.map(file => {
  const name = file.replace(".ts", "");
  return `- [${name}](./${module}/${name})`;
}).join("\n")}
`;
        
        await fs.writeFile(path.join(moduleOutDir, "index.mdx"), moduleContent);
        
        // Generate individual file docs
        for (const file of tsFiles) {
          const name = file.replace(".ts", "");
          const fileContent = `---
title: ${name}
description: ${name} from ${pkg.name}
---

# ${name}

\`\`\`typescript
// Import
import { ${name} } from "${pkg.name}";
\`\`\`

## Description

This module provides the \`${name}\` ${module.slice(0, -1)} for the ${pkg.name.split("/")[1]} program.

## Usage Example

\`\`\`typescript
import { ${name} } from "${pkg.name}";

// Example usage here
\`\`\`

## API Reference

For detailed type information, please refer to the source code or use your IDE's type inspection features.
`;
          
          await fs.writeFile(path.join(moduleOutDir, `${name}.mdx`), fileContent);
        }
      }
    } catch (e) {
      // Module doesn't exist
    }
  }
  
  // Generate meta.json
  const metaContent = {
    title: pkg.name.split("/")[1],
    pages: ["index", ...modules.filter(async m => {
      try {
        await fs.access(path.join(outDir, m));
        return true;
      } catch {
        return false;
      }
    })]
  };
  
  await fs.writeFile(path.join(outDir, "meta.json"), JSON.stringify(metaContent, null, 2));
}

async function main() {
  console.log("Generating API documentation...");
  
  await ensureDir(outputDir);
  
  const packages = await getClientPackages();
  console.log(`Found ${packages.length} client packages`);
  
  await generateIndexPage(packages);
  
  for (const pkg of packages) {
    console.log(`Generating docs for ${pkg.name}...`);
    await generatePackageDocs(pkg);
  }
  
  console.log("API documentation generated successfully!");
}

main().catch(console.error);