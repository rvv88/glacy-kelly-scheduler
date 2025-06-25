
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Eye, Calendar as CalendarIcon, List } from 'lucide-react';
import { format, addDays, subDays, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';
import AppointmentDayView from './AppointmentDayView';
import AppointmentListView from './AppointmentListView';

interface AppointmentCalendarContentProps {
  selectedDate: Date | undefined;
  selectedClinicId: string;
  appointments: Appointment[];
  loading: boolean;
  isAdmin: boolean;
  userRole: string | null;
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
  const today = new Date();
  const currentDate = selectedDate || today;

  // Filtrar compromissos por data
  const appointmentsForDate = appointments.filter(appointment => 
    isSameDay(parseISO(appointment.date), currentDate)
  );

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1) 
      : addDays(currentDate, 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(today);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      {/* Controles de Navegação */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Agenda - {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => onViewModeChange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Dia
                    </div>
                  </SelectItem>
                  <SelectItem value="week">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Semana
                    </div>
                  </SelectItem>
                  <SelectItem value="month">
                    <div className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Mês
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onNewAppointment} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {appointmentsForDate.length} agendamento(s)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo da Agenda */}
      {viewMode === 'day' ? (
        <AppointmentDayView
          selectedDate={currentDate}
          selectedClinicId={selectedClinicId}
          appointments={appointmentsForDate}
          isAdmin={isAdmin}
          onNewAppointment={onNewAppointment}
          onConfirmAppointment={onConfirmAppointment}
          onCancelAppointment={onCancelAppointment}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      ) : (
        <AppointmentListView
          appointments={appointmentsForDate}
          isAdmin={isAdmin}
          onConfirmAppointment={onConfirmAppointment}
          onCancelAppointment={onCancelAppointment}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}
    </div>
  );
};

export default AppointmentCalendarContent;
