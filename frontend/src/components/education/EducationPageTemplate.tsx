/**
 * EducationPageTemplate
 *
 * Gedeeld template voor ALLE /opleidingen/[slug] pagina's.
 * Voeg een nieuwe opleiding toe in src/data/educationData.ts — geen UI-aanpassing nodig.
 *
 * Secties:
 *  1. Hero
 *  2. Wat leer je?
 *  3. Leerwegen / varianten
 *  4. Toelatingseisen
 *  5. Doorstroom- en carrièremogelijkheden
 *  6. BIG-registratie (indien van toepassing)
 *  7. Salaris na afstuderen
 *  8. Gerelateerde vacatures
 *  9. FAQ
 * 10. Sidebar: Beroep / Salaris / CAO / Vacatures
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
  Clock,
  Wallet,
  ShieldCheck,
  Users,
} from 'lucide-react';
import RelatedVacancies from '@/components/RelatedVacancies';
import type { EducationData } from '@/data/educationData';

interface Props {
  education: EducationData;
}

export default function EducationPageTemplate({ education }: Props) {
  const canonicalUrl = `https://zorgwerkwijzer.nl/opleidingen/${education.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── FAQ schema ────────────────────────────────────────────────────────
      {
        '@type': 'FAQPage',
        mainEntity: education.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      // ── Breadcrumb schema ─────────────────────────────────────────────────
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zorgwerkwijzer.nl' },
          { '@type': 'ListItem', position: 2, name: 'Opleidingen', item: 'https://zorgwerkwijzer.nl/opleidingen' },
          { '@type': 'ListItem', position: 3, name: education.name, item: canonicalUrl },
        ],
      },
      // ── Course schema ─────────────────────────────────────────────────────
      {
        '@type': 'Course',
        name: education.name,
        description: education.intro,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          name: 'ZorgWerkwijzer',
          url: 'https://zorgwerkwijzer.nl',
        },
        educationalLevel: education.level,
        timeToComplete: `PT${education.duration}`,
        occupationalCategory: education.sector,
        teaches: education.learningOutcomes,
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
            <Link href="/opleidingen" className="hover:text-sky-600 transition-colors">Opleidingen</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <span className="text-slate-900 font-medium">{education.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <GraduationCap className="h-4 w-4" />
                <span>{education.heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Opleiding{' '}
                <span className="text-sky-600">{education.name}</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {education.heroIntro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/beroepen/${education.relatedProfessionSlug}`}
                  className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 flex items-center group"
                >
                  Bekijk beroep
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/vacatures?q=${encodeURIComponent(education.relatedVacancyProfession)}`}
                  className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center"
                >
                  Bekijk vacatures
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
                    <span className="font-semibold text-slate-700">Niveau</span>
                    <p className="text-slate-500">{education.level}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Duur</span>
                    <p className="text-slate-500">{education.duration}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Sector</span>
                    <p className="text-slate-500">{education.sector}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Werkomgeving</span>
                    <p className="text-slate-500">{education.workEnvironment}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700">Startsalaris</span>
                    <p className="text-slate-500">{education.startingSalary}</p>
                  </div>
                </li>
                {education.bigRegistrationAfter && (
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-emerald-700">BIG-registratie na diploma</span>
                    </div>
                  </li>
                )}
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

            {/* Sectie 1: Wat is deze opleiding? */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Wat is de opleiding {education.name}?</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{education.intro}</p>
            </section>

            {/* Sectie 2: Wat leer je? */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Wat leer je tijdens de opleiding?</h2>
              </div>
              <ul className="space-y-2">
                {education.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sectie 3: Leerwegen */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Leerwegen</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {education.variants.map((variant, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-1">{variant.label}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Duur: {variant.duration}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sectie 4: Toelatingseisen */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Toelatingseisen</h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {education.level}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{education.admissionRequirements}</p>
            </section>

            {/* Sectie 5: Gerelateerde vacatures */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Vacatures {education.relatedProfessionName}
                </h2>
              </div>
              <RelatedVacancies profession={education.relatedVacancyProfession} />
            </section>

            {/* Sectie 6: Doorstroom & carrièremogelijkheden */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Doorstroom & Carrièremogelijkheden</h2>
              </div>
              <div className="space-y-4">
                {education.pathways.map((path, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-slate-700 pt-1">{path}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Sectie 7: BIG-registratie (conditioneel) */}
            {education.bigRegistrationAfter && (
              <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">BIG-registratie na afstuderen</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Na het behalen van je diploma {education.name} kun je je inschrijven in het BIG-register. BIG-registratie is vereist om zelfstandig voorbehouden handelingen te mogen uitvoeren en geeft patiënten zekerheid over jouw vakbekwaamheid. Herregistratie is elke 5 jaar verplicht.
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

            {/* Sectie 8: Salaris na afstuderen */}
            <section className="bg-sky-50 border border-sky-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Salaris na afstuderen</h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-sky-700">{education.startingSalary}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Indicatief bruto maandsalaris na afstuderen conform {education.relatedCaoName} 2026. Werkelijke beloning afhankelijk van FWG-schaal, ervaring en organisatie.
              </p>
              <Link
                href={`/salaris/${education.relatedSalarySlug}`}
                className="inline-flex items-center bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
              >
                Volledige salarisschalen bekijken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </section>

            {/* Sectie 9: FAQ */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Veelgestelde vragen</h2>
              </div>
              <div className="space-y-4">
                {education.faqs.map((faq, i) => (
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

            {/* Beroep-kaart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Bijbehorend beroep
              </h3>
              <p className="font-bold text-slate-800 text-lg mb-2">{education.relatedProfessionName}</p>
              <Link
                href={`/beroepen/${education.relatedProfessionSlug}`}
                className="mt-3 w-full inline-flex items-center justify-center bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                Bekijk beroep {education.relatedProfessionName}
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>

            {/* Salaris CTA */}
            <div className="bg-sky-600 text-white rounded-2xl p-6">
              <Wallet className="h-8 w-8 mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-1">Wat verdien jij na afstuderen?</h3>
              <p className="text-sky-100 text-sm mb-4">
                {education.startingSalary}
              </p>
              <Link
                href={`/salaris/${education.relatedSalarySlug}`}
                className="block text-center bg-white text-sky-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-sky-50 transition-colors"
              >
                Bekijk salarisschalen →
              </Link>
            </div>

            {/* CAO-kaart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Toepasselijke CAO
              </h3>
              <p className="font-bold text-slate-800 text-lg mb-2">{education.relatedCaoName}</p>
              <Link
                href={`/cao/${education.relatedCaoSlug}`}
                className="mt-3 w-full inline-flex items-center justify-center bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                Bekijk {education.relatedCaoName}
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>

            {/* Vacatures CTA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <Briefcase className="h-7 w-7 text-sky-600 mb-3" />
              <h3 className="font-bold text-slate-800 mb-1">Vacatures</h3>
              <p className="text-slate-500 text-sm mb-4">
                Bekijk alle openstaande functies voor {education.relatedProfessionName}.
              </p>
              <Link
                href={`/vacatures?q=${encodeURIComponent(education.relatedVacancyProfession)}`}
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
