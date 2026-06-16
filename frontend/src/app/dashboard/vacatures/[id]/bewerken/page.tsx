'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDashboardVacancies } from '@/lib/api/employer-dashboard';
import type { DashboardVacancyDto } from '@/types/dashboard';
import VacancyForm from '@/components/dashboard/VacancyForm';
import { ChevronLeft } from 'lucide-react';

export default function BewerkenPage() {
  const params = useParams();
  const id = Number(params.id);
  const [vacancy, setVacancy] = useState<DashboardVacancyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      // Haal alle vacatures op en zoek de juiste — de backend biedt geen single-get via dashboard endpoint
      const page = await getDashboardVacancies(0, 100);
      if (page) {
        const found = page.content.find((v) => v.id === id) ?? null;
        if (found) {
          setVacancy(found);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    if (!isNaN(id)) {
      load();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !vacancy) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Vacature niet gevonden.</p>
        <Link
          href="/dashboard/vacatures"
          className="text-sky-600 font-medium hover:underline text-sm"
        >
          Terug naar vacatures
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-slate-900">Vacature bewerken</h1>
        <p className="text-slate-400 mt-1 text-sm">{vacancy.title}</p>
      </div>

      <VacancyForm
        mode="edit"
        vacancyId={vacancy.id}
        initial={{
          title: vacancy.title,
          isActive: vacancy.isActive,
          employmentType: vacancy.employmentType,
          educationLevel: vacancy.educationLevel,
          salaryMin: vacancy.salaryMin,
          salaryMax: vacancy.salaryMax,
          hoursMin: vacancy.hoursMin,
          hoursMax: vacancy.hoursMax,
          expiresAt: vacancy.expiresAt,
        }}
      />
    </div>
  );
}
