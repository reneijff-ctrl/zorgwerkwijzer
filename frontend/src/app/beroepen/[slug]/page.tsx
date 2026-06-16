import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProfessionPageTemplate from '@/components/professions/ProfessionPageTemplate';
import { getProfessionData, getProfessionStaticParams } from '@/data/professions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── SSG: genereer alle statische paden ────────────────────────────────────────

export async function generateStaticParams() {
  return getProfessionStaticParams();
}

// ── SEO metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profession = getProfessionData(slug);
  if (!profession) return {};

  const canonicalUrl = `https://zorgwerkwijzer.nl/beroepen/${profession.slug}`;

  return {
    title: `Werken als ${profession.name} 2026 | Taken, Salaris & Opleiding | ZorgWerkwijzer`,
    description: profession.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Werken als ${profession.name} 2026 | ZorgWerkwijzer`,
      description: profession.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Werken als ${profession.name} 2026 | ZorgWerkwijzer`,
      description: profession.metaDescription,
    },
  };
}

// ── Pagina ────────────────────────────────────────────────────────────────────

export default async function BeroepPage({ params }: PageProps) {
  const { slug } = await params;
  const profession = getProfessionData(slug);

  if (!profession) {
    notFound();
  }

  return <ProfessionPageTemplate profession={profession} />;
}
