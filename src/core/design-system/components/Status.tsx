import type { ReactNode } from 'react';
import { cx } from './cx';

export type StatusTone = 'ok' | 'warning' | 'danger' | 'neutral';

type Props = {
  tone?: StatusTone;
  children: ReactNode;
  /** Pulsing dot for live states such as "Working". */
  live?: boolean;
  /** Tinted background; use only where a status must stand out in a table. */
  badge?: boolean;
  /** Sentence case instead of uppercase — for values such as distances. */
  plain?: boolean;
};

/** A small dot and uppercase label in a muted, earth-toned status colour. */
export function StudioEseneStatus({ tone = 'neutral', children, live, badge, plain }: Props) {
  return (
    <span
      className={cx('se-status', tone !== 'neutral' && `se-status--${tone}`, live && 'se-status--live', badge && 'se-status--badge', plain && 'se-status--plain')}
    >
      <span className="se-status__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
