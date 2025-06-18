import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, 
  Settings,
  FileText,
  Plus
} from 'lucide-react';
import { parseISO, isSameDay } from 'date-fns';
import AppointmentForm from './AppointmentForm';
import AppointmentDayView from './AppointmentDayView';
import AppointmentListView from './AppointmentListView';
import { useAppointments } from '@/hooks/useAppointments';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AppointmentCalendar: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { appointments, loading, updateAppointment, deleteAppointment } = useAppointments();
  const { userRole, isAdmin } = useUserRole();
  const navigate = useNavigate();

  // Função para abrir o formulário de nova consulta
  const handleNewAppointment = (time?: string) => {
    setSelectedTime(time);
    setIsAppointmentFormOpen(true);
  };

  // Função para confirmar agendamento (apenas admin)
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: 'confirmed' });
      toast.success('Agendamento confirmado com sucesso!');
    } catch (error) {
      toast.error('Erro ao confirmar agendamento');
    }
  };

  // Função para cancelar agendamento
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      if (isAdmin()) {
        await deleteAppointment(appointmentId);
        toast.success('Agendamento removido com sucesso!');
      } else {
        await updateAppointment(appointmentId, { status: 'cancelled' });
        toast.success('Agendamento cancelado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao cancelar agendamento');
    }
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'pending':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente de Aprovação';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Botões administrativos */}
      {isAdmin() && (
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/calendar-config')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar Agenda
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/appointment-requests')}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Analisar Agenda
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-80 flex-shrink-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendário</span>
            </CardTitle>
            <CardDescription>Selecione uma data</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasAppointment: (date) => 
                  appointments.some(app => isSameDay(parseISO(app.date), date))
              }}
              modifiersStyles={{
                hasAppointment: { 
                  backgroundColor: 'rgb(59 130 246 / 0.1)', 
                  color: 'rgb(59 130 246)',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agenda</CardTitle>
              <CardDescription>
                {isAdmin() 
                  ? 'Gerenciamento completo de consultas e compromissos'
                  : 'Seus agendamentos e horários disponíveis'
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                defaultValue={viewMode}
                onValueChange={(value) => setViewMode(value as 'day' | 'week' | 'month')}
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
              <Button onClick={() => handleNewAppointment()} className="gap-2">
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
                  appointments={appointments}
                  loading={loading}
                  isAdmin={isAdmin()}
                  onDateChange={setSelectedDate}
                  onNewAppointment={handleNewAppointment}
                  onConfirmAppointment={handleConfirmAppointment}
                  onCancelAppointment={handleCancelAppointment}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              </TabsContent>
              <TabsContent value="list">
                <AppointmentListView
                  selectedDate={selectedDate}
                  appointments={appointments}
                  loading={loading}
                  isAdmin={isAdmin()}
                  onConfirmAppointment={handleConfirmAppointment}
                  onCancelAppointment={handleCancelAppointment}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <AppointmentForm 
        open={isAppointmentFormOpen}
        onClose={() => setIsAppointmentFormOpen(false)}
        initialDate={selectedDate}
        initialTime={selectedTime}
      />
    </div>
  );
};

export default AppointmentCalendar;
