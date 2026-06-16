'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  CheckCircle,
  XCircle,
  ExternalLink,
  Building2,
  Briefcase,
  Euro,
  Clock,
  GraduationCap,
  FileText,
  Trash2,
} from 'lucide-react';
import {
  getAdminVacancyById,
  toggleAdminVacancyFeatured,
  toggleAdminVacancyActive,
  deleteAdminVacancy,
} from '@/lib/api/admin';
import type { AdminVacancyDetail } from '@/types/admin';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('nl-NL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function formatDateTime(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleString('nl-NL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const employmentTypeLabels: Record<string, string> = {
  VAST: 'Vast', TIJDELIJK: 'Tijdelijk', ZZP: 'ZZP',
  DETACHERING: 'Detachering', BIJBAAN: 'Bijbaan', STAGE: 'Stage',
};

const educationLevelLabels: Record<string, string> = {
  MBO2: 'MBO niveau 2', MBO3: 'MBO niveau 3', MBO4: 'MBO niveau 4',
  HBO: 'HBO', WO: 'WO', GEEN_VEREISTE: 'Geen vereiste',
};

// ── InfoRow helper ────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <dt className="text-sm text-slate-500 sm:w-40 shrink-0">{label}</dt>
      <dd className="text-sm text-slate-900 font-medium">{value || <span className="text-slate-400 font-normal">—</span>}</dd>
    </div>
  );
}

// ── Pagina ────────────────────────────────────────────────────────────────────

export default function AdminVacatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [vacancy, setVacancy] = useState<AdminVacancyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Toggles
  const [togglingFeatured, setTogglingFeatured] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);
  const [toggleSuccess, setToggleSuccess] = useState('');
  const [toggleError, setToggleError] = useState('');

  // Verwijderen
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      const data = await getAdminVacancyById(id);
      if (data) {
        setVacancy(data);
      } else {
        setError(true);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  const showSuccess = (msg: string) => {
    setToggleSuccess(msg);
    setTimeout(() => setToggleSuccess(''), 3000);
  };

  const handleToggleFeatured = async () => {
    if (!vacancy || togglingFeatured) return;
    setTogglingFeatured(true);
    setToggleError('');
    const result = await toggleAdminVacancyFeatured(vacancy.id);
    if (result.success && result.data) {
      setVacancy(prev => prev ? { ...prev, isFeatured: result.data!.isFeatured } : prev);
      showSuccess(result.data.isFeatured ? 'Vacature is nu featured.' : 'Featured status verwijderd.');
    } else {
      setToggleError('Wijziging mislukt. Probeer opnieuw.');
    }
    setTogglingFeatured(false);
  };

  const handleToggleActive = async () => {
    if (!vacancy || togglingActive) return;
    setTogglingActive(true);
    setToggleError('');
    const result = await toggleAdminVacancyActive(vacancy.id);
    if (result.success && result.data) {
      setVacancy(prev => prev ? { ...prev, isActive: result.data!.isActive } : prev);
      showSuccess(result.data.isActive ? 'Vacature is nu actief.' : 'Vacature is gedeactiveerd.');
    } else {
      setToggleError('Wijziging mislukt. Probeer opnieuw.');
    }
    setTogglingActive(false);
  };

  const handleDeleteConfirm = async () => {
    if (!vacancy) return;
    setDeleting(true);
    setDeleteError('');
    const result = await deleteAdminVacancy(vacancy.id);
    if (result.success) {
      router.push('/admin/vacatures');
    } else {
      setDeleteError(result.error ?? 'Verwijderen mislukt');
      setDeleting(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/vacatures')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar vacatures
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          Vacature kon niet worden geladen. Mogelijk bestaat deze niet meer.
        </div>
      </div>
    );
  }

  const salaryText = vacancy.salaryMin && vacancy.salaryMax
    ? `€${vacancy.salaryMin.toLocaleString('nl-NL')} – €${vacancy.salaryMax.toLocaleString('nl-NL')}`
    : vacancy.salaryMin
      ? `Vanaf €${vacancy.salaryMin.toLocaleString('nl-NL')}`
      : '—';

  const hoursText = vacancy.hoursMin && vacancy.hoursMax
    ? `${vacancy.hoursMin}–${vacancy.hoursMax} uur/week`
    : vacancy.hoursMin
      ? `${vacancy.hoursMin} uur/week`
      : '—';

  return (
    <div className="space-y-6">
      {/* Terugknop */}
      <button
        onClick={() => router.push('/admin/vacatures')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar vacatures
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{vacancy.title}</h1>
            <p className="text-slate-500 text-sm mt-1">
              ID: <span className="font-mono">{vacancy.id}</span>
              {' · '}Slug: <span className="font-mono">{vacancy.slug}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status badges */}
            <AdminBadge status={vacancy.isActive ? 'ACTIVE' : 'INACTIVE'} />
            {vacancy.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                <Star className="w-3 h-3 fill-amber-400" />
                Featured
              </span>
            )}

            {/* Publieke link */}
            <Link
              href={`/vacature/${vacancy.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Bekijk vacature
            </Link>
          </div>
        </div>
      </div>

      {/* Succes / foutmelding toggles */}
      {toggleSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-700 text-sm">
          {toggleSuccess}
        </div>
      )}
      {toggleError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          {toggleError}
        </div>
      )}

      {/* KPI rij */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{vacancy.applicationCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Sollicitaties</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-sm font-semibold text-slate-900">
            {vacancy.isActive ? (
              <span className="text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" /> Actief
              </span>
            ) : (
              <span className="text-slate-400 flex items-center justify-center gap-1">
                <XCircle className="w-4 h-4" /> Inactief
              </span>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Status</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-sm font-semibold text-slate-900">
            {vacancy.isFeatured ? (
              <span className="text-amber-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" /> Featured
              </span>
            ) : (
              <span className="text-slate-400">Standaard</span>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Uitlichting</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-sm font-semibold text-slate-900">{formatDate(vacancy.publishedAt)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Geplaatst</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Linkerkolom — vacaturegegevens + beschrijving */}
        <div className="lg:col-span-2 space-y-6">

          {/* Vacaturegegevens */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-slate-400" />
              Vacaturegegevens
            </h2>
            <dl className="space-y-3">
              <InfoRow label="Dienstverband" value={vacancy.employmentType ? employmentTypeLabels[vacancy.employmentType] ?? vacancy.employmentType : null} />
              <InfoRow label="Opleidingsniveau" value={vacancy.educationLevel ? educationLevelLabels[vacancy.educationLevel] ?? vacancy.educationLevel : null} />
              <InfoRow
                label="Salaris"
                value={
                  <span className="flex items-center gap-1">
                    <Euro className="w-3.5 h-3.5 text-slate-400" />
                    {salaryText}
                  </span>
                }
              />
              <InfoRow
                label="Uren"
                value={
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {hoursText}
                  </span>
                }
              />
              <InfoRow label="Stad ID" value={vacancy.cityId?.toString()} />
              <InfoRow label="Functie ID" value={vacancy.occupationId?.toString()} />
              <InfoRow label="Verloopt op" value={formatDate(vacancy.expiresAt)} />
            </dl>
          </div>

          {/* Beschrijving */}
          {vacancy.description && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-slate-400" />
                Omschrijving
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {vacancy.description}
              </div>
            </div>
          )}

          {/* Eisen */}
          {vacancy.requirements && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                Eisen en wensen
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {vacancy.requirements}
              </div>
            </div>
          )}

          {/* SEO */}
          {(vacancy.seoTitle || vacancy.seoDescription) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900 mb-4">SEO</h2>
              <dl className="space-y-3">
                <InfoRow label="SEO titel" value={vacancy.seoTitle} />
                <InfoRow label="SEO beschrijving" value={vacancy.seoDescription} />
              </dl>
            </div>
          )}
        </div>

        {/* Rechterkolom — werkgever + beheer */}
        <div className="space-y-6">

          {/* Werkgeversinformatie */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-slate-400" />
              Werkgever
            </h2>
            {vacancy.employerId ? (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-slate-900">{vacancy.employerName}</p>
                  {vacancy.employerEmail && (
                    <p className="text-sm text-slate-500">{vacancy.employerEmail}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/admin/werkgevers/${vacancy.employerId}`}
                    className="flex items-center gap-1.5 text-sm text-sky-600 hover:underline"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Werkgever beheren
                  </Link>
                  {vacancy.employerSlug && (
                    <Link
                      href={`/werkgevers/${vacancy.employerSlug}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-sm text-sky-600 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Publiek profiel
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Geen werkgever gekoppeld</p>
            )}
          </div>

          {/* Statusbeheer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Statusbeheer</h2>
            <div className="space-y-3">
              {/* Actief toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Actief</p>
                  <p className="text-xs text-slate-500">Zichtbaar voor kandidaten</p>
                </div>
                <button
                  onClick={handleToggleActive}
                  disabled={togglingActive}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                    vacancy.isActive ? 'bg-emerald-500' : 'bg-slate-200'
                  } disabled:opacity-50`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      vacancy.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Featured</p>
                  <p className="text-xs text-slate-500">Uitgelicht bovenaan</p>
                </div>
                <button
                  onClick={handleToggleFeatured}
                  disabled={togglingFeatured}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    vacancy.isFeatured ? 'bg-amber-400' : 'bg-slate-200'
                  } disabled:opacity-50`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      vacancy.isFeatured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Tijdstempels */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Tijdstempels</h2>
            <dl className="space-y-3">
              <InfoRow label="Aangemaakt" value={formatDateTime(vacancy.createdAt)} />
              <InfoRow label="Bijgewerkt" value={formatDateTime(vacancy.updatedAt)} />
              <InfoRow label="Geplaatst" value={formatDateTime(vacancy.publishedAt)} />
              <InfoRow label="Verloopt" value={formatDate(vacancy.expiresAt)} />
              {vacancy.isFeatured && (
                <InfoRow label="Uitgelicht tot" value={formatDate(vacancy.featuredUntil)} />
              )}
            </dl>
          </div>

          {/* Gevaarzone */}
          <div className="bg-white rounded-2xl border border-red-200 p-6">
            <h2 className="text-base font-semibold text-red-700 mb-2">Gevaarzone</h2>
            <p className="text-sm text-slate-500 mb-4">
              Het verwijderen van een vacature is permanent en kan niet ongedaan worden gemaakt.
              {vacancy.applicationCount > 0 && (
                <span className="block mt-1 text-amber-600 font-medium">
                  Let op: deze vacature heeft {vacancy.applicationCount} sollicitatie{vacancy.applicationCount !== 1 ? 's' : ''}.
                </span>
              )}
            </p>
            <button
              onClick={() => { setDeleteError(''); setShowDeleteModal(true); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Vacature verwijderen
            </button>
            {deleteError && (
              <p className="mt-2 text-sm text-red-600">{deleteError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Verwijder bevestiging */}
      <AdminConfirmModal
        open={showDeleteModal}
        variant="danger"
        title="Vacature verwijderen"
        message={`Weet je zeker dat je "${vacancy.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
        confirmLabel="Definitief verwijderen"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteModal(false); setDeleteError(''); }}
        loading={deleting}
      />
    </div>
  );
}
