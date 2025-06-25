
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, User, Calendar, Building, Mail, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: any;
  showActions?: boolean;
  processingId?: string | null;
  onApprove?: (appointmentId: string) => void;
  onReject?: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  showActions = false,
  processingId,
  onApprove,
  onReject
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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

        {showActions && onApprove && onReject && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onApprove(appointment.id)}
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
              onClick={() => onReject(appointment.id)}
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
};

export default AppointmentCard;
