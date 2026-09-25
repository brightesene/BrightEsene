import type { ReactNode } from 'react';
import { StudioEseneEyebrow, StudioEseneTitle } from './Typography';

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
};

/** Page opening: eyebrow, serif title, optional meta and actions. */
export function StudioEsenePageHeader({ eyebrow, title, meta, actions }: Props) {
  return (
    <header className="se-page-header">
      <div className="se-page-header__text">
        {eyebrow && <StudioEseneEyebrow>{eyebrow}</StudioEseneEyebrow>}
        <StudioEseneTitle as="h1" size="xl">
          {title}
        </StudioEseneTitle>
        {meta}
      </div>
      {actions && <div className="se-page-header__actions">{actions}</div>}
    </header>
  );
}
