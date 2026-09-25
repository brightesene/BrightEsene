import { CURRENT_EMPLOYEE_ID } from '../data/seed';
import { useTimeStore } from '../data/store';

export function useCurrentEmployee() {
  const store = useTimeStore();
  const employee = store.employees.find((e) => e.id === CURRENT_EMPLOYEE_ID)!;
  return { store, employee };
}
