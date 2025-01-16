export function formatNumber(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCrypto(
  value: number,
  isTransactionAmount: boolean = false,
): string {
  if (value >= 1) {
    return formatNumber(value);
  }

  const maxDecimals = isTransactionAmount ? 8 : 4;
  const decimalPart = value.toString().split(".")[1];

  if (decimalPart) {
    const trimDecimal = decimalPart.replace(/0+$/, "").slice(0, maxDecimals);
    return `${value.toString().split(".")[0]}.${trimDecimal}`;
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: maxDecimals,
  });
}
