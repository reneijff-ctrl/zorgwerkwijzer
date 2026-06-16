'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const ApplicationForm = dynamic(() => import('./ApplicationForm'), {
  ssr: false,
});

interface ApplyButtonProps {
  vacancyId: number;
  vacancyTitle: string;
  employerName: string;
}

export default function ApplyButton({ vacancyId, vacancyTitle, employerName }: ApplyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
      >
        Direct Solliciteren
        <ArrowRight className="w-5 h-5" />
      </button>

      {open && (
        <ApplicationForm
          vacancyId={vacancyId}
          vacancyTitle={vacancyTitle}
          employerName={employerName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
