import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpende Plus Salaris 2026 | Wat verdient een Helpende Plus?",
  description: "Wat is het salaris van een Helpende Plus in 2026? Bekijk bruto maandsalaris, uurloon en CAO VVT schalen. Bereken ook je ORT en vakantiegeld.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/salaris/helpende-plus",
  },
  openGraph: {
    title: "Helpende Plus Salaris 2026 | Overzicht & Berekening",
    description: "Alles over het salaris van een Helpende Plus in de zorg. Bruto/netto, CAO schalen en toeslagen (ORT).",
    url: "https://zorgwerkwijzer.nl/salaris/helpende-plus",
    locale: "nl_NL",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helpende Plus Salaris 2026",
    description: "Bekijk het actuele salaris van een Helpende Plus in de zorg.",
  }
};

export default function HelpendePlusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
