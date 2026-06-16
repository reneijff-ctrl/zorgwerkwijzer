import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salaris Calculator Zorg 2026 | Bereken je Bruto Netto | ZorgWerkwijzer',
  description:
    'Bereken direct je bruto netto salaris als zorgmedewerker. Inclusief ORT-toeslagen, vakantiegeld, eindejaarsuitkering en FWG-schalen conform de meest recente CAO 2026.',
  keywords: [
    'salaris calculator zorg',
    'bruto netto berekenen',
    'salaris verpleegkundige berekenen',
    'ort calculator',
    'cao vvt salaris',
    'zorg salaris 2026',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/salaris-calculator',
  },
  openGraph: {
    title: 'Salaris Calculator Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je bruto netto salaris als zorgmedewerker inclusief ORT, vakantiegeld en eindejaarsuitkering.',
    url: 'https://zorgwerkwijzer.nl/salaris-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salaris Calculator Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je bruto netto salaris als zorgmedewerker inclusief ORT, vakantiegeld en eindejaarsuitkering.',
  },
};

export default function SalarisCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
