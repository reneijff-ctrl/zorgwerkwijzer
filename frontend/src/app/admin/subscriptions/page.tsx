'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  CreditCard,
  Copy,
  Check,
  Banknote,
  Package,
  CalendarDays,
  Users,
  RefreshCw,
} from 'lucide-react'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminTable, { AdminTableEmptyRow } from '@/components/admin/AdminTable'
import AdminBadge from '@/components/admin/AdminBadge'
import AdminPagination from '@/components/admin/AdminPagination'
import { getAdminStats, getAdminSubscriptions } from '@/lib/api/admin'
import { AdminStats, AdminSubscription } from '@/types/admin'
import { PageResponse } from '@/types/api'
import Link from 'next/link'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatEuro(cents: number | null | undefined): string {
  if (cents == null) return '—'
  return `€ ${(cents / 100).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function isExpired(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

function calcMrrContribution(sub: AdminSubscription): number {
  if (!sub.priceMonthly && !sub.priceYearly) return 0
  if (sub.billingInterval === 'YEARLY' && sub.priceYearly) {
    return Math.round(sub.priceYearly / 12)
  }
  return sub.priceMonthly ?? 0
}

function truncateStripeId(id: string | null): string {
  if (!id) return '—'
  return id.length > 16 ? id.substring(0, 16) + '…' : id
}

// ── Pakket badge ──────────────────────────────────────────────────────────────

function PackageBadge({ name }: { name: string | null }) {
  if (!name) return <span className="text-slate-400 text-xs">—</span>
  const map: Record<string, string> = {
    STARTER:      'bg-slate-100 text-slate-700',
    PROFESSIONAL: 'bg-sky-100 text-sky-700',
    PREMIUM:      'bg-violet-100 text-violet-700',
  }
  const labels: Record<string, string> = {
    STARTER: 'Starter',
    PROFESSIONAL: 'Professional',
    PREMIUM: 'Premium',
  }
  const cls = map[name] ?? 'bg-slate-100 text-slate-500'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {labels[name] ?? name}
    </span>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string | null }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null
  const handleCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
      title="Kopieer Stripe ID"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

// ── Subscription tabelrij ─────────────────────────────────────────────────────

function StatusCell({ sub }: { sub: AdminSubscription }) {
  if (sub.cancelAtPeriodEnd && sub.status === 'ACTIVE') {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          Opgezegd per einde periode
        </span>
        {sub.currentPeriodEnd && (
          <span className="text-xs text-slate-400">eindigt {formatDate(sub.currentPeriodEnd)}</span>
        )}
      </div>
    )
  }
  if (sub.status === 'CANCELED') {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Beëindigd</span>
  }
  if (sub.status === 'PAST_DUE') {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Betaling mislukt</span>
  }
  return <AdminBadge status={sub.status} />
}

function SubscriptionRow({ sub }: { sub: AdminSubscription }) {
  const mrrContribution = calcMrrContribution(sub)
  const periodExpired = isExpired(sub.currentPeriodEnd)

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <Link
          href={`/admin/werkgevers/${sub.employerId}`}
          className="font-medium text-slate-900 hover:text-sky-600 transition-colors text-sm"
        >
          {sub.employerName}
        </Link>
        <div className="text-xs text-slate-400">{sub.employerEmail}</div>
      </td>
      <td className="px-4 py-3">
        <PackageBadge name={sub.packageName} />
      </td>
      <td className="px-4 py-3">
        <StatusCell sub={sub} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {sub.billingInterval === 'YEARLY' ? 'Jaarlijks' : sub.billingInterval === 'MONTHLY' ? 'Maandelijks' : '—'}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-slate-900">
        {mrrContribution > 0 ? formatEuro(mrrContribution) : <span className="text-slate-400">—</span>}
      </td>
      <td className={`px-4 py-3 text-sm ${periodExpired ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
        {formatDate(sub.currentPeriodEnd)}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {sub.trialEnd ? formatDate(sub.trialEnd) : <span className="text-slate-400">—</span>}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-emerald-700">
        {sub.lifetimeRevenue > 0 ? formatEuro(sub.lifetimeRevenue) : <span className="text-slate-400">—</span>}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center font-mono text-xs text-slate-500">
          {truncateStripeId(sub.stripeSubscriptionId)}
          <CopyButton value={sub.stripeSubscriptionId} />
        </div>
      </td>
    </tr>
  )
}

// ── Pagina ────────────────────────────────────────────────────────────────────

export default function AdminSubscriptionsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [subscriptions, setSubscriptions] = useState<PageResponse<AdminSubscription> | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingTable, setLoadingTable] = useState(true)
  const [errorStats, setErrorStats] = useState(false)
  const [errorTable, setErrorTable] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [canceledLast30Days, setCanceledLast30Days] = useState(false)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  // Laden van statistieken
  useEffect(() => {
    setLoadingStats(true)
    setErrorStats(false)
    getAdminStats().then(data => {
      if (data) setStats(data)
      else setErrorStats(true)
    }).finally(() => setLoadingStats(false))
  }, [])

  // Laden van subscription tabel
  const loadSubscriptions = useCallback(() => {
    setLoadingTable(true)
    setErrorTable(false)
    getAdminSubscriptions(
      statusFilter || undefined,
      undefined,
      canceledLast30Days || undefined,
      page,
      PAGE_SIZE
    ).then(data => {
      if (data) setSubscriptions(data)
      else setErrorTable(true)
    }).finally(() => setLoadingTable(false))
  }, [statusFilter, canceledLast30Days, page])

  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  // Reset pagina bij filterwijziging
  useEffect(() => {
    setPage(0)
  }, [statusFilter, canceledLast30Days])

  const totalPages = subscriptions?.totalPages ?? 0

  // MRR per pakket helpers
  const mrrByPackage = stats?.mrrByPackage ?? {}
  const starterMrr    = mrrByPackage['STARTER']      ?? 0
  const professionalMrr = mrrByPackage['PROFESSIONAL'] ?? 0
  const premiumMrr    = mrrByPackage['PREMIUM']      ?? 0

  return (
    <div className="space-y-8">
      {/* Topbar */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Abonnementen</h1>
        <p className="text-slate-500 text-sm mt-1">Subscription overzicht en omzetstatistieken</p>
      </div>

      {/* PAST_DUE waarschuwingsbanner */}
      {!loadingStats && (stats?.pastDueCount ?? 0) > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-amber-800 text-sm">
            <span className="font-semibold">{stats!.pastDueCount} werkgever(s)</span> hebben een achterstallige betaling.
          </p>
          <button
            onClick={() => { setStatusFilter('PAST_DUE'); setCanceledLast30Days(false) }}
            className="ml-auto text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0"
          >
            Toon achterstallige betalingen
          </button>
        </div>
      )}

      {/* Statistieken laden / fout */}
      {loadingStats && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {errorStats && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          Statistieken konden niet worden geladen.
        </div>
      )}

      {/* KPI-kaarten: Omzet */}
      {!loadingStats && stats && (
        <>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Recurring omzet</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminStatCard
                title="MRR"
                value={formatEuro(stats.mrr)}
                subtitle="Monthly Recurring Revenue"
                icon={TrendingUp}
                color="emerald"
              />
              <AdminStatCard
                title="ARR"
                value={formatEuro(stats.arr)}
                subtitle="Annual Run Rate (MRR × 12)"
                icon={TrendingUp}
                color="emerald"
              />
              <AdminStatCard
                title="Omzet deze maand"
                value={formatEuro(stats.revenueThisMonth)}
                subtitle="Subscriptions + credits"
                icon={CalendarDays}
                color="emerald"
              />
              <AdminStatCard
                title="Omzet vorige maand"
                value={formatEuro(stats.revenuePrevMonth)}
                subtitle="Subscriptions + credits"
                icon={CalendarDays}
                color="sky"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Totale omzet</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminStatCard
                title="Subscription omzet"
                value={formatEuro(stats.subscriptionRevenue)}
                subtitle="Alle abonnementen (all time)"
                icon={CreditCard}
                color="sky"
              />
              <AdminStatCard
                title="Credit omzet"
                value={formatEuro(stats.creditRevenue)}
                subtitle="Vacancy credits (all time)"
                icon={Banknote}
                color="violet"
              />
              <AdminStatCard
                title="Lifetime omzet"
                value={formatEuro(stats.lifetimeRevenue)}
                subtitle="Subscriptions + credits totaal"
                icon={TrendingUp}
                color="emerald"
              />
              <AdminStatCard
                title="Gem. per werkgever"
                value={formatEuro(stats.avgRevenuePerEmployer)}
                subtitle="Lifetime omzet / werkgevers"
                icon={Users}
                color="sky"
              />
            </div>
          </div>

          {/* KPI-kaarten: Status */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Status</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminStatCard
                title="Actieve abonnementen"
                value={stats.activeSubscriptions}
                subtitle="ACTIVE + TRIALING"
                icon={CheckCircle}
                color="sky"
              />
              <AdminStatCard
                title="Trialing"
                value={stats.trialingCount}
                subtitle="In proefperiode"
                icon={Clock}
                color="sky"
              />
              <AdminStatCard
                title="Achterstallig"
                value={stats.pastDueCount}
                subtitle="PAST_DUE — betaling mislukt"
                icon={AlertTriangle}
                color="amber"
              />
              <AdminStatCard
                title="Opgezegd (30 dagen)"
                value={stats.canceledLast30DaysCount}
                subtitle="Geannuleerd in afgelopen 30 dagen"
                icon={XCircle}
                color="rose"
              />
            </div>
          </div>

          {/* cancelAtPeriodEnd banner */}
          {stats.cancelAtPeriodEndCount > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-amber-800 text-sm">
                <span className="font-semibold">{stats.cancelAtPeriodEndCount} abonnement(en)</span> zijn opgezegd via Stripe en lopen af aan het einde van de huidige periode.
              </p>
              <button
                onClick={() => { setStatusFilter('ACTIVE'); setCanceledLast30Days(false) }}
                className="ml-auto text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0"
              >
                Toon actieve abonnementen
              </button>
            </div>
          )}

          {/* MRR per pakket */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">MRR per pakket</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Starter</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{formatEuro(starterMrr)}</p>
                    <p className="text-xs text-slate-500 mt-1">{stats.subscriptionsByPackage['STARTER'] ?? 0} abonnementen</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Professional</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{formatEuro(professionalMrr)}</p>
                    <p className="text-xs text-slate-500 mt-1">{stats.subscriptionsByPackage['PROFESSIONAL'] ?? 0} abonnementen</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Premium</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{formatEuro(premiumMrr)}</p>
                    <p className="text-xs text-slate-500 mt-1">{stats.subscriptionsByPackage['PREMIUM'] ?? 0} abonnementen</p>
                  </div>
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Credit verkopen sectie */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Credit verkopen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Totaal verkochte credits</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalCreditsSold}</p>
                    <p className="text-xs text-slate-500 mt-1">Omzet: {formatEuro(stats.creditRevenue)}</p>
                  </div>
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats.creditsByBundle ?? {}).map(([bundle, count]) => (
                    <div key={bundle} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{bundle === 'bundle3' ? '3-pack' : bundle === 'bundle5' ? '5-pack' : bundle}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700">{count} credits</span>
                        <span className="text-emerald-700 font-semibold">{formatEuro(stats.creditRevenueByBundle?.[bundle] ?? 0)}</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(stats.creditsByBundle ?? {}).length === 0 && (
                    <p className="text-slate-500 text-sm">Nog geen credit aankopen.</p>
                  )}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Bundel overzicht</p>
                <div className="space-y-3">
                  {[
                    { key: 'bundle3', label: '3-pack', credits: 3, price: '€ 99,00' },
                    { key: 'bundle5', label: '5-pack', credits: 5, price: '€ 149,00' },
                  ].map(b => (
                    <div key={b.key} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{b.label}</p>
                        <p className="text-xs text-slate-500">{b.credits} vacature plaatsingen</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-700">{b.price}</p>
                        <p className="text-xs text-slate-500">{stats.creditsByBundle?.[b.key] ?? 0} verkocht</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Subscription tabel */}
      <div>
        {/* Filter balk */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            <option value="">Alle statussen</option>
            <option value="ACTIVE">Actief</option>
            <option value="TRIALING">Trialing</option>
            <option value="PAST_DUE">Achterstallig</option>
            <option value="CANCELED">Opgezegd</option>
            <option value="INACTIVE">Inactief</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={canceledLast30Days}
              onChange={e => setCanceledLast30Days(e.target.checked)}
              className="rounded border-slate-300 bg-white text-sky-500 focus:ring-sky-500"
            />
            Opgezegd (laatste 30 dagen)
          </label>

          {(statusFilter || canceledLast30Days) && (
            <button
              onClick={() => { setStatusFilter(''); setCanceledLast30Days(false) }}
              className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
            >
              Filters wissen
            </button>
          )}

          <span className="ml-auto text-xs text-slate-500">
            {subscriptions?.totalElements ?? 0} resultaten
          </span>
        </div>

        {errorTable && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm mb-4">
            Abonnementen konden niet worden geladen.
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <AdminTable
            headers={['Werkgever', 'Pakket', 'Status', 'Interval', 'MRR bijdrage', 'Periode eind', 'Trial eind', 'Lifetime omzet', 'Stripe ID']}
            loading={loadingTable}
            empty="Geen abonnementen gevonden."
          >
            {(subscriptions?.content ?? []).length > 0
              ? (subscriptions!.content.map(sub => (
                  <SubscriptionRow key={sub.id} sub={sub} />
                )))
              : !loadingTable && (
                  <AdminTableEmptyRow colSpan={9} message="Geen abonnementen gevonden." />
                )
            }
          </AdminTable>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}
