'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import {
  LayoutDashboard, CreditCard, ArrowUpDown, ArrowLeftRight,
  Users, Target, BarChart3, Calendar, LogOut, TrendingUp
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/accounts', icon: CreditCard, label: 'Accounts' },
  { href: '/transactions', icon: ArrowUpDown, label: 'Transactions' },
  { href: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { href: '/debts', icon: Users, label: 'Debts' },
  { href: '/budgets', icon: Target, label: 'Budgets' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', padding: '24px 16px', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8, marginBottom: 32 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TrendingUp size={16} color="white" />
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)' }}>FinanceOS</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={`nav-item ${pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}`}>
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px', marginBottom: 8,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white',
          }}>
            {user?.fullName?.[0] || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.currency}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--text-muted)', fontSize: 14,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
