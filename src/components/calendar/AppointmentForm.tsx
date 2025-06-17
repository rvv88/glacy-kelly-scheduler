
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useServices } from '@/hooks/useServices';
import { useClinics } from '@/hooks/useClinics';
import { useAppointments } from '@/hooks/useAppointments';
import { usePatients } from '@/hooks/usePatients';
import { useUserRole } from '@/hooks/useUserRole';

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Selecione um paciente' }),
  serviceId: z.string().min(1, { message: 'Selecione um serviço' }),
  clinicId: z.string().min(1, { message: 'Selecione uma clínica' }),
  date: z.string().min(1, { message: 'Selecione uma data' }),
  time: z.string().min(1, { message: 'Selecione um horário' }),
  duration: z.number().min(15, { message: 'Duração mínima de 15 minutos' }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  open,
  onClose,
  initialDate,
  initialTime,
}) => {
  const { services } = useServices();
  const { clinics } = useClinics();
  const { saveAppointment } = useAppointments();
  const { patients, loading: patientsLoading } = usePatients();
  const { userRole } = useUserRole();
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      serviceId: '',
      clinicId: '',
      date: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
      time: initialTime || '',
      duration: 30,
      notes: '',
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // Get selected patient, service, and clinic
      const selectedPatient = patients.find(p => p.id === data.patientId);
      const selectedService = services.find(s => s.id === data.serviceId);
      const selectedClinic = clinics.find(c => c.id === data.clinicId);

      if (!selectedPatient || !selectedService || !selectedClinic) {
        toast.error('Erro: Dados selecionados inválidos');
        return;
      }

      // Create appointment data
      const appointmentData = {
        patient_id: data.patientId,
        patient_name: selectedPatient.name,
        service_id: data.serviceId,
        service_name: selectedService.name,
        clinic_id: data.clinicId,
        clinic_name: selectedClinic.name,
        date: data.date,
        time: data.time,
        duration: data.duration,
        status: userRole === 'admin' ? 'confirmed' as const : 'pending' as const,
        notes: data.notes || undefined,
      };

      console.log('Creating appointment with data:', appointmentData);

      await saveAppointment(appointmentData);
      
      if (userRole === 'user') {
        toast.success('Solicitação de agendamento enviada! Aguarde a confirmação do administrador.');
      } else {
        toast.success('Consulta agendada com sucesso!');
      }
      
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Erro ao agendar consulta');
    }
  };

  // Atualiza a duração quando o serviço é selecionado
  const watchServiceId = form.watch('serviceId');
  React.useEffect(() => {
    if (watchServiceId) {
      const selectedService = services.find(s => s.id === watchServiceId);
      if (selectedService) {
        form.setValue('duration', selectedService.duration);
      }
    }
  }, [watchServiceId, services, form]);

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
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services
                        .filter(service => service.active)
                        .map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clínica</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma clínica" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações adicionais sobre a consulta" 
                      className="h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
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
