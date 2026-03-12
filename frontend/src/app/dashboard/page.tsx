'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { accountsApi, transactionsApi, analyticsApi } from '@/services/api';
import { Account, Transaction, Analytics } from '@/types';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet, ArrowUpDown, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899'];

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const from = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const to = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        const [acctRes, txRes, analyticsRes] = await Promise.all([
          accountsApi.getAll(),
          transactionsApi.getAll({ from, to }),
          analyticsApi.get(from, to),
        ]);
        setAccounts(acctRes.data);
        setTransactions(txRes.data.slice(0, 8));
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const currency = accounts[0]?.currency || 'USD';

  if (loading) return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse-soft 1.5s infinite' }}>⟳</div>
          Loading your dashboard...
        </div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontFamily: 'var(--font-display)', marginBottom: 4 }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {format(new Date(), 'EEEE, MMMM do yyyy')}
            </p>
          </div>
          <Link href="/transactions">
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Add Transaction
            </button>
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          <div className="stat-card accent">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Total Balance</div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(totalBalance, currency)}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={20} color="var(--accent-light)" />
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{accounts.length} active accounts</div>
          </div>

          <div className="stat-card green">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Income (Month)</div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--green)' }}>
                  {formatCurrency(analytics?.totalIncome || 0, currency)}
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--green-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} color="var(--green)" />
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>This month&apos;s earnings</div>
          </div>

          <div className="stat-card red">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Expenses (Month)</div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--red)' }}>
                  {formatCurrency(analytics?.totalExpenses || 0, currency)}
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingDown size={20} color="var(--red)" />
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>This month&apos;s spending</div>
          </div>

          <div className="stat-card blue">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Net Balance</div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 500, color: (analytics?.netBalance || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {formatCurrency(analytics?.netBalance || 0, currency)}
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpDown size={20} color="var(--blue)" />
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Income minus expenses</div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }}>
          {/* Spending Chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Monthly Overview</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Income vs Expenses trend</p>
            </div>
            {analytics?.monthlyStats && analytics.monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics.monthlyStats}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No data for this period
              </div>
            )}
          </div>

          {/* Category Pie */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Spending by Category</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>This month</p>
            </div>
            {analytics?.categoryStats && analytics.categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={analytics.categoryStats} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    dataKey="amount" nameKey="categoryName" paddingAngle={2}>
                    {analytics.categoryStats.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v, currency)}
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No expense data
              </div>
            )}
            {analytics?.categoryStats?.slice(0, 4).map((cat, i) => (
              <div key={cat.categoryName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.categoryName}</span>
                </div>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{cat.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts + Recent Transactions */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
          {/* Accounts */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Accounts</h3>
              <Link href="/accounts" style={{ fontSize: 12, color: 'var(--accent-light)', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {accounts.map(acc => (
                <div key={acc.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: acc.color || '#6366f1', opacity: 0.9,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14,
                    }}>
                      {acc.type === 'CASH' ? '💵' : acc.type === 'CARD' ? '💳' : acc.type === 'SAVINGS' ? '🏦' : '📊'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{acc.type}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    {formatCurrency(acc.balance, acc.currency)}
                  </div>
                </div>
              ))}
              {accounts.length === 0 && (
                <Link href="/accounts" style={{ textDecoration: 'none' }}>
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
                    + Add your first account
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Recent Transactions</h3>
              <Link href="/transactions" style={{ fontSize: 12, color: 'var(--accent-light)', textDecoration: 'none' }}>View all</Link>
            </div>
            {transactions.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{tx.description || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tx.accountName}</div>
                      </td>
                      <td>
                        {tx.categoryName ? (
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 20,
                            background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)',
                          }}>
                            {tx.categoryName}
                          </span>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {format(new Date(tx.date), 'MMM dd')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={tx.type === 'INCOME' ? 'amount-positive' : 'amount-negative'} style={{ fontSize: 14 }}>
                          {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 13 }}>
                No transactions this month
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
