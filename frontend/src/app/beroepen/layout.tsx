import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zorgberoepen 2026 | Overzicht 25 Functies in de Zorg | ZorgWerkwijzer',
  description:
    'Ontdek alle 25 zorgberoepen: taken, salaris, opleiding, BIG-registratie en vacatures. Van verpleegkundige tot GZ-psycholoog, IC-verpleegkundige en Physician Assistant.',
  keywords: [
    'zorgberoepen',
    'beroepen in de zorg',
    'verpleegkundige',
    'verzorgende ig',
    'fysiotherapeut',
    'gz-psycholoog',
    'nurse practitioner',
    'physician assistant',
    'zorg functies',
    'zorgmedewerker',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/beroepen',
  },
  openGraph: {
    title: 'Zorgberoepen 2026 | Overzicht 25 Functies | ZorgWerkwijzer',
    description:
      'Alle 25 zorgberoepen met taken, salaris, opleiding en vacatures. Vind jouw beroep in de zorg.',
    url: 'https://zorgwerkwijzer.nl/beroepen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zorgberoepen 2026 | Overzicht 25 Functies | ZorgWerkwijzer',
    description:
      'Ontdek alle 25 zorgberoepen: taken, salaris, opleiding en vacatures.',
  },
};

export default function BeroepenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
