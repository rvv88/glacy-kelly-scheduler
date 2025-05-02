
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mockup de dados para os tipos de atendimento
const mockServices = [
  { 
    id: '1', 
    name: 'Limpeza', 
    duration: 60,
    description: 'Limpeza dental completa com remoção de tártaro',
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Clareamento Dental', 
    duration: 90,
    description: 'Procedimento estético para clarear os dentes',
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Avaliação Invisalign', 
    duration: 45,
    description: 'Consulta para avaliação de tratamento com alinhadores transparentes',
    status: 'active'
  },
  { 
    id: '4', 
    name: 'Botox', 
    duration: 60,
    description: 'Aplicação de toxina botulínica para fins estéticos e terapêuticos',
    status: 'active'
  },
  { 
    id: '5', 
    name: 'Preenchimento', 
    duration: 60,
    description: 'Preenchimento facial com ácido hialurônico',
    status: 'active'
  },
  { 
    id: '6', 
    name: 'Manutenção Invisalign', 
    duration: 30,
    description: 'Consulta de acompanhamento do tratamento com Invisalign',
    status: 'active'
  },
];

const ServicesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtra os serviços com base na busca
  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tipos de Atendimento</CardTitle>
          <CardDescription>Gerenciamento de serviços e procedimentos</CardDescription>
        </div>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar serviços..."
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
                <TableHead>Nome</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="font-medium">{service.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{service.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                    <TableCell>
                      <Badge variant={service.status === 'active' ? 'default' : 'outline'}>
                        {service.status === 'active' ? 'Ativo' : 'Inativo'}
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
                            <Link to={`/services/edit/${service.id}`}>Editar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {service.status === 'active' ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Nenhum serviço encontrado.
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

export default ServicesList;
