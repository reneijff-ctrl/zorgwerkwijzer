/**
 * CaoPageTemplate
 *
 * Gedeeld template voor ALLE /cao/[slug] pagina's.
 * Voeg een nieuwe CAO toe in src/data/caoPages.ts — geen UI-aanpassing nodig.
 *
 * Gebruik in /cao/[slug]/page.tsx:
 *   import CaoPageTemplate from '@/components/cao/CaoPageTemplate';
 *   import { getCaoPage } from '@/data/caoPages';
 *
 *   export default function Page({ params }) {
 *     const cao = getCaoPage(params.slug)!;
 *     return <CaoPageTemplate cao={cao} />;
 *   }
 */

import Link from 'next/link';
import {
  TrendingUp,
  Calendar,
  Clock,
  Car,
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  BarChart3,
  Wallet,
  Sun,
  Stethoscope,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import type { CaoPageData } from '@/data/caoPages';
import { getBeroepenByCao } from '@/data/professions';

interface Props {
  cao: CaoPageData;
}

// ─── Accentkleur → Tailwind-klassen mapping ────────────────────────────────────
// Tailwind purgecss vereist volledige klasse-strings in de source — geen dynamische string-interpolatie.
function getAccentClasses(color: string): {
  heroBg: string;
  heroBadge: string;
  heroText: string;
  heroIcon: string;
  iconBg: string;
  iconText: string;
  schemaBadge: string;
  schemaText: string;
  ctaBg: string;
  ctaHover: string;
  ctaBorder: string;
} {
  const map: Record<string, ReturnType<typeof getAccentClasses>> = {
    sky: {
      heroBg: 'bg-sky-600',
      heroBadge: 'bg-sky-500',
      heroText: 'text-sky-100',
      heroIcon: 'text-sky-500',
      iconBg: 'bg-sky-50',
      iconText: 'text-sky-600',
      schemaBadge: 'bg-sky-100',
      schemaText: 'text-sky-700',
      ctaBg: 'bg-sky-600',
      ctaHover: 'hover:bg-sky-700',
      ctaBorder: 'border-sky-200',
    },
    blue: {
      heroBg: 'bg-blue-600',
      heroBadge: 'bg-blue-500',
      heroText: 'text-blue-100',
      heroIcon: 'text-blue-500',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-600',
      schemaBadge: 'bg-blue-100',
      schemaText: 'text-blue-700',
      ctaBg: 'bg-blue-600',
      ctaHover: 'hover:bg-blue-700',
      ctaBorder: 'border-blue-200',
    },
    violet: {
      heroBg: 'bg-violet-600',
      heroBadge: 'bg-violet-500',
      heroText: 'text-violet-100',
      heroIcon: 'text-violet-500',
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-600',
      schemaBadge: 'bg-violet-100',
      schemaText: 'text-violet-700',
      ctaBg: 'bg-violet-600',
      ctaHover: 'hover:bg-violet-700',
      ctaBorder: 'border-violet-200',
    },
    emerald: {
      heroBg: 'bg-emerald-600',
      heroBadge: 'bg-emerald-500',
      heroText: 'text-emerald-100',
      heroIcon: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      schemaBadge: 'bg-emerald-100',
      schemaText: 'text-emerald-700',
      ctaBg: 'bg-emerald-600',
      ctaHover: 'hover:bg-emerald-700',
      ctaBorder: 'border-emerald-200',
    },
    orange: {
      heroBg: 'bg-orange-600',
      heroBadge: 'bg-orange-500',
      heroText: 'text-orange-100',
      heroIcon: 'text-orange-500',
      iconBg: 'bg-orange-50',
      iconText: 'text-orange-600',
      schemaBadge: 'bg-orange-100',
      schemaText: 'text-orange-700',
      ctaBg: 'bg-orange-600',
      ctaHover: 'hover:bg-orange-700',
      ctaBorder: 'border-orange-200',
    },
    teal: {
      heroBg: 'bg-teal-600',
      heroBadge: 'bg-teal-500',
      heroText: 'text-teal-100',
      heroIcon: 'text-teal-500',
      iconBg: 'bg-teal-50',
      iconText: 'text-teal-600',
      schemaBadge: 'bg-teal-100',
      schemaText: 'text-teal-700',
      ctaBg: 'bg-teal-600',
      ctaHover: 'hover:bg-teal-700',
      ctaBorder: 'border-teal-200',
    },
    red: {
      heroBg: 'bg-red-600',
      heroBadge: 'bg-red-500',
      heroText: 'text-red-100',
      heroIcon: 'text-red-500',
      iconBg: 'bg-red-50',
      iconText: 'text-red-600',
      schemaBadge: 'bg-red-100',
      schemaText: 'text-red-700',
      ctaBg: 'bg-red-600',
      ctaHover: 'hover:bg-red-700',
      ctaBorder: 'border-red-200',
    },
    indigo: {
      heroBg: 'bg-indigo-600',
      heroBadge: 'bg-indigo-500',
      heroText: 'text-indigo-100',
      heroIcon: 'text-indigo-500',
      iconBg: 'bg-indigo-50',
      iconText: 'text-indigo-600',
      schemaBadge: 'bg-indigo-100',
      schemaText: 'text-indigo-700',
      ctaBg: 'bg-indigo-600',
      ctaHover: 'hover:bg-indigo-700',
      ctaBorder: 'border-indigo-200',
    },
    cyan: {
      heroBg: 'bg-cyan-600',
      heroBadge: 'bg-cyan-500',
      heroText: 'text-cyan-100',
      heroIcon: 'text-cyan-500',
      iconBg: 'bg-cyan-50',
      iconText: 'text-cyan-600',
      schemaBadge: 'bg-cyan-100',
      schemaText: 'text-cyan-700',
      ctaBg: 'bg-cyan-600',
      ctaHover: 'hover:bg-cyan-700',
      ctaBorder: 'border-cyan-200',
    },
    pink: {
      heroBg: 'bg-pink-600',
      heroBadge: 'bg-pink-500',
      heroText: 'text-pink-100',
      heroIcon: 'text-pink-500',
      iconBg: 'bg-pink-50',
      iconText: 'text-pink-600',
      schemaBadge: 'bg-pink-100',
      schemaText: 'text-pink-700',
      ctaBg: 'bg-pink-600',
      ctaHover: 'hover:bg-pink-700',
      ctaBorder: 'border-pink-200',
    },
    lime: {
      heroBg: 'bg-lime-600',
      heroBadge: 'bg-lime-500',
      heroText: 'text-lime-100',
      heroIcon: 'text-lime-500',
      iconBg: 'bg-lime-50',
      iconText: 'text-lime-600',
      schemaBadge: 'bg-lime-100',
      schemaText: 'text-lime-700',
      ctaBg: 'bg-lime-600',
      ctaHover: 'hover:bg-lime-700',
      ctaBorder: 'border-lime-200',
    },
  };

  return (
    map[color] ?? {
      heroBg: 'bg-sky-600',
      heroBadge: 'bg-sky-500',
      heroText: 'text-sky-100',
      heroIcon: 'text-sky-500',
      iconBg: 'bg-sky-50',
      iconText: 'text-sky-600',
      schemaBadge: 'bg-sky-100',
      schemaText: 'text-sky-700',
      ctaBg: 'bg-sky-600',
      ctaHover: 'hover:bg-sky-700',
      ctaBorder: 'border-sky-200',
    }
  );
}

export default function CaoPageTemplate({ cao }: Props) {
  const ac = getAccentClasses(cao.accentColor);
  const canonicalUrl = `https://zorgwerkwijzer.nl/cao/${cao.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: cao.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zorgwerkwijzer.nl' },
          { '@type': 'ListItem', position: 2, name: "CAO's", item: 'https://zorgwerkwijzer.nl/cao' },
          { '@type': 'ListItem', position: 3, name: cao.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav className="flex mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 self-center" />
        <Link href="/cao" className="hover:text-sky-600 transition-colors">CAO&apos;s</Link>
        <ChevronRight className="h-4 w-4 mx-2 self-center" />
        <span className="text-slate-900 font-medium">{cao.title}</span>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className={`${ac.heroBg} rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden`}>
        <div className="relative z-10">
          <span className={`inline-block px-3 py-1 ${ac.heroBadge} rounded-full text-xs font-bold uppercase tracking-wider mb-4`}>
            Update 2025-2026
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{cao.title}</h1>
          <p className={`${ac.heroText} text-lg max-w-xl mb-6`}>{cao.heroIntro}</p>
          <Link
            href={`/vacatures?q=${encodeURIComponent(cao.relatedVacancyQuery)}`}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Bekijk vacatures in deze sector
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <Sun className={`absolute -right-8 -bottom-8 w-64 h-64 ${ac.heroIcon} opacity-20 transform rotate-12`} />
      </div>

      {/* ── Kernvoorwaarden grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <InfoCard
          icon={<TrendingUp className={`w-6 h-6 ${ac.iconText}`} />}
          iconBg={ac.iconBg}
          title="Loonsverhoging 2026"
          content={`${cao.raisePercent2026}% per 1 januari 2026. Looptijd: ${cao.looptijd}.`}
        />
        <InfoCard
          icon={<Calendar className={`w-6 h-6 ${ac.iconText}`} />}
          iconBg={ac.iconBg}
          title="Vakantiedagen"
          content={`Minimaal ${cao.vacationDays} vakantiedagen per jaar bij fulltime dienstverband. Plus ${cao.holidayPayPercent}% vakantietoeslag.`}
        />
        <InfoCard
          icon={<Clock className={`w-6 h-6 ${ac.iconText}`} />}
          iconBg={ac.iconBg}
          title="ORT-toeslagen"
          content={`${cao.ort.eveningLabel}: ${cao.ort.evening}% | Zaterdag: ${cao.ort.saturday}% | Zon- & feestdagen: ${cao.ort.sunday}% op bruto uurloon.`}
        />
        <InfoCard
          icon={<PiggyBank className={`w-6 h-6 ${ac.iconText}`} />}
          iconBg={ac.iconBg}
          title="Eindejaarsuitkering"
          content={`${cao.endOfYearPercent}% van het bruto jaarsalaris, equivalent aan een volledige dertiende maand.`}
        />
        <InfoCard
          icon={<Car className={`w-6 h-6 ${ac.iconText}`} />}
          iconBg={ac.iconBg}
          title="Reiskosten"
          content={`€${cao.travelCostPerKm.toFixed(2)} per kilometer, maximaal 35 km enkele reis. OV-reizigers ontvangen in de meeste gevallen een volledige vergoeding.`}
        />
        <InfoCard
          icon={<Wallet className={`w-6 h-6 ${ac.iconText}`} />}
          iconBg={ac.iconBg}
          title="Werkweek"
          content={`${cao.weeklyHours} uur per week standaard. Salarisschalen zijn gebaseerd op een ${cao.weeklyHours}-urige werkweek.`}
        />
      </div>

      {/* ── Salarisschalen ────────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <BarChart3 className={`w-6 h-6 ${ac.iconText}`} />
          Salarisschalen {cao.title} 2026
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm text-slate-600">
              De salarisschalen in de {cao.title} zijn gebaseerd op het FWG-systeem (Functiewaardering
              Gezondheidszorg). Hieronder een indicatief overzicht van bruto maandsalarissen bij een{' '}
              {cao.weeklyHours}-urige werkweek.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {cao.fwgRows.map((row) => (
              <div key={`${row.schaal}-${row.functie}`} className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-24 shrink-0">
                  <span className={`inline-block px-2 py-0.5 ${ac.schemaBadge} ${ac.schemaText} text-xs font-bold rounded`}>
                    {row.schaal}
                  </span>
                </div>
                <div className="flex-1 text-sm text-slate-700">{row.functie}</div>
                <div className="text-right text-sm font-semibold text-slate-900 shrink-0">
                  €{row.min} – €{row.max}
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              * Indicatieve bedragen inclusief loonsverhoging 2026. Exact salaris hangt af van
              ervaringsjaren en werkgever.
            </p>
          </div>
        </div>
      </section>

      {/* ── ORT sectie ────────────────────────────────────────────────────── */}
      <section className="mb-14 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Onregelmatigheidstoeslag (ORT) — {cao.title}
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className={`text-2xl font-black ${ac.iconText}`}>+{cao.ort.evening}%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Avond/Nacht<br />({cao.ort.eveningLabel})
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-black text-amber-600">+{cao.ort.saturday}%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Zaterdag</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-black text-rose-600">+{cao.ort.sunday}%</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Zondag &<br />Feestdagen</div>
          </div>
        </div>
      </section>

      {/* ── Kernpunten ────────────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Belangrijkste punten {cao.title}
        </h2>
        <div className="space-y-4">
          {cao.keyPoints.map((point) => (
            <KeyPoint
              key={point.title}
              title={point.title}
              description={point.description}
            />
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Veelgestelde vragen</h2>
        <div className="space-y-4">
          {cao.faqs.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      {/* ── Gerelateerde salarispagina's ───────────────────────────────────── */}
      {cao.relatedProfessions.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Salarissen in de {cao.sector}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cao.relatedProfessions.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors group"
              >
                <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-700">
                  {p.label}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div className={`${ac.iconBg} border ${ac.ctaBorder} rounded-2xl p-8 text-center mb-12`}>
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Bereken uw salaris onder de {cao.title}
        </h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Gebruik onze gratis salariscalculator om uw nettoloon op basis van uw FWG-schaal te
          berekenen, inclusief vakantiegeld en ORT-toeslagen.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/salaris-calculator"
            className={`inline-flex items-center gap-2 px-6 py-3 ${ac.ctaBg} text-white font-semibold rounded-xl ${ac.ctaHover} transition-colors`}
          >
            Salariscalculator
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/ort-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            ORT berekenen
          </Link>
          <Link
            href="/vacatures"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Vacatures bekijken
          </Link>
        </div>
      </div>

      {/* ── Beroepen onder deze CAO ──────────────────────────────────────── */}
      {(() => {
        const caoBeroepen = getBeroepenByCao(cao.slug);
        if (caoBeroepen.length === 0) return null;
        return (
          <section className="pt-8 border-t border-slate-200 mb-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Beroepen onder de {cao.title}</h2>
                <p className="text-slate-500 text-sm">Bekijk per beroep het salaris, de taken en actuele vacatures.</p>
              </div>
              <Link href="/beroepen" className="hidden sm:flex items-center gap-1.5 text-sky-600 font-semibold text-sm hover:gap-2 transition-all">
                Alle beroepen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {caoBeroepen.map((b) => (
                <div key={b.slug} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{b.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{b.sector} &middot; {b.mboHboLevel}</p>
                    </div>
                  </div>
                  {b.averageSalary && (
                    <p className="text-sm font-semibold text-emerald-600 mb-3">{b.averageSalary} bruto/maand</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/beroepen/${b.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Beroep
                    </Link>
                    {b.relatedSalarySlug && (
                      <Link
                        href={`/salaris/${b.relatedSalarySlug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        Salaris
                      </Link>
                    )}
                    {b.relatedEducationSlug && (
                      <Link
                        href={`/opleidingen/${b.relatedEducationSlug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Opleiding
                      </Link>
                    )}
                    <Link
                      href={`/vacatures${b.relatedVacancyProfession ? `?q=${encodeURIComponent(b.relatedVacancyProfession)}` : ''}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Vacatures
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:hidden">
              <Link href="/beroepen" className="inline-flex items-center gap-2 text-sky-600 font-semibold text-sm">
                Alle beroepen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        );
      })()}

      {/* ── Andere CAO's ──────────────────────────────────────────────────── */}
      <div className="pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-3">Andere CAO&apos;s in de zorg:</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/cao-vvt" className="text-sm text-sky-600 hover:underline font-medium">
            CAO VVT →
          </Link>
          <Link href="/cao/ziekenhuizen" className="text-sm text-sky-600 hover:underline font-medium">
            CAO Ziekenhuizen →
          </Link>
          <Link href="/cao/ggz" className="text-sm text-sky-600 hover:underline font-medium">
            CAO GGZ →
          </Link>
          <Link href="/cao" className="text-sm text-sky-600 hover:underline font-medium">
            Alle CAO&apos;s →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componenten ───────────────────────────────────────────────────────────

function InfoCard({
  icon,
  iconBg,
  title,
  content,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  content: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function KeyPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
      <div className="flex gap-3">
        <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">{question}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
