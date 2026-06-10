import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reiskostenvergoeding Zorg 2024-2026 | Alles over Kilometervergoeding',
  description: 'Hoeveel reiskostenvergoeding krijg je in de zorg? Bekijk de kilometervergoeding voor CAO VVT 2024, 2025 en 2026, woon-werkverkeer en dienstreizen.',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/reiskostenvergoeding-zorg',
  },
  openGraph: {
    title: 'Reiskostenvergoeding Zorg 2024-2026 | Kilometervergoeding Uitleg',
    description: 'Alles over de reiskostenvergoeding voor zorgmedewerkers. Bekijk de actuele tarieven per kilometer en regels voor openbaar vervoer.',
    url: 'https://zorgwerkwijzer.nl/reiskostenvergoeding-zorg',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reiskostenvergoeding Zorg 2024-2026 | Kilometervergoeding Uitleg',
    description: 'Ontdek hoeveel kilometervergoeding je krijgt als zorgmedewerker in 2024, 2025 en 2026.',
  },
};

export default function ReiskostenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
