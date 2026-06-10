"use client";

import { useState, useEffect } from "react";
import { Euro, Info, Calculator, Sun, ChevronDown, ChevronUp } from "lucide-react";

export default function HolidayAllowancePage() {
  const [monthlyGross, setMonthlyGross] = useState<string>("3000");
  const [contractHours, setContractHours] = useState<string>("36");
  const [parttimePercentage, setParttimePercentage] = useState<string>("100");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [results, setResults] = useState({
    actualMonthly: 0,
    monthlyHoliday: 0,
    yearlyHoliday: 0,
  });

  useEffect(() => {
    const gross = parseFloat(monthlyGross) || 0;
    const percentage = parseFloat(parttimePercentage) || 100;
    
    const actualMonthly = gross * (percentage / 100);
    const monthlyHoliday = actualMonthly * 0.08;
    const yearlyHoliday = monthlyHoliday * 12;

    setResults({
      actualMonthly,
      monthlyHoliday,
      yearlyHoliday,
    });
  }, [monthlyGross, parttimePercentage]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const faqs = [
    {
      question: "Hoeveel vakantiegeld krijg ik in de zorg?",
      answer: "In de Nederlandse zorg (CAO VVT, Ziekenhuizen, etc.) heb je wettelijk recht op minimaal 8% vakantiebijslag over je bruto jaarsalaris. Dit wordt opgebouwd over elke gewerkte maand."
    },
    {
      question: "Wanneer wordt het vakantiegeld uitbetaald?",
      answer: "Het vakantiegeld wordt meestal één keer per jaar uitbetaald, vaak in de maand mei. Sommige werkgevers bieden de mogelijkheid om het maandelijks uit te laten betalen via een Individueel Keuzebudget (IKB)."
    },
    {
      question: "Hoe wordt vakantiegeld berekend bij parttime werk?",
      answer: "Als je parttime werkt, wordt de 8% berekend over je werkelijke bruto inkomen. Als je bijvoorbeeld 50% werkt, is je vakantiegeld ook de helft van wat een fulltimer in dezelfde schaal zou krijgen."
    },
    {
      question: "Is vakantiegeld netto of bruto?",
      answer: "Vakantiegeld is een bruto bedrag. Er wordt loonheffing op ingehouden tegen een bijzonder tarief. Dit tarief is vaak hoger dan je normale belastingtarief omdat het bovenop je jaarinkomen komt."
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vakantiegeld Berekenen</h1>
        <p className="text-slate-600 max-w-2xl">
          Bereken direct hoeveel vakantiegeld (8% vakantiebijslag) je opbouwt op basis van je bruto maandsalaris.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
        {/* Input Form */}
        <div className="card">
          <div className="space-y-6">
            <div>
              <label htmlFor="monthlyGross" className="block text-sm font-semibold text-slate-700 mb-1">
                Bruto Maandsalaris (Fulltime)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Euro className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  id="monthlyGross"
                  value={monthlyGross}
                  onChange={(e) => setMonthlyGross(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="3000"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Vul hier je bruto maandsalaris in bij een volledig dienstverband.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contractHours" className="block text-sm font-semibold text-slate-700 mb-1">
                  Contracturen
                </label>
                <input
                  type="number"
                  id="contractHours"
                  value={contractHours}
                  onChange={(e) => setContractHours(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="36"
                />
              </div>
              <div>
                <label htmlFor="parttimePercentage" className="block text-sm font-semibold text-slate-700 mb-1">
                  Parttime %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="parttimePercentage"
                    value={parttimePercentage}
                    onChange={(e) => setParttimePercentage(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary-600 mt-0.5" />
                <div className="text-sm text-primary-800">
                  <p className="font-semibold mb-1">Jouw situatie</p>
                  Je verdient {formatCurrency(results.actualMonthly)} bruto per maand op basis van {parttimePercentage}% dienstverband.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="space-y-6">
          <div className="card border-primary-100 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sun className="w-24 h-24 text-primary-600" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary-600" />
              Vakantiegeld Resultaat
            </h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Per Maand (Opbouw)</span>
                <span className="text-xl font-bold text-slate-900">{formatCurrency(results.monthlyHoliday)}</span>
              </div>
              
              <div className="pt-6 mt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Totaal per jaar (Bruto)</p>
                <div className="flex justify-between items-center bg-primary-600 p-6 rounded-2xl text-white shadow-lg shadow-primary-200">
                  <span className="font-medium text-primary-100">Jaarbedrag</span>
                  <span className="font-bold text-3xl">
                    {formatCurrency(results.yearlyHoliday)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic text-center">
                * Dit is een bruto indicatie van je vakantietoeslag.
              </p>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed bg-slate-50">
            <p className="font-bold text-slate-800 mb-1">Wist je dat?</p>
            In de zorg is de eindejaarsuitkering (8,33%) vaak bijna net zo hoog als je vakantiegeld! Gebruik onze <a href="/salaris-calculator" className="text-primary-600 hover:underline font-medium">salaris calculator</a> om alles in één keer te berekenen.
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Veelgestelde vragen over vakantiegeld</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
