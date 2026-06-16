import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  Users, 
  Calculator, 
  BookOpen, 
  RefreshCcw, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Over ZorgWerkwijzer | Onafhankelijk Platform voor Zorgmedewerkers',
  description:
    'ZorgWerkwijzer is het onafhankelijke platform voor zorgmedewerkers in Nederland. Alles over salaris, CAO, ORT, vakantiegeld en opleidingen op één plek.',
  keywords: [
    'over zorgwerkwijzer',
    'zorgwerkwijzer platform',
    'onafhankelijk zorg informatie',
    'zorgmedewerker tools',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/over-ons',
  },
  openGraph: {
    title: 'Over ZorgWerkwijzer | Onafhankelijk Platform voor Zorgmedewerkers',
    description:
      'Het onafhankelijke platform voor zorgmedewerkers: salaris, CAO, calculators en beroepsinformatie.',
    url: 'https://zorgwerkwijzer.nl/over-ons',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Over ZorgWerkwijzer | Onafhankelijk Platform voor Zorgmedewerkers',
    description: 'Het onafhankelijke platform voor zorgmedewerkers in Nederland.',
  },
};

export default function OverOnsPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zorgwerkwijzer",
    "url": "https://www.zorgwerkwijzer.nl",
    "logo": "https://www.zorgwerkwijzer.nl/images/zorgwerkwijzer-logo.png",
    "description": "Onafhankelijk platform voor zorgmedewerkers in Nederland met calculators voor salaris, ORT en vakantiegeld.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NL"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.zorgwerkwijzer.nl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Over ons",
        "item": "https://www.zorgwerkwijzer.nl/over-ons"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 rounded-l-full -mr-20 blur-3xl opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Over <span className="text-blue-600">Zorgwerkwijzer</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Zorgwerkwijzer is h&eacute;t onafhankelijke platform voor zorgmedewerkers in Nederland. Wij helpen je om grip te krijgen op je arbeidsvoorwaarden met transparante tools en actuele informatie.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Target className="w-4 h-4" />
              Onze Missie
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              Waarom Zorgwerkwijzer bestaat
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              De zorgsector is het fundament van onze samenleving, maar de administratieve kant &mdash; zoals salarisstroken, onregelmatigheidstoeslag (ORT) en complexe CAO-regels &mdash; kan vaak onduidelijk zijn.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Onze missie is om elke zorgmedewerker te voorzien van de tools die nodig zijn om hun eigen financi&euml;le situatie te begrijpen en te verbeteren. Wij geloven in volledige transparantie en toegankelijkheid voor iedereen die in de zorg werkt.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900">100% Onafhankelijk</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900">Voor de Zorg</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <RefreshCcw className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900">Altijd Actueel</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <Calculator className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900">Gratis Tools</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Section */}
      <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-12">Speciaal voor Nederlandse Zorgmedewerkers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
              <BookOpen className="w-10 h-10 text-blue-400 mb-6 mx-auto" />
              <h3 className="text-xl font-bold mb-4">CAO-Expertise</h3>
              <p className="text-slate-400">
                Onze calculators zijn gebaseerd op de meest recente CAO-afspraken (VVT, Ziekenhuizen, GGZ) zodat je altijd de juiste resultaten krijgt.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
              <Calculator className="w-10 h-10 text-pink-400 mb-6 mx-auto" />
              <h3 className="text-xl font-bold mb-4">Eenvoudige Tools</h3>
              <p className="text-slate-400">
                Geen ingewikkelde spreadsheets meer. Vul je gegevens in en ontvang direct een overzichtelijk resultaat van je verdiensten.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
              <ShieldCheck className="w-10 h-10 text-orange-400 mb-6 mx-auto" />
              <h3 className="text-xl font-bold mb-4">Betrouwbare Bron</h3>
              <p className="text-slate-400">
                Zorgwerkwijzer is onafhankelijk en heeft geen commercieel belang bij zorginstellingen. Wij staan aan jouw kant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Links section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Ontdek Onze Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/salaris-calculator" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="text-blue-600 mb-4 font-bold group-hover:underline">Salaris Calculator &rarr;</div>
            <p className="text-slate-600 text-sm italic">Bereken je netto maandsalaris.</p>
          </Link>
          <Link href="/ort-calculator" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="text-pink-600 mb-4 font-bold group-hover:underline">ORT Calculator &rarr;</div>
            <p className="text-slate-600 text-sm italic">Bereken je onregelmatigheidstoeslag.</p>
          </Link>
          <Link href="/vakantiegeld-berekenen" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="text-orange-600 mb-4 font-bold group-hover:underline">Vakantiegeld &rarr;</div>
            <p className="text-slate-600 text-sm italic">Ontdek hoeveel vakantiegeld je opbouwt.</p>
          </Link>
          <Link href="/cao-vvt" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="text-green-600 mb-4 font-bold group-hover:underline">CAO Informatie &rarr;</div>
            <p className="text-slate-600 text-sm italic">Alles over de CAO VVT 2024-2026.</p>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Veelgestelde Vragen over Zorgwerkwijzer</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Is Zorgwerkwijzer gratis te gebruiken?
              </h3>
              <p className="text-slate-600">
                Ja, alle calculators en informatie op Zorgwerkwijzer zijn volledig gratis toegankelijk voor alle zorgmedewerkers.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Hoe vaak worden de CAO-gegevens bijgewerkt?
              </h3>
              <p className="text-slate-600">
                Wij houden de CAO-onderhandelingen nauwlettend in de gaten. Zodra er een nieuw akkoord is of een periodieke verhoging plaatsvindt, passen wij onze calculators aan.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Is Zorgwerkwijzer verbonden aan een vakbond?
              </h3>
              <p className="text-slate-600">
                Nee, Zorgwerkwijzer is een onafhankelijk platform. Wij zijn niet verbonden aan vakbonden of werkgeversorganisaties, waardoor we objectieve informatie kunnen verstrekken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <Mail className="w-12 h-12 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl font-bold mb-6">Heb je een vraag of suggestie?</h2>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
              We horen graag van je. Of het nu gaat om een fout in een calculator of een verzoek voor een nieuwe functie, jouw feedback helpt ons Zorgwerkwijzer beter te maken.
            </p>
            <Link 
              href="mailto:info@zorgwerkwijzer.nl" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
            >
              Email ons op info@zorgwerkwijzer.nl
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
