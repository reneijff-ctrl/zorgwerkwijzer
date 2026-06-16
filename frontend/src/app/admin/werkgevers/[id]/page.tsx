'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Globe,
  Briefcase,
  Users,
  CreditCard,
  Star,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { getAdminEmployerById } from '@/lib/api/admin';
import type { AdminEmployerDetail, AdminVacancySummary, AdminUser } from '@/types/admin';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminRoleBadge from '@/components/admin/AdminRoleBadge';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 shrink-0 w-44">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-right">{value ?? '—'}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-violet-600" />
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminWerkgeverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [employer, setEmployer] = useState<AdminEmployerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    getAdminEmployerById(Number(id)).then((data) => {
      if (!data) {
        setError(true);
      } else {
        setEmployer(data);
      }
      setLoading(false);
    });
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Error / not found state
  if (error || !employer) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/werkgevers')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar werkgevers
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
          Werkgever niet gevonden of kon niet worden geladen.
        </div>
      </div>
    );
  }

  const hasSubscription = !!(employer.stripeSubscriptionId || employer.subscriptionStatus);
  const vacancies: AdminVacancySummary[] = employer.vacancies ?? [];
  const linkedUsers: AdminUser[] = employer.linkedUsers ?? [];
  const activeVacancyCount = vacancies.filter((v) => v.isActive).length;
  const featuredVacancyCount = vacancies.filter((v) => v.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/werkgevers')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{employer.name}</h1>
            <AdminBadge status={employer.subscriptionStatus} fallback="Geen abonnement" />
            {employer.packageName && <AdminBadge status={employer.packageName} />}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Werkgever ID #{employer.id}</p>
        </div>
        {employer.slug && (
          <a
            href={`/werkgevers/${employer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-violet-600 border border-violet-200 rounded-xl hover:bg-violet-50 transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Publiek profiel
          </a>
        )}
      </div>

      {/* KPI-rij */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Actieve vacatures', value: activeVacancyCount, icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
          { label: 'Totaal vacatures', value: vacancies.length, icon: Building2, color: 'text-violet-600 bg-violet-50' },
          { label: 'Featured', value: featuredVacancyCount, icon: Star, color: 'text-amber-600 bg-amber-50' },
          { label: 'Gekoppelde gebruikers', value: linkedUsers.length, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Twee-koloms grid: werkgeversinformatie + abonnement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Werkgeversinformatie */}
        <SectionCard title="Werkgeversinformatie" icon={Building2}>
          <div>
            <InfoRow label="Naam" value={employer.name} />
            <InfoRow
              label="E-mail"
              value={
                <a href={`mailto:${employer.email}`} className="text-violet-600 hover:underline">
                  {employer.email}
                </a>
              }
            />
            <InfoRow label="Telefoon" value={employer.phoneNumber} />
            <InfoRow label="Adres" value={employer.address} />
            <InfoRow label="Stad" value={employer.city} />
            <InfoRow label="Medewerkers" value={employer.employeeCount} />
            <InfoRow
              label="Website"
              value={
                employer.websiteUrl ? (
                  <a
                    href={employer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline flex items-center gap-1 justify-end"
                  >
                    {employer.websiteUrl.replace(/^https?:\/\//, '')}
                    <Globe className="w-3 h-3" />
                  </a>
                ) : null
              }
            />
            <InfoRow label="Geregistreerd" value={formatDate(employer.createdAt)} />
          </div>
        </SectionCard>

        {/* Abonnement — Stripe-ready */}
        <SectionCard title="Abonnement" icon={CreditCard}>
          {!hasSubscription ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                <CreditCard className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">Geen actief abonnement</p>
              <p className="text-xs text-slate-400 mt-1">
                Beschikbaar na Stripe-integratie
              </p>
            </div>
          ) : (
            <div>
              <InfoRow label="Pakket" value={<AdminBadge status={employer.packageName} fallback="Onbekend" />} />
              <InfoRow label="Status" value={<AdminBadge status={employer.subscriptionStatus} />} />
              <InfoRow label="Interval" value={
                employer.billingInterval === 'MONTHLY' ? 'Maandelijks' :
                employer.billingInterval === 'YEARLY' ? 'Jaarlijks' :
                employer.billingInterval
              } />
              <InfoRow label="Periode eind" value={formatDate(employer.currentPeriodEnd)} />
              {employer.canceledAt && (
                <InfoRow label="Opgezegd op" value={formatDate(employer.canceledAt)} />
              )}
              <InfoRow
                label="Stripe Customer"
                value={employer.stripeCustomerId ? (
                  <span className="font-mono text-xs text-slate-500 break-all">
                    {employer.stripeCustomerId}
                  </span>
                ) : null}
              />
              <InfoRow
                label="Stripe Subscription"
                value={employer.stripeSubscriptionId ? (
                  <span className="font-mono text-xs text-slate-500 break-all">
                    {employer.stripeSubscriptionId}
                  </span>
                ) : null}
              />
            </div>
          )}
        </SectionCard>
      </div>

      {/* Vacatures */}
      <SectionCard title={`Vacatures (${vacancies.length})`} icon={Briefcase}>
        {vacancies.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">Geen vacatures geplaatst.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {vacancies.slice(0, 10).map((vacancy) => (
              <div key={vacancy.id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    {vacancy.isActive ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                    {vacancy.isFeatured && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-800 truncate">{vacancy.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(vacancy.publishedAt)}
                  </span>
                  <a
                    href={`/vacature/${vacancy.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
            {vacancies.length > 10 && (
              <div className="pt-3">
                <Link
                  href={`/admin/vacatures?employerId=${employer.id}`}
                  className="text-xs text-violet-600 hover:text-violet-800 transition-colors"
                >
                  Bekijk alle {vacancies.length} vacatures →
                </Link>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* Gekoppelde gebruikers */}
      <SectionCard title={`Gekoppelde gebruikers (${linkedUsers.length})`} icon={Users}>
        {linkedUsers.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">
            Geen gebruikers gekoppeld aan deze werkgever.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {linkedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-slate-500">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{user.email}</p>
                    <p className="text-xs text-slate-400">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <AdminRoleBadge role={user.role} />
                  <Link
                    href={`/admin/gebruikers/${user.id}`}
                    className="text-xs text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Bekijken
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
