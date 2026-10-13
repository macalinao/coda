## About Tribeca

Tribeca is a governance protocol on Solana. Govern is its core program for creating governors, proposals, and voting; voting power usually comes from [`@solana-programs/tribeca-locked-voter`](https://www.npmjs.com/package/@solana-programs/tribeca-locked-voter), and passed proposals execute through a [`@solana-programs/goki-smart-wallet`](https://www.npmjs.com/package/@solana-programs/goki-smart-wallet).

- **Governor**: Manages proposals and voting parameters
- **Proposal**: Individual governance proposals with metadata
- **Vote**: Records individual voter decisions on proposals
- **ProposalMeta**: Additional metadata for proposals

## Usage

```typescript
import {
  fetchGovernor,
  fetchProposal,
  getCastVoteInstruction,
} from "@solana-programs/tribeca-govern";

const governor = await fetchGovernor(rpc, governorAddress);
const proposal = await fetchProposal(rpc, proposalAddress);

const voteInstruction = getCastVoteInstruction({
  governor: governorAddress,
  proposal: proposalAddress,
  vote: voteAddress, // PDA automatically calculated
  voter: voterPublicKey,
  // ... other parameters
});
```
