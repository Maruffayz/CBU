'use client';
import { useEffect, useState } from 'react';
import { transactionApi, accountApi, categoryApi } from '@/services/api';
import { Transaction, Account, Category } from '@/types';
import Modal from '@/components/common/Modal';
import { format } from 'date-fns';

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<'income'|'expense'|null>(null);
  const [form, setForm] = useState({ amount: '', date: new Date().toISOString().split('T')[0], description: '', categoryId: '', accountId: '' });

  useEffect(() => {
    transactionApi.getAll().then(r => setTxs(r.data));
    accountApi.getAll().then(r => setAccounts(r.data));
    categoryApi.getAll().then(r => setCategories(r.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fn = modal === 'income' ? transactionApi.addIncome : transactionApi.addExpense;
    const res = await fn({ ...form, amount: parseFloat(form.amount) });
    setTxs([res.data, ...txs]);
    setModal(null);
    setForm({ amount: '', date: new Date().toISOString().split('T')[0], description: '', categoryId: '', accountId: '' });
    accountApi.getAll().then(r => setAccounts(r.data));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await transactionApi.delete(id);
    setTxs(txs.filter(t => t.id !== id));
  };

  const filteredCats = categories.filter(c => c.type === (modal === 'income' ? 'INCOME' : 'EXPENSE'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-slate-400 text-sm">{txs.length} total transactions</p></div>
        <div className="flex gap-2">
          <button className="btn-primary" style={{background:'#10b981'}} onClick={() => setModal('income')}>+ Income</button>
          <button className="btn-primary" style={{background:'#ef4444'}} onClick={() => setModal('expense')}>+ Expense</button>
        </div>
      </div>

      <div className="card">
        <div className="space-y-1">
          {txs.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No transactions yet</p>}
          {txs.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{background: (tx.categoryColor || '#4f6ef7') + '20'}}>
                {tx.categoryIcon || (tx.type === 'INCOME' ? '💰' : '💸')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{tx.description || tx.categoryName || tx.type}</div>
                <div className="text-slate-500 text-xs">{tx.accountName} · {tx.date}</div>
              </div>
              <div className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
              </div>
              <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 text-xs transition-all ml-2">✕</button>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'income' ? 'Add Income' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-slate-400 mb-1">Amount</label>
            <input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-400 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Account</label>
              <select value={form.accountId} onChange={e => setForm({...form, accountId: e.target.value})} required>
                <option value="">Select account</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select></div>
          </div>
          <div><label className="block text-sm text-slate-400 mb-1">Category</label>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
              <option value="">Auto-detect</option>
              {filteredCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select></div>
          <div><label className="block text-sm text-slate-400 mb-1">Description</label>
            <input placeholder="e.g. Grocery shopping, Taxi, Salary..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setModal(null)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1"
              style={{background: modal === 'income' ? '#10b981' : '#ef4444'}}>
              Add {modal === 'income' ? 'Income' : 'Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
