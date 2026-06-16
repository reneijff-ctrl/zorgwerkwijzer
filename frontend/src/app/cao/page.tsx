import { Metadata } from 'next';
import Link from 'next/link';
import { Book, ArrowRight } from 'lucide-react';
import { caoPages } from '@/data/caoPages';

export const metadata: Metadata = {
  title: "CAO Zorg 2026 | Alle 11 CAO's in de Zorgsector | ZorgWerkwijzer",
  description:
    "Bekijk alle 11 CAO's in de zorg: CAO VVT, Ziekenhuizen, GGZ, Gehandicaptenzorg, Jeugdzorg, Huisartsenzorg, Ambulancezorg, Sociaal Werk, UMC, Kraamzorg en Apotheken. Actuele salarisschalen en arbeidsvoorwaarden 2026.",
  keywords: [
    "cao zorg",
    "cao vvt",
    "cao ziekenhuizen",
    "cao ggz",
    "cao gehandicaptenzorg",
    "cao jeugdzorg",
    "cao huisartsenzorg",
    "arbeidsvoorwaarden zorg",
    "salarisschalen zorg 2026",
    "cao overzicht",
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/cao',
  },
  openGraph: {
    title: "CAO Zorg 2026 | Alle 11 CAO's in de Zorgsector | ZorgWerkwijzer",
    description:
      "Bekijk alle 11 CAO's in de zorg met actuele salarisschalen, loonsverhogingen en arbeidsvoorwaarden voor 2026.",
    url: 'https://zorgwerkwijzer.nl/cao',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CAO Zorg 2026 | Alle 11 CAO's | ZorgWerkwijzer",
    description:
      "Bekijk alle 11 CAO's in de zorg met actuele salarisschalen en arbeidsvoorwaarden voor 2026.",
  },
};

const accentStyles: Record<string, { card: string; icon: string; badge: string }> = {
  rose:    { card: 'bg-rose-50 border-rose-200 text-rose-700',    icon: 'bg-rose-100',    badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  sky:     { card: 'bg-sky-50 border-sky-200 text-sky-700',       icon: 'bg-sky-100',     badge: 'bg-sky-100 text-sky-700 border-sky-200' },
  violet:  { card: 'bg-violet-50 border-violet-200 text-violet-700', icon: 'bg-violet-100', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  emerald: { card: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: 'bg-emerald-100', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  orange:  { card: 'bg-orange-50 border-orange-200 text-orange-700', icon: 'bg-orange-100', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  teal:    { card: 'bg-teal-50 border-teal-200 text-teal-700',    icon: 'bg-teal-100',    badge: 'bg-teal-100 text-teal-700 border-teal-200' },
  red:     { card: 'bg-red-50 border-red-200 text-red-700',       icon: 'bg-red-100',     badge: 'bg-red-100 text-red-700 border-red-200' },
  indigo:  { card: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: 'bg-indigo-100', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  blue:    { card: 'bg-blue-50 border-blue-200 text-blue-700',    icon: 'bg-blue-100',    badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  pink:    { card: 'bg-pink-50 border-pink-200 text-pink-700',    icon: 'bg-pink-100',    badge: 'bg-pink-100 text-pink-700 border-pink-200' },
  lime:    { card: 'bg-lime-50 border-lime-200 text-lime-700',    icon: 'bg-lime-100',    badge: 'bg-lime-100 text-lime-700 border-lime-200' },
};

function getStyles(accentColor: string) {
  return accentStyles[accentColor] ?? accentStyles['sky'];
}

export default function CaoOverzichtPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: "CAO Zorg Overzicht 2026",
    description: "Overzicht van alle 11 CAO's in de zorgsector op ZorgWerkwijzer",
    url: 'https://zorgwerkwijzer.nl/cao',
    hasPart: caoPages.map((cao) => ({
      '@type': 'WebPage',
      name: cao.title,
      url: `https://zorgwerkwijzer.nl/cao/${cao.slug}`,
      description: cao.metaDescription,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Update 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">CAO Zorg Overzicht</h1>
          <p className="text-emerald-100 text-lg max-w-xl">
            Alles over arbeidsvoorwaarden, salarisschalen en loonsverhogingen in de zorgsector.
            Kies de CAO die op jouw situatie van toepassing is.
          </p>
          <p className="text-emerald-200 text-sm mt-2">
            {caoPages.length} CAO's beschikbaar
          </p>
        </div>
        <Book className="absolute -right-8 -bottom-8 w-64 h-64 text-emerald-500 opacity-20 transform rotate-12" />
      </div>

      {/* CAO kaarten — data-driven vanuit caoPages.ts */}
      <div className="grid grid-cols-1 gap-6 mb-16">
        {caoPages.map((cao) => {
          const styles = getStyles(cao.accentColor);
          return (
            <div
              key={cao.slug}
              className={`bg-white rounded-2xl border-2 p-6 md:p-8 hover:shadow-md transition-shadow ${styles.card}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${styles.icon} flex items-center justify-center shrink-0`}>
                  <Book className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">{cao.title}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.badge}`}>
                      {cao.sector.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{cao.sector}</p>
                  <p className="text-slate-700 mb-4 text-sm leading-relaxed">{cao.heroIntro}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-5">
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      Loonsverhoging {cao.raisePercent2026}% in 2026
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      Eindejaarsuitkering {cao.endOfYearPercent}%
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      Vakantietoeslag {cao.holidayPayPercent}%
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      {cao.vacationDays} vakantiedagen
                    </li>
                  </ul>
                  <Link
                    href={`/cao/${cao.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Bekijk {cao.title}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info sectie */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Weet u niet welke CAO op u van toepassing is?</h2>
        <p className="text-slate-600 mb-4">
          De toepasselijke CAO hangt af van uw werkgever en de sector waar u werkt. Uw werkgever
          is verplicht u te informeren over de geldende CAO. Controleer ook uw arbeidscontract of
          vraag dit na bij HR.
        </p>
        <Link
          href="/vacatures"
          className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:underline"
        >
          Bekijk alle zorgvacatures
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
