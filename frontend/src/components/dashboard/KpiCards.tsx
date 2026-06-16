'use client';
import { Briefcase, CheckCircle, Users, Star } from 'lucide-react';

interface KpiCardsProps {
  totalVacancies: number;
  activeVacancies: number;
  totalApplications: number;
  profileScore: number;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  trendPositive?: boolean;
  suffix?: string;
}

function KpiCard({ label, value, icon, iconBg, trend, trendPositive, suffix }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
          {suffix && <span className="text-lg font-semibold text-slate-400 ml-1">{suffix}</span>}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function KpiCards({
  totalVacancies,
  activeVacancies,
  totalApplications,
  profileScore,
}: KpiCardsProps) {
  const scoreLabel =
    profileScore >= 80 ? 'Uitstekend' : profileScore >= 50 ? 'Goed' : 'Verbetering nodig';
  const scoreTrendPositive = profileScore >= 60;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <KpiCard
        label="Totaal vacatures"
        value={totalVacancies}
        icon={<Briefcase className="w-5 h-5 text-sky-600" />}
        iconBg="bg-sky-50"
        trend={totalVacancies > 0 ? 'Actief' : 'Leeg'}
        trendPositive={totalVacancies > 0}
      />
      <KpiCard
        label="Actieve vacatures"
        value={activeVacancies}
        icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
        iconBg="bg-emerald-50"
        trend={activeVacancies > 0 ? 'Live' : 'Geen'}
        trendPositive={activeVacancies > 0}
      />
      <KpiCard
        label="Sollicitaties"
        value={totalApplications}
        icon={<Users className="w-5 h-5 text-violet-600" />}
        iconBg="bg-violet-50"
        trend={totalApplications > 0 ? `+${totalApplications}` : '0'}
        trendPositive={totalApplications > 0}
      />
      <KpiCard
        label="Profielscore"
        value={profileScore}
        suffix="%"
        icon={<Star className="w-5 h-5 text-amber-500" />}
        iconBg="bg-amber-50"
        trend={scoreLabel}
        trendPositive={scoreTrendPositive}
      />
    </div>
  );
}
