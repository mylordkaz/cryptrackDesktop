import { useEffect, useState } from "react";
import { GetCryptosList, GetTransactions } from "../../wailsjs/go/main/App";
import { formatCrypto, formatNumber } from "../utils/numberFormat";
import { AddTransactionModal } from "./AddTransactionModal";
import { ThemeToggle } from "./ThemeToggle";
import { TransactionList } from "./TransactionsList";

interface CryptoHolding {
  symbol: string;
  totalAmount: number;
  averagePrice: number;
  totalValue: number;
  totalTransactionValue: number;
  currentPrice: number;
  logoUrl: string;
}

export function Dashboard() {
  const [totalValue, setTotalValue] = useState(0);
  const [holdings, setHoldings] = useState<CryptoHolding[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  // load & calculate holdings
  const loadHoldings = async () => {
    try {
      const [transactions, cryptos] = await Promise.all([
        GetTransactions(),
        GetCryptosList(),
      ]);

      const priceMap = new Map(
        cryptos.map((crypto) => [
          crypto.symbol,
          crypto.currentPrice, // Store the price directly
        ]),
      );

      // Group by crypto
      const holdingsMap = new Map<string, CryptoHolding>();

      transactions.forEach(
        (tx: {
          CryptoSymbol: string;
          amount: number;
          total: number;
          type: string;
        }) => {
          const crypto = cryptos.find((c) => c.symbol === tx.CryptoSymbol);
          const existing = holdingsMap.get(tx.CryptoSymbol) || {
            symbol: tx.CryptoSymbol,
            totalAmount: 0,
            averagePrice: 0,
            totalValue: 0,
            totalTransactionValue: 0,
            currentPrice: priceMap.get(tx.CryptoSymbol) || 0,
            logoUrl: crypto?.logoUrl || "",
          };

          existing.totalAmount += tx.amount;
          existing.totalTransactionValue += tx.total;

          if (existing.totalAmount > 0) {
            existing.averagePrice =
              existing.totalTransactionValue / existing.totalAmount;
          }

          existing.totalValue = existing.totalAmount * existing.currentPrice;

          holdingsMap.set(tx.CryptoSymbol, existing);
        },
      );

      const holdingsArray = Array.from(holdingsMap.values()).map((holding) => ({
        ...holding,
        totalValue: holding.currentPrice * holding.totalAmount,
      }));
      setHoldings(holdingsArray);

      const currentPortfolioValue = holdingsArray.reduce((sum, holding) => {
        const currentValue =
          holding.totalAmount > 0
            ? holding.currentPrice * holding.totalAmount
            : 0;
        return sum + currentValue;
      }, 0);
      setTotalValue(currentPortfolioValue);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  const handleRowClick = async (symbol: string) => {
    const allTransactions = await GetTransactions();
    const filteredTransactions = allTransactions.filter(
      (tx: { CryptoSymbol: string }) => tx.CryptoSymbol === symbol,
    );
    const currentHolding = holdings.find((h) => h.symbol === symbol);
    setTransactions(filteredTransactions);
    setSelectedCrypto(symbol);
  };

  if (selectedCrypto) {
    const currentHolding = holdings.find((h) => h.symbol === selectedCrypto);
    return (
      <div className="p-6">
        <TransactionList
          cryptoSymbol={selectedCrypto}
          transactions={transactions}
          currentPrice={currentHolding?.currentPrice || 0}
          onBack={() => setSelectedCrypto(null)}
          onTransactionDeleted={loadHoldings}
          setTransactions={setTransactions}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md">
          <ThemeToggle />
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-end mb-8">
          <div className="bg-surface-card p-4 rounded-lg shadow-md border border-border">
            <h2 className="text-text-secondary text-sm">Portfolio Value</h2>
            <p className="text-2xl font-bold text-text">
              $ {totalValue.toFixed(2)}
            </p>
          </div>

          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light active:bg-primary-dark transition-colors"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add Transaction
          </button>
        </div>
        <div className="bg-surface-card rounded-lg shadow-sm border border-border p-2">
          <h2 className="text-text-secondary px-6 mb-4 text-left">Assets</h2>
          <table className="w-full">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Crypto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Holdings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Avg.Buy Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {holdings.map((holding) => (
                <tr
                  key={holding.symbol}
                  onClick={() => handleRowClick(holding.symbol)}
                  className="cursor-pointer hover:bg-surface-secondary transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={holding.logoUrl}
                        alt={holding.symbol}
                        className="w-6 h-6 mr-2"
                      />
                      {holding.symbol}
                    </div>
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${formatNumber(holding.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCrypto(holding.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${formatNumber(holding.averagePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${formatNumber(holding.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={loadHoldings}
      />
    </>
  );
}
