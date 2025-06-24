import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import AppointmentDayView from './AppointmentDayView';
import AppointmentListView from './AppointmentListView';
import { Appointment } from '@/types/appointment';

interface AppointmentCalendarContentProps {
  selectedDate: Date | undefined;
  selectedClinicId: string;
  appointments: Appointment[];
  loading: boolean;
  isAdmin: boolean;
  userRole: string;
  viewMode: 'day' | 'week' | 'month';
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
  onDateChange: (date: Date) => void;
  onNewAppointment: (time?: string) => void;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AppointmentCalendarContent: React.FC<AppointmentCalendarContentProps> = ({
  selectedDate,
  selectedClinicId,
  appointments,
  loading,
  isAdmin,
  userRole,
  viewMode,
  onViewModeChange,
  onDateChange,
  onNewAppointment,
  onConfirmAppointment,
  onCancelAppointment,
  getStatusColor,
  getStatusText,
}) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agenda</CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Gerenciamento completo de consultas e compromissos'
              : 'Seus agendamentos e horários disponíveis'
            }
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            defaultValue={viewMode}
            onValueChange={(value) => onViewModeChange(value as 'day' | 'week' | 'month')}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Diário</SelectItem>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => onNewAppointment()} className="gap-2">
            <Plus className="h-4 w-4" />
            {userRole === 'user' ? 'Solicitar Agendamento' : 'Nova Consulta'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <AppointmentDayView
              selectedDate={selectedDate}
              selectedClinicId={selectedClinicId}
              appointments={appointments}
              loading={loading}
              isAdmin={isAdmin}
              onDateChange={onDateChange}
              onNewAppointment={onNewAppointment}
              onConfirmAppointment={onConfirmAppointment}
              onCancelAppointment={onCancelAppointment}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          </TabsContent>
          <TabsContent value="list">
            <AppointmentListView
              selectedDate={selectedDate}
              appointments={appointments}
              loading={loading}
              isAdmin={isAdmin}
              onConfirmAppointment={onConfirmAppointment}
              onCancelAppointment={onCancelAppointment}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendarContent;
