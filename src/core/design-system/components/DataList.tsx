import type { ReactNode } from 'react';
import { cx } from './cx';
import { StudioEseneEyebrow } from './Typography';

type Item = { label: ReactNode; value: ReactNode };

/** Label / value pairs — project information, exception details, profile. */
export function StudioEseneDataList({ items, columns }: { items: Item[]; columns?: boolean }) {
  return (
    <dl className={cx('se-datalist', columns && 'se-datalist--columns')}>
      {items.map((item, i) => (
        <div className="se-datalist__item" key={i}>
          <dt>
            <StudioEseneEyebrow>{item.label}</StudioEseneEyebrow>
          </dt>
          <dd className="se-datalist__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
