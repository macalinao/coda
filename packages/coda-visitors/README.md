# @macalinao/coda-visitors

[![npm version](https://img.shields.io/npm/v/@macalinao/coda-visitors.svg)](https://www.npmjs.com/package/@macalinao/coda-visitors)

Additional Codama visitors for enhanced code generation with Coda.

## Installation

```bash
bun add @macalinao/coda-visitors
```

## Visitors

### addNodesVisitor

Adds nodes (accounts, instructions, defined types, errors, PDAs) to existing programs in the Codama AST.

```typescript
import { addNodesVisitor } from "@macalinao/coda-visitors";
import { accountNode } from "codama";

const visitor = addNodesVisitor({
  myProgram: {
    accounts: [
      accountNode({
        name: "customAccount",
        // ... account configuration
      })
    ],
    instructions: [
      // Add custom instructions
    ],
    definedTypes: [
      // Add custom types
    ],
    errors: [
      // Add custom errors
    ],
    pdas: [
      // Add custom PDAs
    ]
  }
});
```

## Usage with Coda

This visitor is commonly used in `coda.config.mjs` to extend IDL-generated programs:

```javascript
import { defineConfig } from "@macalinao/coda";
import { addNodesVisitor } from "@macalinao/coda-visitors";

export default defineConfig({
  visitors: [
    addNodesVisitor({
      voterStakeRegistry: {
        accounts: [
          // Add custom accounts not in IDL
        ]
      }
    })
  ]
});
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0