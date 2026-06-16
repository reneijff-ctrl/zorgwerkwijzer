'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

// Consistent met Spring Boot backend regex: min 8 tekens, 1 hoofdletter, 1 cijfer
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function validateForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.firstName.trim() || data.firstName.trim().length < 2) {
    errors.firstName = 'Voornaam is verplicht (minimaal 2 tekens).';
  }
  if (!data.lastName.trim() || data.lastName.trim().length < 2) {
    errors.lastName = 'Achternaam is verplicht (minimaal 2 tekens).';
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Voer een geldig e-mailadres in.';
  }
  if (!data.password || !PASSWORD_REGEX.test(data.password)) {
    errors.password = 'Minimaal 8 tekens, 1 hoofdletter en 1 cijfer.';
  }
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      const result = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim() || undefined,
      });

      if (!result.success) {
        setGlobalError(result.error);
        if ('fieldErrors' in result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors as FieldErrors);
        }
        return;
      }

      // Na registratie: e-mailverificatie vereist — redirect naar bevestigingspagina
      router.push(`/registratie-bevestiging?email=${encodeURIComponent(form.email.trim())}`);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-sky-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Account aanmaken</h1>
          <p className="text-slate-500 text-sm mt-1">Gratis registreren bij ZorgWerkwijzer</p>
        </div>

        {/* Formulier */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {globalError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{globalError}</p>
              </div>
            )}

            {/* Voornaam + Achternaam */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jan"
                  autoComplete="given-name"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                    fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="de Vries"
                  autoComplete="family-name"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                    fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jan.devries@email.nl"
                  autoComplete="email"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                    fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Wachtwoord */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Wachtwoord <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimaal 8 tekens"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                    fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {fieldErrors.password ? (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  Minimaal 8 tekens, 1 hoofdletter en 1 cijfer.
                </p>
              )}
            </div>

            {/* Telefoonnummer (optioneel) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Telefoonnummer{' '}
                <span className="text-slate-400 font-normal text-xs">(optioneel)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="06 12345678"
                  autoComplete="tel"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Je gegevens worden alleen gebruikt voor de sollicitatieprocedure en worden niet
              gedeeld met derden.
            </p>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Account aanmaken...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Account aanmaken
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Al een account?{' '}
              <Link href="/login" className="text-sky-600 font-semibold hover:underline">
                Inloggen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
