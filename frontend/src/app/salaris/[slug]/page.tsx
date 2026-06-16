import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SalaryPageTemplate from '@/components/salary/SalaryPageTemplate';
import { getProfession, getSalaryStaticParams } from '@/data/salaryData';
import { getCao } from '@/data/caos';

// ─── Static generation ────────────────────────────────────────────────────────
// Next.js bouwt alle salarispagina's vooraf bij elke deploy (SSG).
// Voeg een nieuw beroep toe in src/data/salaryData.ts — geen wijziging hier nodig.

export function generateStaticParams() {
  return getSalaryStaticParams();
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profession = getProfession(slug);

  if (!profession) {
    return { title: 'Salaris niet gevonden | ZorgWerkwijzer' };
  }

  const canonicalUrl = `https://zorgwerkwijzer.nl/salaris/${profession.slug}`;

  return {
    title: `Salaris ${profession.name} 2026 | Salarisschalen & ORT | ZorgWerkwijzer`,
    description: profession.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Salaris ${profession.name} 2026 | ZorgWerkwijzer`,
      description: profession.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Salaris ${profession.name} 2026 | ZorgWerkwijzer`,
      description: profession.metaDescription,
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function SalarisProfessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profession = getProfession(slug);

  if (!profession) {
    notFound();
  }

  const cao = getCao(profession.caoId);

  if (!cao) {
    notFound();
  }

  return <SalaryPageTemplate profession={profession} cao={cao} />;
}
