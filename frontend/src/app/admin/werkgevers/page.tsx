'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { getAdminEmployers } from '@/lib/api/admin';
import type { AdminEmployer } from '@/types/admin';
import type { PageResponse } from '@/types/api';
import AdminTable, { AdminTableEmptyRow } from '@/components/admin/AdminTable';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminBadge from '@/components/admin/AdminBadge';

type StatusFilter = '' | 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INACTIVE';

const TABLE_HEADERS = ['Naam', 'E-mail', 'Stad', 'Pakket', 'Status', 'Vacatures', 'Geregistreerd', 'Acties'];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminWerkgeversPage() {
  const [result, setResult] = useState<PageResponse<AdminEmployer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [page, setPage] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const data = await getAdminEmployers(q || undefined, status || undefined, page, 20);
    if (!data) {
      setError(true);
    } else {
      setResult(data);
    }
    setLoading(false);
  }, [q, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleQChange = useCallback((newQ: string) => {
    setQ(newQ);
    setPage(0);
  }, []);

  const handleStatusChange = (newStatus: StatusFilter) => {
    setStatus(newStatus);
    setPage(0);
  };

  const employers = result?.content ?? [];
  const totalPages = result?.totalPages ?? 0;
  const totalElements = result?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Werkgevers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Laden…' : `${totalElements} werkgever${totalElements !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <AdminSearchBar
          value={q}
          onChange={handleQChange}
          placeholder="Zoek op naam of e-mail…"
        />
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow shrink-0"
        >
          <option value="">Alle statussen</option>
          <option value="ACTIVE">Actief</option>
          <option value="TRIALING">Proefperiode</option>
          <option value="PAST_DUE">Achterstallig</option>
          <option value="CANCELED">Opgezegd</option>
          <option value="INACTIVE">Geen abonnement</option>
        </select>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          Werkgevers konden niet worden geladen. Probeer het opnieuw.
        </div>
      )}

      {/* Tabel */}
      <AdminTable headers={TABLE_HEADERS} loading={loading}>
        {!loading && employers.length === 0 ? (
          <AdminTableEmptyRow colSpan={TABLE_HEADERS.length} message="Geen werkgevers gevonden." />
        ) : (
          employers.map((employer) => (
            <tr key={employer.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/werkgevers/${employer.id}`}
                  className="font-medium text-slate-900 hover:text-violet-600 transition-colors"
                >
                  {employer.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs">{employer.email}</td>
              <td className="px-4 py-3 text-slate-500 text-sm">{employer.city ?? '—'}</td>
              <td className="px-4 py-3">
                <AdminBadge status={employer.packageName} fallback="Geen pakket" />
              </td>
              <td className="px-4 py-3">
                <AdminBadge status={employer.subscriptionStatus} fallback="Geen abonnement" />
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {employer.activeVacancyCount}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                {formatDate(employer.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/werkgevers/${employer.id}`}
                  className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                >
                  Bekijken
                </Link>
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
