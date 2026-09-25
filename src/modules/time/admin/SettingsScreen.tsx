import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  StudioEseneButton,
  StudioEseneContainer,
  StudioEseneGrid,
  StudioEseneInput,
  StudioEsenePageHeader,
  StudioEseneRow,
  StudioEseneSection,
  StudioEseneStack,
  StudioEseneStatus,
  StudioEseneText,
} from '@core/design-system';
import { useTimeStore } from '../data/store';

/** SETTINGS — company-wide rules for time registration. */
export function SettingsScreen() {
  const store = useTimeStore();
  const [draft, setDraft] = useState(store.settings);
  const [saved, setSaved] = useState(false);
  const set = (key: keyof typeof draft, value: string) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [key]: key === 'companyName' ? value : Number(value) }));
  };

  return (
    <StudioEseneContainer>
      <StudioEsenePageHeader eyebrow="Settings" title="Settings" />
      <StudioEseneStack gap={8}>
        <StudioEseneSection label="Company">
          <StudioEseneGrid columns={2}>
            <StudioEseneInput label="Company name" value={draft.companyName} onChange={(e) => set('companyName', e.target.value)} />
          </StudioEseneGrid>
        </StudioEseneSection>

        <StudioEseneSection label="Time registration">
          <StudioEseneGrid columns={3}>
            <StudioEseneInput
              label="GPS radius (m)"
              type="number"
              min={25}
              value={draft.gpsRadius}
              onChange={(e) => set('gpsRadius', e.target.value)}
              hint="Check-ins further away are flagged as exceptions."
            />
            <StudioEseneInput
              label="Automatic break (min)"
              type="number"
              min={0}
              value={draft.breakMinutes}
              onChange={(e) => set('breakMinutes', e.target.value)}
            />
            <StudioEseneInput
              label="Break applies after (min)"
              type="number"
              min={0}
              value={draft.breakAfterMinutes}
              onChange={(e) => set('breakAfterMinutes', e.target.value)}
            />
          </StudioEseneGrid>
        </StudioEseneSection>

        <StudioEseneSection label="Reports">
          <StudioEseneGrid columns={3}>
            <StudioEseneInput
              label="Monthly report day"
              type="number"
              min={1}
              max={28}
              value={draft.reportDay}
              onChange={(e) => set('reportDay', e.target.value)}
            />
          </StudioEseneGrid>
        </StudioEseneSection>

        <StudioEseneRow gap={5}>
          <StudioEseneButton
            variant="primary"
            onClick={() => {
              store.updateSettings(draft);
              setSaved(true);
            }}
          >
            Save settings
          </StudioEseneButton>
          {saved && <StudioEseneStatus tone="ok">Saved</StudioEseneStatus>}
        </StudioEseneRow>

        <StudioEseneSection label="Prototype">
          <StudioEseneText size="sm" tone="muted">
            Demo data is stored in this browser and re-seeded daily.
          </StudioEseneText>
          <StudioEseneRow gap={5}>
            <StudioEseneButton size="sm" onClick={store.resetDemo}>
              Reset demo data
            </StudioEseneButton>
            <Link className="se-button se-button--ghost" to="/design">
              Design system
            </Link>
          </StudioEseneRow>
        </StudioEseneSection>
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
