import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salaris Calculator Zorg | Bereken je Bruto Loon (CAO VVT)",
  description: "Bereken eenvoudig je bruto maandsalaris, vakantiegeld en eindejaarsuitkering volgens de laatste CAO VVT richtlijnen.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/salaris-calculator",
  },
};

export default function SalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
