import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacyverklaring | ZorgWerkWijzer",
  description: "Lees hier hoe ZorgWerkWijzer omgaat met jouw gegevens en privacy.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
