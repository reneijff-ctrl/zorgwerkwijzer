'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight, TrendingUp } from 'lucide-react';

interface FunctieData {
  id: string;
  title: string;
  schaal: string;
  fwg: string;
  href: string;
  color: string;
  activeColor: string;
  salarisBand: {
    label: string;
    min: string;
    max: string;
    description: string;
  }[];
  groeipad: string;
}

const FUNCTIES: FunctieData[] = [
  {
    id: 'verpleegkundige',
    title: 'Verpleegkundige',
    schaal: 'FWG 45 – 55',
    fwg: 'FWG 45 – 55',
    href: '/salaris/verpleegkundige',
    color: 'border-l-4 border-brand-blue',
    activeColor: 'bg-brand-blue/20 border-brand-blue',
    salarisBand: [
      { label: 'Periodiek 1 (instap)', min: '€ 2.574', max: '€ 2.700', description: 'Startschaal FWG 45' },
      { label: 'Periodiek 4 (ervaren)', min: '€ 3.100', max: '€ 3.350', description: 'FWG 50 na 2–4 jaar' },
      { label: 'Periodiek 8 (senior)', min: '€ 3.700', max: '€ 4.150', description: 'FWG 55 met specialisatie' },
    ],
    groeipad: 'Verpleegkundige → Seniorverpleegkundige → Verpleegkundig Specialist',
  },
  {
    id: 'verzorgende-ig',
    title: 'Verzorgende IG',
    schaal: 'FWG 35 – 40',
    fwg: 'FWG 35 – 40',
    href: '/salaris/verzorgende-ig',
    color: 'border-l-4 border-brand-pink',
    activeColor: 'bg-brand-pink/20 border-brand-pink',
    salarisBand: [
      { label: 'Periodiek 1 (instap)', min: '€ 2.150', max: '€ 2.350', description: 'Startschaal FWG 35' },
      { label: 'Periodiek 4 (ervaren)', min: '€ 2.500', max: '€ 2.750', description: 'FWG 40 na 2–3 jaar' },
      { label: 'Periodiek 8 (senior)', min: '€ 2.900', max: '€ 3.100', description: 'FWG 40 max' },
    ],
    groeipad: 'Verzorgende IG → Verpleegkundige (zij-instroom) → Teamleider Zorg',
  },
  {
    id: 'helpende-plus',
    title: 'Helpende Plus',
    schaal: 'FWG 25 – 30',
    fwg: 'FWG 25 – 30',
    href: '/salaris/helpende-plus',
    color: 'border-l-4 border-brand-orange',
    activeColor: 'bg-orange-500/20 border-orange-400',
    salarisBand: [
      { label: 'Periodiek 1 (instap)', min: '€ 1.950', max: '€ 2.100', description: 'Startschaal FWG 25' },
      { label: 'Periodiek 4 (ervaren)', min: '€ 2.200', max: '€ 2.400', description: 'FWG 30 na 2–3 jaar' },
      { label: 'Periodiek 8 (senior)', min: '€ 2.500', max: '€ 2.650', description: 'FWG 30 max' },
    ],
    groeipad: 'Helpende Plus → Verzorgende IG (BBL/BOL) → Zorgmedewerker',
  },
  {
    id: 'doktersassistent',
    title: 'Doktersassistent',
    schaal: 'Schaal 4 – 5',
    fwg: 'Schaal 4 – 5',
    href: '/salaris/doktersassistent',
    color: 'border-l-4 border-brand-blue',
    activeColor: 'bg-brand-blue/20 border-brand-blue',
    salarisBand: [
      { label: 'Schaal 4 (instap)', min: '€ 2.300', max: '€ 2.600', description: 'CAO Huisartsenzorg start' },
      { label: 'Schaal 4 (ervaren)', min: '€ 2.700', max: '€ 3.000', description: 'Na 3–5 jaar' },
      { label: 'Schaal 5 (senior)', min: '€ 3.100', max: '€ 3.500', description: 'Met specialistische taken' },
    ],
    groeipad: 'Doktersassistent → Triagist → Praktijkmanager',
  },
];

export default function SalariswijzerSection() {
  const [selected, setSelected] = useState<string>('verpleegkundige');
  const router = useRouter();

  const activeFunctie = FUNCTIES.find((f) => f.id === selected) ?? FUNCTIES[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12">
          {/* Links: intro + functieselectie */}
          <div className="lg:w-5/12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Salariswijzer per functie
            </h2>
            <p className="text-slate-400 text-xl mb-8 leading-relaxed">
              Wil je weten wat je hoort te verdienen? Ontdek de actuele salarisschalen, FWG-indelingen en groeipad voor de meest voorkomende rollen in de zorg.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-lg">Up-to-date voor CAO VVT 2024-2026</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-lg">Inclusief ORT en vakantiegeld impact</span>
              </div>
            </div>

            {/* Functietegels */}
            <div className="flex flex-col gap-3">
              {FUNCTIES.map((f) => {
                const isActive = f.id === selected;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelected(f.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isActive
                        ? `${f.activeColor} border-opacity-100`
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <span className="text-white font-bold text-base">{f.title}</span>
                      <span className="block text-slate-400 text-sm">{f.fwg}</span>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        isActive ? 'text-white rotate-90' : 'text-slate-500 group-hover:text-white'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rechts: dynamische salariskaarten */}
          <div className="lg:w-7/12 flex flex-col gap-5">
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-black text-2xl">{activeFunctie.title}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-1">Functieschaal: <span className="text-white font-semibold">{activeFunctie.fwg}</span></p>
              <p className="text-slate-400 text-sm">CAO VVT 2024-2026 · Bruto maandloon exclusief ORT</p>
            </div>

            {activeFunctie.salarisBand.map((band, idx) => (
              <div
                key={idx}
                className="bg-white/5 hover:bg-white/10 rounded-2xl p-5 border border-white/10 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="text-slate-300 font-semibold text-sm mb-1">{band.label}</p>
                  <p className="text-slate-500 text-xs">{band.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-black text-lg">{band.min}</p>
                  <p className="text-slate-400 text-sm">t/m {band.max}</p>
                </div>
              </div>
            ))}

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Groeipad</p>
              <p className="text-white text-sm leading-relaxed">{activeFunctie.groeipad}</p>
            </div>

            <Link
              href={activeFunctie.href}
              onClick={(e) => { e.stopPropagation(); router.push(activeFunctie.href); }}
              className="relative z-20 flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 px-6 rounded-2xl transition-all"
            >
              Volledig salarisoverzicht {activeFunctie.title}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
