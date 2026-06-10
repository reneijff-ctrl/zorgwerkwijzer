"use client";

import Link from "next/link";
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  Info,
  CheckCircle2,
  Stethoscope,
  Heart,
  BarChart3
} from "lucide-react";

import RelatedVacancies from '@/components/RelatedVacancies';

export default function VerzorgendeIGSalarisPage() {
  const faqs = [
    {
      question: "Wat verdient een Verzorgende IG gemiddeld in 2026?",
      answer: "Een Verzorgende IG verdient in 2026 gemiddeld tussen de €2.880 en €3.825 bruto per maand op basis van een fulltime dienstverband (36 uur). Dit is afhankelijk van werkervaring en de specifieke inschaling in de CAO."
    },
    {
      question: "In welke salarisschaal valt een Verzorgende IG?",
      answer: "In de CAO VVT wordt een Verzorgende IG vrijwel altijd ingeschaald in FWG 40. Sommige gespecialiseerde rollen of verzorgenden met extra verantwoordelijkheden kunnen in FWG 45 vallen."
    },
    {
      question: "Wat is het uurloon van een Verzorgende IG?",
      answer: "Het uurloon van een Verzorgende IG ligt in 2026 tussen de €18,40 en €24,50 bruto. Dit bedrag is exclusief onregelmatigheidstoeslag (ORT), vakantiegeld en de eindejaarsuitkering."
    },
    {
      question: "Hoeveel vakantiegeld krijgt een Verzorgende IG?",
      answer: "Een Verzorgende IG heeft recht op 8% vakantiebijslag over het bruto jaarsalaris. Daarnaast ontvang je in de zorg een eindejaarsuitkering van 8,33%."
    },
    {
      question: "Hoe hoog is de onregelmatigheidstoeslag (ORT) voor een Verzorgende IG?",
      answer: "De ORT is een percentage bovenop je uurloon voor diensten buiten kantoortijden. Dit varieert van 22% voor avonddiensten tot 60% voor werken op feestdagen. Voor veel Verzorgenden IG betekent dit honderden euro's extra per maand."
    },
    {
      question: "Krijgt een Verzorgende IG een dertiende maand?",
      answer: "Ja, in de CAO VVT is een eindejaarsuitkering van 8,33% vastgelegd, wat overeenkomt met een volledige dertiende maand. Dit wordt meestal in december uitgekeerd."
    },
    {
      question: "Wat is het verschil tussen FWG 35 en FWG 40?",
      answer: "FWG 35 wordt vaak gebruikt voor Helpenden of beginnend verzorgenden. Voor een gediplomeerd Verzorgende IG is FWG 40 de standaard schaal, wat een hoger start- en eindsalaris betekent."
    },
    {
      question: "Hoe kan ik mijn netto salaris berekenen?",
      answer: "Je kunt je exacte netto salaris inclusief toeslagen berekenen via onze Salaris Calculator op deze website. Hiermee zie je direct wat er onder de streep overblijft."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
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
            "name": "Salaris",
            "item": "https://zorgwerkwijzer.nl/salaris-calculator"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Verzorgende IG Salaris",
            "item": "https://zorgwerkwijzer.nl/salaris/verzorgende-ig"
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex mb-8 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 self-center" />
            <span className="text-slate-900 font-medium">Verzorgende IG Salaris</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Stethoscope className="h-4 w-4" />
                <span>Beroepsprofiel Zorg</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Salaris Verzorgende IG <span className="text-primary-600">2026</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Benieuwd wat je verdient als Verzorgende IG? In 2026 stijgen de salarissen in de zorg opnieuw. Ontdek de actuele schalen, uurlonen en bereken direct je totale inkomen inclusief ORT.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/salaris-calculator"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary-200 flex items-center group"
                >
                  Bereken je netto salaris
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/ort-calculator"
                  className="bg-white border-2 border-slate-200 hover:border-primary-600 text-slate-700 hover:text-primary-600 px-8 py-4 rounded-xl font-bold transition-all flex items-center"
                >
                  ORT berekenen
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl md:w-80 shrink-0 transform md:rotate-2">
              <div className="text-primary-100 text-sm font-bold uppercase tracking-wider mb-2">Gemiddeld Bruto</div>
              <div className="text-4xl font-black mb-1">€3.350</div>
              <div className="text-primary-100 text-sm mb-6">per maand (36u)</div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-t border-white/20 pt-4">
                  <span>CAO VVT</span>
                  <span className="font-bold">FWG 40</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Uurloon (max)</span>
                  <span className="font-bold">€24,45</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Vakantiegeld</span>
                  <span className="font-bold">8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Maandsalaris</div>
              <div className="text-lg font-bold text-slate-900">€2.881 - €3.824</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Uurloon</div>
              <div className="text-lg font-bold text-slate-900">€18,41 - €24,45</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Groei in 2026</div>
              <div className="text-lg font-bold text-slate-900">+3,5% CAO</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Intro */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Info className="h-8 w-8 text-primary-500 mr-3" />
                Wat verdient een Verzorgende IG?
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p className="mb-4">
                  Als <strong>Verzorgende Individuele Gezondheidszorg (IG)</strong> vervul je een cruciale rol in de Nederlandse gezondheidszorg. Je bent verantwoordelijk voor de dagelijkse verzorging en verpleegtechnische handelingen bij cliënten thuis of in een instelling.
                </p>
                <p className="mb-4">
                  Het salaris van een Verzorgende IG is in 2026 verder gestegen door afspraken in de <strong>CAO VVT</strong> (Verpleeg-, Verzorgingshuizen en Thuiszorg). Naast het basissalaris heb je in deze functie vaak recht op aanzienlijke toeslagen vanwege onregelmatige werktijden.
                </p>
              </div>
            </section>

            {/* Salary Scales */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Salarisschalen CAO VVT (FWG 40)</h2>
              <p className="text-slate-600 mb-6">
                De meeste Verzorgenden IG zijn ingedeeld in <strong>FWG 40</strong>. Hieronder zie je een indicatie van de treden binnen deze schaal voor 2026:
              </p>
              
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-sm font-bold text-slate-900">Trede</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-900">Bruto Maand</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-900">Uurloon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr>
                      <td className="px-6 py-4">Start (Trede 0)</td>
                      <td className="px-6 py-4 font-medium text-slate-900">€2.881,14</td>
                      <td className="px-6 py-4">€18,41</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Trede 5</td>
                      <td className="px-6 py-4 font-medium text-slate-900">€3.294,84</td>
                      <td className="px-6 py-4">€21,05</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Maximum (Trede 10)</td>
                      <td className="px-6 py-4 font-medium text-slate-900">€3.824,58</td>
                      <td className="px-6 py-4">€24,45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-slate-500 italic">
                * Bedragen op basis van 36-urige werkweek conform CAO VVT per 1 januari 2026.
              </p>
            </section>

            {/* Benefits List */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-2" />
                Extra arbeidsvoorwaarden
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "8% Vakantiegeld (mei)",
                  "8,33% Eindejaarsuitkering (dec)",
                  "Onregelmatigheidstoeslag (tot 60%)",
                  "Reiskostenvergoeding (€0,21/km in 2026)",
                  "Pensioenopbouw bij PFZW",
                  "Fietsplan & sportbudget"
                ].map((item, i) => (
                  <div key={i} className="flex items-center p-4 bg-white rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Related Vacancies */}
            <RelatedVacancies profession="Verzorgende IG" />

            {/* FAQ Section */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Veelgestelde vragen</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.question}</h3>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / CTA Cards */}
          <div className="space-y-6">
            <div className="bg-primary-600 rounded-3xl p-8 text-white sticky top-24">
              <Heart className="h-12 w-12 text-primary-200 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Bereken direct je inkomen</h3>
              <p className="text-primary-100 mb-8 leading-relaxed">
                Wil je precies weten hoeveel je netto overhoudt inclusief al je onregelmatigheidstoeslagen?
              </p>
              <div className="space-y-3">
                <Link 
                  href="/salaris-calculator"
                  className="block w-full bg-white text-primary-600 text-center py-4 rounded-xl font-bold hover:bg-primary-50 transition-colors"
                >
                  Salaris Calculator
                </Link>
                <Link 
                  href="/ort-calculator"
                  className="block w-full bg-primary-700 text-white text-center py-4 rounded-xl font-bold hover:bg-primary-800 transition-colors"
                >
                  ORT Calculator
                </Link>
                <Link 
                  href="/vakantiegeld-berekenen"
                  className="block w-full border border-primary-400 text-white text-center py-4 rounded-xl font-bold hover:bg-primary-500 transition-colors"
                >
                  Vakantiegeld
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-primary-500 mr-2" />
                Andere salarissen
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/salaris/helpende-plus" className="text-slate-600 hover:text-primary-600 flex items-center justify-between group">
                    <span>Helpende Plus</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/cao-vvt" className="text-slate-600 hover:text-primary-600 flex items-center justify-between group border-t border-slate-100 pt-3">
                    <span>CAO VVT Informatie</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
