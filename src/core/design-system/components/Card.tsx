import type { HTMLAttributes } from 'react';
import { cx } from './cx';

type Props = HTMLAttributes<HTMLDivElement> & { quiet?: boolean; interactive?: boolean };

/**
 * A single hairline-bordered surface. Use for one focal object on a screen
 * (the current project, a report) — not for tiling dashboards.
 */
export function StudioEseneCard({ quiet, interactive, className, ...rest }: Props) {
  return (
    <div
      className={cx('se-card', quiet && 'se-card--quiet', interactive && 'se-card--interactive', className)}
      {...rest}
    />
  );
}
