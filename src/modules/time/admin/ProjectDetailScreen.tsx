import { useNavigate, useParams } from 'react-router-dom';
import {
  StudioEseneButton,
  StudioEseneContainer,
  StudioEseneDataList,
  StudioEseneFigure,
  StudioEseneGrid,
  StudioEseneList,
  StudioEseneListItem,
  StudioEsenePageHeader,
  StudioEseneProgress,
  StudioEseneSection,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneText,
} from '@core/design-system';
import { formatClock, formatDateLong, formatDuration, formatPercent, fromISODate, toISODate } from '@core/lib/format';
import { useNow } from '@core/lib/useNow';
import { projectAddress } from '../data/seed';
import { fullName, projectStatusLabel, sumMinutes, workedMinutes } from '../data/selectors';
import { useTimeStore } from '../data/store';

/** PROJECT DETAIL — information, time budget, and who is on site today. */
export function ProjectDetailScreen() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const now = useNow();
  const store = useTimeStore();
  const project = store.projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <StudioEseneContainer>
        <StudioEsenePageHeader eyebrow="Projects" title="Project not found" />
        <StudioEseneButton onClick={() => navigate('/admin/projects')}>All projects</StudioEseneButton>
      </StudioEseneContainer>
    );
  }

  const entries = store.entries.filter((e) => e.projectId === project.id);
  const registered = sumMinutes(entries, now);
  const remaining = project.budgetMinutes - registered;
  const today = entries.filter((e) => e.date === toISODate(now)).sort((a, b) => a.checkIn - b.checkIn);
  const team = [...new Set(entries.map((e) => e.employeeId))]
    .map((id) => store.employees.find((e) => e.id === id)!)
    .map(fullName);
  const status = projectStatusLabel[project.status];

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader
        eyebrow={
          <StudioEseneButton variant="ghost" onClick={() => navigate('/admin/projects')}>
            Projects
          </StudioEseneButton>
        }
        title={project.name}
        meta={<StudioEseneStatus tone={status.tone}>{status.label}</StudioEseneStatus>}
        actions={<StudioEseneButton onClick={() => navigate(`/admin/time?project=${project.id}`)}>View time</StudioEseneButton>}
      />

      <StudioEseneStack gap={8}>
        <StudioEseneSection label="Project information">
          <StudioEseneDataList
            columns
            items={[
              { label: 'Address', value: projectAddress(project) },
              { label: 'Start date', value: formatDateLong(fromISODate(project.startDate)) },
              ...(project.endDate ? [{ label: 'End date', value: formatDateLong(fromISODate(project.endDate)) }] : []),
              { label: 'Team', value: team.length ? team.join(', ') : 'Not assigned' },
            ]}
          />
        </StudioEseneSection>

        <StudioEseneSection label="Time">
          <StudioEseneGrid columns={3}>
            <StudioEseneFigure size="md" label="Budget" value={formatDuration(project.budgetMinutes)} />
            <StudioEseneFigure size="md" label="Registered" value={formatDuration(registered)} />
            <StudioEseneFigure
              size="md"
              label={remaining >= 0 ? 'Remaining' : 'Over budget'}
              value={formatDuration(Math.abs(remaining))}
            />
          </StudioEseneGrid>
          <StudioEseneProgress
            value={registered}
            max={project.budgetMinutes}
            label={`${formatPercent(registered / project.budgetMinutes)} used`}
          />
        </StudioEseneSection>

        <StudioEseneSection label="Today">
          {today.length === 0 ? (
            <StudioEseneText tone="muted">Nobody registered on this project today.</StudioEseneText>
          ) : (
            <StudioEseneList>
              {today.map((e) => (
                <StudioEseneListItem
                  key={e.id}
                  title={fullName(store.employees.find((x) => x.id === e.employeeId)!)}
                  meta={
                    <StudioEseneText size="sm" tone="muted">
                      {formatClock(e.checkIn)} → {e.checkOut != null ? formatClock(e.checkOut) : 'now'}
                    </StudioEseneText>
                  }
                  aside={
                    <>
                      <StudioEseneText tone="strong">{formatDuration(workedMinutes(e, now))}</StudioEseneText>
                      {e.checkOut === null && <StudioEseneStatus tone="ok" live>Working</StudioEseneStatus>}
                    </>
                  }
                />
              ))}
            </StudioEseneList>
          )}
        </StudioEseneSection>
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
