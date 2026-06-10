import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doktersassistent Salaris 2026: Wat verdien je? | Zorgwerkwijzer",
  description: "Wat verdient een doktersassistent in 2026? Bekijk het gemiddelde salaris, de CAO Huisartsenzorg schalen (FWG), ORT en doorgroeimogelijkheden voor doktersassistentes.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/salaris/doktersassistent",
  },
  openGraph: {
    title: "Doktersassistent Salaris 2026: Actuele Schalen & Info",
    description: "Alles over het salaris van een doktersassistent in de huisartsenzorg. Bekijk schalen, toeslagen en netto indicaties.",
    url: "https://zorgwerkwijzer.nl/salaris/doktersassistent",
    siteName: "Zorgwerkwijzer",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doktersassistent Salaris 2026 | Zorgwerkwijzer",
    description: "Actueel overzicht van doktersassistent salarissen in Nederland.",
  },
};

export default function DoktersassistentSalaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
