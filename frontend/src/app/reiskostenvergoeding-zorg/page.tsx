import React from 'react';
import Link from 'next/link';
import { 
  Car, 
  Bus, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Calculator,
  Coins,
  ShieldCheck
} from 'lucide-react';

export default function ReiskostenPage() {
  const faqs = [
    {
      question: "Hoeveel reiskostenvergoeding krijg ik in de CAO VVT in 2025?",
      answer: "Per 1 januari 2025 is de reiskostenvergoeding voor woon-werkverkeer in de CAO VVT verhoogd naar €0,21 per kilometer. Voorheen was dit €0,17 per kilometer."
    },
    {
      question: "Wat is de vergoeding voor dienstreizen in de zorg?",
      answer: "Voor dienstreizen (verkeer tussen cliënten of locaties tijdens werktijd) geldt in de CAO VVT meestal een hogere vergoeding van €0,27 per kilometer."
    },
    {
      question: "Krijg ik ook reiskostenvergoeding als ik met de fiets ga?",
      answer: "Ja, de kilometervergoeding geldt in de meeste zorg-CAO's ongeacht het vervoermiddel. Sommige werkgevers hebben daarnaast een specifieke fietsregeling of bieden een leasefiets aan."
    },
    {
      question: "Wordt openbaar vervoer volledig vergoed in de zorg?",
      answer: "In de CAO VVT wordt het gebruik van openbaar vervoer voor woon-werkverkeer vaak 100% vergoed op basis van 2e klas tarieven, mits dit de kortste route is."
    },
    {
      question: "Is er een maximum aantal kilometers voor reiskostenvergoeding?",
      answer: "Ja, veel zorginstellingen hanteren een maximum (bijvoorbeeld 30 of 40 kilometer enkele reis) voor de woon-werkvergoeding. Controleer je eigen arbeidsovereenkomst voor de exacte details."
    },
    {
      question: "Moet ik belasting betalen over mijn reiskostenvergoeding?",
      answer: "Tot €0,23 per kilometer (vanaf 2024) is de reiskostenvergoeding belastingvrij. Krijg je meer dan dit bedrag per kilometer, dan wordt over het deel boven de €0,23 loonbelasting berekend."
    },
    {
      question: "Krijg ik reiskostenvergoeding tijdens ziekte?",
      answer: "In de regel stopt de reiskostenvergoeding zodra je niet meer naar je werk reist door ziekte. Sommige vaste vergoedingen mogen onder voorwaarden nog een korte periode worden doorbetaald."
    },
    {
      question: "Hoe bereken ik mijn maandelijkse reiskosten?",
      answer: "Vermenigvuldig het aantal kilometers (heen en terug) met je kilometervergoeding en het aantal werkdagen per maand. Voorbeeld: 20km x 2 x €0,21 x 18 dagen = €151,20 per maand."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://zorgwerkwijzer.nl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Reiskostenvergoeding Zorg",
        "item": "https://zorgwerkwijzer.nl/reiskostenvergoeding-zorg"
      }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <section className="bg-white border-b pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary-600 font-semibold mb-4">
            <Car className="w-5 h-5" />
            <span>Vergoedingen & Regelingen</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Reiskostenvergoeding in de Zorg: <span className="text-primary-600">Alles wat je moet weten</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Als zorgmedewerker maak je vaak veel kilometers. Of je nu naar je vaste werkplek reist of tussen cliënten door, je hebt recht op een eerlijke vergoeding. Ontdek de actuele tarieven voor 2024, 2025 en 2026.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              CAO VVT 2025 Updates
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Kilometervergoeding €0,21+
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              OV 100% Vergoed
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Intro Section */}
            <section id="wat-is-het">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Wat is reiskostenvergoeding in de zorg?</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>
                  Reiskostenvergoeding is een tegemoetkoming van je werkgever in de kosten die je maakt om van je huis naar je werk te reizen (woon-werkverkeer) of voor reizen die je tijdens je werk maakt (dienstreizen).
                </p>
                <p>
                  In de zorgsector zijn deze vergoedingen vastgelegd in de Collectieve Arbeidsovereenkomst (CAO), zoals de <strong>CAO VVT</strong> (Verpleeg-, Verzorgingshuizen en Thuiszorg), de <strong>CAO Ziekenhuizen</strong> of de <strong>CAO Gehandicaptenzorg</strong>.
                </p>
              </div>
            </section>

            {/* Kilometervergoeding Section */}
            <section id="kilometervergoeding" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Coins className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Kilometervergoeding 2024 - 2026</h2>
              </div>
              
              <div className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 font-semibold text-slate-900">Periode</th>
                        <th className="p-4 font-semibold text-slate-900">Woon-werk (per km)</th>
                        <th className="p-4 font-semibold text-slate-900">Dienstreizen (per km)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-4 text-slate-600">2024</td>
                        <td className="p-4 font-medium text-slate-900">€ 0,17</td>
                        <td className="p-4 font-medium text-slate-900">€ 0,27</td>
                      </tr>
                      <tr className="bg-primary-50/30">
                        <td className="p-4 text-slate-600">2025 (Actueel)</td>
                        <td className="p-4 font-bold text-primary-600">€ 0,21</td>
                        <td className="p-4 font-medium text-slate-900">€ 0,27</td>
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-600">2026 (Verwacht)</td>
                        <td className="p-4 font-medium text-slate-900">€ 0,23</td>
                        <td className="p-4 font-medium text-slate-900">€ 0,27+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Let op:</strong> De belastingvrije voet is in 2024 verhoogd naar € 0,23 per kilometer. Alles wat je daarboven ontvangt wordt als loon belast.
                  </p>
                </div>
              </div>
            </section>

            {/* Public Transport Section */}
            <section id="openbaar-vervoer">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bus className="w-6 h-6 text-primary-600" />
                Openbaar Vervoer (OV)
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>
                  Reis je met de trein, bus, tram of metro? In de meeste zorg-CAO&apos;s wordt het openbaar vervoer <strong>volledig vergoed</strong> (100% vergoeding). 
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    Vergoeding op basis van 2e klas tarief.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    Kortste route van deur tot deur.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    Vaak via declaratie of een NS Business Card via de werkgever.
                  </li>
                </ul>
              </div>
            </section>

            {/* Calculation Example */}
            <section id="voorbeeld" className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calculator className="w-32 h-32 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-6">Rekenvoorbeeld</h2>
              <div className="space-y-4 relative z-10">
                <p className="text-slate-300 italic">
                  &quot;Stel: Je werkt als Verzorgende IG en woont 15 kilometer van je werkplek. Je werkt 4 dagen per week.&quot;
                </p>
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <div className="flex justify-between">
                    <span>Kilometers per dag (heen & terug):</span>
                    <span className="font-mono">30 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vergoeding per km (2025):</span>
                    <span className="font-mono">€ 0,21</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vergoeding per werkdag:</span>
                    <span className="font-mono text-primary-400">€ 6,30</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-2 border-t border-slate-700">
                    <span>Totaal per maand (18 dagen):</span>
                    <span className="text-primary-400">€ 113,40</span>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Veelgestelde vragen</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Direct Berekenen</h3>
              <div className="space-y-4">
                <Link 
                  href="/salaris-calculator"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5" />
                    <span className="font-semibold">Salaris</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/ort-calculator"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5" />
                    <span className="font-semibold">ORT Toeslag</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/vakantiegeld-berekenen"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">☀️</div>
                    <span className="font-semibold">Vakantiegeld</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-2 text-primary-700 font-bold mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Betrouwbaar</span>
                </div>
                <p className="text-sm text-primary-600 leading-relaxed">
                  Onze informatie is altijd gebaseerd op de meest actuele CAO-teksten en belastingregels voor zorgmedewerkers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Footer */}
      <section className="bg-slate-900 py-16 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Vragen over je salaris of vergoedingen?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Gebruik onze onafhankelijke rekentools om precies te zien waar je recht op hebt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/salaris-calculator"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-500/25"
            >
              Bereken Salaris
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
            >
              Stel een vraag
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
