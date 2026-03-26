const DEFAULT_BALANCE_DECIMALS = 9;
const MAX_VISIBLE_DECIMALS = 6;

export function normalizeWalletDecimals(
  metadataDecimals: number | null | undefined,
  configuredDecimals: number | null | undefined,
  fallback = DEFAULT_BALANCE_DECIMALS
) {
  if (Number.isFinite(metadataDecimals) && Number(metadataDecimals) >= 0) {
    return Math.floor(Number(metadataDecimals));
  }

  if (Number.isFinite(configuredDecimals) && Number(configuredDecimals) >= 0) {
    return Math.floor(Number(configuredDecimals));
  }

  return fallback;
}

export function balanceToDisplayUnits(rawBalance: string, decimals: number) {
  const safeDecimals = normalizeWalletDecimals(decimals, null);

  try {
    const amount = BigInt(rawBalance);
    if (safeDecimals === 0) {
      return Number(amount);
    }

    const divisor = 10n ** BigInt(safeDecimals);
    const whole = amount / divisor;
    const fraction = amount % divisor;
    const fractionText = fraction.toString().padStart(safeDecimals, "0").replace(/0+$/, "");
    const visibleFraction = fractionText.slice(0, MAX_VISIBLE_DECIMALS);
    const numeric = Number(visibleFraction ? `${whole.toString()}.${visibleFraction}` : whole.toString());
    return Number.isFinite(numeric) ? numeric : 0;
  } catch {
    const parsed = Number(rawBalance);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return parsed / 10 ** safeDecimals;
  }
}

export function formatWalletBalance(balance: number) {
  if (!Number.isFinite(balance) || balance <= 0) {
    return "0";
  }

  if (balance >= 1_000) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0
    }).format(balance);
  }

  if (balance >= 1) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2
    }).format(balance);
  }

  const compact = balance.toLocaleString("en-US", {
    maximumFractionDigits: MAX_VISIBLE_DECIMALS
  });

  return compact === "0" ? balance.toExponential(2) : compact;
}
