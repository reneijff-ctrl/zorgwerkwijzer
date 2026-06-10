import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over Zorgwerkwijzer | Missie & Onafhankelijke Informatie',
  description: 'Leer meer over Zorgwerkwijzer. Onze missie is om zorgmedewerkers te ondersteunen met onafhankelijke tools en informatie over salaris, ORT en CAO.',
  alternates: {
    canonical: 'https://www.zorgwerkwijzer.nl/over-ons',
  },
  openGraph: {
    title: 'Over Zorgwerkwijzer | Jouw Gids in de Zorg',
    description: 'Onafhankelijke tools en informatie speciaal voor zorgmedewerkers in Nederland.',
    url: 'https://www.zorgwerkwijzer.nl/over-ons',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Over Zorgwerkwijzer',
    description: 'Onafhankelijke informatie over salaris en arbeidsvoorwaarden in de zorg.',
  },
};

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
