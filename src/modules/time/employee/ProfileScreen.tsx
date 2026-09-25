import { useNavigate } from 'react-router-dom';
import {
  StudioEseneButton,
  StudioEseneContainer,
  StudioEseneDataList,
  StudioEsenePageHeader,
  StudioEseneSection,
  StudioEseneSelect,
  StudioEseneStack,
} from '@core/design-system';
import { fullName } from '../data/selectors';
import { useCurrentEmployee } from './useCurrentEmployee';

/** PROFILE — account basics only. No administrative settings. */
export function ProfileScreen() {
  const { employee } = useCurrentEmployee();
  const navigate = useNavigate();
  return (
    <StudioEseneContainer narrow>
      <StudioEsenePageHeader eyebrow={employee.title} title={fullName(employee)} />
      <StudioEseneStack gap={7}>
        <StudioEseneSection label="Account">
          <StudioEseneDataList
            items={[
              { label: 'Employee number', value: employee.employeeNumber },
              { label: 'Email', value: employee.email },
              { label: 'Phone', value: employee.phone },
            ]}
          />
        </StudioEseneSection>
        <StudioEseneSection label="Preferences">
          <StudioEseneSelect
            label="Language"
            defaultValue="en"
            options={[
              { value: 'nl', label: 'Nederlands' },
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'Français' },
              { value: 'uk', label: 'Українська' },
            ]}
          />
        </StudioEseneSection>
        <StudioEseneButton block onClick={() => navigate('/')}>
          Sign out
        </StudioEseneButton>
      </StudioEseneStack>
    </StudioEseneContainer>
  );
}
