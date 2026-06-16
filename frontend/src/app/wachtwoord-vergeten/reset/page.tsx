'use client';

import { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, AlertCircle, Loader2, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900 mb-2">Ongeldige link</h1>
        <p className="text-slate-600 mb-6 text-sm">
          De resetlink is ongeldig of verlopen. Vraag een nieuwe aan.
        </p>
        <Link
          href="/wachtwoord-vergeten"
          className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition-colors font-medium text-sm"
        >
          Nieuw resetverzoek
        </Link>
      </div>
    );
  }

  function validate(): boolean {
    let valid = true;
    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError('Minimaal 8 tekens, één hoofdletter en één cijfer.');
      valid = false;
    } else {
      setPasswordError(null);
    }
    if (password !== passwordConfirm) {
      setConfirmError('Wachtwoorden komen niet overeen.');
      valid = false;
    } else {
      setConfirmError(null);
    }
    return valid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;

    startTransition(async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword: password }),
        });
        if (res.ok) {
          setSuccess(true);
        } else {
          const data = await res.json().catch(() => ({}));
          setGlobalError(data.message ?? 'Er is een fout opgetreden. Probeer het opnieuw.');
        }
      } catch {
        setGlobalError('Kon de server niet bereiken. Controleer uw internetverbinding.');
      }
    });
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Wachtwoord gewijzigd</h1>
        <p className="text-slate-600 mb-6 text-sm">
          Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen met uw nieuwe wachtwoord.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Inloggen
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nieuw wachtwoord instellen</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Kies een sterk wachtwoord van minimaal 8 tekens, één hoofdletter en één cijfer.
        </p>
      </div>

      {globalError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Nieuw wachtwoord */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
            Nieuw wachtwoord
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                passwordError ? 'border-red-400 bg-red-50' : 'border-slate-200'
              }`}
              placeholder="Minimaal 8 tekens"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {passwordError}
            </p>
          )}
        </div>

        {/* Bevestig wachtwoord */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="passwordConfirm">
            Bevestig wachtwoord
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="passwordConfirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                confirmError ? 'border-red-400 bg-red-50' : 'border-slate-200'
              }`}
              placeholder="Herhaal uw nieuwe wachtwoord"
              disabled={isPending}
            />
          </div>
          {confirmError && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {confirmError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-sky-600 text-white py-2.5 rounded-xl hover:bg-sky-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Opslaan…
            </>
          ) : (
            'Wachtwoord opslaan'
          )}
        </button>
      </form>
    </div>
  );
}

export default function WachtwoordVergetenResetPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
