import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ORT Calculator Zorg 2026 | Bereken Onregelmatigheidstoeslag | ZorgWerkwijzer',
  description:
    'Bereken je onregelmatigheidstoeslag (ORT) als zorgmedewerker. Voer je diensten in en bereken direct je avond-, nacht-, weekend- en feestdagtoeslag conform CAO 2026.',
  keywords: [
    'ort calculator',
    'onregelmatigheidstoeslag berekenen',
    'ort zorg',
    'ort verpleegkundige',
    'avondtoeslag zorg',
    'cao ort percentages',
    'nachtdienst toeslag',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/ort-calculator',
  },
  openGraph: {
    title: 'ORT Calculator Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je onregelmatigheidstoeslag (ORT) voor avond-, nacht-, weekend- en feestdagdiensten conform CAO 2026.',
    url: 'https://zorgwerkwijzer.nl/ort-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORT Calculator Zorg 2026 | ZorgWerkwijzer',
    description:
      'Bereken je onregelmatigheidstoeslag (ORT) voor avond-, nacht-, weekend- en feestdagdiensten.',
  },
};

export default function OrtCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
