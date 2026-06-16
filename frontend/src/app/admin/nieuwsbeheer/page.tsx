'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getAdminNews,
  getNewsStats,
  publishNewsArticle,
  unpublishNewsArticle,
  deleteNewsArticle,
  type NewsArticle,
  type NewsStats,
} from '@/lib/api/admin-news'
import {
  FileText,
  Globe,
  Clock,
  Sparkles,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Bot,
} from 'lucide-react'

const STATUS_TABS = [
  { key: '', label: 'Alle' },
  { key: 'DRAFT', label: 'Concepten' },
  { key: 'PUBLISHED', label: 'Gepubliceerd' },
  { key: 'SCHEDULED', label: 'Gepland' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'PUBLISHED')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><Globe className="w-3 h-3" />Gepubliceerd</span>
  if (status === 'SCHEDULED')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><Clock className="w-3 h-3" />Gepland</span>
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><FileText className="w-3 h-3" />Concept</span>
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminNieuwsbeheerPage() {
  const { user, token } = useAuth()
  const router = useRouter()

  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [stats, setStats] = useState<NewsStats | null>(null)
  const [activeTab, setActiveTab] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [pageData, statsData] = await Promise.all([
        getAdminNews(token, activeTab || undefined, page),
        getNewsStats(token),
      ])
      setArticles(pageData.content)
      setTotalPages(pageData.totalPages)
      setTotalElements(pageData.totalElements)
      setStats(statsData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fout bij laden')
    } finally {
      setLoading(false)
    }
  }, [token, activeTab, page])

  useEffect(() => {
    if (user?.role !== 'ROLE_ADMIN') { router.push('/login'); return }
    load()
  }, [user, router, load])

  const handlePublish = async (id: number) => {
    if (!token) return
    setActionLoading(id)
    try {
      await publishNewsArticle(token, id)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnpublish = async (id: number) => {
    if (!token) return
    setActionLoading(id)
    try {
      await unpublishNewsArticle(token, id)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Artikel "${title}" definitief verwijderen?`)) return
    if (!token) return
    setActionLoading(id)
    try {
      await deleteNewsArticle(token, id)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nieuwsbeheer</h1>
          <p className="text-slate-500 text-sm mt-1">Beheer en publiceer nieuwsartikelen</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/nieuwsbeheer/ai-assistent"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            <Bot className="w-4 h-4" />
            AI Assistent
          </Link>
          <Link
            href="/admin/nieuwsbeheer/nieuw"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nieuw artikel
          </Link>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Totaal', value: stats.total, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
            { label: 'Concepten', value: stats.draft, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
            { label: 'Gepubliceerd', value: stats.published, icon: Globe, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Gepland', value: stats.scheduled, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`${bg} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(0) }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Laden...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Geen artikelen gevonden</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Titel</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Categorie</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Datum</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {article.aiGenerated && (
                        <span title="AI gegenereerd"><Sparkles className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" /></span>
                      )}
                      <span className="font-medium text-slate-900 line-clamp-1">{article.title}</span>
                    </div>
                    {article.tags && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {article.tags.split(',').slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 capitalize">
                    {article.category ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(article.publishedAt ?? article.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/nieuwsbeheer/${article.id}`}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title="Bewerken"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {article.status !== 'PUBLISHED' ? (
                        <button
                          onClick={() => handlePublish(article.id)}
                          disabled={actionLoading === article.id}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                          title="Publiceren"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(article.id)}
                          disabled={actionLoading === article.id}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors disabled:opacity-50"
                          title="Depubliceren"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      {article.isPublished && (
                        <Link
                          href={`/nieuws/${article.slug}`}
                          target="_blank"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="Bekijken op site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={actionLoading === article.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginering */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{totalElements} artikelen totaal</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Vorige
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i).map(i => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1.5 border rounded-lg ${
                  page === i
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Volgende
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
