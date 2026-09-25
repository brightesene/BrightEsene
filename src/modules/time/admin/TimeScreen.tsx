import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  StudioEseneButton,
  StudioEseneContainer,
  StudioEseneFigure,
  StudioEseneGrid,
  StudioEseneInput,
  StudioEsenePageHeader,
  StudioEseneSection,
  StudioEseneSegmented,
  StudioEseneSelect,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneTable,
  type StudioEseneColumn,
} from '@core/design-system';
import { downloadSpreadsheet } from '@core/lib/download';
import {
  formatClock,
  formatDateShort,
  formatDistance,
  formatDuration,
  fromISODate,
  startOfMonth,
  startOfWeek,
  toDecimalHours,
  toISODate,
} from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { entryStatusLabel, fullName, locationTone, sumMinutes, workedMinutes } from '../data/selectors';
import { useTimeStore } from '../data/store';
import type { TimeEntry } from '../data/types';

type Period = 'today' | 'week' | 'month' | 'custom';

/** TIME — every registration, filterable by period, employee, project, status. */
export function TimeScreen() {
  const now = useNow();
  const store = useTimeStore();
  const [params] = useSearchParams();
  const [period, setPeriod] = useState<Period>('week');
  const [from, setFrom] = useState(toISODate(startOfMonth(now)));
  const [to, setTo] = useState(toISODate(now));
  const [employeeId, setEmployeeId] = useState(params.get('employee') ?? '');
  const [projectId, setProjectId] = useState(params.get('project') ?? '');
  const [status, setStatus] = useState('');

  const range = useMemo(() => {
    const t = toISODate(now);
    if (period === 'today') return [t, t];
    if (period === 'week') return [toISODate(startOfWeek(now)), t];
    if (period === 'month') return [toISODate(startOfMonth(now)), t];
    return [from, to];
  }, [period, from, to, now]);

  const rows = store.entries
    .filter(
      (e) =>
        e.date >= range[0] &&
        e.date <= range[1] &&
        (!employeeId || e.employeeId === employeeId) &&
        (!projectId || e.projectId === projectId) &&
        (!status || e.status === status),
    )
    .sort((a, b) => (a.date === b.date ? a.checkIn - b.checkIn : a.date < b.date ? 1 : -1));

  const employeeName = (id: string) => fullName(store.employees.find((e) => e.id === id)!);
  const projectName = (id: string) => store.projects.find((p) => p.id === id)?.name ?? '—';

  const columns: Array<StudioEseneColumn<TimeEntry>> = [
    { key: 'date', header: 'Date', render: (e) => formatDateShort(fromISODate(e.date)) },
    { key: 'employee', header: 'Employee', strong: true, render: (e) => employeeName(e.employeeId) },
    { key: 'project', header: 'Project', render: (e) => projectName(e.projectId) },
    { key: 'in', header: 'Arrival', align: 'right', render: (e) => formatClock(e.checkIn) },
    { key: 'out', header: 'Departure', align: 'right', render: (e) => (e.checkOut != null ? formatClock(e.checkOut) : '—') },
    { key: 'break', header: 'Break', align: 'right', hideOnMobile: true, render: (e) => (e.breakMinutes ? `${e.breakMinutes}m` : '—') },
    { key: 'total', header: 'Total', align: 'right', strong: true, render: (e) => formatDuration(workedMinutes(e, now)) },
    {
      key: 'location',
      header: 'Location',
      render: (e) => {
        const loc = locationTone(e, store.settings.gpsRadius);
        return <StudioEseneStatus tone={loc.tone} plain>{formatDistance(e.distance)}</StudioEseneStatus>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => {
        const s = entryStatusLabel[e.status];
        return <StudioEseneStatus tone={s.tone} live={e.status === 'working'}>{s.label}</StudioEseneStatus>;
      },
    },
  ];

  const exportRows = () =>
    downloadSpreadsheet(
      `studio-esene-time-${range[0]}-${range[1]}`,
      ['Date', 'Employee', 'Project', 'Arrival', 'Departure', 'Break (min)', 'Total (h)', 'Distance (m)', 'Status'],
      rows.map((e) => [
        e.date,
        employeeName(e.employeeId),
        projectName(e.projectId),
        formatClock(e.checkIn),
        e.checkOut != null ? formatClock(e.checkOut) : '',
        e.breakMinutes,
        toDecimalHours(workedMinutes(e, now)),
        e.distance,
        entryStatusLabel[e.status].label,
      ]),
    );

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader
        eyebrow="Time registration"
        title="Time"
        actions={<StudioEseneButton onClick={exportRows}>Export</StudioEseneButton>}
      />
      <StudioEseneStack gap={7}>
        <StudioEseneStack gap={5}>
          <StudioEseneSegmented<Period>
            label="Period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This week' },
              { value: 'month', label: 'This month' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
          <StudioEseneGrid columns={4}>
            {period === 'custom' && (
              <>
                <StudioEseneInput label="From" type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
                <StudioEseneInput label="To" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
              </>
            )}
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
            <StudioEseneSelect
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: '', label: 'All statuses' },
                ...Object.entries(entryStatusLabel).map(([value, s]) => ({ value, label: s.label })),
              ]}
            />
          </StudioEseneGrid>
        </StudioEseneStack>

        <StudioEseneSection>
          <StudioEseneGrid columns={4}>
            <StudioEseneFigure size="md" label="Registered" value={formatDuration(sumMinutes(rows, now))} />
            <StudioEseneFigure size="md" label="Registrations" value={rows.length} />
            <StudioEseneFigure size="md" label="Employees" value={new Set(rows.map((r) => r.employeeId)).size} />
            <StudioEseneFigure size="md" label="Exceptions" value={rows.filter((r) => r.status === 'exception').length} />
          </StudioEseneGrid>
        </StudioEseneSection>

        <StudioEseneTable caption="Time registrations" columns={columns} rows={rows} rowKey={(r) => r.id} />
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
