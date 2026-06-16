'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  getNewsArticle,
  updateNewsArticle,
  publishNewsArticle,
  unpublishNewsArticle,
  type NewsArticle,
} from '@/lib/api/admin-news'
import {
  ArrowLeft,
  Save,
  Globe,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

const CATEGORIES = [
  'cao-nieuws', 'salaris', 'arbeidsmarkt', 'ouderenzorg', 'ggz',
  'gehandicaptenzorg', 'ziekenhuizen', 'jeugdzorg', 'opleidingen', 'wetgeving',
]

export default function ArticleEditPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [featuredQuote, setFeaturedQuote] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  useEffect(() => {
    if (user?.role !== 'ROLE_ADMIN') { router.push('/login'); return }
    if (!token || !id) return
    getNewsArticle(token, id)
      .then(a => {
        setArticle(a)
        setTitle(a.title)
        setExcerpt(a.excerpt ?? '')
        setContent(a.content)
        setCategory(a.category ?? '')
        setTags(a.tags ?? '')
        setMetaTitle(a.metaTitle ?? '')
        setMetaDescription(a.metaDescription ?? '')
        setFeaturedQuote(a.featuredQuote ?? '')
        setSourceName(a.sourceName ?? '')
        setSourceUrl(a.sourceUrl ?? '')
      })
      .catch(() => setError('Artikel niet gevonden'))
      .finally(() => setLoading(false))
  }, [user, router, token, id])

  const handleSave = async () => {
    if (!token || !article) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const updated = await updateNewsArticle(token, id, {
        ...article,
        title, excerpt, content, category, tags,
        metaTitle, metaDescription, featuredQuote,
        sourceName, sourceUrl,
      })
      setArticle(updated)
      setSuccess('Artikel opgeslagen')
      setTimeout(() => setSuccess(null), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Opslaan mislukt')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!token || !article) return
    setSaving(true)
    try {
      await handleSave()
      const updated = await publishNewsArticle(token, id)
      setArticle(updated)
      setSuccess('Artikel gepubliceerd!')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Publiceren mislukt')
    } finally {
      setSaving(false)
    }
  }

  const handleUnpublish = async () => {
    if (!token || !article) return
    setSaving(true)
    try {
      const updated = await unpublishNewsArticle(token, id)
      setArticle(updated)
      setSuccess('Artikel teruggeplaatst naar concept')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Depubliceren mislukt')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-slate-500">Laden...</div>
  if (!article) return <div className="p-8 text-red-600">{error ?? 'Artikel niet gevonden'}</div>

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/nieuwsbeheer"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Artikel bewerken</h1>
              {article.aiGenerated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                  <Sparkles className="w-3 h-3" />AI gegenereerd
                </span>
              )}
              {article.status === 'PUBLISHED' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <Globe className="w-3 h-3" />Gepubliceerd
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  <FileText className="w-3 h-3" />Concept
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs mt-0.5">ID: {article.id} · Slug: {article.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {article.isPublished && (
            <Link
              href={`/nieuws/${article.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Bekijken
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Opslaan
          </button>
          {article.status !== 'PUBLISHED' ? (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              Publiceren
            </button>
          ) : (
            <button
              onClick={handleUnpublish}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              Depubliceren
            </button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">{success}</div>}

      <div className="grid grid-cols-3 gap-6">
        {/* Hoofdinhoud */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Titel</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Samenvatting</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Inhoud (HTML)</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
              />
            </div>
            {featuredQuote !== undefined && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Uitgelichte quote</label>
                <textarea
                  value={featuredQuote}
                  onChange={e => setFeaturedQuote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                />
              </div>
            )}
          </div>
        </div>

        {/* Zijbalk */}
        <div className="space-y-4">
          {/* Categorie & Tags */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Classificatie</h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Categorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-slate-700"
              >
                <option value="">Selecteer categorie</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tags (komma-gescheiden)</label>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="cao-vvt, verpleegkundige, salaris"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">SEO</h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Meta titel <span className="text-slate-400">({metaTitle.length}/60)</span></label>
              <input
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                maxLength={60}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Meta beschrijving <span className="text-slate-400">({metaDescription.length}/160)</span></label>
              <textarea
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>
          </div>

          {/* Bronvermelding */}
          {(article.sourceName || article.sourceUrl) && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Bronvermelding</h3>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Bronnaam</label>
                <input
                  value={sourceName}
                  onChange={e => setSourceName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Bron URL</label>
                <input
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
