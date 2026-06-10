"use client";

import { useState } from "react";
import { calculateSalary } from "@/lib/api";
import { SalaryCalculationResponse } from "@/types/api";
import { Euro, Info, Loader2, Calculator } from "lucide-react";

export default function SalaryCalculatorPage() {
  const [hourlySalary, setHourlySalary] = useState<string>("20");
  const [weeklyHours, setWeeklyHours] = useState<string>("36");
  const [result, setResult] = useState<SalaryCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Salaris Calculator Zorg",
    "description": "Bereken je bruto salaris, vakantiegeld en eindejaarsuitkering volgens de CAO VVT.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const data = await calculateSalary({
        hourlySalary: parseFloat(hourlySalary),
        weeklyHours: parseFloat(weeklyHours),
      });
      setResult(data);
    } catch (err: unknown) {
      const errorData = err as { validationErrors?: Record<string, string>; message?: string };
      if (errorData.validationErrors) {
        setFieldErrors(errorData.validationErrors);
        setError("Controleer de gemarkeerde velden.");
      } else {
        setError(errorData.message || "Er is een fout opgetreden bij de berekening.");
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Salaris Calculator</h1>
        <p className="text-slate-600">Bereken je bruto salaris op basis van je uurloon en contracturen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="card">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label htmlFor="hourlySalary" className="block text-sm font-semibold text-slate-700 mb-1">
                Bruto Uurloon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Euro className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  id="hourlySalary"
                  value={hourlySalary}
                  onChange={(e) => setHourlySalary(e.target.value)}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                    fieldErrors.hourlySalary ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="20.00"
                  required
                />
              </div>
              {fieldErrors.hourlySalary && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.hourlySalary}</p>
              )}
            </div>

            <div>
              <label htmlFor="weeklyHours" className="block text-sm font-semibold text-slate-700 mb-1">
                Wekelijkse Contracturen
              </label>
              <input
                type="number"
                step="0.5"
                id="weeklyHours"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                  fieldErrors.weeklyHours ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="36"
                required
              />
              {fieldErrors.weeklyHours && (
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.weeklyHours}</p>
              )}
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Een volledige werkweek in de VVT is meestal 36 uur.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bereken Salaris"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="card border-primary-100 bg-white">
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Jouw Berekening</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Bruto Maandsalaris</span>
                  <span className="text-lg font-bold text-slate-900">{formatCurrency(result.monthlyGrossSalary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Bruto Jaarsalaris</span>
                  <span className="text-lg font-bold text-slate-900">{formatCurrency(result.yearlyGrossSalary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Vakantiegeld (8%)</span>
                  <span className="text-lg font-semibold text-primary-600">{formatCurrency(result.holidayAllowance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Eindejaarsuitkering (8,33%)</span>
                  <span className="text-lg font-semibold text-primary-600">{formatCurrency(result.endOfYearBonus)}</span>
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center bg-primary-50 p-4 rounded-xl">
                    <span className="font-bold text-slate-900 text-lg">Totaal p.j.</span>
                    <span className="font-bold text-primary-700 text-2xl">
                      {formatCurrency(result.yearlyGrossSalary + result.holidayAllowance + result.endOfYearBonus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-dashed border-2 flex flex-col items-center justify-center py-16 text-slate-400">
              <Calculator className="w-12 h-12 mb-4 opacity-20" />
              <p>Vul de gegevens in voor je berekening</p>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Let op
            </p>
            Dit is een bruto berekening. Eventuele pensioenpremies, belastingen en andere looncomponenten zijn hierin niet meegenomen.
          </div>
        </div>
      </div>
    </div>
  );
}
