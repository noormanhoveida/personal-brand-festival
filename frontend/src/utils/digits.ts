const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * Converts Persian (۰-۹) and Arabic-Indic (٠-٩) digits to ASCII (0-9).
 * Persian keyboards commonly produce Persian digits by default, so any
 * field validated with an ASCII-only pattern (phone numbers, etc.)
 * needs this normalization first or it will reject correctly-typed
 * input from a Persian keyboard.
 */
export function normalizeDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (ch) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(ch);
    if (persianIndex !== -1) return String(persianIndex);
    const arabicIndex = ARABIC_INDIC_DIGITS.indexOf(ch);
    if (arabicIndex !== -1) return String(arabicIndex);
    return ch;
  });
}
