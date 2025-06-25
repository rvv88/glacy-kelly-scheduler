
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useServices } from '@/hooks/useServices';
import { useClinics } from '@/hooks/useClinics';
import { useAppointments } from '@/hooks/useAppointments';
import { usePatients } from '@/hooks/usePatients';
import { useUserRole } from '@/hooks/useUserRole';
import { useCalendarConfigurations } from '@/hooks/useCalendarConfigurations';

const formSchema = z.object({
  patientId: z.string().min(1, { message: 'Selecione um paciente' }),
  serviceId: z.string().min(1, { message: 'Selecione um serviço' }),
  clinicId: z.string().min(1, { message: 'Selecione uma clínica' }),
  date: z.string().min(1, { message: 'Selecione uma data' }),
  time: z.string().min(1, { message: 'Selecione um horário' }),
  duration: z.number().min(15, { message: 'Duração mínima de 15 minutos' }),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof formSchema>;

interface UseAppointmentFormLogicProps {
  initialDate?: Date;
  initialTime?: string;
  selectedClinicId?: string;
  onClose: () => void;
}

export const useAppointmentFormLogic = ({
  initialDate,
  initialTime,
  selectedClinicId,
  onClose,
}: UseAppointmentFormLogicProps) => {
  const { services } = useServices();
  const { clinics } = useClinics();
  const { saveAppointment } = useAppointments();
  const { patients, loading: patientsLoading } = usePatients();
  const { userRole } = useUserRole();
  const { getAvailableTimeSlots } = useCalendarConfigurations();
  
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = React.useState(false);
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      serviceId: '',
      clinicId: selectedClinicId || '',
      date: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
      time: initialTime || '',
      duration: 30,
      notes: '',
    },
  });

  // Watch for changes in clinic and date to load available time slots
  const watchClinicId = form.watch('clinicId');
  const watchDate = form.watch('date');

  // Memoize the load function to prevent recreations
  const loadTimeSlots = useCallback(async (clinicId: string, date: string) => {
    if (!clinicId || !date) {
      setAvailableTimeSlots([]);
      return;
    }

    console.log('Loading time slots for:', { clinicId, date });
    setLoadingTimeSlots(true);
    
    try {
      const slots = await getAvailableTimeSlots(clinicId, date);
      setAvailableTimeSlots(slots);
      console.log('Time slots loaded:', slots);
    } catch (error) {
      console.error('Error loading available time slots:', error);
      toast.error('Erro ao carregar horários disponíveis');
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  }, [getAvailableTimeSlots]);

  // Use effect with proper dependency array to prevent infinite loops
  React.useEffect(() => {
    loadTimeSlots(watchClinicId, watchDate);
  }, [watchClinicId, watchDate, loadTimeSlots]);

  const onSubmit = useCallback(async (data: AppointmentFormValues) => {
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
  }, [patients, services, clinics, userRole, saveAppointment, onClose, form]);

  // Memoize service selection effect
  const watchServiceId = form.watch('serviceId');
  React.useEffect(() => {
    if (watchServiceId) {
      const selectedService = services.find(s => s.id === watchServiceId);
      if (selectedService) {
        form.setValue('duration', selectedService.duration);
      }
    }
  }, [watchServiceId, services, form]);

  // Memoize clinic selection effect
  React.useEffect(() => {
    if (selectedClinicId && selectedClinicId !== form.getValues('clinicId')) {
      form.setValue('clinicId', selectedClinicId);
    }
  }, [selectedClinicId, form]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(() => ({
    form,
    services,
    clinics,
    patients,
    patientsLoading,
    userRole,
    availableTimeSlots,
    loadingTimeSlots,
    onSubmit,
  }), [
    form,
    services,
    clinics,
    patients,
    patientsLoading,
    userRole,
    availableTimeSlots,
    loadingTimeSlots,
    onSubmit
  ]);
};
