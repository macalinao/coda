# @macalinao/codama-instruction-accounts-dedupe-visitor

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-instruction-accounts-dedupe-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-instruction-accounts-dedupe-visitor)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-instruction-accounts-dedupe-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-instruction-accounts-dedupe-visitor)

Codama visitor for deduplicating and flattening instruction accounts from Anchor IDL.

## Documentation

Full documentation and examples are available at [coda.ianm.com/docs/packages/codama-instruction-accounts-dedupe-visitor](https://coda.ianm.com/docs/packages/codama-instruction-accounts-dedupe-visitor).

## Quick Start

```bash
npm install @macalinao/codama-instruction-accounts-dedupe-visitor
```

```typescript
import { instructionAccountsDedupeVisitor } from "@macalinao/codama-instruction-accounts-dedupe-visitor";

// Flatten nested account structures
const visitor = instructionAccountsDedupeVisitor(idl);
const deduplicatedRoot = visit(root, visitor);
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0