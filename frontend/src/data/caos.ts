/**
 * Centrale CAO-data voor ZorgWerkwijzer.
 * Één update hier werkt door op alle salaris- en beroepenpagina's.
 */

export interface CaoData {
  /** Interne identifier, gelijk aan URL-slug */
  id: string;
  /** Weergavenaam, bijv. "CAO VVT" */
  name: string;
  /** Volledige naam */
  fullName: string;
  /** URL-pad naar de CAO-pagina */
  href: string;
  /** Loonsverhoging in 2026, bijv. 3.5 (= 3,5%) */
  raisePercent2026: number;
  /** Vakantiegeld-percentage */
  holidayPayPercent: number;
  /** Eindejaarsuitkering-percentage */
  endOfYearPercent: number;
  /** ORT-percentages */
  ort: {
    evening: number;   // ma-vr 20:00-06:00
    saturday: number;  // zaterdag
    sunday: number;    // zondag & feestdagen
  };
  /** Maximale reiskostenvergoeding per km */
  travelCostPerKm: number;
  /** Werkuren per week (standaard) */
  weeklyHours: number;
  /** Korte sectoromschrijving */
  sector: string;
}

export const caos: Record<string, CaoData> = {
  vvt: {
    id: 'vvt',
    name: 'CAO VVT',
    fullName: 'CAO Verpleeg-, Verzorgingshuizen en Thuiszorg',
    href: '/cao-vvt',
    raisePercent2026: 3.5,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    ort: { evening: 22, saturday: 40, sunday: 60 },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    sector: 'Verpleeg-, Verzorgingshuizen en Thuiszorg (VVT)',
  },
  ziekenhuizen: {
    id: 'ziekenhuizen',
    name: 'CAO Ziekenhuizen',
    fullName: 'CAO Ziekenhuizen',
    href: '/cao/ziekenhuizen',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    ort: { evening: 25, saturday: 40, sunday: 65 },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    sector: 'Ziekenhuizen en medisch specialistische zorg',
  },
  ggz: {
    id: 'ggz',
    name: 'CAO GGZ',
    fullName: 'CAO Geestelijke Gezondheidszorg',
    href: '/cao/ggz',
    raisePercent2026: 2.5,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    ort: { evening: 25, saturday: 40, sunday: 65 },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    sector: 'Geestelijke Gezondheidszorg (GGZ)',
  },
  gehandicaptenzorg: {
    id: 'gehandicaptenzorg',
    name: 'CAO Gehandicaptenzorg',
    fullName: 'CAO Gehandicaptenzorg',
    href: '/cao/gehandicaptenzorg',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    ort: { evening: 22, saturday: 40, sunday: 65 },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    sector: 'Gehandicaptenzorg',
  },
  jeugdzorg: {
    id: 'jeugdzorg',
    name: 'CAO Jeugdzorg',
    fullName: 'CAO Jeugdzorg',
    href: '/cao/jeugdzorg',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    ort: { evening: 22, saturday: 40, sunday: 65 },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    sector: 'Jeugdzorg',
  },
  huisartsenzorg: {
    id: 'huisartsenzorg',
    name: 'CAO Huisartsenzorg',
    fullName: 'CAO Huisartsenzorg',
    href: '/cao/huisartsenzorg',
    raisePercent2026: 3.0,
    holidayPayPercent: 8,
    endOfYearPercent: 8.33,
    ort: { evening: 22, saturday: 38, sunday: 60 },
    travelCostPerKm: 0.21,
    weeklyHours: 36,
    sector: 'Huisartsenzorg en eerstelijns gezondheidszorg',
  },
};

export function getCao(id: string): CaoData | undefined {
  return caos[id];
}
