'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, User, Calendar, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getContactMessage,
  updateContactMessageStatus,
  sendContactReply,
  type ContactMessageDto,
  type ContactReplyDto,
} from '@/lib/api/contact-messages';

function statusBadge(status: ContactMessageDto['status']) {
  switch (status) {
    case 'NEW':
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Nieuw</span>;
    case 'IN_PROGRESS':
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">In behandeling</span>;
    case 'RESOLVED':
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Afgehandeld</span>;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminContactBerichtDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [message, setMessage] = useState<ContactMessageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Reply form state
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [replies, setReplies] = useState<ContactReplyDto[]>([]);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    getContactMessage(token, id)
      .then((msg) => {
        setMessage(msg);
        setReplies(msg.replies ?? []);
        setReplySubject(`Re: Uw bericht aan ZorgWerkwijzer`);
      })
      .catch(() => router.push('/admin/contact-berichten'))
      .finally(() => setLoading(false));
  }, [token, id, router]);

  const handleStatusUpdate = async (status: ContactMessageDto['status']) => {
    if (!token || !message) return;
    setUpdating(true);
    try {
      const updated = await updateContactMessageStatus(token, id, status);
      setMessage(updated);
      setReplies(updated.replies ?? []);
    } catch {
      // silently fail
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReply = async () => {
    if (!token || !replySubject.trim() || !replyMessage.trim()) return;
    setReplySending(true);
    setReplyError('');
    try {
      const newReply = await sendContactReply(token, id, replySubject, replyMessage);
      setReplies((prev) => [...prev, newReply]);
      setReplyMessage('');
      setReplySuccess(true);
      // Status is now RESOLVED — refresh message
      const updated = await getContactMessage(token, id);
      setMessage(updated);
      setTimeout(() => setReplySuccess(false), 4000);
    } catch {
      setReplyError('Versturen mislukt. Probeer het opnieuw.');
    } finally {
      setReplySending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Laden...</p>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Terug */}
      <Link
        href="/admin/contact-berichten"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar overzicht
      </Link>

      {/* Success toast */}
      {replySuccess && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-5 py-4">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Antwoord succesvol verstuurd. Status gewijzigd naar Afgehandeld.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contactbericht #{message.id}</h1>
          <div className="mt-1">{statusBadge(message.status)}</div>
        </div>
      </div>

      {/* Details kaart */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        <div className="flex items-center gap-3 px-6 py-4">
          <User className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Naam</p>
            <p className="font-medium text-slate-900">{message.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <Mail className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">E-mailadres</p>
            <a href={`mailto:${message.email}`} className="font-medium text-violet-600 hover:underline">
              {message.email}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Ontvangen op</p>
            <p className="font-medium text-slate-900">{formatDate(message.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-6 py-4">
          <MessageSquare className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-slate-500 mb-2">Bericht</p>
            <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{message.message}</p>
          </div>
        </div>
      </div>

      {/* Berichtgeschiedenis */}
      {replies.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Berichtgeschiedenis</h2>
          <div className="space-y-4">
            {/* Origineel bericht */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">{message.name}</span>
                  <span className="text-xs text-slate-400">{formatDate(message.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
            {/* Antwoorden */}
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-violet-600" />
                </div>
                <div className="flex-1 bg-violet-50 rounded-lg p-4 border border-violet-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-violet-900">{reply.adminEmail} <span className="text-xs font-normal text-violet-500">(admin)</span></span>
                    <span className="text-xs text-slate-400">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Onderwerp: {reply.subject}</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{reply.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Antwoord versturen */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Antwoord versturen</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Onderwerp</label>
            <input
              type="text"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Onderwerp van uw antwoord"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Bericht</label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={6}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder={`Beste ${message.name},\n\nBedankt voor uw bericht...`}
            />
          </div>
          {replyError && (
            <p className="text-sm text-red-600">{replyError}</p>
          )}
          <button
            onClick={handleSendReply}
            disabled={replySending || !replySubject.trim() || !replyMessage.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            {replySending ? 'Versturen...' : 'Verstuur antwoord'}
          </button>
        </div>
      </div>

      {/* Status wijzigen */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Status wijzigen</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleStatusUpdate('NEW')}
            disabled={updating || message.status === 'NEW'}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Markeer als Nieuw
          </button>
          <button
            onClick={() => handleStatusUpdate('IN_PROGRESS')}
            disabled={updating || message.status === 'IN_PROGRESS'}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Markeer als In behandeling
          </button>
          <button
            onClick={() => handleStatusUpdate('RESOLVED')}
            disabled={updating || message.status === 'RESOLVED'}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Markeer als Afgehandeld
          </button>
        </div>
      </div>
    </div>
  );
}
