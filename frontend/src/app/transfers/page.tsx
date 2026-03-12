'use client';
import { useEffect, useState } from 'react';
import { transferApi, accountApi } from '@/services/api';
import { Account } from '@/types';
import Modal from '@/components/common/Modal';

function fmt(n: number) { return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(n); }

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ fromAccountId: '', toAccountId: '', amount: '', exchangeRate: '1', description: '' });

  useEffect(() => {
    transferApi.getAll().then(r => setTransfers(r.data));
    accountApi.getAll().then(r => setAccounts(r.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await transferApi.create({ ...form, amount: parseFloat(form.amount), exchangeRate: parseFloat(form.exchangeRate) });
    setTransfers([res.data, ...transfers]);
    accountApi.getAll().then(r => setAccounts(r.data));
    setModal(false);
    setForm({ fromAccountId: '', toAccountId: '', amount: '', exchangeRate: '1', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Transfers</h1>
          <p className="text-slate-400 text-sm">Move money between accounts</p></div>
        <button className="btn-primary" onClick={() => setModal(true)}>+ New Transfer</button>
      </div>

      <div className="card">
        <div className="space-y-2">
          {transfers.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No transfers yet</p>}
          {transfers.map((t, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'rgba(79,110,247,0.15)'}}>
                🔄
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{t.fromAccount?.name} → {t.toAccount?.name}</div>
                <div className="text-xs text-slate-500">{t.description || 'Transfer'} · {new Date(t.date).toLocaleDateString()}</div>
              </div>
              <div className="text-blue-400 font-semibold">{fmt(t.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="New Transfer">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm text-slate-400 mb-1">From Account</label>
            <select value={form.fromAccountId} onChange={e => setForm({...form, fromAccountId: e.target.value})} required>
              <option value="">Select source</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name} — {fmt(a.balance)}</option>)}
            </select></div>
          <div><label className="block text-sm text-slate-400 mb-1">To Account</label>
            <select value={form.toAccountId} onChange={e => setForm({...form, toAccountId: e.target.value})} required>
              <option value="">Select destination</option>
              {accounts.filter(a => a.id !== form.fromAccountId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-400 mb-1">Amount</label>
              <input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Exchange Rate</label>
              <input type="number" step="0.0001" value={form.exchangeRate} onChange={e => setForm({...form, exchangeRate: e.target.value})} /></div>
          </div>
          <div><label className="block text-sm text-slate-400 mb-1">Note</label>
            <input placeholder="Optional description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1">Transfer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
