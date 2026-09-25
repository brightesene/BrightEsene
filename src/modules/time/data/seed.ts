/**
 * Demo data. Deterministic, and anchored to the current date so the
 * prototype always shows a plausible "today". Replace with the API.
 */
import { addDays, fromISODate, toISODate } from '@core/lib/format';
import type { Employee, Project, Settings, TimeEntry, TimeException } from './types';

export const employees: Employee[] = [
  { id: 'e-maksym', firstName: 'Maksym', lastName: 'Filipenko', role: 'employee', title: 'Painter', email: 'maksym@studio-esene.be', phone: '+32 470 12 34 56', employeeNumber: 'SE-014' },
  { id: 'e-nkafu', firstName: 'Nkafu', lastName: '', role: 'employee', title: 'Painter', email: 'nkafu@studio-esene.be', phone: '+32 471 22 33 44', employeeNumber: 'SE-009' },
  { id: 'e-arben', firstName: 'Arben', lastName: 'Krasniqi', role: 'employee', title: 'Plasterer', email: 'arben@studio-esene.be', phone: '+32 472 55 66 77', employeeNumber: 'SE-011' },
  { id: 'e-lotte', firstName: 'Lotte', lastName: 'Janssens', role: 'employee', title: 'Finishing specialist', email: 'lotte@studio-esene.be', phone: '+32 473 88 99 00', employeeNumber: 'SE-016' },
  { id: 'e-jonas', firstName: 'Jonas', lastName: 'Peeters', role: 'employee', title: 'Painter', email: 'jonas@studio-esene.be', phone: '+32 474 10 20 30', employeeNumber: 'SE-012' },
];

export const admin: Employee = {
  id: 'a-bright', firstName: 'Bright', lastName: 'Esene', role: 'admin', title: 'Owner', email: 'bright@studio-esene.be', phone: '', employeeNumber: 'SE-001',
};

/** The employee signed into the employee app in this prototype. */
export const CURRENT_EMPLOYEE_ID = 'e-maksym';

export const settings: Settings = {
  companyName: 'Studio Esene BV',
  gpsRadius: 150,
  breakAfterMinutes: 360,
  breakMinutes: 30,
  reportDay: 1,
};

const today = new Date();
const iso = (offset: number) => toISODate(addDays(today, offset));

export const projects: Project[] = [
  { id: 'p-leuven', name: 'Apartment Leuven', street: 'Naamsesteenweg 112', postcode: '3000', city: 'Leuven', status: 'active', startDate: iso(-14), budgetMinutes: 120 * 60 },
  { id: 'p-antwerp', name: 'Townhouse Antwerp', street: 'Cogels-Osylei 48', postcode: '2600', city: 'Antwerpen', status: 'active', startDate: iso(-38), budgetMinutes: 460 * 60 },
  { id: 'p-brasschaat', name: 'Villa Brasschaat', street: 'Bredabaan 710', postcode: '2930', city: 'Brasschaat', status: 'active', startDate: iso(-23), budgetMinutes: 300 * 60 },
  { id: 'p-gent', name: 'Penthouse Gent', street: 'Coupure Links 25', postcode: '9000', city: 'Gent', status: 'completed', startDate: iso(-84), endDate: iso(-42), budgetMinutes: 400 * 60 },
  { id: 'p-knokke', name: 'Residence Knokke', street: 'Zeedijk 202', postcode: '8300', city: 'Knokke-Heist', status: 'planned', startDate: iso(21), budgetMinutes: 240 * 60 },
];

/** Who worked where, and when (inclusive day offsets from today). */
const assignments: Array<{ employeeId: string; projectId: string; from: number; to: number }> = [
  { employeeId: 'e-maksym', projectId: 'p-gent', from: -84, to: -42 },
  { employeeId: 'e-maksym', projectId: 'p-antwerp', from: -38, to: -15 },
  { employeeId: 'e-maksym', projectId: 'p-leuven', from: -14, to: 0 },
  { employeeId: 'e-nkafu', projectId: 'p-gent', from: -84, to: -42 },
  { employeeId: 'e-nkafu', projectId: 'p-antwerp', from: -38, to: 0 },
  { employeeId: 'e-arben', projectId: 'p-gent', from: -84, to: -24 },
  { employeeId: 'e-arben', projectId: 'p-brasschaat', from: -23, to: 0 },
  { employeeId: 'e-lotte', projectId: 'p-antwerp', from: -38, to: 0 },
  { employeeId: 'e-jonas', projectId: 'p-gent', from: -84, to: -42 },
  { employeeId: 'e-jonas', projectId: 'p-brasschaat', from: -23, to: 0 },
];

// Small deterministic PRNG so the demo data is stable between reloads.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildEntries(): TimeEntry[] {
  const rand = rng(24092026);
  const entries: TimeEntry[] = [];
  for (let offset = -84; offset <= -1; offset++) {
    const date = addDays(today, offset);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;
    for (const a of assignments) {
      if (offset < a.from || offset > a.to) continue;
      const halfDay = a.employeeId === 'e-lotte' && dow === 5;
      const checkIn = 7 * 60 + 30 + Math.floor(rand() * 40);
      const length = halfDay ? 240 + Math.floor(rand() * 30) : 510 + Math.floor(rand() * 50);
      entries.push({
        id: `t-${a.employeeId}-${toISODate(date)}`,
        employeeId: a.employeeId,
        projectId: a.projectId,
        date: toISODate(date),
        checkIn,
        checkOut: checkIn + length,
        breakMinutes: halfDay ? 0 : 30,
        distance: 8 + Math.floor(rand() * 90),
        status: offset < -7 ? 'approved' : 'completed',
      });
    }
  }
  return entries;
}

export function seedEntries(): TimeEntry[] {
  const entries = buildEntries();
  const d0 = iso(0);

  // Yesterday: Jonas never checked out → missing checkout.
  const lastWorkday = [...entries].reverse().find((e) => e.employeeId === 'e-jonas' && e.projectId === 'p-brasschaat');
  if (lastWorkday) {
    lastWorkday.checkIn = 7 * 60 + 57;
    lastWorkday.checkOut = null;
    lastWorkday.breakMinutes = 0;
    lastWorkday.status = 'exception';
  }

  // Today.
  entries.push(
    { id: `t-e-nkafu-${d0}`, employeeId: 'e-nkafu', projectId: 'p-antwerp', date: d0, checkIn: 7 * 60 + 56, checkOut: null, breakMinutes: 0, distance: 21, status: 'working' },
    { id: `t-e-arben-${d0}`, employeeId: 'e-arben', projectId: 'p-brasschaat', date: d0, checkIn: 8 * 60 + 3, checkOut: null, breakMinutes: 0, distance: 842, status: 'exception' },
    { id: `t-e-lotte-${d0}`, employeeId: 'e-lotte', projectId: 'p-antwerp', date: d0, checkIn: 7 * 60 + 30, checkOut: 11 * 60 + 45, breakMinutes: 0, distance: 17, status: 'completed' },
  );
  return entries;
}

export function seedExceptions(entries: TimeEntry[]): TimeException[] {
  const d0 = iso(0);
  const missing = entries.find((e) => e.employeeId === 'e-jonas' && e.checkOut === null && e.date !== d0);
  const list: TimeException[] = [{ id: 'x-gps-arben', type: 'gps-deviation', entryId: `t-e-arben-${d0}`, resolved: false }];
  if (missing) list.push({ id: 'x-missing-jonas', type: 'missing-checkout', entryId: missing.id, resolved: false });
  return list;
}

export function projectAddress(p: Project): string {
  return `${p.street}, ${p.postcode} ${p.city}`;
}

export function isOnDate(entry: TimeEntry, date: Date): boolean {
  return entry.date === toISODate(date);
}

export function entryDate(entry: TimeEntry): Date {
  return fromISODate(entry.date);
}
