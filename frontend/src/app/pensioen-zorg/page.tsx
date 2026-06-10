'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PiggyBank, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Calculator, 
  TrendingUp,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

export default function PensionPage() {
  const faqItems = [
    {
      question: "Wat is PFZW?",
      answer: "PFZW staat voor Pensioenfonds Zorg en Welzijn. Het is het pensioenfonds voor de sector zorg en welzijn in Nederland. Bijna iedereen die in de zorg werkt, van verpleegkundigen tot maatschappelijk werkers, bouwt hier pensioen op."
    },
    {
      question: "Hoeveel pensioenpremie betaal ik in 2026?",
      answer: "In 2026 is de totale pensioenpremie bij PFZW vastgesteld op 25,9% van de pensioengrondslag. Meestal wordt deze premie 50/50 verdeeld tussen werkgever en werknemer, wat betekent dat je als werknemer ongeveer 12,95% betaalt."
    },
    {
      question: "Wat is de AOW-franchise?",
      answer: "De franchise is het deel van je salaris waarover je geen pensioen opbouwt, omdat je later ook een AOW-uitkering van de overheid krijgt. In 2026 bedraagt de AOW-franchise bij PFZW € 17.283."
    },
    {
      question: "Bouw ik ook pensioen op over mijn ORT?",
      answer: "Ja, in de meeste zorg-CAO's (zoals de CAO VVT) telt de onregelmatigheidstoeslag mee voor je pensioengevend salaris. Dit betekent dat je door onregelmatig te werken ook extra pensioen opbouwt."
    },
    {
      question: "Wanneer gaat de nieuwe pensioenwet in?",
      answer: "PFZW streeft ernaar om de nieuwe pensioenregeling per 1 januari 2026 te laten ingaan. Dit is onderdeel van de landelijke Wet toekomst pensioenen."
    },
    {
      question: "Wat gebeurt er met mijn pensioen als ik van baan wissel?",
      answer: "Als je binnen de sector zorg en welzijn blijft, blijf je gewoon pensioen opbouwen bij PFZW. Wissel je naar een andere sector? Dan kun je vaak je opgebouwde pensioen meenemen naar je nieuwe pensioenfonds (waardeoverdracht)."
    },
    {
      question: "Betaalt mijn werkgever ook mee aan mijn pensioen?",
      answer: "Zeker! In de zorg is het gebruikelijk dat de werkgever ongeveer de helft van de totale pensioenpremie betaalt. Dit is een belangrijke secundaire arbeidsvoorwaarde."
    },
    {
      question: "Waar kan ik zien hoeveel pensioen ik heb opgebouwd?",
      answer: "Je kunt je actuele pensioenopbouw altijd inzien op de website van PFZW via &apos;Mijn PFZW&apos; of op mijnpensioenoverzicht.nl."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
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
        "item": "https://www.zorgwerkwijzer.nl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Pensioen Zorg",
        "item": "https://www.zorgwerkwijzer.nl/pensioen-zorg"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-6">
              <PiggyBank className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Pensioen in de Zorg: <span className="text-emerald-600">Alles over PFZW</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Als zorgmedewerker bouw je een belangrijk deel van je toekomstige inkomen op via PFZW. 
              Ontdek hoe de premieverdeling werkt, wat je zelf inlegt en wat je werkgever bijdraagt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/salaris-calculator" className="btn-primary flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Bereken je Salaris
              </Link>
              <Link href="/cao-vvt" className="btn-secondary flex items-center gap-2">
                <Info className="w-5 h-5" />
                CAO Informatie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500 text-sm font-medium mb-1">Totale Premie 2026</p>
                <p className="text-3xl font-bold text-slate-900">25,9%</p>
                <p className="text-xs text-slate-400 mt-2">van de pensioengrondslag</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500 text-sm font-medium mb-1">Jouw Inleg</p>
                <p className="text-3xl font-bold text-emerald-600">50%</p>
                <p className="text-xs text-slate-400 mt-2">meestal 12,95% bruto</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500 text-sm font-medium mb-1">AOW-Franchise</p>
                <p className="text-3xl font-bold text-slate-900">€ 17.283</p>
                <p className="text-xs text-slate-400 mt-2">vrijgesteld deel (2026)</p>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-emerald-500" />
                Hoe werkt pensioenopbouw in de zorg?
              </h2>
              <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                <p>
                  In de zorgsector is de pensioenregeling ondergebracht bij <strong>PFZW (Pensioenfonds Zorg en Welzijn)</strong>. 
                  Samen met je werkgever leg je elke maand een bedrag opzij voor later. Dit wordt automatisch ingehouden op je brutosalaris.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-500" />
                      Jouw bijdrage (Werknemer)
                    </h3>
                    <p className="text-base">
                      Je betaalt ongeveer de helft van de totale premie. Omdat dit van je brutosalaris afgaat, betaal je hierdoor minder inkomstenbelasting. 
                      Dit noemen we het werknemersdeel.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-500" />
                      Werkgeversbijdrage
                    </h3>
                    <p className="text-base">
                      Je werkgever betaalt de andere helft. Dit is eigenlijk &apos;extra&apos; salaris dat direct in je pensioenpot wordt gestort. 
                      Dit maakt pensioenopbouw in loondienst zeer aantrekkelijk.
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-6 rounded-r-xl">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Wat is de Pensioengrondslag?
                  </h4>
                  <p className="text-emerald-800 text-base">
                    Je betaalt niet over je hele salaris premie. Er is een drempelbedrag (de franchise) dat wordt afgetrokken van je jaarsalaris. 
                    Het bedrag dat overblijft is de pensioengrondslag. Hierover wordt de 25,9% premie berekend.
                  </p>
                </div>
              </div>
            </div>

            {/* PFZW Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  Zekerheid via PFZW
                </h3>
                <p className="text-slate-600 mb-6">
                  PFZW is een van de grootste pensioenfondsen van Nederland. Zij beheren het vermogen van miljoenen (oud-)zorgmedewerkers. 
                  Naast ouderdomspensioen regelt PFZW ook:
                </p>
                <ul className="space-y-3">
                  {[
                    "Partnerpensioen bij overlijden",
                    "Wezenpensioen voor je kinderen",
                    "Arbeidsongeschiktheidspensioen",
                    "Premievrije opbouw bij ziekte"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-200">
                <h3 className="text-2xl font-bold mb-4">Wist je dat?</h3>
                <p className="mb-6 opacity-90 leading-relaxed">
                  In de nieuwe pensioenregeling (vanaf 2026) krijg je een nog duidelijker inzicht in je persoonlijke pensioenpot. 
                  Het rendement van de beleggingen wordt directer zichtbaar in je eigen opgebouwde vermogen.
                </p>
                <Link href="https://www.pfzw.nl" target="_blank" className="inline-flex items-center gap-2 font-bold hover:underline">
                  Bezoek de website van PFZW
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-emerald-500" />
                Veelgestelde vragen over pensioen
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">{item.question}</h3>
                    <p className="text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Navigation */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">Bekijk je salaris per functie</h2>
                <p className="text-slate-400 mb-8 max-w-2xl text-lg">
                  Benieuwd hoe jouw pensioenopbouw eruitziet bij een specifiek salaris? Bekijk onze uitgebreide salarisgidsen voor populaire zorgfuncties.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link href="/salaris/helpende-plus" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors border border-white/10 flex items-center justify-between group">
                    <span>Helpende Plus</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/salaris/verzorgende-ig" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors border border-white/10 flex items-center justify-between group">
                    <span>Verzorgende IG</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/salaris/verpleegkundige" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors border border-white/10 flex items-center justify-between group">
                    <span>Verpleegkundige</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32"></div>
            </div>

            {/* Internal Linking Footer */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-12">
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Andere Handige Tools</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/ort-calculator" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      ORT Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/vakantiegeld-berekenen" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Vakantiegeld Berekenen
                    </Link>
                  </li>
                  <li>
                    <Link href="/eindejaarsuitkering-berekenen" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Eindejaarsuitkering Calculator
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Meer Informatie</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/fwg-uitleg" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Uitleg over FWG Schalen
                    </Link>
                  </li>
                  <li>
                    <Link href="/reiskostenvergoeding-zorg" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Reiskosten in de Zorg
                    </Link>
                  </li>
                  <li>
                    <Link href="/over-ons" className="text-emerald-600 hover:underline flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Over Zorgwerkwijzer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
