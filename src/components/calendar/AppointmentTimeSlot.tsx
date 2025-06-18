
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Building, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/hooks/useAppointments';

interface AppointmentTimeSlotProps {
  time: string;
  appointment?: Appointment;
  isAdmin: boolean;
  onNewAppointment: (time: string) => void;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppointmentTimeSlot: React.FC<AppointmentTimeSlotProps> = ({
  time,
  appointment,
  isAdmin,
  onNewAppointment,
  onConfirmAppointment,
  onCancelAppointment,
  getStatusColor,
  getStatusText,
}) => {
  return (
    <Card className={cn(
      "border hover:shadow transition-all",
      appointment ? `${getStatusColor(appointment.status)} border-2` : "border-dashed"
    )}>
      <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{time}</span>
        </div>
        {appointment && (
          <div className="flex items-center gap-2">
            <Badge variant={appointment.status === 'confirmed' ? 'default' : appointment.status === 'pending' ? 'secondary' : 'destructive'}>
              {getStatusText(appointment.status)}
            </Badge>
            {isAdmin && appointment.status === 'pending' && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                  onClick={() => onConfirmAppointment(appointment.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={() => onCancelAppointment(appointment.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!isAdmin && appointment.status !== 'cancelled' && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                onClick={() => onCancelAppointment(appointment.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      {appointment ? (
        <CardContent className="py-2 px-4">
          <div className="font-medium">{appointment.patient_name}</div>
          <div className="text-sm text-muted-foreground">
            {appointment.service_name} - {appointment.duration} min
          </div>
          <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
            <Building className="h-3 w-3" />
            <span>{appointment.clinic_name}</span>
          </div>
          {appointment.notes && (
            <div className="text-xs text-muted-foreground mt-1">
              Obs: {appointment.notes}
            </div>
          )}
        </CardContent>
      ) : (
        <CardContent className="py-4 px-4 flex justify-center items-center">
          <Button 
            variant="ghost" 
            className="text-sm" 
            onClick={() => onNewAppointment(time)}
          >
            + Agendar horário
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default AppointmentTimeSlot;
