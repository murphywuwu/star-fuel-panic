export const PAYMENT_TOKEN_LABEL =
  process.env.NEXT_PUBLIC_PAYMENT_TOKEN_LABEL?.trim() || "EVE TEST TOKEN";

export const PAYMENT_TOKEN_SYMBOL =
  process.env.NEXT_PUBLIC_PAYMENT_TOKEN_SYMBOL?.trim() || "EVE";

export const GAS_TOKEN_SYMBOL = "SUI";

export function formatPaymentTokenAmount(
  value: string | number,
  options?: {
    maximumFractionDigits?: number;
  }
) {
  const amount = typeof value === "string" ? Number(value) : value;
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(amount)} ${PAYMENT_TOKEN_SYMBOL}`;
}

export function buildInsufficientGasMessage() {
  return `Insufficient ${GAS_TOKEN_SYMBOL} gas for transaction fee. ${PAYMENT_TOKEN_LABEL} covers the payment amount only; Sui network gas must still be paid in ${GAS_TOKEN_SYMBOL}.`;
}
