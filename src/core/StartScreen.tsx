import { useNavigate } from 'react-router-dom';
import {
  StudioEseneAppShell,
  StudioEseneContainer,
  StudioEseneList,
  StudioEseneListItem,
  StudioEseneNavigation,
  StudioEsenePageHeader,
  StudioEseneText,
} from '@core/design-system';

/** Prototype entry point — stands in for sign-in and role routing. */
export function StartScreen() {
  const navigate = useNavigate();
  const go = (to: string) => () => navigate(to);
  return (
    <StudioEseneAppShell header={<StudioEseneNavigation items={[]} />}>
      <StudioEseneContainer narrow>
        <StudioEsenePageHeader eyebrow="Studio Esene · Internal" title="Sign in as" />
        <StudioEseneList>
          <StudioEseneListItem
            title="Maksym Filipenko"
            meta={<StudioEseneText size="sm" tone="muted">Employee · mobile</StudioEseneText>}
            aside={<span className="se-eyebrow">Open</span>}
            onClick={go('/employee')}
          />
          <StudioEseneListItem
            title="Bright Esene"
            meta={<StudioEseneText size="sm" tone="muted">Owner · admin</StudioEseneText>}
            aside={<span className="se-eyebrow">Open</span>}
            onClick={go('/admin')}
          />
          <StudioEseneListItem
            title="Design system"
            meta={<StudioEseneText size="sm" tone="muted">Tokens and components</StudioEseneText>}
            aside={<span className="se-eyebrow">Open</span>}
            onClick={go('/design')}
          />
        </StudioEseneList>
      </StudioEseneContainer>
    </StudioEseneAppShell>
  );
}
