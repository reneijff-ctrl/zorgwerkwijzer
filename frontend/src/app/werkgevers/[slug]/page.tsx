import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEmployerBySlug, getEmployerVacancies } from '@/lib/api/employers';
import type { VacancyListItem } from '@/types/api';
import {
  MapPin,
  Globe,
  Phone,
  Users,
  Calendar,
  Briefcase,
  ArrowRight,
  Building2,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const employer = await getEmployerBySlug(slug);
  if (!employer) return { title: 'Werkgever niet gevonden | ZorgWerkwijzer' };

  const title = employer.seoTitle ?? `Werken bij ${employer.name} | Vacatures | ZorgWerkwijzer`;
  const description =
    employer.seoDescription ??
    `Bekijk alle vacatures van ${employer.name} op ZorgWerkwijzer. ${employer.vacancyCount} open ${employer.vacancyCount === 1 ? 'vacature' : 'vacatures'}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/werkgevers/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/werkgevers/${slug}`,
      ...(employer.logoUrl ? { images: [{ url: employer.logoUrl, alt: employer.name }] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function WerkgeverProfielPage({ params }: Props) {
  const { slug } = await params;
  const [employer, vacanciesData] = await Promise.all([
    getEmployerBySlug(slug),
    getEmployerVacancies(slug, 0, 10),
  ]);

  if (!employer) notFound();

  const vacancies: VacancyListItem[] = vacanciesData?.content ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: employer.name,
    url: employer.websiteUrl ?? undefined,
    logo: employer.logoUrl ?? undefined,
    telephone: employer.phoneNumber ?? undefined,
    address: employer.city
      ? {
          '@type': 'PostalAddress',
          addressLocality: employer.city,
          addressRegion: employer.province ?? undefined,
          postalCode: employer.postalCode ?? undefined,
          addressCountry: 'NL',
        }
      : undefined,
    description: employer.description ?? undefined,
    foundingDate: employer.foundedYear ? String(employer.foundedYear) : undefined,
    numberOfEmployees: employer.employeeCount
      ? { '@type': 'QuantitativeValue', value: employer.employeeCount }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero / Cover */}
      <div className="bg-white border-b border-slate-200">
        {employer.coverImageUrl && (
          <div className="w-full h-48 md:h-64 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={employer.coverImageUrl}
              alt={`${employer.name} header`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-5">
            {/* Logo */}
            <div className="shrink-0 w-20 h-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
              {employer.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={employer.logoUrl}
                  alt={`${employer.name} logo`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Building2 className="w-10 h-10 text-slate-300" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{employer.name}</h1>
                {employer.isPremium && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    Premium
                  </span>
                )}
              </div>

              {/* Meta-info rij */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                {(employer.city || employer.province) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {[employer.city, employer.province].filter(Boolean).join(', ')}
                  </span>
                )}
                {employer.employeeCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {employer.employeeCount} medewerkers
                  </span>
                )}
                {employer.foundedYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Actief sinds {employer.foundedYear}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {employer.vacancyCount}{' '}
                  {employer.vacancyCount === 1 ? 'vacature' : 'vacatures'}
                </span>
              </div>

              {/* Acties */}
              <div className="flex flex-wrap gap-3 mt-4">
                {employer.websiteUrl && (
                  <a
                    href={employer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Website bezoeken
                  </a>
                )}
                {employer.phoneNumber && (
                  <a
                    href={`tel:${employer.phoneNumber}`}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-700"
                  >
                    <Phone className="w-4 h-4" />
                    {employer.phoneNumber}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hoofdinhoud */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Linker kolom: over het bedrijf */}
          <div className="lg:col-span-2 space-y-8">
            {employer.description && (
              <section>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Over {employer.name}
                </h2>
                <div className="prose prose-slate prose-sm max-w-none">
                  {employer.description.split('\n').map((line, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Open vacatures */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Open vacatures
                {employer.vacancyCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400">
                    ({employer.vacancyCount})
                  </span>
                )}
              </h2>

              {vacancies.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">
                    Momenteel geen open vacatures.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vacancies.map((vacancy) => (
                    <Link
                      key={vacancy.id}
                      href={`/vacature/${vacancy.slug}`}
                      className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors text-sm">
                            {vacancy.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                            {vacancy.cityName && (
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                {vacancy.cityName}
                              </span>
                            )}
                            {vacancy.employmentType && (
                              <span className="capitalize">
                                {vacancy.employmentType.toLowerCase().replace('_', ' ')}
                              </span>
                            )}
                            {vacancy.salaryMin && vacancy.salaryMax && (
                              <span>
                                €{vacancy.salaryMin.toLocaleString('nl-NL')} – €
                                {vacancy.salaryMax.toLocaleString('nl-NL')}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 shrink-0 transition-colors mt-0.5" />
                      </div>
                    </Link>
                  ))}
                  {employer.vacancyCount > vacancies.length && (
                    <Link
                      href={`/vacatures?employer=${slug}`}
                      className="block text-center text-sm text-sky-600 hover:text-sky-700 font-medium py-2"
                    >
                      Bekijk alle {employer.vacancyCount} vacatures →
                    </Link>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Rechter kolom: sidebar info */}
          <aside className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-slate-800">Bedrijfsinformatie</h3>

              {employer.address && (
                <div className="flex gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <span>{employer.address}</span>
                </div>
              )}
              {!employer.address && employer.city && (
                <div className="flex gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <span>
                    {[employer.postalCode, employer.city, employer.province]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
              {employer.websiteUrl && (
                <div className="flex gap-2 text-slate-600">
                  <Globe className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                  <a
                    href={employer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline truncate"
                  >
                    {employer.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {employer.employeeCount && (
                <div className="flex gap-2 text-slate-600">
                  <Users className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{employer.employeeCount} medewerkers</span>
                </div>
              )}
              {employer.foundedYear && (
                <div className="flex gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Opgericht in {employer.foundedYear}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
