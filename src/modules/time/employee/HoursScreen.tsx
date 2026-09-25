import {
  StudioEseneContainer,
  StudioEseneFigure,
  StudioEseneGrid,
  StudioEseneList,
  StudioEseneListItem,
  StudioEsenePageHeader,
  StudioEseneSection,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneText,
} from '@core/design-system';
import {
  addDays,
  formatClock,
  formatDateShort,
  formatDuration,
  formatMonth,
  fromISODate,
  startOfMonth,
  startOfWeek,
  toISODate,
} from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { entryStatusLabel, inRange, sumMinutes, workedMinutes } from '../data/selectors';
import { useCurrentEmployee } from './useCurrentEmployee';

/** HOURS — the employee's own registrations, grouped by week. */
export function HoursScreen() {
  const now = useNow();
  const { store, employee } = useCurrentEmployee();
  const mine = store.entries
    .filter((e) => e.employeeId === employee.id)
    .sort((a, b) => (a.date === b.date ? b.checkIn - a.checkIn : a.date < b.date ? 1 : -1));

  const weekStart = startOfWeek(now);
  const week = mine.filter((e) => inRange(e, weekStart, now));
  const month = mine.filter((e) => inRange(e, startOfMonth(now), now));

  // Last four weeks, newest first.
  const weeks = [0, 1, 2, 3].map((i) => {
    const from = addDays(weekStart, -7 * i);
    const to = addDays(from, 6);
    return { from, to, entries: mine.filter((e) => inRange(e, from, to)) };
  });

  return (
    <StudioEseneContainer narrow>
      <StudioEsenePageHeader eyebrow="My hours" title={formatMonth(now)} />
      <StudioEseneStack gap={7}>
        <StudioEseneGrid columns={2}>
          <StudioEseneFigure size="md" label="This week" value={formatDuration(sumMinutes(week, now))} />
          <StudioEseneFigure size="md" label="This month" value={formatDuration(sumMinutes(month, now))} />
        </StudioEseneGrid>

        {weeks.map((w) => (
          <StudioEseneSection
            key={toISODate(w.from)}
            label={`${formatDateShort(w.from)} — ${formatDateShort(w.to)}`}
            aside={<StudioEseneText size="sm" tone="strong">{formatDuration(sumMinutes(w.entries, now))}</StudioEseneText>}
          >
            {w.entries.length === 0 ? (
              <StudioEseneText tone="muted" size="sm">
                No registrations.
              </StudioEseneText>
            ) : (
              <StudioEseneList>
                {w.entries.map((e) => {
                  const project = store.projects.find((p) => p.id === e.projectId);
                  const status = entryStatusLabel[e.status];
                  return (
                    <StudioEseneListItem
                      key={e.id}
                      title={formatDateShort(fromISODate(e.date))}
                      meta={
                        <StudioEseneText size="sm" tone="muted">
                          {project?.name} · {formatClock(e.checkIn)} → {e.checkOut != null ? formatClock(e.checkOut) : 'now'}
                        </StudioEseneText>
                      }
                      aside={
                        <>
                          <StudioEseneText size="sm" tone="strong">
                            {formatDuration(workedMinutes(e, now))}
                          </StudioEseneText>
                          <StudioEseneStatus tone={status.tone}>{status.label}</StudioEseneStatus>
                        </>
                      }
                    />
                  );
                })}
              </StudioEseneList>
            )}
          </StudioEseneSection>
        ))}
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
