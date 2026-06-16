'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard, CheckCircle2, XCircle, AlertTriangle, Zap,
  Star, Building2, ArrowUpRight, ExternalLink, RefreshCw,
  Clock, Check,
} from 'lucide-react';
import { clsx } from 'clsx';
import type {
  SubscriptionPackage,
  EmployerSubscription,
  BundleType,
  VacancyCreditStatusDto,
  CreditTransactionDto,
} from '@/types/subscription';
import {
  getSubscriptionPackages,
  getCurrentSubscription,
  createCheckoutSession,
  createCustomerPortalSession,
  syncSubscriptionWithStripe,
  changeSubscriptionPackage,
} from '@/lib/api/subscriptions';
import { createVacancyCreditCheckout, getVacancyCreditStatus } from '@/lib/api/payments';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getStatusLabel(status: EmployerSubscription['status']): string {
  const map: Record<EmployerSubscription['status'], string> = {
    ACTIVE: 'Actief',
    TRIALING: 'Proefperiode',
    PAST_DUE: 'Betaling achterstallig',
    CANCELED: 'Opgezegd',
    INACTIVE: 'Inactief',
    UNPAID: 'Niet betaald',
  };
  return map[status] ?? status;
}

function getStatusColor(status: EmployerSubscription['status']): string {
  const map: Record<EmployerSubscription['status'], string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    TRIALING: 'bg-sky-100 text-sky-700',
    PAST_DUE: 'bg-amber-100 text-amber-700',
    CANCELED: 'bg-red-100 text-red-700',
    INACTIVE: 'bg-slate-100 text-slate-500',
    UNPAID: 'bg-red-100 text-red-700',
  };
  return map[status] ?? 'bg-slate-100 text-slate-500';
}

function isSubscriptionActive(status: EmployerSubscription['status']): boolean {
  return status === 'ACTIVE' || status === 'TRIALING';
}

// ─── Pakket icoon ────────────────────────────────────────────────────────────

function PackageIcon({ name }: { name: string }) {
  if (name === 'PREMIUM') return <Star className="w-6 h-6" />;
  if (name === 'PROFESSIONAL') return <Building2 className="w-6 h-6" />;
  return <Zap className="w-6 h-6" />;
}

function PackageAccentColor(name: string) {
  if (name === 'PREMIUM') return {
    bg: 'bg-violet-600',
    light: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    ring: 'ring-2 ring-violet-400',
    btn: 'bg-violet-600 hover:bg-violet-700 text-white',
    btnOutline: 'border-2 border-violet-600 text-violet-700 hover:bg-violet-50',
  };
  if (name === 'PROFESSIONAL') return {
    bg: 'bg-sky-600',
    light: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    ring: 'ring-2 ring-sky-400',
    btn: 'bg-sky-600 hover:bg-sky-700 text-white',
    btnOutline: 'border-2 border-sky-600 text-sky-700 hover:bg-sky-50',
  };
  return {
    bg: 'bg-slate-600',
    light: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    ring: 'ring-2 ring-slate-400',
    btn: 'bg-slate-700 hover:bg-slate-800 text-white',
    btnOutline: 'border-2 border-slate-400 text-slate-700 hover:bg-slate-50',
  };
}

// ─── Feature list ────────────────────────────────────────────────────────────

function FeatureRow({ available, label }: { available: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      {available
        ? <Check className="w-4 h-4 text-emerald-500 shrink-0" />
        : <XCircle className="w-4 h-4 text-slate-300 shrink-0" />}
      <span className={available ? 'text-slate-700' : 'text-slate-400'}>{label}</span>
    </li>
  );
}

// ─── Huidig abonnement kaart ─────────────────────────────────────────────────

function CurrentSubscriptionCard({
  subscription,
  packages,
  onOpenPortal,
  portalLoading,
}: {
  subscription: EmployerSubscription;
  packages: SubscriptionPackage[];
  onOpenPortal: () => void;
  portalLoading: boolean;
}) {
  const pkg = packages.find((p) => p.name === subscription.packageName);
  const active = isSubscriptionActive(subscription.status);
  const colors = PackageAccentColor(subscription.packageName);

  return (
    <div className={clsx('bg-white rounded-2xl border p-6', colors.border)}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-white', colors.bg)}>
            <PackageIcon name={subscription.packageName} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{subscription.packageDisplayName}</h2>
            {subscription.cancelAtPeriodEnd && subscription.status === 'ACTIVE' ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Eindigt binnenkort
              </span>
            ) : (
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', getStatusColor(subscription.status))}>
                {getStatusLabel(subscription.status)}
              </span>
            )}
          </div>
        </div>

        {active && (
          <button
            onClick={onOpenPortal}
            disabled={portalLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {portalLoading
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <ExternalLink className="w-4 h-4" />}
            Beheer abonnement
          </button>
        )}
      </div>

      {/* Details raster */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Facturering</p>
          <p className="text-sm font-semibold text-slate-900">
            {subscription.billingInterval === 'YEARLY' ? 'Jaarlijks' : 'Maandelijks'}
          </p>
        </div>

        {pkg && (
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Bedrag</p>
            <p className="text-sm font-semibold text-slate-900">
              {subscription.billingInterval === 'YEARLY'
                ? `${formatPrice(pkg.priceYearly)}/jr`
                : `${formatPrice(pkg.priceMonthly)}/mnd`}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-slate-500 mb-0.5">
            {subscription.cancelAtPeriodEnd ? 'Abonnement stopt op' : 'Volgende factuurdatum'}
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {active ? formatDate(subscription.cancelAtPeriodEnd ? subscription.periodEndDate : subscription.currentPeriodEnd) : '—'}
          </p>
        </div>

        {pkg && (
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Vacaturelimiet</p>
            <p className="text-sm font-semibold text-slate-900">
              {pkg.maxActiveVacancies == null ? 'Onbeperkt' : `${pkg.maxActiveVacancies} actief`}
            </p>
          </div>
        )}
      </div>

      {subscription.cancelAtPeriodEnd && subscription.status === 'ACTIVE' && (
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Uw abonnement is opgezegd en blijft actief tot {formatDate(subscription.periodEndDate)}.
            {' '}Na deze datum vervallen uw abonnementsvoordelen.
          </span>
        </div>
      )}

      {subscription.status === 'PAST_DUE' && (
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Betaling mislukt. Open het facturatieportaal om uw betaalmethode bij te werken.</span>
        </div>
      )}

      {subscription.status === 'CANCELED' && (
        <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Abonnement opgezegd{subscription.canceledAt ? ` op ${formatDate(subscription.canceledAt)}` : ''}.
            Kies hieronder een pakket om opnieuw te abonneren.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Pakket kaart ────────────────────────────────────────────────────────────

function PackageCard({
  pkg,
  isCurrent,
  billingInterval,
  onSelect,
  loading,
  actionLabel,
}: {
  pkg: SubscriptionPackage;
  isCurrent: boolean;
  billingInterval: 'MONTHLY' | 'YEARLY';
  onSelect: () => void;
  loading: boolean;
  actionLabel?: string;
}) {
  const colors = PackageAccentColor(pkg.name);
  const price = billingInterval === 'YEARLY' ? pkg.priceYearly : pkg.priceMonthly;
  const pricePerMonth = billingInterval === 'YEARLY' ? Math.round(pkg.priceYearly / 12) : pkg.priceMonthly;
  const isPremium = pkg.name === 'PREMIUM';

  return (
    <div className={clsx(
      'relative bg-white rounded-2xl border flex flex-col',
      isCurrent ? colors.ring : 'border-slate-200',
      isPremium && !isCurrent ? 'border-violet-200' : '',
    )}>
      {isCurrent && (
        <div className={clsx('absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white', colors.bg)}>
          Huidig pakket
        </div>
      )}

      {isPremium && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white">
          Meest compleet
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center text-white', colors.bg)}>
            <PackageIcon name={pkg.name} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{pkg.displayName}</h3>
          </div>
        </div>

        {/* Prijs */}
        <div className="mb-5">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(pricePerMonth)}
            </span>
            <span className="text-slate-500 text-sm mb-1">/mnd</span>
          </div>
          {billingInterval === 'YEARLY' && (
            <p className="text-xs text-slate-500 mt-0.5">
              Jaarlijks gefactureerd als {formatPrice(price)}
              <span className="ml-1 font-semibold text-emerald-600">(20% korting)</span>
            </p>
          )}
          {billingInterval === 'MONTHLY' && (
            <p className="text-xs text-slate-500 mt-0.5">
              Maandelijks opgezegd mogelijk
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          <FeatureRow
            available
            label={pkg.maxActiveVacancies == null ? 'Onbeperkt actieve vacatures' : `${pkg.maxActiveVacancies} actieve vacatures`}
          />
          <FeatureRow available={pkg.canViewCv} label="CV-download" />
          <FeatureRow available={pkg.canSeeApplicantContact} label="Contactgegevens kandidaat" />
          <FeatureRow available={pkg.isFeaturedIncluded} label="Uitgelichte vacatures" />
        </ul>

        {/* CTA */}
        {isCurrent ? (
          <button
            disabled
            className={clsx('w-full py-2.5 rounded-xl text-sm font-semibold cursor-default', colors.light, colors.text)}
          >
            Huidig pakket
          </button>
        ) : (
          <button
            onClick={onSelect}
            disabled={loading}
            className={clsx(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60',
              colors.btn,
            )}
          >
            {loading
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <ArrowUpRight className="w-4 h-4" />}
            {actionLabel ? `${actionLabel} ${pkg.displayName}` : `Kies ${pkg.displayName}`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Hoofd pagina component ───────────────────────────────────────────────────

function AbonnementPageInner() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [subscription, setSubscription] = useState<EmployerSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<number | null>(null);
  const [changeLoadingId, setChangeLoadingId] = useState<number | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Credits state
  const [creditStatus, setCreditStatus] = useState<VacancyCreditStatusDto | null>(null);
  const [creditLoadingBundle, setCreditLoadingBundle] = useState<BundleType | null>(null);

  // Verwerk checkout=success / checkout=canceled / credits_success
  useEffect(() => {
    const checkout = searchParams.get('checkout');
    const creditsSuccess = searchParams.get('credits_success');
    if (checkout === 'success') {
      setSuccessBanner('Bedankt! Uw abonnement is geactiveerd. Het kan even duren voordat de status bijgewerkt is.');
    } else if (checkout === 'canceled') {
      setError('Betaling geannuleerd. Uw abonnement is niet gewijzigd.');
    } else if (creditsSuccess === 'true') {
      const bundle = searchParams.get('bundle');
      const bundleLabel = bundle === 'single' ? '1 vacature credit' : bundle === 'bundle3' ? '3 vacature credits' : '5 vacature credits';
      setSuccessBanner(`Betaling geslaagd! ${bundleLabel} toegevoegd aan uw account.`);
    }
  }, [searchParams]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [pkgs, sub, credits] = await Promise.all([
      getSubscriptionPackages(),
      getCurrentSubscription(),
      getVacancyCreditStatus(),
    ]);
    setPackages(pkgs);
    setSubscription(sub);
    setCreditStatus(credits);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-dismiss success banner
  useEffect(() => {
    if (!successBanner) return;
    const t = setTimeout(() => setSuccessBanner(null), 8000);
    return () => clearTimeout(t);
  }, [successBanner]);

  const handleCheckout = async (pkg: SubscriptionPackage) => {
    setCheckoutLoadingId(pkg.id);
    setError(null);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const result = await createCheckoutSession(
      pkg.id,
      billingInterval,
      `${origin}/dashboard/abonnement?checkout=success`,
      `${origin}/dashboard/abonnement?checkout=canceled`,
    );
    if (!result.success) {
      setError(result.error);
      setCheckoutLoadingId(null);
      return;
    }
    window.location.href = result.data.checkoutUrl;
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    setError(null);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const result = await createCustomerPortalSession(`${origin}/dashboard/abonnement`);
    if (!result.success) {
      setError(result.error);
      setPortalLoading(false);
      return;
    }
    window.location.href = result.data.portalUrl;
  };

  const handleSync = async () => {
    setSyncLoading(true);
    setError(null);
    const result = await syncSubscriptionWithStripe();
    if (!result.success) {
      setError(result.error);
      setSyncLoading(false);
      return;
    }
    setSubscription(result.data);
    setSuccessBanner('Abonnement gesynchroniseerd met Stripe. Status is nu bijgewerkt.');
    setSyncLoading(false);
  };

  const handleChange = async (pkg: SubscriptionPackage) => {
    setChangeLoadingId(pkg.id);
    setError(null);
    const result = await changeSubscriptionPackage({ packageId: pkg.id, billingInterval });
    if (!result.success) {
      setError(result.error);
      setChangeLoadingId(null);
      return;
    }
    setSubscription(result.data);
    setSuccessBanner(`Abonnement gewijzigd naar ${pkg.displayName}. Proratie wordt verrekend op uw volgende factuur.`);
    setChangeLoadingId(null);
  };

  const handleCreditCheckout = async (bundleType: BundleType) => {
    setCreditLoadingBundle(bundleType);
    setError(null);
    const result = await createVacancyCreditCheckout(bundleType);
    if (!result.success) {
      setError(result.error);
      setCreditLoadingBundle(null);
      return;
    }
    window.location.href = result.checkoutUrl;
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasActiveSubscription = subscription && isSubscriptionActive(subscription.status);

  return (
    <div className="max-w-5xl">
      {/* Pagina header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-sky-600" />
            Abonnement
          </h1>
          <p className="text-slate-500 mt-1">
            Beheer uw abonnement en kies het pakket dat bij uw organisatie past.
          </p>
        </div>
        {subscription && (
          <button
            onClick={handleSync}
            disabled={syncLoading}
            title="Synchroniseer de abonnementsstatus met Stripe"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
            {syncLoading ? 'Synchroniseren…' : 'Sync met Stripe'}
          </button>
        )}
      </div>

      {/* Succes banner */}
      {successBanner && (
        <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-700">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{successBanner}</p>
        </div>
      )}

      {/* Fout banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Huidig abonnement */}
      {subscription && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Huidig abonnement</h2>
          <CurrentSubscriptionCard
            subscription={subscription}
            packages={packages}
            onOpenPortal={handlePortal}
            portalLoading={portalLoading}
          />
        </div>
      )}

      {/* Geen abonnement melding */}
      {!subscription && (
        <div className="mb-8 flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sky-700">
          <CreditCard className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            U heeft nog geen actief abonnement. Kies hieronder een pakket om te starten.
          </p>
        </div>
      )}

      {/* Billing interval toggle */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-base font-semibold text-slate-900">
          {hasActiveSubscription ? 'Beschikbare pakketten' : 'Kies een pakket'}
        </h2>
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setBillingInterval('MONTHLY')}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              billingInterval === 'MONTHLY'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            Maandelijks
          </button>
          <button
            onClick={() => setBillingInterval('YEARLY')}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
              billingInterval === 'YEARLY'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            Jaarlijks
            <span className="text-xs font-bold text-emerald-600">−20%</span>
          </button>
        </div>
      </div>

      {/* Pakket kaarten */}
      {packages.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          Pakketten konden niet worden geladen. Probeer de pagina te vernieuwen.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const isCurrent =
              hasActiveSubscription === true &&
              subscription!.packageName === pkg.name;
            const isActiveSubscription = hasActiveSubscription === true;
            return (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isCurrent={!!isCurrent}
                billingInterval={billingInterval}
                onSelect={() =>
                  isActiveSubscription ? handleChange(pkg) : handleCheckout(pkg)
                }
                loading={
                  isActiveSubscription
                    ? changeLoadingId === pkg.id
                    : checkoutLoadingId === pkg.id
                }
                actionLabel={isActiveSubscription && !isCurrent ? 'Wijzig naar' : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Upgrade via portal hint voor actieve gebruikers */}
      {hasActiveSubscription && (
        <p className="mt-6 text-sm text-slate-500 text-center">
          Wilt u upgraden, downgraden of opzeggen?{' '}
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="text-sky-600 hover:underline font-medium disabled:opacity-50"
          >
            Open het facturatieportaal
          </button>
        </p>
      )}

      {/* ── Vacature Credits sectie ─────────────────────────────────────── */}
      <div className="mt-12 border-t border-slate-200 pt-10">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Eenmalige vacatureplaatsingen</h2>
          <p className="mt-1 text-sm text-slate-500">
            Geen abonnement nodig. Betaal per vacature en publiceer direct.
          </p>
        </div>

        {/* Credit saldo */}
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Beschikbaar: <span className="font-bold text-emerald-700 text-base">{creditStatus?.availableCredits ?? 0} credit{(creditStatus?.availableCredits ?? 0) !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-xs text-emerald-600">
              Elke credit geeft 1 vacatureplaatsing van 60 dagen
            </p>
          </div>
        </div>

        {/* Bundle kaarten */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 1 vacature */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Losse plaatsing</p>
              <p className="text-2xl font-bold text-slate-900">€ 39,00</p>
              <p className="text-sm text-slate-500 mt-1">1 vacature · 60 dagen online</p>
            </div>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Geen abonnement</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Direct publiceren</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Eenmalige betaling</li>
            </ul>
            <button
              onClick={() => handleCreditCheckout('single')}
              disabled={creditLoadingBundle === 'single'}
              className="mt-auto w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {creditLoadingBundle === 'single' ? 'Laden...' : 'Koop nu'}
            </button>
          </div>

          {/* 3 vacatures */}
          <div className="bg-white border-2 border-sky-400 rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">Populair</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-500 uppercase tracking-wider mb-1">3-vacatures bundel</p>
              <p className="text-2xl font-bold text-slate-900">€ 99,00</p>
              <p className="text-sm text-slate-500 mt-1">€ 33,00 per vacature</p>
            </div>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 3 credits voor later</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 12 maanden geldig</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 15% korting</li>
            </ul>
            <button
              onClick={() => handleCreditCheckout('bundle3')}
              disabled={creditLoadingBundle === 'bundle3'}
              className="mt-auto w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {creditLoadingBundle === 'bundle3' ? 'Laden...' : 'Koop nu'}
            </button>
          </div>

          {/* 5 vacatures */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">5-vacatures bundel</p>
              <p className="text-2xl font-bold text-slate-900">€ 149,00</p>
              <p className="text-sm text-slate-500 mt-1">€ 29,80 per vacature</p>
            </div>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 5 credits voor later</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 12 maanden geldig</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 24% korting</li>
            </ul>
            <button
              onClick={() => handleCreditCheckout('bundle5')}
              disabled={creditLoadingBundle === 'bundle5'}
              className="mt-auto w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {creditLoadingBundle === 'bundle5' ? 'Laden...' : 'Koop nu'}
            </button>
          </div>
        </div>

        {/* Recente credit transacties */}
        {creditStatus && creditStatus.recentTransactions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recente transacties</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-100">
              {creditStatus.recentTransactions.map((tx: CreditTransactionDto) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                      tx.creditsAdded > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600',
                    )}>
                      {tx.creditsAdded > 0 ? `+${tx.creditsAdded}` : `-${tx.creditsUsed}`}
                    </div>
                    <span className="text-slate-700">{tx.reason ?? (tx.creditsAdded > 0 ? 'Credits gekocht' : 'Credit gebruikt')}</span>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {new Date(tx.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Export met Suspense voor useSearchParams ────────────────────────────────

export default function AbonnementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AbonnementPageInner />
    </Suspense>
  );
}
