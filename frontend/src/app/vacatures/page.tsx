'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { vacancies } from '@/lib/vacancies';
import { 
  Search, 
  MapPin, 
  Clock, 
  Euro, 
  Filter,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

export default function VacanciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('Alle functies');

  const professions = ['Alle functies', 'Helpende Plus', 'Verzorgende IG', 'Verpleegkundige', 'Wijkverpleegkundige', 'Doktersassistent'];

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           v.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           v.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProfession = selectedProfession === 'Alle functies' || v.profession === selectedProfession;
      return matchesSearch && matchesProfession;
    });
  }, [searchTerm, selectedProfession]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Actuele Vacatures in de Zorg</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Vind jouw volgende uitdaging. Wij hebben de meest relevante vacatures voor zorgmedewerkers verzameld.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Zoek op functie, werkgever of stad..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none bg-white transition-all"
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
              >
                {professions.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button className="bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20">
              Zoeken
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 px-2">
          <p className="text-slate-600 font-medium">
            {filteredVacancies.length} vacatures gevonden
          </p>
        </div>

        {/* Vacancy Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredVacancies.map((v) => (
            <Link 
              key={v.id} 
              href={`/vacatures/${v.slug}`}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-sky-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                <Stethoscope className="w-8 h-8 text-sky-600" />
              </div>

              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {v.profession}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {v.contractType}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                  {v.title}
                </h2>
                <p className="text-slate-600 font-medium mb-3">{v.employer}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {v.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {v.contractHours}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Euro className="w-4 h-4 text-slate-400" />
                    {v.salaryIndication}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          ))}

          {filteredVacancies.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Geen vacatures gevonden</h3>
              <p className="text-slate-500">Probeer een andere zoekterm of pas je filters aan.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedProfession('Alle functies');}}
                className="mt-6 text-sky-600 font-bold hover:underline"
              >
                Filters wissen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
