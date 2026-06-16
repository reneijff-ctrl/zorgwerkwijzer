'use client';

import Link from 'next/link';
import VacancyForm from '@/components/dashboard/VacancyForm';
import { ChevronLeft } from 'lucide-react';

export default function NieuweVacaturePage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/vacatures"
          className="inline-flex items-center text-slate-500 hover:text-sky-600 text-sm font-medium transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Terug naar vacatures
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nieuwe vacature plaatsen</h1>
        <p className="text-slate-500 mt-1">Vul de gegevens in en publiceer je vacature.</p>
      </div>

      <VacancyForm mode="create" />
    </div>
  );
}
