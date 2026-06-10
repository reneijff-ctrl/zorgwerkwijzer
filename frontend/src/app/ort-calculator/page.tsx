"use client";

import { useState } from "react";
import { calculateOrt } from "@/lib/api";
import { OrtCalculationResponse } from "@/types/api";
import { Euro, Clock, Loader2, Info } from "lucide-react";

export default function OrtCalculatorPage() {
  const [formData, setFormData] = useState({
    eveningHours: "0",
    nightHours: "0",
    saturdayHours: "0",
    sundayHours: "0",
    holidayHours: "0",
    hourlyWage: "20",
  });
  
  const [result, setResult] = useState<OrtCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ORT Calculator Zorg",
    "description": "Bereken je onregelmatigheidstoeslag (ORT) voor avond-, nacht- en weekenddiensten in de zorg.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCalculationError(null);
    setFieldErrors({});
    try {
      const data = await calculateOrt({
        eveningHours: parseFloat(formData.eveningHours) || 0,
        nightHours: parseFloat(formData.nightHours) || 0,
        saturdayHours: parseFloat(formData.saturdayHours) || 0,
        sundayHours: parseFloat(formData.sundayHours) || 0,
        holidayHours: parseFloat(formData.holidayHours) || 0,
        hourlyWage: parseFloat(formData.hourlyWage) || 0,
      });
      setResult(data);
    } catch (err: unknown) {
      const errorData = err as { validationErrors?: Record<string, string>; message?: string };
      if (errorData.validationErrors) {
        setFieldErrors(errorData.validationErrors);
        setCalculationError("Controleer de gemarkeerde velden.");
      } else {
        setCalculationError(errorData.message || "Er is een fout opgetreden bij de berekening.");
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
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">ORT Calculator</h1>
        <p className="text-slate-600">Bereken je onregelmatigheidstoeslag per maand of per periode.</p>
        {calculationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {calculationError}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 card">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputField label="Bruto Uurloon" id="hourlyWage" value={formData.hourlyWage} onChange={handleInputChange} icon={<Euro className="w-4 h-4" />} error={fieldErrors.hourlyWage} />
               <InputField label="Avonduren (22%)" id="eveningHours" value={formData.eveningHours} onChange={handleInputChange} error={fieldErrors.eveningHours} />
               <InputField label="Nachturen (44%)" id="nightHours" value={formData.nightHours} onChange={handleInputChange} error={fieldErrors.nightHours} />
               <InputField label="Zaterdaguren (38%)" id="saturdayHours" value={formData.saturdayHours} onChange={handleInputChange} error={fieldErrors.saturdayHours} />
               <InputField label="Zondaguren (60%)" id="sundayHours" value={formData.sundayHours} onChange={handleInputChange} error={fieldErrors.sundayHours} />
               <InputField label="Feestdaguren (60%)" id="holidayHours" value={formData.holidayHours} onChange={handleInputChange} error={fieldErrors.holidayHours} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bereken Toeslag"}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="card bg-primary-600 text-white border-none">
              <h2 className="text-lg font-bold mb-4 opacity-90">Resultaat</h2>
              <div className="space-y-4">
                <ResultRow label="Avond" value={result.eveningAllowance} />
                <ResultRow label="Nacht" value={result.nightAllowance} />
                <ResultRow label="Zaterdag" value={result.saturdayAllowance} />
                <ResultRow label="Zondag" value={result.sundayAllowance} />
                <ResultRow label="Feestdag" value={result.holidayAllowance} />
                <div className="pt-4 mt-4 border-t border-primary-500 flex justify-between items-center">
                  <span className="font-bold text-xl">Totaal ORT</span>
                  <span className="font-bold text-2xl">{formatCurrency(result.totalOrt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-dashed border-2 flex flex-col items-center justify-center py-12 text-slate-400">
              <Clock className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-sm">Berekening verschijnt hier</p>
            </div>
          )}
          
          <div className="p-4 border border-slate-200 rounded-xl bg-white text-xs text-slate-500 space-y-2">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Percentages CAO VVT:
            </p>
            <ul className="grid grid-cols-2 gap-1">
              <li>Ma-vrij 20:00-07:00: 22/44%</li>
              <li>Zaterdag: 38%</li>
              <li>Zondag: 60%</li>
              <li>Feestdagen: 60%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
}

function InputField({ label, id, value, onChange, icon, error }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type="number"
          id={id}
          value={value}
          onChange={onChange}
          className={`block w-full ${icon ? 'pl-9' : 'px-4'} py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all ${
            error ? 'border-red-500 bg-red-50' : 'border-slate-200'
          }`}
          required
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

function ResultRow({ label, value }: { label: string, value: number }) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
  };
  
  if (value <= 0) return null;
  
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{formatCurrency(value)}</span>
    </div>
  );
}
