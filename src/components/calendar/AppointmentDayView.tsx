
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
  const { getAvailableTimeSlots } = useCalendarConfigurations();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (selectedClinicId && selectedDate) {
        setLoading(true);
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          const slots = await getAvailableTimeSlots(selectedClinicId, dateStr);
          setAvailableSlots(slots);
        } catch (error) {
          console.error('Erro ao carregar horários disponíveis:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAvailableSlots();
  }, [selectedClinicId, selectedDate, getAvailableTimeSlots]);

  // Gerar horários do dia (de 8h às 18h, de 30 em 30 minutos)
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.map((time) => {
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
      </CardContent>
    </Card>
  );
};

export default AppointmentDayView;
