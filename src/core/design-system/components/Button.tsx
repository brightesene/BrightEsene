import type { ButtonHTMLAttributes } from 'react';
import { cx } from './cx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'hero';
  block?: boolean;
};

/**
 * Square, uppercase, tracked. `primary` is solid ink, `secondary` an ink
 * outline, `ghost` an underlined text action. `hero` is reserved for the
 * single dominant action on a screen (CHECK IN / CHECK OUT).
 */
export function StudioEseneButton({
  variant = 'secondary',
  size = 'md',
  block,
  className,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={cx(
        'se-button',
        variant !== 'secondary' && `se-button--${variant}`,
        size !== 'md' && `se-button--${size}`,
        block && 'se-button--block',
        className,
      )}
      {...rest}
    />
  );
}
