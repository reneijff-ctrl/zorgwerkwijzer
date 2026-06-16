'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, Loader2, CheckCircle2, AlertCircle, FileText, LogIn } from 'lucide-react';
import { submitApplication, getProfileByEmail } from '@/lib/api/applications';
import { useAuth } from '@/hooks/useAuth';

interface ApplicationFormProps {
  vacancyId: number;
  vacancyTitle: string;
  employerName: string;
  onClose: () => void;
}

interface FieldErrors {
  coverLetter?: string;
}

function validateForm(coverLetter: string): FieldErrors {
  const errors: FieldErrors = {};
  if (coverLetter.trim().length > 5000) {
    errors.coverLetter = 'Motivatiebrief mag maximaal 5000 tekens bevatten.';
  }
  return errors;
}

export default function ApplicationForm({
  vacancyId,
  vacancyTitle,
  employerName,
  onClose,
}: ApplicationFormProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [coverLetter, setCoverLetter] = useState('');

  // Niet ingelogd: toon inlog-prompt
  if (!isAuthenticated || !user) {
    return (
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Inloggen vereist</h2>
              <p className="text-sm text-slate-500 mt-0.5">{vacancyTitle} · {employerName}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Sluiten"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Log in om te solliciteren</h3>
            <p className="text-slate-500 text-sm mb-6">
              Je hebt een account nodig om te solliciteren op vacatures bij ZorgWerkwijzer.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push('/login');
                }}
                className="w-full bg-sky-600 text-white font-bold py-3 rounded-2xl hover:bg-sky-700 transition-colors"
              >
                Inloggen
              </button>
              <button
                onClick={() => {
                  onClose();
                  router.push('/register');
                }}
                className="w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-2xl hover:bg-slate-50 transition-colors text-sm"
              >
                Nog geen account? Registreer gratis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);

    const errors = validateForm(coverLetter);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      if (!user) return;

      // Haal Profile op via email — Profile.id ≠ User.id
      const profile = await getProfileByEmail(user.email);
      if (!profile) {
        setGlobalError('Je profiel is niet gevonden. Ga naar je profielpagina om een profiel aan te maken.');
        return;
      }

      const appResult = await submitApplication({
        vacancyId,
        profileId: profile.id,
        coverLetter: coverLetter.trim() || undefined,
      });

      if (!appResult.success) {
        setGlobalError(appResult.error);
        return;
      }

      setSubmitted(true);
    });
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Solliciteer direct</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {vacancyTitle} · {employerName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Succes state */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sollicitatie verstuurd!</h3>
            <p className="text-slate-500 mb-6">
              Je sollicitatie voor <strong>{vacancyTitle}</strong> is succesvol ontvangen.{' '}
              {employerName} neemt zo snel mogelijk contact met je op.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-sky-600 text-white font-bold py-3 rounded-2xl hover:bg-sky-700 transition-colors"
            >
              Sluiten
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
            {/* Globale fout */}
            {globalError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{globalError}</p>
              </div>
            )}

            {/* Ingelogde gebruiker info */}
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Solliciteren als
              </p>
              <p className="text-sm font-medium text-slate-700">{user.email}</p>
            </div>

            {/* Motivatiebrief */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Motivatiebrief{' '}
                <span className="text-slate-400 font-normal text-xs">(optioneel)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <textarea
                  name="coverLetter"
                  value={coverLetter}
                  onChange={(e) => {
                    setCoverLetter(e.target.value);
                    if (fieldErrors.coverLetter) setFieldErrors({});
                  }}
                  rows={5}
                  placeholder="Vertel waarom je geschikt bent voor deze functie..."
                  className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-none ${
                    fieldErrors.coverLetter ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                />
              </div>
              <div className="flex justify-between mt-1">
                {fieldErrors.coverLetter ? (
                  <p className="text-xs text-red-600">{fieldErrors.coverLetter}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-slate-400 ml-auto">{coverLetter.length}/5000</p>
              </div>
            </div>

            {/* Privacy opmerking */}
            <p className="text-xs text-slate-400">
              Door te solliciteren ga je akkoord met het verwerken van je gegevens voor deze
              sollicitatieprocedure.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Versturen...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Sollicitatie Versturen
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
