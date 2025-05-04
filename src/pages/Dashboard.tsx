import React, { useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import AppointmentChart from '@/components/dashboard/AppointmentChart';
import RecentAppointments from '@/components/dashboard/RecentAppointments';
import { Calendar as CalendarIcon, Users, ClipboardCheck, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

// Mock data for completed appointments
const mockCompletedAppointments = [
  {
    id: '1',
    patientName: 'Carlos Rodrigues',
    service: 'Harmonização Facial',
    date: '2025-04-01',
    time: '14:00',
    status: 'completed',
  },
  {
    id: '2',
    patientName: 'Marina Silva',
    service: 'Limpeza',
    date: '2025-04-03',
    time: '09:30',
    status: 'completed',
  },
  {
    id: '3',
    patientName: 'André Santos',
    service: 'Clareamento',
    date: '2025-04-05',
    time: '11:00',
    status: 'completed',
  },
];

const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Abr');
  const [completedAppointments, setCompletedAppointments] = useState(mockCompletedAppointments);
  
  // Function to filter appointments by month
  const filterAppointmentsByMonth = (month: string) => {
    setSelectedMonth(month);
    // In a real app, this would fetch data from an API based on the selected month
    // For now, we'll just simulate the filter
    console.log(`Filtering appointments for month: ${month}`);
    // Update UI to show we're filtering by the selected month
    toast.info(`Exibindo consultas de ${month}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Consultas"
          value="324"
          description="Consultas nos últimos 30 dias"
          icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pacientes Ativos"
          value="165"
          description="Pacientes com consultas recentes"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Taxa de Retorno"
          value="86%"
          description="Pacientes que voltam para novas consultas"
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Faturamento"
          value="R$ 12.450"
          description="Receita do mês atual"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
        <AppointmentChart onMonthClick={filterAppointmentsByMonth} />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Consultas realizadas */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Realizadas</CardTitle>
            <CardDescription>Atendimentos concluídos em {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {completedAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {appointment.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(parseISO(appointment.date), "EEE, dd MMM", { locale: ptBR })} às {appointment.time}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">
                      Realizado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Próximas consultas */}
        <RecentAppointments />
      </div>
    </div>
  );
};

export default Dashboard;
