'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardVacancies, getDashboardApplications } from '@/lib/api/employer-dashboard';
import type { DashboardVacancyDto, DashboardApplicationDto } from '@/types/dashboard';

import KpiCards from '@/components/dashboard/KpiCards';
import ApplicationsChart from '@/components/dashboard/ApplicationsChart';
import VacancyPerformance from '@/components/dashboard/VacancyPerformance';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import VacatureFunnel from '@/components/dashboard/VacatureFunnel';
import FeaturedVacanciesWidget from '@/components/dashboard/FeaturedVacanciesWidget';
import { getEmployerById } from '@/lib/api/employers';
import type { EmployerDetail } from '@/types/api';

// ─── Profielscore ────────────────────────────────────────────────────────────
function computeProfileScore(profile: EmployerDetail | null): number {
  if (!profile) return 0;
  const checks = [
    !!profile.name,
    !!profile.logoUrl,
    !!profile.description,
    !!profile.websiteUrl,
    !!profile.city,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className ?? ''}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* KPI skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      {/* Quick actions skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
      {/* Chart skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      {/* Bottom skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

// ─── Hoofd component ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<DashboardVacancyDto[]>([]);
  const [applications, setApplications] = useState<DashboardApplicationDto[]>([]);
  const [employerProfile, setEmployerProfile] = useState<EmployerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [vacPage, appPage] = await Promise.all([
        getDashboardVacancies(0, 20),
        getDashboardApplications(0, 20),
      ]);
      if (vacPage) setVacancies(vacPage.content);
      if (appPage) setApplications(appPage.content);

      if (user?.employerId) {
        const profile = await getEmployerById(user.employerId);
        setEmployerProfile(profile);
      }

      setLoading(false);
    }
    load();
  }, [user]);

  const activeVacancies = useMemo(() => vacancies.filter((v) => v.isActive).length, [vacancies]);
  const featuredVacancies = useMemo(() => vacancies.filter((v) => v.isFeatured), [vacancies]);
  const totalApplications = useMemo(() => applications.length, [applications]);
  const profileScore = useMemo(() => computeProfileScore(employerProfile), [employerProfile]);

  const displayName = user?.email?.split('@')[0] ?? 'Dashboard';

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welkom terug, <span className="text-sky-600 capitalize">{displayName}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Hier is een overzicht van jouw werkgeversdashboard.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Platform actief
        </span>
      </div>

      {/* ── Sectie 1: KPI Cards ────────────────────────────────────────────── */}
      <KpiCards
        totalVacancies={vacancies.length}
        activeVacancies={activeVacancies}
        totalApplications={totalApplications}
        profileScore={profileScore}
      />

      {/* ── Uitgelichte vacatures widget ──────────────────────────────────── */}
      {featuredVacancies.length > 0 && (
        <FeaturedVacanciesWidget
          featuredVacancies={featuredVacancies}
          applications={applications}
        />
      )}

      {/* ── Sectie 4: Snelle acties ────────────────────────────────────────── */}
      <QuickActions />

      {/* ── Sectie 2: Analytics ───────────────────────────────────────────── */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-4">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApplicationsChart applications={applications} />
          <VacancyPerformance vacancies={vacancies} />
        </div>
      </div>

      {/* ── Sectie 3 + 5: Activiteit & Funnel ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity vacancies={vacancies} applications={applications} />
        <VacatureFunnel vacancies={vacancies} />
      </div>
    </div>
  );
}
