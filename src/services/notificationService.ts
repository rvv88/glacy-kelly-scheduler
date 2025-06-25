
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CreateNotificationData {
  userId: string;
  appointmentId: string;
  type: 'confirmed' | 'cancelled';
  appointmentDetails: {
    date: string;
    time: string;
    clinicName: string;
    serviceName: string;
  };
}

export const notificationService = {
  async createNotification(data: CreateNotificationData) {
    const formattedDate = format(new Date(data.appointmentDetails.date), "dd 'de' MMMM", { 
      locale: ptBR 
    });
    
    const action = data.type === 'confirmed' ? 'confirmado' : 'recusado';
    const message = `Agendamento para o dia ${formattedDate}, horário ${data.appointmentDetails.time}h foi ${action}`;

    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.userId,
          appointment_id: data.appointmentId,
          type: data.type,
          message: message
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async sendEmailNotification(data: CreateNotificationData & { userEmail: string; clinicAddress: string }) {
    // Para desenvolvimento, apenas logar os dados do email
    // Em produção, você integraria com um serviço de email como SendGrid, AWS SES, etc.
    const emailData = {
      to: data.userEmail,
      subject: `Agendamento ${data.type === 'confirmed' ? 'Confirmado' : 'Recusado'} - Dra. Glacy Kelly Bisaggio`,
      body: this.generateEmailTemplate(data)
    };

    console.log('Email notification data:', emailData);
    
    // Aqui você implementaria o envio real do email
    // Exemplo: await emailProvider.send(emailData);
    
    return true;
  },

  generateEmailTemplate(data: CreateNotificationData & { userEmail: string; clinicAddress: string }) {
    const action = data.type === 'confirmed' ? 'confirmado' : 'recusado';
    const formattedDate = format(new Date(data.appointmentDetails.date), "dd 'de' MMMM 'de' yyyy", { 
      locale: ptBR 
    });

    return `
      <h2>Seu agendamento para a ${data.appointmentDetails.clinicName} foi ${action}!</h2>
      
      <h3>Detalhes do Agendamento:</h3>
      <p><strong>Serviço:</strong> ${data.appointmentDetails.serviceName}</p>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Horário:</strong> ${data.appointmentDetails.time}h</p>
      <p><strong>Clínica:</strong> ${data.appointmentDetails.clinicName}</p>
      <p><strong>Endereço:</strong> ${data.clinicAddress}</p>
      
      ${data.type === 'confirmed' 
        ? '<p>Por favor, chegue com 15 minutos de antecedência.</p>'
        : '<p>Você pode fazer um novo agendamento através do nosso sistema.</p>'
      }
      
      <p>Atenciosamente,<br>Dra. Glacy Kelly Bisaggio</p>
    `;
  }
};
