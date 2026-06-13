import { MetadataRoute } from 'next'
import type { PageResponse, VacancyListItem, EmployerDetail } from '@/types/api'
import { getAllArticleSlugs } from '@/lib/api/news'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

async function getEmployersForSitemap(): Promise<Array<{ slug: string; updatedAt: string }>> {
  try {
    const res = await fetch(`${API_BASE}/employers?page=0&size=500`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as PageResponse<EmployerDetail>
    return data.content.map((e) => ({ slug: e.slug, updatedAt: e.updatedAt }))
  } catch {
    return []
  }
}

async function getVacanciesForSitemap(): Promise<Array<{ slug: string; publishedAt: string }>> {
  try {
    const res = await fetch(`${API_BASE}/vacancies?page=0&size=1000&sort=publishedAt,desc`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as PageResponse<VacancyListItem>
    return data.content.map((v) => ({ slug: v.slug, publishedAt: v.publishedAt }))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zorgwerkwijzer.nl'

  const apiNews = await getAllArticleSlugs()
  const newsUrls = apiNews.map((article) => ({
    url: `${baseUrl}/nieuws/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const apiVacancies = await getVacanciesForSitemap()
  const vacancyUrls = apiVacancies.map((v) => ({
    url: `${baseUrl}/vacatures/${v.slug}`,
    lastModified: new Date(v.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const apiEmployers = await getEmployersForSitemap()
  const employerUrls = apiEmployers.map((e) => ({
    url: `${baseUrl}/werkgevers/${e.slug}`,
    lastModified: new Date(e.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/nieuws`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...newsUrls,
    {
      url: `${baseUrl}/vacatures`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...vacancyUrls,
    {
      url: `${baseUrl}/werkgevers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...employerUrls,
    {
      url: `${baseUrl}/salaris-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ort-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vakantiegeld-berekenen`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cao-vvt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cao/ziekenhuizen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/salaris/helpende-plus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/salaris/verzorgende-ig`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/salaris/verpleegkundige`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/salaris/doktersassistent`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/eindejaarsuitkering-berekenen`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reiskostenvergoeding-zorg`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fwg-uitleg`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pensioen-zorg`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
