import { useState } from 'react';
import {
  StudioEseneButton,
  StudioEseneCard,
  StudioEseneContainer,
  StudioEseneEyebrow,
  StudioEseneGrid,
  StudioEseneInput,
  StudioEseneList,
  StudioEseneListItem,
  StudioEsenePageHeader,
  StudioEseneSection,
  StudioEseneSelect,
  StudioEseneStack,
  StudioEseneText,
  StudioEseneTitle,
} from '@core/design-system';
import { downloadSpreadsheet } from '@core/lib/download';
import { formatClock, formatDateLong, formatMonth, toDecimalHours, toISODate } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { fullName, workedMinutes } from '../data/selectors';
import { useTimeStore } from '../data/store';

/** REPORTS — the monthly report first; a simple generator below. */
export function ReportsScreen() {
  const now = useNow();
  const store = useTimeStore();
  const [from, setFrom] = useState(toISODate(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [to, setTo] = useState(toISODate(now));
  const [employeeId, setEmployeeId] = useState('');
  const [projectId, setProjectId] = useState('');

  const reportDay = store.settings.reportDay;
  // Most recent completed month and the one after it (scheduled).
  const monthStart = (offset: number) => new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const monthEnd = (offset: number) => new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  const generatedOn = (offset: number) => new Date(now.getFullYear(), now.getMonth() + offset + 1, reportDay);

  const download = (fromIso: string, toIso: string, name: string, emp = '', proj = '') => {
    const rows = store.entries
      .filter((e) => e.date >= fromIso && e.date <= toIso && (!emp || e.employeeId === emp) && (!proj || e.projectId === proj))
      .sort((a, b) => (a.date === b.date ? a.checkIn - b.checkIn : a.date < b.date ? -1 : 1));
    downloadSpreadsheet(
      name,
      ['Date', 'Employee', 'Employee number', 'Project', 'Arrival', 'Departure', 'Break (min)', 'Total (h)', 'Status'],
      rows.map((e) => {
        const emp = store.employees.find((x) => x.id === e.employeeId)!;
        return [
          e.date,
          fullName(emp),
          emp.employeeNumber,
          store.projects.find((p) => p.id === e.projectId)?.name ?? '',
          formatClock(e.checkIn),
          e.checkOut != null ? formatClock(e.checkOut) : '',
          e.breakMinutes,
          toDecimalHours(workedMinutes(e, now)),
          e.status,
        ];
      }),
    );
  };

  const monthly = [-1, -2, -3].map((offset) => ({
    offset,
    month: monthStart(offset),
    from: toISODate(monthStart(offset)),
    to: toISODate(monthEnd(offset)),
  }));
  const latest = monthly[0];

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader eyebrow="Reports" title="Reports" />
      <StudioEseneStack gap={8}>
        <StudioEseneCard>
          <StudioEseneStack gap={2}>
            <StudioEseneEyebrow>Monthly time report</StudioEseneEyebrow>
            <StudioEseneTitle size="lg">{formatMonth(latest.month)}</StudioEseneTitle>
            <StudioEseneText tone="muted" size="sm">
              Generated automatically · {formatDateLong(generatedOn(latest.offset))}
            </StudioEseneText>
          </StudioEseneStack>
          <div>
            <StudioEseneButton
              variant="primary"
              onClick={() => download(latest.from, latest.to, `studio-esene-${latest.from.slice(0, 7)}`)}
            >
              Download Excel
            </StudioEseneButton>
          </div>
          <StudioEseneText size="sm" tone="muted">
            Next report: {formatMonth(monthStart(0))} on {formatDateLong(generatedOn(0))}
          </StudioEseneText>
        </StudioEseneCard>

        <StudioEseneSection label="Previous reports">
          <StudioEseneList>
            {monthly.slice(1).map((m) => (
              <StudioEseneListItem
                key={m.from}
                title={formatMonth(m.month)}
                meta={
                  <StudioEseneText size="sm" tone="muted">
                    Generated {formatDateLong(generatedOn(m.offset))}
                  </StudioEseneText>
                }
                aside={
                  <StudioEseneButton size="sm" onClick={() => download(m.from, m.to, `studio-esene-${m.from.slice(0, 7)}`)}>
                    Download
                  </StudioEseneButton>
                }
              />
            ))}
          </StudioEseneList>
        </StudioEseneSection>

        <StudioEseneSection label="Custom report">
          <StudioEseneGrid columns={4}>
            <StudioEseneInput label="From" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
            <StudioEseneInput label="To" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
            <StudioEseneSelect
              label="Employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              options={[{ value: '', label: 'All employees' }, ...store.employees.map((e) => ({ value: e.id, label: fullName(e) }))]}
            />
            <StudioEseneSelect
              label="Project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={[{ value: '', label: 'All projects' }, ...store.projects.map((p) => ({ value: p.id, label: p.name }))]}
            />
          </StudioEseneGrid>
          <div>
            <StudioEseneButton onClick={() => download(from, to, `studio-esene-${from}-${to}`, employeeId, projectId)}>
              Generate Excel
            </StudioEseneButton>
          </div>
        </StudioEseneSection>
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
