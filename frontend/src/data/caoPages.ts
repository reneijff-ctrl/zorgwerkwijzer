/**
 * Centrale CAO-pagina-data voor ZorgWerkwijzer.
 *
 * Voeg een nieuwe CAO toe door één object toe te voegen aan `caoPages`.
 * De dynamische route /cao/[slug] genereert automatisch een volwaardige SEO-pagina
 * via generateStaticParams — geen nieuwe page.tsx nodig.
 *
 * Data wordt ook hergebruikt door CaoPageTemplate.tsx en de /cao overzichtspagina.
 */

export interface FwgRow {
  schaal: string;
  functie: string;
  min: string;
  max: string;
}

export interface CaoKeyPoint {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedProfession {
  label: string;
  href: string;
}

export interface CaoPageData {
  /** URL-slug, bijv. "gehandicaptenzorg" → /cao/gehandicaptenzorg */
  slug: string;
  /** Weergavenaam voor headings, bijv. "CAO Gehandicaptenzorg" */
  title: string;
  /** Volledige officiële naam */
  fullName: string;
  /** SEO meta description (max 160 tekens) */
  metaDescription: string;
  /** Sectorbeschrijving, bijv. "Gehandicaptenzorg" */
  sector: string;
  /** Hero-introductie (1–2 zinnen) */
  heroIntro: string;
  /** Looptijd, bijv. "1 januari 2025 – 31 december 2026" */
  looptijd: string;
  /** Loonsverhoging percentage 2026 */
  raisePercent2026: number;
  /** Vakantiegeld percentage */
  holidayPayPercent: number;
  /** Eindejaarsuitkering percentage */
  endOfYearPercent: number;
  /** Minimum vakantiedagen per jaar (fulltime) */
  vacationDays: number;
  /** ORT-percentages */
  ort: {
    evening: number;
    saturday: number;
    sunday: number;
    /** Label voor avond/nacht-tijden, bijv. "ma–vr 20:00–06:00" */
    eveningLabel: string;
  };
  /** Reiskostenvergoeding in cent per km */
  travelCostPerKm: number;
  /** Werkuren per week standaard */
  weeklyHours: number;
  /** Indicatieve FWG-salarisschalen */
  fwgRows: FwgRow[];
  /** Kernpunten van de CAO */
  keyPoints: CaoKeyPoint[];
  /** Veelgestelde vragen */
  faqs: FaqItem[];
  /** Gerelateerde beroepspagina's (/salaris/[slug]) */
  relatedProfessions: RelatedProfession[];
  /** Zoekterm voor vacaturesfilter in de hero-CTA, bijv. "Verpleegkundige" */
  relatedVacancyQuery: string;
  /** Accentkleur (Tailwind CSS kleur-naam, bijv. "violet", "sky", "emerald") */
  accentColor: string;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

export function getCaoPage(slug: string): CaoPageData | undefined {
  return caoPages.find((c) => c.slug === slug);
}

export function getCaoStaticParams(): { slug: string }[] {
  return caoPages.map((c) => ({ slug: c.slug }));
}

// ─── Data ──────────────────────────────────────────────────────────────────────

export const caoPages: CaoPageData[] = [
  // ── CAO VVT ────────────────────────────────────────────────────────────────
  {
    slug: 'vvt',
    title: 'CAO VVT',
    fullName: 'CAO Verpleeg-, Verzorgingshuizen en Thuiszorg',
    metaDescription:
      'Alles over de CAO VVT 2026: salarisschalen, loonsverhoging, ORT-percentages en arbeidsvoorwaarden voor medewerkers in verpleeghuizen, verzorgingshuizen en thuiszorg.',
    sector: 'Verpleeg-, Verzorgingshuizen en Thuiszorg (VVT)',
    heroIntro:
      'De CAO VVT regelt de arbeidsvoorwaarden voor meer dan 200.000 medewerkers in verpleeghuizen, verzorgingshuizen en de thuiszorg. Bekijk salarisschalen, ORT en andere rechten.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.5,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 22, saturday: 40, sunday: 60, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 15', functie: 'Schoonmaak / Keukenmedewerker', min: '2.100', max: '2.450' },
      { schaal: 'FWG 25', functie: 'Helpende', min: '2.350', max: '2.900' },
      { schaal: 'FWG 30', functie: 'Helpende Plus', min: '2.500', max: '3.000' },
      { schaal: 'FWG 35', functie: 'Verzorgende IG i.o.', min: '2.600', max: '3.100' },
      { schaal: 'FWG 40', functie: 'Verzorgende IG', min: '2.900', max: '3.500' },
      { schaal: 'FWG 45', functie: 'Verpleegkundige niveau 4', min: '3.100', max: '3.900' },
      { schaal: 'FWG 55', functie: 'Verpleegkundige niveau 5 / Wijkverpleegkundige', min: '3.500', max: '4.700' },
    ],
    keyPoints: [
      {
        title: 'Onregelmatigheidstoeslag (ORT)',
        description:
          'Medewerkers die avond-, nacht-, weekend- of feestdagendiensten draaien hebben recht op ORT. De percentages zijn vastgelegd in de CAO-tekst.',
      },
      {
        title: 'Persoonlijk Loopbaanbudget (PLB)',
        description:
          'Medewerkers ontvangen jaarlijks een PLB van 1,5% van het bruto jaarsalaris voor scholing, opleiding of loopbaanontwikkeling.',
      },
      {
        title: 'Pensioenopbouw via PFZW',
        description:
          'Pensioen wordt opgebouwd via PFZW (Pensioenfonds Zorg en Welzijn). De werkgeversbijdrage is vastgelegd in de CAO.',
      },
      {
        title: 'Bijzonder verlof',
        description:
          'Naast vakantiedagen zijn er regelingen voor kortdurend zorgverlof, bijzonder verlof en mantelzorgverlof.',
      },
    ],
    faqs: [
      {
        question: 'Welke organisaties vallen onder de CAO VVT?',
        answer:
          'De CAO VVT is van toepassing op alle medewerkers in verpleeghuizen, verzorgingshuizen, woonzorgcentra en thuiszorgorganisaties. Denk aan organisaties als Amstelring, Cordaan, Zorggroep Alliade en vergelijkbare instellingen.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in de CAO VVT 2026?',
        answer:
          'In de CAO VVT 2025-2026 is een loonsverhoging van 3,5% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever of de FNV Zorg & Welzijn voor de meest actuele informatie.',
      },
      {
        question: 'Hoe hoog is de ORT in de CAO VVT?',
        answer:
          'Voor onregelmatige diensten geldt in de CAO VVT: maandag t/m vrijdag 20:00–06:00: 22%, op zaterdag: 40%, op zon- en feestdagen: 60% toeslag op het bruto uurloon.',
      },
      {
        question: 'Heb ik recht op een eindejaarsuitkering in de CAO VVT?',
        answer:
          'Ja, medewerkers in de VVT hebben recht op een eindejaarsuitkering van 8,33% van het bruto jaarsalaris, equivalent aan een dertiende maand. De uitkering wordt doorgaans in november/december uitbetaald.',
      },
      {
        question: 'Hoeveel vakantiedagen heb ik in de CAO VVT?',
        answer:
          'Medewerkers in de VVT hebben recht op minimaal 29 vakantiedagen per jaar bij een fulltime dienstverband, plus 8% vakantietoeslag over het bruto jaarsalaris.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Verpleegkundige', href: '/salaris/verpleegkundige' },
      { label: 'Salaris Verzorgende IG', href: '/salaris/verzorgende-ig' },
      { label: 'Salaris Helpende', href: '/salaris/helpende' },
      { label: 'Salaris Helpende Plus', href: '/salaris/helpende-plus' },
      { label: 'Salaris Wijkverpleegkundige', href: '/salaris/wijkverpleegkundige' },
    ],
    relatedVacancyQuery: 'Verpleegkundige',
    accentColor: 'sky',
  },

  // ── CAO Ziekenhuizen ───────────────────────────────────────────────────────
  {
    slug: 'ziekenhuizen',
    title: 'CAO Ziekenhuizen',
    fullName: 'CAO Ziekenhuizen',
    metaDescription:
      'Alles over de CAO Ziekenhuizen 2026: salarisschalen, loonsverhoging, ORT-percentages en arbeidsvoorwaarden voor medewerkers in Nederlandse ziekenhuizen.',
    sector: 'Ziekenhuizen en medisch specialistische zorg',
    heroIntro:
      'De CAO Ziekenhuizen regelt de arbeidsvoorwaarden voor meer dan 150.000 medewerkers in Nederlandse ziekenhuizen. Van verpleegkundigen tot laboranten en OK-assistenten.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 25, saturday: 40, sunday: 65, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 25', functie: 'Assistent / Medewerker facilitair', min: '2.350', max: '2.900' },
      { schaal: 'FWG 35', functie: 'Verzorgende / Medewerker patiëntenzorg', min: '2.600', max: '3.200' },
      { schaal: 'FWG 45', functie: 'Verpleegkundige niveau 4 / OK-assistent', min: '3.000', max: '3.900' },
      { schaal: 'FWG 55', functie: 'Verpleegkundige niveau 5 / Laborant HBO', min: '3.400', max: '4.700' },
      { schaal: 'FWG 65', functie: 'IC-verpleegkundige / Nurse Practitioner i.o.', min: '4.000', max: '5.500' },
      { schaal: 'FWG 75', functie: 'Nurse Practitioner / Physician Assistant', min: '4.800', max: '6.500' },
    ],
    keyPoints: [
      {
        title: 'Inconveniëntentoelage',
        description:
          'Medewerkers met fysiek of psychisch belastend werk kunnen aanspraak maken op een inconveniëntentoelage bovenop het reguliere salaris.',
      },
      {
        title: 'Structurele loonsverhoging',
        description:
          'In de CAO Ziekenhuizen 2025-2026 is een structurele loonsverhoging van 3% per 2026 afgesproken, bovenop de verhoging van 2025.',
      },
      {
        title: 'Pensioen via PFZW',
        description:
          'Pensioenopbouw vindt plaats via PFZW. De premieverdeling tussen werkgever en werknemer is vastgelegd in de CAO.',
      },
      {
        title: 'Scholingsbudget',
        description:
          'Medewerkers hebben recht op een jaarlijks scholingsbudget voor BIG-herregistratie, specialisatieopleidingen en persoonlijke ontwikkeling.',
      },
    ],
    faqs: [
      {
        question: 'Welke ziekenhuizen vallen onder de CAO Ziekenhuizen?',
        answer:
          'De CAO Ziekenhuizen is van toepassing op medewerkers in algemene en categorale ziekenhuizen die zijn aangesloten bij de NVZ (Nederlandse Vereniging van Ziekenhuizen). UMC\'s (universitaire medische centra) hebben een aparte CAO.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in 2026?',
        answer:
          'In de CAO Ziekenhuizen 2025-2026 is een structurele loonsverhoging van 3% per 1 januari 2026 afgesproken. De exacte bedragen hangen af van uw salarisschaal.',
      },
      {
        question: 'Hoe hoog is de ORT in de CAO Ziekenhuizen?',
        answer:
          'ORT-percentages in de CAO Ziekenhuizen: maandag t/m vrijdag 20:00–06:00: 25%, zaterdag: 40%, zon- en feestdagen: 65% toeslag op het bruto uurloon.',
      },
      {
        question: 'Hoe hoog is de eindejaarsuitkering in de CAO Ziekenhuizen?',
        answer:
          'Medewerkers hebben recht op een eindejaarsuitkering van 8,33% van het bruto jaarsalaris (een volledige dertiende maand), uitbetaald in november of december.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris IC-Verpleegkundige', href: '/salaris/ic-verpleegkundige' },
      { label: 'Salaris Nurse Practitioner', href: '/salaris/nurse-practitioner' },
      { label: 'Salaris OK-Assistent', href: '/salaris/ok-assistent' },
      { label: 'Salaris Physician Assistant', href: '/salaris/physician-assistant' },
    ],
    relatedVacancyQuery: 'Verpleegkundige',
    accentColor: 'blue',
  },

  // ── CAO GGZ ────────────────────────────────────────────────────────────────
  {
    slug: 'ggz',
    title: 'CAO GGZ',
    fullName: 'CAO Geestelijke Gezondheidszorg',
    metaDescription:
      'Alles over de CAO GGZ 2026: salarisschalen, loonsverhoging, ORT-percentages en arbeidsvoorwaarden voor medewerkers in de geestelijke gezondheidszorg.',
    sector: 'Geestelijke Gezondheidszorg (GGZ)',
    heroIntro:
      'De CAO GGZ regelt de arbeidsvoorwaarden voor medewerkers in GGZ-instellingen, verslavingszorg en forensische psychiatrie. Van psychiatrisch verpleegkundigen tot GZ-psychologen.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 2.5,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 25, saturday: 40, sunday: 65, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 15', functie: 'Hulpmedewerker / Schoonmaak', min: '2.100', max: '2.450' },
      { schaal: 'FWG 25', functie: 'Helpende / Medewerker facilitair', min: '2.350', max: '2.900' },
      { schaal: 'FWG 35', functie: 'Ziekenverzorgende / Begeleider', min: '2.600', max: '3.300' },
      { schaal: 'FWG 45', functie: 'Verpleegkundige niveau 4', min: '2.950', max: '3.900' },
      { schaal: 'FWG 55', functie: 'Verpleegkundige niveau 5 / GZ-psycholoog i.o.', min: '3.400', max: '4.600' },
      { schaal: 'FWG 65', functie: 'GZ-psycholoog / Sociaal psychiatrisch verpleegkundige', min: '4.000', max: '5.500' },
    ],
    keyPoints: [
      {
        title: 'Onregelmatigheidstoeslag (ORT)',
        description:
          'Medewerkers die buiten reguliere werktijden werken hebben recht op ORT. De percentages variëren afhankelijk van tijdstip en dag.',
      },
      {
        title: 'Persoonlijk Loopbaanbudget (PLB)',
        description:
          'Medewerkers ontvangen een PLB van 1,5% van het bruto jaarsalaris voor scholing, opleiding of loopbaanontwikkeling.',
      },
      {
        title: 'Pensioenopbouw via PFZW',
        description:
          'Pensioen wordt opgebouwd via PFZW (Pensioenfonds Zorg en Welzijn). De premieverdeling is vastgelegd in de CAO.',
      },
      {
        title: 'Thuiswerken en hybride werken',
        description:
          'De CAO GGZ bevat afspraken over hybride werken en een thuiswerkkostenvergoeding voor functies waar thuiswerken mogelijk is.',
      },
    ],
    faqs: [
      {
        question: 'Welke organisaties vallen onder de CAO GGZ?',
        answer:
          'De CAO GGZ is van toepassing op medewerkers bij instellingen voor geestelijke gezondheidszorg, verslavingszorg en forensische psychiatrie. Denk aan GGZ Nederland, Parnassia Groep, Lentis, Pro Persona en soortgelijke organisaties.',
      },
      {
        question: 'Hoeveel loonsverhoging geldt er in de CAO GGZ 2026?',
        answer:
          'In de CAO GGZ is een loonsverhoging van 3% per 1 januari 2025 en 2,5% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever of FNV/CNV voor de meest actuele informatie.',
      },
      {
        question: 'Hoe hoog is de ORT in de CAO GGZ?',
        answer:
          'ORT-percentages in de CAO GGZ: maandag t/m vrijdag 20:00–06:00: 25%, zaterdag: 40%, zon- en feestdagen: 65% op het bruto uurloon.',
      },
      {
        question: 'Heb ik recht op een eindejaarsuitkering in de GGZ?',
        answer:
          'Ja, medewerkers in de GGZ hebben recht op een eindejaarsuitkering van 8,33% van het jaarsalaris (dertiende maand), doorgaans uitbetaald in november of december.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris GZ-Psycholoog', href: '/salaris/gz-psycholoog' },
      { label: 'Salaris SPV', href: '/salaris/spv' },
      { label: 'Salaris Klinisch Psycholoog', href: '/salaris/klinisch-psycholoog' },
      { label: 'Salaris Psychiatrisch Verpleegkundige', href: '/salaris/psychiatrisch-verpleegkundige' },
    ],
    relatedVacancyQuery: 'Psychiatrisch verpleegkundige',
    accentColor: 'violet',
  },

  // ── CAO Gehandicaptenzorg ──────────────────────────────────────────────────
  {
    slug: 'gehandicaptenzorg',
    title: 'CAO Gehandicaptenzorg',
    fullName: 'CAO Gehandicaptenzorg',
    metaDescription:
      'Alles over de CAO Gehandicaptenzorg 2026: salarisschalen, FWG-schalen, ORT-percentages en arbeidsvoorwaarden voor begeleiders en andere medewerkers in de gehandicaptenzorg.',
    sector: 'Gehandicaptenzorg',
    heroIntro:
      'De CAO Gehandicaptenzorg regelt de arbeidsvoorwaarden voor meer dan 120.000 medewerkers in de gehandicaptenzorg. Bekijk salarisschalen voor begeleiders, persoonlijk begeleiders en orthopedagogen.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 22, saturday: 40, sunday: 65, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 20', functie: 'Begeleider assistent', min: '2.200', max: '2.700' },
      { schaal: 'FWG 30', functie: 'Begeleider B / Medewerker dagbesteding', min: '2.500', max: '3.100' },
      { schaal: 'FWG 40', functie: 'Begeleider C / Persoonlijk begeleider', min: '2.900', max: '3.600' },
      { schaal: 'FWG 50', functie: 'Gedragsdeskundige / Activiteitenbegeleider HBO', min: '3.300', max: '4.200' },
      { schaal: 'FWG 60', functie: 'Orthopedagoog / Gedragswetenschapper', min: '3.900', max: '5.200' },
      { schaal: 'FWG 70', functie: 'Orthopedagoog-Generalist / AVG-arts', min: '4.600', max: '6.200' },
    ],
    keyPoints: [
      {
        title: 'Onregelmatigheidstoeslag (ORT)',
        description:
          'Medewerkers die avond-, nacht- en weekenddiensten werken ontvangen ORT. Specifieke percentages zijn afhankelijk van tijdstip en dag.',
      },
      {
        title: 'Individueel Keuzebudget (IKB)',
        description:
          'Medewerkers in de gehandicaptenzorg ontvangen een IKB waarmee zij vakantiegeld, eindejaarsuitkering en overige toeslagen naar eigen inzicht kunnen inzetten.',
      },
      {
        title: 'Scholing en loopbaan',
        description:
          'De CAO bevat afspraken over scholingsbudget, loopbaanontwikkeling en de mogelijkheid tot doorstroom naar hogere functies.',
      },
      {
        title: 'Veilig werken',
        description:
          'Werkgevers zijn verplicht agressiebeleid te voeren en medewerkers te beschermen tegen grensoverschrijdend gedrag van cliënten.',
      },
    ],
    faqs: [
      {
        question: 'Welke organisaties vallen onder de CAO Gehandicaptenzorg?',
        answer:
          "De CAO Gehandicaptenzorg is van toepassing op medewerkers bij zorgaanbieders die ondersteuning bieden aan mensen met een verstandelijke, lichamelijke of meervoudige beperking. Denk aan organisaties als Esdégé-Reigersdaal, 's Heeren Loo, Amerpoort en vergelijkbare instellingen.",
      },
      {
        question: 'Hoeveel loonsverhoging geldt er in de CAO Gehandicaptenzorg 2026?',
        answer:
          'In de CAO Gehandicaptenzorg 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever of de FNV Zorg & Welzijn voor actuele informatie.',
      },
      {
        question: 'Hoe hoog is de ORT in de CAO Gehandicaptenzorg?',
        answer:
          'ORT-percentages: maandag t/m vrijdag 20:00–06:00: 22%, zaterdag: 40%, zon- en feestdagen: 65% toeslag op het bruto uurloon.',
      },
      {
        question: 'Heb ik recht op een eindejaarsuitkering in de gehandicaptenzorg?',
        answer:
          'Ja, medewerkers hebben recht op een eindejaarsuitkering van 8,33% (dertiende maand). Dit kan onderdeel zijn van het Individueel Keuzebudget (IKB).',
      },
      {
        question: 'Wat is de FWG-schaal voor een persoonlijk begeleider?',
        answer:
          'Een persoonlijk begeleider in de gehandicaptenzorg valt doorgaans in FWG 40 (beginner) tot FWG 50 (ervaren). Dit komt neer op een bruto maandsalaris van ongeveer €2.900 tot €4.200 bij een 36-urige werkweek.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Begeleider Gehandicaptenzorg', href: '/salaris/begeleider-gehandicaptenzorg' },
      { label: 'Salaris Persoonlijk Begeleider', href: '/salaris/persoonlijk-begeleider' },
    ],
    relatedVacancyQuery: 'Begeleider gehandicaptenzorg',
    accentColor: 'emerald',
  },

  // ── CAO Jeugdzorg ──────────────────────────────────────────────────────────
  {
    slug: 'jeugdzorg',
    title: 'CAO Jeugdzorg',
    fullName: 'CAO Jeugdzorg',
    metaDescription:
      'Alles over de CAO Jeugdzorg 2026: salarisschalen, loonsverhoging, ORT-percentages en arbeidsvoorwaarden voor jeugdzorgwerkers, gezinscoaches en gedragswetenschappers.',
    sector: 'Jeugdzorg',
    heroIntro:
      'De CAO Jeugdzorg regelt de arbeidsvoorwaarden voor medewerkers in de jeugdzorg, jeugdbescherming en jeugdreclassering. Bekijk salarisschalen voor jeugdzorgwerkers, gezinscoaches en gedragswetenschappers.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 22, saturday: 40, sunday: 65, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 30', functie: 'Jeugdzorgwerker niveau 3', min: '2.500', max: '3.100' },
      { schaal: 'FWG 40', functie: 'Jeugdzorgwerker niveau 4 / Gezinsbegeleider', min: '2.900', max: '3.700' },
      { schaal: 'FWG 50', functie: 'Jeugdzorgwerker HBO / Gezinscoach', min: '3.300', max: '4.300' },
      { schaal: 'FWG 55', functie: 'Gedragswetenschapper i.o. / Casemanager', min: '3.600', max: '4.700' },
      { schaal: 'FWG 65', functie: 'Gedragswetenschapper / Jeugdpsycholoog', min: '4.100', max: '5.500' },
    ],
    keyPoints: [
      {
        title: 'Hoge werkdruk en reiskosten',
        description:
          'Jeugdzorgwerkers werken veelal op locatie bij gezinnen. De CAO bevat specifieke afspraken over reiskostenvergoeding en reistijdvergoeding.',
      },
      {
        title: 'Vertrouwelijkheid en veiligheid',
        description:
          'De CAO bevat afspraken over agressie- en veiligheidsbeleid ter bescherming van medewerkers die werken met complexe gezinssituaties.',
      },
      {
        title: 'Scholing en registratie',
        description:
          'Jeugdzorgwerkers zijn verplicht geregistreerd te staan in het SKJ-register (Stichting Kwaliteitsregister Jeugd). De CAO bevat afspraken over vergoeding van registratiekosten.',
      },
      {
        title: 'Werkdrukvermindering',
        description:
          'In de CAO Jeugdzorg zijn concrete afspraken opgenomen over werkdrukvermindering, maximale caseloads en extra ondersteuning bij complexe casussen.',
      },
    ],
    faqs: [
      {
        question: 'Welke organisaties vallen onder de CAO Jeugdzorg?',
        answer:
          'De CAO Jeugdzorg is van toepassing op medewerkers bij jeugdhulpaanbieders, gecertificeerde instellingen voor jeugdbescherming en jeugdreclassering. Denk aan organisaties als Jeugdbescherming Brabant, William Schrikker Stichting, Enver en vergelijkbare organisaties.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in de CAO Jeugdzorg 2026?',
        answer:
          'In de CAO Jeugdzorg 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 afgesproken. Raadpleeg uw werkgever of de FNV voor de exacte bedragen.',
      },
      {
        question: 'Hoe hoog is de ORT in de CAO Jeugdzorg?',
        answer:
          'ORT-percentages: maandag t/m vrijdag 20:00–06:00: 22%, zaterdag: 40%, zon- en feestdagen: 65% toeslag op het bruto uurloon.',
      },
      {
        question: 'Is registratie in het SKJ verplicht voor jeugdzorgwerkers?',
        answer:
          'Ja, voor de meeste functies in de jeugdzorg is registratie in het Kwaliteitsregister Jeugd (SKJ) verplicht. De CAO bevat afspraken over vergoeding van registratiekosten door de werkgever.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Jeugdzorgwerker', href: '/salaris/jeugdzorgwerker' },
    ],
    relatedVacancyQuery: 'Jeugdzorgwerker',
    accentColor: 'orange',
  },

  // ── CAO Huisartsenzorg ─────────────────────────────────────────────────────
  {
    slug: 'huisartsenzorg',
    title: 'CAO Huisartsenzorg',
    fullName: 'CAO Huisartsenzorg',
    metaDescription:
      'Alles over de CAO Huisartsenzorg 2026: salarisschalen, loonsverhoging, toeslagen en arbeidsvoorwaarden voor doktersassistenten, praktijkondersteuners en triagisten.',
    sector: 'Huisartsenzorg en eerstelijns gezondheidszorg',
    heroIntro:
      'De CAO Huisartsenzorg regelt de arbeidsvoorwaarden voor medewerkers in huisartsenpraktijken, huisartsenposten en gezondheidscentra. Van doktersassistenten en triagisten tot praktijkondersteuners.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 22, saturday: 38, sunday: 60, eveningLabel: 'ma–vr 18:00–08:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 30', functie: 'Doktersassistent (starter)', min: '2.450', max: '2.950' },
      { schaal: 'FWG 40', functie: 'Doktersassistent (ervaren) / Triagist', min: '2.800', max: '3.500' },
      { schaal: 'FWG 50', functie: 'Praktijkondersteuner (POH) HBO', min: '3.200', max: '4.200' },
      { schaal: 'FWG 55', functie: 'POH-GGZ / Verpleegkundig specialist i.o.', min: '3.600', max: '4.800' },
      { schaal: 'FWG 65', functie: 'Nurse Practitioner / Physician Assistant', min: '4.200', max: '5.800' },
    ],
    keyPoints: [
      {
        title: 'HAP-diensten en bereikbaarheid',
        description:
          'Medewerkers op huisartsenposten (HAP) werken buiten kantooruren. De CAO bevat specifieke toeslagen voor avond-, nacht- en weekenddiensten op de HAP.',
      },
      {
        title: 'BIG-registratie vergoeding',
        description:
          'De CAO bevat afspraken over vergoeding van BIG-herregistratiekosten en verplichte nascholing voor doktersassistenten en POH\'ers.',
      },
      {
        title: 'Telefoon- en triagediensten',
        description:
          'Triagisten en doktersassistenten die telefonische triage uitvoeren ontvangen een toelage voor deze specifieke werkzaamheden.',
      },
      {
        title: 'Pensioen via StiPP of PFZW',
        description:
          'Pensioenopbouw vindt plaats via het pensioenfonds van de werkgever, veelal StiPP (voor kleinere praktijken) of PFZW.',
      },
    ],
    faqs: [
      {
        question: 'Welke medewerkers vallen onder de CAO Huisartsenzorg?',
        answer:
          'De CAO Huisartsenzorg is van toepassing op medewerkers in huisartsenpraktijken, huisartsenposten (HAP) en gezondheidscentra. Denk aan doktersassistenten, triagisten, praktijkondersteuners (POH) en administratief medewerkers.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in de CAO Huisartsenzorg 2026?',
        answer:
          'In de CAO Huisartsenzorg 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 afgesproken. Raadpleeg uw werkgever voor de exacte bedragen per salarisschaal.',
      },
      {
        question: 'Hoe hoog is de toeslag voor HAP-diensten?',
        answer:
          'Op huisartsenposten gelden toeslagen voor avond- en nachtdiensten (22%), zaterdag (38%) en zon- en feestdagen (60%) op het bruto uurloon.',
      },
      {
        question: 'Heeft een doktersassistent recht op een eindejaarsuitkering?',
        answer:
          'Ja, medewerkers in de huisartsenzorg hebben recht op een eindejaarsuitkering van 8,33% van het bruto jaarsalaris, uitbetaald in november of december.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Doktersassistent', href: '/salaris/doktersassistent' },
      { label: 'Salaris Praktijkondersteuner (POH)', href: '/salaris/praktijkondersteuner' },
      { label: 'Salaris POH-GGZ', href: '/salaris/poh-ggz' },
      { label: 'Salaris Triagist', href: '/salaris/triagist' },
    ],
    relatedVacancyQuery: 'Doktersassistent',
    accentColor: 'teal',
  },

  // ── CAO Ambulancezorg ──────────────────────────────────────────────────────
  {
    slug: 'ambulancezorg',
    title: 'CAO Ambulancezorg',
    fullName: 'CAO Ambulancezorg',
    metaDescription:
      'Alles over de CAO Ambulancezorg 2026: salarisschalen, toeslagen voor consignatie- en alarmdiensten, ORT-percentages en arbeidsvoorwaarden voor ambulanceverpleegkundigen en centralisten.',
    sector: 'Ambulancezorg',
    heroIntro:
      'De CAO Ambulancezorg regelt de arbeidsvoorwaarden voor ambulanceverpleegkundigen, ambulancechauffeurs en centralisten bij regionale ambulancevoorzieningen (RAV\'s) in Nederland.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 30,
    ort: { evening: 30, saturday: 45, sunday: 70, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 40', functie: 'Ambulancechauffeur / Ambulanceverpleegkundige i.o.', min: '3.100', max: '3.900' },
      { schaal: 'FWG 50', functie: 'Ambulanceverpleegkundige', min: '3.600', max: '4.700' },
      { schaal: 'FWG 55', functie: 'Senior ambulanceverpleegkundige', min: '4.000', max: '5.300' },
      { schaal: 'FWG 45', functie: 'Centralist meldkamer ambulancezorg', min: '3.200', max: '4.200' },
      { schaal: 'FWG 55', functie: 'Senior centralist / Teamleider', min: '3.900', max: '5.000' },
    ],
    keyPoints: [
      {
        title: 'Consignatie- en alarmdiensten',
        description:
          'Ambulancemedewerkers kunnen worden ingeroosterd voor consignatiediensten. De CAO bevat specifieke vergoedingen voor bereikbaarheidsdiensten en inkomende alarmmeldingen.',
      },
      {
        title: 'Hoge ORT-percentages',
        description:
          'Door de aard van het werk (24/7 beschikbaarheid) gelden in de CAO Ambulancezorg relatief hoge ORT-percentages voor avond-, nacht- en weekenddiensten.',
      },
      {
        title: 'Fysieke belasting',
        description:
          'De CAO bevat afspraken over fysieke belasting, re-integratie na verzuim en specifieke uitkeringsregelingen bij arbeidsongeschiktheid door zwaar werk.',
      },
      {
        title: 'PTSS-beleid',
        description:
          'Ambulancemedewerkers kunnen te maken krijgen met traumatische ervaringen. De CAO bevat afspraken over psychosociale ondersteuning en PTSS-beleid.',
      },
    ],
    faqs: [
      {
        question: 'Welke medewerkers vallen onder de CAO Ambulancezorg?',
        answer:
          'De CAO Ambulancezorg is van toepassing op medewerkers bij regionale ambulancevoorzieningen (RAV\'s): ambulanceverpleegkundigen, ambulancechauffeurs, centralisten en ondersteunend personeel.',
      },
      {
        question: 'Hoe hoog is de ORT in de CAO Ambulancezorg?',
        answer:
          'ORT-percentages in de CAO Ambulancezorg zijn hoger dan in veel andere zorgsectoren: avond/nacht maandag t/m vrijdag: 30%, zaterdag: 45%, zon- en feestdagen: 70% toeslag op het bruto uurloon.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in 2026?',
        answer:
          'In de CAO Ambulancezorg 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 afgesproken. Raadpleeg uw werkgever of vakbond voor de exacte bedragen.',
      },
      {
        question: 'Heb ik als ambulanceverpleegkundige recht op extra vakantiedagen?',
        answer:
          'Ambulancemedewerkers hebben recht op 30 vakantiedagen per jaar bij fulltime dienst, plus 8% vakantietoeslag. Dit is één dag meer dan het minimum in veel andere zorgsectoren.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris IC-Verpleegkundige', href: '/salaris/ic-verpleegkundige' },
    ],
    relatedVacancyQuery: 'Ambulanceverpleegkundige',
    accentColor: 'red',
  },

  // ── CAO Sociaal Werk ───────────────────────────────────────────────────────
  {
    slug: 'sociaal-werk',
    title: 'CAO Sociaal Werk',
    fullName: 'CAO Sociaal Werk',
    metaDescription:
      'Alles over de CAO Sociaal Werk 2026: salarisschalen, loonsverhoging en arbeidsvoorwaarden voor maatschappelijk werkers, sociaal-cultureel werkers en welzijnsmedewerkers.',
    sector: 'Welzijn, maatschappelijk werk en sociaal-cultureel werk',
    heroIntro:
      'De CAO Sociaal Werk regelt de arbeidsvoorwaarden voor medewerkers in het maatschappelijk werk, welzijn, sociaal-cultureel werk en aanverwante sectoren. Bekijk salarisschalen en arbeidsrechten.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 20, saturday: 35, sunday: 55, eveningLabel: 'ma–vr 20:00–07:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'Schaal 5', functie: 'Welzijnsmedewerker MBO', min: '2.400', max: '3.000' },
      { schaal: 'Schaal 6', functie: 'Maatschappelijk werker HBO', min: '2.800', max: '3.600' },
      { schaal: 'Schaal 7', functie: 'Senior maatschappelijk werker', min: '3.200', max: '4.100' },
      { schaal: 'Schaal 8', functie: 'Gedragswetenschapper / Teamleider', min: '3.700', max: '4.800' },
      { schaal: 'Schaal 9', functie: 'Manager / Coördinator welzijn', min: '4.200', max: '5.500' },
    ],
    keyPoints: [
      {
        title: 'Brede CAO, diverse functies',
        description:
          'De CAO Sociaal Werk omvat een breed scala aan functies: van buurtopbouwwerkers en jongerenwerkers tot schuldhulpverleners en maatschappelijk werkers.',
      },
      {
        title: 'Individueel Keuzebudget (IKB)',
        description:
          'Medewerkers ontvangen een IKB bestaande uit vakantiegeld, eindejaarsuitkering en extra verlofuren, naar eigen keuze in te zetten.',
      },
      {
        title: 'Werkdruk en registratielast',
        description:
          'De CAO bevat afspraken over werkdrukvermindering en de administratieve last voor medewerkers die cliënten begeleiden.',
      },
      {
        title: 'Pensioen via StiPP of eigen regeling',
        description:
          'Pensioenopbouw vindt veelal plaats via StiPP (voor kleinere organisaties) of een sectoraal pensioenfonds. De CAO legt de werkgeversbijdrage vast.',
      },
    ],
    faqs: [
      {
        question: 'Welke organisaties vallen onder de CAO Sociaal Werk?',
        answer:
          'De CAO Sociaal Werk is van toepassing op medewerkers bij welzijnsorganisaties, sociale wijkteams, maatschappelijk werk- en opbouwwerkorganisaties. Bekende werkgevers zijn Kwadraad, MEE, Humanitas en gemeentelijke welzijnsorganisaties.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in de CAO Sociaal Werk 2026?',
        answer:
          'In de CAO Sociaal Werk 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever of vakbond voor exacte bedragen.',
      },
      {
        question: 'Heeft de CAO Sociaal Werk ook een eindejaarsuitkering?',
        answer:
          'Ja, medewerkers ontvangen een eindejaarsuitkering van 8,33% van het jaarsalaris. Dit kan onderdeel zijn van het Individueel Keuzebudget (IKB).',
      },
      {
        question: 'Hoeveel vakantiedagen heb ik in de CAO Sociaal Werk?',
        answer:
          'Medewerkers hebben recht op minimaal 29 vakantiedagen per jaar bij fulltime dienstverband, plus 8% vakantietoeslag over het bruto jaarsalaris.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Sociaal Werker', href: '/salaris/sociaal-werker' },
      { label: 'Salaris Jeugdzorgwerker', href: '/salaris/jeugdzorgwerker' },
    ],
    relatedVacancyQuery: 'Sociaal werker',
    accentColor: 'indigo',
  },

  // ── CAO UMC's ──────────────────────────────────────────────────────────────
  {
    slug: 'umc',
    title: "CAO UMC's",
    fullName: "CAO Universitaire Medische Centra (UMC's)",
    metaDescription:
      "Alles over de CAO UMC's 2026: salarisschalen, toeslagen, loonsverhoging en arbeidsvoorwaarden voor medewerkers in Nederlandse universitaire medische centra.",
    sector: "Universitaire medische centra (UMC's)",
    heroIntro:
      "De CAO UMC's regelt de arbeidsvoorwaarden voor meer dan 80.000 medewerkers in de acht Nederlandse universitaire medische centra, waaronder Amsterdam UMC, Erasmus MC en UMCG.",
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 30,
    ort: { evening: 25, saturday: 40, sunday: 65, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'Schaal 4', functie: 'Medewerker ondersteuning / Assistent', min: '2.300', max: '2.900' },
      { schaal: 'Schaal 6', functie: 'Verpleegkundige niveau 4 / Laborant MBO', min: '2.900', max: '3.700' },
      { schaal: 'Schaal 7', functie: 'Verpleegkundige niveau 5 / Laborant HBO', min: '3.300', max: '4.500' },
      { schaal: 'Schaal 8', functie: 'IC-verpleegkundige / Research verpleegkundige', min: '3.800', max: '5.200' },
      { schaal: 'Schaal 9', functie: 'Nurse Practitioner / Klinisch chemicus', min: '4.400', max: '6.200' },
      { schaal: 'Schaal 10', functie: 'Physician Assistant / Senior specialist', min: '5.000', max: '7.200' },
    ],
    keyPoints: [
      {
        title: 'Wetenschappelijk werk en onderwijs',
        description:
          'UMC\'s combineren patiëntenzorg met wetenschappelijk onderzoek en medisch onderwijs. Medewerkers kunnen deelnemen aan onderzoeksprojecten en onderwijsactiviteiten.',
      },
      {
        title: 'Loopbaanmogelijkheden',
        description:
          'De omvang van UMC\'s biedt uitgebreide doorgroeimogelijkheden, van verpleegkundige naar nurse practitioner of van laborant naar senior onderzoeker.',
      },
      {
        title: 'Pensioenen via ABP of PFZW',
        description:
          'UMC\'s bouwen pensioen op via ABP (Algemeen Burgerlijk Pensioenfonds) of PFZW, afhankelijk van de specifieke instelling en functie.',
      },
      {
        title: 'Onkostenvergoedingen voor onderzoekers',
        description:
          'Medewerkers die betrokken zijn bij wetenschappelijk onderzoek kunnen aanspraak maken op specifieke onkostenvergoedingen voor congresbezoek en publicaties.',
      },
    ],
    faqs: [
      {
        question: "Welke ziekenhuizen vallen onder de CAO UMC's?",
        answer:
          "De CAO UMC's is van toepassing op medewerkers in de acht Nederlandse universitaire medische centra: Amsterdam UMC, Erasmus MC Rotterdam, UMCG Groningen, UMCU Utrecht, Radboudumc Nijmegen, Maastricht UMC+, LUMC Leiden en UMCN Nijmegen. Let op: dit is een andere CAO dan de reguliere CAO Ziekenhuizen.",
      },
      {
        question: "Verschilt de CAO UMC's van de CAO Ziekenhuizen?",
        answer:
          "Ja, de CAO UMC's is een aparte CAO specifiek voor universitaire medische centra. De salarisschalen, loopbaanmogelijkheden en arbeidsvoorwaarden kunnen afwijken van de reguliere CAO Ziekenhuizen.",
      },
      {
        question: "Hoe hoog is de loonsverhoging in de CAO UMC's 2026?",
        answer:
          "In de CAO UMC's 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever voor de exacte bedragen.",
      },
      {
        question: "Hoe hoog is de ORT in de CAO UMC's?",
        answer:
          "ORT-percentages in de CAO UMC's: avond/nacht maandag t/m vrijdag: 25%, zaterdag: 40%, zon- en feestdagen: 65% toeslag op het bruto uurloon.",
      },
    ],
    relatedProfessions: [
      { label: 'Salaris IC-Verpleegkundige', href: '/salaris/ic-verpleegkundige' },
      { label: 'Salaris Nurse Practitioner', href: '/salaris/nurse-practitioner' },
      { label: 'Salaris Physician Assistant', href: '/salaris/physician-assistant' },
    ],
    relatedVacancyQuery: 'Verpleegkundige',
    accentColor: 'cyan',
  },

  // ── CAO Kraamzorg ──────────────────────────────────────────────────────────
  {
    slug: 'kraamzorg',
    title: 'CAO Kraamzorg',
    fullName: 'CAO Kraamzorg',
    metaDescription:
      'Alles over de CAO Kraamzorg 2026: salarisschalen, toeslagen, loonsverhoging en arbeidsvoorwaarden voor kraamverzorgenden en kraamzorgcoördinatoren.',
    sector: 'Kraamzorg',
    heroIntro:
      'De CAO Kraamzorg regelt de arbeidsvoorwaarden voor kraamverzorgenden en andere medewerkers bij kraamzorgorganisaties in Nederland. Bekijk salarisschalen, toeslagen en arbeidsrechten.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.5,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 22, saturday: 35, sunday: 55, eveningLabel: 'ma–vr 20:00–06:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'FWG 25', functie: 'Kraamverzorgende (starter)', min: '2.350', max: '2.800' },
      { schaal: 'FWG 35', functie: 'Kraamverzorgende (ervaren)', min: '2.700', max: '3.400' },
      { schaal: 'FWG 40', functie: 'Senior kraamverzorgende', min: '3.000', max: '3.800' },
      { schaal: 'FWG 45', functie: 'Kraamzorgcoördinator', min: '3.200', max: '4.100' },
    ],
    keyPoints: [
      {
        title: 'Onregelmatige werktijden',
        description:
          'Kraamverzorgenden werken rond bevallingen die dag en nacht kunnen plaatsvinden. De CAO bevat specifieke toeslagen voor avond-, nacht- en weekenddiensten.',
      },
      {
        title: 'Reiskostenvergoeding en reistijd',
        description:
          'Kraamverzorgenden reizen doorgaans naar gezinnen toe. De CAO bevat afspraken over reiskostenvergoeding per kilometer en vergoeding van reistijd.',
      },
      {
        title: 'Opleiding en certificering',
        description:
          'De CAO bevat afspraken over vergoeding van de kraamverzorgende-opleiding (niveau 3 of 4) en bijscholing, inclusief KNOV-bijscholingseisen.',
      },
      {
        title: 'Deeltijdwerk',
        description:
          'Veel kraamverzorgenden werken in deeltijd. De CAO bevat gelijke rechten voor deeltijdwerkers ten aanzien van vakantiegeld, eindejaarsuitkering en ORT.',
      },
    ],
    faqs: [
      {
        question: 'Welke organisaties vallen onder de CAO Kraamzorg?',
        answer:
          'De CAO Kraamzorg is van toepassing op medewerkers bij erkende kraamzorgaanbieders in Nederland. Bekende werkgevers zijn Kraamzorg de Waarden, Kraamzorg Zutphen, Ben Jij ZZP Kraamzorg en vergelijkbare organisaties.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in de CAO Kraamzorg 2026?',
        answer:
          'In de CAO Kraamzorg 2025-2026 is een loonsverhoging van 3,5% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever voor de exacte bedragen.',
      },
      {
        question: 'Wordt mijn reistijd vergoed als kraamverzorgende?',
        answer:
          'Ja, in de CAO Kraamzorg zijn afspraken opgenomen over reistijdvergoeding. De exacte regeling hangt af van uw arbeidsovereenkomst en de specifieke CAO-tekst die op uw werkgever van toepassing is.',
      },
      {
        question: 'Heb ik als oproepkracht in de kraamzorg recht op toeslagen?',
        answer:
          'Ja, ook oproepkrachten in de kraamzorg hebben recht op ORT bij onregelmatige diensten. De exacte regelingen zijn vastgelegd in uw arbeidsovereenkomst en de CAO Kraamzorg.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Kraamverzorgende', href: '/salaris/kraamverzorgende' },
      { label: 'Salaris Verpleegkundige', href: '/salaris/verpleegkundige' },
    ],
    relatedVacancyQuery: 'Kraamverzorgende',
    accentColor: 'pink',
  },

  // ── CAO Apotheken ──────────────────────────────────────────────────────────
  {
    slug: 'apotheken',
    title: 'CAO Apotheken',
    fullName: 'CAO Apotheken',
    metaDescription:
      'Alles over de CAO Apotheken 2026: salarisschalen, loonsverhoging, toeslagen en arbeidsvoorwaarden voor apothekersassistenten, farmaceutisch consulenten en apotheekhoudend medewerkers.',
    sector: 'Openbare apotheken en ziekenhuisapotheken',
    heroIntro:
      'De CAO Apotheken regelt de arbeidsvoorwaarden voor medewerkers in openbare apotheken en ziekenhuisapotheken. Van apothekersassistenten tot farmaceutisch consulenten en apothekers.',
    looptijd: '1 januari 2025 – 31 december 2026',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    vacationDays: 29,
    ort: { evening: 20, saturday: 30, sunday: 50, eveningLabel: 'ma–vr 18:00–08:00' },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    fwgRows: [
      { schaal: 'Schaal A', functie: 'Apothekersassistent (starter)', min: '2.400', max: '2.900' },
      { schaal: 'Schaal B', functie: 'Apothekersassistent (ervaren)', min: '2.700', max: '3.300' },
      { schaal: 'Schaal C', functie: 'Senior apothekersassistent / Farmaceutisch consulent', min: '3.000', max: '3.900' },
      { schaal: 'Schaal D', functie: 'Teamleider apotheek / Praktijkopleider', min: '3.400', max: '4.400' },
      { schaal: 'Schaal E', functie: 'Provisor / Apotheker in loondienst', min: '4.200', max: '6.500' },
    ],
    keyPoints: [
      {
        title: 'Avond- en weekenddiensten',
        description:
          'Apotheken zijn steeds vaker ook \'s avonds en in het weekend bereikbaar. De CAO bevat toeslagen voor diensten buiten reguliere openingstijden.',
      },
      {
        title: 'BIG-registratie voor apothekers',
        description:
          'Apothekers zijn verplicht geregistreerd in het BIG-register. De CAO bevat afspraken over vergoeding van herregistratiekosten en verplichte nascholing.',
      },
      {
        title: 'Farmaceutische zorg en medicatiebeoordeling',
        description:
          'Farmaceutisch consulenten en apothekersassistenten spelen een steeds grotere rol in medicatiebeoordeling. De CAO bevat afspraken over beloning van deze uitgebreidere taken.',
      },
      {
        title: 'Dienstapotheken en nachtdiensten',
        description:
          'Medewerkers bij dienstapotheken (bereikbaar 24/7) ontvangen specifieke toeslagen voor nacht- en alarmdiensten bovenop de reguliere ORT.',
      },
    ],
    faqs: [
      {
        question: 'Welke medewerkers vallen onder de CAO Apotheken?',
        answer:
          'De CAO Apotheken is van toepassing op medewerkers in openbare apotheken en ziekenhuisapotheken: apothekersassistenten, farmaceutisch consulenten, provisors en apothekers in loondienst. ZZP-apothekers vallen niet onder de CAO.',
      },
      {
        question: 'Hoe hoog is de loonsverhoging in de CAO Apotheken 2026?',
        answer:
          'In de CAO Apotheken 2025-2026 is een loonsverhoging van 3% per 1 januari 2026 overeengekomen. Raadpleeg uw werkgever of de KNMP voor de exacte bedragen.',
      },
      {
        question: 'Hoe hoog is de toeslag voor avonddiensten in de apotheek?',
        answer:
          'Voor diensten buiten reguliere openingstijden gelden in de CAO Apotheken de volgende toeslagen: avond (ma–vr na 18:00): 20%, zaterdag: 30%, zon- en feestdagen: 50% op het bruto uurloon.',
      },
      {
        question: 'Heb ik als apothekersassistent recht op een eindejaarsuitkering?',
        answer:
          'Ja, medewerkers in de apotheek hebben recht op een eindejaarsuitkering van 8,33% van het bruto jaarsalaris (dertiende maand), uitbetaald in november of december.',
      },
    ],
    relatedProfessions: [
      { label: 'Salaris Doktersassistent', href: '/salaris/doktersassistent' },
    ],
    relatedVacancyQuery: 'Apothekersassistent',
    accentColor: 'lime',
  },
];
