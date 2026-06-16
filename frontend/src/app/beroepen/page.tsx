'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { beroepen, getAllSectors } from '@/data/professions';

// ── Sector-labels ─────────────────────────────────────────────────────────────

const sectorColors: Record<string, string> = {
  VVT: 'bg-sky-100 text-sky-700',
  GGZ: 'bg-violet-100 text-violet-700',
  Ziekenhuizen: 'bg-rose-100 text-rose-700',
  Paramedisch: 'bg-emerald-100 text-emerald-700',
  Huisartsenzorg: 'bg-amber-100 text-amber-700',
  Gehandicaptenzorg: 'bg-orange-100 text-orange-700',
  Jeugdzorg: 'bg-teal-100 text-teal-700',
};

function getSectorColor(sector: string): string {
  return sectorColors[sector] ?? 'bg-slate-100 text-slate-700';
}

// ── Pagina ────────────────────────────────────────────────────────────────────

export default function BeroepenOverzichtPage() {
  const [query, setQuery] = useState('');
  const [activeSector, setActiveSector] = useState<string>('Alle sectoren');

  const sectors = useMemo(() => ['Alle sectoren', ...getAllSectors()], []);

  const filtered = useMemo(() => {
    return beroepen.filter((b) => {
      const matchSector = activeSector === 'Alle sectoren' || b.sector === activeSector;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.sector.toLowerCase().includes(q) ||
        b.workEnvironment.toLowerCase().includes(q) ||
        b.mboHboLevel.toLowerCase().includes(q);
      return matchSector && matchQuery;
    });
  }, [query, activeSector]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zorgwerkwijzer.nl' },
      { '@type': 'ListItem', position: 2, name: 'Beroepen', item: 'https://zorgwerkwijzer.nl/beroepen' },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-14">
        <div className="max-w-5xl mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <span className="text-slate-900 font-medium">Beroepen</span>
          </nav>

          <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            <span>Alle zorgberoepen in Nederland</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Beroepen in de Zorg
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-8">
            Ontdek wat elk zorgberoep inhoudt: taken, opleiding, BIG-registratie, salaris en
            doorgroeimogelijkheden. Gekoppeld aan vacatures en CAO-informatie.
          </p>

          {/* Zoekbalk */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Zoek beroep, sector of niveau..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Sector-filters + beroepen-grid ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-8">

        {/* Sector-filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeSector === sector
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Resultaatstelling */}
        <p className="text-sm text-slate-500 mb-6">
          {filtered.length} beroep{filtered.length !== 1 ? 'en' : ''} gevonden
          {activeSector !== 'Alle sectoren' ? ` in ${activeSector}` : ''}
          {query ? ` voor "${query}"` : ''}
        </p>

        {/* Beroepen-grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg font-medium">Geen beroepen gevonden</p>
            <p className="text-sm mt-2">Probeer een andere zoekterm of sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <Link
                key={b.slug}
                href={`/beroepen/${b.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-sky-200 hover:shadow-md transition-all flex flex-col"
              >
                {/* Sector-badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getSectorColor(b.sector)}`}>
                    {b.sector}
                  </span>
                  {b.bigRegistration && (
                    <ShieldCheck className="h-4 w-4 text-emerald-500" aria-label="BIG-registratie vereist" />
                  )}
                </div>

                {/* Naam */}
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2 leading-tight">
                  {b.name}
                </h2>

                {/* Quick-info */}
                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{b.mboHboLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Wallet className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{b.averageSalary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="line-clamp-1">{b.workEnvironment}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center text-sky-600 text-sm font-semibold gap-1 mt-auto pt-2 border-t border-slate-50">
                  Bekijk beroep
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Op zoek naar een baan in de zorg?</h2>
          <p className="text-slate-600 text-sm mb-6">
            Bekijk alle openstaande vacatures of ontdek wat je kunt verdienen in jouw beroep.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vacatures"
              className="bg-sky-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              Alle vacatures
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/salaris"
              className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Salarisoverzicht
            </Link>
            <Link
              href="/cao"
              className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              CAO-overzicht
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
