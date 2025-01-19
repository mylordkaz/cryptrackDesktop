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
    Array<{
      symbol: string;
      name: string;
      currentPrice: number;
      logoUrl: string;
    }>
  >([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

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
    setError("");

    if (!selectedCrypto) {
      setError("Please select a cryptocurrency");
      return;
    }

    const formattedDate = selectedDate.toISOString().slice(0, 16);
    const submitTotal =
      tab === "sell"
        ? -Math.abs(parseFloat(total))
        : Math.abs(parseFloat(total));

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
        submitTotal,
        formattedDate,
        tab,
        note,
      );

      setSelectedCrypto("");
      setQuantity("");
      setPrice("");
      setTotal("");
      setDate(new Date().toISOString().split("T")[0]);
      setTab("buy");
      setError("");
      setNote("");

      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error("failed to save transaction:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-text/20 backdrop-blur-sm flex items-center justify-center overflow-y-auto">
      <div className="relative min-h-screen w-full flex items-center justify-center p-4">
        <div className="bg-surface-card rounded-2xl w-full max-w-md shadow-sm border border-border max-h-[90vh] overflow-y-auto">
          {/* Buy/Sell Tabs */}
          <div className="flex bg-surface-secondary rounded-t-2xl">
            <div
              className={`flex-1 relative text-center px-8 py-3 cursor-pointer select-none
            ${
              tab === "buy"
                ? "bg-surface-card rounded-t-xl"
                : "bg-surface-secondary rounded-t-xl rounded-br-xl"
            }
          `}
              onClick={() => setTab("buy")}
            >
              <span
                className={`font-bold text-lg ${tab === "buy" ? "text-primary" : "text-text-light"}`}
              >
                Buy
              </span>
              {tab === "buy" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-card" />
              )}
            </div>
            <div
              className={`flex-1  relative text-center px-8 py-3 cursor-pointer select-none
            ${
              tab === "sell"
                ? "bg-surface-card rounded-t-xl"
                : "bg-surface-secondary rounded-t-xl rounded-bl-xl"
            }
          `}
              onClick={() => setTab("sell")}
            >
              <span
                className={`font-bold text-lg ${tab === "sell" ? "text-red-500" : "text-text-light"}`}
              >
                Sell
              </span>
              {tab === "sell" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-card" />
              )}
            </div>
          </div>

          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Select Crypto */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">
                  Select Crypto <span className="text-red-400">*</span>
                </label>
                <Select
                  value={cryptoOptions.find(
                    (option) => option.value === selectedCrypto,
                  )}
                  onChange={(option) => {
                    if (option) {
                      setSelectedCrypto(option.value);
                      setError("");
                    } else {
                      setSelectedCrypto("");
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
                  className={`text-gray-900 ${!selectedCrypto && "border-red-500"}`}
                  placeholder="Search cryptocurrency..."
                  isClearable
                  isSearchable
                  classNames={{
                    control: (state) =>
                      `!min-h-[40px] bg-surface-secondary border ${
                        !selectedCrypto ? "border-red-500" : "border-border"
                      } rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary`,
                    input: () => "text-gray-900",
                    option: (state) =>
                      state.isFocused
                        ? "bg-surface-secondary cursor-pointer"
                        : "bg-surface-card cursor-pointer hover:bg-gray-50",
                  }}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>

              {/* Amount and Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full h-10 px-3 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">
                    Price per coin
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full h-10 px-3 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Total */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Total</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full h-10 px-3 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    if (date) setSelectedDate(date);
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMM d, yyyy h:mm aa"
                  className="w-full h-10 px-3 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  popperClassName="react-datepicker-popper"
                  calendarClassName="rounded-lg border shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Note</label>
                <textarea
                  placeholder="Add a note to this transaction..."
                  className="w-full h-20 px-3 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {" "}
                {/* reduced spacing */}
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light active:bg-primary-dark transition-colors"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 bg-surface-secondary text-text font-medium rounded-lg hover:bg-surface border-border border transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
