'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  MapPin,
  Building2,
  Trash2,
  Loader2,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import { getSavedJobsByProfile, removeSavedJob } from '@/lib/api/applications';
import type { SavedJobDto } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function MySavedJobsContent() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJobDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getSavedJobsByProfile(user.id).then((data) => {
      if (!data) {
        setError('Kon opgeslagen vacatures niet laden.');
      } else {
        setSavedJobs(data.content);
      }
      setIsLoading(false);
    });
  }, [user]);

  function handleRemove(vacancyId: number) {
    if (!user) return;
    setRemovingId(vacancyId);
    startTransition(async () => {
      const result = await removeSavedJob(vacancyId, user.id);
      if (result.success) {
        setSavedJobs((prev) => prev.filter((j) => j.vacancyId !== vacancyId));
      }
      setRemovingId(null);
    });
  }

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
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Opgeslagen Vacatures</h1>
            <p className="text-slate-500 text-sm">
              {savedJobs.length} vacature{savedJobs.length !== 1 ? 's' : ''} opgeslagen
            </p>
          </div>
        </div>

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

        {!isLoading && !error && savedJobs.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-slate-700 mb-2">Geen opgeslagen vacatures</h2>
            <p className="text-slate-500 mb-6">
              Je hebt nog geen vacatures opgeslagen. Bladar door ons aanbod en klik op{' '}
              <strong>Vacature opslaan</strong>.
            </p>
            <Link
              href="/vacatures"
              className="inline-flex items-center gap-2 bg-sky-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-sky-700 transition-colors"
            >
              Bekijk alle vacatures
            </Link>
          </div>
        )}

        {/* Saved jobs lijst */}
        {!isLoading && savedJobs.length > 0 && (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/vacature/${job.vacancySlug}`}
                    className="font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                  >
                    {job.vacancyTitle}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.employerName}
                    </span>
                    {job.cityName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.cityName}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      Opgeslagen op {formatDate(job.savedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/vacature/${job.vacancySlug}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-sky-600 font-semibold text-sm hover:text-sky-700 transition-colors border border-sky-200 bg-sky-50 rounded-xl px-3 py-1.5"
                  >
                    Bekijken
                  </Link>
                  <button
                    onClick={() => handleRemove(job.vacancyId)}
                    disabled={removingId === job.vacancyId || isPending}
                    aria-label="Verwijder uit opgeslagen"
                    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {removingId === job.vacancyId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MySavedJobsPage() {
  return (
    <ProtectedRoute>
      <MySavedJobsContent />
    </ProtectedRoute>
  );
}
