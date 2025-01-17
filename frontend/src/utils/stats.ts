export function calculGainStats(transactions: any[], currentPrice: number) {
  const totalInvest = transactions.reduce((sum, tx) => {
    if (tx.type === "buy") {
      return sum + tx.total;
    }
    return sum;
  }, 0);

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const currentValue = totalAmount * currentPrice;
  const gainLossPercentage =
    totalInvest > 0 ? ((currentValue - totalInvest) / totalInvest) * 100 : 0;

  return { currentValue, gainLossPercentage };
}
