# @macalinao/codama-renderers-markdown

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-renderers-markdown.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-markdown)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-renderers-markdown.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-markdown)

A Codama visitor that renders markdown documentation from Solana program IDLs.

## Live Examples

See the documentation this package generates in action:

- **[Quarry Protocol Documentation](https://coda-docs.vercel.app/docs/api/clients/quarry)** - Complete documentation for the Quarry staking protocol, showcasing:
  - [60+ Instructions](https://coda-docs.vercel.app/docs/api/clients/quarry/instructions) with full parameter documentation
  - [Account structures](https://coda-docs.vercel.app/docs/api/clients/quarry/accounts) with field descriptions
  - [PDA derivations](https://coda-docs.vercel.app/docs/api/clients/quarry/pdas) with seed definitions
  - [Custom types](https://coda-docs.vercel.app/docs/api/clients/quarry/types) and enums
  - [Error codes](https://coda-docs.vercel.app/docs/api/clients/quarry/errors) with messages

- **[Token Metadata Documentation](https://coda-docs.vercel.app/docs/api/clients/token-metadata)** - Metaplex Token Metadata program documentation

This documentation is generated automatically from the program IDLs with zero manual editing required.

## Quick Start with Coda CLI

The easiest way to use this package is through the [Coda CLI](https://coda.ianm.com), which includes built-in documentation generation:

```bash
# Install Coda CLI  
bun add -D @macalinao/coda

# Generate both TypeScript client and markdown docs
coda generate --docs

# Or just generate documentation
coda docs
```

Learn more about Coda and its zero-config approach at [coda.ianm.com](https://coda.ianm.com).

## Installation

If you want to use this package directly:

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

- **Comprehensive Documentation**: Generates documentation for:
  - Accounts with fields and discriminators
  - Instructions with accounts and arguments
  - PDAs with seed definitions
  - Custom types and enums
  - Program errors with codes and messages
- **Structured Output**: 
  - Table of contents with navigation links
  - Organized sections by component type
  - Cross-references between related components
- **Developer-Friendly**:
  - TypeScript-style type definitions
  - Formatted tables for easy scanning
  - Code blocks with syntax highlighting support
- **Platform Agnostic**: 
  - Pure markdown output works anywhere
  - Compatible with all major documentation platforms
  - No vendor lock-in

## Options

```typescript
renderMarkdownVisitor(outputDir, {
  // Format program addresses (optional)
  formatAddress: (address) => address,
  
  // Render table of contents (default: true)
  renderTableOfContents: true,
});
```

## Integration Examples

### With Documentation Platforms

The generated markdown integrates seamlessly with popular documentation platforms:

```bash
# Generate documentation
npx @macalinao/codama-renderers-markdown ./docs

# Use with MkDocs
mkdocs build

# Use with Docusaurus
npm run build

# Use with VitePress
vitepress build docs
```

### CI/CD Integration

Automatically update documentation on every deployment:

```yaml
# GitHub Actions example
- name: Generate Program Documentation
  run: |
    npm run generate-docs
    git add docs/
    git commit -m "Update program documentation"
```

## License

MIT