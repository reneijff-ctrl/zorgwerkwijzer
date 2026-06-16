'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, User, Mail, Lock, Phone, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { registerEmployer } from '@/lib/api/employer-auth';
import { AuthContext } from '@/context/AuthContext';

interface FormState {
  companyName: string;
  contactName: string;
  email: string;
  password: string;
  phoneNumber: string;
  website: string;
  kvkNumber: string;
}

const initialForm: FormState = {
  companyName: '',
  contactName: '',
  email: '',
  password: '',
  phoneNumber: '',
  website: '',
  kvkNumber: '',
};

export default function WerkgeverRegistrerenPage() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState & { general: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<FormState & { general: string }> = {};

    if (!form.companyName.trim()) newErrors.companyName = 'Bedrijfsnaam is verplicht.';
    if (!form.contactName.trim()) newErrors.contactName = 'Contactpersoon is verplicht.';
    if (!form.kvkNumber.trim()) {
      newErrors.kvkNumber = 'KvK-nummer is verplicht.';
    } else if (!/^\d{8}$/.test(form.kvkNumber.trim())) {
      newErrors.kvkNumber = 'KvK-nummer moet exact 8 cijfers bevatten.';
    }
    if (!form.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in.';
    }
    if (!form.password) {
      newErrors.password = 'Wachtwoord is verplicht.';
    } else if (form.password.length < 8) {
      newErrors.password = 'Wachtwoord moet minimaal 8 tekens bevatten.';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) {
      newErrors.password = 'Wachtwoord moet minimaal één hoofdletter en één cijfer bevatten.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await registerEmployer({
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
      password: form.password,
      phoneNumber: form.phoneNumber.trim() || undefined,
      website: form.website.trim() || undefined,
      kvkNumber: form.kvkNumber.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      // Na registratie: e-mailverificatie vereist — redirect naar bevestigingspagina
      router.push(`/registratie-bevestiging?email=${encodeURIComponent(form.email.trim())}`);
    } else {
      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        setErrors(result.fieldErrors as Partial<FormState & { general: string }>);
      } else {
        setErrors({ general: result.error });
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/werkgever" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium mb-6">
            ← Terug naar werkgeversinformatie
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Werkgeversaccount aanmaken</h1>
          <p className="text-slate-600">
            Al een account?{' '}
            <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
              Inloggen
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {errors.general && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Bedrijfsnaam */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Bedrijfsnaam <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Buurtzorg Nederland"
                  autoComplete="organization"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.companyName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.companyName && (
                <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Contactpersoon */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Contactpersoon <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Jan Jansen"
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.contactName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.contactName && (
                <p className="text-xs text-red-600 mt-1">{errors.contactName}</p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@bedrijf.nl"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Wachtwoord */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Wachtwoord <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimaal 8 tekens"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Minimaal 8 tekens, 1 hoofdletter en 1 cijfer.
                </p>
              )}
            </div>

            {/* Telefoonnummer (optioneel) */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                Telefoonnummer <span className="text-slate-400 text-xs font-normal">(optioneel)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+31 6 12345678"
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* Website (optioneel) */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1.5">
                Website <span className="text-slate-400 text-xs font-normal">(optioneel)</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://www.bedrijf.nl"
                  autoComplete="url"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* KvK-nummer */}
            <div>
              <label htmlFor="kvkNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                KvK-nummer <span className="text-red-500">*</span>
              </label>
              <input
                id="kvkNumber"
                name="kvkNumber"
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={form.kvkNumber}
                onChange={handleChange}
                placeholder="12345678"
                autoComplete="off"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                  errors.kvkNumber ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.kvkNumber ? (
                <p className="text-xs text-red-600 mt-1">{errors.kvkNumber}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Uw 8-cijferig KvK-nummer uit het Handelsregister.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Account aanmaken...
                </>
              ) : (
                'Gratis account aanmaken'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Door te registreren gaat u akkoord met onze{' '}
            <Link href="/voorwaarden" className="text-sky-600 hover:underline">
              algemene voorwaarden
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
