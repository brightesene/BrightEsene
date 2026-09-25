import { useState } from 'react';
import {
  StudioEseneButton,
  StudioEseneContainer,
  StudioEseneDataList,
  StudioEseneInput,
  StudioEseneList,
  StudioEseneListItem,
  StudioEseneModal,
  StudioEsenePageHeader,
  StudioEseneSection,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneText,
  StudioEseneTitle,
} from '@core/design-system';
import { addDays, formatClock, formatDateShort, formatDistance, fromISODate, parseClock, toISODate } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { projectAddress } from '../data/seed';
import { exceptionLabel, fullName } from '../data/selectors';
import { useTimeStore } from '../data/store';
import type { TimeException } from '../data/types';

/** EXCEPTIONS — calm, one row per issue, one decision per row. */
export function ExceptionsScreen() {
  const now = useNow();
  const store = useTimeStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState('16:30');

  const open = store.exceptions.filter((x) => !x.resolved);
  const resolved = store.exceptions.filter((x) => x.resolved);

  const context = (x: TimeException) => {
    const entry = store.entries.find((e) => e.id === x.entryId)!;
    return {
      entry,
      employee: store.employees.find((e) => e.id === entry.employeeId)!,
      project: store.projects.find((p) => p.id === entry.projectId)!,
    };
  };

  const dayLabel = (iso: string) => {
    if (iso === toISODate(now)) return 'today';
    if (iso === toISODate(addDays(now, -1))) return 'yesterday';
    return formatDateShort(fromISODate(iso));
  };

  const details = (x: TimeException) => {
    const { entry, project } = context(x);
    return x.type === 'gps-deviation'
      ? [
          { label: 'Check-in', value: formatClock(entry.checkIn) },
          { label: 'Expected location', value: project.name },
          { label: 'Recorded distance', value: formatDistance(entry.distance) },
        ]
      : [
          { label: `Checked in ${dayLabel(entry.date)}`, value: formatClock(entry.checkIn) },
          { label: 'Project', value: project.name },
        ];
  };

  const active = open.find((x) => x.id === activeId);
  const close = () => setActiveId(null);

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader eyebrow="Exceptions" title="Attention" />
      <StudioEseneStack gap={8}>
        <StudioEseneSection label={`Open · ${open.length}`}>
          {open.length === 0 ? (
            <StudioEseneStatus tone="ok">All registrations are in order</StudioEseneStatus>
          ) : (
            <StudioEseneList>
              {open.map((x) => {
                const { employee } = context(x);
                return (
                  <StudioEseneListItem
                    key={x.id}
                    title={<StudioEseneTitle size="md" as="span">{fullName(employee)}</StudioEseneTitle>}
                    meta={
                      <StudioEseneStack gap={4}>
                        <StudioEseneStatus tone={x.type === 'gps-deviation' ? 'danger' : 'warning'}>
                          {exceptionLabel[x.type]}
                        </StudioEseneStatus>
                        <StudioEseneDataList columns items={details(x)} />
                      </StudioEseneStack>
                    }
                    aside={
                      <StudioEseneButton size="sm" onClick={() => setActiveId(x.id)}>
                        {x.type === 'gps-deviation' ? 'View' : 'Resolve'}
                      </StudioEseneButton>
                    }
                  />
                );
              })}
            </StudioEseneList>
          )}
        </StudioEseneSection>

        {resolved.length > 0 && (
          <StudioEseneSection label="Resolved">
            <StudioEseneList>
              {resolved.map((x) => {
                const { employee, entry } = context(x);
                return (
                  <StudioEseneListItem
                    key={x.id}
                    title={fullName(employee)}
                    meta={
                      <StudioEseneText size="sm" tone="muted">
                        {exceptionLabel[x.type]} · {formatDateShort(fromISODate(entry.date))} · {x.resolution}
                      </StudioEseneText>
                    }
                    aside={<StudioEseneStatus>Resolved</StudioEseneStatus>}
                  />
                );
              })}
            </StudioEseneList>
          </StudioEseneSection>
        )}
      </StudioEseneStack>

      {active && (
        <StudioEseneModal
          open
          onClose={close}
          eyebrow={exceptionLabel[active.type]}
          title={fullName(context(active).employee)}
          actions={
            active.type === 'gps-deviation' ? (
              <>
                <StudioEseneButton
                  onClick={() => {
                    store.resolveException(active.id, 'Rejected', { reject: true });
                    close();
                  }}
                >
                  Reject
                </StudioEseneButton>
                <StudioEseneButton
                  variant="primary"
                  onClick={() => {
                    store.resolveException(active.id, 'Approved');
                    close();
                  }}
                >
                  Approve
                </StudioEseneButton>
              </>
            ) : (
              <StudioEseneButton
                variant="primary"
                onClick={() => {
                  store.resolveException(active.id, `Checkout set to ${checkOut}`, { checkOut: parseClock(checkOut) });
                  close();
                }}
              >
                Save checkout
              </StudioEseneButton>
            )
          }
        >
          <StudioEseneDataList
            items={[
              ...details(active),
              ...(active.type === 'gps-deviation'
                ? [{ label: 'Project address', value: projectAddress(context(active).project) }]
                : []),
              { label: 'Allowed radius', value: formatDistance(store.settings.gpsRadius) },
            ]}
          />
          {active.type === 'missing-checkout' && (
            <StudioEseneInput
              label="Checkout time"
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              hint="Confirm the time with the employee before saving."
            />
          )}
        </StudioEseneModal>
      )}
    </StudioEseneContainer>
  );
}
