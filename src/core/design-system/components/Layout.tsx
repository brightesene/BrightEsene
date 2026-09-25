import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cx } from './cx';
import { StudioEseneEyebrow } from './Typography';

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Base = { children?: ReactNode; className?: string; as?: ElementType; style?: CSSProperties };

export function StudioEseneStack({ children, gap = 4, className, as: Tag = 'div', style }: Base & { gap?: Gap }) {
  return (
    <Tag className={cx('se-stack', `se-gap-${gap}`, className)} style={style}>
      {children}
    </Tag>
  );
}

export function StudioEseneRow({
  children,
  gap = 4,
  justify,
  align,
  wrap = true,
  className,
  as: Tag = 'div',
}: Base & { gap?: Gap; justify?: 'between'; align?: 'baseline'; wrap?: boolean }) {
  return (
    <Tag
      className={cx(
        'se-row',
        `se-gap-${gap}`,
        justify === 'between' && 'se-row--between',
        align === 'baseline' && 'se-row--baseline',
        !wrap && 'se-row--nowrap',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function StudioEseneGrid({ children, columns = 3, className }: Base & { columns?: 2 | 3 | 4 }) {
  return <div className={cx('se-grid', `se-grid--${columns}`, className)}>{children}</div>;
}

/** Page-width wrapper. `narrow` for phone-first screens; `top` adds the standard top spacing. */
export function StudioEseneContainer({ children, narrow, top, className }: Base & { narrow?: boolean; top?: boolean }) {
  return (
    <div className={cx('se-container', narrow && 'se-container--narrow', top && 'se-container--top', className)}>
      {children}
    </div>
  );
}

/** Hairline-topped section with an uppercase label. Replaces boxed cards. */
export function StudioEseneSection({
  children,
  label,
  aside,
  flush,
  className,
}: Base & { label?: ReactNode; aside?: ReactNode; flush?: boolean }) {
  return (
    <section className={cx('se-section', flush && 'se-section--flush', className)}>
      {(label || aside) && (
        <div className="se-section__head">
          {label && <StudioEseneEyebrow as="h2">{label}</StudioEseneEyebrow>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function StudioEseneDivider() {
  return <hr className="se-divider" />;
}
