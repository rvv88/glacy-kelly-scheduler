
import { useState } from 'react';
import { appointmentService } from '@/services/appointmentService';
import type { Appointment, CreateAppointmentData, UpdateAppointmentData } from '@/types/appointment';

export const useAppointmentOperations = (
  appointments: Appointment[],
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>,
  userRole: string
) => {
  const [loading, setLoading] = useState(false);

  const saveAppointment = async (appointmentData: CreateAppointmentData) => {
    try {
      setLoading(true);
      const newAppointment = await appointmentService.createAppointment(appointmentData, userRole);
      
      setAppointments(prev => [...prev, newAppointment].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      }));
      
      return newAppointment;
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, appointmentData: UpdateAppointmentData) => {
    try {
      setLoading(true);
      const updatedAppointment = await appointmentService.updateAppointment(id, appointmentData);

      setAppointments(prev => prev.map(appointment => 
        appointment.id === id ? updatedAppointment : appointment
      ));

      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      setLoading(true);
      await appointmentService.deleteAppointment(id);
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
