'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';

type Status = 'loading' | 'success' | 'error' | 'expired';

function VerificeerEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendSent, setResendSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Geen verificatietoken gevonden in de URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: 'GET' },
        );
        if (res.ok) {
          setStatus('success');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          const data = await res.json().catch(() => ({}));
          const msg: string = data?.message ?? '';
          if (msg.toLowerCase().includes('verlopen')) {
            setStatus('expired');
          } else {
            setStatus('error');
          }
          setErrorMessage(msg || 'Verificatie mislukt. Probeer het opnieuw.');
        }
      } catch {
        setStatus('error');
        setErrorMessage('Er is een verbindingsfout opgetreden. Probeer het later opnieuw.');
      }
    };

    verify();
  }, [token, router]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-14 h-14 text-sky-500 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">E-mailadres verifiëren…</h1>
            <p className="text-slate-500">Even geduld, we controleren uw verificatielink.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">E-mailadres bevestigd!</h1>
            <p className="text-slate-500 mb-6">
              Uw account is geactiveerd. U wordt automatisch doorgestuurd naar de inlogpagina.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
            >
              Nu inloggen
            </Link>
          </>
        )}

        {(status === 'error' || status === 'expired') && (
          <>
            {status === 'expired' ? (
              <XCircle className="w-14 h-14 text-amber-500 mx-auto mb-6" />
            ) : (
              <XCircle className="w-14 h-14 text-red-500 mx-auto mb-6" />
            )}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {status === 'expired' ? 'Link verlopen' : 'Verificatie mislukt'}
            </h1>
            <p className="text-slate-500 mb-8">{errorMessage}</p>

            {!resendSent ? (
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Nieuwe verificatiemail aanvragen:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="uw@email.nl"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || !resendEmail}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    {resendLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    Versturen
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700">
                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                Verificatiemail verstuurd! Controleer uw inbox.
              </div>
            )}

            <div className="mt-6">
              <Link href="/inloggen" className="text-sm text-sky-600 hover:underline">
                Terug naar inloggen
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerificeerEmailPage() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <VerificeerEmailContent />
    </Suspense>
  );
}
