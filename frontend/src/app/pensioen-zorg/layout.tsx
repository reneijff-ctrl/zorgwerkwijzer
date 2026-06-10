import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pensioen in de Zorg & PFZW Uitleg | Zorgwerkwijzer',
  description: 'Alles over pensioenopbouw in de zorg via PFZW. Hoeveel premie betaal je als werknemer? Wat is het werkgeversaandeel? Ontdek het hier.',
  alternates: {
    canonical: 'https://www.zorgwerkwijzer.nl/pensioen-zorg',
  },
  openGraph: {
    title: 'Pensioen in de Zorg & PFZW Uitleg | Zorgwerkwijzer',
    description: 'Alles over pensioenopbouw in de zorg via PFZW. Hoeveel premie betaal je als werknemer? Wat is het werkgeversaandeel?',
    url: 'https://www.zorgwerkwijzer.nl/pensioen-zorg',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pensioen in de Zorg & PFZW Uitleg | Zorgwerkwijzer',
    description: 'Alles over pensioenopbouw in de zorg via PFZW. Hoeveel premie betaal je als werknemer?',
  },
};

export default function PensionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
