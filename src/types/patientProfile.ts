
export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  address: string;
  clinicId: string;
  clinicName?: string;
  notes?: string;
  userId: string;
}
