import { minutesOfDay, toISODate } from '@core/lib/format';
import type { StatusTone } from '@core/design-system';
import type { Employee, Project, TimeEntry, TimeException } from './types';

/** Net minutes worked. Open entries from today run until `now`; older open entries count as 0. */
export function workedMinutes(entry: TimeEntry, now: Date): number {
  const end = entry.checkOut ?? (entry.date === toISODate(now) ? minutesOfDay(now) : entry.checkIn);
  return Math.max(0, end - entry.checkIn - entry.breakMinutes);
}

export function isOpen(entry: TimeEntry): boolean {
  return entry.checkOut === null;
}

export function fullName(e: Employee): string {
  return [e.firstName, e.lastName].filter(Boolean).join(' ');
}

export type DayState = 'working' | 'finished' | 'not-started';

export function dayState(employeeId: string, entries: TimeEntry[], now: Date): DayState {
  const today = entries.filter((e) => e.employeeId === employeeId && e.date === toISODate(now));
  if (today.some(isOpen)) return 'working';
  if (today.length) return 'finished';
  return 'not-started';
}

export function locationTone(entry: TimeEntry, radius: number): { tone: StatusTone; label: string } {
  return entry.distance <= radius
    ? { tone: 'ok', label: 'Location verified' }
    : { tone: 'danger', label: 'GPS deviation' };
}

export const entryStatusLabel: Record<TimeEntry['status'], { tone: StatusTone; label: string }> = {
  working: { tone: 'ok', label: 'Working' },
  completed: { tone: 'neutral', label: 'Completed' },
  approved: { tone: 'neutral', label: 'Approved' },
  exception: { tone: 'warning', label: 'Exception' },
};

export const projectStatusLabel: Record<Project['status'], { tone: StatusTone; label: string }> = {
  active: { tone: 'ok', label: 'Active' },
  planned: { tone: 'neutral', label: 'Planned' },
  completed: { tone: 'neutral', label: 'Completed' },
};

export const exceptionLabel: Record<TimeException['type'], string> = {
  'gps-deviation': 'GPS deviation',
  'missing-checkout': 'Missing checkout',
};

export function sumMinutes(entries: TimeEntry[], now: Date): number {
  return entries.reduce((acc, e) => acc + workedMinutes(e, now), 0);
}

export function inRange(entry: TimeEntry, from: Date, to: Date): boolean {
  return entry.date >= toISODate(from) && entry.date <= toISODate(to);
}
