import type { ElementType, ReactNode } from 'react';
import { cx } from './cx';

type TextProps = { children: ReactNode; className?: string; as?: ElementType };

/** STUDIO ESENE — the typographic wordmark. */
export function StudioEseneWordmark({ className }: { className?: string }) {
  return <span className={cx('se-wordmark', className)}>Studio Esene</span>;
}

/** Small uppercase tracked label: section names, field labels, meta. */
export function StudioEseneEyebrow({ children, className, as: Tag = 'span' }: TextProps) {
  return <Tag className={cx('se-eyebrow', className)}>{children}</Tag>;
}

/** Serif display title: people, projects, page titles. */
export function StudioEseneTitle({
  children,
  className,
  size = 'lg',
  as: Tag = 'h2',
}: TextProps & { size?: 'xl' | 'lg' | 'md' }) {
  return <Tag className={cx('se-title', `se-title--${size}`, className)}>{children}</Tag>;
}

/** Uppercase sans: dates, project names in operational context. */
export function StudioEseneCaps({ children, className, as: Tag = 'span' }: TextProps) {
  return <Tag className={cx('se-caps', className)}>{children}</Tag>;
}

export function StudioEseneText({
  children,
  className,
  as: Tag = 'p',
  size = 'md',
  tone = 'default',
}: TextProps & { size?: 'md' | 'sm'; tone?: 'default' | 'muted' | 'strong' }) {
  return (
    <Tag
      className={cx(
        'se-text',
        size === 'sm' && 'se-text--sm',
        tone === 'muted' && 'se-text--muted',
        tone === 'strong' && 'se-text--strong',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
