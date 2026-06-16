'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function RegistratieBevestigingPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setResendError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );
      if (res.ok) {
        setResendSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setResendError(data?.message ?? 'Er is een fout opgetreden. Probeer het later opnieuw.');
      }
    } catch {
      setResendError('Er is een verbindingsfout opgetreden.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-sky-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">Controleer uw inbox</h1>
        <p className="text-slate-500 mb-2">
          We hebben een verificatiemail gestuurd naar:
        </p>
        {email && (
          <p className="font-semibold text-slate-800 mb-6 break-all">{email}</p>
        )}
        <p className="text-slate-500 text-sm mb-8">
          Klik op de link in de e-mail om uw account te activeren.
          De link is <strong>24 uur</strong> geldig.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 mb-8 text-left space-y-2">
          <p className="font-semibold text-slate-700">Geen e-mail ontvangen?</p>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>Controleer uw spam- of ongewenste e-mailmap</li>
            <li>Wacht enkele minuten — e-mail kan vertraagd zijn</li>
            <li>Vraag hieronder een nieuwe verificatiemail aan</li>
          </ul>
        </div>

        {!resendSent ? (
          <button
            onClick={handleResend}
            disabled={resendLoading || !email}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 hover:border-sky-300 hover:text-sky-700 text-slate-600 font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {resendLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Verificatiemail opnieuw versturen
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700 flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Nieuwe verificatiemail verstuurd!
          </div>
        )}

        {resendError && (
          <p className="mt-3 text-sm text-red-600">{resendError}</p>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link href="/login" className="text-sm text-sky-600 hover:underline">
            Terug naar inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
