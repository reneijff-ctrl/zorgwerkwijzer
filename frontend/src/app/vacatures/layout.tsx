import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Actuele Vacatures in de Zorg | Zorgwerkwijzer',
  description: 'Bekijk de nieuwste vacatures voor Helpende Plus, Verzorgende IG, Verpleegkundige en meer. Vind jouw droombaan in de Nederlandse zorg.',
  openGraph: {
    title: 'Actuele Vacatures in de Zorg | Zorgwerkwijzer',
    description: 'Vind jouw volgende uitdaging in de zorg. Bekijk alle actuele vacatures door heel Nederland.',
    url: 'https://zorgwerkwijzer.nl/vacatures',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function VacanciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
