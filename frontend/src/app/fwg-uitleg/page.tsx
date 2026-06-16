import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Info, 
  TrendingUp, 
  Briefcase, 
  HelpCircle, 
  Calculator, 
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Table
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FWG Uitleg 2026 | Functiewaardering Gezondheidszorg | ZorgWerkwijzer',
  description:
    'Alles over het FWG-systeem in de Nederlandse zorg: hoe wordt functiewaardering bepaald, welke schalen zijn er (FWG 15-80), en hoe beïnvloedt FWG jouw salaris?',
  keywords: [
    'fwg uitleg',
    'functiewaardering gezondheidszorg',
    'fwg schalen',
    'fwg 40 salaris',
    'fwg zorg',
    'salarisschalen zorg',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/fwg-uitleg',
  },
  openGraph: {
    title: 'FWG Uitleg 2026 | Functiewaardering Gezondheidszorg | ZorgWerkwijzer',
    description:
      'Hoe werkt FWG? Ontdek de schalen, salarissen en hoe functiewaardering jouw inkomen bepaalt in de zorg.',
    url: 'https://zorgwerkwijzer.nl/fwg-uitleg',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FWG Uitleg 2026 | Functiewaardering Gezondheidszorg | ZorgWerkwijzer',
    description:
      'Hoe werkt FWG? Ontdek de schalen, salarissen en hoe functiewaardering jouw inkomen bepaalt.',
  },
};

export default function FwgUitlegPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Zorgwerkwijzer",
        "item": "https://zorgwerkwijzer.nl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FWG Uitleg",
        "item": "https://zorgwerkwijzer.nl/fwg-uitleg"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wat betekent FWG?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FWG staat voor FunctieWaardering Gezondheidszorg. Het is een systeem dat wordt gebruikt om de zwaarte van functies in de zorg te bepalen en deze in te delen in salarisschalen."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe wordt mijn FWG schaal bepaald?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Je werkgever kijkt naar de taken en verantwoordelijkheden in je functiebeschrijving en vergelijkt deze met standaard referentiefuncties in het FWG-systeem. Op basis daarvan word je ingedeeld in een schaal (bijv. FWG 40)."
        }
      },
      {
        "@type": "Question",
        "name": "Wat is het verschil tussen FWG 35 en FWG 40?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FWG 40 heeft een hogere functiezwaarte dan FWG 35. Vaak zie je dat Verzorgenden zonder specifieke specialisatie in 35 vallen, terwijl Verzorgende IG (Individuele Gezondheidszorg) meestal in FWG 40 is ingedeeld vanwege de extra medische handelingen."
        }
      },
      {
        "@type": "Question",
        "name": "Kan ik onderhandelen over mijn FWG schaal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "De schaal zelf staat vaak vast voor een specifieke functie, maar je kunt wel onderhandelen over de 'trede' (periodiek) binnen die schaal, afhankelijk van je ervaring."
        }
      },
      {
        "@type": "Question",
        "name": "Groeit mijn FWG salaris automatisch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, meestal ga je elk jaar een trede omhoog binnen je schaal totdat je het maximum hebt bereikt. Daarnaast stijgen de bedragen in de schalen mee met de CAO-loonsverhogingen."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-20 overflow-hidden border-b">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <Info className="w-4 h-4" />
              <span>Alles over FWG in de Zorg</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              FWG Uitleg & Salarisschalen <span className="text-primary-600">Zorg 2026</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Begrijp hoe functiewaardering werkt in de Nederlandse gezondheidszorg. Ontdek hoe je schaal wordt bepaald, 
              wat de verschillen zijn tussen FWG 35 en 60, en bekijk de actuele salarisindicaties voor 2026.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/salaris-calculator" 
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                Bereken je salaris
                <Calculator className="w-5 h-5" />
              </Link>
              <Link 
                href="#schalen-vergelijken" 
                className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Bekijk FWG schalen
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* What is FWG */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  Wat is FWG eigenlijk?
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <p className="mb-4">
                    <strong>FWG</strong> staat voor <em>FunctieWaardering Gezondheidszorg</em>. Het is een universeel systeem in Nederland dat wordt gebruikt om functies in de zorg objectief te waarderen en in te delen in salarisschalen.
                  </p>
                  <p className="mb-4">
                    Het doel van FWG is om ervoor te zorgen dat medewerkers die werk van gelijke &apos;zwaarte&apos; doen, ook in dezelfde salarisgroep vallen. Dit systeem wordt gebruikt in bijna alle zorg-CAO&apos;s, zoals de <strong>CAO VVT</strong>, CAO Ziekenhuizen en CAO Gehandicaptenzorg.
                  </p>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-6">
                    <h4 className="font-bold text-slate-900 mb-3">Hoe wordt de zwaarte bepaald?</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 italic">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        Verantwoordelijkheid en zelfstandigheid
                      </li>
                      <li className="flex items-start gap-2 italic">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        Kennis en vereiste opleiding (MBO/HBO/WO)
                      </li>
                      <li className="flex items-start gap-2 italic">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        Sociale vaardigheden en uitdrukkingsvaardigheid
                      </li>
                      <li className="flex items-start gap-2 italic">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        Risico&apos;s, neveneffecten en fysieke belasting
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-emerald-600" />
                  </div>
                  Hoe werkgevers je schaal bepalen
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <p className="mb-4">
                    Wanneer je een contract tekent, staat daar altijd een FWG-schaal in. Maar hoe komt je werkgever tot die keuze?
                  </p>
                  <ol className="list-decimal pl-5 space-y-4 mb-6">
                    <li>
                      <strong>Functiebeschrijving:</strong> De werkgever stelt een beschrijving op van wat jij gaat doen (je taken en verantwoordelijkheden).
                    </li>
                    <li>
                      <strong>Indeling:</strong> Deze beschrijving wordt gelegd naast het FWG-systeem. Er wordt gekeken welke &apos;referentiefunctie&apos; het beste past.
                    </li>
                    <li>
                      <strong>Toekenning schaal:</strong> Elke referentiefunctie is gekoppeld aan een aantal punten, wat leidt tot een schaal (bijv. FWG 45).
                    </li>
                    <li>
                      <strong>Inschaling (Trede):</strong> Op basis van je relevante werkervaring wordt bepaald op welke trede (periodiek) binnen die schaal je begint.
                    </li>
                  </ol>
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <p className="text-amber-900 text-sm font-medium">
                      <strong>Tip:</strong> Als je vindt dat je taken zwaarder zijn geworden dan wat in je functiebeschrijving staat, kun je vragen om een heroverweging van je FWG-indeling.
                    </p>
                  </div>
                </div>
              </div>

              {/* FWG Differences Table */}
              <div id="schalen-vergelijken" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Table className="w-6 h-6 text-purple-600" />
                  </div>
                  Verschillen tussen FWG Schalen (CAO VVT)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-4 font-bold text-slate-900">Schaal</th>
                        <th className="py-4 font-bold text-slate-900">Typische Functies</th>
                        <th className="py-4 font-bold text-slate-900">Indicatie 2026 (Bruto)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="py-4 font-bold text-primary-600">FWG 35</td>
                        <td className="py-4 text-slate-600">Helpende Plus, Verzorgende, Gastvrouw/-heer</td>
                        <td className="py-4 text-slate-600">€ 2.650 - € 3.450</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-primary-600">FWG 40</td>
                        <td className="py-4 text-slate-600">Verzorgende IG, Activiteitenbegeleider</td>
                        <td className="py-4 text-slate-600">€ 2.800 - € 3.750</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-primary-600">FWG 45</td>
                        <td className="py-4 text-slate-600">MBO Verpleegkundige, Gespecialiseerd Verzorgende</td>
                        <td className="py-4 text-slate-600">€ 3.050 - € 4.100</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-primary-600">FWG 50</td>
                        <td className="py-4 text-slate-600">HBO Verpleegkundige, Senior Verpleegkundige</td>
                        <td className="py-4 text-slate-600">€ 3.350 - € 4.650</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-primary-600">FWG 55</td>
                        <td className="py-4 text-slate-600">Wijkverpleegkundige, Teamleider, HBO Verpleegkundige</td>
                        <td className="py-4 text-slate-600">€ 3.650 - € 5.250</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold text-primary-600">FWG 60</td>
                        <td className="py-4 text-slate-600">Locatiemanager, Regieverpleegkundige, Verpleegkundig Specialist</td>
                        <td className="py-4 text-slate-600">€ 4.200 - € 5.950</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 text-sm text-slate-500 italic">
                  * Bedragen zijn indicatief op basis van CAO VVT 2026 bij een fulltime dienstverband (36 uur).
                </p>
              </div>

              {/* FAQ Section */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Veelgestelde vragen over FWG</h2>
                <div className="space-y-6">
                  <div className="border-b border-slate-50 pb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Kan ik overstappen van FWG 35 naar FWG 40?</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Ja, dat kan als je een zwaardere functie krijgt. Vaak betekent dit dat je een aanvullende opleiding moet volgen (bijv. van Helpende naar Verzorgende IG). Je krijgt dan een nieuwe functiebeschrijving die in een hogere FWG-schaal valt.
                    </p>
                  </div>
                  <div className="border-b border-slate-50 pb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Wat gebeurt er als ik het einde van mijn schaal bereik?</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Wanneer je de hoogste trede van je schaal hebt bereikt, krijg je geen jaarlijkse periodieke verhoging meer. Je salaris stijgt dan alleen nog mee met de algemene CAO-loonsverhogingen. Om weer meer te verdienen, zou je moeten doorgroeien naar een functie in een hogere FWG-schaal.
                    </p>
                  </div>
                  <div className="border-b border-slate-50 pb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Is FWG hetzelfde als een loonschaal?</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Niet helemaal. FWG is het systeem om de <em>zwaarte</em> van de functie te bepalen. De uitkomst van dat systeem is een indeling in een loonschaal. Dus FWG bepaalt <em>welke</em> schaal je krijgt.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Hoe weet ik in welke schaal ik hoor?</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Dit staat in je arbeidsovereenkomst. Je kunt bij je werkgever ook de volledige functiebeschrijving en de daarbij behorende FWG-waardering opvragen.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Calculators Card */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">Direct berekenen?</h3>
                <p className="text-primary-50 mb-8 text-sm leading-relaxed">
                  Wil je precies weten wat jouw FWG schaal netto betekent onderaan de streep? Gebruik onze gratis calculators.
                </p>
                <div className="space-y-4">
                  <Link href="/salaris-calculator" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all group">
                    <span className="font-medium">Salaris Calculator</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/ort-calculator" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all group">
                    <span className="font-medium">ORT Calculator</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/vakantiegeld-berekenen" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all group">
                    <span className="font-medium">Vakantiegeld</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Related Salary Pages */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6">Salaris per beroep</h3>
                <div className="space-y-4">
                  <Link href="/salaris/verpleegkundige" className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors group">
                    <div className="w-2 h-2 rounded-full bg-primary-600" />
                    <span className="text-sm font-medium">Verpleegkundige</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/salaris/verzorgende-ig" className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors group">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                    <span className="text-sm font-medium">Verzorgende IG</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link href="/salaris/helpende-plus" className="flex items-center gap-3 text-slate-600 hover:text-primary-600 transition-colors group">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm font-medium">Helpende Plus</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Zeker weten dat je goed betaald krijgt?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
            Gebruik de Zorgwerkwijzer Salaris Calculator om je bruto FWG-salaris om te zetten naar netto, inclusief alle toeslagen.
          </p>
          <Link 
            href="/salaris-calculator" 
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20"
          >
            Start de calculator
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
