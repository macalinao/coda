# @macalinao/codama-renderers-markdown

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-renderers-markdown.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-markdown)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-renderers-markdown.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-markdown)

A Codama visitor that renders markdown documentation from Solana program IDLs.

## Documentation

Full documentation and examples are available at [coda.ianm.com/docs/packages/codama-renderers-markdown](https://coda.ianm.com/docs/packages/codama-renderers-markdown).

## Quick Start

The easiest way to use this package is through the [Coda CLI](https://coda.ianm.com):

```bash
# Install Coda CLI
npm install -D @macalinao/coda

# Generate documentation
coda docs
```

Or use directly:

```bash
npm install @macalinao/codama-renderers-markdown
```

```typescript
import { renderMarkdownVisitor } from "@macalinao/codama-renderers-markdown";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { visit } from "codama";

const idl = JSON.parse(fs.readFileSync("idl.json", "utf-8"));
const root = rootNodeFromAnchor(idl);
visit(root, renderMarkdownVisitor("./docs"));
```

## Live Examples

- **[Quarry Protocol](https://github.com/macalinao/coda/tree/master/clients/quarry/docs)** - Complete documentation for 6 Quarry programs
- **[Token Metadata](https://github.com/macalinao/coda/blob/master/clients/token-metadata/docs/mpl-token-metadata.md)** - Metaplex Token Metadata documentation

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
