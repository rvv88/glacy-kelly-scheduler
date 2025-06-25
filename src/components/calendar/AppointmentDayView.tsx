
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format, addDays, isSameDay, parseISO, isPast, isToday, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AppointmentTimeSlot from './AppointmentTimeSlot';
import { Appointment } from '@/types/appointment';
import { useCalendarConfigurations } from '@/hooks/useCalendarConfigurations';

interface AppointmentDayViewProps {
  selectedDate: Date | undefined;
  selectedClinicId: string;
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
  selectedClinicId,
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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { getAvailableTimeSlots } = useCalendarConfigurations();

  // Filtrar os compromissos para o dia selecionado e clínica específica
  const dayAppointments = appointments.filter(app => 
    selectedDate && 
    isSameDay(parseISO(app.date), selectedDate) &&
    app.clinic_id === selectedClinicId
  );

  // Carregar horários disponíveis quando a data ou clínica mudar
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDate || !selectedClinicId) return;
      
      setLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const slots = await getAvailableTimeSlots(selectedClinicId, dateStr);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading available slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [selectedDate, selectedClinicId, getAvailableTimeSlots]);

  // Gerar horários para a visualização diária baseado na configuração
  const timeSlots = isAdmin 
    ? Array.from({ length: 20 }, (_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      })
    : availableSlots;

  // Verificar se um horário está disponível para agendamento
  const isTimeSlotAvailable = (time: string): boolean => {
    if (!selectedDate) return false;
    
    // Verificar se é uma data no passado
    if (isBefore(selectedDate, today) && !isToday(selectedDate)) return false;
    
    // Se é hoje, verificar se o horário já passou
    if (isToday(selectedDate)) {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      if (isBefore(slotTime, now)) return false;
    }
    
    // Para admin, mostrar todos os horários (mesmo passados) para visualização
    if (isAdmin) return true;
    
    // Para usuários, verificar se o horário está na lista de disponíveis
    return availableSlots.includes(time);
  };

  if (loading || loadingSlots) {
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
        {timeSlots.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isAdmin 
              ? "Nenhum horário configurado para este dia."
              : "Nenhum horário disponível para este dia."
            }
          </div>
        ) : (
          timeSlots.map((time) => {
            const appointment = dayAppointments.find(app => app.time === time);
            const isAvailable = isTimeSlotAvailable(time);
            
            return (
              <AppointmentTimeSlot
                key={time}
                time={time}
                appointment={appointment}
                isAdmin={isAdmin}
                isAvailable={isAvailable}
                onNewAppointment={onNewAppointment}
                onConfirmAppointment={onConfirmAppointment}
                onCancelAppointment={onCancelAppointment}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default AppointmentDayView;
