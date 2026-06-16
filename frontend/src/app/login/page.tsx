'use client';
import { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, AlertCircle, Loader2, LogIn, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { verifyTwoFactorLogin } from '@/lib/api/auth';

interface FieldErrors {
  email?: string;
  password?: string;
}

function validateForm(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Voer een geldig e-mailadres in.';
  }
  if (!password) {
    errors.password = 'Wachtwoord is verplicht.';
  }
  return errors;
}

function LoginContent() {
  const { login, loginWithResponse } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Stap 1: wachtwoord
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Stap 2: 2FA
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  const sessionExpiredReason = searchParams.get('reason') === 'session_expired';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    const errors = validateForm(email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    startTransition(async () => {
      const result = await login({ email: email.trim(), password });
      if (!result.success) {
        setGlobalError(result.error);
        return;
      }
      // Admin met 2FA ingeschakeld → toon TOTP scherm
      if (result.data.requiresTwoFactor && result.data.tempToken) {
        setTempToken(result.data.tempToken);
        setRequiresTwoFactor(true);
        return;
      }
      // Normale login
      redirectAfterLogin(result.user?.role);
    });
  }

  function handleTwoFactorSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTwoFactorError(null);
    if (!totpCode.trim()) {
      setTwoFactorError('Voer uw 6-cijferige code in.');
      return;
    }
    startTransition(async () => {
      const result = await verifyTwoFactorLogin({ tempToken, code: totpCode.trim() });
      if (!result.success) {
        setTwoFactorError(result.error);
        setTotpCode('');
        return;
      }
      // Sla JWT op via loginWithResponse
      loginWithResponse(result.data);
      redirectAfterLogin(result.data.user?.role);
    });
  }

  function redirectAfterLogin(role?: string | null) {
    const from = searchParams.get('from');
    if (from) {
      router.push(from);
    } else if (role === 'ROLE_EMPLOYER') {
      router.push('/dashboard');
    } else if (role === 'ROLE_ADMIN') {
      router.push('/admin');
    } else {
      router.push('/profiel');
    }
  }

  // ── Stap 2: TOTP scherm ────────────────────────────────────────────────────
  if (requiresTwoFactor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Twee-factor verificatie</h1>
            <p className="text-slate-500 text-sm mt-1">
              Open uw authenticator app en voer de 6-cijferige code in.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <form onSubmit={handleTwoFactorSubmit} noValidate className="space-y-5">
              {twoFactorError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{twoFactorError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Verificatiecode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={6}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition tracking-widest text-center font-mono text-lg"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Of gebruik een recovery code (formaat: RECOVERY-XXXXXXXXXX)
                </p>
              </div>
              <button
                type="submit"
                disabled={isPending || totpCode.length < 6}
                className="w-full bg-violet-600 text-white font-bold py-3.5 rounded-2xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifiëren...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Verifiëren
                  </>
                )}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => { setRequiresTwoFactor(false); setTempToken(''); setTotpCode(''); setTwoFactorError(null); }}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Terug naar inloggen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Stap 1: E-mail + wachtwoord ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-sky-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Inloggen</h1>
          <p className="text-slate-500 text-sm mt-1">Welkom terug bij ZorgWerkwijzer</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          {sessionExpiredReason && (
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4 text-sm mb-5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Je sessie is verlopen. Log opnieuw in om door te gaan.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {globalError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{globalError}</p>
              </div>
            )}
            {/* E-mail */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                E-mailadres <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="jouw@email.nl"
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Wachtwoord <span className="text-red-500">*</span>
                </label>
                <Link
                  href="/wachtwoord-vergeten"
                  className="text-xs text-sky-600 hover:underline font-medium"
                >
                  Wachtwoord vergeten?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
                    fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Inloggen...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Inloggen
                </>
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Nog geen account?{' '}
              <Link href="/register" className="text-sky-600 font-semibold hover:underline">
                Registreer gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
