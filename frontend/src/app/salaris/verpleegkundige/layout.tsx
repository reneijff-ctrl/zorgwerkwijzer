import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verpleegkundige Salaris 2026 | Wat verdient een Verpleegkundige?",
  description: "Wat is het salaris van een verpleegkundige (MBO & HBO) in 2026? Bekijk bruto maandsalaris, uurloon, CAO VVT schalen en doorgroeimogelijkheden.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/salaris/verpleegkundige",
  },
  openGraph: {
    title: "Verpleegkundige Salaris 2026 | MBO & HBO Overzicht",
    description: "Alles over het salaris van een verpleegkundige in de zorg. Bruto/netto, CAO schalen, ORT impact en doorgroeimogelijkheden.",
    url: "https://zorgwerkwijzer.nl/salaris/verpleegkundige",
    locale: "nl_NL",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verpleegkundige Salaris 2026",
    description: "Bekijk het actuele salaris van een verpleegkundige in de zorg conform CAO VVT.",
  }
};

export default function VerpleegkundigeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
