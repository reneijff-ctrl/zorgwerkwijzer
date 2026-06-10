import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verzorgende IG Salaris 2026 | Wat verdient een Verzorgende IG?",
  description: "Wat is het salaris van een Verzorgende IG in 2026? Bekijk bruto maandsalaris, uurloon en CAO VVT schalen (FWG 40). Bereken ook je ORT en vakantiegeld.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/salaris/verzorgende-ig",
  },
  openGraph: {
    title: "Verzorgende IG Salaris 2026 | Overzicht & Berekening",
    description: "Alles over het salaris van een Verzorgende IG in de zorg. Bruto/netto, CAO schalen en toeslagen (ORT).",
    url: "https://zorgwerkwijzer.nl/salaris/verzorgende-ig",
    locale: "nl_NL",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verzorgende IG Salaris 2026",
    description: "Bekijk het actuele salaris van een Verzorgende IG in de zorg conform CAO VVT.",
  }
};

export default function VerzorgendeIGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
