import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vakantiegeld Berekenen Zorg | 8% Vakantiebijslag Calculator",
  description: "Bereken exact hoeveel vakantiegeld je opbouwt in de zorg. Gebaseerd op 8% van je bruto maandsalaris. Inclusief berekening voor parttimers en fulltimers.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/vakantiegeld-berekenen",
  },
  openGraph: {
    title: "Vakantiegeld Berekenen Zorg | 8% Vakantiebijslag Calculator",
    description: "Bereken exact hoeveel vakantiegeld je opbouwt in de zorg. Gebaseerd op 8% van je bruto maandsalaris.",
    url: "https://zorgwerkwijzer.nl/vakantiegeld-berekenen",
  }
};

export default function HolidayAllowanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
