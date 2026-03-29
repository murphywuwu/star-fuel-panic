const DEFAULT_TOKEN_DECIMALS = 9;

export function normalizeTokenDecimals(decimals: number | null | undefined, fallback = DEFAULT_TOKEN_DECIMALS) {
  if (!Number.isFinite(decimals) || Number(decimals) < 0) {
    return fallback;
  }

  return Math.floor(Number(decimals));
}

export function toBaseUnits(amount: number, decimals: number | null | undefined) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0n;
  }

  const safeDecimals = normalizeTokenDecimals(decimals);
  const fixed = amount.toFixed(safeDecimals);
  const [wholePart, fractionPart = ""] = fixed.split(".");
  const combined = `${wholePart}${fractionPart.padEnd(safeDecimals, "0")}`.replace(/^0+/, "") || "0";
  return BigInt(combined);
}
