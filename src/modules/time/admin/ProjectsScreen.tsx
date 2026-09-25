import { useNavigate } from 'react-router-dom';
import {
  StudioEseneContainer,
  StudioEsenePageHeader,
  StudioEseneProgress,
  StudioEseneStatus,
  StudioEseneTable,
  type StudioEseneColumn,
} from '@core/design-system';
import { formatDuration, formatPercent } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { projectStatusLabel, sumMinutes } from '../data/selectors';
import { useTimeStore } from '../data/store';
import type { Project } from '../data/types';

/** PROJECTS — every site, its state and how much of its budget is used. */
export function ProjectsScreen() {
  const now = useNow();
  const navigate = useNavigate();
  const store = useTimeStore();
  const registered = (p: Project) => sumMinutes(store.entries.filter((e) => e.projectId === p.id), now);
  const order = { active: 0, planned: 1, completed: 2 };
  const rows = [...store.projects].sort((a, b) => order[a.status] - order[b.status]);

  const columns: Array<StudioEseneColumn<Project>> = [
    { key: 'name', header: 'Project', strong: true, render: (p) => p.name },
    { key: 'city', header: 'Location', render: (p) => p.city },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StudioEseneStatus tone={projectStatusLabel[p.status].tone}>{projectStatusLabel[p.status].label}</StudioEseneStatus>,
    },
    { key: 'budget', header: 'Budget', align: 'right', render: (p) => formatDuration(p.budgetMinutes) },
    { key: 'registered', header: 'Registered', align: 'right', render: (p) => formatDuration(registered(p)) },
    {
      key: 'used',
      header: 'Used',
      render: (p) => (
        <StudioEseneProgress value={registered(p)} max={p.budgetMinutes} aside={formatPercent(registered(p) / p.budgetMinutes)} />
      ),
    },
  ];

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader eyebrow={`${store.projects.filter((p) => p.status === 'active').length} active`} title="Projects" />
      <StudioEseneTable
        caption="Projects"
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        onRowClick={(p) => navigate(`/admin/projects/${p.id}`)}
      />
    </StudioEseneContainer>
  );
}
