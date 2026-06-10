
export interface Vacancy {
  id: string;
  slug: string;
  title: string;
  employer: string;
  location: string;
  salaryIndication: string;
  contractHours: string;
  contractType: string;
  profession: 'Helpende Plus' | 'Verzorgende IG' | 'Verpleegkundige' | 'Wijkverpleegkundige' | 'Doktersassistent';
  description: string;
  publishedAt: string;
}

export const vacancies: Vacancy[] = [
  {
    id: '1',
    slug: 'helpende-plus-ouderenzorg-amsterdam',
    title: 'Helpende Plus Ouderenzorg',
    employer: 'AmstelZorg',
    location: 'Amsterdam',
    salaryIndication: '€ 2.450 - € 3.100',
    contractHours: '24 - 32 uur',
    contractType: 'Vast',
    profession: 'Helpende Plus',
    publishedAt: '2026-06-01',
    description: 'Ben jij een Helpende Plus die met passie zorgt voor ouderen? Bij AmstelZorg in Amsterdam zoeken we versterking voor ons team in de wijkzorg.'
  },
  {
    id: '2',
    slug: 'verzorgende-ig-revalidatie-utrecht',
    title: 'Verzorgende IG Revalidatie',
    employer: 'UtrechtCare',
    location: 'Utrecht',
    salaryIndication: '€ 2.850 - € 3.750',
    contractHours: '28 - 36 uur',
    contractType: 'Bepaalde tijd',
    profession: 'Verzorgende IG',
    publishedAt: '2026-06-02',
    description: 'Als Verzorgende IG op de revalidatieafdeling help jij cliënten hun zelfstandigheid terug te winnen. Een uitdagende baan in het hart van Utrecht.'
  },
  {
    id: '3',
    slug: 'verpleegkundige-ziekenhuis-rotterdam',
    title: 'Verpleegkundige Interne Geneeskunde',
    employer: 'HavenZiekenhuis',
    location: 'Rotterdam',
    salaryIndication: '€ 3.200 - € 4.500',
    contractHours: '32 - 36 uur',
    contractType: 'Vast',
    profession: 'Verpleegkundige',
    publishedAt: '2026-06-03',
    description: 'Wil jij werken in een dynamisch ziekenhuis in Rotterdam? Wij zoeken een Verpleegkundige voor de afdeling Interne Geneeskunde.'
  },
  {
    id: '4',
    slug: 'wijkverpleegkundige-den-haag',
    title: 'Wijkverpleegkundige (HBO)',
    employer: 'Hofstad Zorg',
    location: 'Den Haag',
    salaryIndication: '€ 3.800 - € 5.200',
    contractHours: '24 - 36 uur',
    contractType: 'Vast',
    profession: 'Wijkverpleegkundige',
    publishedAt: '2026-06-04',
    description: 'Als Wijkverpleegkundige in Den Haag heb jij de regie over de zorg voor jouw cliënten. Je werkt nauw samen met huisartsen en andere disciplines.'
  },
  {
    id: '5',
    slug: 'doktersassistent-gezondheidscentrum-eindhoven',
    title: 'Doktersassistent',
    employer: 'Lichtstad Huisartsen',
    location: 'Eindhoven',
    salaryIndication: '€ 2.600 - € 3.600',
    contractHours: '16 - 24 uur',
    contractType: 'Bepaalde tijd',
    profession: 'Doktersassistent',
    publishedAt: '2026-06-05',
    description: 'Gezocht: een proactieve Doktersassistent voor een modern gezondheidscentrum in Eindhoven. Jij bent het visitekaartje van de praktijk.'
  },
  {
    id: '6',
    slug: 'helpende-plus-thuiszorg-groningen',
    title: 'Helpende Plus Thuiszorg',
    employer: 'NoorderZorg',
    location: 'Groningen',
    salaryIndication: '€ 2.400 - € 3.050',
    contractHours: '20 - 28 uur',
    contractType: 'Vast',
    profession: 'Helpende Plus',
    publishedAt: '2026-06-06',
    description: 'Ondersteun jij onze cliënten graag in hun vertrouwde thuisomgeving? Word Helpende Plus bij NoorderZorg in Groningen.'
  },
  {
    id: '7',
    slug: 'verzorgende-ig-nachtdienst-maastricht',
    title: 'Verzorgende IG (Nachtdienst)',
    employer: 'MaasZorg',
    location: 'Maastricht',
    salaryIndication: '€ 2.900 - € 3.800',
    contractHours: '24 - 32 uur',
    contractType: 'Vast',
    profession: 'Verzorgende IG',
    publishedAt: '2026-06-07',
    description: 'Ben jij een nachtuil met een hart voor de zorg? Wij zoeken een Verzorgende IG voor onze nachtdiensten in Maastricht.'
  },
  {
    id: '8',
    slug: 'verpleegkundige-ggz-arnhem',
    title: 'Verpleegkundige GGZ',
    employer: 'Gelderse Geest',
    location: 'Arnhem',
    salaryIndication: '€ 3.300 - € 4.700',
    contractHours: '24 - 36 uur',
    contractType: 'Bepaalde tijd',
    profession: 'Verpleegkundige',
    publishedAt: '2026-06-08',
    description: 'Maak jij het verschil voor cliënten in de geestelijke gezondheidszorg? Gelderse Geest zoekt verpleegkundigen in de regio Arnhem.'
  },
  {
    id: '9',
    slug: 'wijkverpleegkundige-nijmegen',
    title: 'Wijkverpleegkundige Teamleider',
    employer: 'WaalZorg',
    location: 'Nijmegen',
    salaryIndication: '€ 4.000 - € 5.500',
    contractHours: '32 - 36 uur',
    contractType: 'Vast',
    profession: 'Wijkverpleegkundige',
    publishedAt: '2026-06-09',
    description: 'Combineer jij zorg met leiderschap? Word Wijkverpleegkundige Teamleider bij WaalZorg in Nijmegen.'
  },
  {
    id: '10',
    slug: 'doktersassistent-poli-leiden',
    title: 'Doktersassistent Polikliniek',
    employer: 'Leiden Medical',
    location: 'Leiden',
    salaryIndication: '€ 2.700 - € 3.700',
    contractHours: '24 - 32 uur',
    contractType: 'Vast',
    profession: 'Doktersassistent',
    publishedAt: '2026-06-10',
    description: 'Werk jij graag in een ziekenhuisomgeving? Wij zoeken een Doktersassistent voor onze drukke polikliniek in Leiden.'
  },
  {
    id: '11',
    slug: 'helpende-plus-revalidatie-tilburg',
    title: 'Helpende Plus (Revalidatie)',
    employer: 'BrabantZorg',
    location: 'Tilburg',
    salaryIndication: '€ 2.450 - € 3.150',
    contractHours: '24 - 32 uur',
    contractType: 'Bepaalde tijd',
    profession: 'Helpende Plus',
    publishedAt: '2026-06-11',
    description: 'Ondersteun cliënten bij hun herstel na een operatie of ongeval. Word Helpende Plus bij BrabantZorg in Tilburg.'
  },
  {
    id: '12',
    slug: 'verzorgende-ig-extramuraal-haarlem',
    title: 'Verzorgende IG Thuiszorg',
    employer: 'SpaarneZorg',
    location: 'Haarlem',
    salaryIndication: '€ 2.850 - € 3.780',
    contractHours: '16 - 32 uur',
    contractType: 'Vast',
    profession: 'Verzorgende IG',
    publishedAt: '2026-06-12',
    description: 'Geniet jij van de vrijheid van het werken in de wijk? SpaarneZorg zoekt Verzorgende IG toppers in Haarlem.'
  },
  {
    id: '13',
    slug: 'verpleegkundige-ouderenzorg-enschede',
    title: 'Verpleegkundige Ouderenzorg',
    employer: 'TwenteCare',
    location: 'Enschede',
    salaryIndication: '€ 3.200 - € 4.600',
    contractHours: '24 - 36 uur',
    contractType: 'Vast',
    profession: 'Verpleegkundige',
    publishedAt: '2026-06-13',
    description: 'Breng jij kwaliteitszorg naar onze bewoners in Enschede? Word Verpleegkundige bij TwenteCare.'
  },
  {
    id: '14',
    slug: 'wijkverpleegkundige-ameresfoort',
    title: 'Wijkverpleegkundige (Zzp mogelijk)',
    employer: 'KeiZorg',
    location: 'Amersfoort',
    salaryIndication: '€ 45 - € 65 per uur',
    contractHours: 'Flexibel',
    contractType: 'ZZP',
    profession: 'Wijkverpleegkundige',
    publishedAt: '2026-06-14',
    description: 'Ben jij een zelfstandige Wijkverpleegkundige die op zoek is naar uitdagende opdrachten in Amersfoort?'
  },
  {
    id: '15',
    slug: 'doktersassistent-kindergeneeskunde-almere',
    title: 'Doktersassistent Kindergeneeskunde',
    employer: 'PolderKliniek',
    location: 'Almere',
    salaryIndication: '€ 2.650 - € 3.650',
    contractHours: '24 - 36 uur',
    contractType: 'Vast',
    profession: 'Doktersassistent',
    publishedAt: '2026-06-15',
    description: 'Heb jij affiniteit met kinderen? Wij zoeken een Doktersassistent voor onze afdeling Kindergeneeskunde in Almere.'
  },
  {
    id: '16',
    slug: 'helpende-plus-belevingsgerichte-zorg-breda',
    title: 'Helpende Plus (Dementie)',
    employer: 'BredaCare',
    location: 'Breda',
    salaryIndication: '€ 2.450 - € 3.100',
    contractHours: '24 - 32 uur',
    contractType: 'Vast',
    profession: 'Helpende Plus',
    publishedAt: '2026-06-16',
    description: 'Bij BredaCare staat belevingsgerichte zorg centraal. Ben jij de Helpende Plus die onze bewoners met dementie een fijne dag bezorgt?'
  },
  {
    id: '17',
    slug: 'verzorgende-ig-pga-apeldoorn',
    title: 'Verzorgende IG (PG-afdeling)',
    employer: 'VeluweZorg',
    location: 'Apeldoorn',
    salaryIndication: '€ 2.850 - € 3.750',
    contractHours: '24 - 36 uur',
    contractType: 'Bepaalde tijd',
    profession: 'Verzorgende IG',
    publishedAt: '2026-06-17',
    description: 'Affiniteit met psychogeriatrie? Kom werken als Verzorgende IG op onze PG-afdeling in het groene Apeldoorn.'
  },
  {
    id: '18',
    slug: 'verpleegkundige-oncologie-zwolle',
    title: 'Verpleegkundige Oncologie',
    employer: 'IJsselZorg',
    location: 'Zwolle',
    salaryIndication: '€ 3.400 - € 4.800',
    contractHours: '32 - 36 uur',
    contractType: 'Vast',
    profession: 'Verpleegkundige',
    publishedAt: '2026-06-18',
    description: 'Bied jij hoogwaardige zorg en een luisterend oor aan oncologiepatiënten? IJsselZorg in Zwolle zoekt verpleegkundigen.'
  },
  {
    id: '19',
    slug: 'wijkverpleegkundige-den-bosch',
    title: 'Wijkverpleegkundige (Wijkteam)',
    employer: 'BrabantThuis',
    location: 'Den Bosch',
    salaryIndication: '€ 3.850 - € 5.300',
    contractHours: '28 - 36 uur',
    contractType: 'Vast',
    profession: 'Wijkverpleegkundige',
    publishedAt: '2026-06-19',
    description: 'Samen met je team ben je verantwoordelijk voor de zorg in een wijk in Den Bosch. Word Wijkverpleegkundige bij BrabantThuis.'
  },
  {
    id: '20',
    slug: 'doktersassistent-avondpraktijk-delft',
    title: 'Doktersassistent (Avond)',
    employer: 'Prinsenstad Huisartsen',
    location: 'Delft',
    salaryIndication: '€ 2.750 - € 3.800',
    contractHours: '8 - 16 uur',
    contractType: 'Bepaalde tijd',
    profession: 'Doktersassistent',
    publishedAt: '2026-06-20',
    description: 'Werk jij liever in de avonduren? Wij zoeken een Doktersassistent voor onze avondspreekuren in Delft.'
  }
];
