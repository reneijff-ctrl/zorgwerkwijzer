import Link from "next/link";
import { ShieldCheck, Lock, Eye, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-blue/10 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Privacyverklaring
            </h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <p className="text-lg">
                ZorgWerkWijzer.nl is een onafhankelijk platform voor zorgmedewerkers. Wij hechten grote waarde aan de privacy van onze gebruikers en gaan zorgvuldig om met persoonsgegevens. In deze privacyverklaring leggen we uit hoe we gegevens verzamelen en gebruiken.
              </p>
              <p className="text-sm text-slate-400 mt-4 italic">
                Laatst bijgewerkt: 10 juni 2026
              </p>Section
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <Eye className="w-6 h-6 text-brand-pink" />
                <h2>Welke gegevens verzamelen wij?</h2>
              </div>
              <p>
                ZorgWerkWijzer verzamelt op verschillende manieren gegevens:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Calculators:</strong> De gegevens die je invult in onze salaris- en ORT-calculators worden uitsluitend gebruikt om de berekening uit te voeren. Deze gegevens worden <strong>niet</strong> opgeslagen op onze servers.
                </li>
                <li>
                  <strong>Nieuwsbrief:</strong> Wanneer je je aanmeldt voor onze nieuwsbrief, slaan we je e-mailadres op om je updates te kunnen sturen.
                </li>
                <li>
                  <strong>Contactformulier:</strong> De gegevens die je verstrekt via het contactformulier (naam, e-mailadres, bericht) worden uitsluitend gebruikt om je vraag te beantwoorden.
                </li>
                <li>
                  <strong>Cookies:</strong> Wij gebruiken functionele en analytische cookies om de website te verbeteren en het gebruik te analyseren (via anonieme statistieken).
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <Lock className="w-6 h-6 text-brand-dark" />
                <h2>Beveiliging</h2>
              </div>
              <p>
                Wij nemen passende technische en organisatorische maatregelen om je gegevens te beveiligen tegen verlies of onrechtmatige verwerking. De website maakt gebruik van een beveiligde SSL-verbinding (HTTPS).
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <Mail className="w-6 h-6 text-brand-orange" />
                <h2>Jouw rechten</h2>
              </div>
              <p>
                Je hebt het recht om je opgeslagen persoonsgegevens (zoals je e-mailadres voor de nieuwsbrief) in te zien, te corrigeren of te laten verwijderen. Je kunt je op elk moment afmelden voor de nieuwsbrief via de link onderaan elke e-mail.
              </p>
              <p>
                Voor vragen over privacy of je gegevens kun je contact met ons opnemen via de <Link href="/contact" className="text-brand-blue font-bold hover:underline">contactpagina</Link>.
              </p>
            </section>

            <div className="pt-8 border-t border-slate-100">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-brand-blue transition-colors">
                <span>← Terug naar de homepage</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
