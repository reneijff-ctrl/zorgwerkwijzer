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
  BarChart3,
  GraduationCap,
  Award
} from "lucide-react";

import RelatedVacancies from '@/components/RelatedVacancies';

export default function VerpleegkundigeSalarisPage() {
  const faqs = [
    {
      question: "Wat verdient een verpleegkundige gemiddeld in 2026?",
      answer: "In 2026 verdient een verpleegkundige in de VVT gemiddeld tussen de €3.325 (MBO, FWG 45) en €5.650 (HBO, FWG 55) bruto per maand op basis van een 36-urige werkweek. Dit is exclusief onregelmatigheidstoeslag (ORT) en vakantiegeld."
    },
    {
      question: "Wat is het verschil in salaris tussen MBO en HBO verpleegkundigen?",
      answer: "MBO verpleegkundigen (niveau 4) worden vaak ingeschaald in FWG 45 of FWG 50. HBO verpleegkundigen (niveau 6), vaak werkzaam als regieverpleegkundige, worden doorgaans ingeschaald in FWG 50 of FWG 55. Dit kan een verschil betekenen van enkele honderden tot meer dan duizend euro per maand."
    },
    {
      question: "In welke FWG schaal valt een verpleegkundige?",
      answer: "Conform de CAO VVT vallen verpleegkundigen meestal in FWG 45 (MBO), FWG 50 (ervaren MBO of startend HBO) of FWG 55 (HBO regieverpleegkundige). Gespecialiseerd verpleegkundigen kunnen soms in hogere schalen zoals FWG 60 vallen."
    },
    {
      question: "Hoeveel bedraagt de onregelmatigheidstoeslag (ORT)?",
      answer: "De ORT kan je maandsalaris aanzienlijk verhogen. Toeslagen variëren van 22% (avond) tot 60% (feestdagen). Voor een verpleegkundige die veel onregelmatig werkt, kan dit oplopen tot €400 - €700 extra bruto per maand."
    },
    {
      question: "Hoe hoog is de eindejaarsuitkering voor verpleegkundigen?",
      answer: "Verpleegkundigen in de VVT hebben recht op een eindejaarsuitkering van 8,33%. Dit staat gelijk aan een volledige dertiende maand en wordt meestal in december uitgekeerd."
    },
    {
      question: "Wat is het bruto uurloon van een verpleegkundige in 2026?",
      answer: "Het bruto uurloon van een verpleegkundige in 2026 ligt tussen de €21,30 en €36,20, afhankelijk van je opleidingsniveau en werkervaring binnen de CAO-schalen."
    },
    {
      question: "Zijn er doorgroeimogelijkheden voor verpleegkundigen?",
      answer: "Zeker. Je kunt je specialiseren (bijv. wondverpleegkundige, oncologie), doorgroeien naar regieverpleegkundige (HBO) of een managementfunctie ambiëren. Elke stap omhoog in verantwoordelijkheid betekent vaak ook een stap omhoog in FWG-schaal."
    },
    {
      question: "Waar kan ik mijn netto salaris berekenen?",
      answer: "Je kunt je volledige netto maandsalaris, inclusief ORT en vakantiegeld, berekenen via onze Salaris Calculator op deze website. Zo weet je precies wat je op je bankrekening kunt verwachten."
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
            "name": "Verpleegkundige Salaris",
            "item": "https://zorgwerkwijzer.nl/salaris/verpleegkundige"
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
            <span className="text-slate-900 font-medium">Verpleegkundige Salaris</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="h-4 w-4" />
                <span>Update: CAO VVT 2025/2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Verpleegkundige Salaris 2026: <span className="text-primary-600 underline decoration-primary-200 underline-offset-4">Wat Verdien Je?</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Ben je benieuwd naar het salaris van een verpleegkundige in de zorg? Of je nu MBO- of HBO-verpleegkundige bent, wij bieden je een actueel overzicht van de salarisschalen, ORT en doorgroeimogelijkheden conform de CAO VVT.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/salaris-calculator" className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center group">
                  Bereken je salaris
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#salarisschalen" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center">
                  Bekijk schalen
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 z-0" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Gemiddeld bruto</p>
                      <p className="text-2xl font-bold text-slate-900">€3.325 - €5.650</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <span className="text-slate-500">MBO (FWG 45)</span>
                      <span className="font-bold text-slate-700">€3.325+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <span className="text-slate-500">HBO (FWG 50/55)</span>
                      <span className="font-bold text-slate-700">€3.500+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Eindejaarsuitkering</span>
                      <span className="font-bold text-primary-600">8,33%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* 1. Intro Section */}
            <section id="intro">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Stethoscope className="h-8 w-8 text-primary-600 mr-3" />
                Hoeveel verdient een verpleegkundige?
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                  Als verpleegkundige vervul je een cruciale rol in de Nederlandse gezondheidszorg. Of je nu werkzaam bent in een verpleeghuis, de thuiszorg of de revalidatie (CAO VVT), je verantwoordelijkheid is groot. Gelukkig is de beloning in de afgelopen jaren fors gestegen.
                </p>
                <p>
                  Het salaris van een verpleegkundige hangt sterk af van je opleidingsniveau (MBO of HBO) en je werkervaring. Daarnaast spelen onregelmatigheidstoeslagen een enorme rol in wat je uiteindelijk op je bankrekening ontvangt.
                </p>
              </div>
            </section>

            {/* 2. MBO vs HBO Section */}
            <section id="opleiding" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 text-primary-600 mr-2" />
                MBO vs HBO Verpleegkundige
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-100 p-6 rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-900 mb-2">MBO Verpleegkundige</p>
                  <p className="text-sm text-slate-600 mb-4">Niveau 4. Focus op directe zorgverlening en coördinatie op de werkvloer.</p>
                  <div className="flex items-center text-primary-700 font-bold">
                    <span className="text-lg">FWG 45 / 50</span>
                  </div>
                </div>
                <div className="border border-slate-100 p-6 rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-900 mb-2">HBO Verpleegkundige</p>
                  <p className="text-sm text-slate-600 mb-4">Niveau 6. Vaak regierol, focus op kwaliteitsverbetering en complexe zorgvragen.</p>
                  <div className="flex items-center text-primary-700 font-bold">
                    <span className="text-lg">FWG 50 / 55</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Salarisschalen Section */}
            <section id="salarisschalen">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <BarChart3 className="h-8 w-8 text-primary-600 mr-3" />
                Salarisschalen CAO VVT 2026
              </h2>
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-4 font-bold text-slate-900 border-b border-slate-200">FWG Schaal</th>
                      <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Startsalaris</th>
                      <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Eindsalaris</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">FWG 45 (MBO)</td>
                      <td className="p-4 text-slate-600">€3.325</td>
                      <td className="p-4 text-slate-600">€4.625</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">FWG 50 (MBO/HBO)</td>
                      <td className="p-4 text-slate-600">€3.500</td>
                      <td className="p-4 text-slate-600">€5.215</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">FWG 55 (HBO)</td>
                      <td className="p-4 text-slate-600">€3.770</td>
                      <td className="p-4 text-slate-600">€5.650</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-slate-500 italic">
                * Bovenstaande bedragen zijn indicatieve schattingen voor 2026 op basis van de CAO VVT salarisverhogingen van 3,5% per juli 2026.
              </p>
            </section>

            {/* 4. Doorgroeimogelijkheden */}
            <section id="doorgroei" className="bg-primary-900 text-white p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full -mr-32 -mt-32 z-0 opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-white">
                  <Award className="h-8 w-8 mr-3" />
                  Doorgroeimogelijkheden
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Gespecialiseerd verpleegkundige:</span> Ontwikkel je in een specifiek vakgebied zoals dementie, oncologie of wondzorg.</p>
                    </div>
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Regieverpleegkundige:</span> Neem de regie over het zorgproces op de afdeling (HBO niveau).</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Praktijkopleider:</span> Begeleid de nieuwe generatie studenten en leerlingen.</p>
                    </div>
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Management:</span> Groei door naar teamleider of locatiemanager (FWG 60+).</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Related Vacancies */}
            <RelatedVacancies profession="Verpleegkundige" />

            {/* 5. FAQ Section */}
            <section id="faq">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <Info className="h-8 w-8 text-primary-600 mr-3" />
                Veelgestelde vragen over verpleegkundige salaris
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-primary-200 transition-colors">
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h4>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side: Sidebar */}
          <div className="space-y-8">
            {/* CTA Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Direct Berekenen</h3>
              <p className="text-sm text-slate-600 mb-6">
                Wil je weten wat je onder de streep overhoudt inclusief al je toeslagen?
              </p>
              <div className="space-y-3">
                <Link href="/salaris-calculator" className="w-full bg-primary-600 text-white p-4 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center group">
                  Salaris Calculator
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/ort-calculator" className="w-full bg-slate-100 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center">
                  ORT Calculator
                </Link>
                <Link href="/vakantiegeld-berekenen" className="w-full bg-slate-100 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center">
                  Vakantiegeld Tool
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-primary-600 mr-2" />
                  Andere functies
                </h4>
                <div className="space-y-2">
                  <Link href="/salaris/helpende-plus" className="block text-slate-600 hover:text-primary-600 text-sm py-1 font-medium transition-colors">• Helpende Plus Salaris</Link>
                  <Link href="/salaris/verzorgende-ig" className="block text-slate-600 hover:text-primary-600 text-sm py-1 font-medium transition-colors">• Verzorgende IG Salaris</Link>
                  <Link href="/cao-vvt" className="block text-slate-600 hover:text-primary-600 text-sm py-1 font-medium transition-colors">• Alles over CAO VVT</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
