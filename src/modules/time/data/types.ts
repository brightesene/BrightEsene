export type Role = 'employee' | 'admin';

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  title: string;
  email: string;
  phone: string;
  employeeNumber: string;
};

export type ProjectStatus = 'active' | 'planned' | 'completed';

export type Project = {
  id: string;
  name: string;
  street: string;
  postcode: string;
  city: string;
  status: ProjectStatus;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  budgetMinutes: number;
};

export type EntryStatus = 'working' | 'completed' | 'approved' | 'exception';

export type TimeEntry = {
  id: string;
  employeeId: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  checkIn: number; // minutes since midnight
  checkOut: number | null;
  breakMinutes: number;
  /** Distance from the project at check-in, in metres. */
  distance: number;
  status: EntryStatus;
};

export type ExceptionType = 'gps-deviation' | 'missing-checkout';

export type TimeException = {
  id: string;
  type: ExceptionType;
  entryId: string;
  resolved: boolean;
  resolution?: string;
};

export type Settings = {
  companyName: string;
  gpsRadius: number; // metres
  breakAfterMinutes: number; // auto-deduct break when a day is longer than this
  breakMinutes: number;
  reportDay: number; // day of month the monthly report is generated
};
