import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StartScreen } from '@core/StartScreen';
import { DesignSystemScreen } from '@core/design-system/DesignSystemScreen';
import { TimeStoreProvider } from '@modules/time/data/store';
import { EmployeeLayout } from '@modules/time/employee/EmployeeLayout';
import { TodayScreen } from '@modules/time/employee/TodayScreen';
import { HoursScreen } from '@modules/time/employee/HoursScreen';
import { ProfileScreen } from '@modules/time/employee/ProfileScreen';
import { AdminLayout } from '@modules/time/admin/AdminLayout';
import { OverviewScreen } from '@modules/time/admin/OverviewScreen';
import { TimeScreen } from '@modules/time/admin/TimeScreen';
import { ProjectsScreen } from '@modules/time/admin/ProjectsScreen';
import { ProjectDetailScreen } from '@modules/time/admin/ProjectDetailScreen';
import { EmployeesScreen } from '@modules/time/admin/EmployeesScreen';
import { ReportsScreen } from '@modules/time/admin/ReportsScreen';
import { ExceptionsScreen } from '@modules/time/admin/ExceptionsScreen';
import { SettingsScreen } from '@modules/time/admin/SettingsScreen';

export function App() {
  return (
    <TimeStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/design" element={<DesignSystemScreen />} />
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<TodayScreen />} />
            <Route path="hours" element={<HoursScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OverviewScreen />} />
            <Route path="time" element={<TimeScreen />} />
            <Route path="projects" element={<ProjectsScreen />} />
            <Route path="projects/:projectId" element={<ProjectDetailScreen />} />
            <Route path="employees" element={<EmployeesScreen />} />
            <Route path="reports" element={<ReportsScreen />} />
            <Route path="exceptions" element={<ExceptionsScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TimeStoreProvider>
  );
}
