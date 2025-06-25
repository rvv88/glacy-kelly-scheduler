
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { useAppointmentActions } from './AppointmentActions';
import AppointmentTabs from './AppointmentTabs';

const AdminAppointmentRequests: React.FC = () => {
  const { appointments, loading, updateAppointment } = useAppointments();
  const { processingId, handleApproveAppointment, handleRejectAppointment } = useAppointmentActions(
    appointments, 
    updateAppointment
  );

  // Filter appointments by status
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed');
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

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

      <AppointmentTabs
        pendingAppointments={pendingAppointments}
        confirmedAppointments={confirmedAppointments}
        cancelledAppointments={cancelledAppointments}
        processingId={processingId}
        onApprove={handleApproveAppointment}
        onReject={handleRejectAppointment}
      />
    </div>
  );
};

export default AdminAppointmentRequests;
