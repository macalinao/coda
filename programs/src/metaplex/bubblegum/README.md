## Usage

```typescript
import { getMintV1Instruction } from "@solana-programs/mpl-bubblegum";
```

The legacy (v1) collection instructions derive the collection's Token Metadata `metadata` and `masterEdition` PDAs. Those helpers are imported from [`@solana-programs/token-metadata`](https://www.npmjs.com/package/@solana-programs/token-metadata) rather than duplicated in this package.
