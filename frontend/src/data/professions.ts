/**
 * Centrale beroependata voor ZorgWerkwijzer.
 *
 * Voeg hier een nieuw beroep toe om automatisch:
 *  - /beroepen/[slug]      (via generateStaticParams)
 *  - /beroepen             (overzichtspagina)
 * te genereren — zonder nieuwe UI-code.
 *
 * Koppelt automatisch naar:
 *  - /salaris/[relatedSalarySlug]
 *  - /cao/[relatedCaoSlug]
 *  - /vacatures (via relatedVacancyProfession)
 */

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── Werkzaamheden ────────────────────────────────────────────────────────────

export interface TaskItem {
  title: string;
  description: string;
}

// ─── Doorgroeimogelijkheden ───────────────────────────────────────────────────

export interface GrowthPath {
  title: string;
  description: string;
}

// ─── Hoofd-beroepsdefinitie ───────────────────────────────────────────────────

export interface ProfessionData {
  /** URL-slug, bijv. "verpleegkundige" → /beroepen/verpleegkundige */
  slug: string;
  /** Weergavenaam, bijv. "Verpleegkundige" */
  name: string;
  /** SEO meta description (max 160 tekens) */
  metaDescription: string;
  /** Hero-badge tekst, bijv. "Zorgprofessional" */
  heroBadge: string;
  /** Hero-introductie (1–2 zinnen) */
  heroIntro: string;
  /** Korte intro-paragraaf (max 100 woorden) */
  intro: string;
  /** Sector, bijv. "VVT", "GGZ", "Ziekenhuizen" */
  sector: string;
  /** Opleidingsniveau, bijv. "MBO niveau 4 / HBO" */
  mboHboLevel: string;
  /** Opleiding omschrijving */
  opleiding: string;
  /** Vereist BIG-registratie */
  bigRegistration: boolean;
  /** Gemiddeld salaris display, bijv. "€3.325 – €5.650 bruto" */
  averageSalary: string;
  /** Werkomgeving, bijv. "Verpleeghuis, thuiszorg, ziekenhuis" */
  workEnvironment: string;
  /** Werkzaamheden */
  tasks: TaskItem[];
  /** Competenties (bullet-list) */
  competencies: string[];
  /** Doorgroeimogelijkheden */
  growthPaths: GrowthPath[];
  /** Slug van de bijbehorende salarispagina */
  relatedSalarySlug: string;
  /** Slug van de bijbehorende CAO-pagina */
  relatedCaoSlug: string;
  /** Naam van de CAO, bijv. "CAO VVT" */
  relatedCaoName: string;
  /** Beroep-label voor vacaturefilter, bijv. "Verpleegkundige" */
  relatedVacancyProfession: string;
  /** Slug van de bijbehorende opleidingspagina (optioneel) */
  relatedEducationSlug?: string;
  /** FAQ-items */
  faqs: FaqItem[];
}

// ─── Helper-functies ──────────────────────────────────────────────────────────

export function getProfessionData(slug: string): ProfessionData | undefined {
  return beroepen.find((b) => b.slug === slug);
}

export function getProfessionStaticParams(): { slug: string }[] {
  return beroepen.map((b) => ({ slug: b.slug }));
}

/** Geeft alle beroepen voor een bepaalde sector */
export function getBeroepenBySector(sector: string): ProfessionData[] {
  return beroepen.filter((b) => b.sector === sector);
}

/** Geeft alle unieke sectoren */
export function getAllSectors(): string[] {
  return [...new Set(beroepen.map((b) => b.sector))];
}
/** Geeft alle beroepen die onder een bepaalde CAO-slug vallen */
export function getBeroepenByCao(caoSlug: string): ProfessionData[] {
  return beroepen.filter((b) => b.relatedCaoSlug === caoSlug);
}

// ─── Beroepen-register ────────────────────────────────────────────────────────

export const beroepen: ProfessionData[] = [
  // ── Verpleegkundige ────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    name: 'Verpleegkundige',
    metaDescription:
      'Alles over het beroep verpleegkundige: taken, opleiding, BIG-registratie, salaris en doorgroeimogelijkheden. Ontdek vacatures in de zorg.',
    heroBadge: 'Zorgprofessional VVT & Ziekenhuizen',
    heroIntro:
      'Als verpleegkundige lever je directe patiëntenzorg en speel je een sleutelrol in het zorgteam. Ontdek taken, opleiding, salaris en carrièrekansen.',
    intro:
      'Een verpleegkundige verzorgt patiënten op MBO niveau 4 of HBO niveau 6. Je werkt in verpleeghuizen, ziekenhuizen, thuiszorg of de GGZ. De functie vereist een BIG-registratie en biedt uitstekende doorgroeimogelijkheden naar gespecialiseerd verpleegkundige of Nurse Practitioner.',
    sector: 'VVT',
    mboHboLevel: 'MBO niveau 4 / HBO niveau 6',
    opleiding:
      'Verpleegkunde MBO (BBL of BOL, 3–4 jaar) of HBO-Verpleegkunde (4 jaar). Na HBO kun je doorstromen naar een master Nurse Practitioner of Physician Assistant.',
    bigRegistration: true,
    averageSalary: '€3.325 – €5.650 bruto p/m',
    workEnvironment: 'Verpleeghuis, ziekenhuis, thuiszorg, GGZ, revalidatiecentrum',
    tasks: [
      { title: 'Patiëntenzorg verlenen', description: 'Wassen, aankleden, medicatie toedienen en vitale functies bewaken.' },
      { title: 'Zorgplan opstellen en evalueren', description: 'In afstemming met arts, fysiotherapeut en sociale omgeving.' },
      { title: 'Toezicht houden op leerlingen', description: 'Begeleiden van MBO-studenten tijdens hun stage.' },
      { title: 'Overleg met multidisciplinair team', description: 'Samenwerken met artsen, paramedici en sociaal werkers.' },
    ],
    competencies: [
      'Empathisch en geduldig',
      'Stressbestendig in complexe situaties',
      'Nauwkeurig bij medicatieverstrekking',
      'Teamspeler met zelfstandig werkvermogen',
      'Communicatief vaardig richting patiënt en naasten',
    ],
    growthPaths: [
      { title: 'Gespecialiseerd verpleegkundige', description: 'Specialiseer in oncologie, IC, SEH of dementiezorg (FWG 50–55).' },
      { title: 'Nurse Practitioner', description: 'HBO-master met uitgebreide medische bevoegdheden (FWG 60+).' },
      { title: 'Teamleider zorg', description: 'Leidinggevende rol op een afdeling of locatie (FWG 60–65).' },
      { title: 'Locatiemanager', description: 'Verantwoordelijk voor een zorglocatie inclusief personele aansturing.' },
    ],
    relatedSalarySlug: 'verpleegkundige',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Verpleegkundige',
    relatedEducationSlug: 'verpleegkunde-hbo',
    faqs: [
      {
        question: 'Wat is het verschil tussen MBO en HBO verpleegkundige?',
        answer: 'MBO niveau 4 richt zich op uitvoerende zorg. HBO niveau 6 heeft een bredere regiefunctie en meer verantwoordelijkheden bij complexe zorg.',
      },
      {
        question: 'Is een BIG-registratie verplicht?',
        answer: 'Ja. Als verpleegkundige (niveau 4 en 5/6) ben je wettelijk verplicht ingeschreven in het BIG-register. Verlenging is elke 5 jaar vereist.',
      },
      {
        question: 'Wat verdient een verpleegkundige gemiddeld?',
        answer: 'Gemiddeld €3.325 – €5.650 bruto per maand (36 uur, CAO VVT 2026). ORT-toeslagen kunnen het inkomen aanzienlijk verhogen.',
      },
      {
        question: 'Welke specialisaties zijn er voor verpleegkundigen?',
        answer: 'IC-verpleegkundige, SEH-verpleegkundige, oncologie, dialyse, psychiatrie, wijk- en geriatrische specialisaties.',
      },
    ],
  },

  // ── Verzorgende IG ─────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    name: 'Verzorgende IG',
    metaDescription:
      'Alles over het beroep Verzorgende IG: taken, opleiding MBO niveau 3, salaris CAO VVT en doorgroeimogelijkheden. Ontdek vacatures.',
    heroBadge: 'MBO niveau 3 – VVT',
    heroIntro:
      'Als Verzorgende IG bied je persoonlijke zorg en begeleiding aan cliënten thuis of in een zorginstelling. Ontdek taken, opleiding en carrièrekansen.',
    intro:
      'Een Verzorgende IG (Individueel Gerichte Zorg) werkt op MBO niveau 3 en biedt persoonlijke zorg en begeleiding aan kwetsbare mensen. Je werkt zelfstandig en hebt ruimte voor eigen initiatief. Doorgroeien naar verpleegkundige is een logische stap.',
    sector: 'VVT',
    mboHboLevel: 'MBO niveau 3',
    opleiding:
      'MBO Verzorgende IG (BBL of BOL, 3 jaar). Doorstroom mogelijk naar MBO niveau 4 Verpleegkunde.',
    bigRegistration: false,
    averageSalary: '€2.800 – €4.200 bruto p/m',
    workEnvironment: 'Verpleeghuis, woonzorgcentrum, thuiszorg',
    tasks: [
      { title: 'Persoonlijke verzorging', description: 'Hulp bij wassen, aankleden, eten en drinken.' },
      { title: 'Begeleiding en activering', description: 'Ondersteunen van de zelfredzaamheid en dagactiviteiten.' },
      { title: 'Medicijnen toedienen', description: 'Eenvoudige voorbehouden handelingen uitvoeren.' },
      { title: 'Rapportage bijhouden', description: 'Observaties vastleggen in het zorgdossier.' },
    ],
    competencies: [
      'Empathisch en geduldig',
      'Zelfstandig maar teamgericht',
      'Nauwkeurig bij medicatie en rapportage',
      'Flexibel bij wisselende werktijden',
    ],
    growthPaths: [
      { title: 'Verpleegkundige MBO niveau 4', description: 'Doorstroom via MBO-4 opleiding.' },
      { title: 'Gespecialiseerd medewerker', description: 'Dementiezorg, wondzorg of palliatieve zorg.' },
      { title: 'Werkbegeleider', description: 'Begeleiden van stagiairs en nieuwe collega\'s.' },
    ],
    relatedSalarySlug: 'verzorgende-ig',
    relatedCaoSlug: 'vvt',
    relatedEducationSlug: 'verzorgende-ig',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Verzorgende IG',
    faqs: [
      {
        question: 'Wat doet een Verzorgende IG?',
        answer: 'Een Verzorgende IG biedt persoonlijke zorg, begeleiding en eenvoudige verpleegkundige handelingen aan cliënten thuis of in een instelling.',
      },
      {
        question: 'Heb je een BIG-registratie nodig als Verzorgende IG?',
        answer: 'Nee, een Verzorgende IG valt niet onder de BIG-wet en heeft geen BIG-registratie nodig.',
      },
      {
        question: 'Wat is het verschil tussen Verzorgende IG en Helpende Plus?',
        answer: 'Helpende Plus (niveau 2) voert eenvoudigere huishoudelijke en verzorgende taken uit. Verzorgende IG (niveau 3) heeft meer verantwoordelijkheid en zelfstandigheid.',
      },
    ],
  },

  // ── Helpende ───────────────────────────────────────────────────────────────
  {
    slug: 'helpende',
    name: 'Helpende',
    metaDescription:
      'Alles over het beroep Helpende: taken, opleiding Helpende Zorg & Welzijn MBO niveau 2, salaris FWG 25 en doorgroeimogelijkheden. Ontdek vacatures.',
    heroBadge: 'MBO niveau 2 – Thuiszorg',
    heroIntro:
      'Als Helpende ondersteun je cliënten bij huishoudelijke activiteiten en lichte persoonlijke verzorging. Een instapfunctie in de zorg met duidelijk doorgroeipad.',
    intro:
      'Een Helpende werkt op MBO niveau 2 en helpt cliënten met huishoudelijke taken en lichte persoonlijke verzorging. Doorgroei naar Helpende Plus (via aanvullende scholing, FWG 30) of Verzorgende IG (via MBO-3, FWG 40) is goed mogelijk.',
    sector: 'VVT',
    mboHboLevel: 'MBO niveau 2',
    opleiding:
      'MBO Helpende Zorg & Welzijn niveau 2 (BBL of BOL, 2 jaar).',
    bigRegistration: false,
    averageSalary: '€2.300 – €2.700 bruto p/m',
    workEnvironment: 'Thuiszorg, woonzorgcentrum, dagbesteding',
    tasks: [
      { title: 'Huishoudelijke ondersteuning', description: 'Schoonmaken, koken, boodschappen doen.' },
      { title: 'Lichte persoonlijke verzorging', description: 'Hulp bij wassen en aankleden onder toezicht.' },
      { title: 'Signaleren en rapporteren', description: 'Bijzonderheden melden bij de leidinggevende.' },
      { title: 'Sociale ondersteuning', description: 'Gesprek voeren en sociale activiteiten begeleiden.' },
    ],
    competencies: [
      'Betrokken en vriendelijk',
      'Betrouwbaar en stipt',
      'Flexibel inzetbaar',
      'Goede communicatieve vaardigheden',
    ],
    growthPaths: [
      { title: 'Helpende Plus', description: 'Via aanvullende scholing/certificering doorgroeien naar FWG 30.' },
      { title: 'Verzorgende IG', description: 'Doorstroom via MBO-3 opleiding naar FWG 40.' },
    ],
    relatedSalarySlug: 'helpende',
    relatedCaoSlug: 'vvt',
    relatedEducationSlug: 'helpende-zorg-welzijn',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Helpende',
    faqs: [
      {
        question: 'Wat doet een Helpende?',
        answer: 'Een Helpende (MBO niveau 2) helpt cliënten met huishoudelijke taken en lichte persoonlijke verzorging onder begeleiding van een Verzorgende IG.',
      },
      {
        question: 'Wat verdient een Helpende?',
        answer: 'Gemiddeld €2.300 – €2.700 bruto per maand (conform CAO VVT 2026, FWG 25).',
      },
      {
        question: 'Wat is het verschil tussen Helpende en Helpende Plus?',
        answer: 'Een Helpende (FWG 25) voert huishoudelijke en lichte verzorgende taken uit. Een Helpende Plus (FWG 30) heeft aanvullende scholing gevolgd en mag ook eenvoudige verpleegtechnische handelingen uitvoeren.',
      },
    ],
  },

  // ── Helpende Plus ──────────────────────────────────────────────────────────
  {
    slug: 'helpende-plus',
    name: 'Helpende Plus',
    metaDescription:
      'Alles over het beroep Helpende Plus: taken, opleiding MBO niveau 2, salaris en doorgroeimogelijkheden in de thuiszorg. Ontdek vacatures.',
    heroBadge: 'MBO niveau 2 – Thuiszorg',
    heroIntro:
      'Als Helpende Plus ondersteun je cliënten bij het huishouden en persoonlijke verzorging. Een instapfunctie met goede doorgroeimogelijkheden.',
    intro:
      'Een Helpende Plus werkt op MBO niveau 2 en helpt cliënten met huishoudelijke taken en lichte persoonlijke verzorging. Het is een instapberoep in de zorg met een duidelijk doorgroeipad naar Verzorgende IG.',
    sector: 'VVT',
    mboHboLevel: 'MBO niveau 2',
    opleiding:
      'MBO Helpende Zorg en Welzijn niveau 2 (BBL of BOL, 2 jaar). Doorstroom naar MBO-3 Verzorgende IG.',
    bigRegistration: false,
    averageSalary: '€2.500 – €3.000 bruto p/m',
    workEnvironment: 'Thuiszorg, woonzorgcentrum, dagbesteding',
    tasks: [
      { title: 'Huishoudelijke ondersteuning', description: 'Schoonmaken, koken, boodschappen doen.' },
      { title: 'Persoonlijke verzorging', description: 'Hulp bij wassen en aankleden onder toezicht.' },
      { title: 'Signaleren en rapporteren', description: 'Bijzonderheden melden bij de leidinggevende.' },
      { title: 'Sociale ondersteuning', description: 'Gesprek voeren en sociale activiteiten begeleiden.' },
    ],
    competencies: [
      'Betrokken en vriendelijk',
      'Betrouwbaar en stipt',
      'Flexibel inzetbaar',
      'Goede communicatieve vaardigheden',
    ],
    growthPaths: [
      { title: 'Verzorgende IG', description: 'Doorstroom via MBO-3 opleiding.' },
      { title: 'Medewerker dagbesteding', description: 'Begeleiding van activiteiten voor ouderen.' },
    ],
    relatedSalarySlug: 'helpende-plus',
    relatedCaoSlug: 'vvt',
    relatedEducationSlug: 'helpende-zorg-welzijn',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Helpende Plus',
    faqs: [
      {
        question: 'Wat is een Helpende Plus?',
        answer: 'Een Helpende Plus (MBO niveau 2) helpt cliënten met huishoudelijke taken en lichte persoonlijke zorg onder begeleiding van een Verzorgende IG.',
      },
      {
        question: 'Wat verdient een Helpende Plus?',
        answer: 'Gemiddeld €2.300 – €3.200 bruto per maand (conform CAO VVT 2026).',
      },
    ],
  },

  // ── Wijkverpleegkundige ────────────────────────────────────────────────────
  {
    slug: 'wijkverpleegkundige',
    name: 'Wijkverpleegkundige',
    metaDescription:
      'Alles over het beroep wijkverpleegkundige: taken, HBO-opleiding, BIG-registratie, salaris en werken in de thuiszorg. Bekijk vacatures.',
    heroBadge: 'HBO – Thuiszorg & VVT',
    heroIntro:
      'Als wijkverpleegkundige lever je complexe verpleegkundige zorg thuis. Je werkt zelfstandig, indiceert zorg en coördineert het zorgteam.',
    intro:
      'Een wijkverpleegkundige werkt op HBO-niveau in de thuiszorg. Je beoordeelt zorgbehoeften, stelt zorgplannen op en coördineert de zorg voor cliënten in hun eigen omgeving. De functie vereist een BIG-registratie als verpleegkundige (niveau 5/6).',
    sector: 'VVT',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO-Verpleegkunde (4 jaar). Aanvullende scholing wijkverpleging aanbevolen. BIG-registratie verplicht.',
    bigRegistration: true,
    averageSalary: '€3.770 – €5.650 bruto p/m',
    workEnvironment: 'Thuiszorgorganisaties, zelfstandige praktijk (ZZP)',
    tasks: [
      { title: 'Indicatiestelling', description: 'Zorgbehoefte beoordelen en vastleggen.' },
      { title: 'Complexe verpleegkundige handelingen', description: 'Wondverzorging, injecties, katheterisatie.' },
      { title: 'Zorgcoördinatie', description: 'Afstemming met huisarts, specialist en mantelzorg.' },
      { title: 'Cliëntbegeleiding', description: 'Ondersteuning bij zelfregie en medicijnbeheer.' },
    ],
    competencies: [
      'Zelfstandig en besluitvaardig',
      'Communicatief sterk',
      'Probleemoplossend vermogen',
      'Organisatorische vaardigheden',
      'Empathisch en respectvol',
    ],
    growthPaths: [
      { title: 'Verpleegkundig specialist', description: 'Master-opleiding voor uitgebreide medische bevoegdheden.' },
      { title: 'Praktijkhouder ZZP', description: 'Eigen wijkverpleegkundige praktijk starten.' },
      { title: 'Manager thuiszorg', description: 'Leidinggevende rol bij een thuiszorgorganisatie.' },
    ],
    relatedSalarySlug: 'wijkverpleegkundige',
    relatedCaoSlug: 'vvt',
    relatedEducationSlug: 'verpleegkunde-hbo',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Wijkverpleegkundige',
    faqs: [
      {
        question: 'Wat doet een wijkverpleegkundige?',
        answer: 'Een wijkverpleegkundige levert HBO-niveau verpleegkundige zorg bij mensen thuis, indiceert zorgbehoeften en coördineert het zorgteam.',
      },
      {
        question: 'Welke opleiding heb je nodig?',
        answer: 'HBO-Verpleegkunde (4 jaar) met BIG-registratie als verpleegkundige niveau 5/6.',
      },
      {
        question: 'Kan een wijkverpleegkundige ZZP worden?',
        answer: 'Ja. Veel wijkverpleegkundigen werken als zelfstandige en contracteren zich bij thuiszorgorganisaties of via een zorgkantoor.',
      },
    ],
  },

  // ── Fysiotherapeut ────────────────────────────────────────────────────────
  {
    slug: 'fysiotherapeut',
    name: 'Fysiotherapeut',
    metaDescription:
      'Alles over het beroep fysiotherapeut: taken, HBO-opleiding, BIG-registratie, salaris en werken in de zorg. Ontdek vacatures en doorgroeimogelijkheden.',
    heroBadge: 'HBO – Paramedisch',
    heroIntro:
      'Als fysiotherapeut herstel je beweging en verminder je pijn bij patiënten. Je werkt in de eerste of tweede lijn, in een ziekenhuis of verpleeghuis.',
    intro:
      'Een fysiotherapeut diagnosticeert en behandelt bewegingsstoornissen. Je werkt in een eigen praktijk, ziekenhuis, verpleeghuis of revalidatiecentrum. De BIG-registratie is verplicht. Specialisaties bieden uitstekende carrièrekansen.',
    sector: 'Paramedisch',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO Fysiotherapie (4 jaar). Diverse post-HBO specialisaties beschikbaar (manuele therapie, sportfysiotherapie, kinderfysiotherapie).',
    bigRegistration: true,
    averageSalary: '€3.200 – €5.800 bruto p/m',
    workEnvironment: 'Eigen praktijk, ziekenhuis, revalidatiecentrum, verpleeghuis, sportclub',
    tasks: [
      { title: 'Diagnostiek', description: 'Onderzoek en beoordeling van bewegingsstoornissen.' },
      { title: 'Behandeling', description: 'Oefentherapie, manuele therapie, electrotherapie.' },
      { title: 'Zorgplan opstellen', description: 'Doelen stellen en voortgang evalueren.' },
      { title: 'Preventieve voorlichting', description: 'Adviezen geven over houding, ergonomie en sport.' },
    ],
    competencies: [
      'Analytisch en diagnosestellend',
      'Communicatief en motiverend',
      'Hands-on behandelaar',
      'Zelfstandig ondernemend (eigen praktijk)',
      'Empathisch en geduldig',
    ],
    growthPaths: [
      { title: 'Manueel therapeut', description: 'Post-HBO specialisatie in gewrichtsmanipulaties.' },
      { title: 'Sportfysiotherapeut', description: 'Specialisatie in sportblessures en revalidatie.' },
      { title: 'Praktijkhouder', description: 'Eigen fysiotherapiepraktijk openen.' },
      { title: 'Klinisch specialist', description: 'Werken in ziekenhuis als gespecialiseerd fysiotherapeut.' },
    ],
    relatedSalarySlug: 'fysiotherapeut',
    relatedCaoSlug: 'vvt',
    relatedEducationSlug: 'fysiotherapie',
    relatedCaoName: 'CAO VVT / CAO Ziekenhuizen',
    relatedVacancyProfession: 'Fysiotherapeut',
    faqs: [
      {
        question: 'Hoelang duurt de opleiding fysiotherapie?',
        answer: 'De HBO-opleiding Fysiotherapie duurt 4 jaar. Daarna zijn diverse post-HBO specialisaties beschikbaar van 2–3 jaar.',
      },
      {
        question: 'Heb je een BIG-registratie nodig als fysiotherapeut?',
        answer: 'Ja. Fysiotherapeuten zijn BIG-geregistreerd (artikel 3 BIG-wet). Herregistratie elke 5 jaar.',
      },
      {
        question: 'Kan een fysiotherapeut ZZP worden?',
        answer: 'Ja. Veel fysiotherapeuten werken als ZZP\'er in een maatschapspraktijk of eigen praktijk, gecontracteerd met zorgverzekeraars.',
      },
    ],
  },

  // ── Ergotherapeut ─────────────────────────────────────────────────────────
  {
    slug: 'ergotherapeut',
    name: 'Ergotherapeut',
    metaDescription:
      'Alles over het beroep ergotherapeut: taken, HBO-opleiding, BIG-registratie, salaris en werken in de zorg. Ontdek vacatures.',
    heroBadge: 'HBO – Paramedisch',
    heroIntro:
      'Als ergotherapeut help je mensen bij het (her)leren van dagelijkse activiteiten na ziekte, letsel of beperking. Je werkt in ziekenhuis, verpleeghuis of thuiszorg.',
    intro:
      'Een ergotherapeut richt zich op het verbeteren van zelfstandigheid in dagelijks functioneren. Je analyseert belemmeringen en biedt oplossingen via aanpassingen, hulpmiddelen en oefeningen. De BIG-registratie is verplicht.',
    sector: 'Paramedisch',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO Ergotherapie (4 jaar). Post-HBO specialisaties in neurorevalidatie, arbeidsgerelateerde ergotherapie en kindereikoproblematiek.',
    bigRegistration: true,
    averageSalary: '€3.100 – €5.400 bruto p/m',
    workEnvironment: 'Ziekenhuis, revalidatiecentrum, verpleeghuis, thuiszorg, GGZ',
    tasks: [
      { title: 'Functioneringsonderzoek', description: 'Analyseren van beperkingen in dagelijks functioneren.' },
      { title: 'Behandelplan opstellen', description: 'Doelen stellen gericht op zelfstandigheid.' },
      { title: 'Aanpassen van de omgeving', description: 'Adviseren over hulpmiddelen en woningaanpassingen.' },
      { title: 'Oefentherapie', description: 'Training van vaardigheden voor ADL-activiteiten.' },
    ],
    competencies: [
      'Creatief probleemoplossend',
      'Empathisch en geduldig',
      'Analytisch denker',
      'Multidisciplinair samenwerken',
      'Communicatief vaardig',
    ],
    growthPaths: [
      { title: 'Klinisch specialist ergotherapie', description: 'Specialisatie in neurorevalidatie of geriatrie.' },
      { title: 'Onderzoeker / docent', description: 'Werken aan een hogeschool of onderzoeksinstelling.' },
      { title: 'Adviseur hulpmiddelenverstrekking', description: 'Adviserende rol bij zorgverzekeraar of gemeente.' },
    ],
    relatedSalarySlug: 'ergotherapeut',
    relatedCaoSlug: 'ziekenhuizen',
    relatedEducationSlug: 'ergotherapie',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Ergotherapeut',
    faqs: [
      {
        question: 'Wat doet een ergotherapeut?',
        answer: 'Een ergotherapeut helpt mensen bij het (her)leren van dagelijkse activiteiten via oefening, aanpassingen en hulpmiddelen.',
      },
      {
        question: 'Is ergotherapeut hetzelfde als fysiotherapeut?',
        answer: 'Nee. Fysiotherapeuten richten zich op beweging en pijn. Ergotherapeuten richten zich op het dagelijks functioneren en zelfstandigheid.',
      },
    ],
  },

  // ── Logopedist ────────────────────────────────────────────────────────────
  {
    slug: 'logopedist',
    name: 'Logopedist',
    metaDescription:
      'Alles over het beroep logopedist: taken, HBO-opleiding, BIG-registratie, salaris en werken in de zorg. Ontdek vacatures.',
    heroBadge: 'HBO – Paramedisch',
    heroIntro:
      'Als logopedist behandel je stoornissen in spraak, taal, stem, gehoor en slikken bij kinderen en volwassenen.',
    intro:
      'Een logopedist diagnosticeert en behandelt communicatieve stoornissen en slikproblematiek. Je werkt in een eigen praktijk, school, ziekenhuis of verpleeghuis. BIG-registratie is verplicht.',
    sector: 'Paramedisch',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO Logopedie (4 jaar). Post-HBO specialisaties in dysfagie, stotterbehandeling en kindertaalproblematiek.',
    bigRegistration: true,
    averageSalary: '€3.000 – €5.200 bruto p/m',
    workEnvironment: 'Eigen praktijk, school, ziekenhuis, verpleeghuis, GGZ',
    tasks: [
      { title: 'Diagnostiek taal- en spraakstoornissen', description: 'Onderzoek en classificatie van communicatieve stoornissen.' },
      { title: 'Slikfunctie beoordelen', description: 'Diagnostiek en behandeling van dysfagie.' },
      { title: 'Behandeltherapie', description: 'Oefenprogramma\'s voor spraak, taal en stem.' },
      { title: 'Adviezen aan omgeving', description: 'Ouders, leerkrachten en verzorgenden instrueren.' },
    ],
    competencies: [
      'Geduldig en nauwkeurig',
      'Communicatief sterk',
      'Analytisch diagnostisch vermogen',
      'Creatief in therapiemethoden',
    ],
    growthPaths: [
      { title: 'Klinisch logopedist', description: 'Specialisatie in dysfagie of neurologische stoornissen.' },
      { title: 'Praktijkhouder', description: 'Eigen logopediepraktijk openen.' },
      { title: 'Docent logopedie', description: 'Lesgeven aan een HBO-instelling.' },
    ],
    relatedSalarySlug: 'logopedist',
    relatedCaoSlug: 'ziekenhuizen',
    relatedEducationSlug: 'logopedie',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Logopedist',
    faqs: [
      {
        question: 'Wat behandelt een logopedist?',
        answer: 'Stoornissen in spraak, taal, stem, gehoor en slikken bij zowel kinderen als volwassenen.',
      },
      {
        question: 'Is een BIG-registratie verplicht voor logopedisten?',
        answer: 'Ja. Logopedisten zijn BIG-geregistreerd (artikel 3). Herregistratie elke 5 jaar vereist.',
      },
    ],
  },

  // ── Doktersassistent ──────────────────────────────────────────────────────
  {
    slug: 'doktersassistent',
    name: 'Doktersassistent',
    metaDescription:
      'Alles over het beroep doktersassistent: taken, MBO-opleiding, salaris CAO Huisartsenzorg en doorgroeimogelijkheden. Ontdek vacatures.',
    heroBadge: 'MBO niveau 4 – Huisartsenzorg',
    heroIntro:
      'Als doktersassistent ben je het eerste aanspreekpunt in de huisartsenpraktijk. Je triageert, assisteert bij consulten en voert lichte medische handelingen uit.',
    intro:
      'Een doktersassistent werkt op MBO niveau 4 in de huisartsenpraktijk of gezondheidscentrum. Je voert triage uit, bereidt consulten voor en assisteert de huisarts bij medische handelingen. Doorgroei naar POH of triagist is goed mogelijk.',
    sector: 'Huisartsenzorg',
    mboHboLevel: 'MBO niveau 4',
    opleiding:
      'MBO Doktersassistent (BBL of BOL, 3–4 jaar). Doorstroom naar HBO-V of POH-opleiding.',
    bigRegistration: false,
    averageSalary: '€2.700 – €4.100 bruto p/m',
    workEnvironment: 'Huisartsenpraktijk, gezondheidscentrum, spoedpost (HAP)',
    tasks: [
      { title: 'Triage uitvoeren', description: 'Urgentie van klachten beoordelen via telefoon of balie.' },
      { title: 'Consulten voorbereiden', description: 'Patiëntdossiers bijwerken en ruimtes gereedmaken.' },
      { title: 'Medische handelingen', description: 'Bloedafname, ECG, wondverzorging en injecties.' },
      { title: 'Administratie', description: 'Verwijsbrieven, recepten en medicatieoverzichten verwerken.' },
    ],
    competencies: [
      'Stressbestendig en besluitvaardig',
      'Nauwkeurig bij medische handelingen',
      'Empathisch richting patiënten',
      'Organisatorisch sterk',
    ],
    growthPaths: [
      { title: 'Praktijkondersteuner (POH)', description: 'Post-HBO opleiding voor uitgebreidere medische taken.' },
      { title: 'Triagist', description: 'Specialisatie in telefonische triage.' },
      { title: 'HBO-Verpleegkunde', description: 'Doorstroom naar verpleegkundige opleiding.' },
    ],
    relatedSalarySlug: 'doktersassistent',
    relatedCaoSlug: 'huisartsenzorg',
    relatedEducationSlug: 'doktersassistent',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'Doktersassistent',
    faqs: [
      {
        question: 'Wat doet een doktersassistent?',
        answer: 'Een doktersassistent triageert patiënten, assisteert de huisarts en voert lichte medische handelingen uit zoals bloedafname en ECG.',
      },
      {
        question: 'Wat is het salaris van een doktersassistent?',
        answer: 'Gemiddeld €2.700 – €4.100 bruto per maand conform CAO Huisartsenzorg 2026.',
      },
    ],
  },

  // ── Praktijkondersteuner (POH) ─────────────────────────────────────────────
  {
    slug: 'praktijkondersteuner',
    name: 'Praktijkondersteuner (POH)',
    metaDescription:
      'Alles over het beroep praktijkondersteuner (POH): taken, opleiding, salaris CAO Huisartsenzorg en doorgroeimogelijkheden. Ontdek vacatures.',
    heroBadge: 'HBO – Huisartsenzorg',
    heroIntro:
      'Als praktijkondersteuner (POH) behandel je chronisch zieken zelfstandig in de huisartsenpraktijk. Je biedt consulten voor diabetes, COPD, hart- en vaatziekten of GGZ-problematiek.',
    intro:
      'Een Praktijkondersteuner Huisarts (POH) werkt HBO-opgeleid en heeft eigen spreekuren voor chronische aandoeningen. Je werkt zelfstandig en nauw samen met de huisarts. Er zijn specialisaties: POH-Somatiek (diabetes, COPD), POH-GGZ en POH-Ouderen.',
    sector: 'Huisartsenzorg',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO-Verpleegkunde of HBO-V + post-HBO POH-opleiding (1–2 jaar). Specialisaties via accreditatie-instellingen.',
    bigRegistration: true,
    averageSalary: '€3.500 – €5.600 bruto p/m',
    workEnvironment: 'Huisartsenpraktijk, gezondheidscentrum',
    tasks: [
      { title: 'Chronisch zieken begeleiden', description: 'Diabetes, COPD, astma, hypertensie — eigen spreekuren.' },
      { title: 'Leefstijladvies geven', description: 'Voeding, beweging en medicatietrouw bespreken.' },
      { title: 'Preventieve zorg', description: 'Risicofactoren monitoren en opsporen.' },
      { title: 'Verwijzen', description: 'Doorverwijzen naar specialist bij complicaties.' },
    ],
    competencies: [
      'Zelfstandig en proactief',
      'Empathisch met chronisch zieken',
      'Analytisch klinisch denkvermogen',
      'Communicatief vaardig',
    ],
    growthPaths: [
      { title: 'POH-GGZ', description: 'Specialisatie in geestelijke gezondheidszorg.' },
      { title: 'Nurse Practitioner', description: 'Master-opleiding met uitgebreide bevoegdheden.' },
      { title: 'Praktijkhouder', description: 'Eigen POH-praktijk of ZZP-rol.' },
    ],
    relatedSalarySlug: 'praktijkondersteuner',
    relatedCaoSlug: 'huisartsenzorg',
    relatedEducationSlug: 'praktijkondersteuner-poh',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'Praktijkondersteuner',
    faqs: [
      {
        question: 'Wat doet een POH?',
        answer: 'Een POH heeft eigen spreekuren voor chronische aandoeningen zoals diabetes, COPD en hart- en vaatziekten in de huisartsenpraktijk.',
      },
      {
        question: 'Wat is het verschil tussen POH-Somatiek en POH-GGZ?',
        answer: 'POH-Somatiek richt zich op lichamelijke chronische aandoeningen. POH-GGZ richt zich op psychische klachten zoals angst, depressie en stress.',
      },
    ],
  },

  // ── POH-GGZ ───────────────────────────────────────────────────────────────
  {
    slug: 'poh-ggz',
    name: 'POH-GGZ',
    metaDescription:
      'Alles over het beroep POH-GGZ: taken, opleiding, salaris en werken in de huisartsenpraktijk met GGZ-patiënten. Ontdek vacatures.',
    heroBadge: 'HBO – GGZ / Huisartsenzorg',
    heroIntro:
      'Als POH-GGZ begeleid je mensen met psychische klachten in de huisartsenpraktijk. Je biedt kortdurende behandeling voor angst, depressie en burnout.',
    intro:
      'De Praktijkondersteuner GGZ (POH-GGZ) werkt in de huisartsenpraktijk en begeleidt patiënten met lichte tot matige psychische klachten. Je voorkomt doorverwijzing naar de specialistische GGZ en werkt nauw samen met de huisarts en eventueel de ggz-instelling.',
    sector: 'GGZ',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO (SPH, Verpleegkunde, Psychologie, MWD) + post-HBO POH-GGZ opleiding (1 jaar). Geaccrediteerd bij NVVP of ADEPHAGIA.',
    bigRegistration: false,
    averageSalary: '€3.500 – €5.400 bruto p/m',
    workEnvironment: 'Huisartsenpraktijk, gezondheidscentrum',
    tasks: [
      { title: 'Diagnostiek psychische klachten', description: 'Intake en screening van GGZ-problematiek.' },
      { title: 'Kortdurende behandeling', description: 'CGT-elementen, mindfulness, probleem-oplossende therapie.' },
      { title: 'Psychoeducatie', description: 'Uitleg geven over klachten en zelfmanagement.' },
      { title: 'Triageren en verwijzen', description: 'Bepalen wanneer specialistische GGZ nodig is.' },
    ],
    competencies: [
      'Empathisch en niet-oordelend',
      'Structurerend vermogen',
      'Basiskennis CGT-technieken',
      'Zelfstandig en besluitvaardig',
    ],
    growthPaths: [
      { title: 'GZ-Psycholoog', description: 'Verdere academische opleiding psychologie + BIG.' },
      { title: 'Behandelaar GGZ', description: 'Overstap naar ggz-instelling met breder behandelaanbod.' },
      { title: 'Praktijkhouder POH-GGZ', description: 'Zelfstandige praktijk in meerdere huisartsenpraktijken.' },
    ],
    relatedSalarySlug: 'poh-ggz',
    relatedCaoSlug: 'huisartsenzorg',
    relatedEducationSlug: 'poh-ggz',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'POH-GGZ',
    faqs: [
      {
        question: 'Wat doet een POH-GGZ?',
        answer: 'Een POH-GGZ begeleidt mensen met lichte tot matige psychische klachten in de huisartsenpraktijk via kortdurende behandeling en psychoeducatie.',
      },
      {
        question: 'Welke opleiding heb je nodig voor POH-GGZ?',
        answer: 'Een HBO-achtergrond (verpleegkunde, SPH, psychologie) plus een geaccrediteerde post-HBO POH-GGZ opleiding van 1 jaar.',
      },
    ],
  },

  // ── SPV ───────────────────────────────────────────────────────────────────
  {
    slug: 'spv',
    name: 'Sociaal Psychiatrisch Verpleegkundige (SPV)',
    metaDescription:
      'Alles over het beroep SPV: taken, opleiding, BIG-registratie, salaris CAO GGZ en doorgroeimogelijkheden. Ontdek vacatures.',
    heroBadge: 'HBO – GGZ',
    heroIntro:
      'Als Sociaal Psychiatrisch Verpleegkundige (SPV) begeleid je mensen met psychiatrische stoornissen in hun eigen leefomgeving. Je werkt bij een GGZ-instelling of ACT-team.',
    intro:
      'Een SPV werkt ambulant in de GGZ en biedt behandeling en begeleiding aan mensen met ernstige psychiatrische aandoeningen (EPA). Je werkt nauw samen met psychiaters, psychologen en sociaal werkers in multidisciplinaire teams.',
    sector: 'GGZ',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO-Verpleegkunde + post-HBO Sociaal Psychiatrische Verpleegkunde (2 jaar). BIG-registratie als verpleegkundige vereist.',
    bigRegistration: true,
    averageSalary: '€3.500 – €5.800 bruto p/m',
    workEnvironment: 'GGZ-instelling, ACT-team, FACT-team, RIBW',
    tasks: [
      { title: 'Ambulante begeleiding', description: 'Regelmatig huisbezoek bij cliënten met EPA.' },
      { title: 'Crisisinterventie', description: 'Reageren op psychiatrische crises in de thuissituatie.' },
      { title: 'Medicatiebeheer', description: 'Bewaken van medicatietrouw en bijwerkingen.' },
      { title: 'Multidisciplinair overleg', description: 'Afstemming met psychiater, psycholoog en maatschappelijk werker.' },
    ],
    competencies: [
      'Stressbestendig in crisissituaties',
      'Empathisch met psychiatrisch zieke mensen',
      'Zelfstandig en besluitvaardig',
      'Kennis van psychiatrische ziektebeelden',
    ],
    growthPaths: [
      { title: 'Verpleegkundig Specialist GGZ', description: 'Master-opleiding met uitgebreide behandelbevoegdheden.' },
      { title: 'Teamleider ACT/FACT', description: 'Leidinggevende rol in een ambulant GGZ-team.' },
      { title: 'Opleider SPV', description: 'Lesgeven aan post-HBO opleiding.' },
    ],
    relatedSalarySlug: 'spv',
    relatedCaoSlug: 'ggz',
    relatedEducationSlug: 'spv',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'SPV',
    faqs: [
      {
        question: 'Wat doet een SPV?',
        answer: 'Een SPV biedt ambulante psychiatrische zorg thuis aan mensen met ernstige psychiatrische aandoeningen, inclusief crisisinterventie en medicatiebeheer.',
      },
      {
        question: 'Wat is het verschil tussen SPV en psychiatrisch verpleegkundige?',
        answer: 'Een psychiatrisch verpleegkundige werkt klinisch (op een gesloten afdeling). Een SPV werkt ambulant in de wijk of bij cliënten thuis.',
      },
    ],
  },

  // ── GZ-Psycholoog ─────────────────────────────────────────────────────────
  {
    slug: 'gz-psycholoog',
    name: 'GZ-Psycholoog',
    metaDescription:
      'Alles over het beroep GZ-Psycholoog: taken, post-doctoraal opleiding, BIG-registratie, salaris CAO GGZ en doorgroeimogelijkheden.',
    heroBadge: 'Post-doctoraal – GGZ',
    heroIntro:
      'Als GZ-Psycholoog diagnosticeer en behandel je psychische aandoeningen. Je werkt in de GGZ, ziekenhuis of eerste lijn met een BIG-registratie.',
    intro:
      'Een GZ-Psycholoog heeft een academische opleiding Psychologie gevolgd door een 2-jarige post-doctorale GZ-opleiding. De BIG-registratie is verplicht. Je diagnosticeert DSM-stoornissen en voert evidence-based behandelingen uit zoals CGT.',
    sector: 'GGZ',
    mboHboLevel: 'WO + post-doctoraal',
    opleiding:
      'WO Bachelor + Master Psychologie (5 jaar) + 2-jarige post-doctorale GZ-opleiding (in dienst). BIG-registratie als GZ-Psycholoog vereist.',
    bigRegistration: true,
    averageSalary: '€4.200 – €6.800 bruto p/m',
    workEnvironment: 'GGZ-instelling, ziekenhuis, eerstelijns psychologenpraktijk',
    tasks: [
      { title: 'Psychologisch onderzoek', description: 'Diagnostisch onderzoek via gesprekken en tests.' },
      { title: 'Behandeling uitvoeren', description: 'CGT, EMDR, schematherapie en andere evidence-based methoden.' },
      { title: 'Rapportage', description: 'Behandelverslagen en multidisciplinaire overleggen.' },
      { title: 'Consultatie', description: 'Collega\'s adviseren over complexe casuïstiek.' },
    ],
    competencies: [
      'Analytisch en diagnostisch sterk',
      'Empathisch maar professioneel grenzen bewakend',
      'Schriftelijk vaardig (rapportage)',
      'Evidence-based behandelaar',
    ],
    growthPaths: [
      { title: 'Klinisch Psycholoog', description: 'Verdere specialisatie via post-doctoraal klinisch psycholoog opleiding.' },
      { title: 'Psychotherapeut BIG', description: 'Extra BIG-registratie als psychotherapeut.' },
      { title: 'Hoofdbehandelaar GGZ', description: 'Eindverantwoordelijkheid voor behandeltrajecten.' },
    ],
    relatedSalarySlug: 'gz-psycholoog',
    relatedCaoSlug: 'ggz',
    relatedEducationSlug: 'gz-psycholoog',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'GZ-Psycholoog',
    faqs: [
      {
        question: 'Hoelang duurt de opleiding tot GZ-Psycholoog?',
        answer: 'WO (5 jaar) + 2-jarige post-doctorale GZ-opleiding = minimaal 7 jaar studeren en werken.',
      },
      {
        question: 'Wat verdient een GZ-Psycholoog?',
        answer: 'Gemiddeld €4.200 – €6.800 bruto per maand (CAO GGZ 2026), afhankelijk van ervaring en organisatie.',
      },
      {
        question: 'Wat is het verschil tussen GZ-Psycholoog en Klinisch Psycholoog?',
        answer: 'Een GZ-Psycholoog behandelt breed spectrum GGZ-problematiek. Een Klinisch Psycholoog is verder gespecialiseerd en behandelt complexere ziektebeelden.',
      },
    ],
  },

  // ── Begeleider Gehandicaptenzorg ───────────────────────────────────────────
  {
    slug: 'begeleider-gehandicaptenzorg',
    name: 'Begeleider Gehandicaptenzorg',
    metaDescription:
      'Alles over het beroep begeleider gehandicaptenzorg: taken, MBO-opleiding, salaris CAO Gehandicaptenzorg en doorgroeimogelijkheden.',
    heroBadge: 'MBO niveau 3/4 – Gehandicaptenzorg',
    heroIntro:
      'Als begeleider in de gehandicaptenzorg ondersteuning je mensen met een verstandelijke of lichamelijke beperking bij wonen, werken en dagbesteding.',
    intro:
      'Een begeleider gehandicaptenzorg biedt dagelijkse ondersteuning aan mensen met een beperking. Je werkt in woongroepen, dagbestedingslocaties of ambulant. De functie vereist MBO-3 of MBO-4 en biedt goede doorgroeikansen.',
    sector: 'Gehandicaptenzorg',
    mboHboLevel: 'MBO niveau 3 of 4',
    opleiding:
      'MBO Medewerker Maatschappelijke Zorg (niveau 3 of 4) of MBO Begeleider Specifieke Doelgroepen (niveau 4). Doorstroom HBO SPH mogelijk.',
    bigRegistration: false,
    averageSalary: '€2.700 – €4.200 bruto p/m',
    workEnvironment: 'Woongroep, dagbestedingslocatie, ambulante begeleiding',
    tasks: [
      { title: 'Persoonlijke ondersteuning', description: 'Dagelijkse zorg en begeleiding bij ADL-activiteiten.' },
      { title: 'Activering en dagbesteding', description: 'Begeleiden van werk, dagactiviteiten en vrije tijd.' },
      { title: 'Zorgplan uitvoeren', description: 'Werken volgens het individueel ondersteuningsplan.' },
      { title: 'Samenwerking met netwerk', description: 'Afstemming met familie, arts en gedragsdeskundige.' },
    ],
    competencies: [
      'Geduldig en consequent',
      'Empathisch naar mensen met beperkingen',
      'Stressbestendig bij gedragsproblematiek',
      'Samenwerkingsgericht',
    ],
    growthPaths: [
      { title: 'Persoonlijk Begeleider', description: 'Individuele cliëntverantwoordelijkheid (niveau 4).' },
      { title: 'Gedragsdeskundige', description: 'HBO SPH of WO Pedagogiek doorstroom.' },
      { title: 'Teamleider woongroep', description: 'Leidinggevende rol bij een zorgaanbieder.' },
    ],
    relatedSalarySlug: 'begeleider-gehandicaptenzorg',
    relatedCaoSlug: 'gehandicaptenzorg',
    relatedEducationSlug: 'begeleider-gehandicaptenzorg',
    relatedCaoName: 'CAO Gehandicaptenzorg',
    relatedVacancyProfession: 'Begeleider Gehandicaptenzorg',
    faqs: [
      {
        question: 'Wat doet een begeleider gehandicaptenzorg?',
        answer: 'Een begeleider ondersteunt mensen met verstandelijke of lichamelijke beperkingen bij wonen, dagbesteding en zelfstandigheid.',
      },
      {
        question: 'Welke opleiding heb je nodig?',
        answer: 'MBO niveau 3 (Medewerker Maatschappelijke Zorg) of niveau 4 (Begeleider Specifieke Doelgroepen).',
      },
    ],
  },

  // ── Persoonlijk Begeleider ─────────────────────────────────────────────────
  {
    slug: 'persoonlijk-begeleider',
    name: 'Persoonlijk Begeleider',
    metaDescription:
      'Alles over het beroep persoonlijk begeleider gehandicaptenzorg: taken, opleiding, salaris CAO Gehandicaptenzorg en doorgroeimogelijkheden.',
    heroBadge: 'MBO niveau 4 – Gehandicaptenzorg',
    heroIntro:
      'Als persoonlijk begeleider ben je de vaste contactpersoon voor één of meerdere cliënten met een beperking. Je coördineert de zorg en bent het aanspreekpunt voor familie.',
    intro:
      'Een persoonlijk begeleider (PB) heeft individuele eindverantwoordelijkheid voor een cliënt. Je stelt het ondersteuningsplan op, coördineert de zorg en onderhoudt contact met het netwerk. Functie op MBO-4 of HBO-niveau.',
    sector: 'Gehandicaptenzorg',
    mboHboLevel: 'MBO niveau 4 / HBO',
    opleiding:
      'MBO Begeleider Specifieke Doelgroepen (niveau 4) of HBO SPH. Aanvullende scholing in BOPZ/WVGGZ en gedragsanalyse aanbevolen.',
    bigRegistration: false,
    averageSalary: '€2.900 – €4.600 bruto p/m',
    workEnvironment: 'Woongroep, ambulante begeleiding, dagbesteding',
    tasks: [
      { title: 'Ondersteuningsplan opstellen', description: 'Individueel plan afstemmen op wensen en behoeften van de cliënt.' },
      { title: 'Coördinatie van zorg', description: 'Afstemming met team, familie, medisch en gedragsteam.' },
      { title: 'Evaluatie en bijstelling', description: 'Regelmatig evalueren van doelen en begeleiding.' },
      { title: 'Vertegenwoordiging', description: 'Aanspreekpunt zijn voor ouders en verwanten.' },
    ],
    competencies: [
      'Organisatorisch sterk',
      'Empathisch en gericht op de cliënt',
      'Communicatief met verschillende doelgroepen',
      'Zelfstandig en verantwoordelijk',
    ],
    growthPaths: [
      { title: 'Gedragsdeskundige', description: 'HBO SPH of orthopedagogiek doorstroom.' },
      { title: 'Teamcoördinator', description: 'Coördinerende rol voor een woongroep.' },
      { title: 'Zorgcoördinator', description: 'Overzichtsrol over meerdere cliënten of locaties.' },
    ],
    relatedSalarySlug: 'persoonlijk-begeleider',
    relatedCaoSlug: 'gehandicaptenzorg',
    relatedEducationSlug: 'persoonlijk-begeleider',
    relatedCaoName: 'CAO Gehandicaptenzorg',
    relatedVacancyProfession: 'Persoonlijk Begeleider',
    faqs: [
      {
        question: 'Wat is het verschil tussen persoonlijk begeleider en begeleider?',
        answer: 'Een begeleider werkt met een groep cliënten. Een persoonlijk begeleider is de individuele contactpersoon en coördineert alle zorg voor één cliënt.',
      },
    ],
  },

  // ── Jeugdzorgwerker ────────────────────────────────────────────────────────
  {
    slug: 'jeugdzorgwerker',
    name: 'Jeugdzorgwerker',
    metaDescription:
      'Alles over het beroep jeugdzorgwerker: taken, HBO-opleiding, salaris CAO Jeugdzorg en doorgroeimogelijkheden. Ontdek vacatures.',
    heroBadge: 'HBO – Jeugdzorg',
    heroIntro:
      'Als jeugdzorgwerker begeleid je kinderen en gezinnen in kwetsbare situaties. Je werkt bij jeugdhulpaanbieders, gemeente of gecertificeerde instellingen.',
    intro:
      'Een jeugdzorgwerker biedt hulp aan jongeren en gezinnen bij problemen zoals mishandeling, verwaarlozing, gedragsproblematiek of psychiatrische problematiek. Je werkt in de vrijwillige of gedwongen jeugdhulp en schakelt indien nodig jeugdbescherming in.',
    sector: 'Jeugdzorg',
    mboHboLevel: 'HBO niveau 6',
    opleiding:
      'HBO Social Work, HBO Pedagogiek of HBO SPH (4 jaar). Registratie bij SKJ (Stichting Kwaliteitsregister Jeugd) verplicht voor bepaalde functies.',
    bigRegistration: false,
    averageSalary: '€3.200 – €5.100 bruto p/m',
    workEnvironment: 'Jeugdhulpaanbieder, gecertificeerde instelling, gemeente, residentieel',
    tasks: [
      { title: 'Hulpverleningsplan opstellen', description: 'Doelen formuleren met kind en gezin.' },
      { title: 'Ambulante begeleiding', description: 'Thuisbegeleiding van gezinnen bij opvoedproblematiek.' },
      { title: 'Samenwerking ketenpartners', description: 'Afstemming met school, gemeente en jeugdbescherming.' },
      { title: 'Crisisbegeleiding', description: 'Ingrijpen bij acuut onveilige situaties.' },
    ],
    competencies: [
      'Empathisch en kindgericht',
      'Stressbestendig in complexe gezinssituaties',
      'Juridische basiskennis jeugdwet',
      'Multidisciplinair samenwerken',
    ],
    growthPaths: [
      { title: 'Jeugdbeschermer', description: 'Werken bij gecertificeerde instelling met voogdij of toezicht.' },
      { title: 'Gezinscoach', description: 'Intensieve begeleiding van problematische gezinnen.' },
      { title: 'Gedragswetenschapper', description: 'WO Pedagogiek of Orthopedagogiek doorstroom.' },
    ],
    relatedSalarySlug: 'jeugdzorgwerker',
    relatedCaoSlug: 'jeugdzorg',
    relatedEducationSlug: 'jeugdzorgwerker',
    relatedCaoName: 'CAO Jeugdzorg',
    relatedVacancyProfession: 'Jeugdzorgwerker',
    faqs: [
      {
        question: 'Wat doet een jeugdzorgwerker?',
        answer: 'Een jeugdzorgwerker biedt hulp aan kinderen en gezinnen bij ernstige problemen zoals mishandeling, verwaarlozing of gedragsproblematiek.',
      },
      {
        question: 'Is SKJ-registratie verplicht?',
        answer: 'Voor jeugd- en gezinsprofessionals die werken in de wettelijk verplichte jeugdhuid is SKJ-registratie vereist.',
      },
    ],
  },

  // ── IC-Verpleegkundige ─────────────────────────────────────────────────────
  {
    slug: 'ic-verpleegkundige',
    name: 'IC-Verpleegkundige',
    metaDescription:
      'Alles over het beroep IC-verpleegkundige: taken, post-HBO opleiding, salaris CAO Ziekenhuizen en doorgroeimogelijkheden op de intensive care.',
    heroBadge: 'Post-HBO – Intensive Care',
    heroIntro:
      'Als IC-verpleegkundige verpleeg je patiënten die levensbedreigend ziek zijn op de intensive care, met complexe monitoring, beademing en invasieve interventies.',
    intro:
      'Een IC-verpleegkundige werkt op de Intensive Care (IC) van een ziekenhuis of UMC. Je monitort vitale functies, bedient bewakingsapparatuur, past beademing aan en neemt zelfstandige klinische beslissingen. Een post-HBO specialisatie van 2 jaar is vereist na je HBO-V diploma.',
    sector: 'Ziekenhuizen & UMC',
    mboHboLevel: 'Post-HBO (niveau 6+)',
    opleiding: 'Post-HBO IC-Verpleegkunde (2 jaar, na HBO-V + BIG-registratie).',
    bigRegistration: true,
    averageSalary: '€4.200 – €6.500 bruto p/m',
    workEnvironment: 'Intensive Care, Medium Care, Hartbewaking (ziekenhuis / UMC)',
    tasks: [
      { title: 'Vitale functies monitoren', description: 'Continue bewaking van ECG, arteriële druk, CVD en saturatie.' },
      { title: 'Beademing', description: 'Instellen en aanpassen van beademingsparameters.' },
      { title: 'Invasieve procedures', description: 'Assisteren bij of uitvoeren van centraalveneuze lijnen, drains en katheterisatie.' },
      { title: 'Medicatiebeheer', description: 'Toedienen van inotropica, sedatie en continue infuustherapie.' },
    ],
    competencies: [
      'Stressbestendig en snel besluitvaardig',
      'Technisch vaardig met medische apparatuur',
      'Nauwkeurig in medicatiebeheer',
      'Teamgericht in multidisciplinair IC-team',
    ],
    growthPaths: [
      { title: 'Nurse Practitioner IC', description: 'Master ANP met specialisatie Intensive Care.' },
      { title: 'HEMS-verpleegkundige', description: 'Spoedeisende zorg vanuit helikopter.' },
      { title: 'Coördinator IC', description: 'Leidinggevende rol op de afdeling.' },
    ],
    relatedSalarySlug: 'ic-verpleegkundige',
    relatedCaoSlug: 'ziekenhuizen',
    relatedEducationSlug: 'ic-verpleegkundige',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'IC-Verpleegkundige',
    faqs: [
      {
        question: 'Wat verdient een IC-verpleegkundige?',
        answer: 'Conform CAO Ziekenhuizen FWG 60–65: €4.200 – €6.500 bruto per maand, exclusief ORT-toeslagen voor nacht- en weekenddiensten.',
      },
      {
        question: 'Hoe word ik IC-verpleegkundige?',
        answer: 'Je hebt een HBO-V diploma en BIG-registratie nodig. Daarna volg je de 2-jarige post-HBO opleiding IC-Verpleegkunde naast werk in een ziekenhuis.',
      },
    ],
  },

  // ── Nurse Practitioner ─────────────────────────────────────────────────────
  {
    slug: 'nurse-practitioner',
    name: 'Nurse Practitioner',
    metaDescription:
      'Alles over het beroep Nurse Practitioner (ANP): taken, master-opleiding ANP, salaris, bevoegdheden en doorgroeimogelijkheden in de zorg.',
    heroBadge: 'Master ANP – Zelfstandige zorgverlener',
    heroIntro:
      'Als Nurse Practitioner (NP) werk je zelfstandig naast de arts: je stelt diagnoses, maakt behandelplannen en hebt eigen voorschrijfbevoegdheid.',
    intro:
      'Een Nurse Practitioner is een master-opgeleide verpleegkundige (ANP) met uitgebreide klinische bevoegdheden. Je werkt zelfstandig in ziekenhuizen, huisartsenpraktijken, GGZ of ouderenzorg. De Master ANP duurt 2–3 jaar naast werk.',
    sector: 'Ziekenhuizen & UMC',
    mboHboLevel: 'Master (niveau 7)',
    opleiding: 'Master Advanced Nursing Practice (ANP), 2–3 jaar deeltijd naast HBO-V + BIG-registratie.',
    bigRegistration: true,
    averageSalary: '€4.500 – €7.000 bruto p/m',
    workEnvironment: 'Ziekenhuis, huisartsenpraktijk, GGZ, verpleeghuis, revalidatiecentrum',
    tasks: [
      { title: 'Zelfstandige diagnostiek', description: 'Anamnese afnemen, lichamelijk onderzoek en differentiaaldiagnose.' },
      { title: 'Behandelplan opstellen', description: 'Eigen behandelplannen formuleren en uitvoeren.' },
      { title: 'Voorschrijven', description: 'Geneesmiddelen voorschrijven conform eigen formularium.' },
      { title: 'Klinisch leiderschap', description: 'Aansturing van verpleegkundig team en samenwerking met artsen.' },
    ],
    competencies: [
      'Klinische expertise op masterniveau',
      'Zelfstandig en besluitvaardig',
      'Communicatief sterk met patiënten en artsen',
      'Evidenced-based werken',
    ],
    growthPaths: [
      { title: 'Physician Assistant', description: 'Aanvullende master PA voor bredere medische bevoegdheden.' },
      { title: 'Afdelingshoofd', description: 'Leidinggevende rol binnen een afdeling.' },
      { title: 'Universitair docent / opleider', description: 'Onderwijs geven aan toekomstige NPs.' },
    ],
    relatedSalarySlug: 'nurse-practitioner',
    relatedCaoSlug: 'ziekenhuizen',
    relatedEducationSlug: 'nurse-practitioner',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Nurse Practitioner',
    faqs: [
      {
        question: 'Wat is een Nurse Practitioner?',
        answer: 'Een NP is een master-opgeleide verpleegkundige met eigen diagnostische bevoegdheden, behandelplannen en beperkte voorschrijfbevoegdheid.',
      },
      {
        question: 'Wat verdient een Nurse Practitioner?',
        answer: 'Een NP verdient FWG 65–70 conform CAO Ziekenhuizen: €4.500 – €7.000 bruto per maand, afhankelijk van specialisatie.',
      },
    ],
  },

  // ── OK-Assistent ───────────────────────────────────────────────────────────
  {
    slug: 'ok-assistent',
    name: 'OK-Assistent',
    metaDescription:
      'Alles over het beroep OK-Assistent: taken, MBO-opleiding operatieassistentie, salaris CAO Ziekenhuizen en werken op de operatiekamer.',
    heroBadge: 'MBO niveau 4 – Operatiekamer',
    heroIntro:
      'Als OK-Assistent ondersteun je het chirurgisch team op de operatiekamer: je beheert steriele instrumenten, bereidt de OK voor en assisteert bij ingrepen.',
    intro:
      'Een OK-Assistent werkt op de operatiekamer van een ziekenhuis of zelfstandige kliniek. Je bereidt operaties voor, reikt instrumenten aan, verwerkt steriele materialen en ondersteunt het OK-team. De MBO niveau 4 opleiding duurt 4 jaar.',
    sector: 'Ziekenhuizen & UMC',
    mboHboLevel: 'MBO niveau 4',
    opleiding: 'MBO Operatieassistentie niveau 4 (4 jaar, BBL of BOL).',
    bigRegistration: false,
    averageSalary: '€2.900 – €4.400 bruto p/m',
    workEnvironment: 'Operatiekamer (ziekenhuis, zelfstandige kliniek, UMC)',
    tasks: [
      { title: 'OK voorbereiden', description: 'Operatiekamer en instrumentenset steriel klaarzetten.' },
      { title: 'Instrumenten aanreiken', description: 'Steriel aanreiken van chirurgisch instrumentarium.' },
      { title: 'Sterilisatie', description: 'Materialen verwerken en steriele pakketten beheren.' },
      { title: 'Postoperatieve controle', description: 'Instrumententelling en wondcontrole na afloop.' },
    ],
    competencies: [
      'Nauwkeurig en stressbestendig',
      'Kennis van asepsis en steriele technieken',
      'Teamspeler in dynamische omgeving',
      'Goede motorische vaardigheden',
    ],
    growthPaths: [
      { title: 'OK-Verpleegkundige', description: 'Post-HBO specialisatie voor meer verantwoordelijkheid op de OK.' },
      { title: 'Anesthesiemedewerker', description: 'MBO niveau 4 opleiding voor anesthesie-ondersteuning.' },
      { title: 'Leidinggevende OK', description: 'Coördinerende rol voor de operatiekamers.' },
    ],
    relatedSalarySlug: 'ok-assistent',
    relatedCaoSlug: 'ziekenhuizen',
    relatedEducationSlug: 'ok-assistent',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'OK-Assistent',
    faqs: [
      {
        question: 'Wat doet een OK-Assistent?',
        answer: 'Een OK-Assistent bereidt de operatiekamer voor, beheert steriele instrumenten en ondersteunt het chirurgisch team tijdens operaties.',
      },
      {
        question: 'Wat verdient een OK-Assistent?',
        answer: 'Conform CAO Ziekenhuizen (FWG 45–55) verdient een OK-Assistent €2.900 – €4.400 bruto per maand, exclusief ORT-toeslagen.',
      },
    ],
  },

  // ── Physician Assistant ────────────────────────────────────────────────────
  {
    slug: 'physician-assistant',
    name: 'Physician Assistant',
    metaDescription:
      'Alles over het beroep Physician Assistant: taken, master PA opleiding, bevoegdheden, salaris en doorgroeimogelijkheden naast de arts.',
    heroBadge: 'Master PA – Zelfstandige zorgverlener',
    heroIntro:
      'Als Physician Assistant (PA) werk je zelfstandig naast de arts: je stelt diagnoses, schrijft geneesmiddelen voor en voert voorbehouden handelingen uit.',
    intro:
      'Een Physician Assistant heeft een brede medische bevoegdheid: zelfstandig diagnosticeren, behandelplannen formuleren, geneesmiddelen voorschrijven en voorbehouden handelingen uitvoeren. De Master PA duurt 2 jaar voltijds en vereist een HBO-achtergrond plus werkervaring.',
    sector: 'Ziekenhuizen & UMC',
    mboHboLevel: 'Master (niveau 7)',
    opleiding: 'Master Physician Assistant (2 jaar voltijds, na HBO + minimaal 2 jaar werkervaring).',
    bigRegistration: true,
    averageSalary: '€5.000 – €8.000 bruto p/m',
    workEnvironment: 'Ziekenhuis, huisartsenpraktijk, GGZ, revalidatie, ouderenzorg',
    tasks: [
      { title: 'Diagnostiek', description: 'Zelfstandig anamnese, lichamelijk onderzoek en differentiaaldiagnose.' },
      { title: 'Behandeling', description: 'Behandelplannen opstellen en uitvoeren.' },
      { title: 'Voorschrijven', description: 'Breed geneesmiddelenformularium gebruiken.' },
      { title: 'Voorbehouden handelingen', description: 'Biopten, hechtingen, catheterisatie en overige handelingen uitvoeren.' },
    ],
    competencies: [
      'Brede medische kennis',
      'Zelfstandig en verantwoordelijk',
      'Communicatief vaardig met patiënten en specialisten',
      'Evidenced-based klinisch redeneren',
    ],
    growthPaths: [
      { title: 'Zelfstandig gevestigd PA', description: 'Eigen praktijk of detachering.' },
      { title: 'Afdelingshoofd / zorgmanager', description: 'Leidinggevende rol in de zorginstelling.' },
      { title: 'Klinisch onderzoeker', description: 'Combinatie PA-rol met wetenschappelijk onderzoek.' },
    ],
    relatedSalarySlug: 'physician-assistant',
    relatedCaoSlug: 'ziekenhuizen',
    relatedEducationSlug: 'physician-assistant',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Physician Assistant',
    faqs: [
      {
        question: 'Wat is het verschil tussen een PA en een Nurse Practitioner?',
        answer: 'Een PA heeft bredere medische bevoegdheden (meer voorbehouden handelingen). Een NP heeft een verpleegkundige achtergrond met specialisatie. Beide werken zelfstandig naast de arts.',
      },
      {
        question: 'Wat verdient een Physician Assistant?',
        answer: 'Een PA verdient €5.000 – €8.000 bruto per maand, afhankelijk van specialisatie en sector.',
      },
    ],
  },

  // ── Klinisch Psycholoog ────────────────────────────────────────────────────
  {
    slug: 'klinisch-psycholoog',
    name: 'Klinisch Psycholoog',
    metaDescription:
      'Alles over het beroep Klinisch Psycholoog: taken, post-master opleiding, BIG-registratie, salaris CAO GGZ en doorgroeimogelijkheden.',
    heroBadge: 'Post-master – GGZ',
    heroIntro:
      'Als Klinisch Psycholoog behandel je complexe psychiatrische stoornissen, geef je supervisie aan collega\'s en leid je behandelteams in de GGZ.',
    intro:
      'Een Klinisch Psycholoog is een BIG-geregistreerde specialist die complexe psychiatrische stoornissen behandelt. Je geeft supervisie aan GZ-Psychologen, ontwikkelt behandelprotocollen en werkt in GGZ-instellingen of psychiatrische ziekenhuizen. De post-master specialisatie duurt 3 jaar.',
    sector: 'GGZ',
    mboHboLevel: 'Post-master (niveau 7+)',
    opleiding: 'Post-master Klinische Psychologie (3 jaar, na GZ-Psycholoog BIG-registratie).',
    bigRegistration: true,
    averageSalary: '€5.500 – €9.000 bruto p/m',
    workEnvironment: 'GGZ-instelling, psychiatrisch ziekenhuis, forensische zorg, UMC',
    tasks: [
      { title: 'Complexe diagnostiek', description: 'DSM-diagnostiek bij ernstige psychiatrische stoornissen.' },
      { title: 'Behandeling leiden', description: 'Langdurige psychotherapeutische behandelingen superviseren.' },
      { title: 'Supervisie geven', description: 'Begeleiding van GZ-Psychologen en therapeuten in opleiding.' },
      { title: 'Protocollen ontwikkelen', description: 'Behandelrichtlijnen opstellen en wetenschappelijk toetsen.' },
    ],
    competencies: [
      'Diepgaande klinische expertise',
      'Supervisievaardig en leidinggevend',
      'Wetenschappelijk analytisch',
      'Ethisch en verantwoordelijk in complexe situaties',
    ],
    growthPaths: [
      { title: 'Directeur Behandelzaken', description: 'Leidinggevende rol in GGZ-management.' },
      { title: 'Klinisch onderzoeker', description: 'Combinatie behandelpraktijk en wetenschappelijk onderzoek.' },
      { title: 'Hoogleraar / opleider', description: 'Academische carrière in de klinische psychologie.' },
    ],
    relatedSalarySlug: 'klinisch-psycholoog',
    relatedCaoSlug: 'ggz',
    relatedEducationSlug: 'klinisch-psycholoog',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'Klinisch Psycholoog',
    faqs: [
      {
        question: 'Wat verdient een Klinisch Psycholoog?',
        answer: 'Conform CAO GGZ FWG 70–80: €5.500 – €9.000 bruto per maand, afhankelijk van ervaring en instelling.',
      },
      {
        question: 'Verschil GZ-Psycholoog vs. Klinisch Psycholoog?',
        answer: 'Een GZ-Psycholoog behandelt lichte tot matige problematiek. Een Klinisch Psycholoog heeft een aanvullende post-master en behandelt complexere psychiatrische stoornissen.',
      },
    ],
  },

  // ── Psychotherapeut ────────────────────────────────────────────────────────
  {
    slug: 'psychotherapeut',
    name: 'Psychotherapeut',
    metaDescription:
      'Alles over het beroep psychotherapeut: taken, post-master opleiding, BIG-registratie, salaris CAO GGZ en therapiemethoden.',
    heroBadge: 'Post-master – GGZ',
    heroIntro:
      'Als Psychotherapeut behandel je mensen met ernstige psychische stoornissen via wetenschappelijk onderbouwde therapievormen: CGT, EMDR, schematherapie.',
    intro:
      'Een Psychotherapeut is een BIG-geregistreerde specialist in psychotherapeutische behandeling. Je werkt zelfstandig in de GGZ, RIAGG of eigen praktijk. De post-master opleiding Psychotherapie duurt 4 jaar naast werk en vereist klinische ervaring.',
    sector: 'GGZ',
    mboHboLevel: 'Post-master (niveau 7+)',
    opleiding: 'Post-master Psychotherapie (4 jaar naast werk, na master Psychologie/GZ-Psycholoog).',
    bigRegistration: true,
    averageSalary: '€5.000 – €8.500 bruto p/m',
    workEnvironment: 'GGZ-instelling, RIAGG, zelfstandige praktijk, psychiatrisch ziekenhuis',
    tasks: [
      { title: 'Psychotherapeutische behandeling', description: 'CGT, EMDR, schematherapie en andere methoden toepassen.' },
      { title: 'Diagnostische intake', description: 'DSM-diagnostiek en indicatiestelling voor therapie.' },
      { title: 'Supervisie geven', description: 'Therapeuten in opleiding begeleiden.' },
      { title: 'Dossiervoering', description: 'Behandeldossier bijhouden conform richtlijnen.' },
    ],
    competencies: [
      'Diepgaande therapeutische vaardigheid',
      'Empathisch en analytisch',
      'Supervisievaardig',
      'Ethisch bewust in complexe situaties',
    ],
    growthPaths: [
      { title: 'Klinisch Psycholoog', description: 'Parallelle BIG-registratie via post-master Klinische Psychologie.' },
      { title: 'Zelfstandige praktijk', description: 'Eigen psychotherapiepraktijk starten.' },
      { title: 'Opleider / supervisor', description: 'Toekomstige therapeuten opleiden.' },
    ],
    relatedSalarySlug: 'psychotherapeut',
    relatedCaoSlug: 'ggz',
    relatedEducationSlug: 'psychotherapeut',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'Psychotherapeut',
    faqs: [
      {
        question: 'Wat doet een psychotherapeut?',
        answer: 'Een psychotherapeut behandelt psychische stoornissen via therapie (CGT, EMDR, schematherapie) en werkt zelfstandig in de GGZ of eigen praktijk.',
      },
      {
        question: 'Wat verdient een psychotherapeut?',
        answer: 'Conform CAO GGZ FWG 65–75: €5.000 – €8.500 bruto per maand. Zelfstandig gevestigde therapeuten hanteren een uurtarief van €150–€220.',
      },
    ],
  },

  // ── Kraamverzorgende ───────────────────────────────────────────────────────
  {
    slug: 'kraamverzorgende',
    name: 'Kraamverzorgende',
    metaDescription:
      'Alles over het beroep kraamverzorgende: taken, MBO-opleiding, salaris CAO Kraamzorg en werken bij gezinnen thuis tijdens de kraamperiode.',
    heroBadge: 'MBO niveau 3 – Kraamzorg',
    heroIntro:
      'Als kraamverzorgende bied je postnatale zorg aan moeder en baby in de eerste 8–10 dagen na de bevalling, thuis of in een kraamhotel.',
    intro:
      'Een kraamverzorgende ondersteunt moeder en pasgeborene direct na de bevalling: borstvoeding begeleiden, hygiënische zorg, baby-observatie en lichte huishoudelijke taken. Je werkt voor een kraamzorgorganisatie en rijdt langs bij gezinnen in de regio.',
    sector: 'Kraamzorg',
    mboHboLevel: 'MBO niveau 3',
    opleiding: 'MBO Kraamverzorgende niveau 3 (1–2 jaar, BBL of BOL).',
    bigRegistration: false,
    averageSalary: '€2.600 – €3.800 bruto p/m',
    workEnvironment: 'Kraamzorg thuis, kraamhotel, zorgboerderij',
    tasks: [
      { title: 'Postnatale moederzorg', description: 'Wondverzorging, hygiëne en herstelondersteuning voor de moeder.' },
      { title: 'Babyverzorging', description: 'Baden, voeding en observatie van de pasgeborene.' },
      { title: 'Borstvoedingsbegeleiding', description: 'Aanleggen, frequentie en signalering van problemen.' },
      { title: 'Vroege signalering', description: 'Complicaties herkennen en doorverwijzen naar verloskundige.' },
    ],
    competencies: [
      'Empathisch en zorgzaam',
      'Zelfstandig en mobiel (rijbewijs B)',
      'Goede observatievaardigheden',
      'Kennis van lactatiekunde en neonatologie',
    ],
    growthPaths: [
      { title: 'Verloskundige', description: 'HBO-opleiding Verloskunde (4 jaar).' },
      { title: 'Lactatiekundige', description: 'Aanvullende certificering in borstvoedingsbegeleiding.' },
      { title: 'Teamleider kraamzorg', description: 'Leidinggevende rol binnen een kraamzorgorganisatie.' },
    ],
    relatedSalarySlug: 'kraamverzorgende',
    relatedCaoSlug: 'kraamzorg',
    relatedEducationSlug: 'kraamverzorgende',
    relatedCaoName: 'CAO Kraamzorg',
    relatedVacancyProfession: 'Kraamverzorgende',
    faqs: [
      {
        question: 'Wat doet een kraamverzorgende?',
        answer: 'Een kraamverzorgende verzorgt moeder en baby in de eerste 8–10 dagen na de bevalling: borstvoeding begeleiden, hygiënische zorg en baby-observatie.',
      },
      {
        question: 'Wat verdient een kraamverzorgende?',
        answer: 'Conform CAO Kraamzorg verdient een kraamverzorgende €2.600 – €3.800 bruto per maand (FWG 30–40), exclusief ORT-toeslagen.',
      },
    ],
  },

  // ── Triagist ───────────────────────────────────────────────────────────────
  {
    slug: 'triagist',
    name: 'Triagist',
    metaDescription:
      'Alles over het beroep triagist: taken, opleiding, salaris en werken op de huisartsenpost of spoedpoli als triagist in de eerstelijnszorg.',
    heroBadge: 'MBO niveau 4 – Eerstelijnszorg',
    heroIntro:
      'Als triagist beoordeel je telefonisch en aan de balie de urgentie van zorgvragen op een huisartsenpost (HAP) of spoedafdeling, en je stuurt patiënten naar de juiste zorgverlener.',
    intro:
      'Een triagist werkt op de huisartsenpost (HAP), SEH of spoedpoli. Je beoordeelt de ernst van klachten via telefoon of bij de balie, stelt prioriteiten met gevalideerde triage-instrumenten (Manchester Triage System, NTS) en leidt patiënten naar de juiste hulp. MBO-achtergrond in zorg is vereist.',
    sector: 'Huisartsenzorg',
    mboHboLevel: 'MBO niveau 4',
    opleiding: 'Triage-opleiding / certificeringscursus NTS of MTS (na MBO zorg niveau 3/4).',
    bigRegistration: false,
    averageSalary: '€2.800 – €4.200 bruto p/m',
    workEnvironment: 'Huisartsenpost (HAP), SEH, spoedpoli, callcenter gezondheidszorg',
    tasks: [
      { title: 'Telefonische triage', description: 'Urgentie inschatten via NTS of MTS bij inkomende zorgvragen.' },
      { title: 'Balie-triage', description: 'Patiënten beoordelen bij de balie op spoedigheid van zorg.' },
      { title: 'Doorverwijzen', description: 'Patiënten sturen naar arts, spoedpost of zelfzorgadvies.' },
      { title: 'Dossierregistratie', description: 'Triagegegevens vastleggen in het EPD.' },
    ],
    competencies: [
      'Klinische blik en snelle besluitvorming',
      'Stressbestendig in drukke omgeving',
      'Goede communicatieve vaardigheden',
      'Kennis van triage-protocollen (NTS, MTS)',
    ],
    growthPaths: [
      { title: 'Praktijkondersteuner HAP', description: 'Verdere scholing tot POH of PA in de huisartsenzorg.' },
      { title: 'SEH-verpleegkundige', description: 'Doorstroom naar spoedeisende hulp in het ziekenhuis.' },
      { title: 'Coördinator HAP-triage', description: 'Leidinggevende rol op de triageafdeling.' },
    ],
    relatedSalarySlug: 'triagist',
    relatedCaoSlug: 'huisartsenzorg',
    relatedEducationSlug: 'doktersassistent',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'Triagist',
    faqs: [
      {
        question: 'Wat doet een triagist op een HAP?',
        answer: 'Een triagist beoordeelt de urgentie van zorgvragen (telefonisch en aan de balie) en stuurt patiënten naar de juiste zorgverlener via gevalideerde triage-protocollen.',
      },
      {
        question: 'Welke opleiding heb je nodig als triagist?',
        answer: 'Een MBO-achtergrond in zorg (niveau 3 of 4) is vereist. Daarna volg je een erkende triage-cursus NTS of MTS om gecertificeerd triagist te worden.',
      },
    ],
  },

  // ── Sociaal Werker ─────────────────────────────────────────────────────────
  {
    slug: 'sociaal-werker',
    name: 'Sociaal Werker',
    metaDescription:
      'Alles over het beroep sociaal werker: taken, HBO Social Work opleiding, salaris CAO Sociaal Werk en doorgroeimogelijkheden in welzijn en zorg.',
    heroBadge: 'HBO – Sociaal Werk',
    heroIntro:
      'Als sociaal werker begeleid je mensen bij persoonlijke, sociale en maatschappelijke problemen in wijkteams, schuldhulpverlening, jeugdzorg of maatschappelijke opvang.',
    intro:
      'Een sociaal werker werkt aan zelfredzaamheid en participatie van kwetsbare burgers. Je werkt in wijkteams, buurtcentra, jeugdzorgorganisaties of de schuldhulpverlening. De HBO-opleiding Social Work duurt 4 jaar en heeft een brede instroom.',
    sector: 'Sociaal Werk',
    mboHboLevel: 'HBO niveau 6',
    opleiding: 'HBO Social Work (4 jaar, voltijds, deeltijd of duaal).',
    bigRegistration: false,
    averageSalary: '€2.900 – €4.500 bruto p/m',
    workEnvironment: 'Wijkteam, buurtcentrum, jeugdzorgorganisatie, maatschappelijke opvang, gemeente',
    tasks: [
      { title: 'Cliëntbegeleiding', description: 'Individuele hulpverlening bij persoonlijke en sociale problemen.' },
      { title: 'Groepswerk', description: 'Activiteiten en groepsinterventies organiseren.' },
      { title: 'Schuldhulpverlening', description: 'Budgetbegeleiding en schuldsaneringstrajecten ondersteunen.' },
      { title: 'Ketenoverleg', description: 'Samenwerken met gemeente, woningcorporaties en andere hulpverleners.' },
    ],
    competencies: [
      'Empathisch en mensgericht',
      'Analytisch in complexe sociale situaties',
      'Netwerker en verbinder',
      'Kennis van wet- en regelgeving (WMO, Jeugdwet)',
    ],
    growthPaths: [
      { title: 'Master Social Work', description: 'MSW voor specialisatie en hogere functies.' },
      { title: 'Teamleider sociaal werk', description: 'Leidinggevende rol binnen een wijkteam of organisatie.' },
      { title: 'Beleidsadviseur zorg & welzijn', description: 'Adviesrol bij gemeenten of zorginstellingen.' },
    ],
    relatedSalarySlug: 'sociaal-werker',
    relatedCaoSlug: 'sociaal-werk',
    relatedEducationSlug: 'sociaal-werker',
    relatedCaoName: 'CAO Sociaal Werk',
    relatedVacancyProfession: 'Sociaal Werker',
    faqs: [
      {
        question: 'Wat doet een sociaal werker?',
        answer: 'Een sociaal werker begeleidt mensen bij persoonlijke, sociale en maatschappelijke problemen en werkt aan zelfredzaamheid en participatie.',
      },
      {
        question: 'Wat verdient een sociaal werker?',
        answer: 'Conform CAO Sociaal Werk verdient een sociaal werker €2.900 – €4.500 bruto per maand, afhankelijk van ervaring en functieniveau.',
      },
    ],
  },

  // ── Psychiatrisch Verpleegkundige ─────────────────────────────────────────
  {
    slug: 'psychiatrisch-verpleegkundige',
    name: 'Psychiatrisch Verpleegkundige',
    metaDescription:
      'Alles over het beroep psychiatrisch verpleegkundige (SPV): taken, HBO-V opleiding + GGZ-specialisatie, salaris CAO GGZ en doorgroeimogelijkheden.',
    heroBadge: 'HBO – GGZ',
    heroIntro:
      'Als psychiatrisch verpleegkundige werk je in de GGZ en begeleid je mensen met ernstige psychiatrische aandoeningen (EPA) bij herstel en maatschappelijke participatie.',
    intro:
      'Een psychiatrisch verpleegkundige (ook: SPV – sociaal psychiatrisch verpleegkundige) verleent geestelijke gezondheidszorg aan mensen met psychiatrische stoornissen. Je werkt klinisch, ambulant of in de forensische psychiatrie. HBO-V met GGZ-specialisatie of HBO SPV is vereist.',
    sector: 'GGZ',
    mboHboLevel: 'HBO niveau 6',
    opleiding: 'HBO Verpleegkunde (HBO-V) + GGZ-specialisatie, of HBO Sociaal Psychiatrisch Verpleegkundige (SPV).',
    bigRegistration: true,
    averageSalary: '€3.400 – €5.500 bruto p/m',
    workEnvironment: 'GGZ-instelling, FACT-team, forensische psychiatrie, RIBW, beschermd wonen',
    tasks: [
      { title: 'Psychiatrische observatie', description: 'Toestandsbeeld en risicobeoordeling bij cliënten.' },
      { title: 'Behandelbegeleiding', description: 'Uitvoeren van behandelplannen en medicatietoediening.' },
      { title: 'Crisisinterventie', description: 'Handelen bij psychiatrische crises en suïcidaal gedrag.' },
      { title: 'Rehabilitatie', description: 'Maatschappelijk herstel en participatieondersteuning.' },
    ],
    competencies: [
      'Empathisch in complexe psychiatrische situaties',
      'Kennis van DSM-problematiek',
      'Stressbestendig bij crises',
      'Samenwerken in multidisciplinair GGZ-team',
    ],
    growthPaths: [
      { title: 'SPV (sociaal psychiatrisch verpleegkundige)', description: 'Aanvullende post-HBO specialisatie.' },
      { title: 'GZ-Psycholoog', description: 'Master GZ via post-master GZ-opleiding.' },
      { title: 'Nurse Practitioner GGZ', description: 'Master ANP met GGZ-specialisatie.' },
    ],
    relatedSalarySlug: 'psychiatrisch-verpleegkundige',
    relatedCaoSlug: 'ggz',
    relatedEducationSlug: 'spv',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'Psychiatrisch Verpleegkundige',
    faqs: [
      {
        question: 'Wat is een psychiatrisch verpleegkundige?',
        answer: 'Een psychiatrisch verpleegkundige verleent geestelijke gezondheidszorg aan mensen met psychiatrische stoornissen, zowel klinisch als ambulant.',
      },
      {
        question: 'Wat verdient een psychiatrisch verpleegkundige?',
        answer: 'Conform CAO GGZ verdient een psychiatrisch verpleegkundige €3.400 – €5.500 bruto per maand (FWG 50–65), exclusief ORT-toeslagen.',
      },
    ],
  },
];
