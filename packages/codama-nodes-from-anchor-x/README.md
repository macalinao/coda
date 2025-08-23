# @macalinao/codama-nodes-from-anchor-x

[![npm version](https://img.shields.io/npm/v/@macalinao/codama-nodes-from-anchor-x.svg)](https://www.npmjs.com/package/@macalinao/codama-nodes-from-anchor-x)
[![npm downloads](https://img.shields.io/npm/dm/@macalinao/codama-nodes-from-anchor-x.svg)](https://www.npmjs.com/package/@macalinao/codama-nodes-from-anchor-x)

Create Codama root nodes from multiple Anchor IDLs with enhanced support.

## Documentation

Full documentation and examples are available at [coda.ianm.com/docs/packages/codama-nodes-from-anchor-x](https://coda.ianm.com/docs/packages/codama-nodes-from-anchor-x).

## Quick Start

```bash
npm install @macalinao/codama-nodes-from-anchor-x
```

```typescript
import { rootNodeFromAnchorIdls } from "@macalinao/codama-nodes-from-anchor-x";

// Parse multiple IDLs into a single root node
const idls = [idl1, idl2, idl3];
const root = rootNodeFromAnchorIdls(idls);
```

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0