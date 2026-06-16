'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Building2,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Clock,
  Eye,
  CalendarCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getApplicationsByProfile } from '@/lib/api/applications';
import type { ApplicationResponseDto, ApplicationStatus } from '@/types/api';
import { APPLICATION_STATUS_LABELS } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface StatusConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: React.ReactNode;
  description: string;
}

const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  SUBMITTED: {
    label: APPLICATION_STATUS_LABELS.SUBMITTED,
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-200',
    icon: <Clock className="w-3.5 h-3.5" />,
    description: 'Je sollicitatie is ontvangen en wacht op beoordeling.',
  },
  REVIEWED: {
    label: APPLICATION_STATUS_LABELS.REVIEWED,
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    icon: <Eye className="w-3.5 h-3.5" />,
    description: 'De werkgever heeft je sollicitatie bekeken.',
  },
  INVITED: {
    label: APPLICATION_STATUS_LABELS.INVITED,
    bgClass: 'bg-sky-100',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200',
    icon: <CalendarCheck className="w-3.5 h-3.5" />,
    description: 'Je bent uitgenodigd voor een gesprek! Neem contact op met de werkgever.',
  },
  HIRED: {
    label: APPLICATION_STATUS_LABELS.HIRED,
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    description: 'Gefeliciteerd! Je bent aangenomen voor deze functie.',
  },
  REJECTED: {
    label: APPLICATION_STATUS_LABELS.REJECTED,
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
    description: 'De werkgever heeft besloten verder te gaan met andere kandidaten.',
  },
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function MyApplicationsContent() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getApplicationsByProfile(user.id).then((data) => {
      if (!data) {
        setError('Kon sollicitaties niet laden.');
      } else {
        setApplications(data.content);
      }
      setIsLoading(false);
    });
  }, [user]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/vacatures"
            className="inline-flex items-center text-slate-500 hover:text-sky-600 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Terug naar vacatures
          </Link>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mijn Sollicitaties</h1>
            <p className="text-slate-500 text-sm">
              {applications.length} sollicitatie{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Statuslegenda */}
        {!isLoading && applications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Statusoverzicht
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, StatusConfig][]).map(
                ([key, cfg]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${cfg.bgClass} ${cfg.textClass}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <span className="text-xs text-slate-500">{cfg.description}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Lege state */}
        {!isLoading && !error && applications.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-700 mb-2">Nog geen sollicitaties</h2>
            <p className="text-slate-500 mb-6">
              Je hebt nog niet gesolliciteerd. Bekijk ons vacature-aanbod.
            </p>
            <Link
              href="/vacatures"
              className="inline-flex items-center gap-2 bg-sky-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-sky-700 transition-colors"
            >
              Bekijk alle vacatures
            </Link>
          </div>
        )}

        {/* Sollicitatie lijst */}
        {!isLoading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => {
              const cfg = STATUS_CONFIG[app.status];
              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-3xl border shadow-sm p-5 ${
                    app.status === 'INVITED' || app.status === 'HIRED'
                      ? 'border-sky-200 ring-1 ring-sky-100'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Status callout voor actieve statussen */}
                  {(app.status === 'INVITED' || app.status === 'HIRED') && (
                    <div
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-4 text-sm font-medium border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
                    >
                      {cfg.icon}
                      {cfg.description}
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link
                          href={`/vacature/${app.vacancySlug}`}
                          className="font-bold text-slate-900 hover:text-sky-600 transition-colors"
                        >
                          {app.vacancyTitle}
                        </Link>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.employerName}
                        </span>
                        <span className="text-xs text-slate-400">
                          Gesolliciteerd op {formatDate(app.createdAt)}
                        </span>
                      </div>

                      {app.coverLetter && (
                        <details className="mt-3">
                          <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                            Motivatiebrief tonen
                          </summary>
                          <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3 leading-relaxed">
                            {app.coverLetter}
                          </p>
                        </details>
                      )}
                    </div>

                    <Link
                      href={`/vacature/${app.vacancySlug}`}
                      className="shrink-0 hidden sm:inline-flex items-center gap-1.5 text-sky-600 font-semibold text-sm hover:text-sky-700 transition-colors border border-sky-200 bg-sky-50 rounded-xl px-3 py-1.5"
                    >
                      Bekijken
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <ProtectedRoute>
      <MyApplicationsContent />
    </ProtectedRoute>
  );
}
