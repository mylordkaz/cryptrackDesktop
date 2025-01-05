import { useEffect, useState } from "react";
import { GetCryptosList, AddTransaction } from "../../wailsjs/go/main/App";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onTransactionAdded,
}: AddTransactionModalProps) {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [cryptoList, setCryptoList] = useState<
    Array<{ symbol: string; name: string }>
  >([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (quantity && price) {
      const calculatedTotal = parseFloat(quantity) * parseFloat(price);
      setTotal(calculatedTotal.toString());
    }
  }, [quantity, price]);

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        const cryptos = await GetCryptosList();
        setCryptoList(cryptos);
      } catch (error) {
        console.error("Failed to load cryptos list:", error);
      }
    };
    loadCryptos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await AddTransaction(
        selectedCrypto,
        parseFloat(quantity),
        parseFloat(price),
        parseFloat(total),
        date,
      );

      setSelectedCrypto("");
      setQuantity("");
      setPrice("");
      setTotal("");
      setDate(new Date().toISOString().split("T")[0]);

      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error("failed to save transaction:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[480px] shadow-xl">
        {/* Buy/Sell Tabs */}
        <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              tab === "buy"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("buy")}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              tab === "sell"
                ? "bg-red-500 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("sell")}
          >
            Sell
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Select Crypto */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Crypto
            </label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              <option value="">Choose cryptocurrency</option>
              {cryptoList.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>
                  {crypto.symbol} - {crypto.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price per coin
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Total */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Total</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Transaction
            </button>
            <button
              type="button"
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
