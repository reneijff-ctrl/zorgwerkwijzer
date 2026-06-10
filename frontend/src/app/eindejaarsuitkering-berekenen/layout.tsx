import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eindejaarsuitkering Berekenen 2026 | Zorg Calculator",
  description: "Bereken je eindejaarsuitkering (13e maand) in de zorg. Volledig bijgewerkt voor CAO VVT 2026. Inclusief ORT berekening.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/eindejaarsuitkering-berekenen",
  },
  openGraph: {
    title: "Eindejaarsuitkering Berekenen Zorg | Zorgwerkwijzer",
    description: "Bereken exact hoeveel dertiende maand je dit jaar ontvangt.",
    url: "https://zorgwerkwijzer.nl/eindejaarsuitkering-berekenen",
    siteName: "Zorgwerkwijzer",
    locale: "nl_NL",
    type: "website",
  },
};

export default function EndOfYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
