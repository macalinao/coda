# @macalinao/codama-renderers-js-esm

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-renderers-js-esm.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-js-esm)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-renderers-js-esm.svg)](https://www.npmjs.com/package/@macalinao/codama-renderers-js-esm)

ESM-native TypeScript renderer for Codama with proper `.js` extensions.

## Documentation

Full documentation and examples are available at [coda.ianm.com/docs/packages/codama-renderers-js-esm](https://coda.ianm.com/docs/packages/codama-renderers-js-esm).

## Quick Start

```bash
npm install @macalinao/codama-renderers-js-esm
```

```typescript
import { renderJavaScriptVisitor } from "@macalinao/codama-renderers-js-esm";

// Generate ESM-compatible TypeScript code
const visitor = renderJavaScriptVisitor("./src/generated");
codama.accept(visitor);
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
