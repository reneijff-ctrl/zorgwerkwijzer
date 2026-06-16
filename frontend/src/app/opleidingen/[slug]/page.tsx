import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import EducationPageTemplate from '@/components/education/EducationPageTemplate';
import { getEducationData, getEducationStaticParams } from '@/data/educationData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── SSG: genereer alle statische paden ────────────────────────────────────────

export async function generateStaticParams() {
  return getEducationStaticParams();
}

// ── SEO metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const education = getEducationData(slug);
  if (!education) return {};

  const canonicalUrl = `https://zorgwerkwijzer.nl/opleidingen/${education.slug}`;

  return {
    title: `Opleiding ${education.name} 2026 | Duur, Toelating & Salaris | ZorgWerkwijzer`,
    description: education.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Opleiding ${education.name} 2026 | ZorgWerkwijzer`,
      description: education.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Opleiding ${education.name} 2026 | ZorgWerkwijzer`,
      description: education.metaDescription,
    },
  };
}

// ── Pagina ────────────────────────────────────────────────────────────────────

export default async function OpleidingPage({ params }: PageProps) {
  const { slug } = await params;
  const education = getEducationData(slug);

  if (!education) {
    notFound();
  }

  return <EducationPageTemplate education={education} />;
}
