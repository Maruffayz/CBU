'use client';
import { useEffect, useState } from 'react';
import { budgetApi, categoryApi } from '@/services/api';
import { Budget, Category } from '@/types';
import Modal from '@/components/common/Modal';

function fmt(n: number) { return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(n); }

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState(false);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [form, setForm] = useState({ type: 'EXPENSE', categoryId: '', amount: '', month: now.getMonth()+1, year: now.getFullYear() });

  const load = () => budgetApi.get(month, year).then((r: any) => setBudgets(r.data));
  useEffect(() => { load(); categoryApi.getAll().then(r => setCategories(r.data)); }, [month, year]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await budgetApi.create({ ...form, amount: parseFloat(form.amount as any) });
    load();
    setModal(false);
    setForm({ type: 'EXPENSE', categoryId: '', amount: '', month, year });
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-slate-400 text-sm">Plan vs actual spending</p></div>
        <div className="flex items-center gap-3">
          <select value={month} onChange={e => setMonth(+e.target.value)} style={{width:'auto', padding:'8px 12px'}}>
            {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(+e.target.value)} style={{width:'auto', padding:'8px 12px'}}>
            {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setModal(true)}>+ Add Budget</button>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-slate-400">No budgets set for this month</p>
            <button className="btn-primary mt-4" onClick={() => setModal(true)}>Create Budget</button>
          </div>
        )}
        {budgets.map((b: any) => {
          const pct = Math.min(100, Number(b.percentage));
          const over = pct >= 100;
          return (
            <div key={b.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.categoryIcon || '🎯'}</span>
                  <div>
                    <div className="font-medium">{b.categoryName || (b.type === 'INCOME' ? 'Total Income' : 'Total Expenses')}</div>
                    <div className="text-xs text-slate-400">{b.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{fmt(b.actual)} <span className="text-slate-500">/ {fmt(b.budgeted)}</span></div>
                  <div className={`text-xs ${over ? 'text-red-400' : 'text-green-400'}`}>
                    {over ? `${fmt(Math.abs(b.remaining))} over` : `${fmt(b.remaining)} left`}
                  </div>
                </div>
              </div>
              <div className="h-2 rounded-full" style={{background:'#1e2535'}}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{width:`${pct}%`, background: over ? '#ef4444' : pct > 80 ? '#f59e0b' : '#10b981'}} />
              </div>
              <div className="text-xs text-slate-500 mt-1">{Math.round(pct)}% used</div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Budget">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-400 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select></div>
            <div><label className="block text-sm text-slate-400 mb-1">Category</label>
              <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">Overall</option>
                {categories.filter(c => c.type === form.type).map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select></div>
          </div>
          <div><label className="block text-sm text-slate-400 mb-1">Budget Amount</label>
            <input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-400 mb-1">Month</label>
              <select value={form.month} onChange={e => setForm({...form, month: +e.target.value})}>
                {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select></div>
            <div><label className="block text-sm text-slate-400 mb-1">Year</label>
              <select value={form.year} onChange={e => setForm({...form, year: +e.target.value})}>
                {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Budget</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
