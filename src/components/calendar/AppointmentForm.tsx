
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
import { mockPatients } from '@/components/patients/PatientsList';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

const treatments = [
  { id: '1', name: 'Limpeza', duration: 60 },
  { id: '2', name: 'Clareamento Dental', duration: 90 },
  { id: '3', name: 'Avaliação Invisalign', duration: 30 },
  { id: '4', name: 'Botox', duration: 60 },
  { id: '5', name: 'Preenchimento', duration: 60 },
  { id: '6', name: 'Manutenção Invisalign', duration: 30 },
  { id: '7', name: 'Bioestimulador de colágeno', duration: 90 },
  { id: '8', name: 'Ultrassom microfocado', duration: 60 },
  { id: '9', name: 'Skinbooster', duration: 60 },
  { id: '10', name: 'Bioregeneração dérmica', duration: 90 },
  { id: '11', name: 'Radiofrequência', duration: 60 },
  { id: '12', name: 'Jato de plasma', duration: 60 },
  { id: '13', name: 'Lipoenzimática de papada', duration: 90 },
];

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Selecione um paciente' }),
  serviceId: z.string().min(1, { message: 'Selecione um serviço' }),
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
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      serviceId: '',
      date: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
      time: initialTime || '',
      duration: 30,
      notes: '',
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // Simulando envio dos dados para uma API
      console.log('Form data:', data);
      toast.success('Consulta agendada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao agendar consulta');
      console.error('Error submitting form:', error);
    }
  };

  // Atualiza a duração quando o serviço é selecionado
  const watchServiceId = form.watch('serviceId');
  React.useEffect(() => {
    if (watchServiceId) {
      const selectedService = treatments.find(t => t.id === watchServiceId);
      if (selectedService) {
        form.setValue('duration', selectedService.duration);
      }
    }
  }, [watchServiceId, form]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Consulta</DialogTitle>
          <DialogDescription>
            Agende uma nova consulta para um paciente.
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
                      {mockPatients
                        .filter(p => p.status === 'active')
                        .map((patient) => (
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
                      {treatments.map((service) => (
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
              <Button type="submit">Agendar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
