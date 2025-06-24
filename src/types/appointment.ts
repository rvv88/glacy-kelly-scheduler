
export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  service_id: string;
  service_name: string;
  clinic_id: string;
  clinic_name: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';

export type CreateAppointmentData = Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAppointmentData = Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>;
