'use client';
import { clsx } from 'clsx';

const STATUS_MAP: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  TRIALING: 'bg-sky-100 text-sky-700',
  PAST_DUE: 'bg-amber-100 text-amber-700',
  CANCELED: 'bg-red-100 text-red-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
  STARTER: 'bg-slate-100 text-slate-600',
  PROFESSIONAL: 'bg-sky-100 text-sky-700',
  PREMIUM: 'bg-violet-100 text-violet-700',
};

const LABEL_MAP: Record<string, string> = {
  ACTIVE: 'Actief',
  TRIALING: 'Proefperiode',
  PAST_DUE: 'Achterstallig',
  CANCELED: 'Opgezegd',
  INACTIVE: 'Inactief',
  STARTER: 'Starter',
  PROFESSIONAL: 'Professional',
  PREMIUM: 'Premium',
};

interface AdminBadgeProps {
  status: string | null;
  size?: 'sm' | 'md';
  fallback?: string;
}

export default function AdminBadge({ status, size = 'md', fallback = 'Geen abonnement' }: AdminBadgeProps) {
  if (!status) {
    return (
      <span
        className={clsx(
          'inline-flex items-center font-semibold rounded-full bg-slate-100 text-slate-400',
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
        )}
      >
        {fallback}
      </span>
    );
  }

  const colorClass = STATUS_MAP[status] ?? 'bg-slate-100 text-slate-500';
  const label = LABEL_MAP[status] ?? status;

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        colorClass,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
      )}
    >
      {label}
    </span>
  );
}
