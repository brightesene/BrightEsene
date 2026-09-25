/** Formatting helpers shared by every module. Locale: en-GB, Europe/Brussels. */

const LOCALE = 'en-GB';

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** 434 → "7h 14m"; 60 → "1h 00m"; 5 → "0h 05m". */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return `${Math.floor(m / 60)}h ${pad(m % 60)}m`;
}

/** 5250 → "87.5" style decimal hours for exports. */
export function toDecimalHours(minutes: number): string {
  return (minutes / 60).toFixed(2);
}

/** Minutes since midnight → "08:02". */
export function formatClock(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

export function parseClock(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Local calendar date as "YYYY-MM-DD". */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** "24 September 2026" */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString(LOCALE, { day: '2-digit', month: 'long', year: 'numeric' });
}

/** "Thursday 24 September" */
export function formatWeekdayLong(date: Date): string {
  return date.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
}

/** "Thu 24 Sep" */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString(LOCALE, { weekday: 'short', day: '2-digit', month: 'short' }).replace(',', '');
}

/** "September 2026" */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' });
}

export function greeting(date: Date): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7;
  return addDays(d, -day);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}
