
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User, MapPin, FileText, CheckCircle, XCircle, Edit } from 'lucide-react';
import { Appointment } from '@/types/appointment';
import { useUserRole } from '@/hooks/useUserRole';
import { appointmentService } from '@/services/appointmentService';
import { toast } from 'sonner';

interface AppointmentTimeSlotProps {
  time: string;
  appointment?: Appointment;
  isAdmin: boolean;
  isAvailable: boolean;
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
  isAvailable,
  onNewAppointment,
  onConfirmAppointment,
  onCancelAppointment,
  getStatusColor,
  getStatusText,
}) => {
  const { userRole } = useUserRole();
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    
    try {
      await appointmentService.updateAppointment(appointment.id, { status: newStatus as any });
      toast.success('Status do agendamento atualizado com sucesso!');
      setIsEditing(false);
      // Trigger a refresh of the appointments
      window.location.reload();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Erro ao atualizar status do agendamento');
    }
  };

  if (appointment) {
    return (
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {time}
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-1" />
                {appointment.patient_name}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {appointment.clinic_name}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-1" />
                {appointment.service_name}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <Select value={appointment.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusText(appointment.status)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
              {isAdmin && (
                <div className="flex space-x-1">
                  {appointment.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfirmAppointment(appointment.id)}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancelAppointment(appointment.id)}
                  >
                    <XCircle className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          {appointment.notes && (
            <div className="mt-2 text-sm text-muted-foreground">
              <strong>Observações:</strong> {appointment.notes}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-2 border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {time}
            </div>
            <span className="text-sm text-muted-foreground">
              {isAvailable ? 'Disponível' : 'Indisponível'}
            </span>
          </div>
          {isAvailable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNewAppointment(time)}
            >
              {userRole === 'user' ? 'Solicitar Agendamento' : 'Nova Consulta'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentTimeSlot;
