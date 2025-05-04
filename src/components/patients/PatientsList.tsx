
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mockup de dados para os pacientes
const mockPatients = [
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

const PatientsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtra os pacientes com base na busca
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.cpf.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Pacientes</CardTitle>
          <CardDescription>Gerenciamento de cadastros</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{patient.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.cpf}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'active' ? 'default' : 'outline'}>
                        {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/patients/${patient.id}`}>Ver detalhes</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/patients/edit/${patient.id}`}>Editar cadastro</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Histórico de consultas</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Excluir cadastro
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsList;
