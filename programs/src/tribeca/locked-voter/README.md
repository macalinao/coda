## About Tribeca Locked Voter

Locked Voter is Tribeca's vote escrow program: token holders lock tokens for a period of time in exchange for voting power in a [`@solana-programs/tribeca-govern`](https://www.npmjs.com/package/@solana-programs/tribeca-govern) governor.

- **Locker**: Manages vote escrows for a governance token
- **Escrow**: Individual user's locked tokens and voting power
- **Whitelist**: Programs authorized to interact with the locker

## Usage

```typescript
import {
  fetchLocker,
  getNewEscrowInstruction,
} from "@solana-programs/tribeca-locked-voter";

const locker = await fetchLocker(rpc, lockerAddress);

const escrowInstruction = getNewEscrowInstruction({
  locker: lockerAddress,
  escrow: escrowAddress, // PDA automatically calculated
  escrowOwner: ownerPublicKey,
  // ... other parameters
});
```
