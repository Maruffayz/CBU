'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!isAuthPage && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isAuthPage, router]);

  if (isAuthPage) return <>{children}</>;
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto max-h-screen">{children}</main>
    </div>
  );
}
