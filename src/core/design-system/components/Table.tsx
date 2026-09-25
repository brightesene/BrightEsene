import type { ReactNode } from 'react';
import { cx } from './cx';

export type StudioEseneColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right';
  strong?: boolean;
  /** Omit this column from the stacked phone layout. */
  hideOnMobile?: boolean;
};

type Props<T> = {
  columns: Array<StudioEseneColumn<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
  /** On phones, render each row as a stacked label/value block (default on). */
  stackOnMobile?: boolean;
  caption?: string;
};

export function StudioEseneTable<T>({
  columns,
  rows,
  rowKey,
  empty = 'No records for this selection.',
  onRowClick,
  stackOnMobile = true,
  caption,
}: Props<T>) {
  return (
    <div className="se-table-wrap">
      <table className={cx('se-table', stackOnMobile && 'se-table--stack')}>
        {caption && <caption className="se-sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cx(c.align === 'right' && 'se-table__cell--num')}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="se-table__empty">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    data-label={c.header}
                    className={cx(
                      c.align === 'right' && 'se-table__cell--num',
                      c.strong && 'se-table__cell--strong',
                      c.hideOnMobile && 'se-table__cell--hide-mobile',
                    )}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
