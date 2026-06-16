'use client';
import { clsx } from 'clsx';

const ROLE_CONFIG = {
  ROLE_USER: { label: 'Kandidaat', className: 'bg-slate-100 text-slate-600' },
  ROLE_EMPLOYER: { label: 'Werkgever', className: 'bg-sky-100 text-sky-700' },
  ROLE_ADMIN: { label: 'Admin', className: 'bg-violet-100 text-violet-700' },
};

interface AdminRoleBadgeProps {
  role: 'ROLE_USER' | 'ROLE_EMPLOYER' | 'ROLE_ADMIN';
  size?: 'sm' | 'md';
}

export default function AdminRoleBadge({ role, size = 'md' }: AdminRoleBadgeProps) {
  const config = ROLE_CONFIG[role] ?? { label: role, className: 'bg-slate-100 text-slate-500' };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full',
        config.className,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
      )}
    >
      {config.label}
    </span>
  );
}
