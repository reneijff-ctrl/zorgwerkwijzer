import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CAO Ziekenhuizen 2024-2027: Salaris, ORT & Regelingen',
  description: 'Alles over de CAO Ziekenhuizen 2025-2027. Bekijk de salarisschalen, ORT percentages, reiskostenvergoeding en andere arbeidsvoorwaarden voor ziekenhuismedewerkers.',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/cao/ziekenhuizen',
  },
  openGraph: {
    title: 'CAO Ziekenhuizen 2024-2027: Salarisschalen & Toeslagen',
    description: 'Bekijk de actuele salarissen, ORT en reiskostenvergoeding volgens de CAO Ziekenhuizen. Inclusief loonsverhogingen voor 2025 en 2026.',
    url: 'https://zorgwerkwijzer.nl/cao/ziekenhuizen',
    siteName: 'Zorgwerkwijzer',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAO Ziekenhuizen 2024-2027 | Zorgwerkwijzer',
    description: 'Volledig overzicht van de CAO Ziekenhuizen arbeidsvoorwaarden en salarisschalen.',
  },
}

export default function CaoZiekenhuizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
