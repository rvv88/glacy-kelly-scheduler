
import { supabase } from '@/integrations/supabase/client';
import type { Appointment, CreateAppointmentData, UpdateAppointmentData } from '@/types/appointment';

export const appointmentService = {
  async loadAppointments(userRole: string, userId?: string): Promise<Appointment[]> {
    console.log('Loading appointments with role:', userRole);

    // Com as políticas RLS, não precisamos filtrar manualmente
    // O banco já vai retornar apenas os dados que o usuário pode ver
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

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

  async checkAppointmentConflict(date: string, time: string, duration: number, clinicId: string): Promise<boolean> {
    // Verificar conflitos apenas na mesma clínica
    const { data: conflictingAppointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('clinic_id', clinicId)
      .in('status', ['confirmed', 'pending']);

    if (error) {
      console.error('Error checking conflict:', error);
      throw new Error('Erro ao verificar conflitos de horário');
    }

    // Verificar se há sobreposição de horários na mesma clínica
    const startTime = new Date(`1970-01-01T${time}:00`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const hasConflict = conflictingAppointments.some(appointment => {
      const appointmentStart = new Date(`1970-01-01T${appointment.time}:00`);
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);
      
      return (
        (startTime >= appointmentStart && startTime < appointmentEnd) ||
        (endTime > appointmentStart && endTime <= appointmentEnd) ||
        (startTime <= appointmentStart && endTime >= appointmentEnd)
      );
    });

    return hasConflict;
  },

  async createAppointment(appointmentData: CreateAppointmentData, userRole: string): Promise<Appointment> {
    console.log('Saving appointment:', appointmentData);
    
    // Verificar se é um horário no passado
    const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
    const now = new Date();
    
    if (appointmentDateTime < now) {
      throw new Error('Não é possível agendar para datas/horários que já passaram');
    }
    
    // Verificar conflitos de horário apenas na mesma clínica
    const hasConflict = await this.checkAppointmentConflict(
      appointmentData.date,
      appointmentData.time,
      appointmentData.duration,
      appointmentData.clinic_id
    );

    if (hasConflict) {
      throw new Error('Já existe um agendamento neste horário para esta clínica');
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

    // Se está alterando data/hora, verificar se não é no passado
    if (appointmentData.date && appointmentData.time) {
      const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
      const now = new Date();
      
      if (appointmentDateTime < now) {
        throw new Error('Não é possível agendar para datas/horários que já passaram');
      }
    }

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
