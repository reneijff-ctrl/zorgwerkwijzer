import { Metadata } from 'next';
import Link from 'next/link';
import { Stethoscope, MapPin, Clock, ArrowRight, TrendingUp, Building2 } from 'lucide-react';
import type { VacancyListItem, PageResponse } from '@/types/api';

export const metadata: Metadata = {
  title: 'Verpleegkundige Vacatures 2026 | Werk in de Zorg | ZorgWerkwijzer',
  description:
    'Bekijk alle verpleegkundige vacatures in Nederland. Zowel niveau 4 als niveau 5, ziekenhuis, thuiszorg en verpleeghuis. Direct solliciteren via ZorgWerkwijzer.',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/vacatures/verpleegkundige',
  },
  openGraph: {
    title: 'Verpleegkundige Vacatures 2026 | ZorgWerkwijzer',
    description:
      'Ontdek verpleegkundige vacatures bij ziekenhuizen, thuiszorgorganisaties en verpleeghuizen. Direct solliciteren.',
    url: 'https://zorgwerkwijzer.nl/vacatures/verpleegkundige',
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function getVerpleegkundigeVacancies(): Promise<VacancyListItem[]> {
  try {
    const res = await fetch(
      `${API_BASE}/vacancies/search?q=verpleegkundige&size=12&page=0`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data: PageResponse<VacancyListItem> = await res.json();
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function VerpleegkundigeVacaturesPage() {
  const vacancies = await getVerpleegkundigeVacancies();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Verpleegkundige Vacatures',
    description: 'Overzicht van verpleegkundige vacatures in Nederland op ZorgWerkwijzer',
    url: 'https://zorgwerkwijzer.nl/vacatures/verpleegkundige',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/vacatures" className="hover:text-sky-600 transition-colors">Vacatures</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Verpleegkundige</span>
      </nav>

      {/* Hero */}
      <div className="bg-sky-600 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-sky-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Zorgvacatures
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Verpleegkundige Vacatures</h1>
          <p className="text-sky-100 text-lg max-w-xl">
            Ontdek verpleegkundige functies bij ziekenhuizen, thuiszorgorganisaties, verpleeghuizen
            en andere zorginstellingen in Nederland.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/vacatures?q=verpleegkundige"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-sky-700 font-semibold rounded-xl hover:bg-sky-50 transition-colors text-sm"
            >
              Alle verpleegkundige vacatures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Stethoscope className="absolute -right-8 -bottom-8 w-64 h-64 text-sky-500 opacity-20 transform rotate-12" />
      </div>

      {/* Salaris info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <TrendingUp className="w-8 h-8 text-sky-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900 mb-1">€2.950 – €4.600</div>
          <div className="text-sm text-slate-500">Bruto maandsalaris (FWG 45-55)</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <Clock className="w-8 h-8 text-sky-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900 mb-1">24 – 36 uur</div>
          <div className="text-sm text-slate-500">Gemiddeld dienstverband</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <Building2 className="w-8 h-8 text-sky-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900 mb-1">Volop kansen</div>
          <div className="text-sm text-slate-500">Ziekenhuis, VVT, GGZ, thuiszorg</div>
        </div>
      </div>

      {/* Vacatures */}
      {vacancies.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Actuele vacatures ({vacancies.length}+)
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {vacancies.map((v) => (
              <Link
                key={v.id}
                href={`/vacature/${v.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-1">
                    {v.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    {v.employerName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        {v.employerName}
                      </span>
                    )}
                    {v.cityName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {v.cityName}
                      </span>
                    )}
                    {v.employmentType && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {v.employmentType}
                      </span>
                    )}
                  </div>
                </div>
                {(v.salaryMin || v.salaryMax) && (
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-sky-700">
                      {v.salaryMin && v.salaryMax
                        ? `€${v.salaryMin.toLocaleString('nl-NL')} – €${v.salaryMax.toLocaleString('nl-NL')}`
                        : v.salaryMin
                          ? `v.a. €${v.salaryMin.toLocaleString('nl-NL')}`
                          : `t/m €${v.salaryMax!.toLocaleString('nl-NL')}`}
                    </span>
                    <div className="text-xs text-slate-400">per maand</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/vacatures?q=verpleegkundige"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
            >
              Bekijk alle verpleegkundige vacatures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-12">
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">
              Bekijk alle beschikbare verpleegkundige vacatures via de zoekpagina.
            </p>
            <Link
              href="/vacatures?q=verpleegkundige"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
            >
              Zoek verpleegkundige vacatures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Info sectie */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Werken als verpleegkundige</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Als verpleegkundige werk je in de directe patiëntenzorg. Je bent verantwoordelijk voor de
          verpleegkundige zorg, medicatieverstrekking en communicatie met patiënten en hun families.
          Afhankelijk van je niveau (4 of 5) en specialisme, werkt je in een ziekenhuis, thuiszorg,
          GGZ, verpleeghuis of een andere zorgsetting.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          Het salaris van een verpleegkundige is gebaseerd op de CAO van uw werkgever. In ziekenhuizen
          geldt de CAO Ziekenhuizen, in de VVT-sector de CAO VVT en in de GGZ de CAO GGZ.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/cao-vvt" className="text-sm text-sky-600 hover:underline font-medium">
            CAO VVT →
          </Link>
          <Link href="/cao/ziekenhuizen" className="text-sm text-sky-600 hover:underline font-medium">
            CAO Ziekenhuizen →
          </Link>
          <Link href="/salaris-calculator" className="text-sm text-sky-600 hover:underline font-medium">
            Salariscalculator →
          </Link>
        </div>
      </section>
    </div>
  );
}
