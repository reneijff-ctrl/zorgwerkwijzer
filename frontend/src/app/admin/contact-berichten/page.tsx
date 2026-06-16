'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Mail, Clock, CheckCircle, AlertCircle, Search, X } from 'lucide-react';
import AdminPagination from '@/components/admin/AdminPagination';
import { useAuth } from '@/hooks/useAuth';
import {
  searchContactMessages,
  getContactMessageStats,
  type ContactMessageDto,
  type ContactMessageStatsDto,
  type PageResponse,
} from '@/lib/api/contact-messages';

function statusBadge(status: ContactMessageDto['status']) {
  switch (status) {
    case 'NEW':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Nieuw</span>;
    case 'IN_PROGRESS':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">In behandeling</span>;
    case 'RESOLVED':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Afgehandeld</span>;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminContactBerichtenPage() {
  const { token } = useAuth();
  const [data, setData] = useState<PageResponse<ContactMessageDto> | null>(null);
  const [stats, setStats] = useState<ContactMessageStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Filter state
  const [searchInput, setSearchInput] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState('ALL');
  const [sort, setSort] = useState('DESC');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce zoekveld
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQ(value);
      setPage(0);
    }, 300);
  };

  const clearSearch = () => {
    setSearchInput('');
    setQ('');
    setPage(0);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pageData, statsData] = await Promise.all([
        searchContactMessages(token, { q, status, dateRange, sort, page, size: 20 }),
        getContactMessageStats(token),
      ]);
      setData(pageData);
      setStats(statsData);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [token, q, status, dateRange, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset pagina bij filterwijziging
  const handleStatusChange = (val: string) => { setStatus(val); setPage(0); };
  const handleDateRangeChange = (val: string) => { setDateRange(val); setPage(0); };
  const handleSortChange = (val: string) => { setSort(val); setPage(0); };

  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contactberichten</h1>
          <p className="text-sm text-slate-500 mt-1">Beheer inkomende contactberichten van bezoekers</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <Mail className="w-8 h-8 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Totaal</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">Nieuw</p>
              <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-xs text-slate-500">In behandeling</p>
              <p className="text-2xl font-bold text-amber-600">{stats.inProgressCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-500">Afgehandeld</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.resolvedCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zoek- en filterbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Zoekveld */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Zoek op naam, e-mail of bericht..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="">Alle statussen</option>
            <option value="NEW">Nieuw</option>
            <option value="IN_PROGRESS">In behandeling</option>
            <option value="RESOLVED">Afgehandeld</option>
          </select>

          {/* Datum filter */}
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="ALL">Alle datums</option>
            <option value="TODAY">Vandaag</option>
            <option value="WEEK">Afgelopen 7 dagen</option>
            <option value="MONTH">Afgelopen 30 dagen</option>
          </select>

          {/* Sortering */}
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="DESC">Nieuwste eerst</option>
            <option value="ASC">Oudste eerst</option>
          </select>
        </div>
      </div>

      {/* Resultaatteller */}
      {!loading && (
        <p className="text-sm text-slate-500">
          {totalElements === 0
            ? 'Geen contactberichten gevonden'
            : `${totalElements} contactbericht${totalElements !== 1 ? 'en' : ''} gevonden`}
        </p>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Naam</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">E-mail</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Datum</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Actie</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Laden...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Geen contactberichten gevonden</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.email}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/contact-berichten/${item.id}`}
                        className="text-violet-600 hover:text-violet-800 font-medium text-xs"
                      >
                        Bekijken →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200">
            <AdminPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
