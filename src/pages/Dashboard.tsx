
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import AppointmentChart from '@/components/dashboard/AppointmentChart';
import RecentAppointments from '@/components/dashboard/RecentAppointments';
import { Calendar as CalendarIcon, Users, ClipboardCheck, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
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
        <AppointmentChart />
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <RecentAppointments />
      </div>
    </div>
  );
};

export default Dashboard;
