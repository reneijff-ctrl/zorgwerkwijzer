import Link from "next/link";
import Image from "next/image";
import { 
  Calculator, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Sun, 
  Stethoscope, 
  Heart, 
  Activity, 
  Gift, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";
import { articles } from "@/lib/news";

export const metadata: Metadata = {
  title: "ZorgWerkWijzer | Hét portaal voor de zorgmedewerker",
  description: "Bereken je salaris, ORT, vakantiegeld en eindejaarsuitkering. Ontdek alles over de CAO VVT en blijf op de hoogte van het laatste zorgnieuws.",
  alternates: {
    canonical: "https://zorgwerkwijzer.nl",
  },
};

export default function Home() {
  const latestNews = articles.slice(0, 3);

  const faqItems = [
    {
      question: "Hoe bereken ik mijn netto salaris in de zorg?",
      answer: "Je kunt je netto salaris berekenen door je bruto maandsalaris in te vullen in onze salaris calculator. Deze houdt rekening met de standaard heffingskortingen en belastingschijven voor 2024-2026."
    },
    {
      question: "Wat zijn de ORT percentages in de CAO VVT?",
      answer: "In de CAO VVT zijn de ORT percentages: 22% voor avonden en nachten door de week, 38% voor zaterdagmiddag en -avond, en 60% voor zon- en feestdagen."
    },
    {
      question: "Wanneer wordt het vakantiegeld uitbetaald in de zorg?",
      answer: "Het vakantiegeld in de zorg (8%) wordt meestal in de maand mei uitbetaald over de opbouwperiode van mei vorig jaar tot en met april van het huidige jaar."
    },
    {
      question: "Hoe hoog is de eindejaarsuitkering in de zorg?",
      answer: "In de meeste zorg-CAO's, zoals de CAO VVT, is de eindejaarsuitkering 8,33% van je bruto jaarsalaris, wat overeenkomt met een volledige 13e maand."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://zorgwerkwijzer.nl/#webpage",
        "url": "https://zorgwerkwijzer.nl",
        "name": "ZorgWerkWijzer Homepage",
        "description": "Portaal voor Nederlandse zorgmedewerkers met calculators en CAO informatie."
      },
      {
        "@type": "ItemList",
        "name": "Populaire Zorg Calculators",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "url": "https://zorgwerkwijzer.nl/salaris-calculator",
            "name": "Salaris Calculator"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "url": "https://zorgwerkwijzer.nl/ort-calculator",
            "name": "ORT Calculator"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "url": "https://zorgwerkwijzer.nl/vakantiegeld-berekenen",
            "name": "Vakantiegeld Calculator"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "url": "https://zorgwerkwijzer.nl/eindejaarsuitkering-berekenen",
            "name": "Eindejaarsuitkering Calculator"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="space-y-24 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-10 pb-16 md:pt-16 md:pb-24">
        {/* Floating background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-brand-blue/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] animate-pulse-soft" />
          
          {/* Watermark Logo */}
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 opacity-[0.03] scale-150 hidden lg:block transform rotate-12">
            <Image 
              src="/images/zorgwerkwijzer-logo.png" 
              alt="" 
              width={800} 
              height={300} 
            />
          </div>

          {/* Floating healthcare elements */}
          <Stethoscope className="absolute top-[15%] right-[15%] w-12 h-12 text-brand-blue/20 animate-float hidden md:block" />
          <Heart className="absolute bottom-[20%] left-[15%] w-10 h-10 text-brand-pink/20 animate-float-slow hidden md:block" />
          <Activity className="absolute top-[40%] left-[10%] w-8 h-8 text-brand-orange/20 animate-pulse-soft hidden md:block" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Hét portaal voor de <br />
            <span className="bg-gradient-to-r from-brand-blue via-brand-pink to-brand-orange bg-clip-text text-transparent">
              zorgmedewerker
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Bereken je salaris, ORT en blijf op de hoogte van de laatste CAO ontwikkelingen. 
            Alles wat je nodig hebt op één plek.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link href="/salaris-calculator" className="bg-gradient-to-r from-brand-blue to-brand-dark text-white rounded-2xl shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg px-10 py-5 font-bold">
              Direct berekenen
              <Zap className="w-5 h-5" />
            </Link>
            <Link href="/over-ons" className="bg-white text-slate-700 border border-slate-200 px-10 py-5 rounded-2xl hover:bg-slate-50 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all font-bold text-lg">
              Ontdek Zorgwerkwijzer
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-slate-500 font-semibold text-base">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Gebaseerd op actuele CAO&apos;s
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Gratis & Onafhankelijk
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Door zorgmedewerkers, voor zorgmedewerkers
            </div>
          </div>
        </div>
      </section>

      {/* 2. Most Used Calculators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Meest gebruikte calculators</h2>
            <p className="text-slate-600 text-lg">De populairste rekentools voor zorgprofessionals.</p>
          </div>
          <Link href="/over-ons" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all">
            Bekijk alle tools <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CalculatorCard 
            icon={<Calculator className="w-6 h-6 text-brand-blue" />}
            title="Salaris"
            description="Bruto naar netto"
            href="/salaris-calculator"
            color="bg-brand-blue"
          />
          <CalculatorCard 
            icon={<Clock className="w-6 h-6 text-brand-dark" />}
            title="ORT"
            description="Toeslagen berekenen"
            href="/ort-calculator"
            color="bg-brand-dark"
          />
          <CalculatorCard 
            icon={<Sun className="w-6 h-6 text-brand-orange" />}
            title="Vakantiegeld"
            description="8% vakantiebijslag"
            href="/vakantiegeld-berekenen"
            color="bg-brand-orange"
          />
          <CalculatorCard 
            icon={<Gift className="w-6 h-6 text-brand-pink" />}
            title="Eindejaar"
            description="Dertiende maand"
            href="/eindejaarsuitkering-berekenen"
            color="bg-brand-pink"
          />
        </div>
      </section>

      {/* 3. Salary Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] -ml-48 -mb-48" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Salariswijzer per functie</h2>
              <p className="text-slate-400 text-xl mb-10 leading-relaxed">
                Wil je weten wat je hoort te verdienen? Ontdek de actuele salarisschalen, FWG-indelingen en groeipad voor de meest voorkomende rollen in de zorg.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg">Up-to-date voor CAO VVT 2024-2026</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg">Inclusief ORT en vakantiegeld impact</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <RoleCard 
                title="Verpleegkundige" 
                scale="FWG 45 - 55" 
                href="/salaris/verpleegkundige"
                color="border-brand-blue"
              />
              <RoleCard 
                title="Verzorgende IG" 
                scale="FWG 35 - 40" 
                href="/salaris/verzorgende-ig"
                color="border-brand-pink"
              />
              <RoleCard 
                title="Doktersassistent" 
                scale="Schaal 4 - 5" 
                href="/salaris/doktersassistent"
                color="border-brand-blue"
              />
              <RoleCard 
                title="Helpende Plus" 
                scale="FWG 25 - 30" 
                href="/salaris/helpende-plus"
                color="border-brand-orange"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Latest CAO Updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Laatste CAO & Salaris updates</h2>
            <p className="text-slate-600 text-lg">Blijf op de hoogte van belangrijke wijzigingen in de zorgsector.</p>
          </div>
          <Link href="/nieuws" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all">
            Alle artikelen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((article) => (
            <Link key={article.slug} href={`/nieuws/${article.slug}`} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <div className="text-slate-400 text-sm mb-2">{article.date} • {article.readingTime}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-blue transition-colors">{article.title}</h3>
                <p className="text-slate-600 line-clamp-2 mb-4">{article.description}</p>
                <span className="text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Lees meer <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Popular Topics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-50 rounded-[3rem] p-10 md:p-16 border border-sky-100">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Populaire onderwerpen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TopicLink icon={<MapPin className="w-5 h-5" />} title="Reiskosten" href="/reiskostenvergoeding-zorg" />
            <TopicLink icon={<TrendingUp className="w-5 h-5" />} title="FWG Uitleg" href="/fwg-uitleg" />
            <TopicLink icon={<ShieldCheck className="w-5 h-5" />} title="Pensioen Zorg" href="/pensioen-zorg" />
            <TopicLink icon={<BookOpen className="w-5 h-5" />} title="CAO VVT" href="/cao-vvt" />
          </div>
        </div>
      </section>

      {/* 6. Newsletter Signup Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -ml-32 -mt-32" />
          <div className="lg:col-span-7 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Ontvang direct <br />
              <span className="text-brand-pink">CAO updates</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-0 max-w-xl">
              Meld je aan voor onze nieuwsbrief en ontvang direct updates over CAO wijzigingen en salarissen in de zorg.
            </p>
          </div>
          <div className="lg:col-span-5 relative z-10">
            <NewsletterForm variant="default" />
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Veelgestelde vragen</h2>
          <p className="text-slate-600 text-lg">Alles wat je moet weten over je salaris en rechten in de zorg.</p>
        </div>
        
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="text-brand-blue font-black">Q:</span>
                {item.question}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed pl-8">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Strong CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-brand-blue to-brand-dark rounded-[3rem] py-20 px-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] -ml-48 -mb-48" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Bereid je voor op je volgende <br className="hidden md:block" /> salarisgesprek</h2>
            <p className="text-blue-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Gebruik onze tools om precies te weten waar je recht op hebt. 
              Kennis is macht, zeker als het om je inkomen gaat.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/salaris-calculator" className="bg-white text-brand-blue rounded-2xl px-12 py-5 text-xl font-black hover:bg-sky-50 transition-colors shadow-lg shadow-black/20">
                Start mijn berekening
              </Link>
              <Link href="/vacatures" className="bg-transparent text-white border-2 border-white/30 rounded-2xl px-12 py-5 text-xl font-black hover:bg-white/10 transition-colors">
                Ontdek vacatures
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CalculatorCard({ icon, title, description, href, color }: { icon: React.ReactNode, title: string, description: string, href: string, color: string }) {
  return (
    <Link href={href} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-4">{description}</p>
      <div className="text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
        Starten <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

function RoleCard({ title, scale, href, color }: { title: string, scale: string, href: string, color: string }) {
  return (
    <Link href={href} className={`bg-white/5 hover:bg-white/10 p-5 rounded-2xl flex items-center justify-between group transition-all border-l-4 ${color}`}>
      <div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-slate-400 text-sm">{scale}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
        <ChevronRight className="w-5 h-5 text-white" />
      </div>
    </Link>
  );
}

function TopicLink({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) {
  return (
    <Link href={href} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 hover:border-brand-blue hover:shadow-md transition-all group">
      <div className="text-slate-400 group-hover:text-brand-blue transition-colors">
        {icon}
      </div>
      <span className="font-bold text-slate-700">{title}</span>
    </Link>
  );
}
