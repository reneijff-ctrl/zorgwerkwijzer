import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Briefcase, Users, BarChart2, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Voor Werkgevers | ZorgWerkwijzer',
  description:
    'Maak gratis een werkgeversaccount aan en plaats zorgvacatures op ZorgWerkwijzer. Bereik duizenden zorgprofessionals.',
};

const voordelen = [
  {
    icon: Briefcase,
    titel: 'Onbeperkt vacatures beheren',
    beschrijving: 'Maak, bewerk en verwijder vacatures via uw persoonlijk dashboard.',
  },
  {
    icon: Users,
    titel: 'Kandidaten ontvangen',
    beschrijving: 'Bekijk alle sollicitaties direct in uw dashboard, inclusief motivatiebrieven.',
  },
  {
    icon: Star,
    titel: 'Werkgeversprofiel beheren',
    beschrijving: 'Presenteer uw organisatie aan zorgprofessionals met een volledig werkgeversprofiel.',
  },
  {
    icon: BarChart2,
    titel: 'Dashboard met inzichten',
    beschrijving: 'Houd uw vacatures en sollicitaties bij via een overzichtelijk werkgeversdashboard.',
  },
];

export default function WerkgeverPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-sky-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Voor werkgevers in de zorg
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Plaats zorgvacatures en bereik duizenden zorgprofessionals
          </h1>
          <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
            Bouw uw werkgeversmerk op en ontvang sollicitaties via ZorgWerkwijzer. Gratis starten,
            direct resultaat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/werkgever/registreren"
              className="bg-white text-sky-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-sky-50 transition-colors shadow-lg"
            >
              Gratis werkgeversaccount aanmaken
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Al een account? Inloggen
            </Link>
          </div>
        </div>
      </section>

      {/* Voordelen */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Alles wat u nodig heeft om talent te vinden
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              ZorgWerkwijzer biedt werkgevers een volledig platform om zorgvacatures te beheren en
              de juiste kandidaten te vinden.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {voordelen.map((v) => (
              <div
                key={v.titel}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{v.titel}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.beschrijving}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stappen */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">In drie stappen aan de slag</h2>
          </div>
          <ol className="space-y-6">
            {[
              {
                stap: '1',
                titel: 'Maak een gratis account aan',
                tekst: 'Registreer uw organisatie in minder dan 2 minuten via het aanmeldformulier.',
              },
              {
                stap: '2',
                titel: 'Plaats uw eerste vacature',
                tekst: 'Voeg vacatures toe via uw dashboard en bereik direct zorgprofessionals.',
              },
              {
                stap: '3',
                titel: 'Ontvang sollicitaties',
                tekst: 'Bekijk en beheer alle sollicitaties centraal in uw werkgeversdashboard.',
              },
            ].map((item) => (
              <li key={item.stap} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.stap}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">{item.titel}</p>
                  <p className="text-slate-600 text-sm">{item.tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-sky-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
          <p className="text-sky-100 mb-8 text-lg">
            Maak vandaag nog een gratis werkgeversaccount aan en plaats uw eerste vacature.
          </p>
          <Link
            href="/werkgever/registreren"
            className="inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-sky-50 transition-colors shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            Gratis werkgeversaccount aanmaken
          </Link>
        </div>
      </section>
    </main>
  );
}
