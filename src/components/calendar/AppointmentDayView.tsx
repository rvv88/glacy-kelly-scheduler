
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Check, X, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';
import { useCalendarConfigurations } from '@/hooks/useCalendarConfigurations';

interface AppointmentDayViewProps {
  selectedDate: Date;
  selectedClinicId: string;
  appointments: Appointment[];
  isAdmin: boolean;
  onNewAppointment: (time?: string) => void;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppointmentDayView: React.FC<AppointmentDayViewProps> = ({
  selectedDate,
  selectedClinicId,
  appointments,
  isAdmin,
  onNewAppointment,
  onConfirmAppointment,
  onCancelAppointment,
  getStatusColor,
  getStatusText,
}) => {
  const { getAvailableTimeSlots, configurations, loadConfigurations } = useCalendarConfigurations();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [allTimeSlots, setAllTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlotsAndConfig = async () => {
      if (selectedClinicId && selectedDate) {
        setLoading(true);
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          
          // Carregar configurações da clínica
          await loadConfigurations(selectedClinicId);
          
          // Carregar horários disponíveis
          const slots = await getAvailableTimeSlots(selectedClinicId, dateStr);
          console.log('Available slots loaded:', slots);
          setAvailableSlots(slots);
          
          // Gerar todos os horários possíveis baseado na configuração
          const config = configurations.find(c => c.clinic_id === selectedClinicId && c.date === dateStr);
          if (config && config.is_open) {
            const allSlots = generateAllTimeSlots(config.start_time, config.end_time, config.interval_minutes);
            setAllTimeSlots(allSlots);
          } else {
            // Usar horários padrão se não houver configuração
            const defaultSlots = generateAllTimeSlots('08:00', '18:00', 30);
            setAllTimeSlots(defaultSlots);
          }
        } catch (error) {
          console.error('Erro ao carregar horários:', error);
          setAvailableSlots([]);
          setAllTimeSlots([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSlotsAndConfig();
  }, [selectedClinicId, selectedDate, getAvailableTimeSlots, configurations, loadConfigurations]);

  const generateAllTimeSlots = (startTime: string, endTime: string, intervalMinutes: number): string[] => {
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let current = new Date(start);
    while (current < end) {
      const timeString = format(current, 'HH:mm');
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + intervalMinutes);
    }
    
    return slots;
  };

  const getAppointmentForTime = (time: string): Appointment | undefined => {
    return appointments.find(apt => apt.time === time);
  };

  const isTimeAvailable = (time: string): boolean => {
    return availableSlots.includes(time) && !getAppointmentForTime(time);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horários do Dia
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allTimeSlots.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Nenhum horário configurado para esta data.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Configure a agenda para esta clínica e data primeiro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTimeSlots.map((time) => {
              const appointment = getAppointmentForTime(time);
              const isAvailable = isTimeAvailable(time);
              
              if (appointment) {
                return (
                  <div
                    key={time}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(appointment.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{time}</span>
                      <Badge variant="secondary">
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{appointment.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{appointment.service_name}</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-muted-foreground text-xs mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2 mt-3">
                        {appointment.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onConfirmAppointment(appointment.id)}
                            className="flex-1"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Confirmar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelAppointment(appointment.id)}
                          className="flex-1"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                );
              }

              if (isAvailable) {
                return (
                  <div
                    key={time}
                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => onNewAppointment(time)}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{time}</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Disponível
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={time}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-50"
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <span className="text-sm font-medium text-muted-foreground">{time}</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Indisponível
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentDayView;
