'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { TrendingUp, Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setUser(res.data);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async () => {
    setForm({ email: 'demo@financeapp.com', password: 'demo123' });
    setLoading(true);
    try {
      const res = await authApi.login({ email: 'demo@financeapp.com', password: 'demo123' });
      setUser(res.data);
      router.push('/dashboard');
    } catch {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'linear-gradient(135deg, #0d1220 0%, #141926 100%)',
        borderRight: '1px solid var(--border)', maxWidth: '480px',
      }} className="hidden lg:flex">
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={20} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)' }}>FinanceOS</span>
          </div>
          <h1 style={{
            fontSize: 42, fontFamily: 'var(--font-display)', lineHeight: 1.2,
            color: 'var(--text-primary)', marginBottom: 16,
          }}>
            Your money,<br /><em style={{ color: 'var(--accent-light)' }}>under control.</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15 }}>
            Track expenses, manage budgets, and gain insights into your financial health — all in one elegant dashboard.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '📊', title: 'Real-time Analytics', desc: 'Visual breakdowns of your spending' },
            { icon: '🎯', title: 'Smart Budgeting', desc: 'Set and track monthly goals' },
            { icon: '🤖', title: 'Auto-categorization', desc: 'AI tags your transactions' },
          ].map(item => (
            <div key={item.title} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: 'rgba(255,255,255,0.03)', borderRadius: 12,
              padding: '14px 16px', border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-fadeIn">
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} className="lg:hidden">
              <TrendingUp size={24} color="white" />
            </div>
            <h2 style={{ fontSize: 28, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email" className="input" placeholder="you@example.com"
                  style={{ paddingLeft: 38 }}
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password" className="input" placeholder="••••••••"
                  style={{ paddingLeft: 38 }}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px' }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--text-muted)', fontSize: 12 }}>or</div>

          <button onClick={loginDemo} className="btn-secondary" disabled={loading}
            style={{ width: '100%', padding: '12px', justifyContent: 'center', display: 'flex' }}>
            🚀 Try Demo Account
          </button>

          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--text-muted)', fontSize: 13 }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
