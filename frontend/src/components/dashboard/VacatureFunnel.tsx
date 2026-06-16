'use client';
import Link from 'next/link';
import { Briefcase, Eye, MousePointerClick, Users, ArrowDown } from 'lucide-react';
import type { DashboardVacancyDto } from '@/types/dashboard';

interface VacatureFunnelProps {
  vacancies: DashboardVacancyDto[];
}

export default function VacatureFunnel({ vacancies }: VacatureFunnelProps) {
  const totalVacancies = vacancies.length;
  const activeVacancies = vacancies.filter((v) => v.isActive).length;

  // Geschatte funnel-waarden
  const estimatedViews = activeVacancies * 120;
  const estimatedClicks = Math.round(estimatedViews * 0.35);
  const totalApplications = vacancies.reduce((s, v) => s + v.applicationCount, 0);

  const steps = [
    {
      label: 'Vacatures',
      value: totalVacancies,
      subLabel: `${activeVacancies} actief`,
      icon: <Briefcase className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-700',
    },
    {
      label: 'Weergaven',
      value: estimatedViews,
      subLabel: 'geschat',
      icon: <Eye className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-700',
    },
    {
      label: 'Kliks',
      value: estimatedClicks,
      subLabel: 'geschat',
      icon: <MousePointerClick className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
    },
    {
      label: 'Sollicitaties',
      value: totalApplications,
      subLabel: 'ontvangen',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-slate-900">Vacature funnel</h2>
          <p className="text-sm text-slate-500 mt-0.5">Van plaatsing tot aanname</p>
        </div>
        <Link
          href="/dashboard/vacatures"
          className="text-sm text-sky-600 font-medium hover:underline"
        >
          Beheer vacatures →
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col sm:flex-row items-center flex-1 w-full">
            {/* Stap kaart */}
            <div
              className={`flex-1 w-full rounded-xl border p-4 text-center ${step.bg} ${step.border}`}
            >
              <div
                className={`w-10 h-10 rounded-full ${step.bg} flex items-center justify-center mx-auto mb-2 border ${step.border}`}
              >
                {step.icon}
              </div>
              <p className={`text-2xl font-bold ${step.text}`}>
                {step.value.toLocaleString('nl-NL')}
              </p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{step.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{step.subLabel}</p>
            </div>

            {/* Pijl tussen stappen */}
            {idx < steps.length - 1 && (
              <div className="flex items-center justify-center p-2 text-slate-300">
                <ArrowDown className="w-4 h-4 sm:hidden" />
                <svg
                  className="hidden sm:block w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalVacancies === 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400 mb-3">Nog geen vacatures geplaatst.</p>
          <Link
            href="/dashboard/vacatures/nieuw"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            Eerste vacature plaatsen
          </Link>
        </div>
      )}
    </div>
  );
}
