/**
 * SalaryPageTemplate
 *
 * Gedeeld template voor ALLE /salaris/[slug] pagina's.
 * Voeg een nieuw beroep toe in src/data/salaryData.ts — geen UI-aanpassing nodig.
 *
 * Gebruik in /salaris/[slug]/page.tsx:
 *   import SalaryPageTemplate from '@/components/salary/SalaryPageTemplate';
 *   import { getProfession } from '@/data/salaryData';
 *   import { getCao } from '@/data/caos';
 *
 *   export default function Page({ params }) {
 *     const profession = getProfession(params.slug)!;
 *     const cao = getCao(profession.caoId)!;
 *     return <SalaryPageTemplate profession={profession} cao={cao} />;
 *   }
 */

import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
  Info,
  CheckCircle2,
  BarChart3,
  Award,
} from 'lucide-react';
import RelatedVacancies from '@/components/RelatedVacancies';
import type { ProfessionSalaryData } from '@/data/salaryData';
import type { CaoData } from '@/data/caos';

interface Props {
  profession: ProfessionSalaryData;
  cao: CaoData;
}

export default function SalaryPageTemplate({ profession, cao }: Props) {
  const canonicalUrl = `https://zorgwerkwijzer.nl/salaris/${profession.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: profession.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zorgwerkwijzer.nl' },
          { '@type': 'ListItem', position: 2, name: 'Salarissen', item: 'https://zorgwerkwijzer.nl/salaris' },
          { '@type': 'ListItem', position: 3, name: `${profession.name} Salaris`, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <Link href="/salaris" className="hover:text-sky-600 transition-colors">Salarissen</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <span className="text-slate-900 font-medium">{profession.name} Salaris</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="h-4 w-4" />
                <span>{profession.heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Salaris {profession.name} 2026:{' '}
                <span className="text-sky-600">Wat Verdien Je?</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {profession.heroIntro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/vacatures?q=${encodeURIComponent(profession.vacatureProfession)}`}
                  className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 flex items-center group"
                >
                  Bekijk vacatures
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/salaris-calculator"
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center"
                >
                  Bereken je salaris
                </Link>
              </div>
            </div>

            {/* Hero stats card */}
            <div className="hidden lg:block shrink-0">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden w-72">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 z-0" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 bg-sky-100 rounded-2xl flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Gemiddeld bruto</p>
                      <p className="text-2xl font-bold text-slate-900">{profession.avgSalaryDisplay}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Vakantiegeld</span>
                      <span className="font-bold text-slate-700">{cao.holidayPayPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Eindejaarsuitkering</span>
                      <span className="font-bold text-slate-700">{cao.endOfYearPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">ORT (feestdagen)</span>
                      <span className="font-bold text-sky-600">+{cao.ort.sunday}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick stats ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Maandsalaris</div>
              <div className="text-base font-bold text-slate-900">{profession.avgSalaryDisplay}</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Werkweek</div>
              <div className="text-base font-bold text-slate-900">{cao.weeklyHours} uur standaard</div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Loonsverhoging 2026</div>
              <div className="text-base font-bold text-slate-900">+{cao.raisePercent2026}% {cao.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: content */}
          <div className="lg:col-span-2 space-y-14">

            {/* Intro */}
            <section id="intro">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Info className="h-6 w-6 text-sky-600 shrink-0" />
                Hoeveel verdient een {profession.name}?
              </h2>
              <p className="text-slate-600 leading-relaxed">{profession.intro}</p>
            </section>

            {/* Salary table */}
            <section id="salarisschalen">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-sky-600 shrink-0" />
                Salarisschalen {cao.name} 2026
              </h2>
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-5 py-3 font-bold text-slate-900 border-b border-slate-200">Schaal</th>
                      <th className="px-5 py-3 font-bold text-slate-900 border-b border-slate-200">Omschrijving</th>
                      <th className="px-5 py-3 font-bold text-slate-900 border-b border-slate-200">Maandsalaris</th>
                      <th className="px-5 py-3 font-bold text-slate-900 border-b border-slate-200 hidden md:table-cell">Uurloon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profession.fwgRows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-3 font-semibold text-slate-800">{row.scale}</td>
                        <td className="px-5 py-3 text-slate-600">{row.label}</td>
                        <td className="px-5 py-3 text-slate-800 font-medium">
                          {row.min === row.max ? row.min : `${row.min} – ${row.max}`}
                        </td>
                        <td className="px-5 py-3 text-slate-500 hidden md:table-cell">{row.hourlyRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-400 italic">
                * Indicatieve bedragen voor 2026 op basis van {cao.name} per 1 januari 2026 ({cao.raisePercent2026}% verhoging). 36-urige werkweek.
              </p>
            </section>

            {/* ORT section */}
            <section id="ort" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Onregelmatigheidstoeslag (ORT) — {cao.name}
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-2xl font-black text-sky-600">+{cao.ort.evening}%</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">Avond<br />(ma–vr 20:00–06:00)</div>
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

            {/* Benefits */}
            <section id="arbeidsvoorwaarden">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                Extra arbeidsvoorwaarden
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profession.benefits.map((item, i) => (
                  <div key={i} className="flex items-center p-4 bg-white rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Growth */}
            {profession.growth.length > 0 && (
              <section
                id="doorgroei"
                className="bg-sky-900 text-white p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-56 h-56 bg-sky-800 rounded-full -mr-28 -mt-28 z-0 opacity-50" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                    <Award className="h-7 w-7 shrink-0" />
                    Doorgroeimogelijkheden
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {profession.growth.map((g, i) => (
                      <div key={i} className="flex items-start gap-3 text-sky-100">
                        <CheckCircle2 className="h-5 w-5 text-sky-400 mt-0.5 shrink-0" />
                        <p>
                          <span className="font-bold text-white">{g.title}:</span>{' '}
                          {g.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CAO info */}
            <section id="cao" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Van toepassing: {cao.name}
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                {cao.fullName} — sector: {cao.sector}
              </p>
              <Link
                href={cao.href}
                className="inline-flex items-center gap-2 text-sky-600 font-semibold text-sm hover:gap-3 transition-all"
              >
                Bekijk volledige CAO-informatie
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Related vacancies */}
            <RelatedVacancies profession={profession.vacatureProfession} />

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Info className="h-6 w-6 text-sky-600 shrink-0" />
                Veelgestelde vragen over {profession.name} salaris
              </h2>
              <div className="space-y-3">
                {profession.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl hover:border-sky-200 transition-colors"
                  >
                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-6">
            {/* Calculator CTA */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Direct berekenen</h3>
              <p className="text-sm text-slate-500 mb-5">
                Wil je weten wat je netto overhoudt inclusief al je toeslagen?
              </p>
              <div className="space-y-2">
                <Link
                  href="/salaris-calculator"
                  className="w-full bg-sky-600 text-white p-3.5 rounded-xl font-bold hover:bg-sky-700 transition-all flex items-center justify-center gap-2 text-sm group"
                >
                  Salaris Calculator
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/ort-calculator"
                  className="w-full bg-slate-100 text-slate-700 p-3.5 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center text-sm"
                >
                  ORT Calculator
                </Link>
                <Link
                  href="/vakantiegeld-berekenen"
                  className="w-full bg-slate-100 text-slate-700 p-3.5 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center text-sm"
                >
                  Vakantiegeld berekenen
                </Link>
              </div>

              {/* Cross-pijler links */}
              {(profession.beroepHref || profession.relatedCaoSlug || profession.relatedEducationSlug) && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">Gerelateerde pagina&apos;s</h4>
                  <ul className="space-y-2">
                    {profession.beroepHref && (
                      <li>
                        <Link
                          href={profession.beroepHref}
                          className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:underline"
                        >
                          <ArrowRight className="h-4 w-4 shrink-0" />
                          Werken als {profession.name}
                        </Link>
                      </li>
                    )}
                    {profession.relatedCaoSlug && profession.relatedCaoName && (
                      <li>
                        <Link
                          href={`/cao/${profession.relatedCaoSlug}`}
                          className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:underline"
                        >
                          <ArrowRight className="h-4 w-4 shrink-0" />
                          {profession.relatedCaoName}
                        </Link>
                      </li>
                    )}
                    {profession.relatedEducationSlug && (
                      <li>
                        <Link
                          href={`/opleidingen/${profession.relatedEducationSlug}`}
                          className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:underline"
                        >
                          <ArrowRight className="h-4 w-4 shrink-0" />
                          Opleiding {profession.name}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Related salary links */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-sky-600" />
                  Andere salarissen
                </h4>
                <ul className="space-y-1.5">
                  {profession.relatedSalaryLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block text-slate-600 hover:text-sky-600 text-sm py-1 font-medium transition-colors"
                      >
                        → {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
