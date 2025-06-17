
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  service_id: string;
  service_name: string;
  clinic_id: string;
  clinic_name: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { userRole, isAdmin } = useUserRole();

  useEffect(() => {
    if (user && userRole) {
      loadAppointments();
    }
  }, [user, userRole]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log('Loading appointments with role:', userRole);

      let query = supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      // Se for usuário comum, só carrega seus próprios agendamentos
      if (userRole === 'user') {
        // Primeiro buscar o patient_id do usuário
        const { data: profileData } = await supabase
          .from('patient_profiles')
          .select('id')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (profileData) {
          query = query.eq('patient_id', profileData.id);
        } else {
          // Se não tem perfil de paciente, não tem agendamentos
          setAppointments([]);
          setLoading(false);
          return;
        }
      }
      // Se for admin, carrega todos os agendamentos

      const { data, error } = await query;

      if (error) {
        console.error('Error loading appointments:', error);
        return;
      }

      console.log('Appointments loaded:', data);

      // Type cast the status field to ensure it matches our interface
      const typedAppointments: Appointment[] = (data || []).map(appointment => ({
        ...appointment,
        status: appointment.status as 'confirmed' | 'pending' | 'cancelled'
      }));

      setAppointments(typedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Saving appointment:', appointmentData);
      
      // Verificar conflitos de horário
      const { data: conflictCheck, error: conflictError } = await supabase
        .rpc('check_appointment_conflict', {
          appointment_date: appointmentData.date,
          appointment_time: appointmentData.time,
          appointment_duration: appointmentData.duration
        });

      if (conflictError) {
        console.error('Error checking conflict:', conflictError);
        throw new Error('Erro ao verificar conflitos de horário');
      }

      if (conflictCheck) {
        throw new Error('Já existe um agendamento neste horário');
      }

      // Se for usuário comum, forçar status pending
      const finalData = {
        ...appointmentData,
        status: userRole === 'user' ? 'pending' : appointmentData.status
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(finalData)
        .select()
        .single();

      if (error) {
        console.error('Error saving appointment:', error);
        throw error;
      }

      console.log('Appointment saved:', data);

      // Type cast the returned data
      const typedAppointment: Appointment = {
        ...data,
        status: data.status as 'confirmed' | 'pending' | 'cancelled'
      };

      setAppointments(prev => [...prev, typedAppointment].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      }));
      
      return typedAppointment;
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      console.log('Updating appointment:', id, appointmentData);

      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }

      console.log('Appointment updated:', data);

      // Type cast the returned data
      const typedAppointment: Appointment = {
        ...data,
        status: data.status as 'confirmed' | 'pending' | 'cancelled'
      };

      setAppointments(prev => prev.map(appointment => 
        appointment.id === id ? typedAppointment : appointment
      ));

      return typedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      console.log('Deleting appointment:', id);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  return {
    appointments,
    loading,
    saveAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments: loadAppointments,
  };
};
