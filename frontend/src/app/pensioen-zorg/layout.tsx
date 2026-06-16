import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pensioen in de Zorg 2026 | PFZW Pensioenopbouw | ZorgWerkwijzer',
  description:
    'Alles over pensioen als zorgmedewerker: hoe bouw je pensioen op via PFZW, wat zijn de premies, wanneer ga je met pensioen en wat is je verwachte pensioenuitkering?',
  keywords: [
    'pensioen zorg',
    'pfzw pensioen',
    'pensioenopbouw verpleegkundige',
    'pensioenfonds zorg welzijn',
    'cao pensioen',
    'pensioenleeftijd zorg',
    'pensioen berekenen zorg',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/pensioen-zorg',
  },
  openGraph: {
    title: 'Pensioen in de Zorg 2026 | PFZW | ZorgWerkwijzer',
    description:
      'Pensioenopbouw via PFZW voor zorgmedewerkers: premies, opbouw, AOW en verwachte uitkering.',
    url: 'https://zorgwerkwijzer.nl/pensioen-zorg',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pensioen in de Zorg 2026 | PFZW | ZorgWerkwijzer',
    description:
      'Pensioenopbouw via PFZW voor zorgmedewerkers: premies, opbouw en verwachte uitkering.',
  },
};

export default function PensioenZorgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
