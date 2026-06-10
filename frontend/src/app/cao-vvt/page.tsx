import { Book, CheckCircle2, TrendingUp, Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAO VVT 2026 | Salarisschalen en Arbeidsvoorwaarden",
  description: "Blijf op de hoogte van de CAO VVT. Bekijk de laatste loonsverhogingen, reiskostenvergoedingen en andere belangrijke afspraken voor de zorg.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl/cao-vvt",
  },
};

export default function CaoVvtPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wat is de loonsverhoging in de CAO VVT in 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Per 1 januari 2026 zijn de salarissen in de VVT met 2,5% gestegen."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe hoog is de eindejaarsuitkering in de VVT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "De eindejaarsuitkering in de CAO VVT bedraagt 8,33% van het bruto jaarsalaris."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-primary-600 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-primary-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Update 2026</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">CAO VVT Informatie</h1>
          <p className="text-primary-100 text-lg max-w-xl">
            Alles over de laatste wijzigingen, loonstijgingen en arbeidsvoorwaarden in de Verpleeg- en Verzorgingshuizen en Thuiszorg.
          </p>
        </div>
        <Book className="absolute -right-8 -bottom-8 w-64 h-64 text-primary-500 opacity-20 transform rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <InfoCard 
          icon={<TrendingUp className="w-6 h-6 text-primary-600" />}
          title="Loonsverhoging"
          content="Per 1 januari 2026 zijn de salarissen in de VVT met 2,5% gestegen. Bekijk de nieuwe schalen in onze calculator."
        />
        <InfoCard 
          icon={<Calendar className="w-6 h-6 text-primary-600" />}
          title="Looptijd"
          content="De huidige CAO VVT loopt van 1 januari 2024 tot en met 31 december 2026."
        />
      </div>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900">Belangrijkste punten</h2>
        
        <div className="space-y-4">
          <Point title="Eindejaarsuitkering" description="Je hebt recht op een eindejaarsuitkering van 8,33% van je bruto jaarsalaris." />
          <Point title="Vakantiebijslag" description="De vakantiebijslag bedraagt 8% van je feitelijk verdiende salaris." />
          <Point title="Reiskostenvergoeding" description="De onbelaste reiskostenvergoeding voor woon-werkverkeer is verhoogd naar €0,23 per kilometer." />
          <Point title="Balansbudget" description="Vanaf 2026 is er extra aandacht voor duurzame inzetbaarheid en het balansbudget." />
        </div>
      </section>

      <div className="mt-16 p-8 bg-slate-100 rounded-2xl border border-slate-200 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Vragen over je CAO?</h3>
        <p className="text-slate-600 mb-6">Onze experts helpen je graag bij het begrijpen van je loonstrook of arbeidsvoorwaarden.</p>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
          Stel je vraag
        </button>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="card border-l-4 border-l-primary-600">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function Point({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
