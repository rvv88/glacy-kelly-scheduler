
export interface Clinic {
  id: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

// Helper function to get the full address as a string
export const getFullAddress = (clinic: Clinic): string => {
  return `${clinic.street}, ${clinic.number}${clinic.complement ? `, ${clinic.complement}` : ''}, ${clinic.neighborhood}, ${clinic.city}-${clinic.state}`;
};

// Mock data for clinics
export const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Clínica da Barra',
    street: 'Av. Jornalista Ricardo Marinho',
    number: '360',
    complement: 'sala 218',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22631-350',
    phone: '(21) 99987-9186'
  },
  {
    id: '2',
    name: 'Clínica Centro',
    street: 'Rua da Assembleia',
    number: '10',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20011-000',
    phone: '(21) 99987-9186'
  }
];
