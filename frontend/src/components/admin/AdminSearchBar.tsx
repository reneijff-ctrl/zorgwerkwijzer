'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = 'Zoeken...',
}: AdminSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
      />
    </div>
  );
}
