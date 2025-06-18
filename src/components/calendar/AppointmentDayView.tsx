
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AppointmentTimeSlot from './AppointmentTimeSlot';
import { Appointment } from '@/hooks/useAppointments';

interface AppointmentDayViewProps {
  selectedDate: Date | undefined;
  appointments: Appointment[];
  loading: boolean;
  isAdmin: boolean;
  onDateChange: (date: Date) => void;
  onNewAppointment: (time: string) => void;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppointmentDayView: React.FC<AppointmentDayViewProps> = ({
  selectedDate,
  appointments,
  loading,
  isAdmin,
  onDateChange,
  onNewAppointment,
  onConfirmAppointment,
  onCancelAppointment,
  getStatusColor,
  getStatusText,
}) => {
  const today = new Date();

  // Filtra os compromissos para o dia selecionado
  const dayAppointments = appointments.filter(app => 
    selectedDate && isSameDay(parseISO(app.date), selectedDate)
  );

  // Gera horários para a visualização diária
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando agenda...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(selectedDate || today, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(selectedDate || today, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {timeSlots.map((time) => {
          const appointment = dayAppointments.find(app => app.time === time);
          
          return (
            <AppointmentTimeSlot
              key={time}
              time={time}
              appointment={appointment}
              isAdmin={isAdmin}
              onNewAppointment={onNewAppointment}
              onConfirmAppointment={onConfirmAppointment}
              onCancelAppointment={onCancelAppointment}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentDayView;
