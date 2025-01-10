import { useState } from "react";
import { DeleteTransaction } from "../../wailsjs/go/main/App";
import { EditTransactionModal } from "./EditTransactionModal";

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
  onTransactionDeleted: () => void;
  setTransactions: (transactions: any[]) => void;
}

export function TransactionList({
  cryptoSymbol,
  transactions,
  onBack,
  onTransactionDeleted,
  setTransactions,
}: TransactionListProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const totalSum = transactions.reduce((sum, tx) => sum + tx.total, 0);

  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteTransaction(id);
      const updatedTransactions = transactions.filter((tx) => tx.id !== id);
      setTransactions(updatedTransactions);
      onTransactionDeleted();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-md text-black p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-500 text-sm font-semibold mb-2 text-left">
              {cryptoSymbol} Transactions
            </h2>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm mr-2 text-gray-700">Total Value: </span>
              <span className="text-lg font-semibold">
                ${totalSum.toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Back
          </button>{" "}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(tx.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(tx)}
                    className="text-gray-600 hover:text-gray-900 inline-block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          onTransactionUpdated={() => {
            onTransactionDeleted(); // This will refresh the list
          }}
        />
      )}
    </>
  );
}
