import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CaoPageTemplate from '@/components/cao/CaoPageTemplate';
import { getCaoPage, getCaoStaticParams } from '@/data/caoPages';

// ─── Static generation ────────────────────────────────────────────────────────
// Next.js bouwt alle CAO-pagina's vooraf bij elke deploy (SSG).
// Voeg een nieuwe CAO toe in src/data/caoPages.ts — geen wijziging hier nodig.

export function generateStaticParams() {
  return getCaoStaticParams();
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cao = getCaoPage(slug);

  if (!cao) {
    return { title: "CAO niet gevonden | ZorgWerkwijzer" };
  }

  const canonicalUrl = `https://zorgwerkwijzer.nl/cao/${cao.slug}`;

  return {
    title: `${cao.title} 2026 | Salarisschalen & Arbeidsvoorwaarden | ZorgWerkwijzer`,
    description: cao.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${cao.title} 2026 | Arbeidsvoorwaarden & Salarisschalen`,
      description: cao.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cao.title} 2026 | ZorgWerkwijzer`,
      description: cao.metaDescription,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CaoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cao = getCaoPage(slug);

  if (!cao) {
    notFound();
  }

  return <CaoPageTemplate cao={cao} />;
}
