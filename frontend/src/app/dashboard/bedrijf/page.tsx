'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getEmployerById,
  updateEmployer,
  uploadEmployerLogo,
  uploadEmployerHeader,
  deleteEmployerLogo,
  deleteEmployerHeader,
} from '@/lib/api/employers';
import type { EmployerDetail, EmployerUpdateRequest } from '@/types/api';
import { Building2, Save, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ImageUploadField from '@/components/dashboard/ImageUploadField';

export default function DashboardBedrijfPage() {
  const { user } = useAuth();
  const [employer, setEmployer] = useState<EmployerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EmployerUpdateRequest>({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    logoUrl: '',
    websiteUrl: '',
    description: '',
    coverImageUrl: '',
    city: '',
    province: '',
    postalCode: '',
    employeeCount: '',
    foundedYear: undefined,
    seoTitle: '',
    seoDescription: '',
  });

  const loadEmployer = useCallback(async () => {
    if (!user?.employerId) return;
    setLoading(true);
    const data = await getEmployerById(user.employerId);
    if (data) {
      setEmployer(data);
      setForm({
        name: data.name ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        address: data.address ?? '',
        logoUrl: data.logoUrl ?? '',
        websiteUrl: data.websiteUrl ?? '',
        description: data.description ?? '',
        coverImageUrl: data.coverImageUrl ?? '',
        city: data.city ?? '',
        province: data.province ?? '',
        postalCode: data.postalCode ?? '',
        employeeCount: data.employeeCount ?? '',
        foundedYear: data.foundedYear ?? undefined,
        seoTitle: data.seoTitle ?? '',
        seoDescription: data.seoDescription ?? '',
        slug: data.slug ?? '',
      });
    }
    setLoading(false);
  }, [user?.employerId]);

  useEffect(() => {
    loadEmployer();
  }, [loadEmployer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'foundedYear' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employerId) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateEmployer(user.employerId, form);
    if (result.success) {
      setEmployer(result.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm border border-slate-100">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Bedrijfsprofiel kon niet worden geladen.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bedrijfsprofiel</h1>
          <p className="text-slate-500 mt-1">
            Beheer de publieke pagina van{' '}
            <span className="font-medium text-slate-700">{employer.name}</span>
          </p>
        </div>
        {employer.slug && (
          <Link
            href={`/werkgevers/${employer.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Bekijk publieke pagina
          </Link>
        )}
      </div>

      {/* Feedback */}
      {success && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Bedrijfsprofiel succesvol opgeslagen.
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bedrijfsgegevens */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">Bedrijfsgegevens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bedrijfsnaam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefoonnummer</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
              <input
                type="url"
                name="websiteUrl"
                placeholder="https://www.bedrijf.nl"
                value={form.websiteUrl ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Aantal medewerkers</label>
              <select
                name="employeeCount"
                value={form.employeeCount ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
              >
                <option value="">Selecteer een range</option>
                <option value="1-10">1 – 10</option>
                <option value="11-50">11 – 50</option>
                <option value="51-200">51 – 200</option>
                <option value="201-500">201 – 500</option>
                <option value="501-1000">501 – 1.000</option>
                <option value="1001-5000">1.001 – 5.000</option>
                <option value="5000+">5.000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Oprichtingsjaar</label>
              <input
                type="number"
                name="foundedYear"
                min={1800}
                max={new Date().getFullYear()}
                placeholder="bijv. 2006"
                value={form.foundedYear ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Locatie */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">Locatie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stad</label>
              <input
                type="text"
                name="city"
                value={form.city ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Postcode</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Provincie</label>
              <select
                name="province"
                value={form.province ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
              >
                <option value="">Selecteer provincie</option>
                {['Drenthe','Flevoland','Friesland','Gelderland','Groningen','Limburg',
                  'Noord-Brabant','Noord-Holland','Overijssel','Utrecht','Zeeland','Zuid-Holland'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adres</label>
              <input
                type="text"
                name="address"
                placeholder="Straatnaam 1, 1234 AB Stad"
                value={form.address ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Over het bedrijf */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">Over het bedrijf</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Omschrijving</label>
            <textarea
              name="description"
              rows={6}
              value={form.description ?? ''}
              onChange={handleChange}
              placeholder="Beschrijf uw organisatie, cultuur en missie..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            />
          </div>
        </section>

        {/* Afbeeldingen */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-1">Afbeeldingen</h2>
          <p className="text-sm text-slate-500 mb-5">
            Afbeeldingen worden direct geüpload en opgeslagen. U hoeft niet op &quot;Opslaan&quot; te klikken.
          </p>
          <div className="space-y-6">
            <ImageUploadField
              label="Bedrijfslogo"
              currentUrl={form.logoUrl}
              onUpload={async (file) => {
                if (!user?.employerId) return { success: false, error: 'Niet ingelogd.' };
                const result = await uploadEmployerLogo(user.employerId, file);
                if (result.success) {
                  setForm((prev) => ({ ...prev, logoUrl: result.url }));
                  setEmployer((prev) => prev ? { ...prev, logoUrl: result.url } : prev);
                }
                return result;
              }}
              onDelete={async () => {
                if (!user?.employerId) return { success: false, error: 'Niet ingelogd.' };
                const result = await deleteEmployerLogo(user.employerId);
                if (result.success) {
                  setForm((prev) => ({ ...prev, logoUrl: '' }));
                  setEmployer((prev) => prev ? { ...prev, logoUrl: null } : prev);
                }
                return result;
              }}
              maxSizeMB={5}
              aspectHint="vierkant aanbevolen"
              previewClassName="h-20 w-auto max-w-[160px]"
            />
            <ImageUploadField
              label="Header afbeelding"
              currentUrl={form.coverImageUrl}
              onUpload={async (file) => {
                if (!user?.employerId) return { success: false, error: 'Niet ingelogd.' };
                const result = await uploadEmployerHeader(user.employerId, file);
                if (result.success) {
                  setForm((prev) => ({ ...prev, coverImageUrl: result.url }));
                  setEmployer((prev) => prev ? { ...prev, coverImageUrl: result.url } : prev);
                }
                return result;
              }}
              onDelete={async () => {
                if (!user?.employerId) return { success: false, error: 'Niet ingelogd.' };
                const result = await deleteEmployerHeader(user.employerId);
                if (result.success) {
                  setForm((prev) => ({ ...prev, coverImageUrl: '' }));
                  setEmployer((prev) => prev ? { ...prev, coverImageUrl: null } : prev);
                }
                return result;
              }}
              maxSizeMB={10}
              aspectHint="16:9 aanbevolen"
              previewClassName="h-32 w-auto max-w-xs"
            />
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-1">SEO</h2>
          <p className="text-sm text-slate-500 mb-5">
            Laat leeg voor automatische invulling op basis van bedrijfsnaam.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Meta titel
              </label>
              <input
                type="text"
                name="seoTitle"
                maxLength={60}
                value={form.seoTitle ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-1">{(form.seoTitle ?? '').length}/60 tekens</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Meta omschrijving
              </label>
              <textarea
                name="seoDescription"
                rows={2}
                maxLength={160}
                value={form.seoDescription ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{(form.seoDescription ?? '').length}/160 tekens</p>
            </div>
          </div>
        </section>

        {/* Opslaan */}
        <div className="flex justify-end pb-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
