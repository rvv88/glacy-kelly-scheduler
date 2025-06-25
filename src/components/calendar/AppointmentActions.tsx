
import { useState } from 'react';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAppointmentActions = (appointments: any[], updateAppointment: any) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getUserIdFromPatientId = async (patientId: string) => {
    try {
      console.log('Getting user data for patient:', patientId);
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('user_id, email')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error getting user data:', error);
        return null;
      }

      console.log('User data found:', data);
      return data;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const getClinicAddress = async (clinicId: string) => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('street, number, complement, neighborhood, city, state')
        .eq('id', clinicId)
        .single();

      if (error) {
        console.error('Error getting clinic address:', error);
        return '';
      }

      return `${data.street}, ${data.number}${data.complement ? `, ${data.complement}` : ''}, ${data.neighborhood}, ${data.city} - ${data.state}`;
    } catch (error) {
      console.error('Error getting clinic address:', error);
      return '';
    }
  };

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      setProcessingId(appointmentId);
      console.log('Approving appointment:', appointmentId);
      
      const appointment = appointments.find(app => app.id === appointmentId);
      if (!appointment) {
        console.error('Appointment not found:', appointmentId);
        return;
      }

      console.log('Appointment found:', appointment);

      await updateAppointment(appointmentId, { status: 'confirmed' });
      console.log('Appointment status updated to confirmed');

      const userData = await getUserIdFromPatientId(appointment.patient_id);
      if (!userData) {
        console.log('User data not found, showing success message without notification');
        toast.success('Agendamento confirmado!');
        return;
      }

      const clinicAddress = await getClinicAddress(appointment.clinic_id);

      console.log('Creating notification...');
      await notificationService.createNotification({
        userId: userData.user_id,
        appointmentId: appointmentId,
        type: 'confirmed',
        appointmentDetails: {
          date: appointment.date,
          time: appointment.time,
          clinicName: appointment.clinic_name,
          serviceName: appointment.service_name
        }
      });
      console.log('Notification created successfully');

      await notificationService.sendEmailNotification({
        userId: userData.user_id,
        appointmentId: appointmentId,
        type: 'confirmed',
        userEmail: userData.email,
        clinicAddress: clinicAddress,
        appointmentDetails: {
          date: appointment.date,
          time: appointment.time,
          clinicName: appointment.clinic_name,
          serviceName: appointment.service_name
        }
      });
      
      toast.success('Agendamento confirmado! Notificação enviada ao paciente.');
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Erro ao confirmar agendamento');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      setProcessingId(appointmentId);
      console.log('Rejecting appointment:', appointmentId);
      
      const appointment = appointments.find(app => app.id === appointmentId);
      if (!appointment) {
        console.error('Appointment not found:', appointmentId);
        return;
      }

      console.log('Appointment found:', appointment);

      await updateAppointment(appointmentId, { status: 'cancelled' });
      console.log('Appointment status updated to cancelled');

      const userData = await getUserIdFromPatientId(appointment.patient_id);
      if (!userData) {
        console.log('User data not found, showing success message without notification');
        toast.success('Agendamento recusado!');
        return;
      }

      const clinicAddress = await getClinicAddress(appointment.clinic_id);

      console.log('Creating notification...');
      await notificationService.createNotification({
        userId: userData.user_id,
        appointmentId: appointmentId,
        type: 'cancelled',
        appointmentDetails: {
          date: appointment.date,
          time: appointment.time,
          clinicName: appointment.clinic_name,
          serviceName: appointment.service_name
        }
      });
      console.log('Notification created successfully');

      await notificationService.sendEmailNotification({
        userId: userData.user_id,
        appointmentId: appointmentId,
        type: 'cancelled',
        userEmail: userData.email,
        clinicAddress: clinicAddress,
        appointmentDetails: {
          date: appointment.date,
          time: appointment.time,
          clinicName: appointment.clinic_name,
          serviceName: appointment.service_name
        }
      });
      
      toast.success('Agendamento recusado! Notificação enviada ao paciente.');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Erro ao recusar agendamento');
    } finally {
      setProcessingId(null);
    }
  };

  return {
    processingId,
    handleApproveAppointment,
    handleRejectAppointment
  };
};
