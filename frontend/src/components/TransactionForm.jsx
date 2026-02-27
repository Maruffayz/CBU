import React, { useState } from 'react';
import { useFinanceDispatch } from '../context';

const categories = [
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'transport', name: 'Transport', icon: '🚕' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'salary', name: 'Salary', icon: '💼' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
];

const accounts = [
  { id: 'cash', label: 'Cash' },
  { id: 'cards', label: 'Cards' },
];

export default function TransactionForm({ onClose }) {
  const dispatch = useFinanceDispatch();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [accountId, setAccountId] = useState('cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    const parsedAmount = parseFloat(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    }
    if (!categoryId) {
      newErrors.categoryId = 'Please select a category.';
    }
    if (!accountId) {
      newErrors.accountId = 'Please select an account.';
    }
    if (!date) {
      newErrors.date = 'Please select a date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);
    const category = categories.find((c) => c.id === categoryId);

    const transaction = {
      id: Date.now().toString(),
      type,
      amount: parsedAmount,
      description,
      category,
      account: accountId,
      date,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: { transaction } });
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Add Transaction</h2>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-200 text-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-2 bg-slate-800/60 rounded-xl p-1 text-xs">
            {['income', 'expense', 'transfer'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg py-2 capitalize transition-colors ${
                  type === t
                    ? 'bg-emerald-500 text-slate-950 font-medium'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              className={`w-full rounded-xl bg-slate-800 border px-3 py-2 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 ${
                errors.amount ? 'border-rose-500' : 'border-slate-700'
              }`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-400">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description (optional)</label>
            <input
              type="text"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Starbucks, Taxi, Rent"
            />
          </div>

          <div>
            <p className="block text-xs font-medium text-slate-300 mb-1">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                    categoryId === cat.id
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-rose-400">{errors.categoryId}</p>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">Account</label>
              <select
                className={`w-full rounded-xl bg-slate-800 border px-3 py-2 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 ${
                  errors.accountId ? 'border-rose-500' : 'border-slate-700'
                }`}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.label}
                  </option>
                ))}
              </select>
              {errors.accountId && (
                <p className="mt-1 text-xs text-rose-400">{errors.accountId}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                className={`w-full rounded-xl bg-slate-800 border px-3 py-2 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 ${
                  errors.date ? 'border-rose-500' : 'border-slate-700'
                }`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-rose-400">{errors.date}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold py-2.5 mt-2 transition-colors"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
