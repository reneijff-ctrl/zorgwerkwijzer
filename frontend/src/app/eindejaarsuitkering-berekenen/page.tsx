"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateEndOfYearBonus } from "@/lib/api";
import { EndOfYearCalculationResponse } from "@/types/api";
import { Euro, Info, Loader2, Calculator, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";

export default function EndOfYearCalculatorPage() {
  const [monthlySalary, setMonthlySalary] = useState<string>("3000");
  const [weeklyHours] = useState<string>("36");
  const [fulltimeHours] = useState<string>("36");
  const [monthsWorked, setMonthsWorked] = useState<string>("12");
  const [averageMonthlyOrt, setAverageMonthlyOrt] = useState<string>("0");
  const [includeOrt, setIncludeOrt] = useState<boolean>(true);
  
  const [result, setResult] = useState<EndOfYearCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Eindejaarsuitkering Calculator Zorg",
    "description": "Bereken je eindejaarsuitkering (13e maand) volgens de CAO VVT.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Hoe hoog is de eindejaarsuitkering in de zorg?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In de meeste zorg-CAO's, zoals de CAO VVT, bedraagt de eindejaarsuitkering 8,33% van het bruto jaarsalaris. Dit komt overeen met precies één maandsalaris, ook wel de 13e maand genoemd."
        }
      },
      {
        "@type": "Question",
        "name": "Krijg ik eindejaarsuitkering over mijn ORT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, in de CAO VVT wordt de eindejaarsuitkering berekend over het feitelijk verdiende salaris, inclusief de onregelmatigheidstoeslag (ORT). Onze calculator houdt hier rekening mee."
        }
      }
    ]
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    try {
      const data = await calculateEndOfYearBonus({
        monthlyGrossSalary: parseFloat(monthlySalary),
        weeklyHours: parseFloat(weeklyHours),
        fulltimeHours: parseFloat(fulltimeHours),
        monthsWorked: parseInt(monthsWorked),
        averageMonthlyOrt: parseFloat(averageMonthlyOrt),
        includeOrt: includeOrt
      });
      setResult(data);
    } catch (err: unknown) {
      const errorData = err as { validationErrors?: Record<string, string>; message?: string };
      if (errorData.validationErrors) {
        setFieldErrors(errorData.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Eindejaarsuitkering <span className="text-brand-pink">Berekenen</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Ontdek precies hoeveel dertiende maand je dit jaar opbouwt. 
          Gebaseerd op de actuele 8,33% regeling in de CAO VVT.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input Card */}
        <div className="lg:col-span-2 card">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="monthlySalary" className="block text-sm font-bold text-slate-700 mb-2">
                  Bruto Maandsalaris
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Euro className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    id="monthlySalary"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all ${
                      fieldErrors.monthlyGrossSalary ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="3000"
                    required
                  />
                </div>
                {fieldErrors.monthlyGrossSalary && <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.monthlyGrossSalary}</p>}
              </div>

              <div>
                <label htmlFor="monthsWorked" className="block text-sm font-bold text-slate-700 mb-2">
                  Maanden gewerkt dit jaar
                </label>
                <select
                  id="monthsWorked"
                  value={monthsWorked}
                  onChange={(e) => setMonthsWorked(e.target.value)}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'maand' : 'maanden'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="averageMonthlyOrt" className="block text-sm font-bold text-slate-700 mb-2">
                  Gemiddelde ORT p.m. (optioneel)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Euro className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    id="averageMonthlyOrt"
                    value={averageMonthlyOrt}
                    onChange={(e) => setAverageMonthlyOrt(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={includeOrt}
                      onChange={() => setIncludeOrt(!includeOrt)}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${includeOrt ? 'bg-brand-pink' : 'bg-slate-200'}`} />
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${includeOrt ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Inclusief ORT berekenen</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                <Info className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                In de CAO VVT bouw je ook eindejaarsuitkering op over je verdiende onregelmatigheidstoeslag (ORT). 
                De uitkering bedraagt 8,33% van je totale bruto jaarsalaris.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-pink to-rose-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-pink/20 hover:shadow-xl hover:shadow-brand-pink/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Calculator className="w-5 h-5" />
                  Bereken Eindejaarsuitkering
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-6">
          {result ? (
            <div className="card bg-gradient-to-br from-brand-pink/5 to-white border-brand-pink/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Gift className="w-24 h-24 text-brand-pink transform rotate-12" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                Jouw Resultaat
              </h2>
              
              <div className="space-y-5 relative z-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Verwachte Uitkering</span>
                  <div className="text-4xl font-black text-brand-pink">{formatCurrency(result.totalBonus)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-pink/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Maandelijkse opbouw</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.monthlyAccrual)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Percentage</span>
                    <span className="font-bold text-slate-900">{result.percentage}%</span>
                  </div>
                </div>

                {result.ortContribution > 0 && (
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 block">Bonus over je ORT</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(result.ortContribution)}</span>
                  </div>
                )}

                <div className="pt-4 mt-2">
                  <div className="text-[10px] text-slate-400 italic">
                    Berekeningsbasis: {formatCurrency(result.calculationBasis)} (Bruto jaarsom)
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-dashed border-2 flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50">
              <Calculator className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm font-medium">Vul je gegevens in</p>
            </div>
          )}

          <div className="card bg-brand-blue/5 border-brand-blue/10">
            <h3 className="font-bold text-brand-blue mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Wanneer uitbetaald?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              De eindejaarsuitkering wordt in de zorg meestal in **november** of **december** uitbetaald. Dit verschilt per CAO en werkgever.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Wat is de eindejaarsuitkering in de zorg?</h2>
            <div className="prose prose-slate max-w-none">
              <p>
                De eindejaarsuitkering is een extra bruto bedrag dat je één keer per jaar ontvangt. In de zorg, 
                en specifiek in de **CAO VVT**, is deze uitkering vastgesteld op **8,33%** van je bruto jaarsalaris. 
                Omdat dit percentage exact overeenkomt met 1/12 deel van je jaarsalaris, wordt het ook wel de 
                **dertiende maand** genoemd.
              </p>
              <p className="mt-4">
                In tegenstelling tot vakantiegeld, bouw je over de eindejaarsuitkering zelf geen vakantiegeld op, 
                maar je bouwt wel pensioen op over dit bedrag bij het PFZW.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Veelgestelde vragen</h3>
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-900 mb-2">Heb ik recht op de volledige 8,33%?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ja, als je het hele kalenderjaar in dienst bent geweest, ontvang je de volledige 8,33%. 
                  Ben je korter in dienst? Dan ontvang je dit naar rato voor de maanden dat je wel gewerkt hebt.
                </p>
              </div>
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-900 mb-2">Telt mijn ORT mee voor de bonus?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  In de CAO VVT en CAO Ziekenhuizen telt de verdiende onregelmatigheidstoeslag mee in de berekening. 
                  Dit betekent dat hoe meer onregelmatige diensten je draait, hoe hoger je eindejaarsuitkering wordt.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Hoeveel houd ik netto over?</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  De eindejaarsuitkering wordt belast volgens het zogenaamde &quot;bijzonder tarief&quot;. 
                  Dit is vaak hoger dan je normale belastingtarief, waardoor je netto ongeveer de helft overhoudt.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Internal Links Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Andere tools</h3>
            <div className="space-y-4">
              <Link href="/salaris-calculator" className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                <span className="font-medium">Salaris Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/ort-calculator" className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                <span className="font-medium">ORT Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/vakantiegeld-berekenen" className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                <span className="font-medium">Vakantiegeld Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-6 border border-slate-200 rounded-3xl">
            <h3 className="font-bold text-slate-900 mb-4">Handig om te weten</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                Sinds 2011 is de bonus in de VVT 8,33%.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                Het is een verplichte uitkering.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                Inclusief pensioenopbouw bij PFZW.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gift(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}
