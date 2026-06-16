import type { PageResponse } from '@/types/api'

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
  publishedAt: string
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
}

export interface NewsListParams {
  page?: number
  size?: number
  category?: string
}

export async function getArticles(params: NewsListParams = {}): Promise<PageResponse<NewsArticle>> {
  const { page = 0, size = 20, category } = params
  const url = new URL(`${API_BASE}/news`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))
  url.searchParams.set('sort', 'publishedAt,desc')
  if (category) url.searchParams.set('category', category)

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch articles: ${res.status}`)
  }

  return res.json() as Promise<PageResponse<NewsArticle>>
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const res = await fetch(`${API_BASE}/news/${slug}`, {
    next: { revalidate: 3600 },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Failed to fetch article: ${res.status}`)
  }

  return res.json() as Promise<NewsArticle>
}

export async function getAllArticleSlugs(): Promise<Array<{ slug: string; publishedAt: string }>> {
  try {
    const res = await fetch(`${API_BASE}/news?page=0&size=500&sort=publishedAt,desc`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as PageResponse<NewsArticle>
    return data.content.map((a) => ({ slug: a.slug, publishedAt: a.publishedAt }))
  } catch {
    return []
  }
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateString).toLocaleDateString('nl-NL', options ?? {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
