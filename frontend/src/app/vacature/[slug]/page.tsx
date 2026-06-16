import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Euro,
  Calendar,
  Building2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { getVacancyBySlug, getAllVacancySlugs, formatSalary, formatHours, getRelatedVacancies } from '@/lib/api/vacancies';
import type { VacancyListItem } from '@/types/api';
import { EMPLOYMENT_TYPE_LABELS, EDUCATION_LEVEL_LABELS } from '@/types/api';
import ApplyButton from '@/components/vacatures/ApplyButton';
import SaveJobButton from '@/components/vacatures/SaveJobButton';

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-render bekende vacature-URL's bij build (ISR fallback voor nieuwe vacatures)
export async function generateStaticParams() {
  const slugs = await getAllVacancySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = await getVacancyBySlug(slug);

  if (!vacancy) {
    return { title: 'Vacature niet gevonden | Zorgwerkwijzer' };
  }

  const title = vacancy.seoTitle ?? `${vacancy.title} bij ${vacancy.employerName} | Zorgwerkwijzer`;
  const description =
    vacancy.seoDescription ??
    `Bekijk de vacature voor ${vacancy.title} in ${vacancy.cityName ?? 'Nederland'}. ${formatSalary(vacancy.salaryMin, vacancy.salaryMax)}. Solliciteer direct via Zorgwerkwijzer!`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://zorgwerkwijzer.nl/vacature/${vacancy.slug}`,
    },
    openGraph: {
      title: `${vacancy.title} bij ${vacancy.employerName}`,
      description: vacancy.description.substring(0, 160),
      type: 'article',
      url: `https://zorgwerkwijzer.nl/vacature/${vacancy.slug}`,
      publishedTime: vacancy.publishedAt,
      modifiedTime: vacancy.updatedAt,
    },
    twitter: {
      card: 'summary',
      title: `${vacancy.title} bij ${vacancy.employerName} | ZorgWerkwijzer`,
      description: description.substring(0, 200),
    },
  };
}

export default async function VacancyDetailPage({ params }: Props) {
  const { slug } = await params;
  const vacancy = await getVacancyBySlug(slug);

  if (!vacancy) {
    notFound();
  }

  const salaryLabel = formatSalary(vacancy.salaryMin, vacancy.salaryMax);
  const hoursLabel = formatHours(vacancy.hoursMin, vacancy.hoursMax);
  const employmentLabel = vacancy.employmentType
    ? EMPLOYMENT_TYPE_LABELS[vacancy.employmentType]
    : null;
  const educationLabel = vacancy.educationLevel
    ? EDUCATION_LEVEL_LABELS[vacancy.educationLevel]
    : null;

  // Gerelateerde vacatures: zelfde functiegroep of zelfde stad
  const related: VacancyListItem[] = await getRelatedVacancies(
    vacancy.occupationName,
    vacancy.cityName,
    vacancy.slug,
  );

  // Schema.org JobPosting JSON-LD voor Google for Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: vacancy.title,
    description: vacancy.description,
    datePosted: vacancy.publishedAt,
    ...(vacancy.expiresAt ? { validThrough: vacancy.expiresAt } : {}),
    employmentType: vacancy.employmentType
      ? mapEmploymentTypeToSchema(vacancy.employmentType)
      : undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: vacancy.employerName,
      ...(vacancy.employerWebsiteUrl ? { sameAs: vacancy.employerWebsiteUrl } : {}),
      ...(vacancy.employerLogoUrl ? { logo: vacancy.employerLogoUrl } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: vacancy.cityName ?? 'Nederland',
        addressRegion: 'Nederland',
        addressCountry: 'NL',
      },
    },
    ...(vacancy.salaryMin || vacancy.salaryMax
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: {
              '@type': 'QuantitativeValue',
              ...(vacancy.salaryMin ? { minValue: vacancy.salaryMin } : {}),
              ...(vacancy.salaryMax ? { maxValue: vacancy.salaryMax } : {}),
              unitText: 'MONTH',
            },
          },
        }
      : {}),
    ...(vacancy.educationLevel
      ? { educationRequirements: educationLabel }
      : {}),
    directApply: true,
    identifier: {
      '@type': 'PropertyValue',
      name: 'ZorgWerkwijzer',
      value: String(vacancy.id),
    },
    url: `https://zorgwerkwijzer.nl/vacature/${vacancy.slug}`,
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zorgwerkwijzer.nl' },
      { '@type': 'ListItem', position: 2, name: 'Vacatures', item: 'https://zorgwerkwijzer.nl/vacatures' },
      { '@type': 'ListItem', position: 3, name: vacancy.title, item: `https://zorgwerkwijzer.nl/vacature/${vacancy.slug}` },
    ],
  };

  const publishedDate = new Date(vacancy.publishedAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb navigatie */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/vacatures"
            className="inline-flex items-center text-slate-500 hover:text-sky-600 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Terug naar alle vacatures
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hoofdinhoud */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              {/* Header */}
              <header className="p-8 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {vacancy.occupationName && (
                    <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {vacancy.occupationName}
                    </span>
                  )}
                  {employmentLabel && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {employmentLabel}
                    </span>
                  )}
                  {educationLabel && (
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {educationLabel}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">{vacancy.title}</h1>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    {vacancy.employerWebsiteUrl ? (
                      <a
                        href={vacancy.employerWebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:text-sky-600 transition-colors inline-flex items-center gap-1"
                      >
                        {vacancy.employerName}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="font-semibold">{vacancy.employerName}</span>
                    )}
                  </div>
                  {vacancy.cityName && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      {vacancy.cityName}
                    </div>
                  )}
                </div>
              </header>

              {/* Body */}
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Functieomschrijving</h2>
                <div className="prose prose-slate max-w-none text-slate-600 mb-8">
                  {vacancy.description.split('\n').map((paragraph, i) =>
                    paragraph.trim() ? <p key={i}>{paragraph}</p> : null,
                  )}
                </div>

                {vacancy.requirements && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Functievereisten</h2>
                    <div className="prose prose-slate max-w-none text-slate-600 mb-8">
                      {vacancy.requirements.split('\n').map((line, i) =>
                        line.trim() ? <p key={i}>{line}</p> : null,
                      )}
                    </div>
                  </>
                )}

                <h2 className="text-xl font-bold text-slate-900 mb-4">Wat wij bieden</h2>
                <ul className="space-y-3 mb-8">
                  {[
                    `Salaris: ${salaryLabel}`,
                    'Goede onregelmatigheidstoeslagen (ORT)',
                    '8,33% eindejaarsuitkering',
                    '8% vakantiegeld',
                    'Pensioenopbouw bij PFZW',
                    'Ruime opleidingsmogelijkheden',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Tip box */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    Zorgwerkwijzer Tip
                  </h3>
                  <p className="text-sm text-slate-600">
                    Benieuwd wat je netto overhoudt bij deze baan? Gebruik onze{' '}
                    <Link
                      href="/salaris-calculator"
                      className="text-sky-600 font-bold hover:underline"
                    >
                      Salaris Calculator
                    </Link>{' '}
                    om je netto loon inclusief ORT te berekenen.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Zijbalk */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Solliciteer card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <ApplyButton vacancyId={vacancy.id} vacancyTitle={vacancy.title} employerName={vacancy.employerName} />
                <SaveJobButton vacancyId={vacancy.id} />
              </div>

              {/* Kenmerken card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-6">Kenmerken</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Uren</p>
                      <p className="text-slate-700 font-medium">{hoursLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Euro className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Salaris</p>
                      <p className="text-slate-700 font-medium">{salaryLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Gepubliceerd</p>
                      <p className="text-slate-700 font-medium">{publishedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Werkgever info */}
                <div className="border-t border-slate-100 pt-4 mb-4">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-3">Werkgever</p>
                  <div className="flex items-center gap-3 mb-3">
                    {vacancy.employerLogoUrl ? (
                      <img
                        src={vacancy.employerLogoUrl}
                        alt={vacancy.employerName}
                        className="w-10 h-10 rounded-xl object-contain border border-slate-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-sky-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{vacancy.employerName}</p>
                      {vacancy.employerWebsiteUrl && (
                        <a
                          href={vacancy.employerWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-sky-600 hover:underline flex items-center gap-0.5"
                        >
                          Website
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {vacancy.employerSlug && (
                    <Link
                      href={`/werkgevers/${vacancy.employerSlug}`}
                      className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-sky-300 hover:text-sky-700 text-slate-600 text-sm font-medium py-2 rounded-xl transition-colors"
                    >
                      Bekijk bedrijfsprofiel
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Tool-links */}
              <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl p-6 text-white shadow-lg shadow-sky-600/20">
                <h3 className="font-bold mb-4">Hulp bij je keuze?</h3>
                <p className="text-sky-100 text-sm mb-6">
                  Gebruik onze tools om je arbeidsvoorwaarden te checken.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/salaris-calculator"
                    className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl p-3 text-sm font-medium transition-colors"
                  >
                    Salaris Calculator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/ort-calculator"
                    className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl p-3 text-sm font-medium transition-colors"
                  >
                    ORT Calculator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {vacancy.occupationName && (
                    <Link
                      href={`/salaris/${vacancy.occupationName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl p-3 text-sm font-medium transition-colors"
                    >
                      Salaris {vacancy.occupationName}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Gerelateerde vacatures */}
      {related.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">Gerelateerde vacatures</h2>
              <Link
                href="/vacatures"
                className="text-sm text-sky-600 hover:underline flex items-center gap-1"
              >
                Alle vacatures
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((v) => (
                <Link
                  key={v.id}
                  href={`/vacature/${v.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md p-5 flex flex-col gap-3 transition-all group"
                >
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors text-sm leading-snug line-clamp-2">
                      {v.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{v.employerName}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {v.cityName && (
                      <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 rounded-lg px-2 py-0.5">
                        {v.cityName}
                      </span>
                    )}
                    {v.occupationName && (
                      <span className="inline-flex items-center gap-1 text-xs bg-sky-50 text-sky-700 rounded-lg px-2 py-0.5">
                        {v.occupationName}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Vertaalt Spring Boot enum naar Schema.org formaat
function mapEmploymentTypeToSchema(type: string): string {
  const mapping: Record<string, string> = {
    VAST: 'FULL_TIME',
    TIJDELIJK: 'TEMPORARY',
    ZZP: 'CONTRACTOR',
    DETACHERING: 'CONTRACTOR',
    BIJBAAN: 'PART_TIME',
    STAGE: 'INTERN',
  };
  return mapping[type] ?? 'OTHER';
}
