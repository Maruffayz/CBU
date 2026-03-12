'use client';
import { useEffect, useState } from 'react';
import { debtApi } from '@/services/api';
import { Debt } from '@/types';
import Modal from '@/components/common/Modal';

function fmt(n: number) { return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(n); }

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type: 'DEBT', personName: '', amount: '', description: '', dueDate: '' });

  useEffect(() => { debtApi.getAll().then(r => setDebts(r.data)); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await debtApi.create({ ...form, amount: parseFloat(form.amount) });
    setDebts([res.data, ...debts]);
    setModal(false);
    setForm({ type: 'DEBT', personName: '', amount: '', description: '', dueDate: '' });
  };

  const handleClose = async (id: string) => {
    const res = await debtApi.close(id);
    setDebts(debts.map(d => d.id === id ? res.data : d));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await debtApi.delete(id);
    setDebts(debts.filter(d => d.id !== id));
  };

  const open = debts.filter(d => d.status === 'OPEN');
  const closed = debts.filter(d => d.status === 'CLOSED');
  const iOwe = open.filter(d => d.type === 'DEBT').reduce((s, d) => s + d.amount, 0);
  const owedToMe = open.filter(d => d.type === 'RECEIVABLE').reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Debts & Receivables</h1>
          <p className="text-slate-400 text-sm">Track money you owe and money owed to you</p></div>
        <button className="btn-primary" onClick={() => setModal(true)}>+ Add</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card" style={{borderColor:'#ef444440'}}>
          <div className="text-slate-400 text-sm">I owe</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{fmt(iOwe)}</div>
        </div>
        <div className="card" style={{borderColor:'#10b98140'}}>
          <div className="text-slate-400 text-sm">Owed to me</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{fmt(owedToMe)}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Open ({open.length})</h3>
        <div className="space-y-2">
          {open.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No open debts</p>}
          {open.map(debt => (
            <div key={debt.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{background: debt.type === 'DEBT' ? '#ef444420' : '#10b98120'}}>
                {debt.type === 'DEBT' ? '📤' : '📥'}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{debt.personName}</div>
                <div className="text-xs text-slate-500">{debt.description}{debt.dueDate && ` · Due ${debt.dueDate}`}</div>
              </div>
              <div className={`font-semibold ${debt.type === 'DEBT' ? 'text-red-400' : 'text-green-400'}`}>
                {debt.type === 'DEBT' ? '-' : '+'}{fmt(debt.amount)}
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all">
                <button onClick={() => handleClose(debt.id)} className="text-green-500 text-xs hover:text-green-400">✓</button>
                <button onClick={() => handleDelete(debt.id)} className="text-slate-500 text-xs hover:text-red-400">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {closed.length > 0 && (
        <div className="card opacity-60">
          <h3 className="font-semibold mb-4">Closed ({closed.length})</h3>
          <div className="space-y-2">
            {closed.map(debt => (
              <div key={debt.id} className="flex items-center gap-4 p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{background:'#ffffff10'}}>✅</div>
                <div className="flex-1"><div className="font-medium text-sm line-through text-slate-500">{debt.personName}</div></div>
                <div className="text-slate-500 line-through text-sm">{fmt(debt.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Debt / Receivable">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="cursor-pointer" onClick={() => setForm({...form, type: 'DEBT'})}>
              <div className={`p-3 rounded-xl border text-center transition-all ${form.type === 'DEBT' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'}`}>
                <div className="text-2xl">📤</div><div className="text-sm mt-1">I owe</div>
              </div>
            </div>
            <div className="cursor-pointer" onClick={() => setForm({...form, type: 'RECEIVABLE'})}>
              <div className={`p-3 rounded-xl border text-center transition-all ${form.type === 'RECEIVABLE' ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'}`}>
                <div className="text-2xl">📥</div><div className="text-sm mt-1">Owed to me</div>
              </div>
            </div>
          </div>
          <div><label className="block text-sm text-slate-400 mb-1">Person Name</label>
            <input placeholder="John Smith" value={form.personName} onChange={e => setForm({...form, personName: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-400 mb-1">Amount</label>
              <input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
          </div>
          <div><label className="block text-sm text-slate-400 mb-1">Description</label>
            <input placeholder="Loan for apartment..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
