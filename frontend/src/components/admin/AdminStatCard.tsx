'use client';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

const COLOR_MAP = {
  sky: {
    bg: 'bg-sky-50',
    icon: 'text-sky-600',
    trend: 'text-sky-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    trend: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    trend: 'text-amber-600',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    trend: 'text-violet-600',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    trend: 'text-rose-600',
  },
};

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: keyof typeof COLOR_MAP;
}

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'sky',
}: AdminStatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1 truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 mt-2 text-xs font-medium',
                trend.value >= 0 ? 'text-emerald-600' : 'text-red-500',
              )}
            >
              {trend.value >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {trend.value >= 0 ? '+' : ''}
                {trend.value} {trend.label}
              </span>
            </div>
          )}
        </div>
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ml-4',
            colors.bg,
          )}
        >
          <Icon className={clsx('w-6 h-6', colors.icon)} />
        </div>
      </div>
    </div>
  );
}
