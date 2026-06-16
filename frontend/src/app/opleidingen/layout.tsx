import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zorgopleidingen 2026 | Overzicht 25 Opleidingen in de Zorg | ZorgWerkwijzer',
  description:
    'Ontdek alle 25 zorgopleidingen: duur, leerwegen, toelating, salarisverwachting en beroepsperspectieven. Van MBO Verpleegkunde tot Master Physician Assistant.',
  keywords: [
    'zorgopleidingen',
    'opleiding verpleegkunde',
    'mbo zorg',
    'hbo verpleegkunde',
    'opleiding fysiotherapie',
    'opleiding gz-psycholoog',
    'zorg studie',
    'verpleegkunde opleiding',
    'paramedisch opleiding',
    'hbo zorg',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/opleidingen',
  },
  openGraph: {
    title: 'Zorgopleidingen 2026 | Overzicht 25 Opleidingen | ZorgWerkwijzer',
    description:
      'Alle 25 zorgopleidingen: duur, leerwegen, toelating en beroepsperspectieven. Vind jouw opleiding in de zorg.',
    url: 'https://zorgwerkwijzer.nl/opleidingen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zorgopleidingen 2026 | Overzicht 25 Opleidingen | ZorgWerkwijzer',
    description:
      'Alle 25 zorgopleidingen: duur, leerwegen, toelating en beroepsperspectieven.',
  },
};

export default function OpleidingenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
