
import React from 'react';
import AppointmentCalendar from '@/components/calendar/AppointmentCalendar';

const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
      </div>
      <AppointmentCalendar />
    </div>
  );
};

export default CalendarPage;
