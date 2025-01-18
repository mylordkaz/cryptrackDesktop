export function formatNumber(value: number): string {
  // Add commas to the whole number part
  const parts = value.toString().split(".");
  const wholeNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = parts[1];

  if (!decimal) return wholeNumber + ".00";

  // For numbers less than 1, show up to 4 decimals
  if (Math.abs(value) < 1) {
    const trimmed = decimal.slice(0, 4).replace(/0+$/, "");
    return `${wholeNumber}.${trimmed || "0"}`;
  }

  // For other numbers, show up to 2 decimals
  const trimmed = decimal.slice(0, 2).replace(/0+$/, "");
  return `${wholeNumber}.${trimmed || "0"}`;
}

export function formatCrypto(
  value: number,
  isTransactionAmount: boolean = false,
): string {
  const parts = value.toString().split(".");
  const wholeNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = parts[1];

  if (!decimal) return wholeNumber + ".0";

  const maxDecimals = isTransactionAmount ? 8 : 4;
  const trimmed = decimal.slice(0, maxDecimals).replace(/0+$/, "");
  return `${wholeNumber}.${trimmed || "0"}`;
}
