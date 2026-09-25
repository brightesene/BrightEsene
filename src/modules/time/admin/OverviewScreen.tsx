import { useNavigate } from 'react-router-dom';
import {
  StudioEseneButton,
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
import { formatClock, formatDuration, formatWeekdayLong, greeting, toISODate } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { dayState, exceptionLabel, fullName, locationTone, sumMinutes, workedMinutes } from '../data/selectors';
import { useTimeStore } from '../data/store';

/**
 * OVERVIEW — answers four questions, in order:
 * Who is working? Where? Since when? Is anything wrong?
 */
export function OverviewScreen() {
  const now = useNow();
  const navigate = useNavigate();
  const store = useTimeStore();
  const today = toISODate(now);
  const todays = store.entries.filter((e) => e.date === today);

  const states = store.employees.map((e) => ({ employee: e, state: dayState(e.id, store.entries, now) }));
  const count = (s: string) => states.filter((x) => x.state === s).length;

  const working = todays
    .filter((e) => e.checkOut === null)
    .sort((a, b) => a.checkIn - b.checkIn);
  const finished = states.filter((s) => s.state === 'finished');
  const notStarted = states.filter((s) => s.state === 'not-started');
  const openExceptions = store.exceptions.filter((x) => !x.resolved);
  const byType = (t: keyof typeof exceptionLabel) => openExceptions.filter((x) => x.type === t).length;

  const project = (id: string) => store.projects.find((p) => p.id === id);
  const employee = (id: string) => store.employees.find((e) => e.id === id)!;

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader eyebrow={formatWeekdayLong(now)} title={`${greeting(now)}, ${store.admin.firstName}`} />

      <StudioEseneStack gap={8}>
        <StudioEseneSection label="Today">
          <StudioEseneGrid columns={4}>
            <StudioEseneFigure value={count('working')} label="Working" labelPosition="below" />
            <StudioEseneFigure value={count('finished')} label="Finished" labelPosition="below" />
            <StudioEseneFigure value={count('not-started')} label="Not started" labelPosition="below" />
            <StudioEseneFigure value={formatDuration(sumMinutes(todays, now))} label="Registered today" labelPosition="below" />
          </StudioEseneGrid>
        </StudioEseneSection>

        <StudioEseneGrid columns={2}>
          <StudioEseneSection label="Currently working">
            {working.length === 0 ? (
              <StudioEseneText tone="muted">Nobody is checked in.</StudioEseneText>
            ) : (
              <StudioEseneList>
                {working.map((e) => {
                  const loc = locationTone(e, store.settings.gpsRadius);
                  return (
                    <StudioEseneListItem
                      key={e.id}
                      title={fullName(employee(e.employeeId))}
                      onClick={() => navigate(`/admin/projects/${e.projectId}`)}
                      meta={
                        <StudioEseneText size="sm" tone="muted">
                          {project(e.projectId)?.name}
                          <br />
                          {formatClock(e.checkIn)} → now
                        </StudioEseneText>
                      }
                      aside={
                        <>
                          <StudioEseneText tone="strong">{formatDuration(workedMinutes(e, now))}</StudioEseneText>
                          <StudioEseneStatus tone={loc.tone}>{loc.label}</StudioEseneStatus>
                        </>
                      }
                    />
                  );
                })}
              </StudioEseneList>
            )}
          </StudioEseneSection>

          <StudioEseneStack gap={7}>
            <StudioEseneSection
              label="Attention"
              aside={
                openExceptions.length > 0 && (
                  <StudioEseneButton variant="ghost" onClick={() => navigate('/admin/exceptions')}>
                    Review
                  </StudioEseneButton>
                )
              }
            >
              {openExceptions.length === 0 ? (
                <StudioEseneStatus tone="ok">Nothing requires attention</StudioEseneStatus>
              ) : (
                <StudioEseneStack gap={3}>
                  {byType('missing-checkout') > 0 && (
                    <StudioEseneStatus tone="warning">{byType('missing-checkout')} Missing checkout</StudioEseneStatus>
                  )}
                  {byType('gps-deviation') > 0 && (
                    <StudioEseneStatus tone="danger">{byType('gps-deviation')} GPS exception</StudioEseneStatus>
                  )}
                </StudioEseneStack>
              )}
            </StudioEseneSection>

            <StudioEseneSection label="Finished">
              {finished.length === 0 ? (
                <StudioEseneText tone="muted" size="sm">—</StudioEseneText>
              ) : (
                finished.map(({ employee: emp }) => {
                  const entries = todays.filter((e) => e.employeeId === emp.id);
                  return (
                    <StudioEseneText key={emp.id} size="sm">
                      <span className="se-text--strong">{fullName(emp)}</span> · {formatDuration(sumMinutes(entries, now))}
                    </StudioEseneText>
                  );
                })
              )}
            </StudioEseneSection>

            <StudioEseneSection label="Not started">
              <StudioEseneText size="sm" tone={notStarted.length ? 'default' : 'muted'}>
                {notStarted.length ? notStarted.map((s) => fullName(s.employee)).join(', ') : '—'}
              </StudioEseneText>
            </StudioEseneSection>
          </StudioEseneStack>
        </StudioEseneGrid>
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
