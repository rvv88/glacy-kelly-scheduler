
import { useState, useEffect } from 'react';
import { appointmentService } from '@/services/appointmentService';
import type { Appointment } from '@/types/appointment';

export const useAppointmentLoader = (userId?: string, userRole?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    if (!userId || !userRole) return;
    
    try {
      setLoading(true);
      const data = await appointmentService.loadAppointments(userRole, userId);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && userRole) {
      loadAppointments();
    }
  }, [userId, userRole]);

  return {
    appointments,
    setAppointments,
    loading,
    refreshAppointments: loadAppointments,
  };
};
