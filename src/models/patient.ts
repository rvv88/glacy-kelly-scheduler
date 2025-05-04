
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  lastVisit: string;
  status: 'active' | 'inactive';
  clinicId: string;
}

// Mockup data for patients
export const mockPatients: Patient[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    lastVisit: '2025-03-20',
    status: 'active',
    clinicId: '1'
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    email: 'maria.oliveira@email.com',
    phone: '(11) 91234-5678',
    cpf: '987.654.321-00',
    lastVisit: '2025-03-15',
    status: 'active',
    clinicId: '2'
  },
  { 
    id: '3', 
    name: 'Pedro Santos', 
    email: 'pedro.santos@email.com',
    phone: '(11) 92345-6789',
    cpf: '456.789.123-00',
    lastVisit: '2025-02-10',
    status: 'inactive',
    clinicId: '1'
  },
  { 
    id: '4', 
    name: 'Ana Costa', 
    email: 'ana.costa@email.com',
    phone: '(11) 93456-7890',
    cpf: '789.123.456-00',
    lastVisit: '2025-04-02',
    status: 'active',
    clinicId: '2'
  },
  { 
    id: '5', 
    name: 'Carlos Ferreira', 
    email: 'carlos.ferreira@email.com',
    phone: '(11) 94567-8901',
    cpf: '321.654.987-00',
    lastVisit: '2025-01-25',
    status: 'inactive',
    clinicId: '1'
  },
];
