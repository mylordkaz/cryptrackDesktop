import { useState } from "react";
import DatePicker from "react-datepicker";
import { UpdateTransaction } from "../../wailsjs/go/main/App";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    cryptoSymbol: string;
    amount: number;
    price: number;
    total: number;
    date: string;
    type: string;
    note: string;
  };
  onTransactionUpdated: (transaction: any) => void;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated,
}: EditTransactionModalProps) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [price, setPrice] = useState(transaction.price.toString());
  const [total, setTotal] = useState(transaction.total.toString());
  const [note, setNote] = useState(transaction.note || "");
  const [selectedDate, setSelectedDate] = useState(new Date(transaction.date));

  const displayTotal = transaction.type === "sell" ? -total : total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedDate = selectedDate
        .toISOString()
        .replace(/\.\d{3}Z$/, "")
        .slice(0, 16);

      const submitTotal =
        transaction.type === "sell"
          ? -Math.abs(parseFloat(total))
          : Math.abs(parseFloat(total));

      await UpdateTransaction(
        transaction.id,
        parseFloat(amount),
        parseFloat(price),
        submitTotal,
        formattedDate,
        note,
      );

      const UpdatedTransaction = {
        ...transaction,
        amount: parseFloat(amount),
        price: parseFloat(price),
        total: submitTotal,
        date: formattedDate,
        note: note,
      };

      onTransactionUpdated(UpdatedTransaction);
      onClose();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-text/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-surface-card p-8 rounded-2xl w-[480px] shadow-xl border border-border">
        <h2 className="text-xl font-semibold mb-6 text-text">
          Edit Transaction
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Quantity</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setTotal(
                  (parseFloat(e.target.value) * parseFloat(price)).toString(),
                );
              }}
              className="w-full p-3 bg-gray-50 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Price</label>
            <input
              type="text"
              value={`$ ${price}`}
              onChange={(e) => {
                const value = e.target.value.replace("$", "").trim();
                setPrice(value);
                if (!isNaN(parseFloat(value))) {
                  setTotal((parseFloat(amount) * parseFloat(value)).toString());
                }
              }}
              className="w-full p-3 bg-gray-50 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Total</label>
            <input
              type="text"
              value={`$ ${displayTotal}`}
              onChange={(e) => {
                const value = e.target.value.replace("$", "").trim();
                setTotal(value);
              }}
              className="w-full p-3 bg-gray-50 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMM d, yyyy h:mm aa"
              className="w-full p-3 bg-gray-50 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Note</label>
            <textarea
              placeholder="Add a note to this transaction..."
              className="w-full p-3 bg-gray-50 border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light active:bg-primary-dark transition-colors"
            >
              Update Transaction
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-text font-medium rounded-lg hover:bg-surface border border-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
