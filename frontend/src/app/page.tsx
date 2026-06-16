import Link from "next/link";
import SalariswijzerSection from "@/components/SalariswijzerSection";
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
  Zap,
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  UserCheck,
  Wallet,
} from "lucide-react";
import { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";
import { getArticles, formatDate, type NewsArticle } from "@/lib/api/news";
import { getVacancies, formatSalary } from "@/lib/api/vacancies";
import VacancyCard from "@/components/vacatures/VacancyCard";
import { getAllEmployers } from "@/lib/api/employers";
import type { VacancyListItem, EmployerDetail } from "@/types/api";
import { professions as salaryProfessions } from "@/data/salaryData";
import { opleidingen as allOpleidingen } from "@/data/educationData";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ZorgWerkwijzer | Hét Platform voor de Zorgmedewerker 2026",
  description:
    "Bereken je salaris, ORT, vakantiegeld en eindejaarsuitkering. Ontdek 25 zorgberoepen, 25 opleidingen, 11 CAO's en actuele zorgvacatures op één plek.",
  keywords: [
    "zorgwerkwijzer",
    "salaris zorg",
    "cao vvt",
    "ort calculator",
    "zorgvacatures",
    "verpleegkundige salaris",
    "zorgmedewerker",
    "cao zorg 2026",
    "zorg opleidingen",
    "zorg beroepen",
  ],
  alternates: {
    canonical: "https://zorgwerkwijzer.nl",
  },
  openGraph: {
    title: "ZorgWerkwijzer | Hét Platform voor de Zorgmedewerker 2026",
    description:
      "Bereken je salaris, ORT en vakantiegeld. Ontdek 25 zorgberoepen, 11 CAO's en actuele zorgvacatures.",
    url: "https://zorgwerkwijzer.nl",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZorgWerkwijzer | Hét Platform voor de Zorgmedewerker 2026",
    description:
      "Bereken je salaris, ORT en vakantiegeld. Ontdek 25 zorgberoepen, 11 CAO's en actuele zorgvacatures.",
  },
};

export default async function Home() {
  let latestNews: NewsArticle[] = [];
  let latestVacancies: VacancyListItem[] = [];
  let topEmployers: EmployerDetail[] = [];

  try {
    const data = await getArticles({ size: 3 });
    latestNews = data.content;
  } catch {
    latestNews = [];
  }

  try {
    const data = await getVacancies(0, 9);
    latestVacancies = data.content;
  } catch {
    latestVacancies = [];
  }

  try {
    const data = await getAllEmployers(0, 8);
    if (data) {
      // Filter werkgevers met vacatures en sorteer op vacatureCount
      topEmployers = data.content
        .filter((e) => (e.vacancyCount ?? 0) > 0)
        .sort((a, b) => (b.vacancyCount ?? 0) - (a.vacancyCount ?? 0))
        .slice(0, 6);
    }
  } catch {
    topEmployers = [];
  }

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
        "description": "Portaal voor Nederlandse zorgmedewerkers met calculators, vacatures en CAO informatie."
      },
      {
        "@type": "ItemList",
        "name": "Populaire Zorg Calculators",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "url": "https://zorgwerkwijzer.nl/salaris-calculator", "name": "Salaris Calculator" },
          { "@type": "ListItem", "position": 2, "url": "https://zorgwerkwijzer.nl/ort-calculator", "name": "ORT Calculator" },
          { "@type": "ListItem", "position": 3, "url": "https://zorgwerkwijzer.nl/vakantiegeld-berekenen", "name": "Vakantiegeld Calculator" },
          { "@type": "ListItem", "position": 4, "url": "https://zorgwerkwijzer.nl/eindejaarsuitkering-berekenen", "name": "Eindejaarsuitkering Calculator" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      }
    ]
  };

  return (
    <div className="space-y-20 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-10 pb-14 md:pt-12 md:pb-16">
        {/* Floating background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-brand-blue/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] animate-pulse-soft" />

          {/* Watermark Logo */}
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 opacity-[0.03] scale-150 hidden lg:block transform rotate-12">
            <Image src="/images/zorgwerkwijzer-logo.png" alt="" width={800} height={300} />
          </div>

          {/* Floating healthcare icons */}
          <Stethoscope className="absolute top-[15%] right-[15%] w-12 h-12 text-brand-blue/20 animate-float hidden md:block" />
          <Heart className="absolute bottom-[20%] left-[15%] w-10 h-10 text-brand-pink/20 animate-float-slow hidden md:block" />
          <Activity className="absolute top-[40%] left-[10%] w-8 h-8 text-brand-orange/20 animate-pulse-soft hidden md:block" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Hét portaal voor de <br />
            <span className="bg-gradient-to-r from-brand-blue via-brand-pink to-brand-orange bg-clip-text text-transparent">
              zorgmedewerker
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Bereken je salaris, ORT en vakantiegeld. Ontdek zorgvacatures en blijf op de hoogte van de laatste CAO ontwikkelingen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-10">
            <Link href="/vacatures" className="bg-gradient-to-r from-brand-blue to-brand-dark text-white rounded-2xl shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg px-10 py-4 font-bold">
              <Briefcase className="w-5 h-5" />
              Bekijk vacatures
            </Link>
            <Link href="/salaris-calculator" className="bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-2xl hover:bg-slate-50 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all font-bold text-lg flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-brand-blue" />
              Salaris berekenen
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-slate-500 font-semibold text-sm md:text-base">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Actuele zorgvacatures
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Gebaseerd op actuele CAO&apos;s
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Gratis &amp; Onafhankelijk
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Vacatures ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Uitgelichte vacatures */}
        {latestVacancies.some((v) => v.isFeatured) && (
          <div className="mb-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full mb-3">
                  ⭐ Uitgelichte vacatures
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Uitgelichte vacatures</h2>
                <p className="text-slate-600 text-lg mt-1">Premium werkgevers met extra zichtbaarheid.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {latestVacancies
                .filter((v) => v.isFeatured)
                .slice(0, 3)
                .map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
            </div>
          </div>
        )}

        {/* Reguliere vacatures */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Actuele vacatures in de zorg</h2>
            <p className="text-slate-600 text-lg">De nieuwste openstaande posities bij topwerkgevers.</p>
          </div>
          <Link href="/vacatures" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all whitespace-nowrap">
            Alle vacatures <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {latestVacancies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestVacancies
              .filter((v) => !v.isFeatured)
              .slice(0, 6)
              .map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-3xl">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">Binnenkort nieuwe vacatures beschikbaar.</p>
            <Link href="/vacatures" className="mt-4 inline-flex items-center gap-2 text-brand-blue font-bold">
              Bekijk alle vacatures <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/vacatures" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-dark transition-colors">
            Bekijk alle vacatures <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 3. Populaire calculators ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Populaire calculators</h2>
            <p className="text-slate-600 text-lg">De meest gebruikte rekentools voor zorgprofessionals.</p>
          </div>
          <Link href="/salaris-calculator" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all whitespace-nowrap">
            Alle calculators <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <CalculatorCard
            icon={<Calculator className="w-6 h-6 text-brand-blue" />}
            title="Salaris Calculator"
            description="Bruto naar netto berekenen"
            href="/salaris-calculator"
            color="bg-brand-blue"
          />
          <CalculatorCard
            icon={<Clock className="w-6 h-6 text-brand-dark" />}
            title="ORT Calculator"
            description="Onregelmatigheidstoeslag"
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
            title="Eindejaarsuitkering"
            description="Dertiende maand berekenen"
            href="/eindejaarsuitkering-berekenen"
            color="bg-brand-pink"
          />
        </div>
      </section>

      {/* ── 4. Werken bij topwerkgevers ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Werken bij topwerkgevers</h2>
            <p className="text-slate-600 text-lg">Ontdek zorgorganisaties met openstaande vacatures.</p>
          </div>
          <Link href="/werkgevers" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all whitespace-nowrap">
            Alle werkgevers <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {topEmployers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topEmployers.map((employer) => (
              <EmployerCard key={employer.id} employer={employer} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Placeholder cards als geen werkgevers beschikbaar */}
            {["Buurtzorg", "Zuyderland", "Meander", "Envida", "Sevagram", "MeanderGroep"].map((name) => (
              <Link key={name} href="/werkgevers" className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:border-brand-blue hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-50 transition-colors">
                  <Building2 className="w-6 h-6 text-slate-400 group-hover:text-brand-blue transition-colors" />
                </div>
                <p className="text-sm font-bold text-slate-700 truncate">{name}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link href="/werkgevers" className="inline-flex items-center gap-2 text-brand-blue font-bold">
            Alle werkgevers bekijken <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 5. CAO informatie ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">CAO informatie</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Alles over je arbeidsrechten, salarisschalen en toeslagen per sector.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CaoCard
            title="CAO VVT"
            description="Verpleging, Verzorging en Thuiszorg — de grootste zorg-CAO met FWG-indelingen en ORT-regels."
            href="/cao-vvt"
            badge="Meest gebruikt"
            badgeColor="bg-emerald-100 text-emerald-700"
            iconBg="bg-sky-50"
          />
          <CaoCard
            title="CAO Ziekenhuizen"
            description="Arbeidsvoorwaarden voor medewerkers in algemene en universitaire ziekenhuizen."
            href="/cao/ziekenhuizen"
            badge="UMC & Ziekenhuis"
            badgeColor="bg-blue-100 text-blue-700"
            iconBg="bg-blue-50"
          />
          <CaoCard
            title="CAO GGZ"
            description="Geestelijke Gezondheidszorg — salarisschalen en arbeidsvoorwaarden voor GGZ-medewerkers."
            href="/cao/ggz"
            badge="GGZ"
            badgeColor="bg-purple-100 text-purple-700"
            iconBg="bg-purple-50"
          />
          <CaoCard
            title="CAO Gehandicaptenzorg"
            description="Arbeidsvoorwaarden voor medewerkers in de gehandicaptenzorg en ondersteuning."
            href="/cao/gehandicaptenzorg"
            badge="Gehandicaptenzorg"
            badgeColor="bg-orange-100 text-orange-700"
            iconBg="bg-orange-50"
          />
        </div>
      </section>

      {/* ── 5b. Populaire beroepen ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Populaire beroepen in de zorg</h2>
            <p className="text-slate-600 text-lg">Ontdek taken, opleiding, salaris en groeimogelijkheden per functie.</p>
          </div>
          <Link href="/beroepen" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all whitespace-nowrap">
            Alle beroepen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {HOMEPAGE_BEROEPEN.map((b) => (
            <BeroepCard key={b.slug} href={`/beroepen/${b.slug}`} title={b.name} sector={b.sector} icon={b.icon} color={b.color} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/beroepen" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-dark transition-colors">
            Alle beroepen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 5c. Populaire salarissen ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Wat verdien je in de zorg?</h2>
            <p className="text-slate-600 text-lg">Actuele salarisschalen per functie op basis van de CAO 2026.</p>
          </div>
          <Link href="/salaris" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all whitespace-nowrap">
            Alle salarissen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOMEPAGE_SALARISSEN.map((s) => (
            <SalarisCard key={s.slug} href={`/salaris/${s.slug}`} title={s.name} range={s.avgSalaryDisplay} caoId={s.caoId} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/salaris" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-dark transition-colors">
            Alle salarissen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 5d. Populaire opleidingen ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Populaire zorgopleidingen</h2>
            <p className="text-slate-600 text-lg">Ontdek studieduur, toelatingseisen en carrièremogelijkheden per opleiding.</p>
          </div>
          <Link href="/opleidingen" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all whitespace-nowrap">
            Alle opleidingen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {HOMEPAGE_OPLEIDINGEN.map((o) => (
            <OpleidingCard key={o.slug} href={`/opleidingen/${o.slug}`} title={o.name} niveauLabel={o.level} sector={o.sector} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/opleidingen" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-dark transition-colors">
            Alle opleidingen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 6. Populaire zorgfuncties ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Populaire zorgfuncties</h2>
            <p className="text-slate-600 text-lg">Bekijk vacatures per functie in de zorg.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ZorgfunctieCard href="/vacatures/verpleegkundige" title="Verpleegkundige" icon={<Stethoscope className="w-6 h-6" />} color="text-sky-600 bg-sky-50" />
          <ZorgfunctieCard href="/vacatures/verzorgende-ig" title="Verzorgende IG" icon={<Heart className="w-6 h-6" />} color="text-pink-600 bg-pink-50" />
          <ZorgfunctieCard href="/vacatures/helpende-plus" title="Helpende Plus" icon={<UserCheck className="w-6 h-6" />} color="text-orange-600 bg-orange-50" />
          <ZorgfunctieCard href="/vacatures?q=doktersassistent" title="Doktersassistent" icon={<Activity className="w-6 h-6" />} color="text-emerald-600 bg-emerald-50" />
          <ZorgfunctieCard href="/vacatures?q=wijkverpleegkundige" title="Wijkverpleeg­kundige" icon={<MapPin className="w-6 h-6" />} color="text-violet-600 bg-violet-50" />
          <ZorgfunctieCard href="/vacatures?q=begeleider" title="Begeleider" icon={<Users className="w-6 h-6" />} color="text-teal-600 bg-teal-50" />
        </div>
      </section>

      {/* ── 7. Salariswijzer per functie (interactief) ───────────────────── */}
      <SalariswijzerSection />

      {/* ── 8. Populaire onderwerpen ─────────────────────────────────────────── */}
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

      {/* ── 9. Laatste nieuws ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Laatste CAO &amp; Salaris updates</h2>
            <p className="text-slate-600 text-lg">Blijf op de hoogte van belangrijke wijzigingen in de zorgsector.</p>
          </div>
          <Link href="/nieuws" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all">
            Alle artikelen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((article) => (
            <Link key={article.slug} href={`/nieuws/${article.slug}`} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10" />
                {article.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue">
                    {article.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-slate-400 text-sm mb-2">{formatDate(article.publishedAt, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-blue transition-colors">{article.title}</h3>
                <p className="text-slate-600 line-clamp-2 mb-4">{article.excerpt ?? article.title}</p>
                <span className="text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Lees meer <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 10. Waarom ZorgWerkwijzer ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-[3rem] p-10 md:p-16 border border-slate-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Waarom ZorgWerkwijzer?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Alles op één plek voor de Nederlandse zorgmedewerker.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <TrustItem icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} title="Actuele CAO info" description="Op basis van de nieuwste CAO's 2024-2026" />
            <TrustItem icon={<Calculator className="w-6 h-6 text-brand-blue" />} title="Salarisberekeningen" description="Nauwkeurige berekeningen inclusief ORT" />
            <TrustItem icon={<Briefcase className="w-6 h-6 text-brand-orange" />} title="Gratis vacatures" description="Actuele zorgvacatures zonder kosten" />
            <TrustItem icon={<ShieldCheck className="w-6 h-6 text-violet-500" />} title="Onafhankelijk" description="Geen commerciële belangen, eerlijke info" />
            <TrustItem icon={<GraduationCap className="w-6 h-6 text-pink-500" />} title="Voor zorgmedewerkers" description="Door en voor mensen in de zorg" />
          </div>
        </div>
      </section>

      {/* ── 11. Newsletter ───────────────────────────────────────────────────── */}
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

      {/* ── 12. FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Veelgestelde vragen</h2>
          <p className="text-slate-600 text-lg">Alles wat je moet weten over je salaris en rechten in de zorg.</p>
        </div>

        <div className="space-y-5">
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

      {/* ── 13. Strong CTA ───────────────────────────────────────────────────── */}
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

// ─── Sub-components ───────────────────────────────────────────────────────────


function EmployerCard({ employer }: { employer: EmployerDetail }) {
  return (
    <Link
      href={`/werkgevers/${employer.slug}`}
      className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:border-brand-blue hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-50 transition-colors">
        {employer.logoUrl ? (
          <Image src={employer.logoUrl} alt={employer.name} width={48} height={48} className="w-full h-full object-contain" />
        ) : (
          <Building2 className="w-6 h-6 text-slate-400 group-hover:text-brand-blue transition-colors" />
        )}
      </div>
      <p className="text-sm font-bold text-slate-700 truncate">{employer.name}</p>
      {(employer.vacancyCount ?? 0) > 0 && (
        <p className="text-xs text-brand-blue font-medium mt-1">{employer.vacancyCount} vacature{employer.vacancyCount === 1 ? '' : 's'}</p>
      )}
    </Link>
  );
}

function CalculatorCard({ icon, title, description, href, color }: { icon: React.ReactNode, title: string, description: string, href: string, color: string }) {
  return (
    <Link href={href} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-slate-500 text-sm mb-4">{description}</p>
      <div className="text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
        Starten <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

function CaoCard({ title, description, href, badge, badgeColor, iconBg }: {
  title: string; description: string; href: string; badge: string; badgeColor: string; iconBg: string;
}) {
  return (
    <Link href={href} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconBg} group-hover:scale-110 transition-transform`}>
        <BookOpen className="w-6 h-6 text-slate-600" />
      </div>
      <span className={`self-start text-xs font-bold px-2.5 py-0.5 rounded-full mb-3 ${badgeColor}`}>{badge}</span>
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed flex-1">{description}</p>
      <div className="mt-4 text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
        Meer lezen <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

function ZorgfunctieCard({ href, title, icon, color }: { href: string; title: string; icon: React.ReactNode; color: string }) {
  return (
    <Link href={href} className="bg-white rounded-2xl border border-slate-100 p-4 text-center hover:border-brand-blue hover:shadow-md transition-all group flex flex-col items-center gap-3">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-slate-700 leading-tight">{title}</span>
    </Link>
  );
}

function TrustItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-4">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-900 text-sm">{title}</p>
        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
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

// ─── OpleidingCard ───────────────────────────────────────────────────────────

function OpleidingCard({ href, title, niveauLabel, sector }: {
  href: string; title: string; niveauLabel: string; sector: string;
}) {
  return (
    <Link href={href} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-50 group-hover:scale-110 transition-transform">
        <GraduationCap className="w-6 h-6 text-sky-600" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight mb-1">{title}</h3>
        <p className="text-sm font-semibold text-sky-600">{niveauLabel}</p>
        <span className="text-xs text-slate-500 font-medium">{sector}</span>
      </div>
      <div className="mt-auto text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
        Bekijk opleiding <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

// ─── Homepage beroepen- en salarisdata ───────────────────────────────────────

const HOMEPAGE_BEROEPEN = [
  { slug: 'verpleegkundige',   name: 'Verpleegkundige',   sector: 'VVT / Ziekenhuis', icon: <Stethoscope className="w-6 h-6" />, color: 'text-sky-600 bg-sky-50' },
  { slug: 'verzorgende-ig',    name: 'Verzorgende IG',    sector: 'VVT',              icon: <Heart className="w-6 h-6" />,       color: 'text-pink-600 bg-pink-50' },
  { slug: 'helpende-plus',     name: 'Helpende Plus',     sector: 'VVT',              icon: <UserCheck className="w-6 h-6" />,   color: 'text-orange-600 bg-orange-50' },
  { slug: 'doktersassistent',  name: 'Doktersassistent',  sector: 'Huisartsenzorg',   icon: <Activity className="w-6 h-6" />,    color: 'text-emerald-600 bg-emerald-50' },
  { slug: 'wijkverpleegkundige', name: 'Wijkverpleegkundige', sector: 'VVT',          icon: <MapPin className="w-6 h-6" />,      color: 'text-violet-600 bg-violet-50' },
  { slug: 'gz-psycholoog',     name: 'GZ-psycholoog',     sector: 'GGZ',              icon: <Users className="w-6 h-6" />,       color: 'text-teal-600 bg-teal-50' },
  { slug: 'fysiotherapeut',    name: 'Fysiotherapeut',    sector: 'Paramedisch',      icon: <Activity className="w-6 h-6" />,    color: 'text-blue-600 bg-blue-50' },
  { slug: 'jeugdzorgwerker',   name: 'Jeugdzorgwerker',   sector: 'Jeugdzorg',        icon: <GraduationCap className="w-6 h-6" />, color: 'text-yellow-600 bg-yellow-50' },
] as const;

const OPLEIDING_HOMEPAGE_TOP = [
  'verpleegkunde-hbo', 'verzorgende-ig', 'fysiotherapie', 'gz-psycholoog', 'doktersassistent',
] as const;

const HOMEPAGE_OPLEIDINGEN = allOpleidingen
  .filter((o) => (OPLEIDING_HOMEPAGE_TOP as readonly string[]).includes(o.slug))
  .sort((a, b) =>
    (OPLEIDING_HOMEPAGE_TOP as readonly string[]).indexOf(a.slug) -
    (OPLEIDING_HOMEPAGE_TOP as readonly string[]).indexOf(b.slug),
  );

const SALARY_HOMEPAGE_TOP = [
  'verpleegkundige', 'verzorgende-ig', 'doktersassistent', 'wijkverpleegkundige',
] as const;

const HOMEPAGE_SALARISSEN = salaryProfessions
  .filter((p) => (SALARY_HOMEPAGE_TOP as readonly string[]).includes(p.slug))
  .sort((a, b) =>
    (SALARY_HOMEPAGE_TOP as readonly string[]).indexOf(a.slug) -
    (SALARY_HOMEPAGE_TOP as readonly string[]).indexOf(b.slug),
  );

// ─── BeroepCard ──────────────────────────────────────────────────────────────

function BeroepCard({ href, title, sector, icon, color }: {
  href: string; title: string; sector: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Link href={href} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col items-center text-center gap-3">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight mb-1">{title}</h3>
        <span className="text-xs text-slate-500 font-medium">{sector}</span>
      </div>
      <div className="mt-auto text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
        Bekijk beroep <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

// ─── SalarisCard ─────────────────────────────────────────────────────────────

const CAO_LABELS: Record<string, string> = {
  vvt: 'CAO VVT',
  ziekenhuizen: 'CAO Ziekenhuizen',
  ggz: 'CAO GGZ',
  gehandicaptenzorg: 'CAO Gehandicaptenzorg',
  huisartsenzorg: 'CAO Huisartsenzorg',
  jeugdzorg: 'CAO Jeugdzorg',
  kraamzorg: 'CAO Kraamzorg',
};

function SalarisCard({ href, title, range, caoId }: {
  href: string; title: string; range: string; caoId: string;
}) {
  const caoLabel = CAO_LABELS[caoId] ?? caoId.toUpperCase();
  return (
    <Link href={href} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 group-hover:scale-110 transition-transform">
        <Wallet className="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight mb-1">{title}</h3>
        <p className="text-lg font-black text-emerald-600">{range}</p>
        <span className="text-xs text-slate-500 font-medium">{caoLabel} · bruto/maand</span>
      </div>
      <div className="mt-auto text-brand-blue font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
        Bekijk salaris <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
