import { useEffect, useState } from "react";
import { GetCryptosList, GetTransactions } from "../../wailsjs/go/main/App";
import { formatCrypto, formatNumber } from "../utils/numberFormat";
import { AddTransactionModal } from "./AddTransactionModal";
import { TransactionList } from "./TransactionsList";

interface CryptoHolding {
  symbol: string;
  totalAmount: number;
  averagePrice: number;
  totalValue: number;
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
            currentPrice: priceMap.get(tx.CryptoSymbol) || 0,
            logoUrl: crypto?.logoUrl || "",
          };

          existing.totalAmount += tx.amount;

          if (tx.type === "buy") {
            existing.totalValue += tx.total;
          }
          if (existing.totalAmount > 0) {
            existing.averagePrice = existing.totalValue / existing.totalAmount;
          }

          holdingsMap.set(tx.CryptoSymbol, existing);
        },
      );

      const holdingsArray = Array.from(holdingsMap.values());
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
    setTransactions(filteredTransactions);
    setSelectedCrypto(symbol);
  };

  if (selectedCrypto) {
    return (
      <div className="p-6">
        <TransactionList
          cryptoSymbol={selectedCrypto}
          transactions={transactions}
          onBack={() => setSelectedCrypto(null)}
          onTransactionDeleted={loadHoldings}
          setTransactions={setTransactions}
        />
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">Portfolio Value</h2>
            <p className="text-2xl font-bold text-black">
              $ {totalValue.toFixed(2)}
            </p>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add Transaction
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md text-black p-2">
          <h2 className="text-gray-500 px-6 mb-4 text-left">Assets</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crypto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holdings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg.Buy Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdings.map((holding) => (
                <tr
                  key={holding.symbol}
                  onClick={() => handleRowClick(holding.symbol)}
                  className="cursor-pointer hover:bg-gray-50"
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
