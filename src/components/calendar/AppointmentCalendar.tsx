
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
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Building, 
  Loader2, 
  Check, 
  X,
  Settings,
  FileText,
  Plus
} from 'lucide-react';
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import AppointmentForm from './AppointmentForm';
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

  // Filtra os compromissos para o dia selecionado
  const dayAppointments = appointments.filter(app => 
    selectedDate && isSameDay(parseISO(app.date), selectedDate)
  );

  // Gera horários para a visualização diária
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

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
      if (isAdmin) {
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

  // Função para renderizar os compromissos do dia
  const renderDayView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando agenda...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate || today, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate || today, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {timeSlots.map((time) => {
            const appointment = dayAppointments.find(app => app.time === time);
            
            return (
              <Card key={time} className={cn(
                "border hover:shadow transition-all",
                appointment ? `${getStatusColor(appointment.status)} border-2` : "border-dashed"
              )}>
                <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{time}</span>
                  </div>
                  {appointment && (
                    <div className="flex items-center gap-2">
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : appointment.status === 'pending' ? 'secondary' : 'destructive'}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      {isAdmin && appointment.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {!isAdmin && appointment.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                {appointment ? (
                  <CardContent className="py-2 px-4">
                    <div className="font-medium">{appointment.patient_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.service_name} - {appointment.duration} min
                    </div>
                    <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
                      <Building className="h-3 w-3" />
                      <span>{appointment.clinic_name}</span>
                    </div>
                    {appointment.notes && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Obs: {appointment.notes}
                      </div>
                    )}
                  </CardContent>
                ) : (
                  <CardContent className="py-4 px-4 flex justify-center items-center">
                    <Button 
                      variant="ghost" 
                      className="text-sm" 
                      onClick={() => handleNewAppointment(time)}
                    >
                      + Agendar horário
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Botões administrativos */}
      {isAdmin && (
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
                {isAdmin 
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
                {renderDayView()}
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Carregando...</span>
                    </div>
                  ) : dayAppointments.length > 0 ? (
                    dayAppointments.map(app => (
                      <Card key={app.id} className={cn("hover:shadow transition-all border-2", getStatusColor(app.status))}>
                        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{app.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={app.status === 'confirmed' ? 'default' : app.status === 'pending' ? 'secondary' : 'destructive'}>
                              {getStatusText(app.status)}
                            </Badge>
                            {isAdmin && app.status === 'pending' && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                  onClick={() => handleConfirmAppointment(app.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleCancelAppointment(app.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="font-medium">{app.patient_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.service_name} - {app.duration} min
                          </div>
                          <div className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
                            <Building className="h-3 w-3" />
                            <span>{app.clinic_name}</span>
                          </div>
                          {app.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Obs: {app.notes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Não há compromissos agendados para este dia.
                    </div>
                  )}
                </div>
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
