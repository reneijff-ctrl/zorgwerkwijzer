import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact opnemen | Zorgwerkwijzer',
  description: 'Heb je vragen of suggesties over Zorgwerkwijzer? Neem contact met ons op via het contactformulier. We horen graag van je!',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/contact',
  },
  openGraph: {
    title: 'Contact opnemen | Zorgwerkwijzer',
    description: 'Heb je vragen of suggesties over Zorgwerkwijzer? Neem contact met ons op via het contactformulier.',
    url: 'https://zorgwerkwijzer.nl/contact',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact opnemen | Zorgwerkwijzer',
    description: 'Heb je vragen of suggesties over Zorgwerkwijzer? Neem contact met ons op via het contactformulier.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
