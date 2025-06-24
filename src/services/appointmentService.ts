
import { supabase } from '@/integrations/supabase/client';
import type { Appointment, CreateAppointmentData, UpdateAppointmentData } from '@/types/appointment';

export const appointmentService = {
  async loadAppointments(userRole: string, userId?: string): Promise<Appointment[]> {
    console.log('Loading appointments with role:', userRole);

    let query = supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    // Se for usuário comum, só carrega seus próprios agendamentos
    if (userRole === 'user' && userId) {
      // Primeiro buscar o patient_id do usuário
      const { data: profileData } = await supabase
        .from('patient_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        query = query.eq('patient_id', profileData.id);
      } else {
        // Se não tem perfil de paciente, não tem agendamentos
        return [];
      }
    }
    // Se for admin, carrega todos os agendamentos

    const { data, error } = await query;

    if (error) {
      console.error('Error loading appointments:', error);
      throw error;
    }

    console.log('Appointments loaded:', data);

    // Type cast the status field to ensure it matches our interface
    return (data || []).map(appointment => ({
      ...appointment,
      status: appointment.status as 'confirmed' | 'pending' | 'cancelled'
    }));
  },

  async checkAppointmentConflict(date: string, time: string, duration: number): Promise<boolean> {
    const { data: conflictCheck, error: conflictError } = await supabase
      .rpc('check_appointment_conflict', {
        appointment_date: date,
        appointment_time: time,
        appointment_duration: duration
      });

    if (conflictError) {
      console.error('Error checking conflict:', conflictError);
      throw new Error('Erro ao verificar conflitos de horário');
    }

    return conflictCheck;
  },

  async createAppointment(appointmentData: CreateAppointmentData, userRole: string): Promise<Appointment> {
    console.log('Saving appointment:', appointmentData);
    
    // Verificar conflitos de horário
    const hasConflict = await this.checkAppointmentConflict(
      appointmentData.date,
      appointmentData.time,
      appointmentData.duration
    );

    if (hasConflict) {
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
    return {
      ...data,
      status: data.status as 'confirmed' | 'pending' | 'cancelled'
    };
  },

  async updateAppointment(id: string, appointmentData: UpdateAppointmentData): Promise<Appointment> {
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
    return {
      ...data,
      status: data.status as 'confirmed' | 'pending' | 'cancelled'
    };
  },

  async deleteAppointment(id: string): Promise<void> {
    console.log('Deleting appointment:', id);

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};
