import assert from "node:assert/strict";
import test from "node:test";

import { verifyExpectedTransferForTests } from "./devnetChainRuntime.ts";
import { toBaseUnits } from "@/utils/tokenAmount";

const LUX_COIN_TYPE = "0xf0446b93345c1118f21239d7ac58fb82d005219b2016e100f074e4d17162a465::EVE::EVE";
const RECIPIENT = "0xfeedbeef";

test("verifyExpectedTransfer accepts exact sponsorship transfer", () => {
  const result = verifyExpectedTransferForTests(
    "0xabc123456789abcd",
    [
      {
        coinType: LUX_COIN_TYPE,
        amount: toBaseUnits(50, 9).toString(),
        owner: { AddressOwner: RECIPIENT }
      }
    ],
    {
      coinType: LUX_COIN_TYPE,
      recipient: RECIPIENT,
      exactAmountBaseUnits: toBaseUnits(50, 9)
    }
  );

  assert.equal(result.ok, true);
});

test("verifyExpectedTransfer rejects wrong sponsorship recipient", () => {
  const result = verifyExpectedTransferForTests(
    "0xabc123456789abcd",
    [
      {
        coinType: LUX_COIN_TYPE,
        amount: toBaseUnits(50, 9).toString(),
        owner: { AddressOwner: "0xwrong" }
      }
    ],
    {
      coinType: LUX_COIN_TYPE,
      recipient: RECIPIENT,
      exactAmountBaseUnits: toBaseUnits(50, 9)
    }
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, "TX_REJECTED");
  }
});

test("verifyExpectedTransfer rejects wrong sponsorship amount", () => {
  const result = verifyExpectedTransferForTests(
    "0xabc123456789abcd",
    [
      {
        coinType: LUX_COIN_TYPE,
        amount: toBaseUnits(25, 9).toString(),
        owner: { AddressOwner: RECIPIENT }
      }
    ],
    {
      coinType: LUX_COIN_TYPE,
      recipient: RECIPIENT,
      exactAmountBaseUnits: toBaseUnits(50, 9)
    }
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, "TX_REJECTED");
  }
});

test("verifyExpectedTransfer accepts sender debit match for escrow publish", () => {
  const payer = "0xplayer";
  const result = verifyExpectedTransferForTests(
    "0xabc123456789abcd",
    [
      {
        coinType: LUX_COIN_TYPE,
        amount: `-${toBaseUnits(50, 9).toString()}`,
        owner: { AddressOwner: payer }
      }
    ],
    {
      coinType: LUX_COIN_TYPE,
      sender: payer,
      exactAmountBaseUnits: toBaseUnits(50, 9)
    }
  );

  assert.equal(result.ok, true);
});
