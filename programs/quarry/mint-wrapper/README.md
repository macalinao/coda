## About

Quarry Mint Wrapper owns the mint authority of a rewards token and hands out rate-limited minters; Quarry rewarders claim rewards through it.

[`@solana-programs/quarry`](https://www.npmjs.com/package/@solana-programs/quarry) bundles all six Quarry programs in one package.

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
