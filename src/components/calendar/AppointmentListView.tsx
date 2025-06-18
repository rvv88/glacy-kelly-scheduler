
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Building, Check, X, Loader2 } from 'lucide-react';
import { isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Appointment } from '@/hooks/useAppointments';

interface AppointmentListViewProps {
  selectedDate: Date | undefined;
  appointments: Appointment[];
  loading: boolean;
  isAdmin: boolean;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppointmentListView: React.FC<AppointmentListViewProps> = ({
  selectedDate,
  appointments,
  loading,
  isAdmin,
  onConfirmAppointment,
  onCancelAppointment,
  getStatusColor,
  getStatusText,
}) => {
  const dayAppointments = appointments.filter(app => 
    selectedDate && isSameDay(parseISO(app.date), selectedDate)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (dayAppointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Não há compromissos agendados para este dia.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dayAppointments.map(app => (
        <Card key={app.id} className={cn("hover:shadow transition-all border-2", getStatusColor(app.status))}>
          <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{app.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={app.status === 'confirmed' ? 'default' : app.status === 'pending' ? 'secondary' : 'destructive'}>
                {getStatusText(app.status)}
              </Badge>
              {isAdmin && app.status === 'pending' && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                    onClick={() => onConfirmAppointment(app.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    onClick={() => onCancelAppointment(app.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="font-medium">{app.patient_name}</div>
            <div className="text-sm text-muted-foreground">
              {app.service_name} - {app.duration} min
            </div>
            <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
              <Building className="h-3 w-3" />
              <span>{app.clinic_name}</span>
            </div>
            {app.notes && (
              <div className="text-xs text-muted-foreground mt-1">
                Obs: {app.notes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentListView;
