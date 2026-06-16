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
  Heart
} from "lucide-react";

import RelatedVacancies from '@/components/RelatedVacancies';

export default function HelpendePlusSalarisPage() {
  const faqs = [
    {
      question: "Wat verdient een Helpende Plus gemiddeld in 2026?",
      answer: "Een Helpende Plus verdient in 2026 gemiddeld tussen de €2.450 en €3.200 bruto per maand op basis van een fulltime dienstverband (36 uur). Dit is afhankelijk van werkervaring en de specifieke CAO."
    },
    {
      question: "In welke salarisschaal valt een Helpende Plus?",
      answer: "In de CAO VVT valt een Helpende Plus meestal in FWG 30. Sommige organisaties schalen een Helpende Plus in FWG 35 in als er sprake is van extra complexe taken of veel verantwoordelijkheid."
    },
    {
      question: "Wat is het uurloon van een Helpende Plus?",
      answer: "Het uurloon van een Helpende Plus ligt in 2026 tussen de €15,70 en €20,50 bruto. Dit bedrag is exclusief onregelmatigheidstoeslag (ORT), vakantiegeld en eindejaarsuitkering."
    },
    {
      question: "Hoeveel vakantiegeld krijgt een Helpende Plus?",
      answer: "Net als andere zorgmedewerkers ontvangt een Helpende Plus 8% vakantiebijslag over het bruto jaarsalaris. Dit wordt meestal in mei uitbetaald."
    },
    {
      question: "Wat is de impact van onregelmatigheidstoeslag (ORT) op het salaris?",
      answer: "De ORT kan het netto salaris van een Helpende Plus flink verhogen, vaak met 10% tot 20% extra, afhankelijk van het aantal avond-, nacht- en weekenddiensten."
    },
    {
      question: "Krijgt een Helpende Plus ook een eindejaarsuitkering?",
      answer: "Ja, volgens de CAO VVT heeft een Helpende Plus recht op een eindejaarsuitkering van 8,33% van het bruto jaarsalaris, wat gelijk staat aan een volledige 13e maand."
    },
    {
      question: "Hoe kan ik mijn netto salaris als Helpende Plus berekenen?",
      answer: "Je kunt je netto salaris berekenen door je bruto salaris in te vullen in onze Salaris Calculator. Houd er rekening mee dat pensioenpremies en belastingen per persoon kunnen verschillen."
    },
    {
      question: "Groeit het salaris van een Helpende Plus elk jaar?",
      answer: "Ja, binnen je salarisschaal (meestal FWG 30) groei je elk jaar een 'stap' of periodiek totdat je het maximum van de schaal hebt bereikt. Daarnaast zijn er vaak jaarlijkse CAO-loonsverhogingen."
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
            "name": "Helpende Plus Salaris",
            "item": "https://zorgwerkwijzer.nl/salaris/helpende-plus"
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
            <span className="text-slate-900 font-medium">Helpende Plus Salaris</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Stethoscope className="h-4 w-4" />
                <span>Beroepsgids 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Helpende Plus Salaris 2026: <span className="text-primary-600">Wat verdien je echt?</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Als Helpende Plus speel je een cruciale rol in de zorg. Maar wat staat daar tegenover op je loonstrook? Ontdek alles over salarisschalen, uurloon en toeslagen in de CAO VVT.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/salaris-calculator" className="btn-primary flex items-center">
                  Bereken je netto salaris <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-primary-50 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
                <Wallet className="h-32 w-32 text-primary-500 relative z-10 opacity-20" />
                <div className="mt-4 relative z-10">
                  <div className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-1">Indicatie 2026</div>
                  <div className="text-3xl font-black text-slate-900">€2.450 - €3.200</div>
                  <div className="text-slate-500 text-sm">per maand (bruto)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {/* Section: Intro */}
          <section id="intro">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Wat verdient een Helpende Plus?</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
              <p>
                Het salaris van een Helpende Plus in Nederland is grotendeels vastgelegd in collectieve arbeidsovereenkomsten (CAO&apos;s). Voor de meeste medewerkers in deze functie is de <strong>CAO VVT</strong> (Verpleeg-, Verzorgingshuizen en Thuiszorg) van toepassing.
              </p>
              <p>
                Een Helpende Plus voert meer handelingen uit dan een reguliere Helpende, zoals het verstrekken van medicatie. Deze extra verantwoordelijkheid zie je vaak terug in de inschaling of snellere groei binnen de salarisschalen.
              </p>
            </div>
          </section>

          {/* Section: Average Salary Stats */}
          <section id="gemiddeld-salaris" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-l-4 border-primary-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-bold text-slate-900">Maandsalaris</h3>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">€2.457 - €3.176</div>
              <p className="text-sm text-slate-500">Bruto per maand (36 uur)</p>
            </div>
            <div className="card border-l-4 border-blue-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900">Uurloon</h3>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">€15,75 - €20,36</div>
              <p className="text-sm text-slate-500">Bruto per uur</p>
            </div>
          </section>

          {/* Section: Salary Scales */}
          <section id="salarisschalen">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Salarisschalen CAO VVT</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-700">
                    <th className="px-6 py-4">Schaal (FWG)</th>
                    <th className="px-6 py-4 text-right">Minimum (Bruto)</th>
                    <th className="px-6 py-4 text-right">Maximum (Bruto)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">FWG 30</td>
                    <td className="px-6 py-4 text-right">€2.457,12</td>
                    <td className="px-6 py-4 text-right">€3.176,57</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">FWG 35*</td>
                    <td className="px-6 py-4 text-right">€2.580,45</td>
                    <td className="px-6 py-4 text-right">€3.486,21</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 text-xs text-slate-500 italic">
                *FWG 35 wordt soms toegepast bij verzwaarde functies of specifieke afdelingen.
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-2 text-sm text-slate-500">
              <Info className="h-4 w-4 mt-0.5 text-primary-500" />
              <p>Elk jaar groei je een stap (periodiek) binnen je schaal tot je het maximum hebt bereikt.</p>
            </div>
          </section>

          {/* Section: Extra benefits */}
          <section id="extra-inkomen" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Extra inkomsten bovenop je basissalaris</h2>
            <p className="text-slate-600 mb-8">
              In de zorg is je basissalaris slechts een deel van je totale inkomen. Als Helpende Plus heb je recht op diverse extra&apos;s:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">8,33% Eindejaarsuitkering</h4>
                  <p className="text-sm text-slate-500">Een volledige 13e maand die in november/december wordt uitbetaald.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">8% Vakantiegeld</h4>
                  <p className="text-sm text-slate-500">Opgebouwd over je brutoloon en uitbetaald in mei.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Reiskostenvergoeding</h4>
                  <p className="text-sm text-slate-500">Conform CAO afspraken voor woon-werkverkeer.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Fietsplan &amp; Extra&apos;s</h4>
                  <p className="text-sm text-slate-500">Veel werkgevers bieden fiscale voordelen voor fietsen of sporten.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Related Vacancies */}
          <RelatedVacancies profession="Helpende Plus" />

          {/* Section: FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Veelgestelde vragen</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card p-6 bg-white hover:border-primary-200 transition-colors">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* ORT Promotion Card */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Bereken je ORT</h3>
              <p className="text-blue-100 mb-8">
                Wist je dat onregelmatigheidstoeslag (ORT) je salaris met honderden euro&apos;s kan verhogen?
              </p>
              <Link href="/ort-calculator" className="inline-flex items-center justify-center w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-50 transition-colors">
                ORT Calculator <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Tools Links */}
          <div className="card p-8">
            <h3 className="font-bold text-slate-900 mb-6">Handige tools</h3>
            <div className="space-y-4">
              <Link href="/vakantiegeld-berekenen" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-slate-700 font-medium group-hover:text-primary-600">Vakantiegeld berekenen</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </Link>
              <Link href="/salaris-calculator" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-slate-700 font-medium group-hover:text-primary-600">Netto salaris berekenen</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </Link>
              <Link href="/cao-vvt" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-slate-700 font-medium group-hover:text-primary-600">CAO VVT Informatie</span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
              </Link>
            </div>
          </div>

          {/* Quick info card */}
          <div className="bg-primary-50 border border-primary-100 p-8 rounded-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-6 w-6 text-primary-500" />
              <h3 className="font-bold text-slate-900 text-lg">Wist je dat?</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Het verschil tussen een Helpende en een Helpende Plus zit hem in de <strong>&apos;Plus&apos;</strong>: de bevoegdheid om bepaalde verpleegtechnische handelingen uit te voeren, zoals het toedienen van medicatie of insuline.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
