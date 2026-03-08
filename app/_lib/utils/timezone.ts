/**
 * US Eastern Time DST utilities.
 *
 * DST starts the second Sunday of March at 2 AM and
 * ends the first Sunday of November at 2 AM.
 */

export function isDaylightSavingTime(date: Date): boolean {
  const year = date.getFullYear();

  // Second Sunday of March
  const march = new Date(year, 2, 1);
  const dstStart = new Date(year, 2, 8 + ((7 - march.getDay()) % 7));

  // First Sunday of November
  const november = new Date(year, 10, 1);
  const dstEnd = new Date(year, 10, 1 + ((7 - november.getDay()) % 7));

  return date >= dstStart && date < dstEnd;
}

/**
 * Build a UTC Date from Eastern Time components.
 *
 * Determines EDT vs EST automatically and applies the correct offset
 * (−04:00 or −05:00). Both crawlers funnel through this so the
 * offset logic lives in exactly one place.
 *
 * @param month 0-based (0 = January)
 */
export function createEasternDate(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
): Date {
  const isDST = isDaylightSavingTime(new Date(year, month, day));
  const offset = isDST ? "-04:00" : "-05:00";

  const iso =
    `${year}` +
    `-${String(month + 1).padStart(2, "0")}` +
    `-${String(day).padStart(2, "0")}` +
    `T${String(hours).padStart(2, "0")}` +
    `:${String(minutes).padStart(2, "0")}:00${offset}`;

  return new Date(iso);
}

/**
 * Re-interpret a timezone-naive Date as US Eastern Time.
 *
 * `new Date("September 2, 2026 6:30 AM")` parses in the server's local
 * timezone (UTC on Vercel). The local-time components (getHours, etc.)
 * still hold the ET values we want. This extracts them and rebuilds the
 * Date with the correct ET offset.
 */
export function toEasternDate(naiveDate: Date): Date {
  return createEasternDate(
    naiveDate.getFullYear(),
    naiveDate.getMonth(),
    naiveDate.getDate(),
    naiveDate.getHours(),
    naiveDate.getMinutes(),
  );
}
