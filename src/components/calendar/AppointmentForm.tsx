
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
} from '@/components/ui/form';
import { useAppointmentFormLogic } from '@/hooks/useAppointmentFormLogic';
import AppointmentFormFields from './AppointmentFormFields';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: string;
  selectedClinicId?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  open,
  onClose,
  initialDate,
  initialTime,
  selectedClinicId,
}) => {
  const {
    form,
    services,
    clinics,
    patients,
    patientsLoading,
    userRole,
    availableTimeSlots,
    loadingTimeSlots,
    onSubmit,
  } = useAppointmentFormLogic({
    initialDate,
    initialTime,
    selectedClinicId,
    onClose,
  });

  if (patientsLoading) {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Consulta</DialogTitle>
            <DialogDescription>
              Carregando dados dos pacientes...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Consulta</DialogTitle>
          <DialogDescription>
            {userRole === 'user' 
              ? 'Solicite um novo agendamento. Sua solicitação precisará ser confirmada por um administrador.'
              : 'Agende uma nova consulta para um paciente.'
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AppointmentFormFields
              form={form}
              patients={patients}
              services={services}
              clinics={clinics}
              availableTimeSlots={availableTimeSlots}
              loadingTimeSlots={loadingTimeSlots}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loadingTimeSlots}>
                {userRole === 'user' ? 'Solicitar Agendamento' : 'Agendar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
