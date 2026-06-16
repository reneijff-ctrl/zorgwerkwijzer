import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | ZorgWerkwijzer',
  description:
    'Neem contact op met ZorgWerkwijzer. Vragen over salaris, CAO, opleidingen of beroepen in de zorg? Wij helpen je graag.',
  keywords: [
    'contact zorgwerkwijzer',
    'vragen zorgmedewerker',
    'klantenservice zorg',
  ],
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/contact',
  },
  openGraph: {
    title: 'Contact | ZorgWerkwijzer',
    description:
      'Neem contact op met ZorgWerkwijzer voor vragen over salaris, CAO en beroepen in de zorg.',
    url: 'https://zorgwerkwijzer.nl/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | ZorgWerkwijzer',
    description: 'Neem contact op met ZorgWerkwijzer.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
