import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import {
  GetCryptosList,
  AddTransaction,
  GetTransactions,
} from "../../wailsjs/go/main/App";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

interface Crypto {
  symbol: string;
  name: string;
  currentPrice: number;
}
interface CryptoOption {
  value: string;
  label: string;
  logoUrl: string;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onTransactionAdded,
}: AddTransactionModalProps) {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [cryptoList, setCryptoList] = useState<
    Array<{ symbol: string; name: string; currentPrice: number }>
  >([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [selectedDate, setSelectedDate] = useState(new Date());

  const cryptoOptions: CryptoOption[] = cryptoList.map((crypto) => ({
    value: crypto.symbol,
    label: `${crypto.symbol} - ${crypto.name}`,
    logoUrl: crypto.logoUrl,
  }));

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

  useEffect(() => {
    if (selectedCrypto) {
      const selectedCryptoData = cryptoList.find(
        (crypto) => crypto.symbol === selectedCrypto,
      );
      if (selectedCryptoData) {
        setPrice(selectedCryptoData.currentPrice.toString());
      }
    }
  }, [selectedCrypto, cryptoList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDate = selectedDate.toISOString();

    try {
      if (tab === "sell") {
        const holdings = await GetTransactions();
        const cryptoHoldings = holdings.reduce((total: number, tx: any) => {
          if (tx.CryptoSymbol === selectedCrypto) {
            return total + tx.Amount;
          }
          return total;
        }, 0);

        if (parseFloat(quantity) > cryptoHoldings) {
          alert(
            `Not enought ${selectedCrypto} to sell. Current holdings: ${cryptoHoldings}`,
          );
          return;
        }
      }
      await AddTransaction(
        selectedCrypto,
        parseFloat(quantity),
        parseFloat(price),
        parseFloat(total),
        formattedDate,
        tab,
      );

      setSelectedCrypto("");
      setQuantity("");
      setPrice("");
      setTotal("");
      setDate(new Date().toISOString().split("T")[0]);
      setTab("buy");

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
            <Select
              value={cryptoOptions.find(
                (option) => option.value === selectedCrypto,
              )}
              onChange={(option) => {
                if (option) {
                  setSelectedCrypto(option.value);
                }
              }}
              options={cryptoOptions}
              formatOptionLabel={(option: CryptoOption) => (
                <div className="flex items-center">
                  <img
                    src={option.logoUrl}
                    alt={option.value}
                    className="w-6 h-6 mr-2"
                  />
                  <span>{option.label}</span>
                </div>
              )}
              className="text-gray-900"
              placeholder="Search cryptocurrency..."
              isClearable
              isSearchable
              classNames={{
                control: (state) =>
                  "p-1 bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
                input: () => "text-gray-900",
                option: (state) =>
                  state.isFocused
                    ? "bg-blue-50 cursor-pointer"
                    : "bg-white cursor-pointer hover:bg-gray-50",
              }}
            />
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
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) setSelectedDate(date);
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMM d, yyyy h:mm aa"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              popperClassName="react-datepicker-popper"
              calendarClassName="rounded-lg border shadow-lg"
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
