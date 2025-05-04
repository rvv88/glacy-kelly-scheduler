
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export const mockAppointments: Appointment[] = [
  { 
    id: '1', 
    patientId: '1',
    patientName: 'João Silva', 
    serviceId: '1',
    serviceName: 'Limpeza',
    clinicId: '1',
    clinicName: 'Clínica da Barra',
    date: '2025-04-07', 
    time: '09:00', 
    duration: 60, 
    status: 'confirmed'
  },
  { 
    id: '2', 
    patientId: '2',
    patientName: 'Maria Oliveira', 
    serviceId: '3',
    serviceName: 'Canal',
    clinicId: '2',
    clinicName: 'Clínica Centro',
    date: '2025-04-07', 
    time: '11:00', 
    duration: 90,  
    status: 'confirmed'
  },
  { 
    id: '3', 
    patientId: '3',
    patientName: 'Pedro Santos', 
    serviceId: '2',
    serviceName: 'Avaliação',
    clinicId: '1',
    clinicName: 'Clínica da Barra',
    date: '2025-04-08', 
    time: '10:00', 
    duration: 30,
    status: 'pending'
  },
  { 
    id: '4', 
    patientId: '4',
    patientName: 'Ana Costa', 
    serviceId: '4',
    serviceName: 'Implante',
    clinicId: '2',
    clinicName: 'Clínica Centro',
    date: '2025-04-09', 
    time: '14:30', 
    duration: 120,
    status: 'confirmed'
  },
];
