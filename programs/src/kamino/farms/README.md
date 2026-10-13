## Usage

```typescript
import {
  fetchFarmState,
  findFarmsUserStatePda,
  getStakeInstructionAsync,
} from "@solana-programs/kamino-farms";

const farm = await fetchFarmState(rpc, farmStateAddress);

// The user state and farm vault PDAs are derived automatically.
const instruction = await getStakeInstructionAsync({
  owner: ownerSigner,
  farmState: farmStateAddress,
  userAta: userTokenAccount,
  tokenMint: farm.data.token.mint,
  // ... other parameters
});
```

Accounts and instructions that clash with Kamino Lending's names keep the `farms` prefix they had when both programs were rendered into one package (`FarmsUserState`, `FarmsGlobalConfig`, `farmsIdlMissingTypes`). [`@solana-programs/kamino-lending`](https://www.npmjs.com/package/@solana-programs/kamino-lending) still bundles both programs.
