
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Check, X, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';

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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSlots = async () => {
      if (selectedClinicId && selectedDate) {
        setLoading(true);
        try {
          // Gerar horários padrão de 8:00 às 18:00 com intervalo de 30 minutos
          const slots: string[] = [];
          const startHour = 8;
          const endHour = 18;
          const intervalMinutes = 30;

          for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += intervalMinutes) {
              const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              slots.push(timeString);
            }
          }

          console.log('Generated available slots:', slots);
          setAvailableSlots(slots);
        } catch (error) {
          console.error('Erro ao carregar horários:', error);
          setAvailableSlots([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSlots();
  }, [selectedClinicId, selectedDate]);

  const getAppointmentForTime = (time: string): Appointment | undefined => {
    return appointments.find(apt => apt.time === time);
  };

  const isTimeAvailable = (time: string): boolean => {
    // Sempre considerar disponível se não há agendamento para este horário
    return !getAppointmentForTime(time);
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
          {availableSlots.map((time) => {
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

            return null;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentDayView;
