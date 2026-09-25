import type { ReactNode } from 'react';
import { cx } from './cx';
import { StudioEseneEyebrow } from './Typography';

type Props = {
  value: ReactNode;
  label?: ReactNode;
  unit?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  /** Place the label above (default) or below the figure. */
  labelPosition?: 'above' | 'below';
  className?: string;
};

/** A large light numeral with a small label — the dashboard's main device. */
export function StudioEseneFigure({ value, label, unit, size = 'lg', labelPosition = 'above', className }: Props) {
  const labelEl = label ? <StudioEseneEyebrow>{label}</StudioEseneEyebrow> : null;
  return (
    <div className={cx('se-figure', `se-figure--${size}`, className)}>
      {labelPosition === 'above' && labelEl}
      <span className="se-figure__value">
        {value}
        {unit && <span className="se-figure__unit">{unit}</span>}
      </span>
      {labelPosition === 'below' && labelEl}
    </div>
  );
}
