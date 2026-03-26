import assert from "node:assert/strict";
import test from "node:test";

import { setWalletRuntimeBridge, walletService } from "./walletService.ts";

const LUX_COIN_TYPE =
  "0x2::coin_registry::Currency<0xf0446b93345c1118f21239d7ac58fb82d005219b2016e100f074e4d17162a465::EVE::EVE>";

interface CapturedTransactionData {
  sender?: string | null;
  commands?: Array<{ $Intent?: { data?: { type?: string } } }>;
}

test("walletService builds entry payment transactions for custom coin types", async () => {
  let capturedData: CapturedTransactionData | null = null;

  setWalletRuntimeBridge({
    connect: async () => "0xabc",
    disconnect: async () => undefined,
    currentAddress: () => "0xabc",
    signTransaction: async () => {
      throw new Error("not used");
    },
    signAndExecuteTransaction: async (transaction) => {
      capturedData = transaction.getData() as CapturedTransactionData;
      return { txDigest: "tx-custom-coin" };
    },
    getBalance: async () => 0
  });

  const result = await walletService.signAndExecuteEntryPayment({
    recipient: "0xdef",
    amountBaseUnits: 500000n,
    coinType: LUX_COIN_TYPE
  });

  assert.equal(result.txDigest, "tx-custom-coin");
  if (!capturedData) {
    throw new Error("transaction payload was not captured");
  }

  const snapshot = capturedData as CapturedTransactionData;
  assert.equal(snapshot.sender, "0x0000000000000000000000000000000000000000000000000000000000000abc");
  assert.match(snapshot.commands?.[0]?.$Intent?.data?.type ?? "", /::coin_registry::Currency<.*::EVE::EVE>$/);

  setWalletRuntimeBridge(null);
});
