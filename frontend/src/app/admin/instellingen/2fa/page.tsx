'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldOff, QrCode, KeyRound, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type Step = 'status' | 'setup' | 'confirm' | 'done';

interface TwoFaStatus {
  twoFactorEnabled: boolean;
  email: string;
}

interface SetupData {
  secret: string;
  qrCode: string;
  otpAuthUri: string;
}

export default function AdminTwoFactorPage() {
  const { token } = useAuth();
  const [step, setStep] = useState<Step>('status');
  const [status, setStatus] = useState<TwoFaStatus | null>(null);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch(`${apiBase}/admin/2fa/status`, { headers });
      if (res.ok) setStatus(await res.json());
    } catch { /* ignore */ }
  }

  async function startSetup() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/admin/2fa/setup`, { headers });
      if (res.ok) {
        setSetupData(await res.json());
        setStep('setup');
      } else {
        setError('Setup starten mislukt. Probeer opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function confirmSetup() {
    if (code.length !== 6) { setError('Voer een 6-cijferige code in.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/admin/2fa/setup/confirm`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        setStep('done');
        setStatus((prev) => prev ? { ...prev, twoFactorEnabled: true } : prev);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? 'Ongeldige code. Probeer opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function disable2fa() {
    if (disableCode.length !== 6) { setDisableError('Voer een 6-cijferige code in.'); return; }
    setDisableLoading(true);
    setDisableError('');
    try {
      const res = await fetch(`${apiBase}/admin/2fa/disable`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code: disableCode }),
      });
      if (res.ok) {
        setStatus((prev) => prev ? { ...prev, twoFactorEnabled: false } : prev);
        setDisableCode('');
      } else {
        const data = await res.json().catch(() => ({}));
        setDisableError(data?.message ?? 'Uitschakelen mislukt.');
      }
    } finally {
      setDisableLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Two-Factor Authentication</h1>
          <p className="text-slate-500 text-sm">Beveilig uw admin account met TOTP</p>
        </div>
      </div>

      {/* Status kaart */}
      {status && step === 'status' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {status.twoFactorEnabled ? (
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            ) : (
              <ShieldOff className="w-10 h-10 text-slate-400" />
            )}
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {status.twoFactorEnabled ? '2FA is ingeschakeld' : '2FA is uitgeschakeld'}
              </p>
              <p className="text-slate-500 text-sm">{status.email}</p>
            </div>
          </div>

          {!status.twoFactorEnabled ? (
            <div>
              <p className="text-slate-600 text-sm mb-6">
                Schakel Two-Factor Authentication in om uw admin account te beveiligen.
                U heeft een authenticator app nodig zoals{' '}
                <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> of <strong>Authy</strong>.
              </p>
              <button
                onClick={startSetup}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                2FA instellen
              </button>
            </div>
          ) : (
            <div>
              <p className="text-slate-600 text-sm mb-4">
                Voer een geldige TOTP-code in om 2FA uit te schakelen.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                  className="w-36 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={disable2fa}
                  disabled={disableLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
                >
                  {disableLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4" />}
                  2FA uitschakelen
                </button>
              </div>
              {disableError && <p className="text-sm text-red-600 mt-2">{disableError}</p>}
            </div>
          )}
        </div>
      )}

      {/* QR-code stap */}
      {step === 'setup' && setupData && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Stap 1: Scan de QR-code</h2>
          <p className="text-slate-500 text-sm mb-6">
            Open uw authenticator app en scan de onderstaande QR-code.
          </p>

          {setupData.qrCode ? (
            <div className="flex justify-center mb-6">
              <img src={setupData.qrCode} alt="2FA QR-code" className="w-48 h-48 border border-slate-200 rounded-2xl p-2" />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-center">
              <p className="text-sm text-slate-500 mb-2">Kan QR-code niet laden. Voer het secret handmatig in:</p>
              <code className="text-sm font-mono bg-white border border-slate-200 rounded-lg px-3 py-1.5 break-all">
                {setupData.secret}
              </code>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Handmatig invoeren</p>
            <code className="text-sm font-mono break-all text-slate-700">{setupData.secret}</code>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">Stap 2: Voer de code in</h2>
          <p className="text-slate-500 text-sm mb-4">
            Voer de 6-cijferige code uit uw authenticator app in om de setup te bevestigen.
          </p>

          <div className="flex gap-3 items-start">
            <div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                className="w-36 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            <button
              onClick={confirmSetup}
              disabled={loading || code.length !== 6}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Bevestigen
            </button>
          </div>
        </div>
      )}

      {/* Succes */}
      {step === 'done' && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">2FA succesvol ingeschakeld!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Uw admin account is nu beveiligd met Two-Factor Authentication.
            Bij elke login wordt een TOTP-code gevraagd.
          </p>
          <button
            onClick={() => { setStep('status'); fetchStatus(); }}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors"
          >
            Terug naar overzicht
          </button>
        </div>
      )}
    </div>
  );
}
