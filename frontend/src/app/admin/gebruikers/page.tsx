'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Trash2 } from 'lucide-react';
import { getAdminUsers, deleteAdminUser } from '@/lib/api/admin';
import type { AdminUser } from '@/types/admin';
import type { PageResponse } from '@/types/api';
import AdminTable, { AdminTableEmptyRow } from '@/components/admin/AdminTable';
import AdminSearchBar from '@/components/admin/AdminSearchBar';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminRoleBadge from '@/components/admin/AdminRoleBadge';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

type RoleFilter = '' | 'ROLE_USER' | 'ROLE_EMPLOYER' | 'ROLE_ADMIN';

const TABLE_HEADERS = ['ID', 'E-mail', 'Rol', 'Werkgever', 'Geregistreerd', 'Acties'];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminGebruikersPage() {
  const [result, setResult] = useState<PageResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [q, setQ] = useState('');
  const [role, setRole] = useState<RoleFilter>('');
  const [page, setPage] = useState(0);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const data = await getAdminUsers(q || undefined, role || undefined, page, 20);
    if (!data) {
      setError(true);
    } else {
      setResult(data);
    }
    setLoading(false);
  }, [q, role, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset page when filters change
  const handleQChange = useCallback((newQ: string) => {
    setQ(newQ);
    setPage(0);
  }, []);

  const handleRoleChange = (newRole: RoleFilter) => {
    setRole(newRole);
    setPage(0);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setDeleteError(null);
    setDeleteModal({ open: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteAdminUser(deleteModal.user.id);
    setDeleting(false);
    if (res.success) {
      setDeleteModal({ open: false, user: null });
      load();
    } else {
      setDeleteError(res.error ?? 'Verwijderen mislukt.');
    }
  };

  const users = result?.content ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gebruikers</h1>
          <p className="text-slate-500 text-sm mt-1">
            {result ? `${result.totalElements} gebruikers totaal` : 'Laden...'}
          </p>
        </div>
        <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-sky-600" />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          Gebruikers konden niet worden geladen. Probeer de pagina te vernieuwen.
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <AdminSearchBar
          value={q}
          onChange={handleQChange}
          placeholder="Zoeken op e-mailadres..."
        />
        <select
          value={role}
          onChange={(e) => handleRoleChange(e.target.value as RoleFilter)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          <option value="">Alle rollen</option>
          <option value="ROLE_USER">Kandidaat</option>
          <option value="ROLE_EMPLOYER">Werkgever</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
      </div>

      {/* Delete error inline */}
      {deleteError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
          {deleteError}
        </div>
      )}

      {/* Table */}
      <AdminTable headers={TABLE_HEADERS} loading={loading}>
        {users.length === 0 && !loading ? (
          <AdminTableEmptyRow
            colSpan={TABLE_HEADERS.length}
            message="Geen gebruikers gevonden."
          />
        ) : (
          users.map((user) => (
            <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-xs text-slate-400">{user.id}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/gebruikers/${user.id}`}
                  className="font-medium text-slate-900 hover:text-violet-700 transition-colors"
                >
                  {user.email}
                </Link>
              </td>
              <td className="px-4 py-3">
                <AdminRoleBadge role={user.role} size="sm" />
              </td>
              <td className="px-4 py-3 text-sm text-slate-500">
                {user.employerId ? (
                  <Link
                    href={`/admin/werkgevers/${user.employerId}`}
                    className="hover:text-violet-700 transition-colors"
                  >
                    {user.employerName ?? `#${user.employerId}`}
                  </Link>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/gebruikers/${user.id}`}
                    className="text-xs font-medium text-slate-600 hover:text-violet-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-violet-200 transition-colors"
                  >
                    Bekijken
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Verwijder gebruiker"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      {/* Paginering */}
      {result && (
        <AdminPagination
          page={page}
          totalPages={result.totalPages ?? 0}
          onPageChange={setPage}
        />
      )}

      {/* Delete confirm modal */}
      <AdminConfirmModal
        open={deleteModal.open}
        title="Gebruiker verwijderen"
        message={
          deleteModal.user
            ? `Weet je zeker dat je ${deleteModal.user.email} wilt verwijderen? Dit verwijdert ook het kandidaatprofiel en alle sollicitaties. Deze actie kan niet ongedaan worden gemaakt.`
            : ''
        }
        warning={
          deleteModal.user?.isLastEmployerUser
            ? `⚠️ Deze gebruiker is de enige gekoppelde gebruiker van werkgever "${deleteModal.user.employerName ?? `#${deleteModal.user.employerId}`}". Na verwijdering heeft de werkgever geen actief account meer en zijn de vacatures onbeheerbaar.`
            : undefined
        }
        confirmLabel="Verwijderen"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, user: null })}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
