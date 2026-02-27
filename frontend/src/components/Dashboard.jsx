import React, { useState } from 'react';
import { useFinanceState } from '../context';
import BalanceCard from './BalanceCard';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';

export default function Dashboard() {
  const { accounts, transactions } = useFinanceState();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Welcome back 👋</h1>
            <p className="text-sm text-slate-500">Your personal finance overview</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold px-4 py-2 transition-colors"
          >
            + Add Transaction
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <BalanceCard label="Total Balance" amount={accounts.total} />
          <BalanceCard label="Cash" amount={accounts.cash} />
          <BalanceCard label="Cards" amount={accounts.cards} />
        </section>

        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <h2 className="text-sm font-medium text-slate-200 mb-3">Quick actions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex-1 min-w-[100px] rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-medium py-2 px-3 hover:bg-emerald-500/20 transition-colors"
              >
                Add Income
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex-1 min-w-[100px] rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-medium py-2 px-3 hover:bg-rose-500/20 transition-colors"
              >
                Add Expense
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex-1 min-w-[100px] rounded-xl bg-sky-500/10 border border-sky-500/40 text-sky-300 text-xs font-medium py-2 px-3 hover:bg-sky-500/20 transition-colors"
              >
                Transfer
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <h2 className="text-sm font-medium text-slate-200 mb-3">Recent transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500">No transactions yet. Add your first one!</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {transactions.slice(0, 5).map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </div>
        </section>

        {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
      </div>
    </div>
  );
}
