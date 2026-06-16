'use client';
import Link from 'next/link';
import { PlusCircle, Users, Building2, CreditCard, ArrowRight } from 'lucide-react';

interface ActionCard {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  cta: string;
  primary?: boolean;
}

const actions: ActionCard[] = [
  {
    href: '/dashboard/vacatures/nieuw',
    icon: <PlusCircle className="w-6 h-6 text-sky-600" />,
    iconBg: 'bg-sky-50',
    title: 'Nieuwe vacature',
    description: 'Bereik duizenden zorgprofessionals direct.',
    cta: 'Plaatsen',
    primary: true,
  },
  {
    href: '/dashboard/sollicitaties',
    icon: <Users className="w-6 h-6 text-violet-600" />,
    iconBg: 'bg-violet-50',
    title: 'Sollicitaties',
    description: 'Bekijk en beheer alle inkomende sollicitaties.',
    cta: 'Bekijken',
  },
  {
    href: '/dashboard/bedrijf',
    icon: <Building2 className="w-6 h-6 text-emerald-600" />,
    iconBg: 'bg-emerald-50',
    title: 'Bedrijfsprofiel',
    description: 'Beheer je bedrijfsgegevens en logo.',
    cta: 'Bewerken',
  },
  {
    href: '/dashboard/abonnement',
    icon: <CreditCard className="w-6 h-6 text-amber-500" />,
    iconBg: 'bg-amber-50',
    title: 'Abonnement',
    description: 'Bekijk je huidige plan en upgrade opties.',
    cta: 'Beheren',
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-4">Snelle acties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
              action.primary
                ? 'border-sky-200 bg-sky-50 hover:bg-sky-100'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.iconBg}`}
            >
              {action.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">{action.title}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{action.description}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
              {action.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
