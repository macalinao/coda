## About

Quarry Mint Wrapper owns the mint authority of a rewards token and hands out rate-limited minters; Quarry rewarders claim rewards through it.

This package was previously part of `@solana-programs/quarry`, which bundled all six Quarry programs.

## Usage

```typescript
import {
  findMinterPda,
  findMintWrapperPda,
} from "@solana-programs/quarry-mint-wrapper";

const [mintWrapper] = await findMintWrapperPda({ base: baseAddress });
const [minter] = await findMinterPda({
  wrapper: mintWrapper,
  authority: rewarderAddress,
});
```
