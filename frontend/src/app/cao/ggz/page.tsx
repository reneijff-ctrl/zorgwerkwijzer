import { Metadata } from 'next';
import Link from 'next/link';
import { Users, TrendingUp, Calendar, Clock, Car, PiggyBank, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CAO GGZ 2025-2026 | Salarisschalen en Arbeidsvoorwaarden',
  description:
    'Alles over de CAO GGZ (Geestelijke Gezondheidszorg). Bekijk salarisschalen, loonsverhogingen, ORT-percentages en andere arbeidsvoorwaarden voor medewerkers in de GGZ.',
  alternates: {
    canonical: 'https://zorgwerkwijzer.nl/cao/ggz',
  },
  openGraph: {
    title: 'CAO GGZ 2025-2026 | Salarisschalen en Arbeidsvoorwaarden',
    description:
      'Alles over de CAO GGZ: salarisschalen, loonsverhogingen en arbeidsvoorwaarden voor medewerkers in de geestelijke gezondheidszorg.',
    url: 'https://zorgwerkwijzer.nl/cao/ggz',
  },
};

const faqItems = [
  {
    question: 'Welke organisaties vallen onder de CAO GGZ?',
    answer:
      'De CAO GGZ is van toepassing op medewerkers die werkzaam zijn bij instellingen voor geestelijke gezondheidszorg, verslavingszorg en forensische psychiatrie. Denk aan GGZ-instellingen zoals GGZ Nederland, Parnassia Groep, Lentis, Pro Persona en soortgelijke organisaties.',
  },
  {
    question: 'Hoeveel loonsverhoging geldt er in de CAO GGZ?',
    answer:
      'In de meest recente CAO GGZ is een loonsverhoging overeengekomen van 3% per 1 januari 2025 en nogmaals 2,5% per 1 januari 2026. De exacte percentages kunnen per CAO-akkoord verschillen. Raadpleeg uw werkgever of de FNV/CNV voor de meest actuele informatie.',
  },
  {
    question: 'Hoe hoog is de ORT in de CAO GGZ?',
    answer:
      'Voor onregelmatige diensten (ORT) gelden in de CAO GGZ de volgende percentages: maandag t/m vrijdag tussen 20:00-06:00 uur: 25%, op zaterdag: 40%, op zon- en feestdagen: 65%. De exacte percentages zijn vastgelegd in de CAO-tekst.',
  },
  {
    question: 'Heb ik recht op een eindejaarsuitkering in de GGZ?',
    answer:
      'Ja, medewerkers in de GGZ hebben recht op een eindejaarsuitkering van 8,33% van het jaarsalaris, wat overeenkomt met een dertiende maand. De uitkering wordt doorgaans in november of december uitbetaald.',
  },
  {
    question: 'Hoeveel vakantiedagen heb ik in de CAO GGZ?',
    answer:
      'Medewerkers in de GGZ hebben recht op minimaal 29 vakantiedagen per jaar bij een fulltime dienstverband. Inclusief wettelijke vakantietoeslag van 8% van het bruto jaarsalaris.',
  },
  {
    question: 'Wat is de reiskostenvergoeding in de CAO GGZ?',
    answer:
      'In de CAO GGZ geldt een reiskostenvergoeding voor woon-werkverkeer. De vergoeding bedraagt 21 cent per kilometer met een maximum van 35 kilometer enkele reis. Voor OV-reizigers geldt in de meeste gevallen een volledige vergoeding van de reiskosten.',
  },
];

export default function CaoGgzPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-violet-600 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-violet-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            Update 2025-2026
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">CAO GGZ</h1>
          <p className="text-violet-100 text-lg max-w-xl">
            Geestelijke Gezondheidszorg — alles over salarisschalen, loonsverhogingen en
            arbeidsvoorwaarden voor medewerkers in de GGZ, verslavingszorg en forensische psychiatrie.
          </p>
        </div>
        <Users className="absolute -right-8 -bottom-8 w-64 h-64 text-violet-500 opacity-20 transform rotate-12" />
      </div>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        <InfoCard
          icon={<TrendingUp className="w-6 h-6 text-violet-600" />}
          title="Loonsverhoging"
          content="3% per 1 januari 2025, gevolgd door 2,5% per 1 januari 2026. Raadpleeg uw werkgever voor de exacte bedragen."
        />
        <InfoCard
          icon={<Calendar className="w-6 h-6 text-violet-600" />}
          title="Looptijd"
          content="De huidige CAO GGZ heeft een looptijd van 1 januari 2025 tot en met 31 december 2026."
        />
        <InfoCard
          icon={<Clock className="w-6 h-6 text-violet-600" />}
          title="ORT-toeslagen"
          content="Avond/nacht: 25% | Zaterdag: 40% | Zon- en feestdagen: 65% toeslag op het bruto uurloon."
        />
        <InfoCard
          icon={<PiggyBank className="w-6 h-6 text-violet-600" />}
          title="Eindejaarsuitkering"
          content="8,33% van het bruto jaarsalaris, equivalent aan een volledige dertiende maand. Uitbetaling in november/december."
        />
        <InfoCard
          icon={<Car className="w-6 h-6 text-violet-600" />}
          title="Reiskosten"
          content="21 cent per kilometer, maximaal 35 km enkele reis. Volledige OV-vergoeding voor reizigers met openbaar vervoer."
        />
        <InfoCard
          icon={<Calendar className="w-6 h-6 text-violet-600" />}
          title="Vakantiedagen"
          content="Minimaal 29 vakantiedagen per jaar bij fulltime dienstverband, plus 8% vakantietoeslag."
        />
      </div>

      {/* Salarisschalen info */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Salarisschalen CAO GGZ</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm text-slate-600">
              De salarisschalen in de CAO GGZ zijn gebaseerd op het FWG-systeem (Functiewaardering Gezondheidszorg).
              Hieronder een indicatief overzicht van bruto maandsalarissen.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { schaal: 'FWG 15', functie: 'Hulpmedewerker / Schoonmaak', min: '2.100', max: '2.450' },
              { schaal: 'FWG 25', functie: 'Helpende / Medewerker facilitair', min: '2.350', max: '2.900' },
              { schaal: 'FWG 35', functie: 'Ziekenverzorgende / Begeleider', min: '2.600', max: '3.300' },
              { schaal: 'FWG 45', functie: 'Verpleegkundige niveau 4', min: '2.950', max: '3.900' },
              { schaal: 'FWG 55', functie: 'Verpleegkundige niveau 5 / GZ-psycholoog i.o.', min: '3.400', max: '4.600' },
              { schaal: 'FWG 65', functie: 'GZ-psycholoog / Sociaal psychiatrisch verpleegkundige', min: '4.000', max: '5.500' },
            ].map((row) => (
              <div key={row.schaal} className="flex items-center px-6 py-4">
                <div className="w-20 shrink-0">
                  <span className="inline-block px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded">
                    {row.schaal}
                  </span>
                </div>
                <div className="flex-1 text-sm text-slate-700">{row.functie}</div>
                <div className="text-right text-sm font-semibold text-slate-900 shrink-0">
                  €{row.min} – €{row.max}
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              * Indicatieve bedragen. Exact salaris hangt af van ervaringsjaren en werkgever. Bedragen inclusief loonsverhoging 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Belangrijkste punten */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Belangrijkste punten CAO GGZ</h2>
        <div className="space-y-4">
          <Point
            title="Onregelmatigheidstoeslag (ORT)"
            description="Medewerkers die buiten reguliere werktijden werken hebben recht op ORT. De percentages variëren afhankelijk van het tijdstip en de dag."
          />
          <Point
            title="Persoonlijk Loopbaanbudget (PLB)"
            description="Medewerkers ontvangen een Persoonlijk Loopbaanbudget van 1,5% van het bruto jaarsalaris voor scholing, opleiding of loopbaanontwikkeling."
          />
          <Point
            title="Pensioenopbouw"
            description="Pensioen wordt opgebouwd via PFZW (Pensioenfonds Zorg en Welzijn). De premieverdeling is vastgelegd in de CAO."
          />
          <Point
            title="Verlof en zorgverlof"
            description="Naast vakantiedagen zijn er regelingen voor kort verzuimverlof, bijzonder verlof en zorgverlof voor mantelzorgers."
          />
          <Point
            title="Thuiswerken en hybride werken"
            description="De CAO GGZ bevat afspraken over hybride werken en een thuiswerkkostenvergoeding voor functies waar thuiswerken mogelijk is."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Veelgestelde vragen</h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Bereken uw GGZ-salaris</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Gebruik onze gratis salariscalculator om uw nettoloon op basis van uw FWG-schaal te berekenen.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/salaris-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
          >
            Salariscalculator
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/vacatures"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            GGZ-vacatures bekijken
          </Link>
        </div>
      </div>

      {/* Andere CAO's */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-3">Andere CAO&apos;s in de zorg:</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/cao-vvt" className="text-sm text-sky-600 hover:underline font-medium">
            CAO VVT →
          </Link>
          <Link href="/cao/ziekenhuizen" className="text-sm text-sky-600 hover:underline font-medium">
            CAO Ziekenhuizen →
          </Link>
          <Link href="/cao" className="text-sm text-sky-600 hover:underline font-medium">
            Alle CAO&apos;s →
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function Point({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200">
      <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex gap-3">
        <HelpCircle className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">{question}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
