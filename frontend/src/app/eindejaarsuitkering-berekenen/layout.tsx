import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eindejaarsuitkering Berekenen Zorg 2026 | 13e Maand | ZorgWerkwijzer',
  description:
    'Bereken je eindejaarsuitkering als zorgmedewerker. Conform CAO 2026 is de eindejaarsuitkering 8,33% van je bruto jaarsalaris, gelijk aan een dertiende maand. Uitbetaald in december.',
  keywords: [
    'eindejaarsuitkering berekenen',
    'dertiende maand zorg',
    'eindejaarsuitkering cao',
    '13e maand verpleegkundige',
    'eindejaarsuitkering vvt',
    'bonus zorgmedewerker',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/eindejaarsuitkering-berekenen',
  },
  openGraph: {
    title: 'Eindejaarsuitkering Berekenen Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je eindejaarsuitkering (8,33% = dertiende maand) conform CAO 2026. Uitbetaald in december.',
    url: 'https://zorgwerkwijzer.nl/eindejaarsuitkering-berekenen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eindejaarsuitkering Berekenen Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je eindejaarsuitkering (8,33% = dertiende maand) conform CAO 2026.',
  },
};

export default function EindejaarsuitkeringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
