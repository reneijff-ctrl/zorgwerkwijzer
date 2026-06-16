/**
 * ProfessionPageTemplate
 *
 * Gedeeld template voor ALLE /beroepen/[slug] pagina's.
 * Voeg een nieuw beroep toe in src/data/professions.ts — geen UI-aanpassing nodig.
 *
 * Secties:
 *  1. Hero
 *  2. Wat doet dit beroep?
 *  3. Werkzaamheden
 *  4. Competenties
 *  5. Opleiding
 *  6. BIG-registratie (indien van toepassing)
 *  7. Salaris samenvatting
 *  8. Doorgroeimogelijkheden
 *  9. Gerelateerde vacatures (RelatedVacancies SSR)
 * 10. Gerelateerde CAO
 * 11. FAQ
 */

import Link from 'next/link';
import {
  ChevronRight,
  GraduationCap,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Wallet,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import RelatedVacancies from '@/components/RelatedVacancies';
import type { ProfessionData } from '@/data/professions';

interface Props {
  profession: ProfessionData;
}

export default function ProfessionPageTemplate({ profession }: Props) {
  const canonicalUrl = `https://zorgwerkwijzer.nl/beroepen/${profession.slug}`;

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
          { '@type': 'ListItem', position: 2, name: 'Beroepen', item: 'https://zorgwerkwijzer.nl/beroepen' },
          { '@type': 'ListItem', position: 3, name: profession.name, item: canonicalUrl },
        ],
      },
      {
        '@type': 'Occupation',
        name: profession.name,
        description: profession.intro,
        estimatedSalary: {
          '@type': 'MonetaryAmountDistribution',
          name: `Salaris ${profession.name}`,
          currency: 'EUR',
          duration: 'P1M',
          description: profession.averageSalary,
        },
        educationRequirements: profession.opleiding,
        occupationalCategory: profession.sector,
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
            <Link href="/beroepen" className="hover:text-sky-600 transition-colors">Beroepen</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <span className="text-slate-900 font-medium">{profession.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Briefcase className="h-4 w-4" />
                <span>{profession.heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Werken als{' '}
                <span className="text-sky-600">{profession.name}</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {profession.heroIntro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/vacatures?q=${encodeURIComponent(profession.relatedVacancyProfession)}`}
                  className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 flex items-center group"
                >
                  Bekijk vacatures
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/salaris/${profession.relatedSalarySlug}`}
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center"
                >
                  Bekijk salaris
                </Link>
              </div>
            </div>

            {/* Quick-stats kaart */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-w-[260px] shrink-0">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                In één oogopslag
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Opleiding</span>
                    <p className="text-slate-500">{profession.mboHboLevel}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Salaris</span>
                    <p className="text-slate-500">{profession.averageSalary}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Sector</span>
                    <p className="text-slate-500">{profession.sector}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Werkomgeving</span>
                    <p className="text-slate-500">{profession.workEnvironment}</p>
                  </div>
                </li>
                {profession.bigRegistration && (
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-emerald-700">BIG-registratie vereist</span>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">CAO</span>
                    <p className="text-slate-500">{profession.relatedCaoName}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hoofd content + sidebar ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Linker kolom (hoofd content) ────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Sectie 1: Wat doet dit beroep? */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Wat doet een {profession.name}?</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{profession.intro}</p>
            </section>

            {/* Sectie 2: Gerelateerde vacatures — direct na intro voor maximale conversie */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Vacatures {profession.name}
                </h2>
              </div>
              <RelatedVacancies profession={profession.relatedVacancyProfession} />
            </section>

            {/* Sectie 3: Werkzaamheden */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Werkzaamheden</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {profession.tasks.map((task, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-1">{task.title}</h3>
                    <p className="text-sm text-slate-500">{task.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sectie 3: Competenties */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Competenties</h2>
              </div>
              <ul className="space-y-2">
                {profession.competencies.map((comp, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700">{comp}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sectie 4: Opleiding */}
            <section id="opleiding" className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Opleiding</h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {profession.mboHboLevel}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{profession.opleiding}</p>
            </section>

            {/* Sectie 5: BIG-registratie (conditoneel) */}
            {profession.bigRegistration && (
              <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">BIG-registratie</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Als {profession.name} ben je wettelijk verplicht ingeschreven in het BIG-register. Dit garandeert dat je bevoegd bent bepaalde voorbehouden handelingen uit te voeren. Herregistratie is elke 5 jaar vereist.
                </p>
                <a
                  href="https://www.bigregister.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-emerald-700 font-semibold hover:underline text-sm"
                >
                  Controleer BIG-register →
                </a>
              </section>
            )}

            {/* Sectie 6: Salaris samenvatting */}
            <section className="bg-sky-50 border border-sky-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Salaris {profession.name}</h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-sky-700">{profession.averageSalary}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Indicatief bruto maandsalaris op basis van {profession.relatedCaoName} 2026. Werkelijke beloning afhankelijk van FWG-schaal, ervaring en organisatie. ORT-toeslagen kunnen het inkomen aanzienlijk verhogen.
              </p>
              <Link
                href={`/salaris/${profession.relatedSalarySlug}`}
                className="inline-flex items-center bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
              >
                Volledige salarisschalen bekijken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </section>

            {/* Sectie 7: Doorgroeimogelijkheden */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Doorgroeimogelijkheden</h2>
              </div>
              <div className="space-y-4">
                {profession.growthPaths.map((path, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{path.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{path.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sectie 8: FAQ */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Veelgestelde vragen</h2>
              </div>
              <div className="space-y-4">
                {profession.faqs.map((faq, i) => (
                  <details key={i} className="group border border-slate-200 rounded-xl overflow-hidden">
                    <summary className="cursor-pointer flex items-center justify-between p-5 font-semibold text-slate-800 hover:bg-slate-50 transition-colors list-none">
                      <span>{faq.question}</span>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform shrink-0 ml-3" />
                    </summary>
                    <div className="px-5 pb-5 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

          </div>

          {/* ── Rechter sidebar ──────────────────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">

            {/* CAO-kaart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Toepasselijke CAO
              </h3>
              <p className="font-bold text-slate-800 text-lg mb-2">{profession.relatedCaoName}</p>
              <Link
                href={`/cao/${profession.relatedCaoSlug}`}
                className="mt-3 w-full inline-flex items-center justify-center bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                Bekijk {profession.relatedCaoName}
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>

            {/* Opleiding-kaart */}
            {profession.relatedEducationSlug && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <GraduationCap className="h-7 w-7 text-sky-600 mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Opleiding</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Bekijk de opleidingsvereisten en studiemogelijkheden voor {profession.name}.
                </p>
                <Link
                  href={`/opleidingen/${profession.relatedEducationSlug}`}
                  className="block text-center bg-sky-50 text-sky-700 border border-sky-200 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-sky-100 transition-colors"
                >
                  Bekijk opleiding →
                </Link>
              </div>
            )}

            {/* Salaris CTA */}
            <div className="bg-sky-600 text-white rounded-2xl p-6">
              <Wallet className="h-8 w-8 mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-1">Wat verdien jij?</h3>
              <p className="text-sky-100 text-sm mb-4">
                {profession.averageSalary}
              </p>
              <Link
                href={`/salaris/${profession.relatedSalarySlug}`}
                className="block text-center bg-white text-sky-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-sky-50 transition-colors"
              >
                Bekijk salarisschalen →
              </Link>
            </div>

            {/* Vacatures CTA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <Briefcase className="h-7 w-7 text-sky-600 mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">Vacatures</h3>
              <p className="text-slate-500 text-sm mb-4">
                Bekijk alle openstaande functies voor {profession.name}.
              </p>
              <Link
                href={`/vacatures?q=${encodeURIComponent(profession.relatedVacancyProfession)}`}
                className="block text-center bg-sky-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors"
              >
                Zoek vacatures
              </Link>
            </div>

            {/* Salaris-calculator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Calculator
              </h3>
              <Link
                href="/salaris-calculator"
                className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:underline"
              >
                <ArrowRight className="h-4 w-4" />
                Salaris calculator
              </Link>
              <Link
                href="/ort-calculator"
                className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:underline mt-2"
              >
                <ArrowRight className="h-4 w-4" />
                ORT calculator
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
