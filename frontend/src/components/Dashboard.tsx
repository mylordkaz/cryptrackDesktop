import { useEffect, useState } from "react";
import { GetTransactions } from "../../wailsjs/go/main/App";
import { AddTransactionModal } from "./AddTransactionModal";

interface CryptoHolding {
  symbol: string;
  totalAmount: number;
  averagePrice: number;
  totalValue: number;
}

export function Dashboard() {
  const [totalValue, setTotalValue] = useState(0);
  const [holdings, setHoldings] = useState<CryptoHolding[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // load & calculate holdings
  const loadHoldings = async () => {
    try {
      const transactions = await GetTransactions();

      // Group by crypto
      const holdingsMap = new Map<string, CryptoHolding>();

      transactions.forEach(
        (tx: { CryptoSymbol: string; amount: number; total: number }) => {
          const existing = holdingsMap.get(tx.CryptoSymbol) || {
            symbol: tx.CryptoSymbol,
            totalAmount: 0,
            averagePrice: 0,
            totalValue: 0,
          };

          existing.totalAmount += tx.amount;
          existing.totalValue += tx.total;
          existing.averagePrice = existing.totalValue / existing.totalAmount;

          holdingsMap.set(tx.CryptoSymbol, existing);
        },
      );

      const holdingsArray = Array.from(holdingsMap.values());
      setHoldings(holdingsArray);
      setTotalValue(holdingsArray.reduce((sum, h) => sum + h.totalValue, 0));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">Portfolio Value</h2>
            <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
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
        <div className="bg-white rounded-lg shadow-md text-black">
          <h2 className="text-gray-500 text-sm">Assets</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crypto
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdings.map((holding) => (
                <tr key={holding.symbol}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {holding.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {holding.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${holding.averagePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${holding.totalValue.toFixed(2)}
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
