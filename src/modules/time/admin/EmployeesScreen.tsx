import { useNavigate } from 'react-router-dom';
import {
  StudioEseneContainer,
  StudioEsenePageHeader,
  StudioEseneStatus,
  StudioEseneTable,
  type StudioEseneColumn,
} from '@core/design-system';
import { formatDuration, startOfMonth, startOfWeek, toISODate } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { dayState, fullName, inRange, sumMinutes } from '../data/selectors';
import { useTimeStore } from '../data/store';
import type { Employee } from '../data/types';

const stateLabel = {
  working: { tone: 'ok', label: 'Working' },
  finished: { tone: 'neutral', label: 'Finished' },
  'not-started': { tone: 'neutral', label: 'Not started' },
} as const;

/** EMPLOYEES — the team, today's state and hours. Row opens their time. */
export function EmployeesScreen() {
  const now = useNow();
  const navigate = useNavigate();
  const store = useTimeStore();
  const mine = (id: string) => store.entries.filter((e) => e.employeeId === id);

  const columns: Array<StudioEseneColumn<Employee>> = [
    { key: 'name', header: 'Name', strong: true, render: (e) => fullName(e) },
    { key: 'title', header: 'Role', render: (e) => e.title },
    {
      key: 'today',
      header: 'Today',
      render: (e) => {
        const s = stateLabel[dayState(e.id, store.entries, now)];
        return <StudioEseneStatus tone={s.tone} live={s.label === 'Working'}>{s.label}</StudioEseneStatus>;
      },
    },
    {
      key: 'project',
      header: 'Current project',
      render: (e) => {
        const last = mine(e.id).filter((x) => x.date <= toISODate(now)).at(-1);
        return store.projects.find((p) => p.id === last?.projectId)?.name ?? '—';
      },
    },
    { key: 'week', header: 'This week', align: 'right', render: (e) => formatDuration(sumMinutes(mine(e.id).filter((x) => inRange(x, startOfWeek(now), now)), now)) },
    { key: 'month', header: 'This month', align: 'right', render: (e) => formatDuration(sumMinutes(mine(e.id).filter((x) => inRange(x, startOfMonth(now), now)), now)) },
  ];

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader eyebrow={`${store.employees.length} people`} title="Employees" />
      <StudioEseneTable
        caption="Employees"
        columns={columns}
        rows={store.employees}
        rowKey={(e) => e.id}
        onRowClick={(e) => navigate(`/admin/time?employee=${e.id}`)}
      />
    </StudioEseneContainer>
  );
}
