'use client';
import { useEffect, useState } from 'react';
import { analyticsApi } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#4f6ef7','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];
function fmt(n: number) { return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(n); }

export default function AnalyticsPage() {
  const [trend, setTrend] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    analyticsApi.dashboard().then(r => setDashboard(r.data));
    analyticsApi.monthlyTrend().then(r => setTrend(r.data));
  }, []);

  const barData = MONTHS.map((month, i) => ({
    month,
    income: trend?.income?.find((t: any) => t.month === i + 1)?.amount || 0,
    expense: trend?.expense?.find((t: any) => t.month === i + 1)?.amount || 0,
  }));

  const pieData = dashboard?.categorySpending?.slice(0, 8).map((c: any) => ({
    name: c.category || 'Other', value: Number(c.amount)
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-slate-400 text-sm">Financial insights and statistics</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Monthly Income', value: fmt(dashboard?.monthlyIncome || 0), color: '#10b981' },
          { label: 'Monthly Expense', value: fmt(dashboard?.monthlyExpense || 0), color: '#ef4444' },
          { label: 'Net Savings', value: fmt(dashboard?.netSavings || 0), color: '#4f6ef7' },
        ].map(c => (
          <div key={c.label} className="card text-center">
            <div className="text-2xl font-bold" style={{color: c.color}}>{c.value}</div>
            <div className="text-slate-400 text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card">
        <h3 className="font-semibold mb-4">Monthly Income vs Expenses ({new Date().getFullYear()})</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
            <XAxis dataKey="month" tick={{fill:'#64748b', fontSize:12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill:'#64748b', fontSize:12}} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip contentStyle={{background:'#161b27', border:'1px solid #1e2535', borderRadius:'8px', color:'white'}} formatter={(v: any) => fmt(v)} />
            <Legend wrapperStyle={{color:'#94a3b8', fontSize:'12px'}} />
            <Bar dataKey="income" fill="#10b981" radius={[4,4,0,0]} name="Income" />
            <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="card">
        <h3 className="font-semibold mb-4">Spending Breakdown</h3>
        {pieData.length > 0 ? (
          <div className="flex items-start gap-8">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{background:'#161b27', border:'1px solid #1e2535', borderRadius:'8px'}} formatter={(v: any) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2 pt-4">
              {pieData.map((item: any, i: number) => {
                const total = pieData.reduce((s: number, x: any) => s + x.value, 0);
                const pct = total > 0 ? Math.round(item.value / total * 100) : 0;
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{background: COLORS[i % COLORS.length]}} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-slate-400">{pct}%</span>
                        <span className="font-medium">{fmt(item.value)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{background:'#1e2535'}}>
                      <div className="h-full rounded-full" style={{width:`${pct}%`, background: COLORS[i % COLORS.length]}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : <p className="text-slate-500 text-sm text-center py-8">Add transactions to see spending breakdown</p>}
      </div>
    </div>
  );
}
