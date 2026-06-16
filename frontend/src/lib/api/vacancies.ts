import type {
  VacancyListItem,
  VacancyDetail,
  PageResponse,
  EmploymentType,
  EducationLevel,
} from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

// ISR revalidatie: vacatures elke 5 minuten verversen
const VACANCY_REVALIDATE = 300;

export interface VacancySearchParams {
  q?: string;
  cityId?: number;
  occupationId?: number;
  employmentType?: EmploymentType;
  educationLevel?: EducationLevel;
  page?: number;
  size?: number;
}

/**
 * Haal gepagineerde lijst van actieve vacatures op.
 * Gebruikt ISR caching (1 uur).
 */
export async function getVacancies(
  page = 0,
  size = 20,
): Promise<PageResponse<VacancyListItem>> {
  const url = `${API_BASE}/vacancies?page=${page}&size=${size}&sort=isFeatured,desc&sort=publishedAt,desc`;

  const res = await fetch(url, {
    next: { revalidate: VACANCY_REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`Vacatures ophalen mislukt: ${res.status}`);
  }

  return res.json() as Promise<PageResponse<VacancyListItem>>;
}

/**
 * Zoek vacatures met optionele filters.
 * Geen ISR caching — zoekresultaten zijn dynamisch per request.
 */
export async function searchVacancies(
  params: VacancySearchParams,
): Promise<PageResponse<VacancyListItem>> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.cityId != null) searchParams.set('cityId', String(params.cityId));
  if (params.occupationId != null)
    searchParams.set('occupationId', String(params.occupationId));
  if (params.employmentType) searchParams.set('employmentType', params.employmentType);
  if (params.educationLevel) searchParams.set('educationLevel', params.educationLevel);
  searchParams.set('page', String(params.page ?? 0));
  searchParams.set('size', String(params.size ?? 20));
  searchParams.append('sort', 'isFeatured,desc');
  searchParams.append('sort', 'publishedAt,desc');

  const url = `${API_BASE}/vacancies/search?${searchParams.toString()}`;

  const res = await fetch(url, {
    // ISR caching: zoekresultaten worden 1 uur gecached.
    // Dit is vereist zodat /beroepen/[slug] en /salaris/[slug] als SSG (●) worden gebouwd.
    next: { revalidate: VACANCY_REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(`Vacature zoeken mislukt: ${res.status}`);
  }

  return res.json() as Promise<PageResponse<VacancyListItem>>;
}

/**
 * Haal één vacature op via slug (voor detail- en SEO-pagina's).
 * Gebruikt ISR caching.
 */
export async function getVacancyBySlug(slug: string): Promise<VacancyDetail | null> {
  const url = `${API_BASE}/vacancies/slug/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    next: { revalidate: VACANCY_REVALIDATE },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Vacature ophalen mislukt: ${res.status}`);
  }

  return res.json() as Promise<VacancyDetail>;
}

/**
 * Haal alle slug's op voor generateStaticParams.
 * Fetcht maximaal 500 items (voor statische build).
 */
export async function getAllVacancySlugs(): Promise<string[]> {
  const url = `${API_BASE}/vacancies?page=0&size=500&sort=publishedAt,desc`;

  try {
    const res = await fetch(url, {
      next: { revalidate: VACANCY_REVALIDATE },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as PageResponse<VacancyListItem>;
    return data.content.map((v) => v.slug);
  } catch {
    return [];
  }
}

/**
 * Haal gerelateerde vacatures op op basis van occupationName of cityName (als zoektekst),
 * exclusief de huidige vacature.
 */
export async function getRelatedVacancies(
  occupationName: string | null | undefined,
  cityName: string | null | undefined,
  excludeSlug: string,
  size = 4,
): Promise<VacancyListItem[]> {
  const query = occupationName ?? cityName;
  if (!query) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      page: '0',
      size: String(size * 2),
      sort: 'publishedAt,desc',
    });
    const url = `${API_BASE}/vacancies/search?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: VACANCY_REVALIDATE } });
    if (!res.ok) return [];
    const data = (await res.json()) as PageResponse<VacancyListItem>;
    return data.content.filter((v) => v.slug !== excludeSlug).slice(0, size);
  } catch {
    return [];
  }
}

/**
 * Formatteert salarisindicatie voor weergave.
 * Geeft 'Nader te bepalen' terug als beide null zijn.
 */
export function formatSalary(min: number | null, max: number | null): string {
  if (min == null && max == null) return 'Nader te bepalen';
  if (min != null && max != null) {
    return `€ ${min.toLocaleString('nl-NL')} – € ${max.toLocaleString('nl-NL')}`;
  }
  if (min != null) return `Vanaf € ${min.toLocaleString('nl-NL')}`;
  return `Tot € ${max!.toLocaleString('nl-NL')}`;
}

/**
 * Formatteert urenrange voor weergave.
 */
export function formatHours(min: number | null, max: number | null): string {
  if (min == null && max == null) return 'Nader te bepalen';
  if (min != null && max != null) return `${min} – ${max} uur`;
  if (min != null) return `Vanaf ${min} uur`;
  return `Tot ${max} uur`;
}
