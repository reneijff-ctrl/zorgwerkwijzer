'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import type { EmploymentType, EducationLevel } from '@/types/api';
import { EMPLOYMENT_TYPE_LABELS, EDUCATION_LEVEL_LABELS } from '@/types/api';

export default function VacancyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get('q') ?? '';
  const currentType = (searchParams.get('type') as EmploymentType) ?? '';
  const currentLevel = (searchParams.get('level') as EducationLevel) ?? '';

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();

    const q = formData.get('q') as string;
    const type = formData.get('type') as string;
    const level = formData.get('level') as string;

    if (q) params.set('q', q);
    if (type) params.set('type', type);
    if (level) params.set('level', level);
    // Reset pagina bij nieuwe zoekopdracht
    params.set('page', '0');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasActiveFilters = currentQ || currentType || currentLevel;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <form
        action={(formData) => applyFilters(formData)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Zoekbalk */}
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={currentQ}
            placeholder="Zoek op functie, werkgever of stad..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
          />
        </div>

        {/* Dienstverband filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <select
            name="type"
            defaultValue={currentType}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none bg-white transition-all"
          >
            <option value="">Alle dienstverbanden</option>
            {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Opleidingsniveau filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <select
            name="level"
            defaultValue={currentLevel}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none bg-white transition-all"
          >
            <option value="">Alle niveaus</option>
            {(Object.entries(EDUCATION_LEVEL_LABELS) as [EducationLevel, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Zoekknop */}
        <button
          type="submit"
          disabled={isPending}
          className="lg:col-start-4 bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-sky-700 disabled:opacity-70 transition-colors shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Zoeken
        </button>

        {/* Filters wissen */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="lg:col-span-4 text-sm text-sky-600 font-bold hover:underline text-center"
          >
            Alle filters wissen
          </button>
        )}
      </form>
    </div>
  );
}
