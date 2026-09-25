import type { ReactNode } from 'react';
import { cx } from './cx';

export function StudioEseneList({ children }: { children: ReactNode }) {
  return <ul className="se-list">{children}</ul>;
}

type ItemProps = {
  title: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  onClick?: () => void;
};

/** A hairline-separated row: title and meta on the left, figures/status right. */
export function StudioEseneListItem({ title, meta, aside, onClick }: ItemProps) {
  return (
    <li
      className={cx('se-list__item', onClick && 'se-list__item--link')}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick()) : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'link' : undefined}
    >
      <div className="se-list__main">
        <span className="se-list__title">{title}</span>
        {meta}
      </div>
      {aside && <div className="se-list__aside">{aside}</div>}
    </li>
  );
}
