
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useAppointmentLoader } from './useAppointmentLoader';
import { useAppointmentOperations } from './useAppointmentOperations';

export const useAppointments = () => {
  const { user } = useAuth();
  const { userRole } = useUserRole();
  
  const {
    appointments,
    setAppointments,
    loading: loadingAppointments,
    refreshAppointments
  } = useAppointmentLoader(user?.id, userRole);

  const {
    loading: operationLoading,
    saveAppointment,
    updateAppointment,
    deleteAppointment
  } = useAppointmentOperations(appointments, setAppointments, userRole);

  return {
    appointments,
    loading: loadingAppointments || operationLoading,
    saveAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments,
  };
};

// Export the Appointment type for backward compatibility
export type { Appointment } from '@/types/appointment';
