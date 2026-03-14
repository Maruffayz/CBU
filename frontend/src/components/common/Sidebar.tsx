'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const navItems = [
  { href: '/dashboard', icon: '📊', key: 'nav.dashboard' },
  { href: '/accounts', icon: '💳', key: 'nav.accounts' },
  { href: '/transactions', icon: '📋', key: 'nav.transactions' },
  { href: '/transfers', icon: '🔄', key: 'nav.transfers' },
  { href: '/debts', icon: '📑', key: 'nav.debts' },
  { href: '/budgets', icon: '🎯', key: 'nav.budgets' },
  { href: '/analytics', icon: '📈', key: 'nav.analytics' },
  { href: '/calendar', icon: '📅', key: 'nav.calendar' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

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
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t space-y-3" style={{borderColor:'#1e2535'}}>
        <div>
          <label className="block text-xs text-slate-500 mb-1">{t('lang.label')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full bg-[#050816] border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300"
          >
            <option value="en">{t('lang.english')}</option>
            <option value="uz">{t('lang.uzbek')}</option>
            <option value="ru">{t('lang.russian')}</option>
          </select>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 transition-colors">
          <span>🚪</span> {t('nav.signOut')}
        </button>
      </div>
    </aside>
  );
}
