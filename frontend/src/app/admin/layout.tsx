'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Briefcase, Users, Building2, ChevronRight, LogOut, ShieldCheck, ClipboardList, CreditCard, Lock, Mail, Newspaper } from 'lucide-react';
import { clsx } from 'clsx';
import { getContactMessageStats } from '@/lib/api/contact-messages';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [newMessageCount, setNewMessageCount] = useState(0);

  const fetchNewCount = useCallback(async () => {
    if (!token) return;
    try {
      const stats = await getContactMessageStats(token);
      setNewMessageCount(stats.newCount);
    } catch {
      // stil falen
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ROLE_ADMIN')) {
      router.replace('/login?from=/admin');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchNewCount();
  }, [fetchNewCount, pathname]);

  if (isLoading || !user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Overzicht', icon: LayoutDashboard, exact: true, badge: 0 },
    { href: '/admin/gebruikers', label: 'Gebruikers', icon: Users, exact: false, badge: 0 },
    { href: '/admin/werkgevers', label: 'Werkgevers', icon: Building2, exact: false, badge: 0 },
    { href: '/admin/vacatures', label: 'Vacatures', icon: Briefcase, exact: false, badge: 0 },
    { href: '/admin/subscriptions', label: 'Abonnementen', icon: CreditCard, exact: false, badge: 0 },
    { href: '/admin/audit-log', label: 'Audit Log', icon: ClipboardList, exact: false, badge: 0 },
    { href: '/admin/nieuwsbeheer', label: 'Nieuwsbeheer', icon: Newspaper, exact: false, badge: 0 },
    { href: '/admin/contact-berichten', label: 'Contactberichten', icon: Mail, exact: false, badge: newMessageCount },
    { href: '/admin/instellingen/2fa', label: 'Beveiliging & 2FA', icon: Lock, exact: false, badge: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Donkere sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-30 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <Link href="/" className="text-base font-bold text-white hover:text-slate-200 transition-colors">
            Zorgwerkwijzer
          </Link>
          <span className="ml-2 text-xs font-semibold bg-violet-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        </div>

        {/* Navigatie */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
                {active && item.badge === 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Gebruikersbalk */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-violet-700 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Hoofdinhoud */}
      <main className="pl-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
