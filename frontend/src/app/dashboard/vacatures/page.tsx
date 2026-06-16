'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { getDashboardVacancies, deleteDashboardVacancy } from '@/lib/api/employer-dashboard';
import type { DashboardVacancyDto } from '@/types/dashboard';
import { EMPLOYMENT_TYPE_LABELS, EDUCATION_LEVEL_LABELS } from '@/types/api';
import { PlusCircle, Pencil, Trash2, ExternalLink } from 'lucide-react';

export default function DashboardVacaturesPage() {
  const [vacancies, setVacancies] = useState<DashboardVacancyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function load() {
    const page = await getDashboardVacancies(0, 50);
    if (page) setVacancies(page.content);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function handleDelete(id: number, title: string) {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen? Als er sollicitaties gekoppeld zijn, wordt de vacature gedeactiveerd.`)) return;

    setError(null);
    setSuccessMessage(null);
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteDashboardVacancy(id);
      if (result.success) {
        if (result.data.action === 'deleted') {
          setVacancies((prev) => prev.filter((v) => v.id !== id));
        } else {
          // Deactivated: update isActive in de lijst
          setVacancies((prev) =>
            prev.map((v) => (v.id === id ? { ...v, isActive: false } : v)),
          );
        }
        setSuccessMessage(result.data.message);
      } else {
        setError(result.error);
      }
      setDeletingId(null);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vacatures</h1>
          <p className="text-slate-500 mt-1">{vacancies.length} vacature(s) gevonden</p>
        </div>
        <Link
          href="/dashboard/vacatures/nieuw"
          className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Nieuwe vacature
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          {successMessage}
        </div>
      )}

      {vacancies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
          <p className="text-slate-400 mb-4">Je hebt nog geen vacatures aangemaakt.</p>
          <Link
            href="/dashboard/vacatures/nieuw"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Eerste vacature plaatsen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Vacature
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Sollicitaties
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vacancies.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{v.title}</p>
                    {v.educationLevel && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {EDUCATION_LEVEL_LABELS[v.educationLevel]}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-600">
                      {v.employmentType ? EMPLOYMENT_TYPE_LABELS[v.employmentType] : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span
                      className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        v.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {v.isActive ? 'Actief' : 'Inactief'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-700 font-medium">{v.applicationCount}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/vacature/${v.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors"
                        title="Bekijk op site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/vacatures/${v.id}/bewerken`}
                        className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors"
                        title="Bewerken"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id, v.title)}
                        disabled={deletingId === v.id || isPending}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
