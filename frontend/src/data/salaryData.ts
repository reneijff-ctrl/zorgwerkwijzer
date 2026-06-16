/**
 * Centrale salarisdata voor ZorgWerkwijzer.
 *
 * Voeg hier een nieuw beroep toe om automatisch:
 *  - /salaris/[slug]      (via generateStaticParams)
 *  - /salaris             (overzichtspagina)
 *  - Navbar-suggesties
 * te genereren — zonder nieuwe UI-code.
 *
 * Bij een CAO-akkoord: alleen de schalen in fwgRows aanpassen.
 */


// ─── FWG-schaal tabel ─────────────────────────────────────────────────────────

export interface FwgRow {
  /** FWG-schaalnummer, bijv. "FWG 40" */
  scale: string;
  /** Omschrijving, bijv. "MBO niveau 3" */
  label: string;
  /** Startsalaris bruto per maand (36u) */
  min: string;
  /** Eindsalaris bruto per maand (36u) */
  max: string;
  /** Uurloon range */
  hourlyRange: string;
}

// ─── Doorgroeimogelijkheden ───────────────────────────────────────────────────

export interface GrowthItem {
  title: string;
  description: string;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── Hoofd-beroepsdefinitie ───────────────────────────────────────────────────

export interface ProfessionSalaryData {
  /** URL-slug, bijv. "verpleegkundige" → /salaris/verpleegkundige */
  slug: string;
  /** Weergavenaam */
  name: string;
  /** CAO-identifier, verwijst naar caos.ts */
  caoId: string;
  /** Korte SEO-meta description */
  metaDescription: string;
  /** Hero: gemiddeld salaris weergave, bijv. "€3.325 – €5.650" */
  avgSalaryDisplay: string;
  /** Hero: badge-tekst, bijv. "Update: CAO VVT 2025/2026" */
  heroBadge: string;
  /** Hero: intro-tekst (1–2 zinnen) */
  heroIntro: string;
  /** Korte intro-paragraaf op de pagina (max 100 woorden) */
  intro: string;
  /** FWG-salaristabel */
  fwgRows: FwgRow[];
  /** Extra arbeidsvoorwaarden (bullet-list) */
  benefits: string[];
  /** Doorgroeimogelijkheden */
  growth: GrowthItem[];
  /** FAQ */
  faqs: FaqItem[];
  /** Andere salarispagina's om naar te linken in de sidebar */
  relatedSalaryLinks: { href: string; label: string }[];
  /** Beroepspagina (optioneel) */
  beroepHref?: string;
  /** Bijbehorende CAO-slug voor sidebar-link (optioneel) */
  relatedCaoSlug?: string;
  /** Bijbehorende CAO-naam voor sidebar-label (optioneel) */
  relatedCaoName?: string;
  /** Bijbehorende opleidingspagina-slug (optioneel) */
  relatedEducationSlug?: string;
  /** Sector voor vacaturesfilter, bijv. "Verpleegkundige" */
  vacatureProfession: string;
}

// ─── Beroepen-register ────────────────────────────────────────────────────────

export const professions: ProfessionSalaryData[] = [
  // ── Verpleegkundige ────────────────────────────────────────────────────────
  {
    slug: 'verpleegkundige',
    name: 'Verpleegkundige',
    caoId: 'vvt',
    metaDescription:
      'Salaris Verpleegkundige 2026: actuele FWG-schalen, uurloon en ORT conform CAO VVT. Bereken direct je netto maandsalaris.',
    avgSalaryDisplay: '€3.325 – €5.650',
    heroBadge: 'Update: CAO VVT 2025/2026',
    heroIntro:
      'Benieuwd naar het salaris van een verpleegkundige? Bekijk de actuele salarisschalen, ORT-toeslagen en doorgroeimogelijkheden conform de CAO VVT 2026.',
    intro:
      'Als verpleegkundige vervul je een cruciale rol in de Nederlandse gezondheidszorg. Je salaris hangt af van opleidingsniveau (MBO of HBO) en werkervaring. Onregelmatigheidstoeslagen (ORT) kunnen je inkomen aanzienlijk verhogen.',
    fwgRows: [
      { scale: 'FWG 45', label: 'MBO niveau 4', min: '€3.325', max: '€4.625', hourlyRange: '€21,30 – €29,60' },
      { scale: 'FWG 50', label: 'MBO/HBO start', min: '€3.500', max: '€5.215', hourlyRange: '€22,40 – €33,40' },
      { scale: 'FWG 55', label: 'HBO niveau 6', min: '€3.770', max: '€5.650', hourlyRange: '€24,10 – €36,20' },
    ],
    benefits: [
      '8% Vakantiegeld (uitbetaald in mei)',
      '8,33% Eindejaarsuitkering (december)',
      'ORT: 22% (avond) tot 60% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Pensioenopbouw bij PFZW',
      'Studiebudget en bijscholingsmogelijkheden',
    ],
    growth: [
      { title: 'Gespecialiseerd verpleegkundige', description: 'Ontwikkel je in dementie, oncologie of wondzorg (FWG 50–55).' },
      { title: 'Regieverpleegkundige (HBO)', description: 'Neem de regie over het zorgproces op afdelingsniveau.' },
      { title: 'Nurse Practitioner', description: 'Doorgroei naar uitgebreide bevoegdheden met HBO-master (FWG 60+).' },
      { title: 'Teamleider / Locatiemanager', description: 'Leidinggevende rol met FWG 60–65 en hoger maandsalaris.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een verpleegkundige gemiddeld in 2026?',
        answer:
          'In 2026 verdient een verpleegkundige in de VVT gemiddeld tussen de €3.325 (MBO, FWG 45) en €5.650 (HBO, FWG 55) bruto per maand op basis van een 36-urige werkweek. Dit is exclusief ORT en vakantiegeld.',
      },
      {
        question: 'In welke FWG-schaal valt een verpleegkundige?',
        answer:
          'MBO-verpleegkundigen (niveau 4) vallen in FWG 45 of FWG 50. HBO-verpleegkundigen (niveau 6) worden ingeschaald in FWG 50 of FWG 55. Gespecialiseerde verpleegkundigen kunnen FWG 60 bereiken.',
      },
      {
        question: 'Hoeveel bedraagt de onregelmatigheidstoeslag (ORT)?',
        answer:
          'De ORT varieert van 22% (avond, ma-vr 20:00–06:00) tot 60% (feestdagen). Voor een verpleegkundige die veel onregelmatig werkt kan dit €400 – €700 extra bruto per maand betekenen.',
      },
      {
        question: 'Hoe hoog is de eindejaarsuitkering?',
        answer:
          'Verpleegkundigen in de VVT hebben recht op een eindejaarsuitkering van 8,33% — gelijk aan een volledige dertiende maand, uitbetaald in december.',
      },
      {
        question: 'Waar kan ik mijn netto salaris berekenen?',
        answer:
          'Gebruik onze Salaris Calculator op deze website. Je berekent direct je netto maandsalaris inclusief ORT en vakantiegeld.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verzorgende-ig', label: 'Verzorgende IG Salaris' },
      { href: '/salaris/helpende-plus', label: 'Helpende Plus Salaris' },
      { href: '/salaris/wijkverpleegkundige', label: 'Wijkverpleegkundige Salaris' },
      { href: '/cao-vvt', label: 'Alles over CAO VVT' },
    ],
    vacatureProfession: 'Verpleegkundige',
    beroepHref: '/beroepen/verpleegkundige',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedEducationSlug: 'verpleegkunde-hbo',
  },

  // ── Verzorgende IG ─────────────────────────────────────────────────────────
  {
    slug: 'verzorgende-ig',
    name: 'Verzorgende IG',
    caoId: 'vvt',
    metaDescription:
      'Salaris Verzorgende IG 2026: actuele FWG 40-schalen, uurloon en ORT conform CAO VVT. Bereken direct je netto maandsalaris.',
    avgSalaryDisplay: '€2.881 – €3.825',
    heroBadge: 'CAO VVT 2025/2026',
    heroIntro:
      'Benieuwd wat je verdient als Verzorgende IG? Bekijk de actuele salarisschalen in FWG 40, uurlonen en bereken je totale inkomen inclusief ORT.',
    intro:
      'Als Verzorgende Individuele Gezondheidszorg (IG) ben je verantwoordelijk voor dagelijkse verzorging en verpleegtechnische handelingen. Het salaris is in 2026 gestegen door afspraken in de CAO VVT. Toeslagen voor onregelmatig werk verhogen je inkomen significant.',
    fwgRows: [
      { scale: 'FWG 40', label: 'Start (Trede 0)', min: '€2.881', max: '€2.881', hourlyRange: '€18,41' },
      { scale: 'FWG 40', label: 'Trede 5', min: '€3.295', max: '€3.295', hourlyRange: '€21,05' },
      { scale: 'FWG 40', label: 'Maximum (Trede 10)', min: '€3.825', max: '€3.825', hourlyRange: '€24,45' },
    ],
    benefits: [
      '8% Vakantiegeld (uitbetaald in mei)',
      '8,33% Eindejaarsuitkering (december)',
      'ORT: 22% (avond) tot 60% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Pensioenopbouw bij PFZW',
      'Fietsplan & sportbudget',
    ],
    growth: [
      { title: 'Verpleegkundige (doorstroom)', description: 'Via BBL of BOL doorstromen naar MBO niveau 4 verpleegkundige (FWG 45).' },
      { title: 'Gespecialiseerde rol', description: 'Wondverzorging, palliatieve zorg of dementie als aandachtsgebied.' },
      { title: 'Teamleider', description: 'Met ervaring en aanvullende scholing doorgroeien naar leidinggevende rol.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Verzorgende IG gemiddeld in 2026?',
        answer:
          'Een Verzorgende IG verdient in 2026 gemiddeld tussen de €2.881 en €3.825 bruto per maand op basis van 36 uur. Afhankelijk van werkervaring en inschaling in de CAO VVT.',
      },
      {
        question: 'In welke salarisschaal valt een Verzorgende IG?',
        answer:
          'In de CAO VVT wordt een Verzorgende IG ingeschaald in FWG 40. Gespecialiseerde rollen of extra verantwoordelijkheden kunnen FWG 45 rechtvaardigen.',
      },
      {
        question: 'Wat is het uurloon van een Verzorgende IG?',
        answer:
          'Het uurloon ligt in 2026 tussen de €18,41 en €24,45 bruto. Exclusief ORT, vakantiegeld en eindejaarsuitkering.',
      },
      {
        question: 'Hoe hoog is de ORT voor een Verzorgende IG?',
        answer:
          'De ORT varieert van 22% (avond, ma-vr 20:00–06:00) tot 60% (feestdagen). Voor veel Verzorgenden IG betekent dit honderden euro\'s extra per maand.',
      },
      {
        question: 'Heeft een Verzorgende IG recht op een dertiende maand?',
        answer:
          'Ja. De CAO VVT kent een eindejaarsuitkering van 8,33% — gelijk aan een volledige dertiende maand, uitbetaald in december.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/salaris/helpende-plus', label: 'Helpende Plus Salaris' },
      { href: '/cao-vvt', label: 'Alles over CAO VVT' },
    ],
    vacatureProfession: 'Verzorgende IG',
    beroepHref: '/beroepen/verzorgende-ig',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedEducationSlug: 'verzorgende-ig',
  },

  // ── Helpende ───────────────────────────────────────────────────────────────
  {
    slug: 'helpende',
    name: 'Helpende',
    caoId: 'vvt',
    metaDescription:
      'Salaris Helpende 2026: actuele FWG 25-schalen, uurloon en ORT conform CAO VVT. Bereken direct je netto maandsalaris.',
    avgSalaryDisplay: '€2.300 – €2.700',
    heroBadge: 'CAO VVT 2025/2026',
    heroIntro:
      'Wat verdient een Helpende in 2026? Bekijk de actuele salarisschalen, uurlonen en de ORT-toeslagen conform de CAO VVT.',
    intro:
      'Als Helpende ondersteun je cliënten bij huishoudelijke activiteiten en lichte persoonlijke verzorging. Het salaris valt conform de CAO VVT onder FWG 25. Doorgroei naar Helpende Plus (FWG 30) is mogelijk via aanvullende scholing.',
    fwgRows: [
      { scale: 'FWG 25', label: 'Start (Trede 0)', min: '€2.300', max: '€2.300', hourlyRange: '€14,70' },
      { scale: 'FWG 25', label: 'Trede 5', min: '€2.500', max: '€2.500', hourlyRange: '€15,97' },
      { scale: 'FWG 25', label: 'Maximum (Trede 10)', min: '€2.700', max: '€2.700', hourlyRange: '€17,25' },
    ],
    benefits: [
      '8% Vakantiegeld (uitbetaald in mei)',
      '8,33% Eindejaarsuitkering (december)',
      'ORT: 22% (avond) tot 60% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Pensioenopbouw bij PFZW',
    ],
    growth: [
      { title: 'Helpende Plus (aanvullende scholing)', description: 'Via certificering doorgroeien naar Helpende Plus (FWG 30).' },
      { title: 'Verzorgende IG (doorstroom)', description: 'Via BBL of BOL doorstromen naar MBO niveau 3 (FWG 40).' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Helpende in 2026?',
        answer:
          'Een Helpende verdient in 2026 tussen de €2.300 en €2.700 bruto per maand op basis van 36 uur, afhankelijk van werkervaring (trede in FWG 25).',
      },
      {
        question: 'In welke FWG-schaal valt een Helpende?',
        answer:
          'Een Helpende wordt in de CAO VVT ingeschaald in FWG 25.',
      },
      {
        question: 'Wat is het verschil tussen Helpende en Helpende Plus?',
        answer:
          'Een Helpende (FWG 25) voert huishoudelijke en lichte verzorgende taken uit. Een Helpende Plus (FWG 30) heeft aanvullende scholing gevolgd en mag ook eenvoudige verpleegtechnische handelingen uitvoeren.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/helpende-plus', label: 'Helpende Plus Salaris' },
      { href: '/salaris/verzorgende-ig', label: 'Verzorgende IG Salaris' },
      { href: '/cao-vvt', label: 'Alles over CAO VVT' },
    ],
    vacatureProfession: 'Helpende',
    beroepHref: '/beroepen/helpende',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedEducationSlug: 'helpende-zorg-welzijn',
  },

  // ── Helpende Plus ──────────────────────────────────────────────────────────
  {
    slug: 'helpende-plus',
    name: 'Helpende Plus',
    caoId: 'vvt',
    metaDescription:
      'Salaris Helpende Plus 2026: actuele FWG 30-schalen, uurloon en ORT conform CAO VVT. Bereken direct je netto maandsalaris.',
    avgSalaryDisplay: '€2.500 – €3.000',
    heroBadge: 'CAO VVT 2025/2026',
    heroIntro:
      'Wat verdient een Helpende Plus in 2026? Bekijk de actuele salarisschalen, uurlonen en de ORT-toeslagen conform de CAO VVT.',
    intro:
      'Als Helpende Plus ondersteun je cliënten bij dagelijkse activiteiten en eenvoudige verpleegtechnische handelingen. Het salaris valt conform de CAO VVT onder FWG 30. Toeslagen voor onregelmatig werk zijn ook voor Helpenden Plus van toepassing.',
    fwgRows: [
      { scale: 'FWG 30', label: 'Start (Trede 0)', min: '€2.500', max: '€2.500', hourlyRange: '€15,97' },
      { scale: 'FWG 30', label: 'Trede 5', min: '€2.720', max: '€2.720', hourlyRange: '€17,38' },
      { scale: 'FWG 30', label: 'Maximum (Trede 10)', min: '€2.990', max: '€2.990', hourlyRange: '€19,10' },
    ],
    benefits: [
      '8% Vakantiegeld (uitbetaald in mei)',
      '8,33% Eindejaarsuitkering (december)',
      'ORT: 22% (avond) tot 60% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Pensioenopbouw bij PFZW',
    ],
    growth: [
      { title: 'Verzorgende IG (doorstroom)', description: 'Via BBL of BOL doorstromen naar MBO niveau 3 (FWG 40).' },
      { title: 'Thuiszorgmedewerker', description: 'Specialiseren in zelfstandige thuiszorgverlening.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Helpende Plus in 2026?',
        answer:
          'Een Helpende Plus verdient in 2026 tussen de €2.500 en €2.990 bruto per maand op basis van 36 uur, afhankelijk van werkervaring (trede in FWG 30).',
      },
      {
        question: 'In welke FWG-schaal valt een Helpende Plus?',
        answer:
          'Een Helpende Plus wordt in de CAO VVT ingeschaald in FWG 30.',
      },
      {
        question: 'Heeft een Helpende Plus recht op ORT?',
        answer:
          'Ja. Conform de CAO VVT gelden dezelfde ORT-percentages als voor andere functies: 22% (avond) tot 60% (feestdagen).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verzorgende-ig', label: 'Verzorgende IG Salaris' },
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/cao-vvt', label: 'Alles over CAO VVT' },
    ],
    vacatureProfession: 'Helpende',
    beroepHref: '/beroepen/helpende-plus',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedEducationSlug: 'helpende-zorg-welzijn',
  },

  // ── Doktersassistent ───────────────────────────────────────────────────────
  {
    slug: 'doktersassistent',
    name: 'Doktersassistent',
    caoId: 'huisartsenzorg',
    metaDescription:
      'Salaris Doktersassistent 2026: actuele salarisschalen, uurloon en toeslagen conform CAO Huisartsenzorg. Bereken direct je netto salaris.',
    avgSalaryDisplay: '€2.600 – €3.800',
    heroBadge: 'CAO Huisartsenzorg 2025/2026',
    heroIntro:
      'Wat verdient een doktersassistent in 2026? Bekijk de actuele salarisschalen conform de CAO Huisartsenzorg en bereken je totale inkomen.',
    intro:
      'Als doktersassistent ben je de spil van de huisartsenpraktijk: je ondersteunt de huisarts, voert triagegesprekken en verzorgt patiëntadministratie. Het salaris is geregeld in de CAO Huisartsenzorg.',
    fwgRows: [
      { scale: 'Schaal 4', label: 'Start / basis', min: '€2.600', max: '€2.600', hourlyRange: '€16,62' },
      { scale: 'Schaal 5', label: 'Ervaren', min: '€3.100', max: '€3.100', hourlyRange: '€19,81' },
      { scale: 'Schaal 6', label: 'Senior / specialisatie', min: '€3.800', max: '€3.800', hourlyRange: '€24,29' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond- en weekenddiensten',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget',
    ],
    growth: [
      { title: 'Praktijkondersteuner (POH)', description: 'Met aanvullende scholing doorgroeien naar POH-functie.' },
      { title: 'Triagist', description: 'Specialiseren in telefonische triage op de HAP.' },
      { title: 'Praktijkmanager', description: 'Leidinggevende en organisatorische rol in de praktijk.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een doktersassistent in 2026?',
        answer:
          'Een doktersassistent verdient in 2026 tussen de €2.600 en €3.800 bruto per maand, afhankelijk van ervaring en schaal in de CAO Huisartsenzorg.',
      },
      {
        question: 'Welke CAO geldt voor een doktersassistent?',
        answer:
          'De CAO Huisartsenzorg is van toepassing op doktersassistenten werkzaam in huisartsenpraktijken en huisartsenposten (HAP).',
      },
      {
        question: 'Heeft een doktersassistent recht op vakantiegeld?',
        answer:
          'Ja. Conform de CAO Huisartsenzorg bedraagt de vakantiebijslag 8% van het bruto jaarsalaris, uitbetaald in mei.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/praktijkondersteuner', label: 'Praktijkondersteuner (POH)' },
      { href: '/salaris/triagist', label: 'Triagist Salaris' },
      { href: '/cao/huisartsenzorg', label: 'CAO Huisartsenzorg' },
    ],
    vacatureProfession: 'Doktersassistent',
    beroepHref: '/beroepen/doktersassistent',
    relatedCaoSlug: 'huisartsenzorg',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedEducationSlug: 'doktersassistent',
  },

  // ── Wijkverpleegkundige ────────────────────────────────────────────────────
  {
    slug: 'wijkverpleegkundige',
    name: 'Wijkverpleegkundige',
    caoId: 'vvt',
    metaDescription:
      'Salaris Wijkverpleegkundige 2026: actuele FWG-schalen, uurloon en ORT conform CAO VVT. Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€3.500 – €5.650',
    heroBadge: 'Update: CAO VVT 2025/2026',
    heroIntro:
      'Wat verdient een wijkverpleegkundige in 2026? Bekijk de actuele salarisschalen, uurlonen en bereken je totale inkomen inclusief ORT.',
    intro:
      'Als wijkverpleegkundige werk je zelfstandig in de thuiszorg en beoordeel je zelfstandig de zorgbehoefte van cliënten. Je valt onder de CAO VVT en wordt doorgaans ingeschaald in FWG 50 of FWG 55 afhankelijk van opleidingsniveau en verantwoordelijkheid.',
    fwgRows: [
      { scale: 'FWG 50', label: 'HBO-start / regie', min: '€3.500', max: '€5.215', hourlyRange: '€22,40 – €33,40' },
      { scale: 'FWG 55', label: 'Senior wijkverpleegkundige', min: '€3.770', max: '€5.650', hourlyRange: '€24,10 – €36,20' },
    ],
    benefits: [
      '8% Vakantiegeld (mei)',
      '8,33% Eindejaarsuitkering (december)',
      'ORT: 22% (avond) tot 60% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Pensioenopbouw bij PFZW',
      'Leasefiets of kilometervergoeding voor thuis-ritten',
    ],
    growth: [
      { title: 'Nurse Practitioner', description: 'Met HBO-master uitbreiden naar uitgebreide bevoegdheden (FWG 60+).' },
      { title: 'Kwaliteitsverpleegkundige', description: 'Verantwoordelijk voor kwaliteitszorg in de wijk.' },
      { title: 'Teamcoördinator thuiszorg', description: 'Leidinggevende rol voor een team wijkverpleegkundigen.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een wijkverpleegkundige in 2026?',
        answer:
          'Een wijkverpleegkundige verdient in 2026 tussen de €3.500 en €5.650 bruto per maand (FWG 50–55 conform CAO VVT), op basis van een 36-urige werkweek.',
      },
      {
        question: 'In welke FWG-schaal valt een wijkverpleegkundige?',
        answer:
          'Wijkverpleegkundigen worden in de CAO VVT doorgaans ingeschaald in FWG 50 (HBO-start of regierol) of FWG 55 (senior met ruime ervaring).',
      },
      {
        question: 'Werkt een wijkverpleegkundige ook onregelmatig?',
        answer:
          'Ja. In de thuiszorg werken wijkverpleegkundigen ook avonden en weekenden. De CAO VVT ORT-percentages zijn van toepassing: 22% (avond) tot 60% (feestdagen).',
      },
      {
        question: 'Wat is het verschil met een reguliere verpleegkundige?',
        answer:
          'Een wijkverpleegkundige beoordeelt zelfstandig de zorgbehoefte van cliënten thuis (indicatiestelling) — een bevoegdheid die reguliere verpleegkundigen in de instelling niet hebben. Dit rechtvaardigt doorgaans een hogere FWG-schaal.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/salaris/verzorgende-ig', label: 'Verzorgende IG Salaris' },
      { href: '/salaris/nurse-practitioner', label: 'Nurse Practitioner Salaris' },
      { href: '/cao-vvt', label: 'Alles over CAO VVT' },
    ],
    vacatureProfession: 'Wijkverpleegkundige',
    beroepHref: '/beroepen/wijkverpleegkundige',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedEducationSlug: 'verpleegkunde-hbo',
  },

  // ── GZ-Psycholoog ──────────────────────────────────────────────────────────
  {
    slug: 'gz-psycholoog',
    name: 'GZ-Psycholoog',
    caoId: 'ggz',
    metaDescription:
      'Salaris GZ-Psycholoog 2026: actuele salarisschalen conform CAO GGZ. Wat verdient een gz-psycholoog? Bereken je netto salaris.',
    avgSalaryDisplay: '€4.400 – €6.500',
    heroBadge: 'CAO GGZ 2025/2026',
    heroIntro:
      'Wat verdient een GZ-Psycholoog in 2026? Bekijk de actuele salarisschalen conform de CAO GGZ en bereken je totale inkomen.',
    intro:
      'Als GZ-Psycholoog (Gezondheidszorgpsycholoog) ben je BIG-geregistreerd en voer je zelfstandig psychodiagnostiek en behandelingen uit. Je valt onder de CAO GGZ en wordt ingeschaald op basis van opleiding en verantwoordelijkheid.',
    fwgRows: [
      { scale: 'FWG 60', label: 'Start GZ-Psycholoog', min: '€4.400', max: '€4.400', hourlyRange: '€28,12' },
      { scale: 'FWG 65', label: 'Ervaren GZ-Psycholoog', min: '€5.200', max: '€5.200', hourlyRange: '€33,25' },
      { scale: 'FWG 70', label: 'Senior / coördinator', min: '€6.500', max: '€6.500', hourlyRange: '€41,56' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond- en weekenddiensten (crisis/poli)',
      'Reiskostenvergoeding €0,21 per km',
      'Supervisiebudget en BIG-herregistratiebudget',
      'Studiedagen en congresbezoek',
    ],
    growth: [
      { title: 'Klinisch Psycholoog', description: 'Na aanvullende opleiding: klinisch psycholoog BIG-II (FWG 70+).' },
      { title: 'Psychotherapeut', description: 'BIG-geregistreerd psychotherapeut met uitgebreide behandelbevoegdheid.' },
      { title: 'Hoofdbehandelaar / Teamleider', description: 'Coördinerende rol binnen GGZ-team of polikliniek.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een GZ-Psycholoog in 2026?',
        answer:
          'Een GZ-Psycholoog verdient in 2026 tussen de €4.400 en €6.500 bruto per maand conform de CAO GGZ, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Welke CAO geldt voor een GZ-Psycholoog?',
        answer:
          'GZ-Psychologen werkzaam in GGZ-instellingen vallen onder de CAO GGZ. Bij ziekenhuizen (poliklinische GGZ) geldt de CAO Ziekenhuizen.',
      },
      {
        question: 'Is een GZ-Psycholoog BIG-geregistreerd?',
        answer:
          'Ja. De titel GZ-Psycholoog is wettelijk beschermd en vereist BIG-registratie (BIG-I). Herregistratie is elke 5 jaar verplicht.',
      },
      {
        question: 'Wat is het verschil tussen een GZ-Psycholoog en een Klinisch Psycholoog?',
        answer:
          'Een Klinisch Psycholoog heeft een aanvullende specialisatieopleiding gevolgd (BIG-II) en is bevoegd complexere en langerdurende behandelingen zelfstandig uit te voeren.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/klinisch-psycholoog', label: 'Klinisch Psycholoog Salaris' },
      { href: '/salaris/psychotherapeut', label: 'Psychotherapeut Salaris' },
      { href: '/salaris/psychiatrisch-verpleegkundige', label: 'Psychiatrisch Verpleegkundige' },
      { href: '/cao/ggz', label: 'CAO GGZ' },
    ],
    vacatureProfession: 'GZ-Psycholoog',
    beroepHref: '/beroepen/gz-psycholoog',
    relatedCaoSlug: 'ggz',
    relatedCaoName: 'CAO GGZ',
    relatedEducationSlug: 'gz-psycholoog',
  },

  // ── Praktijkondersteuner (POH) ─────────────────────────────────────────────
  {
    slug: 'praktijkondersteuner',
    name: 'Praktijkondersteuner (POH)',
    caoId: 'huisartsenzorg',
    metaDescription:
      'Salaris Praktijkondersteuner (POH) 2026: actuele salarisschalen conform CAO Huisartsenzorg. Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€3.400 – €5.000',
    heroBadge: 'CAO Huisartsenzorg 2025/2026',
    heroIntro:
      'Wat verdient een Praktijkondersteuner (POH) in 2026? Bekijk de actuele salarisschalen en bereken direct je inkomen inclusief toeslagen.',
    intro:
      'Als Praktijkondersteuner (POH) ondersteun je de huisarts bij de begeleiding van patiënten met chronische aandoeningen zoals diabetes, COPD of hart- en vaatziekten. Je valt onder de CAO Huisartsenzorg.',
    fwgRows: [
      { scale: 'Schaal 6', label: 'POH Somatiek start', min: '€3.400', max: '€3.400', hourlyRange: '€21,73' },
      { scale: 'Schaal 7', label: 'POH ervaren / GGZ', min: '€4.100', max: '€4.100', hourlyRange: '€26,21' },
      { scale: 'Schaal 8', label: 'Senior POH / Ouderen', min: '€5.000', max: '€5.000', hourlyRange: '€31,95' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget voor accreditatie',
      'Pensioenopbouw',
    ],
    growth: [
      { title: 'Senior POH / Coördinator', description: 'Coördinator chronische zorg of praktijkmanager.' },
      { title: 'Nurse Practitioner', description: 'Met HBO-master uitbreiden naar uitgebreidere bevoegdheden.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Praktijkondersteuner in 2026?',
        answer:
          'Een POH verdient in 2026 tussen de €3.400 en €5.000 bruto per maand conform de CAO Huisartsenzorg, afhankelijk van specialisatie (Somatiek, GGZ of Ouderen) en ervaring.',
      },
      {
        question: 'Wat is het verschil tussen POH-Somatiek en POH-GGZ?',
        answer:
          'POH-Somatiek begeleidt patiënten met lichamelijke chronische aandoeningen. POH-GGZ richt zich op psychische problematiek. Beide functies vallen onder de CAO Huisartsenzorg maar kunnen in verschillende schalen worden ingeschaald.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/doktersassistent', label: 'Doktersassistent Salaris' },
      { href: '/salaris/triagist', label: 'Triagist Salaris' },
      { href: '/cao/huisartsenzorg', label: 'CAO Huisartsenzorg' },
    ],
    vacatureProfession: 'Praktijkondersteuner',
    beroepHref: '/beroepen/praktijkondersteuner',
    relatedCaoSlug: 'huisartsenzorg',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedEducationSlug: 'praktijkondersteuner-poh',
  },

  // ── Fysiotherapeut ─────────────────────────────────────────────────────────
  {
    slug: 'fysiotherapeut',
    name: 'Fysiotherapeut',
    caoId: 'vvt',
    metaDescription:
      'Salaris Fysiotherapeut 2026: wat verdient een fysiotherapeut in loondienst? Actuele salarisschalen en toeslagen.',
    avgSalaryDisplay: '€3.200 – €5.500',
    heroBadge: 'Salarisoverzicht 2026',
    heroIntro:
      'Wat verdient een fysiotherapeut in loondienst in 2026? Bekijk de actuele salarisschalen per sector en bereken je inkomen.',
    intro:
      'Fysiotherapeuten in loondienst vallen afhankelijk van de werkgever onder verschillende CAO\'s (VVT, Ziekenhuizen of Revalidatie). Zelfstandige fysiotherapeuten (ZZP) bepalen hun eigen tarief. Op deze pagina richten we ons op loondienst.',
    fwgRows: [
      { scale: 'FWG 50', label: 'Fysiotherapeut VVT/Revalidatie start', min: '€3.200', max: '€3.200', hourlyRange: '€20,46' },
      { scale: 'FWG 55', label: 'Ervaren / senior', min: '€3.770', max: '€5.215', hourlyRange: '€24,10 – €33,40' },
      { scale: 'FWG 60', label: 'Specialisatie / ziekenhuis', min: '€4.200', max: '€5.500', hourlyRange: '€26,85 – €35,17' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering (bij VVT)',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget voor bijscholing en specialisaties',
      'Pensioenopbouw',
    ],
    growth: [
      { title: 'Manueel therapeut', description: 'Aanvullende masteropleiding manuele therapie (KNGF erkend).' },
      { title: 'Sportfysiotherapeut', description: 'Specialisatie in sportblessures en revalidatie.' },
      { title: 'Bekkenfysiotherapeut', description: 'Gespecialiseerde BIG-geregistreerde behandelaar.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een fysiotherapeut in loondienst in 2026?',
        answer:
          'Een fysiotherapeut in loondienst verdient in 2026 tussen de €3.200 en €5.500 bruto per maand, afhankelijk van de sector (VVT, ziekenhuis of revalidatie) en werkervaring.',
      },
      {
        question: 'Welke CAO geldt voor een fysiotherapeut?',
        answer:
          'Dit hangt af van de werkgever: VVT-instelling → CAO VVT; ziekenhuis → CAO Ziekenhuizen; revalidatiecentrum → CAO Revalidatie; particuliere praktijk → geen verplichte CAO.',
      },
      {
        question: 'Wat verdient een ZZP-fysiotherapeut?',
        answer:
          'ZZP-fysiotherapeuten hanteren uurtarieven van €60 – €100+ afhankelijk van specialisatie en regio. Gemiddeld ligt het bruto-inkomen hoger dan in loondienst, maar zonder vaste voordelen zoals vakantiegeld en pensioen.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/ergotherapeut', label: 'Ergotherapeut Salaris' },
      { href: '/salaris/logopedist', label: 'Logopedist Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'Fysiotherapeut',
    beroepHref: '/beroepen/fysiotherapeut',
    relatedCaoSlug: 'vvt',
    relatedCaoName: 'CAO VVT',
    relatedEducationSlug: 'fysiotherapie',
  },

  // ── IC-Verpleegkundige ─────────────────────────────────────────────────────
  {
    slug: 'ic-verpleegkundige',
    name: 'IC-Verpleegkundige',
    caoId: 'ziekenhuizen',
    metaDescription:
      'Salaris IC-Verpleegkundige 2026: actuele salarisschalen conform CAO Ziekenhuizen. Wat verdient een IC-verpleegkundige? Bereken je netto salaris.',
    avgSalaryDisplay: '€3.800 – €5.800',
    heroBadge: 'CAO Ziekenhuizen 2025/2026',
    heroIntro:
      'Wat verdient een IC-verpleegkundige in 2026? Bekijk de actuele salarisschalen, ORT-toeslagen en bereken je totale inkomen conform de CAO Ziekenhuizen.',
    intro:
      'Als IC-verpleegkundige werk je op de intensive care en draag je zorg voor kritiek zieke patiënten. Naast je HBO-diploma verpleegkunde heb je een post-hbo specialisatie IC gevolgd. Je valt onder de CAO Ziekenhuizen en wordt ingeschaald op basis van opleiding en ervaring.',
    fwgRows: [
      { scale: 'FWG 55', label: 'IC-verpleegkundige start', min: '€3.800', max: '€4.600', hourlyRange: '€24,30 – €29,40' },
      { scale: 'FWG 60', label: 'Ervaren IC-verpleegkundige', min: '€4.200', max: '€5.200', hourlyRange: '€26,85 – €33,25' },
      { scale: 'FWG 65', label: 'Senior / coördinator IC', min: '€4.800', max: '€5.800', hourlyRange: '€30,68 – €37,10' },
    ],
    benefits: [
      '8% Vakantiegeld (mei)',
      '8,33% Eindejaarsuitkering (december)',
      'ORT: 25% (avond) tot 65% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Pensioenopbouw bij PFZW',
      'Post-hbo scholingsbudget',
    ],
    growth: [
      { title: 'Nurse Practitioner IC', description: 'Met HBO-master uitgebreide bevoegdheden op de IC (FWG 70+).' },
      { title: 'Opleider / Praktijkopleider', description: 'Opleiden van nieuwe IC-verpleegkundigen.' },
      { title: 'Coördinator IC', description: 'Coördinerende rol met FWG 65–70.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een IC-verpleegkundige in 2026?',
        answer:
          'Een IC-verpleegkundige verdient in 2026 tussen de €3.800 en €5.800 bruto per maand conform de CAO Ziekenhuizen, afhankelijk van ervaring en FWG-schaal.',
      },
      {
        question: 'Welke opleiding heb je nodig om IC-verpleegkundige te worden?',
        answer:
          'Je hebt een HBO-diploma verpleegkunde nodig én een post-hbo specialisatieopleiding Intensive Care (erkend door V&VN).',
      },
      {
        question: 'Hoe hoog is de ORT voor een IC-verpleegkundige?',
        answer:
          'Conform de CAO Ziekenhuizen: 25% (avond, ma-vr 20:00–06:00), 40% (zaterdag), 65% (zondag en feestdagen).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/salaris/nurse-practitioner', label: 'Nurse Practitioner Salaris' },
      { href: '/salaris/ok-assistent', label: 'OK-Assistent Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'IC-Verpleegkundige',
  },

  // ── Nurse Practitioner ─────────────────────────────────────────────────────
  {
    slug: 'nurse-practitioner',
    name: 'Nurse Practitioner',
    caoId: 'ziekenhuizen',
    metaDescription:
      'Salaris Nurse Practitioner 2026: actuele salarisschalen conform CAO Ziekenhuizen. Wat verdient een NP? Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€4.500 – €6.800',
    heroBadge: 'CAO Ziekenhuizen 2025/2026',
    heroIntro:
      'Wat verdient een Nurse Practitioner (NP) in 2026? Bekijk de actuele salarisschalen en bereken je totale inkomen inclusief toeslagen.',
    intro:
      'Een Nurse Practitioner is een verpleegkundig specialist met een HBO-masteropleiding. Je hebt zelfstandige bevoegdheden voor het stellen van diagnoses en het voorschrijven van medicijnen. Je valt doorgaans onder de CAO Ziekenhuizen of CAO VVT.',
    fwgRows: [
      { scale: 'FWG 65', label: 'Nurse Practitioner start', min: '€4.500', max: '€5.500', hourlyRange: '€28,77 – €35,17' },
      { scale: 'FWG 70', label: 'Ervaren Nurse Practitioner', min: '€5.200', max: '€6.200', hourlyRange: '€33,25 – €39,64' },
      { scale: 'FWG 75', label: 'Senior NP / opleider', min: '€5.800', max: '€6.800', hourlyRange: '€37,10 – €43,48' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond- en weekenddiensten',
      'Reiskostenvergoeding €0,21 per km',
      'Congresbudget en bijscholingsbudget',
      'BIG-registratiekosten vergoed',
    ],
    growth: [
      { title: 'Klinisch Nurse Specialist', description: 'Verdieping in complexe zorgsituaties en evidence-based practice.' },
      { title: 'Opleider / Docent', description: 'Opleiden van toekomstige NPs aan de hogeschool.' },
      { title: 'Zorginnovator', description: 'Implementeren van nieuwe werkwijzen en protocollen.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Nurse Practitioner in 2026?',
        answer:
          'Een Nurse Practitioner verdient in 2026 tussen de €4.500 en €6.800 bruto per maand, afhankelijk van werkgever (ziekenhuis, VVT of GGZ), ervaring en FWG-schaal.',
      },
      {
        question: 'Wat is het verschil tussen een Nurse Practitioner en een Physician Assistant?',
        answer:
          'Beide zijn verpleegkundig/medisch specialisten met uitgebreide bevoegdheden. Een NP heeft een verpleegkundige achtergrond; een PA heeft een HBO/WO-medische achtergrond. Salarissen zijn vergelijkbaar.',
      },
      {
        question: 'Is een Nurse Practitioner BIG-geregistreerd?',
        answer:
          'Ja. De titel Verpleegkundig Specialist (VS) is wettelijk beschermd en vereist BIG-II-registratie. Herregistratie is elke 5 jaar verplicht.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/salaris/physician-assistant', label: 'Physician Assistant Salaris' },
      { href: '/salaris/wijkverpleegkundige', label: 'Wijkverpleegkundige Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'Nurse Practitioner',
  },

  // ── SPV (Sociaal Psychiatrisch Verpleegkundige) ────────────────────────────
  {
    slug: 'spv',
    name: 'Sociaal Psychiatrisch Verpleegkundige (SPV)',
    caoId: 'ggz',
    metaDescription:
      'Salaris SPV 2026: wat verdient een Sociaal Psychiatrisch Verpleegkundige? Actuele CAO GGZ salarisschalen en toeslagen.',
    avgSalaryDisplay: '€3.800 – €5.800',
    heroBadge: 'CAO GGZ 2025/2026',
    heroIntro:
      'Wat verdient een Sociaal Psychiatrisch Verpleegkundige (SPV) in 2026? Bekijk de actuele salarisschalen conform de CAO GGZ.',
    intro:
      'Als Sociaal Psychiatrisch Verpleegkundige (SPV) werk je ambulant in de GGZ en bied je zorg aan mensen met psychiatrische problematiek in hun eigen omgeving. Je hebt een post-hbo SPV-opleiding gevolgd en valt onder de CAO GGZ.',
    fwgRows: [
      { scale: 'FWG 55', label: 'SPV start', min: '€3.800', max: '€4.800', hourlyRange: '€24,30 – €30,68' },
      { scale: 'FWG 60', label: 'Ervaren SPV', min: '€4.200', max: '€5.300', hourlyRange: '€26,85 – €33,89' },
      { scale: 'FWG 65', label: 'Senior SPV / coördinator', min: '€4.800', max: '€5.800', hourlyRange: '€30,68 – €37,10' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT: 25% (avond) tot 65% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Supervisiebudget en bijscholingsbudget',
    ],
    growth: [
      { title: 'Verpleegkundig Specialist GGZ', description: 'Met HBO-master uitgebreide bevoegdheden in de ambulante GGZ.' },
      { title: 'ACT-medewerker / Crisisdienst', description: 'Specialisatie in Assertive Community Treatment of crisiszorg.' },
      { title: 'Teamleider ambulante zorg', description: 'Leidinggevende rol in ambulant GGZ-team.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een SPV in 2026?',
        answer:
          'Een Sociaal Psychiatrisch Verpleegkundige verdient in 2026 tussen de €3.800 en €5.800 bruto per maand conform de CAO GGZ, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Welke opleiding heb je nodig voor SPV?',
        answer:
          'Je hebt een HBO-diploma verpleegkunde nodig en een post-hbo SPV-opleiding (erkend door V&VN). De opleiding duurt doorgaans 2 jaar.',
      },
      {
        question: 'Wat is het verschil tussen een SPV en een psychiatrisch verpleegkundige?',
        answer:
          'Een SPV werkt ambulant (bij mensen thuis), terwijl een psychiatrisch verpleegkundige doorgaans klinisch werkt (in een instelling). De SPV-functie vereist aanvullende specialisatie.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/psychiatrisch-verpleegkundige', label: 'Psychiatrisch Verpleegkundige' },
      { href: '/salaris/gz-psycholoog', label: 'GZ-Psycholoog Salaris' },
      { href: '/cao/ggz', label: 'CAO GGZ' },
    ],
    vacatureProfession: 'SPV',
    beroepHref: '/beroepen/spv',
    relatedCaoSlug: 'ggz',
    relatedCaoName: 'CAO GGZ',
    relatedEducationSlug: 'spv',
  },

  // ── Ergotherapeut ──────────────────────────────────────────────────────────
  {
    slug: 'ergotherapeut',
    name: 'Ergotherapeut',
    caoId: 'vvt',
    metaDescription:
      'Salaris Ergotherapeut 2026: wat verdient een ergotherapeut in loondienst? Actuele salarisschalen conform CAO VVT en Ziekenhuizen.',
    avgSalaryDisplay: '€3.100 – €5.100',
    heroBadge: 'Salarisoverzicht 2026',
    heroIntro:
      'Wat verdient een ergotherapeut in 2026? Bekijk de actuele salarisschalen per sector en bereken je netto inkomen.',
    intro:
      'Als ergotherapeut help je mensen met beperkingen om zo zelfstandig mogelijk te functioneren in het dagelijks leven. Je werkt in verpleeghuizen, ziekenhuizen, revalidatiecentra of aan huis. De toepasselijke CAO hangt af van je werkgever.',
    fwgRows: [
      { scale: 'FWG 50', label: 'Ergotherapeut start (VVT)', min: '€3.100', max: '€3.700', hourlyRange: '€19,81 – €23,65' },
      { scale: 'FWG 55', label: 'Ervaren ergotherapeut', min: '€3.500', max: '€4.500', hourlyRange: '€22,38 – €28,77' },
      { scale: 'FWG 60', label: 'Senior / ziekenhuis', min: '€4.000', max: '€5.100', hourlyRange: '€25,57 – €32,61' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget voor bijscholing en specialisaties',
      'Pensioenopbouw bij PFZW',
    ],
    growth: [
      { title: 'Ergotherapeut-specialist', description: 'Specialisatie in cognitieve revalidatie of arbeidsrevalidatie.' },
      { title: 'Teamcoördinator', description: 'Leidinggevende rol over ergotherapie-team.' },
      { title: 'ZZP-ergotherapeut', description: 'Zelfstandig aan de slag met uurtarieven van €65–€100.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een ergotherapeut in 2026?',
        answer:
          'Een ergotherapeut in loondienst verdient in 2026 tussen de €3.100 en €5.100 bruto per maand, afhankelijk van de sector (VVT, ziekenhuis of revalidatie) en werkervaring.',
      },
      {
        question: 'Welke CAO geldt voor een ergotherapeut?',
        answer:
          'Dit hangt af van de werkgever: VVT → CAO VVT; ziekenhuis → CAO Ziekenhuizen; revalidatiecentrum → CAO Revalidatie.',
      },
      {
        question: 'Is een ergotherapeut BIG-geregistreerd?',
        answer:
          'Ja. De titel ergotherapeut is beschermd en vereist BIG-registratie. Herregistratie is elke 5 jaar verplicht.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/fysiotherapeut', label: 'Fysiotherapeut Salaris' },
      { href: '/salaris/logopedist', label: 'Logopedist Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'Ergotherapeut',
    beroepHref: '/beroepen/ergotherapeut',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedEducationSlug: 'ergotherapie',
  },

  // ── Logopedist ─────────────────────────────────────────────────────────────
  {
    slug: 'logopedist',
    name: 'Logopedist',
    caoId: 'ziekenhuizen',
    metaDescription:
      'Salaris Logopedist 2026: wat verdient een logopedist in loondienst? Actuele salarisschalen conform CAO Ziekenhuizen.',
    avgSalaryDisplay: '€3.000 – €5.000',
    heroBadge: 'Salarisoverzicht 2026',
    heroIntro:
      'Wat verdient een logopedist in 2026? Bekijk de actuele salarisschalen en bereken je netto inkomen inclusief toeslagen.',
    intro:
      'Als logopedist behandel je stoornissen in spraak, taal, stem en slikken. Je werkt in ziekenhuizen, revalidatiecentra, verpleeghuizen of in een eigen praktijk. De toepasselijke CAO hangt af van je werkgever.',
    fwgRows: [
      { scale: 'FWG 50', label: 'Logopedist start', min: '€3.000', max: '€3.600', hourlyRange: '€19,17 – €23,01' },
      { scale: 'FWG 55', label: 'Ervaren logopedist', min: '€3.400', max: '€4.300', hourlyRange: '€21,73 – €27,49' },
      { scale: 'FWG 60', label: 'Senior / specialisatie', min: '€3.900', max: '€5.000', hourlyRange: '€24,93 – €31,95' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget voor bijscholing',
      'Pensioenopbouw',
    ],
    growth: [
      { title: 'Stottertherapeut', description: 'Specialisatie in stotterbehandeling (erkend door NVST).' },
      { title: 'Dysfagioloog', description: 'Specialisatie in slikstoornissen, met name bij ouderen en neurologische patiënten.' },
      { title: 'ZZP-logopedist', description: 'Zelfstandig met uurtarieven van €60–€90.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een logopedist in 2026?',
        answer:
          'Een logopedist in loondienst verdient in 2026 tussen de €3.000 en €5.000 bruto per maand, afhankelijk van de sector en werkervaring.',
      },
      {
        question: 'Welke CAO geldt voor een logopedist?',
        answer:
          'Dit hangt af van de werkgever: ziekenhuis → CAO Ziekenhuizen; verpleeghuis/VVT → CAO VVT; particuliere praktijk → geen verplichte CAO.',
      },
      {
        question: 'Is een logopedist BIG-geregistreerd?',
        answer:
          'Ja. De titel logopedist is wettelijk beschermd en vereist BIG-registratie.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/fysiotherapeut', label: 'Fysiotherapeut Salaris' },
      { href: '/salaris/ergotherapeut', label: 'Ergotherapeut Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'Logopedist',
    beroepHref: '/beroepen/logopedist',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedEducationSlug: 'logopedie',
  },

  // ── OK-Assistent ───────────────────────────────────────────────────────────
  {
    slug: 'ok-assistent',
    name: 'OK-Assistent',
    caoId: 'ziekenhuizen',
    metaDescription:
      'Salaris OK-Assistent 2026: actuele salarisschalen conform CAO Ziekenhuizen. Wat verdient een operatieassistent? Bereken je netto salaris.',
    avgSalaryDisplay: '€3.200 – €5.200',
    heroBadge: 'CAO Ziekenhuizen 2025/2026',
    heroIntro:
      'Wat verdient een OK-assistent in 2026? Bekijk de actuele salarisschalen conform de CAO Ziekenhuizen en bereken je inkomen.',
    intro:
      'Als OK-assistent (operatieassistent) assisteer je de chirurg tijdens operaties en zorg je voor steriele omstandigheden op de operatiekamer. Je hebt een post-hbo opleiding operatieassistent gevolgd en valt onder de CAO Ziekenhuizen.',
    fwgRows: [
      { scale: 'FWG 50', label: 'OK-assistent start', min: '€3.200', max: '€3.900', hourlyRange: '€20,46 – €24,93' },
      { scale: 'FWG 55', label: 'Ervaren OK-assistent', min: '€3.600', max: '€4.600', hourlyRange: '€23,01 – €29,40' },
      { scale: 'FWG 60', label: 'Senior OK-assistent', min: '€4.200', max: '€5.200', hourlyRange: '€26,85 – €33,25' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT: 25% (avond) tot 65% (feestdagen)',
      'Consignatietoeslag voor oproepbaarheid',
      'Reiskostenvergoeding €0,21 per km',
      'Post-hbo scholingsbudget',
    ],
    growth: [
      { title: 'Coördinator OK', description: 'Coördinerende rol op de operatieafdeling.' },
      { title: 'Praktijkopleider', description: 'Opleiden van nieuwe OK-assistenten en stagiairs.' },
      { title: 'Eerste Chirurgisch Assistent (ECA)', description: 'Uitgebreide rol als chirurgisch assistent (ECA-opleiding).' },
    ],
    faqs: [
      {
        question: 'Wat verdient een OK-assistent in 2026?',
        answer:
          'Een OK-assistent verdient in 2026 tussen de €3.200 en €5.200 bruto per maand conform de CAO Ziekenhuizen, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Welke opleiding heb je nodig om OK-assistent te worden?',
        answer:
          'Je hebt een post-hbo opleiding Operatieassistent nodig (2 jaar, erkend door NVAM). Toelating vereist een HBO-verpleegkunde of MBO-niveau 4 zorg.',
      },
      {
        question: 'Krijg een OK-assistent een consignatietoeslag?',
        answer:
          'Ja. Bij oproepbaarheid buiten reguliere werktijden (bereikbaarheidsdienst) ontvang je conform de CAO Ziekenhuizen een consignatietoeslag.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/ic-verpleegkundige', label: 'IC-Verpleegkundige Salaris' },
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'OK-Assistent',
  },

  // ── Kraamverzorgende ───────────────────────────────────────────────────────
  {
    slug: 'kraamverzorgende',
    name: 'Kraamverzorgende',
    caoId: 'vvt',
    metaDescription:
      'Salaris Kraamverzorgende 2026: actuele salarisschalen conform CAO Kraamzorg. Wat verdient een kraamverzorgende? Bereken je netto salaris.',
    avgSalaryDisplay: '€2.600 – €3.500',
    heroBadge: 'CAO Kraamzorg 2025/2026',
    heroIntro:
      'Wat verdient een kraamverzorgende in 2026? Bekijk de actuele salarisschalen en bereken je totale inkomen inclusief toeslagen.',
    intro:
      'Als kraamverzorgende ondersteun je de moeder en het pasgeboren kind in de eerste week na de bevalling. Je werkt bij kraamzorgorganisaties die doorgaans de CAO Kraamzorg of CAO VVT hanteren.',
    fwgRows: [
      { scale: 'Schaal 3', label: 'Kraamverzorgende start', min: '€2.600', max: '€2.600', hourlyRange: '€16,62' },
      { scale: 'Schaal 4', label: 'Ervaren kraamverzorgende', min: '€2.950', max: '€2.950', hourlyRange: '€18,85' },
      { scale: 'Schaal 5', label: 'Senior / laktatiebegeleider', min: '€3.500', max: '€3.500', hourlyRange: '€22,38' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond- en weekenddiensten',
      'Reiskostenvergoeding €0,21 per km',
      'Gratis werkkleding en materialen',
    ],
    growth: [
      { title: 'Laktatiebegeleider (IBCLC)', description: 'Internationale certificering voor borstvoedingsbegeleiding.' },
      { title: 'Verloskundige assistent', description: 'Aanvullende scholing voor rol naast de verloskundige.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een kraamverzorgende in 2026?',
        answer:
          'Een kraamverzorgende verdient in 2026 tussen de €2.600 en €3.500 bruto per maand, afhankelijk van werkervaring en schaal.',
      },
      {
        question: 'Hoeveel uur per week werkt een kraamverzorgende?',
        answer:
          'Kraamverzorgenden werken doorgaans in wisselende diensten rond bevallingen. Het aantal uren per week varieert sterk (16–36 uur).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/verpleegkundige', label: 'Verpleegkundige Salaris' },
      { href: '/salaris/verzorgende-ig', label: 'Verzorgende IG Salaris' },
      { href: '/cao-vvt', label: 'CAO VVT' },
    ],
    vacatureProfession: 'Kraamverzorgende',
  },

  // ── Psychiatrisch Verpleegkundige ──────────────────────────────────────────
  {
    slug: 'psychiatrisch-verpleegkundige',
    name: 'Psychiatrisch Verpleegkundige',
    caoId: 'ggz',
    metaDescription:
      'Salaris Psychiatrisch Verpleegkundige 2026: actuele salarisschalen conform CAO GGZ. Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€3.500 – €5.800',
    heroBadge: 'CAO GGZ 2025/2026',
    heroIntro:
      'Wat verdient een psychiatrisch verpleegkundige in 2026? Bekijk de actuele CAO GGZ-schalen, ORT-toeslagen en bereken je inkomen.',
    intro:
      'Als psychiatrisch verpleegkundige werk je in de GGZ bij instellingen voor psychiatrie, verslavingszorg of forensische psychiatrie. Je valt onder de CAO GGZ. De ORT is significant bij klinische diensten.',
    fwgRows: [
      { scale: 'FWG 50', label: 'Psychiatrisch verpleegkundige start', min: '€3.500', max: '€5.215', hourlyRange: '€22,40 – €33,40' },
      { scale: 'FWG 55', label: 'Senior / gespecialiseerd', min: '€3.770', max: '€5.800', hourlyRange: '€24,10 – €37,10' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT: 25% (avond) tot 65% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Supervisiebudget',
    ],
    growth: [
      { title: 'SPV (Sociaal Psychiatrisch Verpleegkundige)', description: 'Specialisatie in ambulante GGZ en crisis-interventie.' },
      { title: 'Verpleegkundig specialist GGZ', description: 'Met HBO-master uitgebreide bevoegdheden in de GGZ (FWG 60+).' },
    ],
    faqs: [
      {
        question: 'Wat verdient een psychiatrisch verpleegkundige in 2026?',
        answer:
          'Een psychiatrisch verpleegkundige verdient in 2026 tussen de €3.500 en €5.800 bruto per maand conform de CAO GGZ, afhankelijk van schaal en ervaring.',
      },
      {
        question: 'Hoe hoog is de ORT in de GGZ?',
        answer:
          'De CAO GGZ kent ORT-percentages van 25% (avond, ma-vr 20:00–06:00), 40% (zaterdag) en 65% (zondag en feestdagen).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/spv', label: 'SPV Salaris' },
      { href: '/salaris/gz-psycholoog', label: 'GZ-Psycholoog Salaris' },
      { href: '/cao/ggz', label: 'CAO GGZ' },
    ],
    vacatureProfession: 'Psychiatrisch Verpleegkundige',
  },

  // ── Begeleider Gehandicaptenzorg ───────────────────────────────────────────
  {
    slug: 'begeleider-gehandicaptenzorg',
    name: 'Begeleider Gehandicaptenzorg',
    caoId: 'gehandicaptenzorg',
    metaDescription:
      'Salaris Begeleider Gehandicaptenzorg 2026: actuele salarisschalen conform CAO Gehandicaptenzorg. Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€2.800 – €4.200',
    heroBadge: 'CAO Gehandicaptenzorg 2025/2026',
    heroIntro:
      'Wat verdient een begeleider in de gehandicaptenzorg in 2026? Bekijk de actuele salarisschalen conform de CAO Gehandicaptenzorg.',
    intro:
      'Als begeleider in de gehandicaptenzorg ondersteun je mensen met een verstandelijke, lichamelijke of meervoudige beperking bij hun dagelijks leven. Je werkt in woongroepen, dagbesteding of ambulante ondersteuning. Het salaris valt onder de CAO Gehandicaptenzorg.',
    fwgRows: [
      { scale: 'FWG 35', label: 'Begeleider start (MBO 3)', min: '€2.800', max: '€3.200', hourlyRange: '€17,90 – €20,46' },
      { scale: 'FWG 40', label: 'Begeleider (MBO 4)', min: '€3.000', max: '€3.600', hourlyRange: '€19,17 – €23,01' },
      { scale: 'FWG 45', label: 'Senior begeleider / gespecialiseerd', min: '€3.400', max: '€4.200', hourlyRange: '€21,73 – €26,85' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT: 22% (avond) tot 65% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget',
      'Pensioenopbouw bij PFZW',
    ],
    growth: [
      { title: 'Persoonlijk begeleider', description: 'Meer verantwoordelijkheid als vaste begeleider voor individuele cliënten (FWG 45–50).' },
      { title: 'Gedragsdeskundige', description: 'Met aanvullende HBO-opleiding orthopedagogie of psychologie.' },
      { title: 'Teamleider woongroep', description: 'Leidinggevende rol over een woongroep of dagbestedingsteam.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een begeleider in de gehandicaptenzorg in 2026?',
        answer:
          'Een begeleider gehandicaptenzorg verdient in 2026 tussen de €2.800 en €4.200 bruto per maand conform de CAO Gehandicaptenzorg, afhankelijk van opleidingsniveau en FWG-schaal.',
      },
      {
        question: 'Welke CAO geldt voor medewerkers in de gehandicaptenzorg?',
        answer:
          'De CAO Gehandicaptenzorg geldt voor medewerkers bij erkende instellingen voor mensen met een verstandelijke, lichamelijke of meervoudige beperking.',
      },
      {
        question: 'Hoe hoog is de ORT in de gehandicaptenzorg?',
        answer:
          'Conform de CAO Gehandicaptenzorg: 22% (avond, ma-vr 20:00–06:00), 40% (zaterdag), 65% (zondag en feestdagen).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/persoonlijk-begeleider', label: 'Persoonlijk Begeleider Salaris' },
      { href: '/salaris/verzorgende-ig', label: 'Verzorgende IG Salaris' },
      { href: '/cao/gehandicaptenzorg', label: 'CAO Gehandicaptenzorg' },
    ],
    vacatureProfession: 'Begeleider Gehandicaptenzorg',
    beroepHref: '/beroepen/begeleider-gehandicaptenzorg',
    relatedCaoSlug: 'gehandicaptenzorg',
    relatedCaoName: 'CAO Gehandicaptenzorg',
    relatedEducationSlug: 'begeleider-gehandicaptenzorg',
  },

  // ── Persoonlijk Begeleider ─────────────────────────────────────────────────
  {
    slug: 'persoonlijk-begeleider',
    name: 'Persoonlijk Begeleider',
    caoId: 'gehandicaptenzorg',
    metaDescription:
      'Salaris Persoonlijk Begeleider 2026: actuele salarisschalen conform CAO Gehandicaptenzorg. Wat verdient een persoonlijk begeleider?',
    avgSalaryDisplay: '€3.000 – €4.500',
    heroBadge: 'CAO Gehandicaptenzorg 2025/2026',
    heroIntro:
      'Wat verdient een persoonlijk begeleider in 2026? Bekijk de actuele salarisschalen conform de CAO Gehandicaptenzorg.',
    intro:
      'Als persoonlijk begeleider ben je de vaste begeleider voor een specifieke cliënt met een beperking. Je coördineert het zorgplan, stemt af met familie en andere disciplines en biedt individuele ondersteuning. Je valt onder de CAO Gehandicaptenzorg.',
    fwgRows: [
      { scale: 'FWG 40', label: 'Persoonlijk begeleider start', min: '€3.000', max: '€3.500', hourlyRange: '€19,17 – €22,38' },
      { scale: 'FWG 45', label: 'Ervaren persoonlijk begeleider', min: '€3.300', max: '€4.000', hourlyRange: '€21,09 – €25,57' },
      { scale: 'FWG 50', label: 'Senior persoonlijk begeleider', min: '€3.700', max: '€4.500', hourlyRange: '€23,65 – €28,77' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT: 22% (avond) tot 65% (feestdagen)',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget',
    ],
    growth: [
      { title: 'Gedragsdeskundige / Orthopedagoog', description: 'Met aanvullende HBO-opleiding doorgroeien naar beleidsmatige rol.' },
      { title: 'Teamleider', description: 'Leidinggevende rol over een woongroep of begeleidingsteam (FWG 50–55).' },
    ],
    faqs: [
      {
        question: 'Wat verdient een persoonlijk begeleider in 2026?',
        answer:
          'Een persoonlijk begeleider verdient in 2026 tussen de €3.000 en €4.500 bruto per maand conform de CAO Gehandicaptenzorg, afhankelijk van ervaring en FWG-schaal.',
      },
      {
        question: 'Wat is het verschil tussen een begeleider en een persoonlijk begeleider?',
        answer:
          'Een persoonlijk begeleider heeft een vaste koppeling aan een specifieke cliënt en coördineert het individuele zorgplan. Een reguliere begeleider werkt in een ploeg zonder vaste koppeling.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/begeleider-gehandicaptenzorg', label: 'Begeleider Gehandicaptenzorg' },
      { href: '/cao/gehandicaptenzorg', label: 'CAO Gehandicaptenzorg' },
    ],
    vacatureProfession: 'Persoonlijk Begeleider',
    beroepHref: '/beroepen/persoonlijk-begeleider',
    relatedCaoSlug: 'gehandicaptenzorg',
    relatedCaoName: 'CAO Gehandicaptenzorg',
    relatedEducationSlug: 'persoonlijk-begeleider',
  },

  // ── Jeugdzorgwerker ────────────────────────────────────────────────────────
  {
    slug: 'jeugdzorgwerker',
    name: 'Jeugdzorgwerker',
    caoId: 'jeugdzorg',
    metaDescription:
      'Salaris Jeugdzorgwerker 2026: actuele salarisschalen conform CAO Jeugdzorg. Wat verdient een jeugdzorgwerker? Bereken je netto salaris.',
    avgSalaryDisplay: '€3.000 – €4.500',
    heroBadge: 'CAO Jeugdzorg 2025/2026',
    heroIntro:
      'Wat verdient een jeugdzorgwerker in 2026? Bekijk de actuele salarisschalen conform de CAO Jeugdzorg en bereken je inkomen.',
    intro:
      'Als jeugdzorgwerker begeleid je kinderen en jongeren in kwetsbare situaties, zoals thuis (ambulant), in een pleeggezin of in een residentiële instelling. Je valt onder de CAO Jeugdzorg.',
    fwgRows: [
      { scale: 'Schaal 7', label: 'Jeugdzorgwerker start (MBO 4)', min: '€3.000', max: '€3.400', hourlyRange: '€19,17 – €21,73' },
      { scale: 'Schaal 8', label: 'Jeugdzorgwerker (HBO)', min: '€3.300', max: '€3.900', hourlyRange: '€21,09 – €24,93' },
      { scale: 'Schaal 9', label: 'Senior jeugdzorgwerker', min: '€3.700', max: '€4.500', hourlyRange: '€23,65 – €28,77' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond- en weekenddiensten',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget',
    ],
    growth: [
      { title: 'Gezinscoach / gezinsvoogd', description: 'Intensievere gezinsbegeleiding met meer verantwoordelijkheid.' },
      { title: 'Gedragswetenschapper', description: 'Met HBO-master orthopedagogie of psychologie.' },
      { title: 'Teamleider jeugdzorg', description: 'Leidinggevende rol in residentiële of ambulante jeugdzorg.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een jeugdzorgwerker in 2026?',
        answer:
          'Een jeugdzorgwerker verdient in 2026 tussen de €3.000 en €4.500 bruto per maand conform de CAO Jeugdzorg, afhankelijk van opleidingsniveau en ervaring.',
      },
      {
        question: 'Welke CAO geldt voor een jeugdzorgwerker?',
        answer:
          'De CAO Jeugdzorg is van toepassing op medewerkers bij gecertificeerde jeugdzorginstellingen.',
      },
      {
        question: 'Hoe hoog is de ORT in de jeugdzorg?',
        answer:
          'Conform de CAO Jeugdzorg: 22% (avond), 40% (zaterdag), 65% (zondag en feestdagen).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/gezinscoach', label: 'Gezinscoach Salaris' },
      { href: '/cao/jeugdzorg', label: 'CAO Jeugdzorg' },
    ],
    vacatureProfession: 'Jeugdzorgwerker',
    beroepHref: '/beroepen/jeugdzorgwerker',
    relatedCaoSlug: 'jeugdzorg',
    relatedCaoName: 'CAO Jeugdzorg',
    relatedEducationSlug: 'jeugdzorgwerker',
  },

  // ── Klinisch Psycholoog ────────────────────────────────────────────────────
  {
    slug: 'klinisch-psycholoog',
    name: 'Klinisch Psycholoog',
    caoId: 'ggz',
    metaDescription:
      'Salaris Klinisch Psycholoog 2026: actuele salarisschalen conform CAO GGZ. Wat verdient een klinisch psycholoog? Bereken je netto salaris.',
    avgSalaryDisplay: '€5.000 – €7.500',
    heroBadge: 'CAO GGZ 2025/2026',
    heroIntro:
      'Wat verdient een Klinisch Psycholoog in 2026? Bekijk de actuele salarisschalen conform de CAO GGZ en bereken je inkomen.',
    intro:
      'Een Klinisch Psycholoog heeft naast de BIG-I-registratie als GZ-Psycholoog ook de BIG-II-registratie Klinisch Psycholoog. Je bent bevoegd de complexste psychiatrische behandelingen zelfstandig uit te voeren. Je valt onder de CAO GGZ.',
    fwgRows: [
      { scale: 'FWG 65', label: 'Klinisch psycholoog start', min: '€5.000', max: '€5.800', hourlyRange: '€31,95 – €37,10' },
      { scale: 'FWG 70', label: 'Ervaren klinisch psycholoog', min: '€5.800', max: '€6.700', hourlyRange: '€37,10 – €42,83' },
      { scale: 'FWG 75', label: 'Senior / hoofdbehandelaar', min: '€6.300', max: '€7.500', hourlyRange: '€40,28 – €47,96' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Supervisiebudget en BIG-herregistratiebudget',
      'Congresbezoek en studiedagen',
      'Reiskostenvergoeding €0,21 per km',
    ],
    growth: [
      { title: 'Hoofdbehandelaar GGZ', description: 'Eindverantwoordelijkheid voor complexe behandeltrajecten.' },
      { title: 'Opleider / Supervisor', description: 'Superviseren van GZ-Psychologen in opleiding.' },
      { title: 'Wetenschappelijk onderzoeker', description: 'Combineren van klinische zorg met wetenschappelijk onderzoek.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Klinisch Psycholoog in 2026?',
        answer:
          'Een Klinisch Psycholoog verdient in 2026 tussen de €5.000 en €7.500 bruto per maand conform de CAO GGZ, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Wat is het verschil tussen een GZ-Psycholoog en een Klinisch Psycholoog?',
        answer:
          'Een Klinisch Psycholoog heeft een aanvullende specialisatieopleiding (BIG-II) gevolgd en is bevoegd complexere en langerdurende behandelingen zelfstandig uit te voeren dan een GZ-Psycholoog.',
      },
      {
        question: 'Hoe lang duurt de opleiding tot Klinisch Psycholoog?',
        answer:
          'Na de GZ-Psycholoog-opleiding (2 jaar) volg je nog een 3-jarige specialisatieopleiding Klinische Psychologie voor de BIG-II-registratie.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/gz-psycholoog', label: 'GZ-Psycholoog Salaris' },
      { href: '/salaris/psychotherapeut', label: 'Psychotherapeut Salaris' },
      { href: '/cao/ggz', label: 'CAO GGZ' },
    ],
    vacatureProfession: 'Klinisch Psycholoog',
  },

  // ── Psychotherapeut ────────────────────────────────────────────────────────
  {
    slug: 'psychotherapeut',
    name: 'Psychotherapeut',
    caoId: 'ggz',
    metaDescription:
      'Salaris Psychotherapeut 2026: actuele salarisschalen conform CAO GGZ. Wat verdient een psychotherapeut? Bereken je netto salaris.',
    avgSalaryDisplay: '€4.800 – €7.200',
    heroBadge: 'CAO GGZ 2025/2026',
    heroIntro:
      'Wat verdient een Psychotherapeut in 2026? Bekijk de actuele salarisschalen conform de CAO GGZ en bereken je inkomen.',
    intro:
      'Een Psychotherapeut is BIG-geregistreerd en voert zelfstandig psychologische behandelingen uit bij uiteenlopende psychische aandoeningen. De titel is wettelijk beschermd (BIG-II). Je werkt doorgaans in de specialistische GGZ en valt onder de CAO GGZ.',
    fwgRows: [
      { scale: 'FWG 65', label: 'Psychotherapeut start', min: '€4.800', max: '€5.700', hourlyRange: '€30,68 – €36,46' },
      { scale: 'FWG 70', label: 'Ervaren psychotherapeut', min: '€5.500', max: '€6.500', hourlyRange: '€35,17 – €41,56' },
      { scale: 'FWG 75', label: 'Senior / opleider', min: '€6.000', max: '€7.200', hourlyRange: '€38,36 – €46,04' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Supervisiebudget',
      'Congresbezoek en studiedagen',
      'Reiskostenvergoeding €0,21 per km',
    ],
    growth: [
      { title: 'Klinisch Psycholoog', description: 'Via aanvullende specialisatieopleiding BIG-II Klinisch Psycholoog.' },
      { title: 'Opleider / Supervisor', description: 'Supervisie voor psychologen en psychotherapeuten in opleiding.' },
      { title: 'Zelfstandige praktijk', description: 'ZZP-psychotherapeut met eigen praktijk voor specialistische GGZ.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Psychotherapeut in 2026?',
        answer:
          'Een Psychotherapeut verdient in 2026 tussen de €4.800 en €7.200 bruto per maand conform de CAO GGZ, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Welke BIG-registratie heeft een Psychotherapeut?',
        answer:
          'Een Psychotherapeut heeft een BIG-II-registratie. De titel is wettelijk beschermd in de Wet BIG.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/gz-psycholoog', label: 'GZ-Psycholoog Salaris' },
      { href: '/salaris/klinisch-psycholoog', label: 'Klinisch Psycholoog Salaris' },
      { href: '/cao/ggz', label: 'CAO GGZ' },
    ],
    vacatureProfession: 'Psychotherapeut',
  },

  // ── Triagist ───────────────────────────────────────────────────────────────
  {
    slug: 'triagist',
    name: 'Triagist',
    caoId: 'huisartsenzorg',
    metaDescription:
      'Salaris Triagist 2026: actuele salarisschalen conform CAO Huisartsenzorg. Wat verdient een triagist op de HAP? Bereken je netto salaris.',
    avgSalaryDisplay: '€2.800 – €4.200',
    heroBadge: 'CAO Huisartsenzorg 2025/2026',
    heroIntro:
      'Wat verdient een triagist in 2026? Bekijk de actuele salarisschalen conform de CAO Huisartsenzorg en bereken je inkomen.',
    intro:
      'Als triagist voer je telefonische triage-gesprekken en beoordeelt de urgentie van medische klachten. Je werkt op de huisartsenpost (HAP) of huisartsenpraktijk. Je valt onder de CAO Huisartsenzorg.',
    fwgRows: [
      { scale: 'Schaal 5', label: 'Triagist start', min: '€2.800', max: '€3.200', hourlyRange: '€17,90 – €20,46' },
      { scale: 'Schaal 6', label: 'Ervaren triagist', min: '€3.200', max: '€3.700', hourlyRange: '€20,46 – €23,65' },
      { scale: 'Schaal 7', label: 'Senior triagist / coördinator', min: '€3.600', max: '€4.200', hourlyRange: '€23,01 – €26,85' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond-, nacht- en weekenddiensten (HAP)',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget (triage-opleiding)',
    ],
    growth: [
      { title: 'Doktersassistent', description: 'Breed inzetbare rol in de huisartsenpraktijk.' },
      { title: 'Coördinator HAP', description: 'Organisatorische rol op de huisartsenpost.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een triagist in 2026?',
        answer:
          'Een triagist verdient in 2026 tussen de €2.800 en €4.200 bruto per maand conform de CAO Huisartsenzorg, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Wat doet een triagist precies?',
        answer:
          'Een triagist beoordeelt aan de telefoon de urgentie van medische klachten van patiënten en bepaalt of zij direct naar de HAP moeten komen, een afspraak krijgen of thuis kunnen blijven.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/doktersassistent', label: 'Doktersassistent Salaris' },
      { href: '/salaris/praktijkondersteuner', label: 'Praktijkondersteuner Salaris' },
      { href: '/cao/huisartsenzorg', label: 'CAO Huisartsenzorg' },
    ],
    vacatureProfession: 'Triagist',
  },

  // ── POH-GGZ ────────────────────────────────────────────────────────────────
  {
    slug: 'poh-ggz',
    name: 'POH-GGZ (Praktijkondersteuner GGZ)',
    caoId: 'huisartsenzorg',
    metaDescription:
      'Salaris POH-GGZ 2026: actuele salarisschalen conform CAO Huisartsenzorg. Wat verdient een praktijkondersteuner GGZ? Bereken je salaris.',
    avgSalaryDisplay: '€3.600 – €5.000',
    heroBadge: 'CAO Huisartsenzorg 2025/2026',
    heroIntro:
      'Wat verdient een POH-GGZ in 2026? Bekijk de actuele salarisschalen conform de CAO Huisartsenzorg en bereken je inkomen.',
    intro:
      'Als POH-GGZ (Praktijkondersteuner Geestelijke Gezondheidszorg) begeleid je patiënten met lichte tot matige psychische klachten in de huisartsenpraktijk. Je werkt nauw samen met de huisarts en verwijst naar de GGZ bij complexere problematiek.',
    fwgRows: [
      { scale: 'Schaal 7', label: 'POH-GGZ start', min: '€3.600', max: '€3.600', hourlyRange: '€23,01' },
      { scale: 'Schaal 8', label: 'Ervaren POH-GGZ', min: '€4.200', max: '€4.200', hourlyRange: '€26,85' },
      { scale: 'Schaal 9', label: 'Senior POH-GGZ', min: '€5.000', max: '€5.000', hourlyRange: '€31,95' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget voor accreditatie en bijscholing',
    ],
    growth: [
      { title: 'GZ-Psycholoog', description: 'Met aanvullende post-master opleiding doorgroeien naar BIG-geregistreerde GZ-Psycholoog.' },
      { title: 'Coördinator eerste lijn GGZ', description: 'Coördinerende rol voor GGZ-zorg in de huisartsenpraktijk.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een POH-GGZ in 2026?',
        answer:
          'Een POH-GGZ verdient in 2026 tussen de €3.600 en €5.000 bruto per maand conform de CAO Huisartsenzorg, afhankelijk van ervaring en schaal.',
      },
      {
        question: 'Welke opleiding heb je nodig voor POH-GGZ?',
        answer:
          'Doorgaans een HBO-opleiding in de gezondheidszorg (verpleegkunde, maatschappelijk werk, SPH) aangevuld met een erkende POH-GGZ-opleiding (ca. 1,5 jaar).',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/praktijkondersteuner', label: 'Praktijkondersteuner Salaris' },
      { href: '/salaris/gz-psycholoog', label: 'GZ-Psycholoog Salaris' },
      { href: '/cao/huisartsenzorg', label: 'CAO Huisartsenzorg' },
    ],
    vacatureProfession: 'POH-GGZ',
    beroepHref: '/beroepen/poh-ggz',
    relatedCaoSlug: 'huisartsenzorg',
    relatedCaoName: 'CAO Huisartsenzorg',
    relatedEducationSlug: 'poh-ggz',
  },

  // ── Physician Assistant ────────────────────────────────────────────────────
  {
    slug: 'physician-assistant',
    name: 'Physician Assistant',
    caoId: 'ziekenhuizen',
    metaDescription:
      'Salaris Physician Assistant 2026: actuele salarisschalen conform CAO Ziekenhuizen. Wat verdient een PA? Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€4.500 – €6.800',
    heroBadge: 'CAO Ziekenhuizen 2025/2026',
    heroIntro:
      'Wat verdient een Physician Assistant (PA) in 2026? Bekijk de actuele salarisschalen conform de CAO Ziekenhuizen en bereken je inkomen.',
    intro:
      'Een Physician Assistant is een medisch specialist met een HBO-masterniveau die zelfstandig diagnoses stelt, behandelplannen opstelt en medicijnen voorschrijft. Je werkt in ziekenhuizen, klinieken of huisartsenpraktijken en valt doorgaans onder de CAO Ziekenhuizen.',
    fwgRows: [
      { scale: 'FWG 65', label: 'Physician Assistant start', min: '€4.500', max: '€5.500', hourlyRange: '€28,77 – €35,17' },
      { scale: 'FWG 70', label: 'Ervaren Physician Assistant', min: '€5.200', max: '€6.200', hourlyRange: '€33,25 – €39,64' },
      { scale: 'FWG 75', label: 'Senior PA / opleider', min: '€5.800', max: '€6.800', hourlyRange: '€37,10 – €43,48' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'ORT voor avond- en weekenddiensten',
      'Reiskostenvergoeding €0,21 per km',
      'Congresbudget en bijscholingsbudget',
      'BIG-registratiekosten vergoed',
    ],
    growth: [
      { title: 'Hoofd-PA / Coördinator', description: 'Coördinator voor PA-groep binnen een specialisme.' },
      { title: 'Opleider Physician Assistant', description: 'Opleider bij een PA-masteropleiding aan de hogeschool.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een Physician Assistant in 2026?',
        answer:
          'Een Physician Assistant verdient in 2026 tussen de €4.500 en €6.800 bruto per maand conform de CAO Ziekenhuizen, afhankelijk van ervaring en specialisme.',
      },
      {
        question: 'Wat is het verschil tussen een PA en een Nurse Practitioner?',
        answer:
          'Een PA heeft een medische HBO-masterachtergrond (geneeskunde-gerelateerd), terwijl een NP een verpleegkundige achtergrond heeft. Beide hebben uitgebreide zelfstandige bevoegdheden. Salarissen zijn vergelijkbaar.',
      },
      {
        question: 'Is een Physician Assistant BIG-geregistreerd?',
        answer:
          'Ja. De titel Physician Assistant is wettelijk beschermd en vereist BIG-II-registratie. Herregistratie is elke 5 jaar verplicht.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/nurse-practitioner', label: 'Nurse Practitioner Salaris' },
      { href: '/salaris/ic-verpleegkundige', label: 'IC-Verpleegkundige Salaris' },
      { href: '/cao/ziekenhuizen', label: 'CAO Ziekenhuizen' },
    ],
    vacatureProfession: 'Physician Assistant',
    beroepHref: '/beroepen/physician-assistant',
    relatedCaoSlug: 'ziekenhuizen',
    relatedCaoName: 'CAO Ziekenhuizen',
    relatedEducationSlug: 'physician-assistant',
  },

  // ── Sociaal Werker ────────────────────────────────────────────────────────
  {
    slug: 'sociaal-werker',
    name: 'Sociaal Werker',
    caoId: 'sociaal-werk',
    metaDescription:
      'Salaris Sociaal Werker 2026: actuele salarisschalen conform CAO Sociaal Werk. Wat verdient een sociaal werker? Bereken je netto maandsalaris.',
    avgSalaryDisplay: '€2.900 – €4.500',
    heroBadge: 'CAO Sociaal Werk 2025/2026',
    heroIntro:
      'Wat verdient een sociaal werker in 2026? Bekijk de actuele salarisschalen conform de CAO Sociaal Werk en ontdek doorgroeimogelijkheden.',
    intro:
      'Een sociaal werker begeleidt mensen bij persoonlijke, sociale en maatschappelijke problemen in wijkteams, schuldhulpverlening, jeugdzorg of maatschappelijke opvang. Het salaris is conform de CAO Sociaal Werk en afhankelijk van functieniveau en ervaring.',
    fwgRows: [
      { scale: 'Schaal 7', label: 'Starter HBO Social Work', min: '€2.900', max: '€3.400', hourlyRange: '€18,50 – €21,75' },
      { scale: 'Schaal 8', label: 'Ervaren sociaal werker', min: '€3.400', max: '€4.000', hourlyRange: '€21,75 – €25,60' },
      { scale: 'Schaal 9', label: 'Senior sociaal werker', min: '€4.000', max: '€4.500', hourlyRange: '€25,60 – €28,80' },
    ],
    benefits: [
      '8% Vakantiegeld',
      '8,33% Eindejaarsuitkering',
      'Reiskostenvergoeding €0,21 per km',
      'Scholingsbudget voor accreditatie en bijscholing',
      'Pensioenpremie via ABP of Pensioenfonds Zorg en Welzijn',
    ],
    growth: [
      { title: 'Teamleider sociaal werk', description: 'Leidinggevende rol binnen een wijkteam of zorgorganisatie.' },
      { title: 'Master Social Work (MSW)', description: 'Specialisatie voor hogere functies of beleidswerk.' },
      { title: 'Beleidsadviseur zorg & welzijn', description: 'Adviesrol bij gemeenten of zorginstellingen.' },
    ],
    faqs: [
      {
        question: 'Wat verdient een sociaal werker in 2026?',
        answer:
          'Een sociaal werker verdient in 2026 tussen de €2.900 en €4.500 bruto per maand conform de CAO Sociaal Werk, afhankelijk van functieniveau en ervaring.',
      },
      {
        question: 'Onder welke CAO valt een sociaal werker?',
        answer:
          'De meeste sociaal werkers vallen onder de CAO Sociaal Werk (voorheen CAO Welzijn). Bij jeugdzorgorganisaties kan de CAO Jeugdzorg van toepassing zijn.',
      },
      {
        question: 'Kan ik doorgroeien als sociaal werker?',
        answer:
          'Ja. Via de Master Social Work (MSW) of aanvullende opleidingen kun je doorgroeien naar teamleider, coördinator of beleidsadviseur bij gemeenten of zorginstellingen.',
      },
    ],
    relatedSalaryLinks: [
      { href: '/salaris/jeugdzorgwerker', label: 'Jeugdzorgwerker Salaris' },
      { href: '/salaris/begeleider-gehandicaptenzorg', label: 'Begeleider Gehandicaptenzorg Salaris' },
      { href: '/cao/sociaal-werk', label: 'CAO Sociaal Werk' },
    ],
    vacatureProfession: 'Sociaal Werker',
    beroepHref: '/beroepen/sociaal-werker',
    relatedCaoSlug: 'sociaal-werk',
    relatedCaoName: 'CAO Sociaal Werk',
    relatedEducationSlug: 'sociaal-werker',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProfession(slug: string): ProfessionSalaryData | undefined {
  return professions.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return professions.map((p) => p.slug);
}

/**
 * Geeft alle slugs terug als array van params voor generateStaticParams.
 * Gebruik: export const generateStaticParams = getSalaryStaticParams;
 */
export function getSalaryStaticParams(): { slug: string }[] {
  return professions.map((p) => ({ slug: p.slug }));
}
