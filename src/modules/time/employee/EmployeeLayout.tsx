import { Outlet } from 'react-router-dom';
import { StudioEseneAppShell, StudioEseneNavigation } from '@core/design-system';

const items = [
  { to: '/employee', label: 'Today', end: true },
  { to: '/employee/hours', label: 'Hours' },
  { to: '/employee/profile', label: 'Profile' },
];

/** Employee frame: wordmark on top, three text tabs at thumb reach. */
export function EmployeeLayout() {
  return (
    <StudioEseneAppShell
      header={<StudioEseneNavigation items={[]} />}
      tabbar={<StudioEseneNavigation variant="bottom" items={items} />}
    >
      <Outlet />
    </StudioEseneAppShell>
  );
}
