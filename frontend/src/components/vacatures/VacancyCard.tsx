import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Euro, ChevronRight, Stethoscope } from 'lucide-react';
import type { VacancyListItem } from '@/types/api';
import { EMPLOYMENT_TYPE_LABELS, EDUCATION_LEVEL_LABELS } from '@/types/api';
import { formatSalary, formatHours } from '@/lib/api/vacancies';

interface VacancyCardProps {
  vacancy: VacancyListItem;
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
  const salaryLabel = formatSalary(vacancy.salaryMin, vacancy.salaryMax);
  const hoursLabel = formatHours(vacancy.hoursMin, vacancy.hoursMax);
  const employmentLabel = vacancy.employmentType
    ? EMPLOYMENT_TYPE_LABELS[vacancy.employmentType]
    : null;
  const educationLabel = vacancy.educationLevel
    ? EDUCATION_LEVEL_LABELS[vacancy.educationLevel]
    : null;

  const isFeatured = vacancy.isFeatured === true;

  if (isFeatured) {
    return (
      <Link
        href={`/vacature/${vacancy.slug}`}
        className="group relative bg-amber-50 rounded-2xl border-2 border-amber-400 shadow-md hover:shadow-lg hover:border-amber-500 transition-all flex flex-col md:flex-row md:items-center gap-6 p-6"
      >
        {/* Featured badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-white text-xs font-bold shadow-sm">
            ⭐ Uitgelicht
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-600 text-white text-xs font-bold shadow-sm">
            👑 Premium
          </span>
        </div>

        {/* Logo / Icon */}
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-amber-200 shadow-sm overflow-hidden">
          {vacancy.employerLogoUrl ? (
            <Image
              src={vacancy.employerLogoUrl}
              alt={vacancy.employerName}
              width={80}
              height={80}
              className="object-contain w-full h-full p-1"
            />
          ) : (
            <Stethoscope className="w-9 h-9 text-amber-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-grow pr-24">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {vacancy.occupationName && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                {vacancy.occupationName}
              </span>
            )}
            {employmentLabel && (
              <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                {employmentLabel}
              </span>
            )}
            {educationLabel && (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                {educationLabel}
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
            {vacancy.title}
          </h2>
          <p className="text-slate-600 font-semibold mb-3">{vacancy.employerName}</p>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {vacancy.cityName && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                {vacancy.cityName}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              {hoursLabel}
            </div>
            {salaryLabel !== 'Salaris n.o.t.k.' && (
              <div className="flex items-center gap-1.5 font-semibold text-amber-700">
                <Euro className="w-4 h-4 text-amber-500" />
                {salaryLabel}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end shrink-0">
          <div className="inline-flex items-center gap-2 bg-amber-500 group-hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            Bekijk vacature
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/vacature/${vacancy.slug}`}
      className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-sky-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6"
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
        <Stethoscope className="w-8 h-8 text-sky-600" />
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {vacancy.occupationName && (
            <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {vacancy.occupationName}
            </span>
          )}
          {employmentLabel && (
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {employmentLabel}
            </span>
          )}
          {educationLabel && (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {educationLabel}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
          {vacancy.title}
        </h2>
        <p className="text-slate-600 font-medium mb-3">{vacancy.employerName}</p>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          {vacancy.cityName && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {vacancy.cityName}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {hoursLabel}
          </div>
          <div className="flex items-center gap-1.5">
            <Euro className="w-4 h-4 text-slate-400" />
            {salaryLabel}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-end">
        <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-sky-600 group-hover:text-white transition-all">
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
}
