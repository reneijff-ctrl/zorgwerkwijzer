import { Metadata } from 'next';
import Link from 'next/link';
import { Users, MapPin, Clock, ArrowRight, TrendingUp, Building2 } from 'lucide-react';
import type { VacancyListItem, PageResponse } from '@/types/api';

export const metadata: Metadata = {
  title: 'Verzorgende IG Vacatures 2026 | Werk in de Zorg | ZorgWerkwijzer',
  description:
    'Bekijk alle Verzorgende IG vacatures in Nederland. Werk als Verzorgende IG in thuiszorg, verpleeghuis of verzorgingshuis. Direct solliciteren via ZorgWerkwijzer.',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/vacatures/verzorgende-ig',
  },
  openGraph: {
    title: 'Verzorgende IG Vacatures 2026 | ZorgWerkwijzer',
    description:
      'Ontdek Verzorgende IG vacatures bij thuiszorgorganisaties, verpleeghuizen en verzorgingshuizen. Direct solliciteren.',
    url: 'https://zorgwerkwijzer.nl/vacatures/verzorgende-ig',
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function getVerzorgendeVacancies(): Promise<VacancyListItem[]> {
  try {
    const res = await fetch(
      `${API_BASE}/vacancies/search?q=verzorgende&size=12&page=0`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data: PageResponse<VacancyListItem> = await res.json();
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function VerzorgendeIgVacaturesPage() {
  const vacancies = await getVerzorgendeVacancies();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Verzorgende IG Vacatures',
    description: 'Overzicht van Verzorgende IG vacatures in Nederland op ZorgWerkwijzer',
    url: 'https://zorgwerkwijzer.nl/vacatures/verzorgende-ig',
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
        <span className="text-slate-900 font-medium">Verzorgende IG</span>
      </nav>

      {/* Hero */}
      <div className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Zorgvacatures
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Verzorgende IG Vacatures</h1>
          <p className="text-emerald-100 text-lg max-w-xl">
            Ontdek Verzorgende IG functies (individuele gezondheidszorg) bij thuiszorgorganisaties,
            verpleeghuizen en verzorgingshuizen in Nederland.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/vacatures?q=verzorgende"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors text-sm"
            >
              Alle Verzorgende IG vacatures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <Users className="absolute -right-8 -bottom-8 w-64 h-64 text-emerald-500 opacity-20 transform rotate-12" />
      </div>

      {/* Salaris info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900 mb-1">€2.600 – €3.300</div>
          <div className="text-sm text-slate-500">Bruto maandsalaris (FWG 35)</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <Clock className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900 mb-1">20 – 36 uur</div>
          <div className="text-sm text-slate-500">Gemiddeld dienstverband</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <Building2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900 mb-1">VVT & Thuiszorg</div>
          <div className="text-sm text-slate-500">Verpleeghuis, verzorgingshuis, thuiszorg</div>
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
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
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
                    <span className="text-sm font-semibold text-emerald-700">
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
              href="/vacatures?q=verzorgende"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Bekijk alle Verzorgende IG vacatures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-12">
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">
              Bekijk alle beschikbare Verzorgende IG vacatures via de zoekpagina.
            </p>
            <Link
              href="/vacatures?q=verzorgende"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Zoek Verzorgende IG vacatures
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Info sectie */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Werken als Verzorgende IG</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Als Verzorgende IG (Individuele Gezondheidszorg) ben je verantwoordelijk voor de
          persoonlijke verzorging en begeleiding van cliënten. Je voert voorbehouden handelingen
          uit zoals het toedienen van medicijnen en het controleren van vitale functies. De functie
          vereist een MBO-diploma op niveau 3.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          Verzorgende IG is een van de meest gevraagde functies in de zorgsector. Met doorleren
          kun je doorgroeien naar verpleegkundige niveau 4 of 5.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link href="/cao-vvt" className="text-sm text-sky-600 hover:underline font-medium">
            CAO VVT →
          </Link>
          <Link href="/vacatures/verpleegkundige" className="text-sm text-sky-600 hover:underline font-medium">
            Verpleegkundige vacatures →
          </Link>
          <Link href="/salaris-calculator" className="text-sm text-sky-600 hover:underline font-medium">
            Salariscalculator →
          </Link>
        </div>
      </section>
    </div>
  );
}
