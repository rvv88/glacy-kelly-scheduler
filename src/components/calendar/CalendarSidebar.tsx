import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { parseISO, isSameDay } from 'date-fns';
import { Appointment } from '@/types/appointment';

interface CalendarSidebarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  appointments: Appointment[];
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedDate,
  onDateSelect,
  appointments,
}) => {
  return (
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
          onSelect={onDateSelect}
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
  );
};

export default CalendarSidebar;
