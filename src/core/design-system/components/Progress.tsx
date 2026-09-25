import type { ReactNode } from 'react';
import { cx } from './cx';

type Props = { value: number; max: number; label?: ReactNode; aside?: ReactNode };

/** A 2px architectural rule that fills in ink; ochre past 90%, terracotta past 100%. */
export function StudioEseneProgress({ value, max, label, aside }: Props) {
  const ratio = max > 0 ? value / max : 0;
  const tone = ratio > 1 ? 'danger' : ratio > 0.9 ? 'warning' : undefined;
  return (
    <div className={cx('se-progress', tone && `se-progress--${tone}`)}>
      <div
        className="se-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div className="se-progress__bar" style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
      </div>
      {(label || aside) && (
        <div className="se-row se-row--between se-gap-4">
          <span className="se-eyebrow">{label}</span>
          {aside && <span className="se-eyebrow">{aside}</span>}
        </div>
      )}
    </div>
  );
}
