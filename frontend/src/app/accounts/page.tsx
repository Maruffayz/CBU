'use client';
import { useEffect, useState } from 'react';
import { accountApi } from '@/services/api';
import { Account } from '@/types';
import Modal from '@/components/common/Modal';

const TYPE_ICONS: Record<string,string> = { CARD:'💳', CASH:'💵', BANK_ACCOUNT:'🏛️', SAVINGS:'🏦' };
const COLORS = ['#4f6ef7','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

function fmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'CARD', currency: 'USD', balance: '0', color: '#4f6ef7' });

  useEffect(() => { accountApi.getAll().then(r => setAccounts(r.data)); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await accountApi.create({ ...form, balance: parseFloat(form.balance) });
    setAccounts([...accounts, res.data]);
    setModal(false);
    setForm({ name: '', type: 'CARD', currency: 'USD', balance: '0', color: '#4f6ef7' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete account?')) return;
    await accountApi.delete(id);
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const total = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Accounts</h1>
          <p className="text-slate-400 text-sm">Total: <span className="text-white font-semibold">{fmt(total)}</span></p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>+ Add Account</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <div key={acc.id} className="card relative overflow-hidden" style={{borderColor: acc.color + '40'}}>
            <div className="absolute inset-0 opacity-5 rounded-2xl" style={{background: `radial-gradient(circle at top right, ${acc.color}, transparent)`}} />
            <div className="flex justify-between items-start">
              <div><div className="text-lg font-semibold">{acc.name}</div>
                <div className="text-slate-400 text-xs uppercase tracking-wide">{acc.type.replace('_',' ')}</div></div>
              <span className="text-2xl">{TYPE_ICONS[acc.type]}</span>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-bold" style={{color: acc.color}}>{fmt(acc.balance, acc.currency)}</div>
              <div className="text-slate-500 text-xs mt-1">{acc.currency}</div>
            </div>
            <div className="mt-4">
              <button onClick={() => handleDelete(acc.id)} className="text-slate-500 hover:text-red-400 text-xs transition-colors">Delete</button>
            </div>
          </div>
        ))}
        <div className="card flex items-center justify-center cursor-pointer hover:border-blue-500/40 transition-all"
          style={{minHeight:'180px', borderStyle:'dashed', borderColor:'#1e2535'}} onClick={() => setModal(true)}>
          <div className="text-center text-slate-500 hover:text-slate-400 transition-colors">
            <div className="text-3xl mb-2">+</div>
            <div className="text-sm">Add Account</div>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Account">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="block text-sm text-slate-400 mb-1">Name</label>
            <input placeholder="My Visa Card" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-400 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {['CARD','CASH','BANK_ACCOUNT','SAVINGS'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select></div>
            <div><label className="block text-sm text-slate-400 mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                {['USD','EUR','GBP','UZS'].map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
          </div>
          <div><label className="block text-sm text-slate-400 mb-1">Starting Balance</label>
            <input type="number" step="0.01" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} /></div>
          <div><label className="block text-sm text-slate-400 mb-2">Color</label>
            <div className="flex gap-2">{COLORS.map(c => (
              <button type="button" key={c} onClick={() => setForm({...form, color: c})}
                className="w-7 h-7 rounded-full border-2 transition-all" style={{background: c, borderColor: form.color === c ? 'white' : 'transparent'}} />
            ))}</div></div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
