import assert from "node:assert/strict";
import test from "node:test";

import { setWalletRuntimeBridge, walletService } from "./walletService.ts";
import { buildInsufficientGasMessage } from "@/utils/paymentToken";

const LUX_COIN_TYPE =
  "0xf0446b93345c1118f21239d7ac58fb82d005219b2016e100f074e4d17162a465::EVE::EVE";

interface CapturedTransactionData {
  sender?: string | null;
  commands?: Array<{
    $Intent?: { data?: { type?: string } };
    MoveCall?: { package?: string; module?: string; function?: string };
  }>;
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
  assert.equal(snapshot.commands?.[0]?.$Intent?.data?.type, LUX_COIN_TYPE);

  setWalletRuntimeBridge(null);
});

test("walletService builds team escrow payment move calls", async () => {
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
      return { txDigest: "tx-team-escrow" };
    },
    getBalance: async () => 0
  });

  const result = await walletService.signAndExecuteTeamEntryEscrowPayment({
    packageId: "0x0000000000000000000000000000000000000000000000000000000000000f09",
    roomId: "0x0000000000000000000000000000000000000000000000000000000000000def",
    escrowId: "0x0000000000000000000000000000000000000000000000000000000000000eee",
    teamRef: "0x0000000000000000000000000000000000000000000000000000000000000abc",
    memberCount: 3,
    quotedAmountLux: 150,
    amountBaseUnits: 150_000_000_000n,
    coinType: LUX_COIN_TYPE
  });

  assert.equal(result.txDigest, "tx-team-escrow");
  if (!capturedData) {
    throw new Error("transaction payload was not captured");
  }

  const snapshot = capturedData as CapturedTransactionData;
  assert.equal(snapshot.sender, "0x0000000000000000000000000000000000000000000000000000000000000abc");
  assert.equal(snapshot.commands?.[1]?.MoveCall?.package, "0x0000000000000000000000000000000000000000000000000000000000000f09");
  assert.equal(snapshot.commands?.[1]?.MoveCall?.module, "fuel_frog_panic");
  assert.equal(snapshot.commands?.[1]?.MoveCall?.function, "lock_team_entry_with_escrow");

  setWalletRuntimeBridge(null);
});

test("walletService surfaces insufficient SUI gas separately from payment token balance", async () => {
  setWalletRuntimeBridge({
    connect: async () => "0xabc",
    disconnect: async () => undefined,
    currentAddress: () => "0xabc",
    signTransaction: async () => {
      throw new Error("not used");
    },
    signAndExecuteTransaction: async () => {
      throw new Error(
        "Unable to perform gas selection due to insufficient SUI balance (in address balance or coins) for account 0xabc to satisfy required budget 161815072."
      );
    },
    getBalance: async () => 0
  });

  await assert.rejects(
    () =>
      walletService.executeTransaction({
        getData() {
          return {};
        }
      } as never),
    (error: unknown) => {
      assert.equal((error as { code?: string }).code, "E_INSUFFICIENT_GAS");
      assert.equal((error as Error).message, buildInsufficientGasMessage());
      return true;
    }
  );

  setWalletRuntimeBridge(null);
});
