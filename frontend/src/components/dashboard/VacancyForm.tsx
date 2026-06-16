'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createDashboardVacancy, updateDashboardVacancy } from '@/lib/api/employer-dashboard';
import { useAuthContext } from '@/context/AuthContext';
import type { DashboardVacancyCreateRequest } from '@/types/dashboard';
import type { EmploymentType, EducationLevel } from '@/types/api';
import { EMPLOYMENT_TYPE_LABELS, EDUCATION_LEVEL_LABELS } from '@/types/api';

interface VacancyFormProps {
  mode: 'create' | 'edit';
  vacancyId?: number;
  initial?: Partial<DashboardVacancyCreateRequest & { isActive: boolean }>;
}

const EMPTY: DashboardVacancyCreateRequest = {
  title: '',
  description: '',
  requirements: '',
  salaryMin: null,
  salaryMax: null,
  hoursMin: null,
  hoursMax: null,
  employmentType: null,
  educationLevel: null,
  isActive: true,
  expiresAt: null,
  seoTitle: '',
  seoDescription: '',
  isFeatured: false,
  featuredUntil: null,
};

export default function VacancyForm({ mode, vacancyId, initial }: VacancyFormProps) {
  const router = useRouter();
  const { logout } = useAuthContext();
  const [form, setForm] = useState<DashboardVacancyCreateRequest>({ ...EMPTY, ...initial });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof DashboardVacancyCreateRequest>(key: K, value: DashboardVacancyCreateRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubscriptionError(false);
    setSessionExpired(false);
    setFieldErrors({});
    setSubmitting(true);

    const result =
      mode === 'create'
        ? await createDashboardVacancy(form)
        : await updateDashboardVacancy(vacancyId!, form);

    setSubmitting(false);

    if (result.success) {
      router.push('/dashboard/vacatures');
      router.refresh();
    } else {
      setError(result.error);
      if ('sessionExpired' in result && result.sessionExpired) {
        setSessionExpired(true);
        logout();
        router.push('/login?from=/dashboard/vacatures/nieuw&reason=session_expired');
        return;
      }
      if ('subscriptionError' in result && result.subscriptionError) {
        setSubscriptionError(true);
      }
      if ('fieldErrors' in result && result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {sessionExpired && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4">
          <p className="text-yellow-800 font-semibold text-sm mb-1">Sessie verlopen</p>
          <p className="text-yellow-700 text-sm mb-3">
            Je bent automatisch uitgelogd. Je wordt doorgestuurd naar de inlogpagina...
          </p>
        </div>
      )}
      {subscriptionError && error && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4">
          <p className="text-amber-800 font-semibold text-sm mb-1">Geen actief abonnement of credits</p>
          <p className="text-amber-700 text-sm mb-3">{error}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/abonnement"
              className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Abonnement beheren
            </Link>
            <Link
              href="/dashboard/abonnement#credits"
              className="inline-flex items-center px-4 py-2 bg-white border border-amber-400 text-amber-700 hover:bg-amber-50 text-sm font-medium rounded-lg transition-colors"
            >
              Koop een vacature credit (€ 39)
            </Link>
          </div>
        </div>
      )}
      {!subscriptionError && !sessionExpired && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Basisgegevens */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-5">Basisgegevens</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Functietitel <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="bijv. Verpleegkundige Ouderenzorg"
            />
            {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Functieomschrijving <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-y"
              placeholder="Beschrijf de functie..."
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-1">
              Functievereisten
            </label>
            <textarea
              id="requirements"
              rows={4}
              value={form.requirements ?? ''}
              onChange={(e) => set('requirements', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-y"
              placeholder="Welke eisen stel je aan de kandidaat?"
            />
          </div>
        </div>
      </section>

      {/* Arbeidsvoorwaarden */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-5">Arbeidsvoorwaarden</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-slate-700 mb-1">
              Dienstverband
            </label>
            <select
              id="employmentType"
              value={form.employmentType ?? ''}
              onChange={(e) => set('employmentType', (e.target.value as EmploymentType) || null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
            >
              <option value="">Geen voorkeur</option>
              {(Object.keys(EMPLOYMENT_TYPE_LABELS) as EmploymentType[]).map((k) => (
                <option key={k} value={k}>{EMPLOYMENT_TYPE_LABELS[k]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="educationLevel" className="block text-sm font-medium text-slate-700 mb-1">
              Opleidingsniveau
            </label>
            <select
              id="educationLevel"
              value={form.educationLevel ?? ''}
              onChange={(e) => set('educationLevel', (e.target.value as EducationLevel) || null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
            >
              <option value="">Geen vereiste</option>
              {(Object.keys(EDUCATION_LEVEL_LABELS) as EducationLevel[]).map((k) => (
                <option key={k} value={k}>{EDUCATION_LEVEL_LABELS[k]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-slate-700 mb-1">
              Minimumsalaris (€/maand)
            </label>
            <input
              id="salaryMin"
              type="number"
              min={0}
              step={50}
              value={form.salaryMin ?? ''}
              onChange={(e) => set('salaryMin', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="bijv. 2500"
            />
            {fieldErrors.salaryMin && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.salaryMin}</p>
            )}
          </div>

          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-slate-700 mb-1">
              Maximumsalaris (€/maand)
            </label>
            <input
              id="salaryMax"
              type="number"
              min={0}
              step={50}
              value={form.salaryMax ?? ''}
              onChange={(e) => set('salaryMax', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="bijv. 3500"
            />
            {fieldErrors.salaryMax && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.salaryMax}</p>
            )}
          </div>

          <div>
            <label htmlFor="hoursMin" className="block text-sm font-medium text-slate-700 mb-1">
              Min. uren per week
            </label>
            <input
              id="hoursMin"
              type="number"
              min={0}
              max={60}
              value={form.hoursMin ?? ''}
              onChange={(e) => set('hoursMin', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="bijv. 32"
            />
          </div>

          <div>
            <label htmlFor="hoursMax" className="block text-sm font-medium text-slate-700 mb-1">
              Max. uren per week
            </label>
            <input
              id="hoursMax"
              type="number"
              min={0}
              max={60}
              value={form.hoursMax ?? ''}
              onChange={(e) => set('hoursMax', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="bijv. 36"
            />
          </div>
        </div>
      </section>

      {/* Publicatie-instellingen */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-5">Publicatie</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => set('isActive', e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Vacature direct publiceren (actief)
            </label>
          </div>

          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-slate-700 mb-1">
              Vervaldatum (optioneel)
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              value={form.expiresAt ? form.expiresAt.substring(0, 16) : ''}
              onChange={(e) => set('expiresAt', e.target.value ? e.target.value + ':00' : null)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Vacature zichtbaarheid */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Vacature zichtbaarheid</h2>
        <p className="text-sm text-slate-400 mb-5">
          Uitgelichte vacatures verschijnen bovenaan in zoekresultaten en krijgen extra zichtbaarheid op ZorgWerkwijzer.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
            <input
              id="isFeatured"
              type="checkbox"
              checked={form.isFeatured ?? false}
              onChange={(e) => set('isFeatured', e.target.checked)}
              className="mt-0.5 w-4 h-4 text-amber-500 rounded"
            />
            <div>
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <span>⭐</span> Uitgelichte vacature
                <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-300">
                  👑 Premium
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Jouw vacature komt bovenaan in alle zoekresultaten en krijgt een gouden rand en premium badge.
              </p>
            </div>
          </div>

          {form.isFeatured && (
            <div>
              <label htmlFor="featuredUntil" className="block text-sm font-medium text-slate-700 mb-1">
                Uitgelicht tot (optioneel)
              </label>
              <input
                id="featuredUntil"
                type="datetime-local"
                value={form.featuredUntil ? form.featuredUntil.substring(0, 16) : ''}
                onChange={(e) => set('featuredUntil', e.target.value ? e.target.value + ':00' : null)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-1">SEO (optioneel)</h2>
        <p className="text-sm text-slate-400 mb-5">
          Laat leeg om automatisch te genereren vanuit de titel en omschrijving.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-slate-700 mb-1">
              SEO-titel
            </label>
            <input
              id="seoTitle"
              type="text"
              maxLength={255}
              value={form.seoTitle ?? ''}
              onChange={(e) => set('seoTitle', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Zoekmachinetitel (max. 255 tekens)"
            />
          </div>

          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium text-slate-700 mb-1">
              SEO-omschrijving
            </label>
            <textarea
              id="seoDescription"
              rows={3}
              value={form.seoDescription ?? ''}
              onChange={(e) => set('seoDescription', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Metaomschrijving (max. 160 tekens aanbevolen)"
            />
          </div>
        </div>
      </section>

      {/* Knoppen */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opslaan...
            </>
          ) : (
            mode === 'create' ? 'Vacature plaatsen' : 'Wijzigingen opslaan'
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
