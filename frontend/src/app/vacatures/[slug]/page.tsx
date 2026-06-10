import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { vacancies } from '@/lib/vacancies';
import { 
  MapPin, 
  Clock, 
  Euro, 
  Calendar,
  Building2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = vacancies.find((v) => v.slug === slug);

  if (!vacancy) {
    return {
      title: 'Vacature niet gevonden',
    };
  }

  return {
    title: `${vacancy.title} bij ${vacancy.employer} | Zorgwerkwijzer`,
    description: `Bekijk de vacature voor ${vacancy.title} in ${vacancy.location}. Salarisindicatie: ${vacancy.salaryIndication}. Solliciteer direct!`,
    openGraph: {
      title: `${vacancy.title} bij ${vacancy.employer}`,
      description: vacancy.description,
      type: 'article',
      url: `https://zorgwerkwijzer.nl/vacatures/${vacancy.slug}`,
    },
  };
}

export default async function VacancyDetailPage({ params }: Props) {
  const { slug } = await params;
  const vacancy = vacancies.find((v) => v.slug === slug);

  if (!vacancy) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: vacancy.title,
    description: vacancy.description,
    datePosted: vacancy.publishedAt,
    validThrough: '2026-12-31T23:59:59Z',
    employmentType: vacancy.contractType === 'Vast' ? 'FULL_TIME' : 'PART_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: vacancy.employer,
      sameAs: 'https://zorgwerkwijzer.nl',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: vacancy.location,
        addressRegion: 'Nederland',
        addressCountry: 'NL',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        unitText: 'MONTH',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          href="/vacatures" 
          className="inline-flex items-center text-slate-500 hover:text-sky-600 font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Terug naar alle vacatures
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {vacancy.profession}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {vacancy.contractType}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{vacancy.title}</h1>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    <span className="font-semibold">{vacancy.employer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    {vacancy.location}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Functieomschrijving</h2>
                <div className="prose prose-slate max-w-none text-slate-600 mb-8">
                  <p>{vacancy.description}</p>
                  <p className="mt-4">
                    Als {vacancy.profession} bij {vacancy.employer} krijg je de kans om echt impact te maken. 
                    We bieden een stimulerende werkomgeving waarin jouw professionele ontwikkeling centraal staat.
                  </p>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-4">Wat wij bieden</h2>
                <ul className="space-y-3 mb-8">
                  {[
                    `Salarisindicatie: ${vacancy.salaryIndication}`,
                    'Goede onregelmatigheidstoeslagen (ORT)',
                    '8,33% eindejaarsuitkering',
                    '8% vakantiegeld',
                    'Pensioenopbouw bij PFZW',
                    'Ruime opleidingsmogelijkheden'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    Zorgwerkwijzer Tip
                  </h3>
                  <p className="text-sm text-slate-600">
                    Benieuwd wat je netto overhoudt bij deze baan? Gebruik onze <Link href="/salaris-calculator" className="text-sky-600 font-bold hover:underline">Salaris Calculator</Link> om je netto loon inclusief ORT te berekenen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-6">Kenmerken</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Uren</p>
                      <p className="text-slate-700 font-medium">{vacancy.contractHours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Euro className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Salaris</p>
                      <p className="text-slate-700 font-medium">{vacancy.salaryIndication}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Gepubliceerd</p>
                      <p className="text-slate-700 font-medium">{vacancy.publishedAt}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2">
                  Direct Solliciteren
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  Je wordt doorgestuurd naar de website van de werkgever.
                </p>
              </div>

              {/* Related Links */}
              <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-6 text-white shadow-lg shadow-sky-600/20">
                <h3 className="font-bold mb-4">Hulp bij je keuze?</h3>
                <p className="text-sky-100 text-sm mb-6">
                  Gebruik onze tools om je arbeidsvoorwaarden te checken.
                </p>
                <div className="space-y-3">
                  <Link href="/ort-calculator" className="block bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors text-sm font-medium">
                    ORT Berekenen
                  </Link>
                  <Link href="/vakantiegeld-berekenen" className="block bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors text-sm font-medium">
                    Vakantiegeld Berekenen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
