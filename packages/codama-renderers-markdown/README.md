# @macalinao/codama-renderers-markdown

A Codama visitor that renders markdown documentation from Solana program IDLs.

## Installation

```bash
npm install @macalinao/codama-renderers-markdown
```

## Usage

```typescript
import { renderMarkdownVisitor } from "@macalinao/codama-renderers-markdown";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { visit } from "codama";

// Load your IDL
const idl = JSON.parse(fs.readFileSync("path/to/idl.json", "utf-8"));

// Create Codama root node
const root = rootNodeFromAnchor(idl);

// Generate markdown documentation
visit(root, renderMarkdownVisitor("./docs"));
```

## Features

- Comprehensive documentation for all program components
- Generates documentation for:
  - Accounts with fields and discriminators
  - Instructions with accounts and arguments
  - PDAs with seed definitions
  - Custom types and enums
  - Program errors
- Table of contents with links
- TypeScript-style type definitions
- Formatted output with tables and code blocks

## Options

```typescript
renderMarkdownVisitor(outputDir, {
  // Format program addresses (optional)
  formatAddress: (address) => address,
  
  // Render table of contents (default: true)
  renderTableOfContents: true,
});
```

## License

MIT