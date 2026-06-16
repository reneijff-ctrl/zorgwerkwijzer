'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminTable, { AdminTableEmptyRow } from '@/components/admin/AdminTable';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminPagination from '@/components/admin/AdminPagination';
import { getAdminAuditLog } from '@/lib/api/admin';
import type { AdminAuditLog } from '@/types/admin';
import type { PageResponse } from '@/types/api';

const AUDIT_ACTIONS = [
  'USER_ROLE_CHANGED',
  'USER_DELETED',
  'VACANCY_DELETED',
  'VACANCY_FEATURED_ON',
  'VACANCY_FEATURED_OFF',
  'VACANCY_ACTIVE_ON',
  'VACANCY_ACTIVE_OFF',
];

const ENTITY_TYPES = ['USER', 'VACANCY', 'SUBSCRIPTION'];

function actionColor(action: string): string {
  if (action.startsWith('USER_')) return 'bg-violet-100 text-violet-700';
  if (action.startsWith('VACANCY_')) return 'bg-amber-100 text-amber-700';
  if (action.startsWith('SUBSCRIPTION_')) return 'bg-emerald-100 text-emerald-700';
  return 'bg-slate-100 text-slate-600';
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    USER_ROLE_CHANGED: 'Rol gewijzigd',
    USER_DELETED: 'Gebruiker verwijderd',
    VACANCY_DELETED: 'Vacature verwijderd',
    VACANCY_FEATURED_ON: 'Featured aan',
    VACANCY_FEATURED_OFF: 'Featured uit',
    VACANCY_ACTIVE_ON: 'Actief aan',
    VACANCY_ACTIVE_OFF: 'Actief uit',
  };
  return labels[action] ?? action;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TABLE_HEADERS = ['Tijdstip', 'Admin', 'Actie', 'Type', 'Object', 'Oud → Nieuw'];

export default function AdminAuditLogPage() {
  const [data, setData] = useState<PageResponse<AdminAuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters
  const [adminEmail, setAdminEmail] = useState('');
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const result = await getAdminAuditLog(
      undefined,
      action || undefined,
      entityType || undefined,
      from ? new Date(from).toISOString() : undefined,
      to ? new Date(to).toISOString() : undefined,
      page,
      20,
    );
    if (result) {
      setData(result);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [action, entityType, from, to, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset pagina bij filter-wijziging
  const handleActionChange = (v: string) => { setAction(v); setPage(0); };
  const handleEntityTypeChange = (v: string) => { setEntityType(v); setPage(0); };
  const handleFromChange = (v: string) => { setFrom(v); setPage(0); };
  const handleToChange = (v: string) => { setTo(v); setPage(0); };

  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  // Filter op admin e-mail client-side (server heeft geen e-mail filter)
  const filtered = adminEmail
    ? items.filter((i) => i.adminEmail.toLowerCase().includes(adminEmail.toLowerCase()))
    : items;

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Overzicht van alle admin-mutaties op het platform
          </p>
        </div>
        {totalElements > 0 && (
          <span className="bg-slate-100 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">
            {totalElements} records
          </span>
        )}
      </div>

      {/* Foutmelding */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          Audit log kon niet worden geladen. Probeer het opnieuw.
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Admin e-mail filter (client-side) */}
          <div className="lg:col-span-1">
            <AdminSearchBar
              value={adminEmail}
              onChange={setAdminEmail}
              placeholder="Filter op admin e-mail…"
            />
          </div>

          {/* Actie filter */}
          <div>
            <select
              value={action}
              onChange={(e) => handleActionChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="">Alle acties</option>
              {AUDIT_ACTIONS.map((a) => (
                <option key={a} value={a}>{actionLabel(a)}</option>
              ))}
            </select>
          </div>

          {/* Entity type filter */}
          <div>
            <select
              value={entityType}
              onChange={(e) => handleEntityTypeChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="">Alle types</option>
              {ENTITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Datum van */}
          <div>
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => handleFromChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Datum tot — tweede rij */}
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="col-start-4">
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => handleToChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Tot datum"
            />
          </div>
        </div>

        {/* Filters wissen */}
        {(action || entityType || from || to || adminEmail) && (
          <div className="mt-3">
            <button
              onClick={() => {
                setAction(''); setEntityType('');
                setFrom(''); setTo('');
                setAdminEmail(''); setPage(0);
              }}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Filters wissen
            </button>
          </div>
        )}
      </div>

      {/* Tabel */}
      <AdminTable headers={TABLE_HEADERS} loading={loading} empty="Geen audit-records gevonden.">
        {filtered.map((entry) => (
          <tr key={entry.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
              {formatDate(entry.createdAt)}
            </td>
            <td className="px-4 py-3 text-sm text-slate-700 truncate max-w-[160px]">
              {entry.adminEmail}
            </td>
            <td className="px-4 py-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${actionColor(entry.action)}`}>
                {actionLabel(entry.action)}
              </span>
            </td>
            <td className="px-4 py-3 text-xs text-slate-500 uppercase tracking-wide">
              {entry.entityType}
            </td>
            <td className="px-4 py-3 text-sm text-slate-700 truncate max-w-[160px]">
              {entry.entityName ?? <span className="text-slate-400">—</span>}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              {entry.oldValue || entry.newValue ? (
                <span>
                  {entry.oldValue ? (
                    <span className="text-red-600 font-mono text-xs">{entry.oldValue}</span>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                  {' → '}
                  {entry.newValue ? (
                    <span className="text-emerald-600 font-mono text-xs">{entry.newValue}</span>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </span>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </td>
          </tr>
        ))}
        {!loading && filtered.length === 0 && (
          <AdminTableEmptyRow
            colSpan={TABLE_HEADERS.length}
            message="Geen audit-records gevonden."
          />
        )}
      </AdminTable>

      {/* Paginering */}
      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
