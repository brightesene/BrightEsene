import { Outlet } from 'react-router-dom';
import { StudioEseneAppShell, StudioEseneNavigation } from '@core/design-system';
import { useTimeStore } from '../data/store';

/** Admin frame: wordmark and text navigation. Desktop-first, collapses on phones. */
export function AdminLayout() {
  const { exceptions } = useTimeStore();
  const open = exceptions.filter((x) => !x.resolved).length;
  const items = [
    { to: '/admin', label: 'Overview', end: true },
    { to: '/admin/time', label: 'Time' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/employees', label: 'Employees' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/exceptions', label: 'Exceptions', count: open },
    { to: '/admin/settings', label: 'Settings' },
  ];
  return (
    <StudioEseneAppShell header={<StudioEseneNavigation items={items} />}>
      <Outlet />
    </StudioEseneAppShell>
  );
}
