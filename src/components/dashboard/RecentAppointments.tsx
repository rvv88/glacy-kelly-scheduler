
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Building, CalendarIcon } from 'lucide-react';

// Mockup de dados para as consultas recentes
const mockRecentAppointments = [
  {
    id: '1',
    patientName: 'João Silva',
    service: 'Limpeza',
    date: '2025-04-08',
    time: '09:00',
    status: 'scheduled',
    clinicId: '1',
    clinicName: 'Clínica da Barra'
  },
  {
    id: '2',
    patientName: 'Maria Oliveira',
    service: 'Canal',
    date: '2025-04-08',
    time: '11:00',
    status: 'confirmed',
    clinicId: '2',
    clinicName: 'Clínica Centro'
  },
  {
    id: '3',
    patientName: 'Pedro Santos',
    service: 'Avaliação',
    date: '2025-04-09',
    time: '10:00',
    status: 'scheduled',
    clinicId: '1',
    clinicName: 'Clínica da Barra'
  },
  {
    id: '4',
    patientName: 'Ana Costa',
    service: 'Implante',
    date: '2025-04-09',
    time: '14:30',
    status: 'confirmed',
    clinicId: '2',
    clinicName: 'Clínica Centro'
  },
  {
    id: '5',
    patientName: 'Carlos Ferreira',
    service: 'Clareamento',
    date: '2025-04-10',
    time: '16:00',
    status: 'scheduled',
    clinicId: '1',
    clinicName: 'Clínica da Barra'
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="default">Confirmado</Badge>;
    case 'scheduled':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">Agendado</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">Realizado</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-300">Cancelado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const RecentAppointments: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Consultas</CardTitle>
        <CardDescription>Consultas agendadas para os próximos dias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {mockRecentAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {appointment.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{appointment.patientName}</p>
                <p className="text-sm text-muted-foreground">{appointment.service}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Building className="h-3 w-3 mr-1" />
                  {appointment.clinicName}
                </div>
              </div>
              <div className="ml-auto flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(parseISO(appointment.date), "EEE, dd MMM", { locale: ptBR })} às {appointment.time}
                  </span>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
