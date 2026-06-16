'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import {
  getAdminVacancies,
  toggleAdminVacancyFeatured,
  toggleAdminVacancyActive,
  deleteAdminVacancy,
} from '@/lib/api/admin';
import type { AdminVacancy } from '@/types/admin';
import type { PageResponse } from '@/types/api';
import AdminTable, { AdminTableEmptyRow } from '@/components/admin/AdminTable';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

export default function AdminVacaturesPage() {
  const router = useRouter();

  const [data, setData] = useState<PageResponse<AdminVacancy> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [q, setQ] = useState('');
  const [isActive, setIsActive] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<string>('');
  const [page, setPage] = useState(0);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<AdminVacancy | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    setError(false);
    const activeFilter = isActive === '' ? undefined : isActive === 'true';
    const featuredFilter = isFeatured === '' ? undefined : isFeatured === 'true';
    const result = await getAdminVacancies(q || undefined, activeFilter, featuredFilter, page, 25);
    if (result) {
      setData(result);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [q, isActive, isFeatured, page]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  // Reset pagina bij filter-wijziging
  useEffect(() => {
    setPage(0);
  }, [q, isActive, isFeatured]);

  const handleToggleFeatured = async (vacancy: AdminVacancy) => {
    const original = data?.content ?? [];
    // Optimistic update
    setData(prev =>
      prev
        ? { ...prev, content: prev.content.map(v => v.id === vacancy.id ? { ...v, isFeatured: !v.isFeatured } : v) }
        : prev
    );
    const result = await toggleAdminVacancyFeatured(vacancy.id);
    if (!result.success) {
      // Rollback
      setData(prev =>
        prev ? { ...prev, content: original } : prev
      );
    }
  };

  const handleToggleActive = async (vacancy: AdminVacancy) => {
    const original = data?.content ?? [];
    setData(prev =>
      prev
        ? { ...prev, content: prev.content.map(v => v.id === vacancy.id ? { ...v, isActive: !v.isActive } : v) }
        : prev
    );
    const result = await toggleAdminVacancyActive(vacancy.id);
    if (!result.success) {
      setData(prev =>
        prev ? { ...prev, content: original } : prev
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    const result = await deleteAdminVacancy(deleteTarget.id);
    if (result.success) {
      setDeleteTarget(null);
      fetchVacancies();
    } else {
      setDeleteError(result.error ?? 'Verwijderen mislukt');
    }
    setDeleting(false);
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

  const vacancies = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const headers = ['Titel', 'Werkgever', 'Actief', 'Featured', 'Sollicitaties', 'Geplaatst', 'Verloopt', 'Acties'];

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vacatures</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Laden…' : `${totalElements.toLocaleString('nl-NL')} vacatures`}
          </p>
        </div>
      </div>

      {/* Foutmelding */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          Vacatures konden niet worden geladen. Probeer de pagina te vernieuwen.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <AdminSearchBar
            value={q}
            onChange={v => { setQ(v); setPage(0); }}
            placeholder="Zoek op vacaturetitel…"
          />
        </div>

        <select
          value={isActive}
          onChange={e => { setIsActive(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Alle statussen</option>
          <option value="true">Actief</option>
          <option value="false">Inactief</option>
        </select>

        <select
          value={isFeatured}
          onChange={e => { setIsFeatured(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">Alle typen</option>
          <option value="true">Featured</option>
          <option value="false">Standaard</option>
        </select>
      </div>

      {/* Tabel */}
      <AdminTable headers={headers} loading={loading} empty="Geen vacatures gevonden.">
        {vacancies.map(vacancy => (
          <tr key={vacancy.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
            {/* Titel */}
            <td className="px-4 py-3">
              <button
                onClick={() => router.push(`/admin/vacatures/${vacancy.id}`)}
                className="font-medium text-slate-900 hover:text-sky-600 text-left transition-colors text-sm"
              >
                {vacancy.title}
              </button>
            </td>

            {/* Werkgever */}
            <td className="px-4 py-3">
              {vacancy.employerId ? (
                <Link
                  href={`/admin/werkgevers/${vacancy.employerId}`}
                  className="text-sm text-sky-600 hover:underline"
                >
                  {vacancy.employerName}
                </Link>
              ) : (
                <span className="text-sm text-slate-400">Onbekend</span>
              )}
            </td>

            {/* Actief toggle */}
            <td className="px-4 py-3">
              <button
                onClick={() => handleToggleActive(vacancy)}
                className="flex items-center gap-1.5 text-sm transition-colors"
                title={vacancy.isActive ? 'Deactiveren' : 'Activeren'}
              >
                {vacancy.isActive ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400" />
                )}
                <span className={vacancy.isActive ? 'text-emerald-600' : 'text-slate-400'}>
                  {vacancy.isActive ? 'Actief' : 'Inactief'}
                </span>
              </button>
            </td>

            {/* Featured toggle */}
            <td className="px-4 py-3">
              <button
                onClick={() => handleToggleFeatured(vacancy)}
                className="flex items-center gap-1.5 text-sm transition-colors"
                title={vacancy.isFeatured ? 'Uitlichten verwijderen' : 'Uitlichten'}
              >
                <Star
                  className={`w-4 h-4 ${vacancy.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                />
                <span className={vacancy.isFeatured ? 'text-amber-600' : 'text-slate-400'}>
                  {vacancy.isFeatured ? 'Featured' : 'Standaard'}
                </span>
              </button>
            </td>

            {/* Sollicitaties */}
            <td className="px-4 py-3">
              <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                {vacancy.applicationCount}
              </span>
            </td>

            {/* Geplaatst */}
            <td className="px-4 py-3 text-sm text-slate-500">{formatDate(vacancy.publishedAt)}</td>

            {/* Verloopt */}
            <td className="px-4 py-3 text-sm text-slate-500">{formatDate(vacancy.expiresAt)}</td>

            {/* Acties */}
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Link
                  href={`/vacature/${vacancy.slug}`}
                  target="_blank"
                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  title="Bekijk publieke vacature"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setDeleteError(''); setDeleteTarget(vacancy); }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Verwijder vacature"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {!loading && vacancies.length === 0 && (
          <AdminTableEmptyRow colSpan={headers.length} message="Geen vacatures gevonden." />
        )}
      </AdminTable>

      {/* Paginering */}
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Verwijderfout */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          {deleteError}
        </div>
      )}

      {/* Verwijder bevestiging */}
      <AdminConfirmModal
        open={!!deleteTarget}
        variant="danger"
        title="Vacature verwijderen"
        message={
          deleteTarget
            ? `Weet je zeker dat je de vacature "${deleteTarget.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`
            : ''
        }
        confirmLabel="Verwijderen"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
        loading={deleting}
      />
    </div>
  );
}
