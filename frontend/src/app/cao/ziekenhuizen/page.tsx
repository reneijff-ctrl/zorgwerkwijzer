'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Clock, 
  Car, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Calendar,
  PiggyBank,
  Heart,
  HelpCircle,
  FileText
} from 'lucide-react'

export default function CaoZiekenhuizenPage() {
  const faqItems = [
    {
      question: "Hoeveel loonsverhoging krijgen we in de CAO Ziekenhuizen in 2025 en 2026?",
      answer: "In de CAO Ziekenhuizen 2025-2027 is een totale loonsverhoging van 8% afgesproken. Dit gebeurt in vier stappen van 2%: per 1 februari 2025, 1 augustus 2025, 1 februari 2026 en 1 augustus 2026."
    },
    {
      question: "Wat zijn de ORT-percentages in de CAO Ziekenhuizen?",
      answer: "De ORT bedraagt 22% voor diensten op maandag t/m vrijdag tussen 20:00 en 06:00 uur. Voor de zaterdag geldt nu 38% over de gehele dag (sinds mei 2025). Op zon- en feestdagen ontvang je 60% onregelmatigheidstoeslag."
    },
    {
      question: "Hoe hoog is de reiskostenvergoeding?",
      answer: "De reiskostenvergoeding voor woon-werkverkeer stijgt per 1 juni 2025 naar 18 cent per kilometer en per 1 februari 2026 naar 21 cent per kilometer, met een maximum van 35 kilometer enkele reis."
    },
    {
      question: "Heb ik recht op een eindejaarsuitkering?",
      answer: "Ja, in de CAO Ziekenhuizen heb je recht op een eindejaarsuitkering van 8,33% van je jaarsalaris. Dit komt overeen met een volledig 13e maand."
    },
    {
      question: "Hoeveel vakantiegeld krijg ik?",
      answer: "Het vakantiegeld in de ziekenhuiszorg bedraagt 8% van je bruto jaarsalaris en wordt doorgaans in mei uitbetaald."
    },
    {
      question: "Wat is het balansverlof?",
      answer: "Balansverlof is een nieuwe regeling waarmee werknemers tot 100 keer hun wekelijkse arbeidsduur aan verlof kunnen sparen om later in hun loopbaan tijdelijk minder of niet te werken."
    },
    {
      question: "Wat is de stagevergoeding voor coassistenten?",
      answer: "Coassistenten ontvangen vanaf 1 februari 2025 een stagevergoeding van €150 per maand, bovenop de bestaande onkostenvergoeding van maximaal €150."
    },
    {
      question: "Waar bouw ik pensioen op?",
      answer: "Medewerkers onder de CAO Ziekenhuizen bouwen hun pensioen op bij PFZW (Pensioenfonds Zorg en Welzijn)."
    }
  ]

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
  }

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
        "name": "CAO Ziekenhuizen",
        "item": "https://zorgwerkwijzer.nl/cao/ziekenhuizen"
      }
    ]
  }

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
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              CAO Ziekenhuizen 2025-2027
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Alles wat je moet weten over je salaris, toeslagen en secundaire arbeidsvoorwaarden in de ziekenhuiszorg. 
              Gebaseerd op de nieuwste onderhandelingsresultaten voor 2025 en 2026.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/salaris-calculator"
                className="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-full font-semibold transition-colors flex items-center"
              >
                Bereken je salaris
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                href="#regelingen"
                className="bg-primary-700/50 hover:bg-primary-700/70 text-white border border-primary-400/30 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Bekijk alle regelingen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Salarisverhoging Section */}
            <section id="salaris" className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <Coins className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Salaris & Loonsverhoging</h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                De nieuwe CAO Ziekenhuizen heeft een looptijd van 24 maanden (1 februari 2025 tot en met 31 januari 2027). 
                Gedurende deze periode stijgen de salarissen structureel met in totaal 8%.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { date: "1 februari 2025", percent: "+2,0%" },
                  { date: "1 augustus 2025", percent: "+2,0%" },
                  { date: "1 februari 2026", percent: "+2,0%" },
                  { date: "1 augustus 2026", percent: "+2,0%" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-700">{item.date}</span>
                    <span className="text-green-600 font-bold">{item.percent}</span>
                  </div>
                ))}
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
                <h3 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Salarisindicatie per functiegroep (FWG)
                </h3>
                <p className="text-primary-800 text-sm mb-4">
                  Indicatieve bruto maandsalarissen per 1 februari 2026 (voltijd):
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">FWG 25 (Bijv. Helpende)</span>
                    <span className="font-semibold text-slate-800">€ 2.578 - € 3.651</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">FWG 40 (Bijv. Verzorgende IG)</span>
                    <span className="font-semibold text-slate-800">€ 2.696 - € 3.882</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">FWG 45 (Bijv. MBO Verpleegkundige)</span>
                    <span className="font-semibold text-slate-800">€ 3.164 - € 4.261</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">FWG 50 (Bijv. HBO Verpleegkundige)</span>
                    <span className="font-semibold text-slate-800">€ 3.395 - € 4.818</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ORT Section */}
            <section id="ort" className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Onregelmatigheidstoeslag (ORT)</h2>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Binnen de ziekenhuiszorg krijg je een extra toeslag als je op onregelmatige tijden werkt. 
                Een belangrijke vernieuwing is dat zaterdagen nu de gehele dag onder de 38% regeling vallen.
              </p>

              <div className="overflow-hidden rounded-2xl border border-slate-200 mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-4 font-semibold text-slate-700 border-b border-slate-200">Dag & Tijd</th>
                      <th className="p-4 font-semibold text-slate-700 border-b border-slate-200 text-right">Toeslag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 text-slate-600">Maandag t/m vrijdag (20:00 - 06:00)</td>
                      <td className="p-4 text-slate-900 font-bold text-right">22%</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-600">Zaterdag (00:00 - 24:00)</td>
                      <td className="p-4 text-slate-900 font-bold text-right">38%</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-600">Zon- en feestdagen (00:00 - 24:00)</td>
                      <td className="p-4 text-slate-900 font-bold text-right">60%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <Link 
                href="/ort-calculator"
                className="inline-flex items-center text-primary-600 font-semibold hover:underline"
              >
                Bereken direct jouw ORT toeslag
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </section>

            {/* Other Regelingen */}
            <section id="regelingen" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vakantie & Bonus</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>8% Vakantiegeld</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>8,33% Eindejaarsuitkering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Nieuw: Balansverlof (sparen voor later)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Reiskosten</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Vanaf feb 2026: € 0,21 per km</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Max. 35 km enkele reis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>Dienstreizen auto: € 0,30 per km</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Veelgestelde vragen</h2>
              </div>
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-slate-100 pb-6 last:border-0">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-lg sticky top-8">
              <h3 className="text-xl font-bold mb-4">Bereken je netto salaris</h3>
              <p className="text-primary-100 mb-6 text-sm">
                Wil je precies weten wat je overhoudt van je bruto salaris inclusief ORT? Gebruik onze gratis rekenhulp.
              </p>
              <div className="space-y-3">
                <Link 
                  href="/salaris-calculator"
                  className="block w-full bg-white text-primary-700 hover:bg-primary-50 py-3 rounded-xl font-bold text-center transition-colors"
                >
                  Salaris Calculator
                </Link>
                <Link 
                  href="/ort-calculator"
                  className="block w-full bg-primary-500 hover:bg-primary-400 text-white py-3 rounded-xl font-bold text-center transition-colors border border-primary-400"
                >
                  ORT Calculator
                </Link>
              </div>
              
              <hr className="my-8 border-primary-500" />
              
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Gerelateerde CAO&apos;s
                </h4>
                <ul className="space-y-2 text-sm text-primary-100">
                  <li>
                    <Link href="/cao-vvt" className="hover:text-white flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      CAO VVT (Verpleeg- & Verzorgingshuizen)
                    </Link>
                  </li>
                  <li>
                    <Link href="/salaris/doktersassistent" className="hover:text-white flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      CAO Huisartsenzorg
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-pink-500" />
                Pensioen & Zekerheid
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                In de ziekenhuiszorg bouw je een solide pensioen op bij <strong>PFZW</strong>. De werkgever betaalt mee aan de premie.
              </p>
              <Link href="/pensioen-zorg" className="text-primary-600 text-sm font-semibold hover:underline">
                Hoe werkt pensioen in de zorg?
              </Link>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Download PDF
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Bekijk de officiële salaristabellen van de NVZ.
              </p>
              <a 
                href="https://cao-ziekenhuizen.nl/sites/default/files/2025-04/Salarissen%20per%20functiegroep%20per%201%20februari%202026.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 text-sm font-semibold hover:underline"
              >
                Salaristabellen 2026 (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-20 mt-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="bg-primary-500/10 border border-primary-500/20 inline-flex items-center gap-2 px-4 py-2 rounded-full text-primary-300 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Vind je droombaan in het ziekenhuis
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Klaar voor een nieuwe stap?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
            Nu je alles weet over het salaris in het ziekenhuis, is het tijd om te kijken naar de actuele vacatures in jouw regio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/vacatures" 
              className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary-600/20"
            >
              Bekijk Ziekenhuis Vacatures
            </Link>
            <Link 
              href="/over-ons" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-10 py-4 rounded-full font-bold transition-all backdrop-blur-sm"
            >
              Over Zorgwerkwijzer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
