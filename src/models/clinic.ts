
export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
}

// Mock data for clinics
export const mockClinics = [
  {
    id: '1',
    name: 'Clínica da Barra',
    address: 'Av. Jornalista Ricardo Marinho, 360, sala 218, Barra da Tijuca, Rio de Janeiro-RJ',
    phone: '(21) 99987-9186'
  },
  {
    id: '2',
    name: 'Clínica Centro',
    address: 'Rua da Assembleia, 10, Centro, Rio de Janeiro-RJ',
    phone: '(21) 99987-9186'
  }
];
