'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export default function WachtwoordVergetenPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function validate(): boolean {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Voer een geldig e-mailadres in.');
      return false;
    }
    setEmailError(null);
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;

    startTransition(async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (res.ok) {
          setSuccess(true);
        } else {
          const data = await res.json().catch(() => ({}));
          setGlobalError(data.message ?? 'Er is een fout opgetreden. Probeer het later opnieuw.');
        }
      } catch {
        setGlobalError('Kon de server niet bereiken. Controleer uw internetverbinding.');
      }
    });
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">E-mail verzonden</h1>
          <p className="text-slate-600 mb-6">
            Als uw e-mailadres bij ons bekend is, ontvangt u een e-mail met een resetlink.
            De link is <strong>1 uur geldig</strong>.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Geen e-mail ontvangen? Controleer uw spammap of wacht enkele minuten.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar inloggen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar inloggen
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Wachtwoord vergeten</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Voer uw e-mailadres in. Als het bij ons bekend is, ontvangt u een resetlink.
          </p>
        </div>

        {globalError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              E-mailadres
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${
                  emailError ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
                placeholder="uw@emailadres.nl"
                disabled={isPending}
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {emailError}
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
                Verzenden…
              </>
            ) : (
              'Resetlink aanvragen'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
