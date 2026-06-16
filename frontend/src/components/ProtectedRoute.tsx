'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Rollen die toegang mogen krijgen. Leeg = elke ingelogde gebruiker. */
  allowedRoles?: string[];
  /** Redirect wanneer rol niet is toegestaan (standaard: '/') */
  unauthorizedRedirect?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  unauthorizedRedirect = '/',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(unauthorizedRedirect);
    }
  }, [isAuthenticated, isLoading, pathname, router, user, allowedRoles, unauthorizedRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
