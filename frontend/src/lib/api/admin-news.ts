const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export interface NewsArticle {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string | null
  author: string | null
  featuredImageUrl: string | null
  isPublished: boolean
  publishedAt: string | null
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  tags: string | null
  sourceName: string | null
  sourceUrl: string | null
  sourcePublishedAt: string | null
  importedAt: string | null
  aiGenerated: boolean
  readingTime: number | null
  featuredQuote: string | null
  scheduledAt: string | null
}

export interface NewsPageResponse {
  content: NewsArticle[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface NewsStats {
  draft: number
  published: number
  scheduled: number
  total: number
}

export interface AiAnalyzeRequest {
  url?: string
  text?: string
  sourceName?: string
  sourcePublishedAt?: string
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export async function getAdminNews(
  token: string,
  status?: string,
  page = 0,
  size = 20
): Promise<NewsPageResponse> {
  const url = new URL(`${API_BASE}/admin/news`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))
  url.searchParams.set('sort', 'createdAt,desc')
  if (status) url.searchParams.set('status', status)
  const res = await fetch(url.toString(), { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`Fout bij ophalen artikelen: ${res.status}`)
  return res.json()
}

export async function getNewsStats(token: string): Promise<NewsStats> {
  const res = await fetch(`${API_BASE}/admin/news/stats`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`Fout bij ophalen statistieken: ${res.status}`)
  return res.json()
}

export async function getNewsArticle(token: string, id: number): Promise<NewsArticle> {
  const res = await fetch(`${API_BASE}/admin/news/${id}`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`Artikel niet gevonden: ${res.status}`)
  return res.json()
}

export async function createNewsArticle(token: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
  const res = await fetch(`${API_BASE}/admin/news`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Aanmaken mislukt: ${res.status}`)
  return res.json()
}

export async function updateNewsArticle(token: string, id: number, data: Partial<NewsArticle>): Promise<NewsArticle> {
  const res = await fetch(`${API_BASE}/admin/news/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Bijwerken mislukt: ${res.status}`)
  return res.json()
}

export async function publishNewsArticle(token: string, id: number): Promise<NewsArticle> {
  const res = await fetch(`${API_BASE}/admin/news/${id}/publish`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`Publiceren mislukt: ${res.status}`)
  return res.json()
}

export async function unpublishNewsArticle(token: string, id: number): Promise<NewsArticle> {
  const res = await fetch(`${API_BASE}/admin/news/${id}/unpublish`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`Depubliceren mislukt: ${res.status}`)
  return res.json()
}

export async function deleteNewsArticle(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/news/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`Verwijderen mislukt: ${res.status}`)
}

export async function aiAnalyzeAndCreate(token: string, request: AiAnalyzeRequest): Promise<NewsArticle> {
  const res = await fetch(`${API_BASE}/admin/news/ai/analyze`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`AI-analyse mislukt: ${res.status}`)
  return res.json()
}
