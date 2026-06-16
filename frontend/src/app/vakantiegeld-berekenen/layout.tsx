import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vakantiegeld Berekenen Zorg 2026 | 8% Vakantietoeslag | ZorgWerkwijzer',
  description:
    'Bereken je vakantiegeld als zorgmedewerker. Conform CAO 2026 is het vakantiegeld 8% van je bruto jaarsalaris. Uitbetaald in mei. Inclusief deeltijdberekening.',
  keywords: [
    'vakantiegeld berekenen',
    'vakantietoeslag zorg',
    'vakantiegeld verpleegkundige',
    'cao vakantiegeld',
    '8 procent vakantiegeld',
    'vakantietoeslag berekenen',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/vakantiegeld-berekenen',
  },
  openGraph: {
    title: 'Vakantiegeld Berekenen Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je vakantietoeslag (8% van bruto jaarsalaris) conform CAO 2026. Uitbetaald in mei.',
    url: 'https://zorgwerkwijzer.nl/vakantiegeld-berekenen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vakantiegeld Berekenen Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je vakantietoeslag (8% van bruto jaarsalaris) conform CAO 2026.',
  },
};

export default function VakantiegeldLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
