/**
 * Centrale opleidingdata voor ZorgWerkwijzer.
 *
 * Voeg hier een nieuwe opleiding toe om automatisch:
 *  - /opleidingen/[slug]      (via generateStaticParams)
 *  - /opleidingen             (overzichtspagina)
 * te genereren — zonder nieuwe UI-code.
 *
 * Koppelt automatisch naar:
 *  - /beroepen/[relatedProfessionSlug]
 *  - /salaris/[relatedSalarySlug]
 *  - /cao/[relatedCaoSlug]
 *  - /vacatures (via relatedVacancyProfession)
 */

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── Leerweg / opleidingsvorm ─────────────────────────────────────────────────

export interface CourseVariant {
  /** Bijv. "BBL (werkend leren)" of "BOL (voltijds)" */
  label: string;
  /** Duur, bijv. "3–4 jaar" */
  duration: string;
}

// ─── Hoofd-opleidingsdefinitie ────────────────────────────────────────────────

export interface EducationData {
  /** URL-slug, bijv. "verpleegkunde-mbo" → /opleidingen/verpleegkunde-mbo */
  slug: string;
  /** Weergavenaam, bijv. "Verpleegkunde MBO" */
  name: string;
  /** SEO meta description (max 160 tekens) */
  metaDescription: string;
  /** Hero-badge tekst, bijv. "MBO niveau 4" */
  heroBadge: string;
  /** Hero-introductie (1–2 zinnen) */
  heroIntro: string;
  /** Korte intro-paragraaf (max 100 woorden) */
  intro: string;
  /** Opleidingsniveau, bijv. "MBO niveau 4" */
  level: string;
  /** Duur van de opleiding, bijv. "3–4 jaar" */
  duration: string;
  /** Sector/vakgebied, bijv. "Verpleging & Verzorging" */
  sector: string;
  /** Beschikbare leerwegen */
  variants: CourseVariant[];
  /** Vereiste toelating / vooropleiding */
  admissionRequirements: string;
  /** Wat leer je tijdens de opleiding? (bullet-list) */
  learningOutcomes: string[];
  /** Instroom- / doorstroommogelijkheden */
  pathways: string[];
  /** Mogelijke werkgevers / werkomgevingen */
  workEnvironment: string;
  /** Gemiddeld startsalaris na afstuderen */
  startingSalary: string;
  /** Slug van het bijbehorende beroep */
  relatedProfessionSlug: string;
  /** Naam van het bijbehorende beroep */
  relatedProfessionName: string;
  /** Slug van de bijbehorende salarispagina */
  relatedSalarySlug: string;
  /** Slug van de bijbehorende CAO-pagina */
  relatedCaoSlug: string;
  /** Naam van de CAO, bijv. "CAO VVT" */
  relatedCaoName: string;
  /** Beroep-label voor vacaturefilter */
  relatedVacancyProfession: string;
  /** BIG-registratie na afstuderen vereist? */
  bigRegistrationAfter: boolean;
  /** FAQ-items */
  faqs: FaqItem[];
}

// ─── Helper-functies ──────────────────────────────────────────────────────────

export function getEducationData(slug: string): EducationData | undefined {
  return opleidingen.find((o) => o.slug === slug);
}

export function getEducationStaticParams(): { slug: string }[] {
  return opleidingen.map((o) => ({ slug: o.slug }));
}

/** Geeft alle opleidingen voor een bepaalde sector */
export function getOpleidingenBySector(sector: string): EducationData[] {
  return opleidingen.filter((o) => o.sector === sector);
}

/** Geeft alle unieke sectoren */
export function getAllEducationSectors(): string[] {
  return [...new Set(opleidingen.map((o) => o.sector))];
}

/** Geeft alle opleidingen die onder een bepaalde CAO-slug vallen */
export function getOpleidingenByCao(caoSlug: string): EducationData[] {
  return opleidingen.filter((o) => o.relatedCaoSlug === caoSlug);
}

// ─── Opleidingen-register ─────────────────────────────────────────────────────

export const opleidingen: EducationData[] = [
  // ── Verpleegkunde MBO ─────────────────────────────────────────────────────
  {
    slug: 'verpleegkunde-mbo',
    name: 'Verpleegkunde MBO',
    metaDescription:
      'Alles over de MBO-opleiding Verpleegkunde niveau 4: duur, leerwegen, toelating, salaris en beroepsperspectieven. Bekijk vacatures na je diploma.',
    heroBadge: 'MBO niveau 4',
    heroIntro:
      'De MBO-opleiding Verpleegkunde niveau 4 leidt je op tot verpleegkundige in de VVT, ziekenhuizen of thuiszorg. Beschikbaar als BBL (werkend leren) of BOL (voltijds).',
    intro:
      'Met de MBO-opleiding Verpleegkunde (niveau 4) beheers je verpleegkundige zorg, medische handelingen en communicatie met patiënten. Na je diploma ben je BIG-registreerbaar als verpleegkundige niveau 4 en kun je direct aan de slag in vrijwel alle zorgsectoren.',
    level: 'MBO niveau 4',
    duration: '3–4 jaar',
    sector: 'Verpleging & Verzorging',
    variants: [
      { label: 'BBL (werkend leren)', duration: '3–4 jaar' },
      { label: 'BOL (voltijds)', duration: '4 jaar' },
    ],
    admissionRequirements:
      'VMBO-TL diploma of gelijkwaardig. Entree-opleiding of MBO niveau 2 is ook mogelijk als instroomroute.',
    learningOutcomes: [
      'Verpleegkundige zorg verlenen op MBO niveau 4',
      'Voorbehouden handelingen uitvoeren (injecties, katheterisatie)',
      'Zorgplannen opstellen en evalueren',
      'Samenwerken in het multidisciplinaire team',
      'Patiënten en mantelzorgers begeleiden',
      'Werken met elektronische patiëntendossiers (EPD)',
    ],
    pathways: [
      'Doorstroom naar HBO-Verpleegkunde (niveau 6)',
      'Specialisatie tot IC- of SEH-verpleegkundige (post-HBO)',
      'Doorstroom naar Nurse Practitioner (HBO-master)',
    ],
    workEnvironment: 'Verpleeghuis, ziekenhuis, thuiszorg, GGZ, revalidatiecentrum',
    startingSalary: '€3.325 – €4.625 bruto p/m (FWG 45, CAO VVT)',
    relatedProfessionSlug: 'verpleegkundige',
    relatedProfessionName: 'Verpleegkundige',
    relatedSalarySlug: 'verpleegkundige',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Verpleegkundige',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Hoelang duurt de MBO-opleiding Verpleegkunde?',
        answer: 'De opleiding duurt 3–4 jaar. Bij BBL (werkend leren) ga je 4 dagen per week naar de stageplek en 1 dag naar school. Bij BOL (voltijds) werk je meer op school met uitgebreide stagefases.',
      },
      {
        question: 'Kan ik na MBO-Verpleegkunde doorstromen naar HBO?',
        answer: 'Ja. Met een MBO niveau 4 diploma Verpleegkunde kun je doorstromen naar HBO-Verpleegkunde (4 jaar) voor de hogere BIG-registratie niveau 5/6 en uitgebreidere bevoegdheden.',
      },
      {
        question: 'Heb ik een BIG-registratie nodig na mijn MBO-diploma?',
        answer: 'Ja. Na het behalen van je MBO-diploma Verpleegkunde niveau 4 kun je je inschrijven in het BIG-register als verpleegkundige (niveau 4). Dit is vereist om voorbehouden handelingen zelfstandig uit te mogen voeren.',
      },
      {
        question: 'Wat verdient een MBO-verpleegkundige?',
        answer: 'Startsalaris is doorgaans FWG 45 conform CAO VVT: €3.325 – €4.625 bruto per maand (36 uur), exclusief ORT-toeslagen.',
      },
    ],
  },

  // ── Verpleegkunde HBO ─────────────────────────────────────────────────────
  {
    slug: 'verpleegkunde-hbo',
    name: 'Verpleegkunde HBO',
    metaDescription:
      'Alles over de HBO-opleiding Verpleegkunde niveau 6: duur, toelating, beroepsperspectieven en salaris. Word verpleegkundige met uitgebreide bevoegdheden.',
    heroBadge: 'HBO niveau 6',
    heroIntro:
      'De HBO-opleiding Verpleegkunde leidt je op tot verpleegkundige niveau 5/6 met regie over complexe zorg. Meer verantwoordelijkheden en hogere salarisschalen dan MBO.',
    intro:
      'HBO-Verpleegkunde (4 jaar) biedt een breder en dieper curriculum dan MBO. Je leert evidence-based werken, complexe zorg coördineren en hebt uitgebreidere bevoegdheden. Na afstuderen ben je BIG-registreerbaar als verpleegkundige niveau 5/6. Doorstroom naar Nurse Practitioner of Physician Assistant is goed mogelijk.',
    level: 'HBO niveau 6',
    duration: '4 jaar',
    sector: 'Verpleging & Verzorging',
    variants: [
      { label: 'Voltijds HBO', duration: '4 jaar' },
      { label: 'Deeltijd HBO', duration: '4–5 jaar' },
      { label: 'Duaal (met werkend leren)', duration: '4 jaar' },
    ],
    admissionRequirements:
      'HAVO of VWO diploma, of MBO niveau 4 in een relevante richting. Toelatingsonderzoek mogelijk van toepassing.',
    learningOutcomes: [
      'Complexe verpleegkundige zorg zelfstandig regisseren',
      'Evidence-based zorgplanning opstellen en evalueren',
      'Regiefunctie in het multidisciplinaire team',
      'Klinisch redeneren bij complexe patiëntenproblemen',
      'Patiënt- en familiegericht communiceren',
      'Bijdragen aan kwaliteitsverbetering in de zorg',
    ],
    pathways: [
      'Doorstroom naar Nurse Practitioner (master)',
      'Doorstroom naar Physician Assistant (master)',
      'Specialisatie via post-HBO: IC, SEH, Oncologie',
      'Functie als wijkverpleegkundige of SPV',
    ],
    workEnvironment: 'Ziekenhuis, verpleeghuis, thuiszorg, GGZ, huisartsenpraktijk',
    startingSalary: '€3.500 – €5.650 bruto p/m (FWG 50–55, CAO VVT / Ziekenhuizen)',
    relatedProfessionSlug: 'verpleegkundige',
    relatedProfessionName: 'Verpleegkundige',
    relatedSalarySlug: 'verpleegkundige',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Verpleegkundige',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat is het verschil tussen MBO en HBO Verpleegkunde?',
        answer: 'MBO niveau 4 richt zich op uitvoerende zorg. HBO niveau 6 heeft een bredere regiefunctie, meer bevoegdheden bij complexe zorg en hogere salarisschalen (FWG 50–55 vs FWG 45).',
      },
      {
        question: 'Kan ik als MBO-verpleegkundige doorstromen naar HBO?',
        answer: 'Ja. Met een MBO niveau 4 Verpleegkunde-diploma kun je doorstromen naar de HBO-opleiding Verpleegkunde. Veel hogescholen bieden een verkorte route aan voor MBO-gediplomeerden.',
      },
      {
        question: 'Is HBO-Verpleegkunde ook als deeltijd beschikbaar?',
        answer: 'Ja. Veel hogescholen bieden een deeltijdvariant aan voor werkenden. De duur is dan 4–5 jaar. Er is ook een duale variant waarbij je 3 à 4 dagen werkt en 1–2 dagen naar school gaat.',
      },
    ],
  },

  // ── Verzorgende IG ────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    name: 'Verzorgende IG',
    metaDescription:
      'Alles over de MBO-opleiding Verzorgende IG niveau 3: duur, leerwegen, toelating, salaris en beroepsperspectieven. Direct starten in de zorg.',
    heroBadge: 'MBO niveau 3',
    heroIntro:
      'De opleiding Verzorgende IG (Individueel Gerichte Zorg) niveau 3 biedt een praktijkgerichte instap in de zorg. Je leert zelfstandig persoonlijke zorg bieden aan cliënten thuis of in een instelling.',
    intro:
      'Met de MBO-opleiding Verzorgende IG (niveau 3) leer je persoonlijke zorg, begeleiding en eenvoudige verpleegtechnische handelingen uitvoeren. Je werkt zelfstandig bij cliënten thuis of in een woonzorgcentrum. Doorstroom naar MBO niveau 4 Verpleegkunde is een logische vervolgstap.',
    level: 'MBO niveau 3',
    duration: '3 jaar',
    sector: 'Verpleging & Verzorging',
    variants: [
      { label: 'BBL (werkend leren)', duration: '3 jaar' },
      { label: 'BOL (voltijds)', duration: '3 jaar' },
    ],
    admissionRequirements:
      'VMBO-basis, VMBO-kader, VMBO-TL of gelijkwaardig. Entree-opleiding (niveau 1) of MBO niveau 2 ook als instroomroute mogelijk.',
    learningOutcomes: [
      'Persoonlijke verzorging verlenen (wassen, aankleden)',
      'Eenvoudige voorbehouden handelingen uitvoeren',
      'Zelfstandig werken in de thuiszorg',
      'Observeren en rapporteren in het zorgdossier',
      'Omgaan met cognitieve en lichamelijke beperkingen',
    ],
    pathways: [
      'Doorstroom naar MBO niveau 4 Verpleegkunde',
      'Specialisatie in dementiezorg of wondzorg',
      'Doorstroom naar HBO via verkorte route',
    ],
    workEnvironment: 'Thuiszorg, woonzorgcentrum, verpleeghuis',
    startingSalary: '€2.881 – €3.825 bruto p/m (FWG 40, CAO VVT)',
    relatedProfessionSlug: 'verzorgende-ig',
    relatedProfessionName: 'Verzorgende IG',
    relatedSalarySlug: 'verzorgende-ig',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Verzorgende IG',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Hoelang duurt de opleiding Verzorgende IG?',
        answer: 'De opleiding duurt 3 jaar, zowel als BBL (werkend leren) als BOL (voltijds). Bij BBL werk je grotendeels bij een zorgorganisatie.',
      },
      {
        question: 'Heb je een BIG-registratie nodig als Verzorgende IG?',
        answer: 'Nee. Een Verzorgende IG valt niet onder de BIG-wet en heeft geen BIG-registratie nodig.',
      },
      {
        question: 'Kan ik doorstromen naar verpleegkundige?',
        answer: 'Ja. Na je diploma Verzorgende IG (niveau 3) kun je doorstromen naar MBO niveau 4 Verpleegkunde. Bij veel scholen is er een instroomroute die de opleiding verkort.',
      },
    ],
  },

  // ── Helpende Zorg & Welzijn ───────────────────────────────────────────────
  {
    slug: 'helpende-zorg-welzijn',
    name: 'Helpende Zorg & Welzijn',
    metaDescription:
      'Alles over de MBO-opleiding Helpende Zorg & Welzijn niveau 2: instap in de zorg, duur, leerwegen en salaris. Start je carrière in de thuiszorg.',
    heroBadge: 'MBO niveau 2',
    heroIntro:
      'De opleiding Helpende Zorg & Welzijn (niveau 2) is de instappoort naar een carrière in de zorg. Leer huishoudelijke ondersteuning en lichte persoonlijke verzorging bieden aan cliënten.',
    intro:
      'Met de MBO-opleiding Helpende Zorg & Welzijn (niveau 2) leer je cliënten te ondersteunen bij huishoudelijke activiteiten en lichte persoonlijke verzorging. Het is een praktische opleiding met veel werktijd. Doorstroom naar Verzorgende IG (niveau 3) is de meest logische vervolgstap.',
    level: 'MBO niveau 2',
    duration: '2 jaar',
    sector: 'Verpleging & Verzorging',
    variants: [
      { label: 'BBL (werkend leren)', duration: '2 jaar' },
      { label: 'BOL (voltijds)', duration: '2 jaar' },
    ],
    admissionRequirements:
      'VMBO-basis of gelijkwaardig. Entree-opleiding (niveau 1) ook als instroomroute mogelijk.',
    learningOutcomes: [
      'Huishoudelijke ondersteuning bieden (schoonmaken, koken)',
      'Lichte persoonlijke verzorging verlenen',
      'Signaleren van bijzonderheden bij cliënten',
      'Sociale ondersteuning bieden',
      'Rapporteren aan leidinggevende',
    ],
    pathways: [
      'Doorstroom naar Verzorgende IG (MBO niveau 3)',
      'Doorstroom naar Medewerker Maatschappelijke Zorg',
      'Werk als huishoudelijk medewerker in de zorg',
    ],
    workEnvironment: 'Thuiszorg, woonzorgcentrum, dagbesteding',
    startingSalary: '€2.300 – €2.700 bruto p/m (FWG 25, CAO VVT)',
    relatedProfessionSlug: 'helpende',
    relatedProfessionName: 'Helpende',
    relatedSalarySlug: 'helpende',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedVacancyProfession: 'Helpende',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat leer je in de opleiding Helpende Zorg & Welzijn?',
        answer: 'Je leert cliënten te ondersteunen bij dagelijkse activiteiten: schoonmaken, koken, wassen en aankleden. Ook leer je observeren en rapporteren aan je leidinggevende.',
      },
      {
        question: 'Kan ik na Helpende Zorg & Welzijn doorstromen?',
        answer: 'Ja. Na je diploma kun je doorstromen naar MBO niveau 3, zoals de opleiding Verzorgende IG. Daarna is MBO niveau 4 (Verpleegkunde) mogelijk.',
      },
      {
        question: 'Wat verdient een Helpende na de opleiding?',
        answer: 'Startsalaris is conform CAO VVT FWG 25: €2.300 – €2.700 bruto per maand (36 uur), exclusief toeslagen. Doorgroei naar Helpende Plus (FWG 30) is mogelijk via aanvullende scholing.',
      },
    ],
  },

  // ── Fysiotherapie ─────────────────────────────────────────────────────────
  {
    slug: 'fysiotherapie',
    name: 'Fysiotherapie HBO',
    metaDescription:
      'Alles over de HBO-opleiding Fysiotherapie: duur, toelating, specialisaties, salaris en beroepsperspectieven. Ontdek je carrière als fysiotherapeut.',
    heroBadge: 'HBO niveau 6',
    heroIntro:
      'De HBO-opleiding Fysiotherapie (4 jaar) leidt je op tot BIG-geregistreerd fysiotherapeut. Je werkt in een eigen praktijk, ziekenhuis of verpleeghuis en behandelt bewegingsstoornissen.',
    intro:
      'De opleiding Fysiotherapie aan de hogeschool duurt 4 jaar en leidt op tot BIG-geregistreerd fysiotherapeut. Je leert diagnosticeren, behandelen en adviseren bij bewegingsstoornissen. Na afstuderen kun je doorstromen naar diverse post-HBO specialisaties.',
    level: 'HBO niveau 6',
    duration: '4 jaar',
    sector: 'Paramedisch',
    variants: [
      { label: 'Voltijds HBO', duration: '4 jaar' },
      { label: 'Deeltijd HBO', duration: '5–6 jaar' },
    ],
    admissionRequirements:
      'HAVO of VWO, bij voorkeur met biologie en/of wiskunde. MBO niveau 4 in een zorgrichting kan ook als instroomroute dienen.',
    learningOutcomes: [
      'Diagnosticeren van bewegingsstoornissen',
      'Opstellen en uitvoeren van behandelplannen',
      'Manuele therapietechnieken toepassen',
      'Oefentherapie individueel en in groepsverband',
      'Preventieve adviezen geven over houding en ergonomie',
      'Samenwerken met artsen en andere paramedici',
    ],
    pathways: [
      'Post-HBO Manuele Therapie (2–3 jaar)',
      'Post-HBO Sportfysiotherapie',
      'Post-HBO Kinderfysiotherapie',
      'Bekkenfysiotherapie (BIG-geregistreerde specialisatie)',
      'Starten als ZZP-fysiotherapeut',
    ],
    workEnvironment: 'Eigen praktijk, ziekenhuis, verpleeghuis, revalidatiecentrum, sportclub',
    startingSalary: '€3.200 – €5.500 bruto p/m (FWG 50–60, afhankelijk van sector)',
    relatedProfessionSlug: 'fysiotherapeut',
    relatedProfessionName: 'Fysiotherapeut',
    relatedSalarySlug: 'fysiotherapeut',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT / CAO Ziekenhuizen',
    relatedVacancyProfession: 'Fysiotherapeut',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Hoelang duurt de HBO-opleiding Fysiotherapie?',
        answer: 'De voltijdse HBO-opleiding Fysiotherapie duurt 4 jaar. Bij deeltijd kan het 5–6 jaar duren.',
      },
      {
        question: 'Heb ik een BIG-registratie na de opleiding?',
        answer: 'Ja. Na je HBO-diploma Fysiotherapie kun je je inschrijven in het BIG-register als fysiotherapeut. Dit is verplicht om zelfstandig als fysiotherapeut te mogen werken.',
      },
      {
        question: 'Kan een fysiotherapeut als ZZP werken?',
        answer: 'Ja. Veel fysiotherapeuten starten een eigen praktijk of werken als ZZP\'er in een maatschapspraktijk. ZZP-uurtarieven liggen doorgaans op €60 – €100+ per uur.',
      },
      {
        question: 'Welke specialisaties zijn er na de opleiding Fysiotherapie?',
        answer: 'Post-HBO specialisaties zijn onder meer: Manuele Therapie, Sportfysiotherapie, Kinderfysiotherapie, Bekkenfysiotherapie en Geriatriefysiotherapie.',
      },
    ],
  },

  // ── Ergotherapie ──────────────────────────────────────────────────────────
  {
    slug: 'ergotherapie',
    name: 'Ergotherapie HBO',
    metaDescription:
      'Alles over de HBO-opleiding Ergotherapie: duur, toelating, specialisaties en beroepsperspectieven. Word BIG-geregistreerd ergotherapeut.',
    heroBadge: 'HBO niveau 6',
    heroIntro:
      'De HBO-opleiding Ergotherapie (4 jaar) leidt je op tot BIG-geregistreerd ergotherapeut. Je helpt mensen met beperkingen bij het herstel van zelfstandigheid in dagelijkse activiteiten.',
    intro:
      'De opleiding Ergotherapie (HBO, 4 jaar) focust op het verbeteren van het dagelijks functioneren bij mensen met een lichamelijke, cognitieve of psychische beperking. Na afstuderen ben je BIG-geregistreerd en werk je in ziekenhuizen, revalidatiecentra, verpleeghuizen of de GGZ.',
    level: 'HBO niveau 6',
    duration: '4 jaar',
    sector: 'Paramedisch',
    variants: [
      { label: 'Voltijds HBO', duration: '4 jaar' },
      { label: 'Deeltijd HBO', duration: '5 jaar' },
    ],
    admissionRequirements:
      'HAVO of VWO, of MBO niveau 4 in een zorggerelateerde richting.',
    learningOutcomes: [
      'Functioneringsonderzoek uitvoeren bij ADL-beperkingen',
      'Behandelplannen opstellen gericht op zelfstandigheid',
      'Hulpmiddelen adviseren en woningaanpassingen begeleiden',
      'Cognitieve en motorische oefentherapie geven',
      'Multidisciplinair samenwerken in een zorgteam',
      'Preventieve adviezen bij arbeidsergonomie',
    ],
    pathways: [
      'Post-HBO Neurorevalidatie',
      'Post-HBO Arbeidsgerelateerde Ergotherapie',
      'Post-HBO Kinderergotherapie',
      'ZZP-ergotherapeut starten',
    ],
    workEnvironment: 'Ziekenhuis, revalidatiecentrum, verpleeghuis, thuiszorg, GGZ',
    startingSalary: '€3.100 – €5.100 bruto p/m (FWG 50–60, afhankelijk van sector)',
    relatedProfessionSlug: 'ergotherapeut',
    relatedProfessionName: 'Ergotherapeut',
    relatedSalarySlug: 'ergotherapeut',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Ergotherapeut',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat doet een ergotherapeut?',
        answer: 'Een ergotherapeut helpt mensen bij het (her)leren van dagelijkse activiteiten na ziekte, letsel of beperking. Dit via oefentherapie, hulpmiddelen en aanpassing van de omgeving.',
      },
      {
        question: 'Is ergotherapie hetzelfde als fysiotherapie?',
        answer: 'Nee. Fysiotherapeuten richten zich op beweging en pijn. Ergotherapeuten richten zich op het dagelijks functioneren en zelfstandigheid bij beperkingen.',
      },
      {
        question: 'Hoelang duurt de opleiding Ergotherapie?',
        answer: 'De voltijdse HBO-opleiding Ergotherapie duurt 4 jaar. Een deeltijdvariant duurt doorgaans 5 jaar.',
      },
    ],
  },

  // ── Logopedie ─────────────────────────────────────────────────────────────
  {
    slug: 'logopedie',
    name: 'Logopedie HBO',
    metaDescription:
      'Alles over de HBO-opleiding Logopedie: duur, toelating, specialisaties en beroepsperspectieven. Word BIG-geregistreerd logopedist.',
    heroBadge: 'HBO niveau 6',
    heroIntro:
      'De HBO-opleiding Logopedie (4 jaar) leidt je op tot BIG-geregistreerd logopedist. Je behandelt stoornissen in spraak, taal, stem, gehoor en slikken bij kinderen en volwassenen.',
    intro:
      'De opleiding Logopedie (HBO, 4 jaar) leidt op tot logopedist die diagnosticeert en behandelt bij communicatieve stoornissen en slikproblemen. Na afstuderen werk je in een eigen praktijk, school, ziekenhuis of verpleeghuis. BIG-registratie is verplicht.',
    level: 'HBO niveau 6',
    duration: '4 jaar',
    sector: 'Paramedisch',
    variants: [
      { label: 'Voltijds HBO', duration: '4 jaar' },
      { label: 'Deeltijd HBO', duration: '5 jaar' },
    ],
    admissionRequirements:
      'HAVO of VWO. Toelatingsonderzoek op communicatieve vaardigheden mogelijk van toepassing.',
    learningOutcomes: [
      'Diagnosticeren van taal- en spraakstoornissen',
      'Beoordelen van slikfuncties (dysfagie)',
      'Behandeltherapie voor spraak, taal en stem',
      'Ouders, leerkrachten en verzorgenden instrueren',
      'Werken met kinderen én volwassenen',
    ],
    pathways: [
      'Klinisch logopedist (specialisatie ziekenhuis)',
      'Post-HBO Dysfagie',
      'Post-HBO Stotterbehandeling (NVST)',
      'ZZP-logopedist starten',
    ],
    workEnvironment: 'Eigen praktijk, school, ziekenhuis, verpleeghuis, GGZ',
    startingSalary: '€3.000 – €5.000 bruto p/m (FWG 50–60, afhankelijk van sector)',
    relatedProfessionSlug: 'logopedist',
    relatedProfessionName: 'Logopedist',
    relatedSalarySlug: 'logopedist',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Logopedist',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat behandelt een logopedist?',
        answer: 'Stoornissen in spraak, taal, stem, gehoor en slikken bij zowel kinderen als volwassenen.',
      },
      {
        question: 'Is een BIG-registratie verplicht voor logopedisten?',
        answer: 'Ja. Logopedisten zijn BIG-geregistreerd (artikel 3). Herregistratie elke 5 jaar vereist.',
      },
      {
        question: 'Welke specialisaties zijn er na de opleiding Logopedie?',
        answer: 'Post-HBO specialisaties: Dysfagie (slikstoornissen), Stotterbehandeling (NVST), Kindertaalproblematiek en Klinische Logopedie in het ziekenhuis.',
      },
    ],
  },

  // ── Doktersassistent ──────────────────────────────────────────────────────
  {
    slug: 'doktersassistent',
    name: 'Doktersassistent MBO',
    metaDescription:
      'Alles over de MBO-opleiding Doktersassistent niveau 4: duur, leerwegen, toelating, salaris en beroepsperspectieven in de huisartsenzorg.',
    heroBadge: 'MBO niveau 4',
    heroIntro:
      'De MBO-opleiding Doktersassistent (niveau 4) leidt je op voor een centrale rol in de huisartsenpraktijk. Je voert triage uit, assisteert bij consulten en verricht lichte medische handelingen.',
    intro:
      'Met de MBO-opleiding Doktersassistent (niveau 4) leer je triagegesprekken voeren, de huisarts ondersteunen en medische handelingen zoals bloedafname en ECG uitvoeren. Je werkt in een huisartsenpraktijk, gezondheidscentrum of huisartsenpost (HAP). Doorstroom naar POH is mogelijk.',
    level: 'MBO niveau 4',
    duration: '3–4 jaar',
    sector: 'Huisartsenzorg',
    variants: [
      { label: 'BBL (werkend leren)', duration: '3–4 jaar' },
      { label: 'BOL (voltijds)', duration: '4 jaar' },
    ],
    admissionRequirements:
      'VMBO-TL of gelijkwaardig. Bij BBL dien je een stageplaats bij een huisartsenpraktijk te hebben.',
    learningOutcomes: [
      'Telefonische en balie-triage uitvoeren',
      'Medische handelingen: bloedafname, ECG, wondverzorging',
      'Patiëntdossiers bijhouden in het HIS',
      'Recepten en verwijsbrieven verwerken',
      'Consulten voorbereiden voor de huisarts',
    ],
    pathways: [
      'Doorstroom naar Praktijkondersteuner (POH) via post-HBO',
      'Specialisatie Triagist (HAP)',
      'Doorstroom naar HBO-Verpleegkunde',
    ],
    workEnvironment: 'Huisartsenpraktijk, gezondheidscentrum, huisartsenpost (HAP)',
    startingSalary: '€2.600 – €3.800 bruto p/m (CAO Huisartsenzorg)',
    relatedProfessionSlug: 'doktersassistent',
    relatedProfessionName: 'Doktersassistent',
    relatedSalarySlug: 'doktersassistent',
    relatedCaoSlug: 'huisartsenzorg',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'Doktersassistent',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat doet een doktersassistent?',
        answer: 'Een doktersassistent triageert patiënten, assisteert de huisarts en voert lichte medische handelingen uit zoals bloedafname en ECG.',
      },
      {
        question: 'Hoelang duurt de opleiding Doktersassistent?',
        answer: 'De opleiding duurt 3–4 jaar (BBL of BOL). Bij BBL werk je grotendeels in de huisartsenpraktijk.',
      },
      {
        question: 'Kan ik na doktersassistent doorstromen naar POH?',
        answer: 'Ja. Na je MBO-diploma Doktersassistent kun je een post-HBO POH-opleiding volgen (Praktijkondersteuner Huisarts). De duur is ca. 1–2 jaar.',
      },
    ],
  },

  // ── Praktijkondersteuner (POH) ────────────────────────────────────────────
  {
    slug: 'praktijkondersteuner-poh',
    name: 'Praktijkondersteuner (POH)',
    metaDescription:
      'Alles over de post-HBO opleiding Praktijkondersteuner Huisarts (POH): duur, toelating, specialisaties (POH-Somatiek, POH-GGZ) en salaris.',
    heroBadge: 'Post-HBO / HBO niveau 6',
    heroIntro:
      'De post-HBO opleiding Praktijkondersteuner Huisarts (POH) biedt je eigen spreekuren voor chronisch zieke patiënten in de huisartsenpraktijk. Beschikbaar als POH-Somatiek, POH-GGZ of POH-Ouderen.',
    intro:
      'Een Praktijkondersteuner Huisarts (POH) heeft een HBO-achtergrond aangevuld met een post-HBO POH-opleiding (1–2 jaar). Je hebt eigen spreekuren voor chronische aandoeningen zoals diabetes, COPD, hart- en vaatziekten of GGZ-problematiek. Registratie via NHG of ADEPHAGIA is vereist.',
    level: 'Post-HBO (aanvullend op HBO)',
    duration: '1–2 jaar (na HBO)',
    sector: 'Huisartsenzorg',
    variants: [
      { label: 'POH-Somatiek', duration: '1–2 jaar' },
      { label: 'POH-GGZ', duration: '1 jaar' },
      { label: 'POH-Ouderen', duration: '1–2 jaar' },
    ],
    admissionRequirements:
      'HBO-diploma Verpleegkunde, HBO-V, SPH of verwante richting. Werkervaring in de eerste lijn is sterk aanbevolen.',
    learningOutcomes: [
      'Eigen spreekuren voeren voor chronisch zieken',
      'Leefstijladviezen geven (voeding, beweging)',
      'Medicatietrouw bewaken en bijsturen',
      'Risicofactoren monitoren en preventieve zorg bieden',
      'Doorverwijzen naar specialist bij complicaties',
    ],
    pathways: [
      'Senior POH / Coördinator',
      'Nurse Practitioner (HBO-master)',
      'ZZP-POH: zelfstandig in meerdere praktijken',
    ],
    workEnvironment: 'Huisartsenpraktijk, gezondheidscentrum',
    startingSalary: '€3.400 – €5.000 bruto p/m (CAO Huisartsenzorg)',
    relatedProfessionSlug: 'praktijkondersteuner',
    relatedProfessionName: 'Praktijkondersteuner (POH)',
    relatedSalarySlug: 'praktijkondersteuner',
    relatedCaoSlug: 'huisartsenzorg',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'Praktijkondersteuner',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat is het verschil tussen POH-Somatiek en POH-GGZ?',
        answer: 'POH-Somatiek richt zich op lichamelijke chronische aandoeningen (diabetes, COPD). POH-GGZ richt zich op psychische klachten (angst, depressie, burnout).',
      },
      {
        question: 'Welke vooropleiding heb ik nodig voor POH?',
        answer: 'Een HBO-diploma in verpleegkunde, SPH, maatschappelijk werk of een verwante richting. Daarna volg je een geaccrediteerde post-HBO POH-opleiding van 1–2 jaar.',
      },
      {
        question: 'Is een BIG-registratie vereist als POH?',
        answer: 'Als POH met een verpleegkundige achtergrond behoud je je BIG-registratie als verpleegkundige. De POH-titel zelf vereist geen aparte BIG-registratie, maar accreditatie bij NHG of ADEPHAGIA is gebruikelijk.',
      },
    ],
  },

  // ── POH-GGZ ───────────────────────────────────────────────────────────────
  {
    slug: 'poh-ggz',
    name: 'POH-GGZ',
    metaDescription:
      'Alles over de post-HBO opleiding POH-GGZ: duur, toelating, accreditatie en salaris. Begeleid patiënten met psychische klachten in de huisartsenpraktijk.',
    heroBadge: 'Post-HBO GGZ',
    heroIntro:
      'De post-HBO opleiding POH-GGZ leidt je op tot praktijkondersteuner voor de geestelijke gezondheidszorg in de huisartsenpraktijk. Je begeleidt mensen met lichte tot matige psychische klachten.',
    intro:
      'De POH-GGZ opleiding (post-HBO, ca. 1 jaar) biedt een combinatie van CGT-technieken, psychoeducatie en kortdurende behandeling. Accreditatie bij NVVP of ADEPHAGIA is vereist. Je werkt nauw samen met de huisarts en de specialistische GGZ.',
    level: 'Post-HBO (aanvullend op HBO)',
    duration: '1 jaar (na HBO)',
    sector: 'GGZ',
    variants: [
      { label: 'Deeltijd post-HBO', duration: '1 jaar' },
    ],
    admissionRequirements:
      'HBO-diploma in verpleegkunde, SPH, maatschappelijk werk, psychologie of een verwante richting. Affiniteit met de GGZ is vereist.',
    learningOutcomes: [
      'Intake en screening van GGZ-problematiek uitvoeren',
      'Kortdurende CGT-behandeling toepassen',
      'Psychoeducatie geven over klachten en zelfmanagement',
      'Bepalen wanneer verwijzing naar specialistische GGZ nodig is',
      'Werken met DSM-classificatiesysteem',
    ],
    pathways: [
      'GZ-Psycholoog opleiding (WO + post-doctoraal)',
      'Behandelaar in GGZ-instelling',
      'ZZP POH-GGZ in meerdere huisartsenpraktijken',
    ],
    workEnvironment: 'Huisartsenpraktijk, gezondheidscentrum',
    startingSalary: '€3.600 – €5.000 bruto p/m (CAO Huisartsenzorg)',
    relatedProfessionSlug: 'poh-ggz',
    relatedProfessionName: 'POH-GGZ',
    relatedSalarySlug: 'poh-ggz',
    relatedCaoSlug: 'huisartsenzorg',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedVacancyProfession: 'POH-GGZ',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Welke opleiding heb ik nodig voor POH-GGZ?',
        answer: 'Een HBO-achtergrond (verpleegkunde, SPH, psychologie, MWD) aangevuld met een geaccrediteerde post-HBO POH-GGZ opleiding van ca. 1 jaar.',
      },
      {
        question: 'Welke accreditatie is nodig als POH-GGZ?',
        answer: 'Accreditatie bij NVVP (Nederlandse Vereniging voor Psychiatrie) of ADEPHAGIA is gebruikelijk en vereist door veel praktijken en zorgverzekeraars.',
      },
      {
        question: 'Kan ik als POH-GGZ ZZP werken?',
        answer: 'Ja. Veel POH-GGZ professionals werken als ZZP\'er en zijn actief in meerdere huisartsenpraktijken. ZZP-uurtarieven liggen doorgaans op €60 – €90 per uur.',
      },
    ],
  },

  // ── SPV ───────────────────────────────────────────────────────────────────
  {
    slug: 'spv',
    name: 'Sociaal Psychiatrisch Verpleegkundige (SPV)',
    metaDescription:
      'Alles over de post-HBO opleiding SPV (Sociaal Psychiatrisch Verpleegkundige): duur, toelating, BIG-registratie en beroepsperspectieven in de GGZ.',
    heroBadge: 'Post-HBO GGZ',
    heroIntro:
      'De post-HBO opleiding Sociaal Psychiatrisch Verpleegkundige (SPV) leidt je op voor ambulante GGZ. Je begeleid mensen met ernstige psychiatrische aandoeningen in hun eigen omgeving.',
    intro:
      'De post-HBO SPV-opleiding duurt ca. 2 jaar en is bedoeld voor HBO-verpleegkundigen die willen specialiseren in de ambulante GGZ. Je leert psychiatrische diagnostiek, crisisinterventie en casemanagement. Na afronding werk je in ACT- of FACT-teams of bij een RIBW.',
    level: 'Post-HBO (aanvullend op HBO)',
    duration: '2 jaar (na HBO-Verpleegkunde)',
    sector: 'GGZ',
    variants: [
      { label: 'Deeltijd post-HBO', duration: '2 jaar' },
    ],
    admissionRequirements:
      'HBO-diploma Verpleegkunde met BIG-registratie als verpleegkundige (niveau 5/6). Minimaal 1 jaar werkervaring in de GGZ is aanbevolen.',
    learningOutcomes: [
      'Ambulante begeleiding bieden aan EPA-patiënten',
      'Crisisinterventie uitvoeren in de thuissituatie',
      'Medicatiebeheer bewaken',
      'Casemanagement voeren voor complexe cliënten',
      'Multidisciplinair werken in ACT/FACT-teams',
    ],
    pathways: [
      'Verpleegkundig Specialist GGZ (HBO-master)',
      'Teamleider ACT/FACT-team',
      'Opleider SPV',
    ],
    workEnvironment: 'GGZ-instelling, ACT-team, FACT-team, RIBW',
    startingSalary: '€3.800 – €5.800 bruto p/m (FWG 55–65, CAO GGZ)',
    relatedProfessionSlug: 'spv',
    relatedProfessionName: 'Sociaal Psychiatrisch Verpleegkundige (SPV)',
    relatedSalarySlug: 'spv',
    relatedCaoSlug: 'ggz',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'SPV',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Welke vooropleiding heb ik nodig voor de SPV-opleiding?',
        answer: 'HBO-diploma Verpleegkunde met BIG-registratie als verpleegkundige niveau 5/6. Ervaring in de GGZ is sterk aanbevolen.',
      },
      {
        question: 'Hoelang duurt de SPV-opleiding?',
        answer: 'De post-HBO SPV-opleiding duurt ca. 2 jaar in deeltijd. Je werkt doorgaans als verpleegkundige terwijl je de opleiding volgt.',
      },
      {
        question: 'Wat is het verschil tussen SPV en psychiatrisch verpleegkundige?',
        answer: 'Een SPV werkt ambulant (bij mensen thuis of in de wijk). Een psychiatrisch verpleegkundige werkt klinisch (in een instelling op een gesloten afdeling).',
      },
    ],
  },

  // ── GZ-Psycholoog ─────────────────────────────────────────────────────────
  {
    slug: 'gz-psycholoog',
    name: 'GZ-Psycholoog',
    metaDescription:
      'Alles over de post-master opleiding GZ-Psycholoog: WO Psychologie + 2-jarige post-doctorale opleiding, BIG-registratie en beroepsperspectieven in de GGZ.',
    heroBadge: 'WO + Post-doctoraal',
    heroIntro:
      'De post-doctorale opleiding GZ-Psycholoog (2 jaar, na WO Psychologie) leidt je op tot BIG-geregistreerd psycholoog die zelfstandig psychodiagnostiek en behandelingen uitvoert.',
    intro:
      'De GZ-opleiding (2 jaar, in dienst bij een erkende instelling) volg je na het afronden van een WO Bachelor + Master Psychologie (5 jaar). Na afronding ben je BIG-geregistreerd als GZ-Psycholoog (BIG-I) en mag je zelfstandig DSM-stoornissen diagnosticeren en behandelen.',
    level: 'Post-doctoraal (WO + 2 jaar in dienst)',
    duration: '2 jaar post-doctoraal (na WO)',
    sector: 'GGZ',
    variants: [
      { label: 'Postdoctorale GZ-opleiding (voltijd, in dienst)', duration: '2 jaar' },
    ],
    admissionRequirements:
      'WO Master Psychologie (afgerond). Selectieprocedure via opleidingsinstellingen; beschikbaarheid opleidingsplaatsen is beperkt.',
    learningOutcomes: [
      'Zelfstandig psychologisch onderzoek uitvoeren',
      'DSM-stoornissen diagnosticeren',
      'Evidence-based behandelingen uitvoeren: CGT, EMDR, schematherapie',
      'Behandelverslagen schrijven en MDO voeren',
      'Collega\'s consulteren over complexe casuïstiek',
    ],
    pathways: [
      'Klinisch Psycholoog (BIG-II, 3 jaar aanvullende specialisatie)',
      'Psychotherapeut BIG (BIG-II)',
      'Hoofdbehandelaar GGZ',
      'Zelfstandige GGZ-praktijk (1e lijn)',
    ],
    workEnvironment: 'GGZ-instelling, ziekenhuis, eerstelijns psychologenpraktijk',
    startingSalary: '€4.400 – €6.500 bruto p/m (FWG 60–70, CAO GGZ)',
    relatedProfessionSlug: 'gz-psycholoog',
    relatedProfessionName: 'GZ-Psycholoog',
    relatedSalarySlug: 'gz-psycholoog',
    relatedCaoSlug: 'ggz',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'GZ-Psycholoog',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Hoelang duurt de totale opleiding tot GZ-Psycholoog?',
        answer: 'WO Bachelor + Master Psychologie (5 jaar) + post-doctorale GZ-opleiding (2 jaar, in dienst) = minimaal 7 jaar.',
      },
      {
        question: 'Hoe kom ik aan een opleidingsplaats als GZ-Psycholoog?',
        answer: 'Opleidingsplaatsen zijn beperkt en worden verdeeld via een gecentraliseerde matching. Je solliciteert bij erkende instellingen en wordt geselecteerd op basis van cijfers en motivatie.',
      },
      {
        question: 'Wat verdient een GZ-Psycholoog?',
        answer: 'Gemiddeld €4.400 – €6.800 bruto per maand (CAO GGZ 2026), afhankelijk van ervaring en organisatie.',
      },
      {
        question: 'Wat is het verschil tussen GZ-Psycholoog en Klinisch Psycholoog?',
        answer: 'Een GZ-Psycholoog behandelt breed spectrum GGZ-problematiek (BIG-I). Een Klinisch Psycholoog heeft een aanvullende specialisatie (BIG-II) voor complexere ziektebeelden.',
      },
    ],
  },

  // ── Jeugdzorgwerker ───────────────────────────────────────────────────────
  {
    slug: 'jeugdzorgwerker',
    name: 'Jeugdzorgwerker HBO',
    metaDescription:
      'Alles over de HBO-opleiding Jeugdzorgwerker (Social Work / SPH): duur, toelating, SKJ-registratie en beroepsperspectieven in de jeugdzorg.',
    heroBadge: 'HBO niveau 6',
    heroIntro:
      'De HBO-opleiding Social Work of SPH leidt je op als jeugdzorgwerker. Je begeleidt kinderen en gezinnen in kwetsbare situaties in de vrijwillige en gedwongen jeugdhulp.',
    intro:
      'Een jeugdzorgwerker heeft doorgaans een HBO-diploma Social Work, HBO Pedagogiek of HBO SPH (4 jaar). Je werkt in de jeugdhulp bij gecertificeerde instellingen, gemeenten of residentiële voorzieningen. SKJ-registratie is voor bepaalde functies verplicht.',
    level: 'HBO niveau 6',
    duration: '4 jaar',
    sector: 'Jeugdzorg',
    variants: [
      { label: 'Voltijds HBO Social Work', duration: '4 jaar' },
      { label: 'Voltijds HBO SPH', duration: '4 jaar' },
      { label: 'Deeltijd HBO', duration: '4–5 jaar' },
    ],
    admissionRequirements:
      'HAVO of VWO, of MBO niveau 4 in sociale richting. Affiniteit met kinderen en gezinnen is vereist.',
    learningOutcomes: [
      'Hulpverleningsplan opstellen met kind en gezin',
      'Ambulante thuisbegeleiding bieden',
      'Samenwerken met school, gemeente en jeugdbescherming',
      'Omgaan met juridische kaders (Jeugdwet)',
      'Crisisbegeleiding bij acuut onveilige situaties',
    ],
    pathways: [
      'Jeugdbeschermer bij gecertificeerde instelling',
      'Gezinscoach',
      'Doorstroom naar WO Pedagogiek / Orthopedagogiek',
      'SKJ-registratie als jeugd- en gezinsprofessional',
    ],
    workEnvironment: 'Jeugdhulpaanbieder, gecertificeerde instelling, gemeente, residentieel',
    startingSalary: '€3.000 – €4.500 bruto p/m (CAO Jeugdzorg)',
    relatedProfessionSlug: 'jeugdzorgwerker',
    relatedProfessionName: 'Jeugdzorgwerker',
    relatedSalarySlug: 'jeugdzorgwerker',
    relatedCaoSlug: 'jeugdzorg',
    relatedCaoName: 'CAO Jeugdzorg',
    relatedVacancyProfession: 'Jeugdzorgwerker',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Welke HBO-opleiding kan ik volgen voor jeugdzorg?',
        answer: 'De meest gebruikte routes zijn HBO Social Work, HBO SPH (Sociaal Pedagogische Hulpverlening) of HBO Pedagogiek. Alle leiden op tot jeugdzorgwerker.',
      },
      {
        question: 'Is SKJ-registratie verplicht?',
        answer: 'Voor jeugd- en gezinsprofessionals die werken in de wettelijk verplichte jeugdhulp is SKJ-registratie vereist. Dit is een kwaliteitsregister, geen BIG-registratie.',
      },
      {
        question: 'Wat verdient een jeugdzorgwerker?',
        answer: 'Gemiddeld €3.000 – €4.500 bruto per maand (CAO Jeugdzorg 2026), afhankelijk van opleiding en ervaring.',
      },
    ],
  },

  // ── Begeleider Gehandicaptenzorg ──────────────────────────────────────────
  {
    slug: 'begeleider-gehandicaptenzorg',
    name: 'Begeleider Gehandicaptenzorg',
    metaDescription:
      'Alles over de MBO-opleiding Begeleider Gehandicaptenzorg (niveau 3/4): duur, leerwegen, toelating, salaris en beroepsperspectieven.',
    heroBadge: 'MBO niveau 3 of 4',
    heroIntro:
      'De MBO-opleiding Begeleider Gehandicaptenzorg (niveau 3 of 4) leidt je op voor dagelijkse ondersteuning van mensen met een beperking in woongroepen, dagbesteding of ambulant.',
    intro:
      'Met de MBO-opleiding Medewerker Maatschappelijke Zorg (niveau 3) of Begeleider Specifieke Doelgroepen (niveau 4) leer je mensen met verstandelijke of lichamelijke beperkingen te ondersteunen bij wonen, werken en dagbesteding. Doorstroom naar HBO SPH is mogelijk.',
    level: 'MBO niveau 3 of 4',
    duration: '2–3 jaar',
    sector: 'Gehandicaptenzorg',
    variants: [
      { label: 'MBO Medewerker Maatschappelijke Zorg (niveau 3) BBL', duration: '3 jaar' },
      { label: 'MBO Begeleider Specifieke Doelgroepen (niveau 4) BBL', duration: '3–4 jaar' },
      { label: 'BOL (voltijds)', duration: '2–3 jaar' },
    ],
    admissionRequirements:
      'VMBO-basis of VMBO-TL, afhankelijk van het niveau. Niveau 4 vereist VMBO-TL of MBO niveau 3.',
    learningOutcomes: [
      'Persoonlijke ondersteuning bieden bij ADL-activiteiten',
      'Dagbesteding en activering begeleiden',
      'Werken volgens het individueel ondersteuningsplan',
      'Omgaan met gedragsproblematiek',
      'Afstemmen met familie, arts en gedragsdeskundige',
    ],
    pathways: [
      'Persoonlijk Begeleider (niveau 4)',
      'Doorstroom naar HBO SPH',
      'Gedragsdeskundige (WO Pedagogiek)',
      'Teamleider woongroep',
    ],
    workEnvironment: 'Woongroep, dagbestedingslocatie, ambulante begeleiding',
    startingSalary: '€2.800 – €4.200 bruto p/m (FWG 35–45, CAO Gehandicaptenzorg)',
    relatedProfessionSlug: 'begeleider-gehandicaptenzorg',
    relatedProfessionName: 'Begeleider Gehandicaptenzorg',
    relatedSalarySlug: 'begeleider-gehandicaptenzorg',
    relatedCaoSlug: 'gehandicaptenzorg',
    relatedCaoName: 'CAO Gehandicaptenzorg',
    relatedVacancyProfession: 'Begeleider Gehandicaptenzorg',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat is het verschil tussen niveau 3 en niveau 4 in de gehandicaptenzorg?',
        answer: 'Niveau 3 (Medewerker Maatschappelijke Zorg) richt zich op dagelijkse begeleiding. Niveau 4 (Begeleider Specifieke Doelgroepen) heeft meer verantwoordelijkheid, inclusief individuele cliëntverantwoordelijkheid.',
      },
      {
        question: 'Kan ik doorstromen naar HBO na de opleiding Begeleider Gehandicaptenzorg?',
        answer: 'Ja. Met een MBO niveau 4 diploma kun je doorstromen naar HBO SPH of HBO Social Work voor een verdere carrière als gedragsdeskundige of coördinator.',
      },
      {
        question: 'Welke CAO geldt voor begeleiders in de gehandicaptenzorg?',
        answer: 'De CAO Gehandicaptenzorg is van toepassing bij erkende instellingen voor mensen met verstandelijke, lichamelijke of meervoudige beperkingen.',
      },
    ],
  },

  // ── Persoonlijk Begeleider ────────────────────────────────────────────────
  {
    slug: 'persoonlijk-begeleider',
    name: 'Persoonlijk Begeleider',
    metaDescription:
      'Alles over de opleiding Persoonlijk Begeleider (MBO niveau 4 / HBO SPH): duur, toelating, salaris en beroepsperspectieven in de gehandicaptenzorg.',
    heroBadge: 'MBO niveau 4 / HBO',
    heroIntro:
      'Als persoonlijk begeleider ben je de vaste contactpersoon voor cliënten met een beperking. Je stelt het ondersteuningsplan op en coördineert alle zorg rond één cliënt.',
    intro:
      'De opleiding tot Persoonlijk Begeleider (PB) kan via MBO niveau 4 Begeleider Specifieke Doelgroepen of HBO SPH. Als PB heb je individuele eindverantwoordelijkheid voor een cliënt: je stelt het ondersteuningsplan op en bent het aanspreekpunt voor familie en het zorgteam.',
    level: 'MBO niveau 4 / HBO niveau 6',
    duration: '3–4 jaar (MBO) of 4 jaar (HBO)',
    sector: 'Gehandicaptenzorg',
    variants: [
      { label: 'MBO Begeleider Specifieke Doelgroepen (niveau 4)', duration: '3–4 jaar' },
      { label: 'HBO SPH (Sociaal Pedagogische Hulpverlening)', duration: '4 jaar' },
    ],
    admissionRequirements:
      'VMBO-TL voor MBO niveau 4. HAVO of VWO voor HBO SPH, of MBO niveau 4.',
    learningOutcomes: [
      'Individueel ondersteuningsplan (IOP) opstellen',
      'Cliëntverantwoordelijkheid dragen voor één cliënt',
      'Afstemmen met familie, arts en gedragsteam',
      'Doelen evalueren en begeleiding bijstellen',
      'Vertegenwoordiging van cliënten bij beslissingen',
    ],
    pathways: [
      'Gedragsdeskundige (HBO SPH of WO Orthopedagogiek)',
      'Teamcoördinator woongroep',
      'Zorgcoördinator (overzicht meerdere cliënten)',
    ],
    workEnvironment: 'Woongroep, ambulante begeleiding, dagbesteding',
    startingSalary: '€3.000 – €4.500 bruto p/m (FWG 40–50, CAO Gehandicaptenzorg)',
    relatedProfessionSlug: 'persoonlijk-begeleider',
    relatedProfessionName: 'Persoonlijk Begeleider',
    relatedSalarySlug: 'persoonlijk-begeleider',
    relatedCaoSlug: 'gehandicaptenzorg',
    relatedCaoName: 'CAO Gehandicaptenzorg',
    relatedVacancyProfession: 'Persoonlijk Begeleider',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat doet een persoonlijk begeleider?',
        answer: 'Een persoonlijk begeleider is de individuele contactpersoon voor een cliënt met een beperking. Je stelt het zorgplan op, coördineert de zorg en bent het aanspreekpunt voor ouders en verwanten.',
      },
      {
        question: 'Wat is het verschil tussen persoonlijk begeleider en begeleider?',
        answer: 'Een begeleider werkt met een groep cliënten. Een persoonlijk begeleider heeft een vaste individuele koppeling aan één cliënt en draagt verantwoordelijkheid voor zijn of haar totale zorgplan.',
      },
      {
        question: 'Kan ik als persoonlijk begeleider doorgroeien?',
        answer: 'Ja. Via HBO SPH of WO Orthopedagogiek kun je doorgroeien naar gedragsdeskundige of teamcoördinator.',
      },
    ],
  },

  // ── IC-Verpleegkundige (Intensive Care) ───────────────────────────────────
  {
    slug: 'ic-verpleegkundige',
    name: 'IC-Verpleegkundige',
    metaDescription:
      'Alles over de post-HBO opleiding IC-Verpleegkundige: toelating, duur, specialisatiemodules, salaris en beroepsperspectieven op de intensive care.',
    heroBadge: 'Post-HBO specialisatie',
    heroIntro:
      'De opleiding tot IC-Verpleegkundige is een intensieve post-HBO specialisatie voor verpleegkundigen die willen werken op de intensive care van een ziekenhuis of UMC.',
    intro:
      'Na je HBO-V opleiding kun je doorstromen naar de post-HBO specialisatie Intensive Care Verpleegkunde. Je leert patiënten te verplegen die levensbedreigend ziek zijn, met complexe monitoring, beademing en invasieve interventies. De opleiding duurt 2 jaar en wordt gevolgd naast werk.',
    level: 'Post-HBO (niveau 6+)',
    duration: '2 jaar',
    sector: 'Ziekenhuizen & UMC',
    variants: [
      { label: 'Post-HBO IC (deeltijd, naast werk)', duration: '2 jaar' },
      { label: 'Verkorte route (bij aantoonbare IC-ervaring)', duration: '18 maanden' },
    ],
    admissionRequirements:
      'HBO-V diploma + BIG-registratie als verpleegkundige. Werkzaam in een ziekenhuis of UMC.',
    learningOutcomes: [
      'Bewakingsapparatuur interpreteren (ECG, arterieel, CVD)',
      'Beademing instellen en monitoren',
      'Invasieve procedures assisteren en uitvoeren',
      'Complexe medicatie (inotropica, sedatie) beheren',
      'Snelle klinische beslissingen nemen bij verslechtering',
    ],
    pathways: [
      'Nurse Practitioner IC',
      'Coördinator IC-team',
      'Opleider / praktijkbegeleider',
      'HEMS-verpleegkundige (helikopterzorg)',
    ],
    workEnvironment: 'Intensive Care, Medium Care, Hartbewaking (ziekenhuis / UMC)',
    startingSalary: '€4.200 – €6.500 bruto p/m (FWG 60–65, CAO Ziekenhuizen)',
    relatedProfessionSlug: 'ic-verpleegkundige',
    relatedProfessionName: 'IC-Verpleegkundige',
    relatedSalarySlug: 'ic-verpleegkundige',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'IC-Verpleegkundige',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat verdient een IC-verpleegkundige?',
        answer: 'Een IC-verpleegkundige verdient conform CAO Ziekenhuizen FWG 60–65: €4.200 – €6.500 bruto per maand. Onregelmatigheids­toeslagen (ORT) bij nacht- en weekenddiensten komen daar nog bovenop.',
      },
      {
        question: 'Hoe lang duurt de opleiding tot IC-verpleegkundige?',
        answer: 'De post-HBO opleiding IC-Verpleegkunde duurt 2 jaar (deeltijd, naast werk). Voor verpleegkundigen met aantoonbare IC-ervaring bestaat soms een verkorte route van 18 maanden.',
      },
      {
        question: 'Is een BIG-registratie vereist voor de opleiding?',
        answer: 'Ja. Je moet al geregistreerd zijn als verpleegkundige (BIG) en werkzaam zijn in een ziekenhuis of UMC om te worden toegelaten tot de IC-specialisatie.',
      },
    ],
  },

  // ── Nurse Practitioner ────────────────────────────────────────────────────
  {
    slug: 'nurse-practitioner',
    name: 'Nurse Practitioner',
    metaDescription:
      'Opleiding Nurse Practitioner (Master ANP): toelating, duur, bevoegdheden, salaris en carrièreperspectief als advanced-practice verpleegkundige.',
    heroBadge: 'Master ANP (niveau 7)',
    heroIntro:
      'De Master Advanced Nursing Practice (ANP) leidt verpleegkundigen op tot Nurse Practitioner: een zelfstandig werkende zorgprofessional met eigen voorschrijfbevoegdheid.',
    intro:
      'Als Nurse Practitioner (NP) ben je een HBO-V verpleegkundige met een master ANP die zelfstandig diagnoses stelt, behandelplannen opstelt en beperkte voorschrijfbevoegdheid heeft. Je werkt naast artsen in ziekenhuizen, huisartsenpraktijken, ggz en ouderenzorg.',
    level: 'Master (niveau 7)',
    duration: '2–3 jaar (deeltijd)',
    sector: 'Ziekenhuizen & UMC',
    variants: [
      { label: 'Master ANP deeltijd (naast werk)', duration: '2–3 jaar' },
    ],
    admissionRequirements:
      'HBO-V + BIG-registratie + minimaal 2 jaar werkervaring in de relevante specialisatie.',
    learningOutcomes: [
      'Zelfstandig anamnese afnemen en lichamelijk onderzoek uitvoeren',
      'Differentiaaldiagnose opstellen',
      'Behandelplan formuleren en uitvoeren',
      'Geneesmiddelen voorschrijven (beperkt formularium)',
      'Klinisch leiderschap tonen en team aansturen',
    ],
    pathways: [
      'Physician Assistant (aanvullende master)',
      'Afdelingshoofd / zorgmanager',
      'Opleider / universitair docent',
      'Zelfstandig gevestigd NP',
    ],
    workEnvironment: 'Ziekenhuis, huisartsenpraktijk, GGZ, verpleeghuis, revalidatiecentrum',
    startingSalary: '€4.500 – €7.000 bruto p/m (FWG 65–70, CAO Ziekenhuizen)',
    relatedProfessionSlug: 'nurse-practitioner',
    relatedProfessionName: 'Nurse Practitioner',
    relatedSalarySlug: 'nurse-practitioner',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Nurse Practitioner',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat is een Nurse Practitioner?',
        answer: 'Een Nurse Practitioner is een master-opgeleide verpleegkundige (ANP) met uitgebreide klinische bevoegdheden: zelfstandig diagnoses stellen, behandelplannen opzetten en beperkt geneesmiddelen voorschrijven.',
      },
      {
        question: 'Wat verdient een Nurse Practitioner?',
        answer: 'Een NP verdient conform CAO Ziekenhuizen FWG 65–70: €4.500 – €7.000 bruto per maand, afhankelijk van specialisatie en ervaring.',
      },
      {
        question: 'Wat is het verschil tussen een Nurse Practitioner en een Physician Assistant?',
        answer: 'Beide zijn advanced-practice professionals. Een NP heeft een verpleegkundige achtergrond (HBO-V + Master ANP). Een PA heeft een medische achtergrond (HBO Paramedisch + Master PA) en heeft bredere bevoegdheden voor medische handelingen.',
      },
    ],
  },

  // ── OK-Assistent ──────────────────────────────────────────────────────────
  {
    slug: 'ok-assistent',
    name: 'OK-Assistent',
    metaDescription:
      'Alles over de MBO-opleiding OK-Assistent (Operatieassistentie niveau 4): duur, leerwegen, toelating, salaris en werken op de operatiekamer.',
    heroBadge: 'MBO niveau 4',
    heroIntro:
      'De opleiding OK-Assistent (Operatieassistentie niveau 4) leidt je op voor ondersteuning van chirurgen en OK-verpleegkundigen in de operatiekamer.',
    intro:
      'Als OK-Assistent bereid je operaties voor, reik je instrumenten aan, verwerk je steriele materialen en ondersteun je het OK-team. De MBO niveau 4 opleiding duurt 4 jaar (BBL of BOL) en geeft toegang tot de OK in ziekenhuizen en klinieken.',
    level: 'MBO niveau 4',
    duration: '4 jaar',
    sector: 'Ziekenhuizen & UMC',
    variants: [
      { label: 'BBL (werkend leren)', duration: '4 jaar' },
      { label: 'BOL (voltijds)', duration: '4 jaar' },
    ],
    admissionRequirements:
      'VMBO-TL, HAVO of MBO niveau 3. Goede motoriek en stressbestendigheid zijn vereist.',
    learningOutcomes: [
      'Steriele werkwijze toepassen (asepsis, antisepsis)',
      'OK-instrumenten aanreiken en beheren',
      'Operatiekamer voorbereiden en nabehandelen',
      'Postoperatieve controles uitvoeren',
      'Samenwerken in multidisciplinair OK-team',
    ],
    pathways: [
      'OK-Verpleegkundige (post-HBO)',
      'Anesthesiemedewerker (MBO niveau 4)',
      'Instrumentatietechnicus',
      'Leidinggevende OK-afdeling',
    ],
    workEnvironment: 'Operatiekamer (ziekenhuis, zelfstandige kliniek, UMC)',
    startingSalary: '€2.900 – €4.400 bruto p/m (FWG 45–55, CAO Ziekenhuizen)',
    relatedProfessionSlug: 'ok-assistent',
    relatedProfessionName: 'OK-Assistent',
    relatedSalarySlug: 'ok-assistent',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'OK-Assistent',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat doet een OK-Assistent?',
        answer: 'Een OK-Assistent bereidt de operatiekamer voor, beheert steriele materialen en instrumenten, en ondersteunt het chirurgisch team tijdens operaties.',
      },
      {
        question: 'Wat verdient een OK-Assistent?',
        answer: 'Conform CAO Ziekenhuizen (FWG 45–55) verdient een OK-Assistent €2.900 – €4.400 bruto per maand, exclusief ORT-toeslagen voor nacht- en weekenddiensten.',
      },
      {
        question: 'Kan ik doorgroeien na de opleiding OK-Assistent?',
        answer: 'Ja. Na de MBO-opleiding kun je via een post-HBO traject doorgroeien tot OK-Verpleegkundige of Anesthesiemedewerker.',
      },
    ],
  },

  // ── Physician Assistant ───────────────────────────────────────────────────
  {
    slug: 'physician-assistant',
    name: 'Physician Assistant',
    metaDescription:
      'Opleiding Physician Assistant (Master PA): toelating, duur, bevoegdheden, salaris en carrièreperspectief als zelfstandige zorgverlener naast de arts.',
    heroBadge: 'Master PA (niveau 7)',
    heroIntro:
      'De Master Physician Assistant (PA) is een tweejarige voltijdse master die HBO-paramedici en HBO-V verpleegkundigen opleidt tot zelfstandige zorgverleners met brede medische bevoegdheden.',
    intro:
      'Een Physician Assistant werkt zelfstandig naast de arts: je verricht lichamelijk onderzoek, stelt diagnoses, schrijft geneesmiddelen voor en voert voorbehouden handelingen uit. De opleiding is een twee­jarige voltijdse master voor kandidaten met een relevante HBO-achtergrond en werkervaring.',
    level: 'Master (niveau 7)',
    duration: '2 jaar (voltijds)',
    sector: 'Ziekenhuizen & UMC',
    variants: [
      { label: 'Master Physician Assistant (voltijds)', duration: '2 jaar' },
    ],
    admissionRequirements:
      'HBO-diploma (paramedisch, verpleegkunde of aanverwant) + minimaal 2 jaar relevante werkervaring in de zorg.',
    learningOutcomes: [
      'Zelfstandig anamnese en lichamelijk onderzoek uitvoeren',
      'Diagnoses stellen en differentiëren',
      'Behandelplannen formuleren en uitvoeren',
      'Geneesmiddelen voorschrijven (breed formularium)',
      'Voorbehouden handelingen uitvoeren (biopten, hechtingen, catheterisatie)',
    ],
    pathways: [
      'Zelfstandig gevestigd PA',
      'Afdelingshoofd / zorgmanager',
      'Opleider / universitair docent',
      'Hybride rol: PA + klinische onderzoeker',
    ],
    workEnvironment: 'Ziekenhuis, huisartsenpraktijk, GGZ, revalidatie, ouderenzorg',
    startingSalary: '€5.000 – €8.000 bruto p/m (afhankelijk van specialisatie)',
    relatedProfessionSlug: 'physician-assistant',
    relatedProfessionName: 'Physician Assistant',
    relatedSalarySlug: 'physician-assistant',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedVacancyProfession: 'Physician Assistant',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat is het verschil tussen een PA en een Nurse Practitioner?',
        answer: 'Een PA heeft een bredere medische bevoegdheid (inclusief meer voorbehouden handelingen). Een NP heeft een verpleegkundige achtergrond met specifieke specialisatie. Beide werken zelfstandig naast de arts.',
      },
      {
        question: 'Wat verdient een Physician Assistant?',
        answer: 'Een PA verdient €5.000 – €8.000 bruto per maand, afhankelijk van specialisatie, sector en ervaring. In ziekenhuizen geldt CAO Ziekenhuizen; in de eerste lijn een vrije arbeidsmarkt.',
      },
      {
        question: 'Hoe lang duurt de opleiding Physician Assistant?',
        answer: 'De master PA duurt 2 jaar voltijds. Toelatingseisen: HBO-diploma + minimaal 2 jaar relevante werkervaring in de zorg.',
      },
    ],
  },

  // ── Klinisch Psycholoog ───────────────────────────────────────────────────
  {
    slug: 'klinisch-psycholoog',
    name: 'Klinisch Psycholoog',
    metaDescription:
      'Opleiding Klinisch Psycholoog: post-master specialisatie, duur, toelating, BIG-registratie, salaris en beroepsperspectieven in de GGZ.',
    heroBadge: 'Post-master specialisatie',
    heroIntro:
      'De opleiding tot Klinisch Psycholoog is een post-master specialisatie binnen de gezondheidszorgpsychologie, erkend via het BIG-register.',
    intro:
      'Na een master Psychologie of GZ-Psycholoog-opleiding kun je doorstromen naar de post-master opleiding Klinisch Psycholoog. Je behandelt complexe psychiatrische stoornissen, geeft supervisie en leidt behandelteams. De opleiding duurt 3 jaar en is erkend door het BIG-register.',
    level: 'Post-master (niveau 7+)',
    duration: '3 jaar',
    sector: 'GGZ',
    variants: [
      { label: 'Post-master Klinische Psychologie (naast werk)', duration: '3 jaar' },
    ],
    admissionRequirements:
      'Geregistreerd GZ-Psycholoog (BIG) + minimaal 2 jaar klinische ervaring. Selectieprocedure via SOLK/NIP.',
    learningOutcomes: [
      'Complexe DSM-diagnostiek uitvoeren',
      'Langdurige psychotherapeutische behandelingen leiden',
      'Supervisie geven aan GZ-Psychologen en therapeuten',
      'Behandelprotocollen ontwikkelen en toetsen',
      'Wetenschappelijk onderzoek integreren in de praktijk',
    ],
    pathways: [
      'Psychotherapeut (parallelle BIG-registratie mogelijk)',
      'Directeur Behandelzaken / GGZ-manager',
      'Klinisch onderzoeker / hoogleraar',
      'Zelfstandig gevestigd klinisch psycholoog',
    ],
    workEnvironment: 'GGZ-instelling, psychiatrisch ziekenhuis, forensische zorg, UMC',
    startingSalary: '€5.500 – €9.000 bruto p/m (FWG 70–80, CAO GGZ)',
    relatedProfessionSlug: 'klinisch-psycholoog',
    relatedProfessionName: 'Klinisch Psycholoog',
    relatedSalarySlug: 'klinisch-psycholoog',
    relatedCaoSlug: 'ggz',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'Klinisch Psycholoog',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat verdient een Klinisch Psycholoog?',
        answer: 'Een Klinisch Psycholoog verdient conform CAO GGZ (FWG 70–80): €5.500 – €9.000 bruto per maand, afhankelijk van ervaring en type instelling.',
      },
      {
        question: 'Wat is het verschil tussen een GZ-Psycholoog en een Klinisch Psycholoog?',
        answer: 'Een GZ-Psycholoog behandelt lichte tot matige psychische problemen. Een Klinisch Psycholoog heeft een aanvullende post-master specialisatie en behandelt complexere en chronische psychiatrische stoornissen, en geeft supervisie.',
      },
      {
        question: 'Is BIG-registratie verplicht als Klinisch Psycholoog?',
        answer: 'Ja. De titel Klinisch Psycholoog is een BIG-geregistreerde beschermde titel. Registratie vereist afronding van de erkende post-master opleiding.',
      },
    ],
  },

  // ── Psychotherapeut ───────────────────────────────────────────────────────
  {
    slug: 'psychotherapeut',
    name: 'Psychotherapeut',
    metaDescription:
      'Opleiding Psychotherapeut: post-master specialisatie, duur, toelating, BIG-registratie, salaris en werken in de GGZ als erkend psychotherapeut.',
    heroBadge: 'Post-master specialisatie',
    heroIntro:
      'De opleiding tot Psychotherapeut is een BIG-geregistreerde post-master specialisatie voor het zelfstandig behandelen van psychische stoornissen met psychotherapeutische methoden.',
    intro:
      'Als Psychotherapeut behandel je patiënten met ernstige psychische stoornissen via wetenschappelijk onderbouwde therapievormen (CGT, EMDR, schematherapie). De opleiding duurt 4 jaar naast werk en vereist een master Psychologie of Gezondheidswetenschappen plus klinische ervaring.',
    level: 'Post-master (niveau 7+)',
    duration: '4 jaar (naast werk)',
    sector: 'GGZ',
    variants: [
      { label: 'Post-master Psychotherapie (deeltijd, naast werk)', duration: '4 jaar' },
    ],
    admissionRequirements:
      'Master Psychologie, Pedagogiek of aanverwante richting + BIG-registratie als GZ-Psycholoog (aanbevolen) + minimaal 2 jaar klinische werkervaring.',
    learningOutcomes: [
      'Psychotherapeutische intake en diagnostiek',
      'CGT, EMDR, schematherapie en andere evidenced-based methoden toepassen',
      'Supervisie geven aan therapeuten in opleiding',
      'Behandeldossier bijhouden conform richtlijnen',
      'Omgaan met complexe en chronische psychiatrische problematieken',
    ],
    pathways: [
      'Klinisch Psycholoog (parallelle post-master mogelijk)',
      'Zelfstandig gevestigd psychotherapeut',
      'Opleider / supervisor',
      'Directeur Behandelzaken GGZ',
    ],
    workEnvironment: 'GGZ-instelling, RIAGG, zelfstandige praktijk, psychiatrisch ziekenhuis',
    startingSalary: '€5.000 – €8.500 bruto p/m (FWG 65–75, CAO GGZ)',
    relatedProfessionSlug: 'psychotherapeut',
    relatedProfessionName: 'Psychotherapeut',
    relatedSalarySlug: 'psychotherapeut',
    relatedCaoSlug: 'ggz',
    relatedCaoName: 'CAO GGZ',
    relatedVacancyProfession: 'Psychotherapeut',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat doet een psychotherapeut?',
        answer: 'Een psychotherapeut behandelt mensen met psychische stoornissen via therapie: CGT, EMDR, schematherapie of andere wetenschappelijk onderbouwde methoden. Je werkt zelfstandig en geeft supervisie aan collega\'s in opleiding.',
      },
      {
        question: 'Wat verdient een psychotherapeut in de GGZ?',
        answer: 'Conform CAO GGZ verdient een psychotherapeut €5.000 – €8.500 bruto per maand (FWG 65–75). Zelfstandig gevestigde therapeuten hanteren veelal een uurtarief van €150–€220.',
      },
      {
        question: 'Verschil psychotherapeut en psycholoog?',
        answer: 'Een psycholoog (GZ-Psycholoog) heeft een post-master GZ-opleiding en behandelt milde tot matige problematiek. Een psychotherapeut heeft aanvullend een specialisatie in psychotherapeutische technieken en behandelt complexere stoornissen.',
      },
    ],
  },

  // ── Kraamverzorgende ──────────────────────────────────────────────────────
  {
    slug: 'kraamverzorgende',
    name: 'Kraamverzorgende',
    metaDescription:
      'Alles over de MBO-opleiding Kraamverzorgende (niveau 3): duur, leerwegen, toelating, salaris en werken als kraamverzorgende bij gezinnen thuis.',
    heroBadge: 'MBO niveau 3',
    heroIntro:
      'De MBO-opleiding Kraamverzorgende (niveau 3) leidt je op voor de zorg en begeleiding van moeder en pasgeborene direct na de bevalling, thuis of in een kraamhotel.',
    intro:
      'Als kraamverzorgende bied je postnatale zorg aan moeder en baby gedurende de kraamperiode (8–10 dagen). Je ondersteunt bij voeding (borstvoeding), hygiëne, kraamherstel en signaleert vroeg mogelijke problemen. De opleiding duurt 1–2 jaar (BBL of BOL) op MBO niveau 3.',
    level: 'MBO niveau 3',
    duration: '1–2 jaar',
    sector: 'Kraamzorg',
    variants: [
      { label: 'BBL (werkend leren)', duration: '1–2 jaar' },
      { label: 'BOL (voltijds)', duration: '2 jaar' },
    ],
    admissionRequirements:
      'VMBO-basis, VMBO-TL of MBO niveau 2. Minimumleeftijd 18 jaar.',
    learningOutcomes: [
      'Postnatale zorg verlenen aan moeder en baby',
      'Borstvoeding begeleiden',
      'Basishygiëne en wondverzorging (episiotomie)',
      'Kraamperiode documenteren in dossier',
      'Vroege signalering van complicaties',
    ],
    pathways: [
      'Verloskundige (HBO, 4 jaar)',
      'Verzorgende IG (MBO niveau 3)',
      'Teamleider kraamzorg',
      'Lactatiekundige',
    ],
    workEnvironment: 'Kraamzorg thuis, kraamhotel, zorgboerderij, verloskundigenpraktijk',
    startingSalary: '€2.600 – €3.800 bruto p/m (FWG 30–40, CAO Kraamzorg)',
    relatedProfessionSlug: 'kraamverzorgende',
    relatedProfessionName: 'Kraamverzorgende',
    relatedSalarySlug: 'kraamverzorgende',
    relatedCaoSlug: 'kraamzorg',
    relatedCaoName: 'CAO Kraamzorg',
    relatedVacancyProfession: 'Kraamverzorgende',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat doet een kraamverzorgende?',
        answer: 'Een kraamverzorgende verzorgt moeder en baby in de eerste 8–10 dagen na de bevalling: borstvoeding begeleiden, hygiënische zorg, baby-observatie en lichte huishoudelijke taken.',
      },
      {
        question: 'Wat verdient een kraamverzorgende?',
        answer: 'Conform CAO Kraamzorg verdient een kraamverzorgende €2.600 – €3.800 bruto per maand (FWG 30–40), afhankelijk van ervaring. ORT-toeslagen voor nacht- en weekenddiensten komen daarboven op.',
      },
      {
        question: 'Hoe lang duurt de opleiding kraamverzorgende?',
        answer: 'De MBO niveau 3 opleiding Kraamverzorgende duurt 1–2 jaar. Via BBL (werkend leren) kun je de opleiding combineren met een arbeidscontract bij een kraamzorgorganisatie.',
      },
    ],
  },

  // ── Apothekersassistent ───────────────────────────────────────────────────
  {
    slug: 'apothekersassistent',
    name: 'Apothekersassistent',
    metaDescription:
      'Alles over de MBO-opleiding Apothekersassistent (niveau 4): duur, leerwegen, toelating, salaris en werken in de apotheek.',
    heroBadge: 'MBO niveau 4',
    heroIntro:
      'De MBO-opleiding Apothekersassistent (niveau 4) leidt je op voor het bereiden en verstrekken van medicatie, patiëntbegeleiding en kwaliteitsbewaking in de openbare apotheek of ziekenhuisapotheek.',
    intro:
      'Als apothekersassistent bereid je medicijnen, verstrekt ze conform voorschrift, geeft voorlichting aan patiënten en bewaakt interacties. Je werkt nauw samen met de apotheker. De opleiding duurt 3–4 jaar op MBO niveau 4 en is erkend door de KNMP.',
    level: 'MBO niveau 4',
    duration: '3–4 jaar',
    sector: 'Apotheken',
    variants: [
      { label: 'BBL (werkend leren)', duration: '3–4 jaar' },
      { label: 'BOL (voltijds)', duration: '3–4 jaar' },
    ],
    admissionRequirements:
      'VMBO-TL of MBO niveau 3 met profiel Zorg & Welzijn. Basiskennis scheikunde is een pré.',
    learningOutcomes: [
      'Geneesmiddelen bereiden (magistrale bereiding)',
      'Recepten verwerken en verstrekken',
      'Patiënten voorlichten over medicatiegebruik',
      'Interacties en contra-indicaties signaleren',
      'Kwaliteits- en hygiëneprotocollen toepassen',
    ],
    pathways: [
      'Ziekenhuisapotheker-assistent (specialisatie)',
      'Farmaceutisch consulent',
      'HBO Farmaceutische Wetenschappen',
      'Teamleider apotheek',
    ],
    workEnvironment: 'Openbare apotheek, ziekenhuisapotheek, BENU, Etos apotheekfiliaal',
    startingSalary: '€2.800 – €4.200 bruto p/m (CAO Apotheken)',
    relatedProfessionSlug: 'doktersassistent',
    relatedProfessionName: 'Apothekersassistent',
    relatedSalarySlug: 'praktijkondersteuner',
    relatedCaoSlug: 'apotheken',
    relatedCaoName: 'CAO Apotheken',
    relatedVacancyProfession: 'Apothekersassistent',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat doet een apothekersassistent?',
        answer: 'Een apothekersassistent bereidt en verstrekt geneesmiddelen op recept, geeft voorlichting aan patiënten over correct gebruik en signaleert mogelijke geneesmiddelinteracties.',
      },
      {
        question: 'Wat verdient een apothekersassistent?',
        answer: 'Conform CAO Apotheken verdient een apothekersassistent €2.800 – €4.200 bruto per maand, afhankelijk van ervaring en functieniveau.',
      },
      {
        question: 'Is een BIG-registratie nodig als apothekersassistent?',
        answer: 'Nee, apothekersassistenten hoeven zich niet in het BIG-register in te schrijven. Wel is een erkend MBO niveau 4 diploma vereist en registratie bij de KNMP-erkende beroepsvereniging.',
      },
    ],
  },

  // ── Ambulanceverpleegkundige ──────────────────────────────────────────────
  {
    slug: 'ambulanceverpleegkundige',
    name: 'Ambulanceverpleegkundige',
    metaDescription:
      'Alles over de post-HBO opleiding Ambulanceverpleegkundige: toelating, duur, vakbekwaamheid, salaris en werken in de spoedeisende ambulancezorg.',
    heroBadge: 'Post-HBO specialisatie',
    heroIntro:
      'De opleiding Ambulanceverpleegkundige is een post-HBO specialisatie voor verpleegkundigen die spoedeisende zorg willen verlenen buiten het ziekenhuis.',
    intro:
      'Als ambulanceverpleegkundige verleen je spoedeisende en planbare zorg in de ambulance. Je triageert, stabiliseert en behandelt patiënten en neemt zelfstandig klinische beslissingen. De post-HBO opleiding duurt 2 jaar en vereist een HBO-V diploma plus aantoonbare klinische ervaring.',
    level: 'Post-HBO (niveau 6+)',
    duration: '2 jaar',
    sector: 'Ambulancezorg',
    variants: [
      { label: 'Post-HBO Ambulanceverpleegkunde (deeltijd, naast werk)', duration: '2 jaar' },
    ],
    admissionRequirements:
      'HBO-V diploma + BIG-registratie als verpleegkundige + minimaal 2 jaar klinische ervaring (spoedeisend of ic bij voorkeur).',
    learningOutcomes: [
      'Pre-hospitale triage en ABCDE-systematiek toepassen',
      'ALS (Advanced Life Support) uitvoeren',
      'Medicatie toedienen in de pre-hospitale setting',
      'Zelfstandig beslissingen nemen bij spoedeisende situaties',
      'Communiceren met MKA (Meldkamer Ambulancezorg)',
    ],
    pathways: [
      'Traumaverpleegkundige (ziekenhuis)',
      'HEMS-verpleegkundige (helikopterteam)',
      'Coördinator ambulancezorg',
      'Opleider pre-hospitale zorg',
    ],
    workEnvironment: 'Ambulance, traumaheli, MKA-post, SEH (bij incidentele inzet)',
    startingSalary: '€4.000 – €6.000 bruto p/m (FWG 60–65, CAO Ambulancezorg)',
    relatedProfessionSlug: 'ic-verpleegkundige',
    relatedProfessionName: 'Ambulanceverpleegkundige',
    relatedSalarySlug: 'ic-verpleegkundige',
    relatedCaoSlug: 'ambulancezorg',
    relatedCaoName: 'CAO Ambulancezorg',
    relatedVacancyProfession: 'Ambulanceverpleegkundige',
    bigRegistrationAfter: true,
    faqs: [
      {
        question: 'Wat is het verschil tussen een ambulancechauffeur en een ambulanceverpleegkundige?',
        answer: 'De ambulancechauffeur (ook wel ambulancechauffeur met verpleegkundige taken) rijdt en verleent basiszorg. De ambulanceverpleegkundige (voorheen: verpleegkundige verpleegkundige in de ambulance) is de medisch leidinggevende in de ambulance en voert alle verpleegkundige en medische handelingen uit.',
      },
      {
        question: 'Wat verdient een ambulanceverpleegkundige?',
        answer: 'Conform CAO Ambulancezorg verdient een ambulanceverpleegkundige €4.000 – €6.000 bruto per maand (FWG 60–65). ORT voor nacht-, weekend- en feestdagdiensten komt hier bovenop.',
      },
      {
        question: 'Hoe word ik ambulanceverpleegkundige?',
        answer: 'Je hebt een HBO-V diploma en BIG-registratie nodig, plus minimaal 2 jaar klinische ervaring. Daarna volg je de 2-jarige post-HBO opleiding Ambulanceverpleegkunde bij een erkende RAV of opleidingsinstelling.',
      },
    ],
  },

  // ── Sociaal Werker ────────────────────────────────────────────────────────
  {
    slug: 'sociaal-werker',
    name: 'Sociaal Werker',
    metaDescription:
      'Alles over de HBO-opleiding Social Work (HBO niveau 6): duur, leerwegen, toelating, salaris en beroepsperspectieven in het sociaal werk.',
    heroBadge: 'HBO niveau 6',
    heroIntro:
      'De HBO-bachelor Social Work leidt je op voor hulpverlening, maatschappelijke ondersteuning en community work in wijkteams, jeugdzorg, schuldhulp en welzijnsorganisaties.',
    intro:
      'Met een HBO-diploma Social Work werk je als sociaal werker in wijkteams, buurthuizen, jeugdzorg, schuldhulpverlening of maatschappelijke opvang. Je begeleidt cliënten bij persoonlijke en sociale problemen en werkt aan zelfredzaamheid. De 4-jarige HBO-opleiding heeft een brede instroom.',
    level: 'HBO niveau 6',
    duration: '4 jaar',
    sector: 'Sociaal Werk',
    variants: [
      { label: 'HBO voltijds', duration: '4 jaar' },
      { label: 'HBO deeltijd', duration: '4–5 jaar' },
      { label: 'HBO duaal', duration: '4 jaar' },
    ],
    admissionRequirements:
      'HAVO of VWO diploma, of MBO niveau 4 (met eventueel verkorte route).',
    learningOutcomes: [
      'Integrale hulpverlening en cliëntbegeleiding',
      'Sociale kaart van de regio kennen en benutten',
      'Groepswerk en community work organiseren',
      'Schuldhulpverlening en maatschappelijke ondersteuning',
      'Interdisciplinair samenwerken in wijkteams',
    ],
    pathways: [
      'Teamleider sociaal werk',
      'Master Social Work (MSW)',
      'GZ-Psycholoog (aanvullende master Psychologie)',
      'Beleidsadviseur zorg & welzijn',
    ],
    workEnvironment: 'Wijkteam, buurtcentrum, jeugdzorgorganisatie, maatschappelijke opvang, gemeente',
    startingSalary: '€2.900 – €4.500 bruto p/m (CAO Sociaal Werk)',
    relatedProfessionSlug: 'sociaal-werker',
    relatedProfessionName: 'Sociaal Werker',
    relatedSalarySlug: 'sociaal-werker',
    relatedCaoSlug: 'sociaal-werk',
    relatedCaoName: 'CAO Sociaal Werk',
    relatedVacancyProfession: 'Sociaal Werker',
    bigRegistrationAfter: false,
    faqs: [
      {
        question: 'Wat doet een sociaal werker?',
        answer: 'Een sociaal werker begeleidt mensen bij persoonlijke, sociale en maatschappelijke problemen. Je werkt aan zelfredzaamheid, organiseert groepsactiviteiten en verbindt cliënten met de juiste instanties.',
      },
      {
        question: 'Wat verdient een sociaal werker?',
        answer: 'Conform CAO Sociaal Werk verdient een sociaal werker €2.900 – €4.500 bruto per maand, afhankelijk van ervaring en functieniveau.',
      },
      {
        question: 'Kan ik doorgroeien na HBO Social Work?',
        answer: 'Ja. Via de Master Social Work (MSW) of een master Pedagogiek kun je doorgroeien naar teamleider, beleidsadviseur of GZ-Psycholoog (met aanvullende studie).',
      },
    ],
  },
];
