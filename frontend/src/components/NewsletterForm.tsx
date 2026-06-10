'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'default' | 'compact' | 'footer';
}

export default function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simuleer backend call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!email.includes('@')) {
        throw new Error('Voer een geldig e-mailadres in.');
      }

      setStatus('success');
      setMessage('Bedankt! Je bent nu aangemeld voor onze nieuwsbrief.');
      setEmail('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Er is een fout opgetreden. Probeer het later opnieuw.';
      setStatus('error');
      setMessage(errorMessage);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-emerald-800 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">Gelukt!</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    );
  }

  const isFooter = variant === 'footer';

  return (
    <div className={`${isFooter ? '' : 'bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl'}`}>
      {!isFooter && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Blijf op de hoogte</h3>
          <p className="text-slate-600">
            Ontvang direct updates over CAO wijzigingen en salarissen in de zorg.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Je e-mailadres"
            required
            className={`w-full px-5 py-4 rounded-xl border transition-all outline-none focus:ring-2 
              ${isFooter 
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-sky-500/50' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`absolute right-2 top-2 bottom-2 px-4 rounded-lg font-bold flex items-center justify-center transition-all
              ${isFooter
                ? 'bg-sky-600 text-white hover:bg-sky-500'
                : 'bg-slate-900 text-white hover:bg-slate-800'
              } disabled:opacity-50`}
          >
            {status === 'loading' ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-rose-500 text-sm font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}

        <p className={`text-[11px] leading-relaxed ${isFooter ? 'text-slate-500' : 'text-slate-400'}`}>
          Door je aan te melden ga je akkoord met onze privacyverklaring. We sturen maximaal 2x per maand een update en je kunt je op elk moment weer afmelden.
        </p>
      </form>
    </div>
  );
}
