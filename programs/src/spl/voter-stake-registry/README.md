Client for the Realms [Voter Stake Registry program](https://github.com/Grape-Labs/voter-stake-registry/) by Grape. It ships PDA helpers for:

- **Registrar**: The voting registrar account - one per governance realm and governing mint
- **Voter**: Individual voter accounts tied to a registrar and voter authority
- **Voter Weight Record**: The account shown to spl-governance to prove vote weight

## Usage

```typescript
import {
  findRegistrarPda,
  findVoterPda,
  findVoterWeightRecordPda,
} from "@solana-programs/voter-stake-registry";

// Get the registrar PDA
const registrarPda = await findRegistrarPda({
  realm: realmPublicKey,
  realmGoverningTokenMint: mintPublicKey,
});

// Get a voter PDA
const voterPda = await findVoterPda({
  registrar: registrarPublicKey,
  voterAuthority: authorityPublicKey,
});

// Get a voter weight record PDA
const voterWeightRecordPda = await findVoterWeightRecordPda({
  registrar: registrarPublicKey,
  voterAuthority: authorityPublicKey,
});
```
