'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { aiAnalyzeAndCreate, type AiAnalyzeRequest, type NewsArticle } from '@/lib/api/admin-news'
import { ArrowLeft, Bot, Link2, FileText, Sparkles, CheckCircle, ExternalLink } from 'lucide-react'

type InputMode = 'url' | 'text'

export default function AiAssistentPage() {
  const { user, token } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState<InputMode>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<NewsArticle | null>(null)

  if (user?.role !== 'ROLE_ADMIN') {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (mode === 'url' && !url.trim()) { setError('Voer een URL in'); return }
    if (mode === 'text' && !text.trim()) { setError('Voer tekst in'); return }

    setLoading(true)
    setError(null)
    setResult(null)

    const request: AiAnalyzeRequest = {
      sourceName: sourceName || undefined,
    }
    if (mode === 'url') request.url = url.trim()
    else request.text = text.trim()

    try {
      const article = await aiAnalyzeAndCreate(token, request)
      setResult(article)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI-analyse mislukt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/nieuwsbeheer"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-violet-600" />
            AI Nieuwsassistent
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Analyseer een nieuwsbron en genereer automatisch een concept-artikel
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-sm text-violet-800">
        <p className="font-medium mb-1">Hoe werkt het?</p>
        <ul className="space-y-1 text-violet-700 list-disc list-inside">
          <li>Voer een URL of tekst in van een nieuwsbericht</li>
          <li>AI analyseert de bron en schrijft een uniek artikel voor ZorgWerkwijzer</li>
          <li>Het artikel wordt opgeslagen als concept — u controleert en publiceert zelf</li>
          <li>Originele bronvermelding wordt automatisch toegevoegd</li>
        </ul>
      </div>

      {/* Formulier */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          {/* Mode selector */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                mode === 'url'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Link2 className="w-4 h-4" />
              URL invoeren
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                mode === 'text'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Tekst plakken
            </button>
          </div>

          {/* URL input */}
          {mode === 'url' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                URL van het nieuwsbericht
              </label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://www.nos.nl/artikel/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Text input */}
          {mode === 'text' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Plak de tekst van het nieuwsbericht
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={10}
                placeholder="Plak hier de volledige tekst van het nieuwsbericht..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y"
              />
              <p className="text-xs text-slate-400 mt-1">{text.length} / 50.000 tekens</p>
            </div>
          )}

          {/* Bron naam */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Naam van de bron <span className="text-slate-400 font-normal">(optioneel)</span>
            </label>
            <input
              type="text"
              value={sourceName}
              onChange={e => setSourceName(e.target.value)}
              placeholder="bijv. NOS Nieuws, Skipr, Zorgvisie"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI analyseert bron...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyseer en maak concept
              </>
            )}
          </button>
        </form>
      )}

      {/* Resultaat */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Concept succesvol aangemaakt!</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Titel</p>
              <p className="text-slate-900 font-medium mt-0.5">{result.title}</p>
            </div>
            {result.excerpt && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Samenvatting</p>
                <p className="text-slate-700 text-sm mt-0.5">{result.excerpt}</p>
              </div>
            )}
            <div className="flex gap-4 text-sm">
              {result.category && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Categorie</p>
                  <p className="text-slate-700 capitalize mt-0.5">{result.category}</p>
                </div>
              )}
              {result.readingTime && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Leesduur</p>
                  <p className="text-slate-700 mt-0.5">{result.readingTime} min</p>
                </div>
              )}
            </div>
            {result.tags && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Tags</p>
                <div className="flex gap-1 flex-wrap mt-1">
                  {result.tags.split(',').map(tag => (
                    <span key={tag} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              href={`/admin/nieuwsbeheer/${result.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Artikel bewerken & publiceren
            </Link>
            <button
              onClick={() => { setResult(null); setUrl(''); setText(''); setSourceName('') }}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Nieuw artikel analyseren
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
