
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  clinicId: string;
  clinicName: string;
  avatarUrl?: string;
}

// Mock user data for development
export const mockCurrentUser: User = {
  id: '1',
  name: 'Dra. Glacy Kelly Bisaggio',
  email: 'glacy.bisaggio@email.com',
  cpf: '123.456.789-00',
  phone: '(21) 98765-4321',
  birthDate: '1985-06-15',
  clinicId: '1',
  clinicName: 'Clínica da Barra',
  avatarUrl: '',
};
