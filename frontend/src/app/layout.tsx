import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://zorgwerkwijzer.nl"),
  title: {
    default: "ZorgWerkWijzer | Alles voor de zorgmedewerker",
    template: "%s | ZorgWerkWijzer"
  },
  description: "Bereken je salaris, ORT en bekijk CAO informatie voor de Nederlandse zorg. De meest complete toolkit voor zorgmedewerkers.",
  keywords: ["zorg", "salaris calculator", "ORT berekenen", "CAO VVT", "zorgmedewerker", "loonstrook", "onregelmatigheidstoeslag"],
  authors: [{ name: "ZorgWerkWijzer" }],
  creator: "ZorgWerkWijzer",
  publisher: "ZorgWerkWijzer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ZorgWerkWijzer | Alles voor de zorgmedewerker",
    description: "Bereken je salaris, ORT en bekijk CAO informatie voor de Nederlandse zorg.",
    url: "https://zorgwerkwijzer.nl",
    siteName: "ZorgWerkWijzer",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZorgWerkWijzer | Alles voor de zorgmedewerker",
    description: "Bereken je salaris, ORT en bekijk CAO informatie voor de Nederlandse zorg.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
