'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, ShieldAlert, Trash2 } from 'lucide-react';
import { getAdminUserById, updateAdminUserRole, deleteAdminUser } from '@/lib/api/admin';
import type { AdminUser } from '@/types/admin';
import AdminRoleBadge from '@/components/admin/AdminRoleBadge';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

type Role = 'ROLE_USER' | 'ROLE_EMPLOYER' | 'ROLE_ADMIN';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AdminGebruikerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Role update state
  const [selectedRole, setSelectedRole] = useState<Role>('ROLE_USER');
  const [roleModal, setRoleModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roleSuccess, setRoleSuccess] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Delete state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const data = await getAdminUserById(id);
    if (!data) {
      setError(true);
    } else {
      setUser(data);
      setSelectedRole(data.role);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleConfirm = async () => {
    if (!user) return;
    setSaving(true);
    setRoleError(null);
    const res = await updateAdminUserRole(user.id, selectedRole);
    setSaving(false);
    setRoleModal(false);
    if (res.success) {
      setRoleSuccess(true);
      setUser((prev) => prev ? { ...prev, role: selectedRole } : prev);
      setTimeout(() => setRoleSuccess(false), 3000);
    } else {
      setRoleError(res.error ?? 'Rol wijzigen mislukt.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteAdminUser(user.id);
    setDeleting(false);
    if (res.success) {
      router.push('/admin/gebruikers');
    } else {
      setDeleteModal(false);
      setDeleteError(res.error ?? 'Verwijderen mislukt.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <Link
          href="/admin/gebruikers"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Terug naar gebruikers
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
          Gebruiker niet gevonden of kon niet worden geladen.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link
        href="/admin/gebruikers"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Terug naar gebruikers
      </Link>

      {/* Gebruikersinfo card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-sky-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 truncate">{user.email}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <AdminRoleBadge role={user.role} />
              <span className="text-xs text-slate-400">ID: {user.id}</span>
              <span className="text-xs text-slate-400">Geregistreerd: {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {user.employerId && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Gekoppeld aan werkgever</p>
            <Link
              href={`/admin/werkgevers/${user.employerId}`}
              className="text-sm font-medium text-violet-700 hover:text-violet-800 transition-colors"
            >
              {user.employerName ?? `Werkgever #${user.employerId}`} →
            </Link>
          </div>
        )}
      </div>

      {/* Rol wijzigen */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Rol wijzigen</h2>
            <p className="text-xs text-slate-500">Huidige rol: <AdminRoleBadge role={user.role} size="sm" /></p>
          </div>
        </div>

        {roleSuccess && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-700 text-sm">
            Rol succesvol gewijzigd.
          </div>
        )}
        {roleError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            {roleError}
          </div>
        )}

        <div className="flex gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="ROLE_USER">Kandidaat</option>
            <option value="ROLE_EMPLOYER">Werkgever</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
          <button
            onClick={() => { setRoleError(null); setRoleModal(true); }}
            disabled={selectedRole === user.role}
            className="px-4 py-2.5 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Opslaan
          </button>
        </div>
      </div>

      {/* Gevaarzone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-red-700">Gevaarzone</h2>
            <p className="text-xs text-slate-500">Deze actie kan niet ongedaan worden gemaakt.</p>
          </div>
        </div>

        {deleteError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
            {deleteError}
          </div>
        )}

        <button
          onClick={() => { setDeleteError(null); setDeleteModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Gebruiker verwijderen
        </button>
      </div>

      {/* Role confirm modal */}
      <AdminConfirmModal
        open={roleModal}
        title="Rol wijzigen"
        message={`Weet je zeker dat je de rol van ${user.email} wilt wijzigen naar ${
          selectedRole === 'ROLE_USER' ? 'Kandidaat' :
          selectedRole === 'ROLE_EMPLOYER' ? 'Werkgever' : 'Admin'
        }?`}
        confirmLabel="Rol wijzigen"
        onConfirm={handleRoleConfirm}
        onCancel={() => setRoleModal(false)}
        loading={saving}
        variant="warning"
      />

      {/* Delete confirm modal */}
      <AdminConfirmModal
        open={deleteModal}
        title="Gebruiker verwijderen"
        message={`Weet je zeker dat je ${user.email} permanent wilt verwijderen? Dit verwijdert ook het kandidaatprofiel en alle sollicitaties. Deze actie kan niet ongedaan worden gemaakt.`}
        warning={
          user.isLastEmployerUser
            ? `⚠️ Deze gebruiker is de enige gekoppelde gebruiker van werkgever "${user.employerName ?? `#${user.employerId}`}". Na verwijdering heeft de werkgever geen actief account meer en zijn de vacatures onbeheerbaar.`
            : undefined
        }
        confirmLabel="Verwijderen"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(false)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
