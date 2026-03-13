'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { TrendingUp, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', currency: 'USD' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        email: form.email,
        username: form.fullName,
        password: form.password,
        currency: form.currency,
      };
      const res = await authApi.register(payload);
      setUser(res.data);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-fadeIn">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <h2 style={{ fontSize: 28, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Create account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Start managing your finances today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="input" placeholder="Alex Johnson" style={{ paddingLeft: 38 }}
                value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" className="input" placeholder="you@example.com" style={{ paddingLeft: 38 }}
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" className="input" placeholder="Min 6 characters" style={{ paddingLeft: 38 }}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
            </div>
          </div>
          <div>
            <label className="label">Default Currency</label>
            <select className="input" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
              <option value="USD">🇺🇸 USD — US Dollar</option>
              <option value="EUR">🇪🇺 EUR — Euro</option>
              <option value="GBP">🇬🇧 GBP — British Pound</option>
              <option value="UZS">🇺🇿 UZS — Uzbek Som</option>
              <option value="KZT">🇰🇿 KZT — Kazakhstani Tenge</option>
              <option value="JPY">🇯🇵 JPY — Japanese Yen</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', marginTop: 4 }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 13 }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
