## About Goki Smart Wallet

Goki Smart Wallet is an owner-threshold multisig that proposes, approves, and executes arbitrary instructions, optionally behind a timelock. Tribeca governance executes passed proposals through a smart wallet.

- **SmartWallet**: Owner set, threshold, and timelock configuration for a multisig
- **Transaction**: A proposed instruction bundle, its approvals, and its execution status
- **SubaccountInfo**: Metadata describing a derived or owner-invoker subaccount

The IDL is a legacy Anchor 0.x IDL that declares its PDA seeds inline on instruction accounts, which the Anchor-to-Codama parser does not carry over, so `program.config.ts` redeclares them:

| Helper | Seeds |
| --- | --- |
| `findSmartWalletPda({ base })` | `"GokiSmartWallet"`, base |
| `findTransactionPda({ smartWallet, index })` | `"GokiTransaction"`, smart wallet, index |
| `findSubaccountInfoPda({ subaccount })` | `"GokiSubaccountInfo"`, subaccount |
| `findWalletDerivedPda({ smartWallet, index })` | `"GokiSmartWalletDerived"`, smart wallet, index |
| `findOwnerInvokerPda({ smartWallet, index })` | `"GokiSmartWalletOwnerInvoker"`, smart wallet, index |

`walletDerived` and `ownerInvoker` are subaccount addresses rather than stored accounts — they back `executeTransactionDerived` and `ownerInvokeInstruction` respectively, and have no on-chain struct to decode.

## Usage

```typescript
import {
  fetchSmartWallet,
  findSmartWalletPda,
  findTransactionPda,
  getApproveInstruction,
  getCreateTransactionInstruction,
} from "@solana-programs/goki-smart-wallet";

const [smartWallet] = await findSmartWalletPda({ base: baseAddress });
const wallet = await fetchSmartWallet(rpc, smartWallet);

const [transaction] = await findTransactionPda({
  smartWallet,
  index: wallet.data.numTransactions,
});

const createIx = getCreateTransactionInstruction({
  smartWallet,
  transaction,
  proposer: proposerSigner,
  payer: payerSigner,
  bump: 0,
  instructions: [
    /* TXInstruction[] */
  ],
});

const approveIx = getApproveInstruction({
  smartWallet,
  transaction,
  owner: ownerSigner,
});
```
