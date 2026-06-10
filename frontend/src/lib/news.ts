
export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  author: string;
  readingTime: string;
  image: string;
}

export const articles: Article[] = [
  {
    slug: 'nieuwe-cao-vvt-2026',
    title: 'Nieuwe CAO VVT 2026: Wat verandert er voor jou?',
    description: 'De belangrijkste wijzigingen in de CAO VVT voor 2026 op een rij. Ontdek wat dit betekent voor je salaris en secundaire arbeidsvoorwaarden.',
    date: '2026-01-15',
    category: 'CAO & Salaris',
    author: 'Zorgwerkwijzer Redactie',
    readingTime: '5 min',
    image: '/images/news/cao-vvt.jpg',
    content: `
      <p>De onderhandelingen voor de CAO VVT 2026 zijn afgerond. Voor de honderdduizenden medewerkers in de Verpleging, Verzorging en Thuiszorg (VVT) brengt dit belangrijke veranderingen met zich mee. In dit artikel duiken we diep in de details van de nieuwe afspraken.</p>
      
      <h3>Loonstijging in 2026</h3>
      <p>Een van de belangrijkste punten is natuurlijk de structurele loonsverhoging. Per 1 januari 2026 stijgen de salarisschalen met een aanzienlijk percentage om de koopkracht van zorgmedewerkers te borgen. Daarnaast is er een extra focus op de lagere schalen (FWG 15 t/m 35) om de instroom in de zorg aantrekkelijk te houden.</p>
      
      <h3>Reiskostenvergoeding</h3>
      <p>Na de eerdere verhoging in 2025, wordt de reiskostenvergoeding in 2026 verder geoptimaliseerd. Er komt een betere regeling voor medewerkers die met de fiets of het openbaar vervoer naar hun werk komen, passend bij de duurzaamheidsambities van de sector.</p>
      
      <h3>Balans werk-privé</h3>
      <p>Er zijn nieuwe afspraken gemaakt over de zeggenschap over roosters. Medewerkers krijgen meer invloed op hun eigen werktijden, wat moet leiden tot een betere balans tussen werk en privéleven en een lager ziekteverzuim.</p>
    `,
  },
  {
    slug: 'ort-percentages-uitgelegd',
    title: 'Onregelmatigheidstoeslag (ORT) in de zorg: Hoe werkt het precies?',
    description: 'Alles wat je moet weten over ORT percentages in de zorg. Wanneer krijg je 22%, 38%, 44% of 60% toeslag?',
    date: '2026-02-10',
    category: 'Uitleg',
    author: 'Zorgwerkwijzer Redactie',
    readingTime: '4 min',
    image: '/images/news/ort-uitleg.jpg',
    content: `
      <p>Werken in de zorg betekent vaak werken op onregelmatige tijden. Of het nu gaat om nachtdiensten, weekenden of feestdagen; je staat altijd klaar voor je cliënten. Als compensatie voor deze onregelmatigheid ontvang je Onregelmatigheidstoeslag (ORT).</p>
      
      <h3>Wanneer ontvang je welke ORT?</h3>
      <p>De hoogte van de toeslag hangt af van het moment waarop je werkt. Hier zijn de standaard percentages voor de CAO VVT:</p>
      <ul>
        <li><strong>Maandag t/m vrijdag:</strong> 22% voor uren tussen 00:00 - 07:00 en 20:00 - 24:00.</li>
        <li><strong>Zaterdag:</strong> 38% voor uren tussen 00:00 - 08:00 en 12:00 - 24:00.</li>
        <li><strong>Zondag:</strong> 60% voor alle uren.</li>
        <li><strong>Feestdagen:</strong> 60% voor alle uren.</li>
      </ul>
      
      <p>Let op: er gelden vaak specifieke regels voor de berekening over je uurloon. Gebruik onze <a href="/ort-calculator" class="text-sky-600 font-semibold hover:underline">ORT Calculator</a> om je exacte toeslag te berekenen.</p>
    `,
  },
  {
    slug: 'salaris-helpende-plus-2026',
    title: 'Salaris Helpende Plus 2026: Wat kun je verwachten?',
    description: 'Een actueel overzicht van het salaris voor een Helpende Plus in 2026. Bekijk de schalen en doorgroeimogelijkheden.',
    date: '2026-03-05',
    category: 'Functies',
    author: 'Zorgwerkwijzer Redactie',
    readingTime: '3 min',
    image: '/images/news/helpende-plus.jpg',
    content: `
      <p>Als Helpende Plus speel je een cruciale rol in de dagelijkse zorg. Je takenpakket is uitgebreider dan dat van een reguliere helpende, wat ook tot uiting komt in je salaris. In 2026 zien we een positieve trend in de waardering voor deze functie.</p>
      
      <h3>Inschaling (FWG 30)</h3>
      <p>De functie van Helpende Plus wordt meestal ingeschaald in FWG 30 van de CAO VVT. Door de nieuwe CAO afspraken van 2026 zijn de bedragen in deze schaal gecorrigeerd voor inflatie en marktwerking.</p>
      
      <h3>Extra inkomsten</h3>
      <p>Naast je basissalaris heb je als Helpende Plus vaak recht op aanzienlijke toeslagen, aangezien veel van het werk in de vroege ochtend, avond of in het weekend plaatsvindt. Gemiddeld kan dit je netto inkomen met 15% tot 25% verhogen.</p>
    `,
  },
  {
    slug: 'vakantiegeld-in-de-zorg-berekenen',
    title: 'Vakantiegeld in de zorg: Hoe en wanneer wordt het berekend?',
    description: 'Ontdek hoe de 8% vakantietoeslag in de zorg wordt opgebouwd en wanneer dit wordt uitbetaald.',
    date: '2026-04-20',
    category: 'Financieel',
    author: 'Zorgwerkwijzer Redactie',
    readingTime: '3 min',
    image: '/images/news/vakantiegeld.jpg',
    content: `
      <p>Iedereen kijkt uit naar de maand mei: de maand waarin het vakantiegeld meestal wordt uitbetaald. In de zorgsector is dit niet anders. Maar hoe wordt die 8% nu precies berekend?</p>
      
      <h3>Opbouw van vakantiebijslag</h3>
      <p>Je bouwt elke maand 8% vakantiebijslag op over je bruto maandsalaris. Belangrijk om te weten is dat in de meeste zorg-CAO's de onregelmatigheidstoeslag (ORT) ook meetelt voor de opbouw van je vakantiegeld. Dit zorgt voor een leuk extraatje als je veel onregelmatige diensten hebt gedraaid.</p>
      
      <p>Wil je weten hoeveel jij dit jaar ontvangt? Gebruik onze handige <a href="/vakantiegeld-berekenen" class="text-sky-600 font-semibold hover:underline">Vakantiegeld Calculator</a>.</p>
    `,
  },
  {
    slug: 'eindejaarsuitkering-zorg-2026',
    title: 'Eindejaarsuitkering zorg 2026: Alles over de 13e maand',
    description: 'Hoe hoog is de eindejaarsuitkering in 2026? Lees alles over de opbouw en uitbetaling van je dertiende maand.',
    date: '2026-05-15',
    category: 'Financieel',
    author: 'Zorgwerkwijzer Redactie',
    readingTime: '4 min',
    image: '/images/news/eindejaarsuitkering.jpg',
    content: `
      <p>De eindejaarsuitkering (EJU) is een vast onderdeel van je arbeidsvoorwaarden in de zorg. In de CAO VVT is deze gelijkgesteld aan een volledige 13e maand, oftewel 8,33% van je jaarsalaris.</p>
      
      <h3>Wanneer krijg je de uitkering?</h3>
      <p>De eindejaarsuitkering wordt traditiegetrouw in de maand december uitbetaald. Het is een mooi bedrag om de dure feestdagen mee door te komen of om te sparen voor het nieuwe jaar.</p>
      
      <h3>Berekening</h3>
      <p>De berekening vindt plaats over het feitelijk verdiende salaris in het kalenderjaar. Net als bij het vakantiegeld telt bij veel zorg-CAO's de ORT ook mee voor de berekening van je eindejaarsuitkering.</p>
      
      <p>Bereken je verwachte bonus met onze <a href="/eindejaarsuitkering-berekenen" class="text-sky-600 font-semibold hover:underline">Eindejaarsuitkering Calculator</a>.</p>
    `,
  },
];
