'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { getDashboardApplications, updateApplicationStatus } from '@/lib/api/employer-dashboard';
import type { DashboardApplicationDto } from '@/types/dashboard';
import { APPLICATION_STATUS_LABELS } from '@/types/api';
import type { ApplicationStatus } from '@/types/api';
import { Eye, CheckCircle, XCircle, UserCheck, Star } from 'lucide-react';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  SUBMITTED: 'bg-sky-100 text-sky-700',
  REVIEWED: 'bg-amber-100 text-amber-700',
  INVITED: 'bg-violet-100 text-violet-700',
  REJECTED: 'bg-red-100 text-red-700',
  HIRED: 'bg-emerald-100 text-emerald-700',
};

const STATUS_ACTIONS: {
  label: string;
  status: ApplicationStatus;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    label: 'Bekeken',
    status: 'REVIEWED',
    icon: <Eye className="w-3.5 h-3.5" />,
    className: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200',
  },
  {
    label: 'Uitnodigen',
    status: 'INVITED',
    icon: <UserCheck className="w-3.5 h-3.5" />,
    className: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200',
  },
  {
    label: 'Aannemen',
    status: 'HIRED',
    icon: <Star className="w-3.5 h-3.5" />,
    className: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  {
    label: 'Afwijzen',
    status: 'REJECTED',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  },
];

export default function DashboardSollicitiesPage() {
  const [applications, setApplications] = useState<DashboardApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const page = await getDashboardApplications(0, 50);
      if (page) {
        setApplications(page.content);
        setTotalElements(page.page?.totalElements ?? page.content.length);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleStatusUpdate(applicationId: number, status: ApplicationStatus) {
    setUpdatingId(applicationId);
    const result = await updateApplicationStatus(applicationId, status);
    if (result.success) {
      startTransition(() => {
        setApplications((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, status: result.data.status } : a)),
        );
      });
    }
    setUpdatingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Sollicitaties</h1>
        <p className="text-slate-500 mt-1">{totalElements} sollicitatie(s) in totaal</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
          <p className="text-slate-400">Nog geen sollicitaties ontvangen.</p>
          <p className="text-slate-400 text-sm mt-2">
            Zodra kandidaten op je vacatures reageren, verschijnen ze hier.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Kandidaatinfo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                      <span className="text-sky-700 text-sm font-bold">
                        {a.applicantName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{a.applicantName}</p>
                      <p className="text-xs text-slate-400 truncate">{a.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 ml-12">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg truncate max-w-[200px]">
                      {a.vacancyTitle}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(a.appliedAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {a.applicantProfession && (
                      <span className="text-xs text-slate-500">{a.applicantProfession}</span>
                    )}
                    {a.applicantCity && (
                      <span className="text-xs text-slate-400">📍 {a.applicantCity}</span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {APPLICATION_STATUS_LABELS[a.status]}
                  </span>
                </div>
              </div>

              {/* Actieknoppen */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <Link
                  href={`/dashboard/sollicitaties/${a.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Bekijk profiel
                </Link>

                {STATUS_ACTIONS.filter((action) => action.status !== a.status).map((action) => (
                  <button
                    key={action.status}
                    disabled={updatingId === a.id}
                    onClick={() => handleStatusUpdate(a.id, action.status)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.className}`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
