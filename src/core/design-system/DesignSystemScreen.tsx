import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StudioEseneAppShell,
  StudioEseneButton,
  StudioEseneCaps,
  StudioEseneCard,
  StudioEseneContainer,
  StudioEseneDataList,
  StudioEseneEyebrow,
  StudioEseneFigure,
  StudioEseneGrid,
  StudioEseneInput,
  StudioEseneList,
  StudioEseneListItem,
  StudioEseneModal,
  StudioEseneNavigation,
  StudioEsenePageHeader,
  StudioEseneProgress,
  StudioEseneSection,
  StudioEseneSegmented,
  StudioEseneSelect,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneTable,
  StudioEseneText,
  StudioEseneTitle,
} from '.';

const colours = [
  ['--se-color-paper', 'Paper'],
  ['--se-color-paper-raised', 'Paper raised'],
  ['--se-color-plaster', 'Plaster'],
  ['--se-color-stone', 'Stone'],
  ['--se-color-stone-strong', 'Stone strong'],
  ['--se-color-taupe', 'Taupe'],
  ['--se-color-ink-soft', 'Ink soft'],
  ['--se-color-ink', 'Ink'],
  ['--se-color-accent', 'Accent'],
  ['--se-status-ok', 'Status ok'],
  ['--se-status-warning', 'Status warning'],
  ['--se-status-danger', 'Status danger'],
] as const;

/** Living reference of tokens and components. Every module renders from these. */
export function DesignSystemScreen() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [period, setPeriod] = useState('week');

  return (
    <StudioEseneAppShell header={<StudioEseneNavigation items={[{ to: '/', label: 'Back' }]} />}>
      <StudioEseneContainer>
        <StudioEsenePageHeader
          eyebrow="Core · Design system"
          title="Studio Esene UI"
          meta={
            <StudioEseneText tone="muted">
              Tokens live in <code>src/core/design-system/tokens.css</code>. Screens compose these components only.
            </StudioEseneText>
          }
        />
        <StudioEseneStack gap={8}>
          <StudioEseneSection label="Colour">
            <StudioEseneGrid columns={4}>
              {colours.map(([token, name]) => (
                <StudioEseneStack gap={2} key={token}>
                  {/* Swatches are the one place a token is shown as a raw value. */}
                  <div style={{ height: '4.5rem', background: `var(${token})`, border: 'var(--se-border-hairline)' }} />
                  <StudioEseneText size="sm" tone="strong">{name}</StudioEseneText>
                  <StudioEseneEyebrow>{token}</StudioEseneEyebrow>
                </StudioEseneStack>
              ))}
            </StudioEseneGrid>
          </StudioEseneSection>

          <StudioEseneSection label="Typography">
            <StudioEseneStack gap={5}>
              <StudioEseneTitle size="xl">Apartment Leuven — Display XL</StudioEseneTitle>
              <StudioEseneTitle size="lg">Maksym Filipenko — Display L</StudioEseneTitle>
              <StudioEseneTitle size="md">Section title — Display M</StudioEseneTitle>
              <StudioEseneCaps>24 September 2026 — Caps</StudioEseneCaps>
              <StudioEseneText>Body — generous whitespace and strong typography carry the hierarchy.</StudioEseneText>
              <StudioEseneText size="sm" tone="muted">Small muted — metadata and secondary information.</StudioEseneText>
              <StudioEseneEyebrow>Eyebrow — section labels</StudioEseneEyebrow>
            </StudioEseneStack>
          </StudioEseneSection>

          <StudioEseneSection label="Figures">
            <StudioEseneGrid columns={3}>
              <StudioEseneFigure size="xl" value="08:02" label="Clock · XL" labelPosition="below" />
              <StudioEseneFigure size="lg" value="3" label="Working · L" labelPosition="below" />
              <StudioEseneFigure size="md" value="21h 42m" label="Total · M" labelPosition="below" />
            </StudioEseneGrid>
          </StudioEseneSection>

          <StudioEseneSection label="Buttons">
            <StudioEseneGrid columns={3}>
              <StudioEseneButton variant="primary">Primary</StudioEseneButton>
              <StudioEseneButton>Secondary</StudioEseneButton>
              <StudioEseneButton variant="ghost">Ghost</StudioEseneButton>
            </StudioEseneGrid>
            <StudioEseneButton variant="primary" size="hero" block>
              Check in — hero
            </StudioEseneButton>
          </StudioEseneSection>

          <StudioEseneSection label="Form fields">
            <StudioEseneGrid columns={3}>
              <StudioEseneInput label="Input" placeholder="Placeholder" hint="Hint text" />
              <StudioEseneInput label="Invalid" defaultValue="—" error="Explain what to fix." />
              <StudioEseneSelect label="Select" options={[{ value: 'a', label: 'All projects' }]} />
            </StudioEseneGrid>
            <StudioEseneSegmented
              label="Period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This week' },
                { value: 'month', label: 'This month' },
              ]}
            />
          </StudioEseneSection>

          <StudioEseneSection label="Status">
            <StudioEseneStack gap={4}>
              <StudioEseneGrid columns={4}>
                <StudioEseneStatus tone="ok" live>Working</StudioEseneStatus>
                <StudioEseneStatus tone="warning">Missing checkout</StudioEseneStatus>
                <StudioEseneStatus tone="danger">GPS deviation</StudioEseneStatus>
                <StudioEseneStatus>Finished</StudioEseneStatus>
              </StudioEseneGrid>
              <StudioEseneGrid columns={4}>
                <StudioEseneStatus tone="ok" badge>Approved</StudioEseneStatus>
                <StudioEseneStatus tone="warning" badge>Pending</StudioEseneStatus>
                <StudioEseneStatus tone="danger" badge>Rejected</StudioEseneStatus>
                <StudioEseneStatus badge>Draft</StudioEseneStatus>
              </StudioEseneGrid>
            </StudioEseneStack>
          </StudioEseneSection>

          <StudioEseneSection label="Progress">
            <StudioEseneGrid columns={3}>
              <StudioEseneProgress value={72.9} max={100} label="72.9% used" />
              <StudioEseneProgress value={94} max={100} label="94.0% used" />
              <StudioEseneProgress value={112} max={100} label="112.0% used" />
            </StudioEseneGrid>
          </StudioEseneSection>

          <StudioEseneGrid columns={2}>
            <StudioEseneSection label="List">
              <StudioEseneList>
                <StudioEseneListItem
                  title="Maksym Filipenko"
                  meta={<StudioEseneText size="sm" tone="muted">Apartment Leuven · 08:02 → now</StudioEseneText>}
                  aside={<StudioEseneStatus tone="ok">Location verified</StudioEseneStatus>}
                />
                <StudioEseneListItem
                  title="Nkafu"
                  meta={<StudioEseneText size="sm" tone="muted">Townhouse Antwerp · 07:56 → now</StudioEseneText>}
                  aside={<StudioEseneStatus tone="ok">Location verified</StudioEseneStatus>}
                />
              </StudioEseneList>
            </StudioEseneSection>
            <StudioEseneSection label="Data list">
              <StudioEseneDataList
                columns
                items={[
                  { label: 'Address', value: 'Naamsesteenweg 112, 3000 Leuven' },
                  { label: 'Start date', value: '10 September 2026' },
                  { label: 'Team', value: 'Maksym Filipenko' },
                ]}
              />
            </StudioEseneSection>
          </StudioEseneGrid>

          <StudioEseneSection label="Table">
            <StudioEseneTable
              columns={[
                { key: 'e', header: 'Employee', strong: true, render: (r: { e: string; t: string }) => r.e },
                { key: 't', header: 'Total', align: 'right', render: (r) => r.t },
              ]}
              rows={[
                { e: 'Maksym Filipenko', t: '8h 05m' },
                { e: 'Nkafu', t: '8h 03m' },
              ]}
              rowKey={(r) => r.e}
            />
          </StudioEseneSection>

          <StudioEseneSection label="Card and modal">
            <StudioEseneGrid columns={2}>
              <StudioEseneCard>
                <StudioEseneEyebrow>Card</StudioEseneEyebrow>
                <StudioEseneText>One focal object per screen. Never tiled.</StudioEseneText>
              </StudioEseneCard>
              <div>
                <StudioEseneButton onClick={() => setModal(true)}>Open modal</StudioEseneButton>
              </div>
            </StudioEseneGrid>
          </StudioEseneSection>

          <StudioEseneButton variant="ghost" onClick={() => navigate('/')}>
            Back to start
          </StudioEseneButton>
        </StudioEseneStack>
      </StudioEseneContainer>

      <StudioEseneModal
        open={modal}
        onClose={() => setModal(false)}
        eyebrow="Modal"
        title="Missing checkout"
        actions={
          <StudioEseneButton variant="primary" onClick={() => setModal(false)}>
            Confirm
          </StudioEseneButton>
        }
      >
        <StudioEseneText>Bottom sheet on phones, centred panel on desktop.</StudioEseneText>
      </StudioEseneModal>
    </StudioEseneAppShell>
  );
}
