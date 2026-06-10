import React from 'react';
import Link from 'next/link';
import { vacancies, Vacancy } from '@/lib/vacancies';
import { MapPin, Clock, ArrowRight, Stethoscope } from 'lucide-react';

interface RelatedVacanciesProps {
  profession: Vacancy['profession'];
  limit?: number;
}

export default function RelatedVacancies({ profession, limit = 3 }: RelatedVacanciesProps) {
  const filteredVacancies = vacancies
    .filter(v => v.profession === profession)
    .slice(0, limit);

  if (filteredVacancies.length === 0) return null;

  return (
    <section className="py-12 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Actuele vacatures voor {profession}</h2>
          <p className="text-slate-500 mt-1">Vind een baan die bij je past</p>
        </div>
        <Link 
          href="/vacatures" 
          className="hidden md:flex items-center gap-2 text-sky-600 font-bold hover:gap-3 transition-all"
        >
          Bekijk alle vacatures
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
        {filteredVacancies.map((v) => (
          <Link 
            key={v.id} 
            href={`/vacatures/${v.slug}`}
            className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-sky-200 hover:shadow-md transition-all flex flex-col"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-50 transition-colors">
              <Stethoscope className="w-6 h-6 text-sky-600" />
            </div>
            
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
              {v.title}
            </h3>
            <p className="text-sm text-slate-500 mb-4">{v.employer}</p>
            
            <div className="mt-auto space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4" />
                {v.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4" />
                {v.contractHours}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-sky-600 font-bold text-sm">
              Bekijk vacature
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 px-8 md:hidden">
        <Link 
          href="/vacatures" 
          className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl"
        >
          Bekijk alle vacatures
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
