import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, MapPin, Briefcase, ExternalLink } from 'lucide-react';
import type { EmployerDetail, PageResponse } from '@/types/api';

export const metadata: Metadata = {
  title: 'Alle Werkgevers in de Zorg | ZorgWerkwijzer',
  description:
    'Bekijk alle zorgwerkgevers op ZorgWerkwijzer. Ontdek vacatures bij ziekenhuizen, thuiszorgorganisaties, verpleeghuizen en meer.',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/werkgevers',
  },
  openGraph: {
    title: 'Alle Werkgevers in de Zorg | ZorgWerkwijzer',
    description:
      'Bekijk alle zorgwerkgevers op ZorgWerkwijzer. Ontdek vacatures bij ziekenhuizen, thuiszorgorganisaties, verpleeghuizen en meer.',
    url: 'https://zorgwerkwijzer.nl/werkgevers',
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function getAllEmployers(): Promise<EmployerDetail[]> {
  try {
    const res = await fetch(`${API_BASE}/employers?size=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: PageResponse<EmployerDetail> = await res.json();
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function WerkgeversPage() {
  const employers = await getAllEmployers();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Alle Werkgevers in de Zorg',
    description: 'Overzicht van alle zorgwerkgevers op ZorgWerkwijzer',
    url: 'https://zorgwerkwijzer.nl/werkgevers',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-sky-600 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-sky-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Werkgevers
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Alle Werkgevers</h1>
          <p className="text-sky-100 text-lg max-w-xl">
            Ontdek zorgorganisaties die actief vacatures plaatsen op ZorgWerkwijzer. Van
            ziekenhuizen tot thuiszorg en verpleeghuizen.
          </p>
        </div>
        <Building2 className="absolute -right-8 -bottom-8 w-64 h-64 text-sky-500 opacity-20 transform rotate-12" />
      </div>

      {/* Werkgevers grid */}
      {employers.length > 0 ? (
        <>
          <p className="text-slate-500 text-sm mb-6">
            {employers.length} werkgever{employers.length !== 1 ? 's' : ''} gevonden
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employers.map((employer) => (
              <Link
                key={employer.id}
                href={`/werkgevers/${employer.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  {employer.logoUrl ? (
                    <img
                      src={employer.logoUrl}
                      alt={employer.name}
                      className="w-14 h-14 rounded-xl object-contain border border-slate-100 p-1 bg-white shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                      <Building2 className="w-7 h-7 text-sky-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                      {employer.name}
                    </h2>
                    {employer.city && (
                      <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{employer.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                {employer.description && (
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {employer.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sky-600 text-sm font-medium">
                    <Briefcase className="w-4 h-4" />
                    <span>
                      {employer.vacancyCount ?? 0} vacature
                      {(employer.vacancyCount ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors" />
                </div>

                {employer.isPremium && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                      ⭐ Premium werkgever
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Nog geen werkgevers</h2>
          <p className="text-slate-500">Er zijn momenteel geen werkgevers beschikbaar.</p>
          <Link
            href="/werkgever/registreren"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
          >
            Werkgever worden
          </Link>
        </div>
      )}

      {/* CTA voor werkgevers */}
      <div className="mt-16 bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Bent u werkgever?</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Maak gratis een werkgeversaccount aan en bereik duizenden zorgprofessionals met uw
          vacatures.
        </p>
        <Link
          href="/werkgever/registreren"
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm"
        >
          <Building2 className="w-5 h-5" />
          Gratis account aanmaken
        </Link>
      </div>
    </div>
  );
}
