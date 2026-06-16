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

export default function DoktersassistentSalarisPage() {
  const faqs = [
    {
      question: "Wat verdient een doktersassistent gemiddeld in 2026?",
      answer: "In 2026 verdient een doktersassistent in de huisartsenzorg gemiddeld tussen de €2.805 (schaal 4, start) en €4.365 (schaal 5, ervaren) bruto per maand op basis van een 38-urige werkweek. Dit is exclusief vakantiegeld en eventuele toeslagen."
    },
    {
      question: "In welke schaal valt een doktersassistent?",
      answer: "Doktersassistenten worden ingedeeld op basis van het FWHZ-systeem. Meestal vallen zij in Schaal 4 (basis) of Schaal 5 (allround/ervaren). Gespecialiseerde assistenten of degenen met extra taken zoals Spreekuurondersteuner Huisarts (SOH) kunnen in Schaal 6 vallen."
    },
    {
      question: "Hoeveel bedraagt de salarisverhoging in 2026 voor de huisartsenzorg?",
      answer: "Conform de CAO Huisartsenzorg 2025-2027 stijgen de salarissen structureel met 3% per 1 juli 2026. Eerder is er al een verhoging van 3% op 1 november 2025."
    },
    {
      question: "Krijgt een doktersassistent onregelmatigheidstoeslag (ORT)?",
      answer: "Ja, in de huisartsenzorg (met name bij huisartsenposten) heb je recht op ANW-toeslag voor uren buiten kantoortijden. Deze toeslagen variëren vaak tussen de 30% en 100% afhankelijk van het tijdstip en de dag."
    },
    {
      question: "Hoe hoog is de eindejaarsuitkering (EJU)?",
      answer: "In de CAO Huisartsenzorg is een eindejaarsuitkering van 8,33% opgenomen, wat overeenkomt met een dertiende maand. Dit wordt doorgaans in december uitgekeerd."
    },
    {
      question: "Wat is het bruto uurloon van een doktersassistent in 2026?",
      answer: "Het bruto uurloon van een doktersassistent in 2026 ligt ongeveer tussen de €17,00 en €26,50, afhankelijk van de trede en de schaal waarin je bent ingedeeld."
    },
    {
      question: "Kan ik doorgroeien als doktersassistent?",
      answer: "Zeker. Je kunt je specialiseren als Spreekuurondersteuner Huisarts (SOH), triage-expert op de HAP, of doorgroeien naar een rol als Praktijkmanager of Praktijkondersteuner (POH) na aanvullende scholing."
    },
    {
      question: "Waar kan ik mijn netto salaris berekenen?",
      answer: "Je kunt je volledige netto maandsalaris, inclusief toeslagen en vakantiegeld, berekenen via onze Salaris Calculator op deze website. Zo krijg je een accuraat beeld van je besteedbaar inkomen."
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
            "name": "Doktersassistent Salaris",
            "item": "https://zorgwerkwijzer.nl/salaris/doktersassistent"
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
            <span className="text-slate-900 font-medium">Doktersassistent Salaris</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="h-4 w-4" />
                <span>Update: CAO Huisartsenzorg 2025-2027</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Doktersassistent Salaris 2026: <span className="text-primary-600 underline decoration-primary-200 underline-offset-4">Wat Verdien Je?</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Ben je benieuwd naar het salaris van een doktersassistent in de huisartsenzorg? Wij bieden je een actueel overzicht van de salarisschalen, CAO-afspraken en doorgroeimogelijkheden voor 2026.
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
                      <p className="text-2xl font-bold text-slate-900">€2.805 - €4.365</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Schaal 4 (Basis)</span>
                      <span className="font-bold text-slate-700">€2.805+</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <span className="text-slate-500">Schaal 5 (Allround)</span>
                      <span className="font-bold text-slate-700">€2.950+</span>
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
                Hoeveel verdient een doktersassistent?
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                  Als doktersassistent ben je het eerste aanspreekpunt in de huisartsenpraktijk. Je taken variëren van triage en administratie tot medisch-technische handelingen. In de CAO Huisartsenzorg zijn duidelijke afspraken gemaakt over je beloning, die in 2026 verder stijgt.
                </p>
                <p>
                  Het salaris wordt bepaald door de Functiewaardering Huisartsenzorg (FWHZ). De meeste assistenten worden ingeschaald in Schaal 4 of Schaal 5. Naast je basissalaris heb je recht op diverse toeslagen, zeker als je werkzaam bent op een huisartsenpost (HAP).
                </p>
              </div>
            </section>

            {/* 2. Schalen Section */}
            <section id="schalen" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 text-primary-600 mr-2" />
                Inschaling en Functieniveaus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-100 p-6 rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-900 mb-2">Schaal 4</p>
                  <p className="text-sm text-slate-600 mb-4">Voor startende doktersassistenten of assistenten met een afgebakend takenpakket.</p>
                  <div className="flex items-center text-primary-700 font-bold">
                    <span className="text-lg">FWHZ Schaal 4</span>
                  </div>
                </div>
                <div className="border border-slate-100 p-6 rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-900 mb-2">Schaal 5</p>
                  <p className="text-sm text-slate-600 mb-4">De standaard schaal voor allround, ervaren doktersassistenten in een huisartsenpraktijk.</p>
                  <div className="flex items-center text-primary-700 font-bold">
                    <span className="text-lg">FWHZ Schaal 5</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Salarisschalen Section */}
            <section id="salarisschalen">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <BarChart3 className="h-8 w-8 text-primary-600 mr-3" />
                Salaristabellen CAO Huisartsenzorg 2026
              </h2>
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Schaal</th>
                      <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Start (bruto)</th>
                      <th className="p-4 font-bold text-slate-900 border-b border-slate-200">Maximum (bruto)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">Schaal 4</td>
                      <td className="p-4 text-slate-600">€2.805</td>
                      <td className="p-4 text-slate-600">€3.755</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">Schaal 5</td>
                      <td className="p-4 text-slate-600">€2.950</td>
                      <td className="p-4 text-slate-600">€4.365</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">Schaal 6</td>
                      <td className="p-4 text-slate-600">€3.145</td>
                      <td className="p-4 text-slate-600">€4.650</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-slate-500 italic">
                * Bedragen zijn indicatief voor juli 2026 op basis van 38 uur per week, inclusief de afgesproken structurele loonsverhogingen.
              </p>
            </section>

            {/* 4. Doorgroeimogelijkheden */}
            <section id="doorgroei" className="bg-primary-900 text-white p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full -mr-32 -mt-32 z-0 opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-white">
                  <Award className="h-8 w-8 mr-3" />
                  Carrière en Doorgroei
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Spreekuurondersteuner (SOH):</span> Voer zelfstandig spreekuren uit voor veelvoorkomende klachten (Schaal 6).</p>
                    </div>
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Triage-expert:</span> Specialiseer je in complexe triage op de huisartsenpost.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Praktijkondersteuner (POH):</span> Groei door naar POH-S of POH-GGZ na aanvullende opleiding.</p>
                    </div>
                    <div className="flex items-start space-x-3 text-primary-100">
                      <CheckCircle2 className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0" />
                      <p><span className="font-bold text-white">Praktijkmanager:</span> Neem de zakelijke en organisatorische leiding van de praktijk op je.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Related Vacancies */}
            <RelatedVacancies profession="Doktersassistent" />

            {/* 5. FAQ Section */}
            <section id="faq">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <Info className="h-8 w-8 text-primary-600 mr-3" />
                Veelgestelde vragen over doktersassistent salaris
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
                Wil je precies weten wat je netto overhoudt in de huisartsenzorg?
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
                  <Link href="/salaris/verpleegkundige" className="block text-slate-600 hover:text-primary-600 text-sm py-1 font-medium transition-colors">• Verpleegkundige Salaris</Link>
                  <Link href="/salaris/verzorgende-ig" className="block text-slate-600 hover:text-primary-600 text-sm py-1 font-medium transition-colors">• Verzorgende IG Salaris</Link>
                  <Link href="/salaris/helpende-plus" className="block text-slate-600 hover:text-primary-600 text-sm py-1 font-medium transition-colors">• Helpende Plus Salaris</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
