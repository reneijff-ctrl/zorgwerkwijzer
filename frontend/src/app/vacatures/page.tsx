import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import type { EmploymentType, EducationLevel } from '@/types/api';
import { getVacancies, searchVacancies } from '@/lib/api/vacancies';
import VacancyCard from '@/components/vacatures/VacancyCard';
import VacancyFilters from '@/components/vacatures/VacancyFilters';

export const metadata: Metadata = {
  title: 'Zorgvacatures Nederland | Actuele Vacatures voor Zorgmedewerkers – Zorgwerkwijzer',
  description:
    'Ontdek honderden actuele vacatures voor verpleegkundigen, verzorgenden, helpenden en meer. Filter op dienstverband, opleidingsniveau en stad. Direct solliciteren!',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/vacatures',
  },
  openGraph: {
    title: 'Zorgvacatures Nederland | Zorgwerkwijzer',
    description: 'Actuele vacatures voor zorgmedewerkers in heel Nederland.',
    url: 'https://zorgwerkwijzer.nl/vacatures',
    type: 'website',
  },
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: EmploymentType;
    level?: EducationLevel;
    page?: string;
  }>;
}

async function VacancyList({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0));
  const hasFilters = params.q || params.type || params.level;

  let data;
  try {
    if (hasFilters) {
      data = await searchVacancies({
        q: params.q,
        employmentType: params.type,
        educationLevel: params.level,
        page,
        size: 20,
      });
    } else {
      data = await getVacancies(page, 20);
    }
  } catch {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-red-200">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Kon vacatures niet laden</h3>
        <p className="text-slate-500">
          Er is een tijdelijk probleem. Probeer de pagina te verversen.
        </p>
      </div>
    );
  }

  const vacancies = data.content;
  const totalElements = data.page.totalElements;

  return (
    <>
      {/* Resultaten info */}
      <div className="flex items-center justify-between mb-6 px-2">
        <p className="text-slate-600 font-medium">
          {totalElements === 0
            ? 'Geen vacatures gevonden'
            : `${totalElements} vacature${totalElements !== 1 ? 's' : ''} gevonden`}
        </p>
      </div>

      {/* Vacature lijst */}
      <div className="grid grid-cols-1 gap-6">
        {vacancies.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}

        {vacancies.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Geen vacatures gevonden</h3>
            <p className="text-slate-500">Probeer een andere zoekterm of pas je filters aan.</p>
          </div>
        )}
      </div>

      {/* Paginering */}
      {data.page.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {page > 0 && (
            <a
              href={`/vacatures?${buildPageUrl(params, page - 1)}`}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:border-sky-300 transition-colors"
            >
              Vorige
            </a>
          )}
          <span className="px-5 py-2.5 text-slate-500 text-sm">
            Pagina {page + 1} van {data.page.totalPages}
          </span>
          {page + 1 < data.page.totalPages && (
            <a
              href={`/vacatures?${buildPageUrl(params, page + 1)}`}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:border-sky-300 transition-colors"
            >
              Volgende
            </a>
          )}
        </div>
      )}
    </>
  );
}

function buildPageUrl(
  params: { q?: string; type?: string; level?: string },
  newPage: number,
): string {
  const p = new URLSearchParams();
  if (params.q) p.set('q', params.q);
  if (params.type) p.set('type', params.type);
  if (params.level) p.set('level', params.level);
  p.set('page', String(newPage));
  return p.toString();
}

export default function VacanciesPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Actuele Vacatures in de Zorg
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Vind jouw volgende uitdaging. De meest relevante vacatures voor zorgmedewerkers
            in heel Nederland.
          </p>
        </div>

        {/* Filters (client component, wrapped in Suspense voor useSearchParams) */}
        <Suspense fallback={<div className="h-24 bg-white rounded-2xl animate-pulse mb-8" />}>
          <VacancyFilters />
        </Suspense>

        {/* Vacaturelijst (Server Component, eigen Suspense voor streaming) */}
        <Suspense
          fallback={
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          }
        >
          <VacancyList searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
