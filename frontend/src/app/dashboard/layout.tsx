'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Briefcase, Users, Building2, ChevronRight, LogOut, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Overzicht', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/vacatures', label: 'Vacatures', icon: Briefcase, exact: false },
  { href: '/dashboard/sollicitaties', label: 'Sollicitaties', icon: Users, exact: false },
  { href: '/dashboard/bedrijf', label: 'Bedrijfsprofiel', icon: Building2, exact: false },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: CreditCard, exact: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ROLE_EMPLOYER')) {
      router.replace('/login?from=/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ROLE_EMPLOYER') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="text-lg font-bold text-sky-600">
            Zorgwerkwijzer
          </Link>
          <span className="ml-2 text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
            Dashboard
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
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto text-sky-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Gebruikersbalk */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sky-700 font-bold text-sm">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
              <p className="text-xs text-slate-400">Werkgever</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
