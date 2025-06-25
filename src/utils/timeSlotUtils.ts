
import { format } from 'date-fns';
import { CalendarConfiguration } from '@/hooks/useCalendarConfigurations';

export const generateTimeSlots = (config: CalendarConfiguration): string[] => {
  if (!config.is_open) return [];
  
  const slots: string[] = [];
  const start = new Date(`2000-01-01T${config.start_time}:00`);
  const end = new Date(`2000-01-01T${config.end_time}:00`);
  
  let current = new Date(start);
  while (current < end) {
    const timeString = format(current, 'HH:mm');
    slots.push(timeString);
    current.setMinutes(current.getMinutes() + config.interval_minutes);
  }
  
  return slots;
};
