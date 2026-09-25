import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cx } from './cx';
import { StudioEseneContainer } from './Layout';
import { StudioEseneWordmark } from './Typography';

export type StudioEseneNavItem = { to: string; label: string; count?: number; end?: boolean };

function Links({ items }: { items: StudioEseneNavItem[] }) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => cx('se-nav__link', isActive && 'is-active')}
        >
          {item.label}
          {item.count ? <span className="se-nav__count">{item.count}</span> : null}
        </NavLink>
      ))}
    </>
  );
}

/**
 * `top`: wordmark + text links (admin). Collapses to a scrolling row below desktop.
 * `bottom`: fixed three-item text tab bar (employee, thumb reach).
 */
export function StudioEseneNavigation({
  items,
  variant = 'top',
  aside,
}: {
  items: StudioEseneNavItem[];
  variant?: 'top' | 'bottom';
  aside?: ReactNode;
}) {
  if (variant === 'bottom') {
    return (
      <nav className="se-tabbar" aria-label="Main">
        <Links items={items} />
      </nav>
    );
  }
  return (
    <header className="se-topbar">
      <StudioEseneContainer className="se-topbar__inner">
        <StudioEseneWordmark />
        {items.length > 0 && (
          <nav className="se-nav" aria-label="Main">
            <Links items={items} />
          </nav>
        )}
        {aside}
      </StudioEseneContainer>
    </header>
  );
}

/** Page frame shared by every module: navigation, main area, optional tab bar. */
export function StudioEseneAppShell({
  header,
  tabbar,
  children,
}: {
  header?: ReactNode;
  tabbar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={cx('se-shell', tabbar ? 'se-shell--tabbar' : undefined)}>
      {header}
      <main className="se-shell__main">{children}</main>
      {tabbar}
    </div>
  );
}
