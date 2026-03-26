import assert from "node:assert/strict";
import test from "node:test";

import { balanceToDisplayUnits, formatWalletBalance, normalizeWalletDecimals } from "./walletBalance.ts";

test("normalizeWalletDecimals prefers metadata over configured fallback", () => {
  assert.equal(normalizeWalletDecimals(0, 9), 0);
  assert.equal(normalizeWalletDecimals(undefined, 9), 9);
  assert.equal(normalizeWalletDecimals(undefined, undefined), 9);
});

test("balanceToDisplayUnits keeps integer balances when decimals are zero", () => {
  assert.equal(balanceToDisplayUnits("500000", 0), 500000);
});

test("balanceToDisplayUnits preserves non-zero fractional balances", () => {
  assert.equal(balanceToDisplayUnits("500000", 9), 0.0005);
});

test("formatWalletBalance renders both large integer and small fractional balances", () => {
  assert.equal(formatWalletBalance(500000), "500,000");
  assert.equal(formatWalletBalance(0.0005), "0.0005");
});
