
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
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Mockup de dados para os compromissos
const mockAppointments = [
  { 
    id: '1', 
    patientName: 'João Silva', 
    date: '2025-04-07', 
    time: '09:00', 
    duration: 60, 
    service: 'Limpeza',
    status: 'confirmed'
  },
  { 
    id: '2', 
    patientName: 'Maria Oliveira', 
    date: '2025-04-07', 
    time: '11:00', 
    duration: 90, 
    service: 'Canal',
    status: 'confirmed'
  },
  { 
    id: '3', 
    patientName: 'Pedro Santos', 
    date: '2025-04-08', 
    time: '10:00', 
    duration: 30, 
    service: 'Avaliação',
    status: 'pending'
  },
  { 
    id: '4', 
    patientName: 'Ana Costa', 
    date: '2025-04-09', 
    time: '14:30', 
    duration: 120, 
    service: 'Implante',
    status: 'confirmed'
  },
];

const AppointmentCalendar: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  // Filtra os compromissos para o dia selecionado
  const dayAppointments = mockAppointments.filter(app => 
    selectedDate && isSameDay(parseISO(app.date), selectedDate)
  );

  // Gera horários para a visualização diária
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Função para renderizar os compromissos do dia
  const renderDayView = () => {
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
                appointment ? "border-dental-400 bg-dental-50" : "border-dashed"
              )}>
                <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{time}</span>
                  </div>
                  {appointment && (
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                      {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  )}
                </CardHeader>
                {appointment ? (
                  <CardContent className="py-2 px-4">
                    <div className="font-medium">{appointment.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.service} - {appointment.duration} min
                    </div>
                  </CardContent>
                ) : (
                  <CardContent className="py-4 px-4 flex justify-center items-center">
                    <Button variant="ghost" className="text-sm">+ Agendar horário</Button>
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
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agenda</CardTitle>
              <CardDescription>
                Gerenciamento de consultas e compromissos
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
              <Button>+ Nova Consulta</Button>
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
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map(app => (
                      <Card key={app.id} className="border-dental-400 bg-dental-50 hover:shadow transition-all">
                        <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{app.time}</span>
                          </div>
                          <Badge variant={app.status === 'confirmed' ? 'default' : 'outline'}>
                            {app.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                        </CardHeader>
                        <CardContent className="py-2 px-4">
                          <div className="font-medium">{app.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.service} - {app.duration} min
                          </div>
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
    </div>
  );
};

export default AppointmentCalendar;
