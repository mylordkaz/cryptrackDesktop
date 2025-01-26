export function calculGainStats(transactions: any[], currentPrice: number) {
  // Calculate net investment (buys - sells)
  const netInvestment = transactions.reduce((sum, tx) => {
    return sum + tx.total; // Sells already have negative total
  }, 0);

  // Calculate net holdings
  const netHoldings = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const currentValue = netHoldings * currentPrice;

  const gainLossPercentage =
    netInvestment !== 0
      ? ((currentValue - netInvestment) / Math.abs(netInvestment)) * 100
      : 0;

  return { currentValue, gainLossPercentage };
}
