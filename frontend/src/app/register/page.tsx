'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '', currency: 'USD' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authApi.register(form);
      login(res.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'radial-gradient(ellipse at top, #1a1f35 0%, #0f1117 70%)'}}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-2"><span style={{color:'#4f6ef7'}}>Finance</span>AI</div>
          <p className="text-slate-400">Create your account</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Get started</h2>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Full Name</label>
              <input placeholder="John Doe" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="UZS">UZS — Uzbek Som</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-4">
            Have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
