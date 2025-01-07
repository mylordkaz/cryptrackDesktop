interface TransactionListProps {
  cryptoSymbol: string;
  transactions: Array<{
    id: string;
    cryptoSymbol: string;
    amount: number;
    price: number;
    total: number;
    date: string;
    type: string;
  }>;
  onBack: () => void;
}

export function TransactionList({
  cryptoSymbol,
  transactions,
  onBack,
}: TransactionListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md text-black p-6">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-4 text-blue-500 hover:text-blue-600"
        >
          ← Back
        </button>
        <h2 className="text-gray-500 text-sm">{cryptoSymbol} Transactions</h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`capitalize ${tx.type === "buy" ? "text-green-600" : "text-red-600"}`}
                >
                  {tx.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {tx.amount.toFixed(8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${tx.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${tx.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
