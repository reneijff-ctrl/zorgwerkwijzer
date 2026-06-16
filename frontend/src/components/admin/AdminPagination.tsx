'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  page,
  totalPages,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-slate-500">
        Pagina {page + 1} van {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className={clsx(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-xl border transition-colors',
            page === 0
              ? 'border-slate-100 text-slate-300 cursor-not-allowed'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50',
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Vorige
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className={clsx(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-xl border transition-colors',
            page >= totalPages - 1
              ? 'border-slate-100 text-slate-300 cursor-not-allowed'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50',
          )}
        >
          Volgende
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
