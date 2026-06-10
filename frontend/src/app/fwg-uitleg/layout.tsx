import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FWG Uitleg & Salarisschalen Zorg 2026 | Zorgwerkwijzer',
  description: 'Alles over FWG schalen in de zorg. Hoe werkt het, hoe wordt je schaal bepaald en wat zijn de salarissen per FWG niveau in 2026?',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/fwg-uitleg',
  },
  openGraph: {
    title: 'FWG Uitleg & Salarisschalen Zorg 2026',
    description: 'Ontdek hoe FWG schalen werken in de zorg en wat je kunt verdienen in FWG 35 t/m 60.',
    url: 'https://zorgwerkwijzer.nl/fwg-uitleg',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FWG Uitleg & Salarisschalen Zorg 2026',
    description: 'Alles over FWG schalen en salaris in de Nederlandse zorg.',
  },
};

export default function FwgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
