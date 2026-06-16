'use client';
import { BarChart2 } from 'lucide-react';
import type { DashboardVacancyDto } from '@/types/dashboard';

interface VacancyPerformanceProps {
  vacancies: DashboardVacancyDto[];
}

export default function VacancyPerformance({ vacancies }: VacancyPerformanceProps) {
  const totalApplications = vacancies.reduce((s, v) => s + v.applicationCount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-slate-900">Vacature prestaties</h2>
          <p className="text-sm text-slate-500 mt-0.5">Ontvangen sollicitaties</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-600">{totalApplications}</p>
          <p className="text-xs text-slate-500">Sollicitaties totaal</p>
        </div>
      </div>

      {/* Vacature weergaven en kliks: tracking nog niet beschikbaar */}
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center bg-slate-50 rounded-xl border border-slate-100">
        <BarChart2 className="w-8 h-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">Nog onvoldoende data beschikbaar</p>
        <p className="text-xs text-slate-400 max-w-xs">
          Vacature weergaven en kliks worden nog niet bijgehouden.
          Zodra tracking actief is, verschijnen hier de statistieken.
        </p>
      </div>

      {vacancies.length > 0 && (
        <div className="mt-5 space-y-3">
          {vacancies.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 truncate max-w-[60%]">{v.title}</span>
              <span className="font-semibold text-slate-900 shrink-0">
                {v.applicationCount} sollicitatie{v.applicationCount !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {vacancies.length === 0 && (
        <p className="text-sm text-slate-400 text-center mt-4">
          Plaats een vacature om prestaties te zien.
        </p>
      )}
    </div>
  );
}
