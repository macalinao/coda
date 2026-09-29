## About

Quarry Operator delegates the administration of a Quarry Mine rewarder (setting rates, creating quarries, allocating shares) to separate roles.

This package was previously part of `@solana-programs/quarry`, which bundled all six Quarry programs.

## Usage

```typescript
import {
  findOperatorPda,
  getDelegateCreateQuarryInstructionAsync,
} from "@solana-programs/quarry-operator";
```
