import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ORT Calculator Zorg | Bereken je Onregelmatigheidstoeslag",
  description: "Hoeveel ORT krijg jij deze maand? Bereken je toeslagen voor avond-, nacht-, weekend- en feestdagdiensten in de zorg (CAO VVT).",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/ort-calculator",
  },
};

export default function OrtCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
