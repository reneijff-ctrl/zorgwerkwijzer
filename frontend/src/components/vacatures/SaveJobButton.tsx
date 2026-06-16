'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { saveJob, removeSavedJob } from '@/lib/api/applications';
import { useAuth } from '@/hooks/useAuth';

interface SaveJobButtonProps {
  vacancyId: number;
  initialSaved?: boolean;
}

export default function SaveJobButton({ vacancyId, initialSaved = false }: SaveJobButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated || !user) {
      router.push(`/login?from=/vacatures`);
      return;
    }

    startTransition(async () => {
      if (isSaved) {
        const result = await removeSavedJob(vacancyId, user.id);
        if (result.success) setIsSaved(false);
      } else {
        const result = await saveJob({ vacancyId, profileId: user.id });
        if (result.success) setIsSaved(true);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isSaved ? 'Verwijder uit opgeslagen vacatures' : 'Sla vacature op'}
      aria-label={isSaved ? 'Verwijder uit opgeslagen vacatures' : 'Sla vacature op'}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
        isSaved
          ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {isSaved ? 'Opgeslagen' : 'Vacature opslaan'}
    </button>
  );
}
