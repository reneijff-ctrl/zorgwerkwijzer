'use client';
import { Briefcase, Users, Building2, CreditCard } from 'lucide-react';
import type { DashboardVacancyDto, DashboardApplicationDto } from '@/types/dashboard';

interface RecentActivityProps {
  vacancies: DashboardVacancyDto[];
  applications: DashboardApplicationDto[];
}

type ActivityItem = {
  id: string;
  type: 'vacancy' | 'application' | 'profile' | 'subscription';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: React.ReactNode;
  iconBg: string;
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Zojuist';
  if (diffMins < 60) return `${diffMins} min geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays === 1) return 'Gisteren';
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

export default function RecentActivity({ vacancies, applications }: RecentActivityProps) {
  const items: ActivityItem[] = [];

  // Vacatures
  for (const v of vacancies.slice(0, 3)) {
    items.push({
      id: `vac-${v.id}`,
      type: 'vacancy',
      title: `Vacature geplaatst: ${v.title}`,
      subtitle: v.isActive ? 'Live op het platform' : 'Inactief',
      timestamp: v.createdAt,
      icon: <Briefcase className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
    });
  }

  // Sollicitaties
  for (const a of applications.slice(0, 3)) {
    items.push({
      id: `app-${a.id}`,
      type: 'application',
      title: `Sollicitatie ontvangen van ${a.applicantName}`,
      subtitle: a.vacancyTitle,
      timestamp: a.appliedAt,
      icon: <Users className="w-4 h-4 text-violet-600" />,
      iconBg: 'bg-violet-50',
    });
  }

  // Placeholder activiteiten als er weinig data is
  if (items.length === 0) {
    items.push({
      id: 'placeholder-profile',
      type: 'profile',
      title: 'Bedrijfsprofiel aangemaakt',
      subtitle: 'Welkom op ZorgWerkwijzer',
      timestamp: new Date().toISOString(),
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
    });
    items.push({
      id: 'placeholder-sub',
      type: 'subscription',
      title: 'Abonnement geactiveerd',
      subtitle: 'Je platform is klaar voor gebruik',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      icon: <CreditCard className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-amber-50',
    });
  }

  // Sorteer op timestamp (nieuwste eerst)
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="font-semibold text-slate-900 mb-6">Recente activiteit</h2>

      <div className="relative">
        {/* Verticale lijn */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-100" />

        <ul className="space-y-5">
          {items.slice(0, 6).map((item) => (
            <li key={item.id} className="flex items-start gap-4 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${item.iconBg} border-2 border-white`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm font-medium text-slate-800 leading-snug">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{item.subtitle}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 pt-1 whitespace-nowrap">
                {timeAgo(item.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
