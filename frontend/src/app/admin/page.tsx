'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  FileText,
  Star,
  TrendingUp,
  CreditCard,
  UserPlus,
  ArrowRight,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Mail,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAdminStats } from '@/lib/api/admin';
import { getCurrentUser } from '@/lib/api/auth';
import { getContactMessageStats, getRecentContactMessages, type ContactMessageStatsDto, type ContactMessageDto } from '@/lib/api/contact-messages';
import type { AdminStats } from '@/types/admin';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminBadge from '@/components/admin/AdminBadge';

function formatMrr(cents: number): string {
  if (!cents) return '—';
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(user?.twoFactorEnabled ?? false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contactStats, setContactStats] = useState<ContactMessageStatsDto | null>(null);
  const [recentMessages, setRecentMessages] = useState<ContactMessageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      const [data, currentUser, contactData, recentData] = await Promise.all([
        getAdminStats(),
        token ? getCurrentUser(token) : Promise.resolve(null),
        token ? getContactMessageStats(token).catch(() => null) : Promise.resolve(null),
        token ? getRecentContactMessages(token).catch(() => []) : Promise.resolve([]),
      ]);
      if (contactData) setContactStats(contactData);
      setRecentMessages(recentData as ContactMessageDto[]);
      if (!data) {
        setError(true);
      } else {
        setStats(data);
      }
      if (currentUser) {
        setTwoFactorEnabled(currentUser.twoFactorEnabled ?? false);
      }
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        <p className="font-semibold">Statistieken konden niet worden geladen.</p>
        <p className="text-sm mt-1 text-red-500">Controleer of de backend bereikbaar is en probeer opnieuw.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overzicht</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform statistieken en recente activiteit.</p>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <AdminStatCard
          title="Totaal gebruikers"
          value={stats.totalUsers}
          subtitle={`+${stats.newUsersLast30Days} afgelopen 30 dagen`}
          icon={Users}
          color="sky"
        />
        <AdminStatCard
          title="Kandidaten"
          value={stats.totalCandidates}
          icon={UserCheck}
          color="emerald"
        />
        <AdminStatCard
          title="Werkgevers"
          value={stats.totalEmployers}
          subtitle={`+${stats.newEmployersLast30Days} afgelopen 30 dagen`}
          icon={Building2}
          color="violet"
        />
        <AdminStatCard
          title="Actieve vacatures"
          value={stats.activeVacancies}
          subtitle={`${stats.totalVacancies} totaal`}
          icon={Briefcase}
          color="amber"
        />
        <AdminStatCard
          title="Sollicitaties"
          value={stats.totalApplications}
          icon={FileText}
          color="sky"
        />
        <AdminStatCard
          title="Featured vacatures"
          value={stats.featuredVacancies}
          icon={Star}
          color="amber"
        />
      </div>

      {/* Omzet KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard
          title="MRR"
          value={formatMrr(stats.mrr)}
          subtitle="Monthly Recurring Revenue"
          icon={TrendingUp}
          color="emerald"
        />
        <AdminStatCard
          title="Actieve abonnementen"
          value={stats.activeSubscriptions || '—'}
          icon={CreditCard}
          color="sky"
        />
        <AdminStatCard
          title="Nieuwe werkgevers"
          value={stats.newEmployersLast30Days}
          subtitle="Afgelopen 30 dagen"
          icon={UserPlus}
          color="violet"
        />
        <AdminStatCard
          title="Nieuwe gebruikers"
          value={stats.newUsersLast30Days}
          subtitle="Afgelopen 30 dagen"
          icon={UserPlus}
          color="amber"
        />
      </div>

      {/* Beveiliging kaart */}
      {!twoFactorEnabled && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Uw admin account is nog niet beveiligd met Two-Factor Authentication.</p>
            <p className="text-xs text-amber-600 mt-0.5">Activeer 2FA om uw account te beschermen tegen ongeautoriseerde toegang.</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${twoFactorEnabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
              <Lock className={`w-6 h-6 ${twoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500 mt-0.5">Extra beveiliging voor uw admin account</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {twoFactorEnabled ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                2FA Actief
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                <ShieldAlert className="w-3.5 h-3.5" />
                Uitgeschakeld
              </span>
            )}
            <Link
              href="/admin/instellingen/2fa"
              className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:underline"
            >
              Instellingen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contactberichten widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Contactberichten</p>
              <p className="text-xs text-slate-500">Inkomende berichten van bezoekers</p>
            </div>
          </div>
          <Link
            href="/admin/contact-berichten"
            className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:underline"
          >
            Bekijken <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-slate-700">{contactStats?.total ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Totaal</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{contactStats?.newCount ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Nieuw</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{contactStats?.inProgressCount ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">In behandeling</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{contactStats?.resolvedCount ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Afgehandeld</p>
          </div>
        </div>

        {/* Recente contactberichten tabel */}
        {recentMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2 pr-4">Naam</th>
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2 pr-4">E-mail</th>
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2 pr-4">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2 pr-4">Datum</th>
                  <th className="text-left text-xs font-semibold text-slate-500 pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td className="py-2 pr-4 font-medium text-slate-900 truncate max-w-[120px]">{msg.name}</td>
                    <td className="py-2 pr-4 text-slate-500 truncate max-w-[160px]">{msg.email}</td>
                    <td className="py-2 pr-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        msg.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                        msg.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {msg.status === 'NEW' ? 'Nieuw' : msg.status === 'IN_PROGRESS' ? 'In behandeling' : 'Afgehandeld'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-slate-400 text-xs whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                    <td className="py-2">
                      <Link
                        href={`/admin/contact-berichten/${msg.id}`}
                        className="text-violet-600 hover:underline text-xs font-medium"
                      >
                        Bekijken
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">Nog geen contactberichten ontvangen.</p>
        )}
      </div>

      {/* Recente activiteit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recente werkgevers */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recente werkgevers</h2>
            <Link
              href="/admin/werkgevers"
              className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:underline"
            >
              Alle werkgevers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stats.recentEmployers.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-400 text-sm">Nog geen werkgevers geregistreerd.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentEmployers.map((employer) => (
                <li key={employer.id} className="flex items-center justify-between px-6 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/werkgevers/${employer.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-violet-600 transition-colors truncate block"
                    >
                      {employer.name}
                    </Link>
                    <p className="text-xs text-slate-400">{formatDate(employer.createdAt)}</p>
                  </div>
                  <div className="ml-4 shrink-0">
                    <AdminBadge status={employer.subscriptionStatus} size="sm" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recente vacatures */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recente vacatures</h2>
            <Link
              href="/admin/vacatures"
              className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:underline"
            >
              Alle vacatures <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stats.recentVacancies.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-400 text-sm">Nog geen vacatures geplaatst.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentVacancies.map((vacancy) => (
                <li key={vacancy.id} className="flex items-center justify-between px-6 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/vacature/${vacancy.slug}`}
                      target="_blank"
                      className="text-sm font-medium text-slate-900 hover:text-violet-600 transition-colors truncate block"
                    >
                      {vacancy.title}
                    </Link>
                    <p className="text-xs text-slate-400 truncate">{vacancy.employerName}</p>
                  </div>
                  <div className="ml-4 shrink-0 flex items-center gap-2">
                    {vacancy.isFeatured && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        vacancy.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {vacancy.isActive ? 'Actief' : 'Inactief'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
