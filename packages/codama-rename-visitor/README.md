# @macalinao/codama-rename-visitor

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-rename-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-rename-visitor)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-rename-visitor.svg)](https://www.npmjs.com/package/@macalinao/codama-rename-visitor)

A Codama visitor for renaming accounts, instructions, and defined types within Solana programs.

## Documentation

Full documentation and examples are available at [coda.ianm.com/docs/packages/codama-rename-visitor](https://coda.ianm.com/docs/packages/codama-rename-visitor).

## Quick Start

```bash
npm install @macalinao/codama-rename-visitor
```

```typescript
import { renameVisitor } from "@macalinao/codama-rename-visitor";

const visitor = renameVisitor({
  myProgram: {
    instructions: {
      oldName: "newName",
    },
    accounts: {
      oldAccount: "newAccount",
    },
    definedTypes: {
      oldType: "newType",
    },
  },
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
