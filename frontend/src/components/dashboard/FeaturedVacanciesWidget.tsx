'use client';
import Link from 'next/link';
import { Star, Eye, Users, ArrowRight } from 'lucide-react';
import type { DashboardVacancyDto, DashboardApplicationDto } from '@/types/dashboard';

interface FeaturedVacanciesWidgetProps {
  featuredVacancies: DashboardVacancyDto[];
  applications: DashboardApplicationDto[];
}

export default function FeaturedVacanciesWidget({
  featuredVacancies,
  applications,
}: FeaturedVacanciesWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">Uitgelichte vacatures</h2>
            <p className="text-xs text-slate-500">{featuredVacancies.length} actief uitgelicht</p>
          </div>
        </div>
        <Link
          href="/dashboard/vacatures"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
        >
          Beheer vacatures
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Vacature rijen */}
      <div className="space-y-3">
        {featuredVacancies.map((vacancy) => {
          const vacancyApplications = applications.filter(
            (a) => a.vacancyId === vacancy.id,
          ).length;

          return (
            <Link
              key={vacancy.id}
              href="/dashboard/vacatures"
              className="flex items-center justify-between bg-white rounded-xl border border-amber-200 px-4 py-3 hover:border-amber-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-amber-500 text-base shrink-0">⭐</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-amber-700 transition-colors">
                    {vacancy.title}
                  </p>
                  {vacancy.featuredUntil && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Uitgelicht tot{' '}
                      {new Date(vacancy.featuredUntil).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 ml-4">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">&mdash;</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{vacancyApplications}</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    vacancy.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {vacancy.isActive ? 'Actief' : 'Inactief'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-amber-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          👑 Premium functie &mdash; uitgelichte vacatures staan bovenaan in zoekresultaten
        </span>
        <Link
          href="/dashboard/vacatures/nieuw"
          className="text-amber-700 font-semibold hover:text-amber-800 transition-colors"
        >
          + Nieuwe uitgelichte vacature
        </Link>
      </div>
    </div>
  );
}
