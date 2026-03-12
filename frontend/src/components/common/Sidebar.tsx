'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/accounts', icon: '💳', label: 'Accounts' },
  { href: '/transactions', icon: '📋', label: 'Transactions' },
  { href: '/transfers', icon: '🔄', label: 'Transfers' },
  { href: '/debts', icon: '📑', label: 'Debts' },
  { href: '/budgets', icon: '🎯', label: 'Budgets' },
  { href: '/analytics', icon: '📈', label: 'Analytics' },
  { href: '/calendar', icon: '📅', label: 'Calendar' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{background:'#0d1120', borderRight:'1px solid #1e2535'}}>
      <div className="p-6 border-b" style={{borderColor:'#1e2535'}}>
        <div className="text-2xl font-bold"><span style={{color:'#4f6ef7'}}>Finance</span>AI</div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{background:'#4f6ef7'}}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium">{user?.username}</div>
            <div className="text-xs text-slate-500">{user?.currency}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === item.href
                ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={pathname === item.href ? {background:'rgba(79,110,247,0.15)', color:'#7b96fa'} : {}}>
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t" style={{borderColor:'#1e2535'}}>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 transition-colors">
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}
