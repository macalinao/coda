## About

Quarry Operator delegates the administration of a Quarry Mine rewarder (setting rates, creating quarries, allocating shares) to separate roles.

[`@solana-programs/quarry`](https://www.npmjs.com/package/@solana-programs/quarry) bundles all six Quarry programs in one package.

## Usage

```typescript
import {
  findOperatorPda,
  getDelegateCreateQuarryInstructionAsync,
} from "@solana-programs/quarry-operator";
```
