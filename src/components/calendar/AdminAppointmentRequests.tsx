
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, User, Calendar, Building, Mail, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '@/hooks/useAppointments';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminAppointmentRequests: React.FC = () => {
  const { appointments, loading, updateAppointment } = useAppointments();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filtrar apenas agendamentos pendentes
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed');
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

  const getUserIdFromPatientId = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('user_id, email')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error getting user data:', error);
        return null;
      }

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
      
      // Buscar dados do agendamento
      const appointment = appointments.find(app => app.id === appointmentId);
      if (!appointment) return;

      // Atualizar status do agendamento
      await updateAppointment(appointmentId, { status: 'confirmed' });

      // Buscar dados do usuário
      const userData = await getUserIdFromPatientId(appointment.patient_id);
      if (!userData) {
        toast.success('Agendamento confirmado!');
        return;
      }

      // Buscar endereço da clínica
      const clinicAddress = await getClinicAddress(appointment.clinic_id);

      // Criar notificação
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

      // Enviar email (simulado)
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
      toast.error('Erro ao confirmar agendamento');
      console.error('Error approving appointment:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      setProcessingId(appointmentId);
      
      // Buscar dados do agendamento
      const appointment = appointments.find(app => app.id === appointmentId);
      if (!appointment) return;

      // Atualizar status do agendamento
      await updateAppointment(appointmentId, { status: 'cancelled' });

      // Buscar dados do usuário
      const userData = await getUserIdFromPatientId(appointment.patient_id);
      if (!userData) {
        toast.success('Agendamento recusado!');
        return;
      }

      // Buscar endereço da clínica
      const clinicAddress = await getClinicAddress(appointment.clinic_id);

      // Criar notificação
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

      // Enviar email (simulado)
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
      toast.error('Erro ao recusar agendamento');
      console.error('Error rejecting appointment:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const AppointmentCard = ({ appointment, showActions = false }: { 
    appointment: any; 
    showActions?: boolean;
  }) => (
    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            {appointment.patient_name}
          </CardTitle>
          <Badge variant={
            appointment.status === 'confirmed' ? 'default' : 
            appointment.status === 'pending' ? 'secondary' : 
            'destructive'
          }>
            {appointment.status === 'confirmed' ? 'Confirmado' : 
             appointment.status === 'pending' ? 'Pendente' : 
             'Cancelado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(parseISO(appointment.date), "dd 'de' MMMM", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.time} ({appointment.duration} min)</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.clinic_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.service_name}</span>
          </div>
        </div>
        
        {appointment.notes && (
          <div className="text-sm text-muted-foreground">
            <strong>Observações:</strong> {appointment.notes}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleApproveAppointment(appointment.id)}
              disabled={processingId === appointment.id}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {processingId === appointment.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Confirmar
            </Button>
            <Button
              onClick={() => handleRejectAppointment(appointment.id)}
              disabled={processingId === appointment.id}
              variant="destructive"
              className="flex-1"
            >
              {processingId === appointment.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Recusar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando solicitações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analisar Agenda</h2>
        <p className="text-muted-foreground">
          Gerencie as solicitações de agendamento dos pacientes
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pendentes
            {pendingAppointments.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingAppointments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Check className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhum agendamento confirmado</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {confirmedAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <X className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhum agendamento cancelado</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {cancelledAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAppointmentRequests;
