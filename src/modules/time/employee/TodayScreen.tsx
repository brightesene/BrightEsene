import { useMemo } from 'react';
import {
  StudioEseneButton,
  StudioEseneCaps,
  StudioEseneContainer,
  StudioEseneDataList,
  StudioEseneEyebrow,
  StudioEseneFigure,
  StudioEseneSection,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneText,
  StudioEseneTitle,
} from '@core/design-system';
import { formatClock, formatDateLong, formatDistance, formatDuration, greeting, toISODate } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { projectAddress } from '../data/seed';
import { locationTone, sumMinutes, workedMinutes } from '../data/selectors';
import { locateNearProject } from '../data/store';
import { useCurrentEmployee } from './useCurrentEmployee';

/**
 * TODAY — the one screen employees use every day.
 * Three states: before check-in, working, day registered.
 * The primary action is always the single dominant element.
 */
export function TodayScreen() {
  const now = useNow(15_000);
  const { store, employee } = useCurrentEmployee();
  const date = toISODate(now);

  const todays = store.entries.filter((e) => e.employeeId === employee.id && e.date === date);
  const open = todays.find((e) => e.checkOut === null);
  const last = todays[todays.length - 1];

  // Project: today's open entry, else the most recent assignment.
  const project = useMemo(() => {
    const recent = [...store.entries].reverse().find((e) => e.employeeId === employee.id);
    const id = open?.projectId ?? recent?.projectId;
    return store.projects.find((p) => p.id === id) ?? store.projects[0];
  }, [store.entries, store.projects, employee.id, open]);

  const location = locateNearProject(project);
  const withinRadius = location.distance <= store.settings.gpsRadius;
  const todayTotal = sumMinutes(todays, now);

  const header = (
    <StudioEseneStack gap={6}>
      <StudioEseneTitle as="h1" size="xl">
        {greeting(now)},
        <br />
        {employee.firstName}
      </StudioEseneTitle>
      <StudioEseneStack gap={1}>
        <StudioEseneEyebrow>Today</StudioEseneEyebrow>
        <StudioEseneCaps>{formatDateLong(now)}</StudioEseneCaps>
      </StudioEseneStack>
    </StudioEseneStack>
  );

  if (open) {
    const loc = locationTone(open, store.settings.gpsRadius);
    return (
      <StudioEseneContainer narrow top>
        <StudioEseneStack gap={7}>
          <StudioEseneStack gap={5}>
            <StudioEseneStatus tone="ok" live>
              You are working
            </StudioEseneStatus>
            <StudioEseneFigure size="xl" value={formatClock(open.checkIn)} />
            <StudioEseneStack gap={1}>
              <StudioEseneCaps>{project.name}</StudioEseneCaps>
              <StudioEseneText tone="muted" size="sm">
                {projectAddress(project)}
              </StudioEseneText>
            </StudioEseneStack>
          </StudioEseneStack>

          <StudioEseneSection>
            <StudioEseneDataList
              columns
              items={[
                { label: 'Started', value: formatClock(open.checkIn) },
                { label: 'Today', value: formatDuration(todayTotal) },
                { label: 'Location', value: <StudioEseneStatus tone={loc.tone}>{loc.label}</StudioEseneStatus> },
              ]}
            />
          </StudioEseneSection>

          <StudioEseneButton variant="primary" size="hero" block onClick={() => store.checkOut(open.id)}>
            Check out
          </StudioEseneButton>
        </StudioEseneStack>
      </StudioEseneContainer>
    );
  }

  return (
    <StudioEseneContainer narrow top>
      <StudioEseneStack gap={7}>
        {header}

        <StudioEseneSection>
          <StudioEseneStack gap={2}>
            <StudioEseneTitle size="lg">{project.name}</StudioEseneTitle>
            <StudioEseneText tone="muted">
              {project.street}
              <br />
              {project.postcode} {project.city}
            </StudioEseneText>
          </StudioEseneStack>
          <StudioEseneStack gap={2}>
            <StudioEseneText size="sm" tone="strong">
              {formatDistance(location.distance)} from project
            </StudioEseneText>
            <StudioEseneStatus tone={withinRadius ? 'ok' : 'warning'}>
              {withinRadius ? 'Location verified' : 'Outside project area — will be reviewed'}
            </StudioEseneStatus>
          </StudioEseneStack>
        </StudioEseneSection>

        {last && (
          <StudioEseneSection label="Registered today">
            <StudioEseneDataList
              columns
              items={[
                { label: 'Checked in', value: formatClock(last.checkIn) },
                { label: 'Checked out', value: last.checkOut != null ? formatClock(last.checkOut) : '—' },
                { label: 'Total', value: formatDuration(workedMinutes(last, now)) },
              ]}
            />
          </StudioEseneSection>
        )}

        <StudioEseneButton
          variant="primary"
          size="hero"
          block
          onClick={() => store.checkIn(employee.id, project.id, location.distance)}
        >
          {last ? 'Check in again' : 'Check in'}
        </StudioEseneButton>
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
