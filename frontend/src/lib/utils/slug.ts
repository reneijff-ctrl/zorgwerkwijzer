/**
 * Genereert een URL-vriendelijke slug vanuit een tekst.
 *
 * Voorbeelden:
 *   generateSlug("Verpleegkundige", "Amsterdam")  → "verpleegkundige-amsterdam"
 *   generateSlug("Helpende+")                     → "helpende-plus"
 *   generateSlug("Verzorgende IG", "Maastricht")  → "verzorgende-ig-maastricht"
 */
export function generateSlug(...parts: (string | null | undefined)[]): string {
  return parts
    .filter(Boolean)
    .map((part) =>
      (part as string)
        .toLowerCase()
        .replace(/\+/g, '-plus')          // Helpende+ → helpende-plus
        .normalize('NFD')                 // Decompose diacritics
        .replace(/[\u0300-\u036f]/g, '')  // Verwijder diacritische tekens
        .replace(/[^a-z0-9\s-]/g, '')     // Verwijder overige speciale tekens
        .trim()
        .replace(/\s+/g, '-')             // Spaties → koppeltekens
        .replace(/-+/g, '-'),             // Meerdere koppeltekens samenvoegen
    )
    .join('-');
}

/**
 * Genereert een vacature-slug vanuit functietitel en plaatsnaam.
 *
 * Voorbeeld:
 *   vacancySlugFromTitleAndCity("Verpleegkundige MBO", "Amsterdam") → "verpleegkundige-mbo-amsterdam"
 */
export function vacancySlugFromTitleAndCity(
  title: string,
  city: string | null | undefined,
): string {
  return generateSlug(title, city ?? undefined);
}
