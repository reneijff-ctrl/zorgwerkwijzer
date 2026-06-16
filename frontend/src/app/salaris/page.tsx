import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { professions } from '@/data/salaryData';
import { getCao } from '@/data/caos';

export const metadata: Metadata = {
  title: 'Salaris Zorg 2026 | Overzicht Salarisschalen per Beroep | ZorgWerkwijzer',
  description:
    'Bekijk de actuele salarisschalen voor alle zorgberoepen in 2026: verpleegkundige, fysiotherapeut, GZ-psycholoog en meer. Inclusief FWG-schalen, ORT en eindejaarsuitkering.',
  keywords: [
    'salaris zorg',
    'salarisschalen verpleegkundige',
    'salaris fysiotherapeut',
    'salaris gz-psycholoog',
    'fwg schalen',
    'ort percentages',
    'zorg salaris 2026',
    'bruto salaris zorgmedewerker',
  ],
  alternates: { canonical: 'https://zorgwerkwijzer.nl/salaris' },
  openGraph: {
    title: 'Salaris Zorg 2026 | Overzicht Salarisschalen | ZorgWerkwijzer',
    description:
      'Actuele salarisschalen voor alle zorgberoepen in Nederland. FWG-schalen, ORT en doorgroeimogelijkheden per beroep.',
    url: 'https://zorgwerkwijzer.nl/salaris',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salaris Zorg 2026 | Overzicht Salarisschalen | ZorgWerkwijzer',
    description:
      'Actuele salarisschalen voor alle 25 zorgberoepen in Nederland, inclusief FWG-schalen en ORT.',
  },
};

// Groepeer beroepen per CAO-sector voor het overzicht
const sectorLabels: Record<string, string> = {
  vvt: 'Verpleeg-, Verzorgingshuizen & Thuiszorg (CAO VVT)',
  ziekenhuizen: 'Ziekenhuizen (CAO Ziekenhuizen)',
  ggz: 'Geestelijke Gezondheidszorg (CAO GGZ)',
  gehandicaptenzorg: 'Gehandicaptenzorg (CAO Gehandicaptenzorg)',
  jeugdzorg: 'Jeugdzorg (CAO Jeugdzorg)',
  huisartsenzorg: 'Huisartsenzorg (CAO Huisartsenzorg)',
};

export default function SalarisOverzichtPage() {
  // Groepeer per caoId
  const grouped: Record<string, typeof professions> = {};
  for (const p of professions) {
    if (!grouped[p.caoId]) grouped[p.caoId] = [];
    grouped[p.caoId].push(p);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zorgwerkwijzer.nl' },
      { '@type': 'ListItem', position: 2, name: 'Salarissen', item: 'https://zorgwerkwijzer.nl/salaris' },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <span className="text-slate-900 font-medium">Salarissen</span>
          </nav>

          <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            <span>Actueel 2026 — alle CAO-verhogingen verwerkt</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Salaris Zorg 2026
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Bekijk de actuele salarisschalen, FWG-indeling, ORT-percentages en doorgroeimogelijkheden
            voor alle zorgberoepen in Nederland.
          </p>
        </div>
      </section>

      {/* Beroepen per sector */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {Object.entries(grouped).map(([caoId, beroepen]) => {
          const cao = getCao(caoId);
          if (!cao) return null;

          return (
            <section key={caoId}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {sectorLabels[caoId] ?? cao.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Loonsverhoging 2026: +{cao.raisePercent2026}% &bull; ORT t/m +{cao.ort.sunday}% &bull; Vakantiegeld {cao.holidayPayPercent}%
                  </p>
                </div>
                <Link
                  href={cao.href}
                  className="hidden md:inline-flex items-center gap-1.5 text-sky-600 text-sm font-semibold hover:gap-2.5 transition-all"
                >
                  Bekijk {cao.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {beroepen.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/salaris/${p.slug}`}
                    className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-sky-200 hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center group-hover:bg-sky-100 transition-colors shrink-0">
                        <BarChart3 className="h-5 w-5 text-sky-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                        {p.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 flex-1">{p.avgSalaryDisplay} bruto/maand</p>
                    <div className="flex items-center text-sky-600 text-sm font-semibold gap-1 mt-auto">
                      Bekijk salarisschalen
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA calculators */}
        <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Bereken je eigen salaris</h2>
          <p className="text-slate-600 text-sm mb-6">
            Gebruik onze calculators om je netto maandsalaris, ORT-toeslagen en vakantiegeld te berekenen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/salaris-calculator"
              className="bg-sky-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              Salaris Calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/ort-calculator"
              className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              ORT Calculator
            </Link>
            <Link
              href="/vakantiegeld-berekenen"
              className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Vakantiegeld berekenen
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
