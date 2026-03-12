'use client';
import { useEffect, useState } from 'react';
import { analyticsApi, accountApi } from '@/services/api';
import { DashboardData, Account } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#4f6ef7','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];

function fmt(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    analyticsApi.dashboard().then(r => setData(r.data));
    accountApi.getAll().then(r => setAccounts(r.data));
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const trendData = MONTHS.map((month, i) => ({
    month,
    income: data?.monthlyTrend.income.find(t => t.month === i + 1)?.amount || 0,
    expense: data?.monthlyTrend.expense.find(t => t.month === i + 1)?.amount || 0,
  }));

  const pieData = data?.categorySpending.slice(0, 6).map(c => ({
    name: c.category || 'Other', value: Number(c.amount)
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Balance', value: fmt(totalBalance), icon: '🏦', color: '#4f6ef7', change: '+2.4%' },
          { label: 'Monthly Income', value: fmt(data?.monthlyIncome || 0), icon: '📈', color: '#10b981', change: '' },
          { label: 'Monthly Expenses', value: fmt(data?.monthlyExpense || 0), icon: '📉', color: '#ef4444', change: '' },
          { label: 'Net Savings', value: fmt(data?.netSavings || 0), icon: '💰', color: '#8b5cf6', change: '' },
        ].map((card) => (
          <div key={card.label} className="card" style={{borderColor: card.color + '33'}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{background: card.color + '20', color: card.color}}>
                {card.change || 'This month'}
              </span>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-slate-400 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Trend */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
              <XAxis dataKey="month" tick={{fill:'#64748b', fontSize:12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'#64748b', fontSize:12}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:'#161b27', border:'1px solid #1e2535', borderRadius:'8px', color:'white'}} />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Spending */}
        <div className="card">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{background:'#161b27', border:'1px solid #1e2535', borderRadius:'8px'}} formatter={(v: any) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{background: COLORS[i % COLORS.length]}} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-slate-400">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-slate-500 text-sm">No expense data yet</p>}
        </div>
      </div>

      {/* Accounts */}
      <div className="card">
        <h3 className="font-semibold mb-4">My Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accounts.map(acc => (
            <div key={acc.id} className="p-4 rounded-xl" style={{background: acc.color + '15', border: `1px solid ${acc.color}30`}}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{acc.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{acc.type.replace('_', ' ')}</div>
                </div>
                <span className="text-lg">{acc.type === 'CARD' ? '💳' : acc.type === 'CASH' ? '💵' : acc.type === 'SAVINGS' ? '🏦' : '🏛️'}</span>
              </div>
              <div className="mt-3 text-xl font-bold" style={{color: acc.color}}>
                {fmt(acc.balance, acc.currency)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{acc.currency}</div>
            </div>
          ))}
          {accounts.length === 0 && <p className="text-slate-500 text-sm col-span-3">No accounts yet. <a href="/accounts" className="text-blue-400">Add one →</a></p>}
        </div>
      </div>
    </div>
  );
}
