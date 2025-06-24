
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AdminCalendarActions from './AdminCalendarActions';
import ClinicSelector from './ClinicSelector';
import CalendarSidebar from './CalendarSidebar';
import AppointmentCalendarContent from './AppointmentCalendarContent';
import AppointmentForm from './AppointmentForm';
import { useAppointments } from '@/hooks/useAppointments';
import { useUserRole } from '@/hooks/useUserRole';
import { useClinics } from '@/hooks/useClinics';

const AppointmentCalendar: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { appointments, loading, updateAppointment, deleteAppointment, refreshAppointments } = useAppointments();
  const { userRole, isAdmin } = useUserRole();
  const { clinics, loading: clinicsLoading } = useClinics();

  // Para admins, mostrar seletor de clínica
  // Para usuários, usar a clínica do perfil do paciente
  useEffect(() => {
    if (!isAdmin() && clinics.length > 0) {
      // Para usuários normais, tentar pegar a clínica do perfil do paciente
      // Por enquanto, usar a primeira clínica disponível
      setSelectedClinicId(clinics[0]?.id || '');
    }
  }, [clinics, isAdmin]);

  useEffect(() => {
    if (selectedClinicId) {
      refreshAppointments();
    }
  }, [selectedClinicId]);

  // Filtrar compromissos da clínica selecionada
  const filteredAppointments = appointments.filter(app => 
    !selectedClinicId || app.clinic_id === selectedClinicId
  );

  // Função para abrir o formulário de nova consulta
  const handleNewAppointment = (time?: string) => {
    setSelectedTime(time);
    setIsAppointmentFormOpen(true);
  };

  // Função para confirmar agendamento (apenas admin)
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: 'confirmed' });
      toast.success('Agendamento confirmado com sucesso!');
    } catch (error) {
      toast.error('Erro ao confirmar agendamento');
    }
  };

  // Função para cancelar agendamento
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      if (isAdmin()) {
        await deleteAppointment(appointmentId);
        toast.success('Agendamento removido com sucesso!');
      } else {
        await updateAppointment(appointmentId, { status: 'cancelled' });
        toast.success('Agendamento cancelado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao cancelar agendamento');
    }
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'pending':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente de Aprovação';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Botões administrativos */}
      {isAdmin() && <AdminCalendarActions />}

      {/* Seleção de Clínica para Admins */}
      {isAdmin() && (
        <ClinicSelector
          clinics={clinics}
          selectedClinicId={selectedClinicId}
          onClinicChange={setSelectedClinicId}
        />
      )}

      {selectedClinicId && (
        <div className="flex flex-col md:flex-row gap-6">
          <CalendarSidebar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            appointments={filteredAppointments}
          />

          <AppointmentCalendarContent
            selectedDate={selectedDate}
            selectedClinicId={selectedClinicId}
            appointments={filteredAppointments}
            loading={loading}
            isAdmin={isAdmin()}
            userRole={userRole}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDateChange={setSelectedDate}
            onNewAppointment={handleNewAppointment}
            onConfirmAppointment={handleConfirmAppointment}
            onCancelAppointment={handleCancelAppointment}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </div>
      )}
      
      <AppointmentForm 
        open={isAppointmentFormOpen}
        onClose={() => setIsAppointmentFormOpen(false)}
        initialDate={selectedDate}
        initialTime={selectedTime}
        selectedClinicId={selectedClinicId}
      />
    </div>
  );
};

export default AppointmentCalendar;
